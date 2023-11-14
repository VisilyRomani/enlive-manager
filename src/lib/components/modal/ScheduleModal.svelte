<script lang="ts">
	import {
		Autocomplete,
		SlideToggle,
		getModalStore,
		type PopupSettings,
		popup,
		type AutocompleteOption
	} from '@skeletonlabs/skeleton';
	import Calendar from '../Calendar.svelte';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import type { PageData } from '../../../routes/(dashboard)/admin/schedule/$types';
	import { superForm } from 'sveltekit-superforms/client';
	import type { TJob } from '../../../routes/(dashboard)/admin/schedule/+page.server';
	import { PUBLIC_GOOGLE_MAPS } from '$env/static/public';

	const modalStore = getModalStore();
	let date = dayjs();
	let multiSelect = false;
	const data = $page.data as PageData;
	export let parent: any;

	let userSearch = '';
	let offsetWidth = 0;
	let showFirst = true;

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'userPopup',
		placement: 'bottom'
	};

	const userOptions = data.userList?.map((u) => ({
		value: u.id,
		label: `${u.first_name} ${u.last_name}`
	}));

	let { form, enhance, errors } = superForm(data.scheduleForm, {
		dataType: 'json'
	});
	$: (!!$errors.employee?.length || !!$errors.dates?._errors?.length) && (showFirst = true);

	const userSelect = (e: CustomEvent<AutocompleteOption<string, unknown>>) => {
		errors.update(($errors) => {
			$errors.employee = undefined;
			return $errors;
		});
		form.update(
			($form) => {
				$form.employee.has(e.detail.value)
					? $form.employee.delete(e.detail.value)
					: $form.employee.set(e.detail.value, e.detail.label);
				return $form;
			},
			{ taint: false }
		);
	};

	$: !!$form.dates.length &&
		errors.update(($errors) => {
			$errors.dates = undefined;
			return $errors;
		});

	$: sortedJobs = data.jobList?.sort((a, b) => (a.order > b.order ? 1 : 0));

	$: getWaypoints = () => {
		const JobRef = [...$form.job];
		JobRef.pop();
		if (JobRef.length) {
			return `&waypoints=${encodeURIComponent(
				JobRef.map((j) => {
					return j.expand.address.address;
				}).join('|')
			)}`;
		} else {
			return '';
		}
	};
	$: console.log(getWaypoints());
	$: destinationString = `&destination=${encodeURIComponent($form.job[0]?.expand.address.address)}`;

	const jobSelect = (job: TJob) => {
		form.update(
			($form) => {
				$form.job.push(job);
				// $form.job.has(job.id)
				// 	? $form.job.delete(job.id)
				// 	: $form.job.set(job.id, { ...job, order: $form.job.size });
				return $form;
			},
			{ taint: false }
		);
	};
</script>

