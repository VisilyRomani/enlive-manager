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
	import { superForm } from 'sveltekit-superforms';
	import type { TJob } from '../../../routes/(dashboard)/admin/schedule/+page.server';
	import { PUBLIC_GOOGLE_MAPS } from '$env/static/public';
	import { onMount } from 'svelte';
	import { nearestJob } from '$lib/helper/LocationHelper';
	import { invalidate } from '$app/navigation';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEventInfo } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	const modalStore = getModalStore();
	let date = dayjs();
	let multiSelect = false;
	let userSearch = '';
	let offsetWidth = 0;
	let showFirst = true;
	let address = '';
	const data = $page.data as PageData;
	const { form, enhance, errors } = superForm(data.scheduleForm, {
		dataType: 'json',
		onResult: async (res) => {
			res.result.type === 'success' && modalStore.close();
			await invalidate('/admin/schedule');
		}
	});

	export let parent: any;
	let startLocation: { lat: number; lng: number };

	onMount(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				startLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
			},
			(err) => {
				console.error(err.message);
			}
		);

		const autoCompleteInput = document.getElementById('auto-complete-input') as HTMLInputElement;
		let googlePlaces = new google.maps.places.Autocomplete(autoCompleteInput, {
			types: ['address'],
			componentRestrictions: { country: 'ca' },
			fields: ['geometry', 'formatted_address']
		});
		googlePlaces.addListener('place_changed', () => {
			const place = googlePlaces.getPlace();
			if (place.geometry?.location?.lat() && place.geometry?.location?.lng())
				startLocation = {
					lat: place.geometry?.location?.lat(),
					lng: place.geometry?.location?.lng()
				};
		});
	});

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'userPopup',
		placement: 'bottom'
	};

	const userOptions = data.userList?.map((u) => ({
		value: u.id,
		label: `${u.first_name} ${u.last_name}`
	}));

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

	const jobSelect = (job: TJob) => {
		form.update(
			($form) => {
				const jobElem = $form.job.find((j) => job.id === j.id);
				if (jobElem) {
					$form.job = $form.job.filter((j) => !(j.id === jobElem.id));
				} else {
					$form.job.push(job);
				}
				$form.job = $form.job.map((j, idx) => ({ ...j, order: idx + 1 }));
				return $form;
			},
			{ taint: false }
		);
	};

	const sortJobForm = () => {
		form.update(
			($form) => {
				const sortedResult: TJob[] = [];

				const firstJob = nearestJob(
					$form.job as TJob[],
					{
						expand: {
							address: { lat: startLocation.lat, lng: startLocation.lng }
						}
					} as TJob
				);

				if (firstJob) {
					sortedResult.push({ ...firstJob, order: sortedResult.length + 1 });
					$form.job = $form.job.filter((j) => j.id !== firstJob.id);
				} else {
					console.error('failed to find fist elem');
					return $form;
				}

				while ($form.job.length > 0) {
					const lastSorted = sortedResult.at(-1);
					if (lastSorted) {
						const closestJob = nearestJob($form.job as TJob[], lastSorted);
						if (closestJob) {
							sortedResult.push({
								...closestJob,
								order: sortedResult.length + 1
							});
							$form.job = $form.job.filter((j) => j.id !== closestJob.id);
						}
					} else {
						console.error('failed to find last closest elem');
						return $form;
					}
				}
				$form.job = sortedResult;
				return $form;
			},
			{ taint: false }
		);
	};

	$: (!!$errors.employee?.length || !!$errors.dates?._errors?.length || !!$errors.title) &&
		(showFirst = true);

	$: !!$form.dates.length &&
		errors.update(($errors) => {
			$errors.dates = undefined;
			return $errors;
		});

	$: !!$form.job.length &&
		errors.update(($errors) => {
			$errors.job = undefined;
			return $errors;
		});

	$: jobList = [...data.jobList?.filter((d) => !$form.job.find((j) => j.id === d.id))] as TJob[];

	$: selectedJobs = $form.job as TJob[];

	$: checkSortDisable =
		!$form.job.length ||
		!!($form.job as TJob[]).find((j) => !j.expand.address.lat || !j.expand.address.lng);

	$: googleEmbeddedParams = () => {
		const JobRef = [...$form.job];
		const lastJob = JobRef.pop();
		if (JobRef.length) {
			return (
				`&destination=${encodeURIComponent(lastJob?.expand.address.address ?? '')}` +
				`&waypoints=${encodeURIComponent(
					JobRef.map((j) => {
						return j.expand.address.address;
					}).join('|')
				)}`
			);
		} else {
			return `&destination=${encodeURIComponent(lastJob?.expand.address.address ?? '')}`;
		}
	};

	const handleDndConsider = (e: CustomEvent<{ items: TJob[]; info: DndEventInfo }>) => {
		form.update(($form) => {
			$form.job = e.detail.items.map((j, idx) => ({ ...j, order: idx + 1 }));
			return $form;
		});
	};
	const handleDndFinalize = (e: CustomEvent<{ items: TJob[]; info: DndEventInfo }>) => {
		form.update(($form) => {
			$form.job = e.detail.items.map((j, idx) => ({ ...j, order: idx + 1 }));
			return $form;
		});
	};
</script>

