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
	import type { Dayjs } from 'dayjs';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import type { PageData } from '../../../routes/(dashboard)/admin/schedule/$types';
	import { superForm } from 'sveltekit-superforms/client';
	import type { TJob } from '../../../routes/(dashboard)/admin/schedule/+page.server';

	const modalStore = getModalStore();
	let date = dayjs();
	let multiSelect = false;
	const data = $page.data as PageData;
	export let parent: any;

	let userSearch = '';
	let offsetWidth = 0;

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'userPopup',
		placement: 'bottom'
	};

	let items = new Map<string, any>();
	let selectedUsers = new Map<string, string>();

	const userOptions = data.userList?.map((u) => ({
		value: u.id,
		label: `${u.first_name} ${u.last_name}`
	}));

	let { form, enhance, errors } = superForm(data.scheduleForm, {
		dataType: 'json'
	});

	const userSelect = (e: CustomEvent<AutocompleteOption<string, unknown>>) => {
		if (selectedUsers.has(e.detail.value)) {
			selectedUsers.delete(e.detail.value);
		} else {
			selectedUsers.set(e.detail.value, e.detail.label);
		}
		selectedUsers = selectedUsers;

		errors.update(($errors) => {
			$errors.employee = undefined;
			return $errors;
		});
		form.update(
			($form) => {
				$form.employee = [...selectedUsers.keys()];
				return $form;
			},
			{ taint: false }
		);
	};

	const dateSelect = (e: CustomEvent<{ dates: Dayjs[] }>) => {
		errors.update(($errors) => {
			$errors.dates = undefined;
			return $errors;
		});
		form.update(
			($form) => {
				$form.dates = e.detail.dates.map((d) => d.toDate());
				return $form;
			},
			{ taint: false }
		);
	};
	const jobSelect = (job: TJob) => {
		form.update(
			($form) => {
				$form.job.has(job.id) ? $form.job.delete(job.id) : $form.job.set(job.id, job);
				console.log($form);
				return $form;
			},
			{ taint: false }
		);
	};
</script>

{#if $modalStore[0]}
	<form
		class="w-modal card p-3 flex flex-col gap-3"
		use:enhance
		method="post"
		action="?/createSchedule"
	>
		<h2 class="h2">{$modalStore[0].title}</h2>
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
						class="input {$errors.employee?._errors ? 'input-error' : undefined}"
						placeholder="Schedule Users"
						name="employee"
						bind:value={userSearch}
						use:popup={popupSettings}
					/>
					{#if $errors.employee?._errors}
						<div class="variant-soft-error">
							<span class="text-xs text-error-200 font-bold ml-3">{$errors.employee._errors}</span>
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
					{#each selectedUsers as user}
						<button
							type="button"
							class="chip variant-ghost-primary"
							on:click={() => {
								selectedUsers.delete(user[0]);
								selectedUsers = selectedUsers;
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
					<Calendar {multiSelect} bind:date on:selection={dateSelect} />
				</div>
				{#if $errors.dates?._errors}
					<div class="variant-soft-error">
						<span class="text-xs text-error-200 font-bold ml-3">{$errors.dates._errors}</span>
					</div>
				{/if}
			</div>
		</div>

		<hr />
		<div>
			<ul
				class="gap-3 flex flex-col h-80 overflow-auto {$errors.job && 'border-2 border-error-500'}"
			>
				<input name="job" class="hidden" />
				{#each $page.data.jobList as job}
					<button
						type="button"
						class="flex flex-row items-center hover:bg-primary-300 group group-hover:text-primary-900 rounded-md {$form.job.has(
							job.id
						) && '!bg-primary-200'}"
						on:click={() => jobSelect(job)}
					>
						<p class="w-3 text-primary-900 font-bold p-2">
							{#if [...$form.job.values()].findIndex((i) => i.id === job.id) !== -1}
								{[...$form.job.values()].findIndex((i) => i.id === job.id) + 1}
							{/if}
						</p>
						<div class="divider-vertical h-9 mx-2" />
						<li value={job.id} class="grid grid-cols-2 text-left">
							<div>
								<h5
									class="h4 group-hover:text-primary-900
                            {$form.job.has(job.id) && 'text-primary-900'}"
								>
									{job.expand.address.expand.client.first_name}
									{job.expand.address.expand.client.last_name} |
									<span
										class="text-secondary-400 group-hover:text-secondary-700 {$form.job.has(
											job.id
										) && '!text-secondary-800'}">{job.id.slice(-4)}</span
									>
								</h5>
								<p
									class="text-gray-400 text-sm group-hover:text-gray-800 {$form.job.has(job.id) &&
										'text-gray-800'}"
								>
									{job.expand.address.address}
								</p>
							</div>
							<div class="flex flex-wrap flex-row-reverse gap-1 m-1">
								{#each job.expand.task as task}
									<p
										class="w-fit h-fit chip variant-soft-primary group-hover:bg-primary-500 group-hover:text-surface-800 {$form.job.has(
											job.id
										) && ' !bg-primary-500 !text-surface-800'}"
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

		<footer class="modal-footer float-right">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="submit" class="btn {parent.buttonPositive}">Create</button>
		</footer>
	</form>
{/if}