{#if $modalStore[0]}
	<form
		class=" w-full lg:w-fit card p-5 flex flex-col gap-3"
		use:enhance
		method="post"
		action="?/createSchedule"
	>
		<h2 class="h2">{$modalStore[0].title}</h2>
		{#if showFirst}
			<div class="ml-auto mr-0">
				<SlideToggle size="sm" name="toggle" bind:checked={multiSelect}
					>Duplicate Schedule
				</SlideToggle>
			</div>
			<div class="grid lg:grid-cols-2 gap-3">
				<div class="space-y-3">
					<input class="input" placeholder="Title" bind:value={$form.title} />
					<div bind:offsetWidth>
						<input
							class="input {$errors.employee ? 'input-error' : undefined}"
							placeholder="Schedule Users"
							name="employee"
							bind:value={userSearch}
							use:popup={popupSettings}
						/>
						{#if $errors.employee}
							<div class="variant-soft-error">
								<span class="text-xs text-error-200 font-bold ml-3">{$errors.employee}</span>
							</div>
						{/if}
						<div data-popup="userPopup" class=" w-full z-50">
							<div class="card max-h-60 overflow-auto w-[${offsetWidth + 'px'}]">
								<Autocomplete
									options={userOptions}
									bind:input={userSearch}
									on:selection={userSelect}
								/>
							</div>
						</div>
					</div>
					<div>
						{#each $form.employee as user}
							<button
								type="button"
								class="chip variant-ghost-primary"
								on:click={() => {
									form.update(($form) => {
										$form.employee.delete(user[0]);
										return $form;
									});
								}}
							>
								{user[1]} 🗙
							</button>
						{/each}
					</div>
				</div>
				<input name="dates" class="hidden" />
				<div>
					<div class={$errors.dates?._errors && 'border-2 border-error-500'}>
						<Calendar {multiSelect} bind:date bind:selectedDates={$form.dates} />
					</div>
					{#if $errors.dates?._errors}
						<div class="variant-soft-error">
							<span class="text-xs text-error-200 font-bold ml-3">{$errors.dates._errors}</span>
						</div>
					{/if}
				</div>
			</div>
			<footer class="modal-footer flex justify-between">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button
					type="button"
					on:click={() => (showFirst = !showFirst)}
					class="btn {parent.buttonPositive}">Next</button
				>
			</footer>
		{:else}
			<div class="flex flex-row justify-between flex-wrap-reverse gap-3">
				<div>
					<ul
						class="gap-3 flex flex-col h-80 overflow-auto {$errors.job &&
							'border-2 border-error-500'}"
					>
						<input name="job" class="hidden" />
						{#each sortedJobs ?? [] as job}
							<button
								type="button"
								class="flex flex-row items-center hover:bg-primary-300 group group-hover:text-primary-900 rounded-md"
								on:click={() => jobSelect(job)}
							>
								<p class="w-3 text-primary-900 font-bold p-2">
									{#if [...$form.job.values()].findIndex((i) => i.id === job.id) !== -1}
										{[...$form.job.values()].find((i) => i.id === job.id)}
									{/if}
								</p>
								<div class="divider-vertical h-9 mx-2" />
								<li value={job.id} class="grid grid-cols-2 text-left">
									<div>
										<h5 class="h4 group-hover:text-primary-900">
											{job.expand.address.expand.client.first_name}
											{job.expand.address.expand.client.last_name} |
											<span class="text-secondary-400 group-hover:text-secondary-700"
												>{job.id.slice(-4)}</span
											>
										</h5>
										<p class="text-gray-400 text-sm group-hover:text-gray-800">
											{job.expand.address.address}
										</p>
									</div>
									<div class="flex flex-wrap flex-row-reverse gap-1 m-1">
										{#each job.expand.task as task}
											<p
												class="w-fit h-fit chip variant-soft-primary group-hover:bg-primary-500 group-hover:text-surface-800"
											>
												{task.expand.service.name}
											</p>
										{/each}
									</div>
								</li>
							</button>
						{/each}
					</ul>
					{#if $errors.job}
						<div class="variant-soft-error">
							<span class="text-xs text-error-200 font-bold ml-3">{$errors.job}</span>
						</div>
					{/if}
				</div>
				<div>
					{#if $form.job.length}
						<iframe
							width="100%"
							height="100%"
							title="GMaps"
							frameborder="0"
							style="border:0"
							referrerpolicy="no-referrer-when-downgrade"
							src="https://www.google.com/maps/embed/v1/directions?key={PUBLIC_GOOGLE_MAPS}
							&mode=driving
							&origin=My+Location
							{destinationString}
							{getWaypoints()}"
							allowfullscreen
						/>
					{/if}
				</div>
			</div>
			<footer class="modal-footer flex justify-between">
				<button class="btn {parent.buttonNeutral}" on:click={() => (showFirst = !showFirst)}
					>Back</button
				>
				<button type="submit" class="btn {parent.buttonPositive}">Create</button>
			</footer>
		{/if}
	</form>
{/if}