{#if $modalStore[0]}
	<div class="lg:w-modal-wide min-h-full max-w-[100%] w-full">
		<form
			class=" w-full h-full card p-5 flex flex-col gap-3"
			use:enhance
			method="post"
			action="?/createSchedule"
		>
			<h2 class="h2">{$modalStore[0].title}</h2>
			<input
				id="auto-complete-input"
				type="search"
				hidden={showFirst}
				name="addr"
				class="input"
				placeholder="Starting Address"
				bind:value={address}
			/>
			{#if showFirst}
				<div class="ml-auto mr-0">
					<SlideToggle size="sm" name="toggle" bind:checked={multiSelect}
						>Duplicate Schedule
					</SlideToggle>
				</div>
				<div class="grid lg:grid-cols-2 gap-3">
					<div class="space-y-3">
						<div>
							<input
								class="input {$errors.title && 'input-error'}"
								placeholder="Title"
								bind:value={$form.title}
							/>
							{#if $errors.title}
								<div class="variant-soft-error">
									<span class="text-xs text-error-200 font-bold ml-3">{$errors.title}</span>
								</div>
							{/if}
						</div>
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
					<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}
						>{parent.buttonTextCancel}</button
					>
					<button
						type="button"
						on:click={() => (showFirst = !showFirst)}
						class="btn {parent.buttonPositive}">Next</button
					>
				</footer>
			{:else}
				<div class="grid {$form.job.length && 'lg:grid-cols-2'} gap-3">
					<div>
						<ul
							class="gap-3 flex flex-col h-80 overflow-auto {$errors.job &&
								'border-2 border-error-500'}"
						>
							<input name="job" class="hidden" />

							{#if jobList.length || selectedJobs.length}
								<section
									class="gap-3 flex flex-col"
									use:dndzone={{ items: selectedJobs }}
									on:consider={handleDndConsider}
									on:finalize={handleDndFinalize}
								>
									{#each selectedJobs as job (job.id)}
										<button
											animate:flip={{ duration: 300 }}
											type="button"
											class="flex flex-row items-center w-full group rounded-md bg-primary-300"
											on:click={() => jobSelect(job)}
										>
											<p class="w-3 text-primary-900 font-bold p-2">
												{#if job.order}
													{job.order}
												{/if}
											</p>
											<div class="divider-vertical h-9 mx-2" />
											<li value={job.id} class="grid grid-cols-2 text-left w-full">
												<div>
													<h5 class="h4 text-primary-900">
														{job.expand.address.expand.client.first_name}
														{job.expand.address.expand.client.last_name} |
														<span class="text-secondary-700">
															{job.id.slice(-4)}
														</span>
													</h5>
													<p class="text-sm text-gray-700">
														{job.expand.address.address}
													</p>
												</div>
												<div class="flex flex-wrap flex-row-reverse gap-1 m-1">
													{#each job.expand.task as task}
														<p
															class="w-fit h-fit chip variant-soft-primary group-hover:bg-primary-500 group-hover:text-surface-800 {job.order &&
																'!bg-primary-500 !text-surface-800'}"
														>
															{task.expand.service.name}
														</p>
													{/each}
												</div>
											</li>
										</button>
									{/each}
								</section>
								{#if selectedJobs.length}
									<hr />
								{/if}
								{#each jobList as job}
									<button
										type="button"
										class="flex flex-row items-center w-full md:hover:bg-primary-300 group rounded-md
			"
										on:click={() => jobSelect(job)}
									>
										<div class="divider-vertical h-9 mx-2" />
										<li value={job.id} class="grid grid-cols-2 text-left w-full">
											<div>
												<h5 class="h4 md:group-hover:text-primary-900">
													{job.expand.address.expand.client.first_name}
													{job.expand.address.expand.client.last_name} |
													<span class="text-secondary-400 md:group-hover:text-secondary-700">
														{job.id.slice(-4)}
													</span>
												</h5>
												<p class="text-gray-400 text-sm md:group-hover:text-gray-800">
													{job.expand.address.address}
												</p>
											</div>
											<div class="flex flex-wrap flex-row-reverse gap-1 m-1">
												{#each job.expand.task as task}
													<p
														class="w-fit h-fit chip variant-soft-primary md:group-hover:bg-primary-500 md:group-hover:text-surface-800"
													>
														{task.expand.service.name}
													</p>
												{/each}
											</div>
										</li>
									</button>{/each}
							{:else}
								<div class="flex justify-center items-center flex-col h-full">
									<p class="text-center text-3xl font-bold">No Jobs Found</p>
									<p class="text-center text-primary-500-400-token">
										Please create a job to scheudle
									</p>
								</div>
							{/if}
						</ul>
						{#if $errors.job}
							<div class="variant-soft-error">
								<span class="text-xs text-error-200 font-bold ml-3">{$errors.job._errors}</span>
							</div>
						{/if}
					</div>
					{#if $form.job.length}
						<div class="w-full min-h-[300px]">
							<iframe
								width="100%"
								height="100%"
								title="GMaps"
								frameborder="0"
								style="border:0"
								referrerpolicy="no-referrer-when-downgrade"
								allowfullscreen
								src="https://www.google.com/maps/embed/v1/directions?key={PUBLIC_GOOGLE_MAPS}
							&mode=driving
							{startLocation ? `&origin=${startLocation.lat},${startLocation.lng}` : '&origin=Current%20Location'}
							{googleEmbeddedParams()}"
							/>
						</div>
					{/if}
				</div>
				<footer class="modal-footer flex justify-between gap-6">
					<button
						type="button"
						class="btn {parent.buttonNeutral} h-fit self-center"
						on:click={() => (showFirst = true)}>Back</button
					>
					<div class=" flex lg:flex-row flex-col gap-3">
						<button
							type="button"
							disabled={checkSortDisable}
							class="btn {parent.buttonPositive} "
							on:click={sortJobForm}>Sort Location</button
						>
						<button
							type="submit"
							disabled={!selectedJobs.length}
							class="btn {parent.buttonPositive}">Create</button
						>
					</div>
				</footer>
			{/if}
		</form>
	</div>
{/if}
