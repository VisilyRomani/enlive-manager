<script lang="ts">
	import { page } from '$app/stores';
	import {
		Autocomplete,
		getModalStore,
		type PopupSettings,
		popup,
		SlideToggle
	} from '@skeletonlabs/skeleton';
	import Dinero from 'dinero.js';
	import type { PageData } from '../../../routes/(dashboard)/admin/jobs/$types';
	import { superForm } from 'sveltekit-superforms';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	export let parent: any;

	interface IOptionType {
		label: string;
		value: string;
	}
	const modalStore = getModalStore();

	onMount(() => {
		const autoCompleteInput = document.getElementById('auto-complete-input') as HTMLInputElement;
		let googlePlaces = new google.maps.places.Autocomplete(autoCompleteInput, {
			types: ['address'],
			componentRestrictions: { country: 'ca' },
			fields: ['geometry', 'formatted_address']
		});
		googlePlaces.addListener('place_changed', () => {
			const place = googlePlaces.getPlace();

			if (place.geometry?.location?.lat() && place.geometry?.location?.lng()) {
				form.update(
					($form) => {
						$form.lat = place.geometry?.location?.lat();
						$form.lng = place.geometry?.location?.lng();
						$form.address = place?.formatted_address ?? $form.address;
						return $form;
					},
					{ taint: false }
				);
			}
		});
	});

	const data = $page.data as PageData;

	let offsetAddressWidth = 0;
	let offsetTaskWidth = 0;

	let selectTask = { service_name: '', service_id: '', price: '', count: '' };
	let selectedSearchAddress = { label: '', value: '' };

	const { form, errors, enhance } = superForm(data.jobForm, {
		dataType: 'json',
		resetForm: true,
		async onResult(event) {
			if (event.result.type === 'success') {
				modalStore.close();
				await invalidate('/admin/job');
			}
		}
	});

	const popupAddress: PopupSettings = {
		event: 'focus-click',
		target: 'address-popup',
		placement: 'bottom'
	};
	const popupTask: PopupSettings = {
		event: 'focus-click',
		target: 'task-popup',
		placement: 'bottom'
	};

	$: addressOptions = data.clientList.reduce((acc, cur) => {
		let test = cur.expand?.['address(client)'].flatMap((a) => {
			return { label: a.address, value: a.id };
		});
		acc = [...acc, ...test];
		return acc;
	}, [] as IOptionType[]);
	$: taskOptions = data.serviceList?.map((s) => ({ value: s.id, label: s.name })) ?? [];
	const addTask = () => {
		form.update(
			($form) => {
				if (!selectTask.service_name) {
					$errors.task = ['Missing Service Name'];
					return $form;
				}

				if (!selectTask.service_id) {
					$errors.task = ['Missing Service ID'];
					return $form;
				}
				if (+selectTask.price < 0) {
					$errors.task = ['Price Must Be Positive'];
					return $form;
				}
				if (+selectTask.count < 0) {
					$errors.task = ['Count Must Be Positive'];
					return $form;
				}

				$form.task.set($form.task.size, {
					service_id: selectTask.service_id,
					service_name: selectTask.service_name,
					count: isNaN(parseInt(selectTask.count)) ? 1 : parseInt(selectTask.count),
					price: Math.trunc(+selectTask.price * 100)
				});
				selectTask = { service_name: '', service_id: '', price: '', count: '' };
				$errors.task = undefined;
				return $form;
			},
			{ taint: false }
		);
	};
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal max-w-4xl shadow-xl space-y-4">
		<h2 class="h2">{$modalStore[0].title}</h2>
		<form class="space-y-4" action="?/CreateJob" method="post" use:enhance>
			<div class="grid lg:grid-cols-2 gap-4">
				<div class="flex flex-col gap-3">
					<div>
						<SlideToggle
							name="new_client"
							bind:checked={$form.new_client}
							on:change={() => {
								form.update(
									($form) => {
										$form.address = '';
										return $form;
									},
									{ taint: false }
								);
							}}
							size="sm">New Client</SlideToggle
						>
						<input
							class={`input variant-form-material  ${!$form.new_client ? 'hidden' : ''}`}
							placeholder="New Address"
							name="address"
							id="auto-complete-input"
							bind:value={$form.address}
						/>
						<input hidden name="lat" bind:value={$form.lat} />
						<input hidden name="lng" bind:value={$form.lng} />
						<div bind:offsetWidth={offsetAddressWidth}>
							<input
								class="input variant-form-material
								{$errors.address ? 'input-error' : undefined}  
									{$form.new_client ? 'hidden' : ''}"
								type="search"
								autocomplete="off"
								id="address-popup"
								name="address"
								bind:value={selectedSearchAddress.label}
								use:popup={popupAddress}
								placeholder="Select Address"
							/>
							<div data-popup="address-popup" class="w-full z-50">
								<div class="card max-h-60 overflow-auto w-[${offsetAddressWidth + 'px'}]">
									<Autocomplete
										class={$form.new_client ? 'hidden' : ''}
										bind:input={selectedSearchAddress.label}
										options={addressOptions}
										on:selection={(e) => {
											form.update(($form) => {
												$form.address = e.detail.value;
												return $form;
											});
											selectedSearchAddress.value = e.detail.value;
											selectedSearchAddress.label = e.detail.label;
										}}
									/>
								</div>
							</div>
							{#if $errors.address}
								<span class="text-xs text-red-500">{$errors.address}</span>
							{/if}
						</div>
					</div>
					<textarea
						class="input variant-form-material"
						name="notes"
						placeholder="Notes"
						bind:value={$form.notes}
					/>
				</div>
				<div class="h-72 flex justify-between flex-col gap-2">
					<div class="table-container">
						<table class="table">
							<thead>
								<tr>
									<th>Service</th>
									<th>Count</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody>
								{#each $form.task || [] as task}
									<tr>
										<td>
											{task[1].service_name}
										</td>
										<td>
											{task[1].count}
										</td>

										<td>
											{Dinero({ amount: task[1].price }).toFormat('$0.00')}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="flex flex-col">
						{#if $errors.task?.length}
							{#each $errors.task as error}
								<span class="text-xs text-red-500">{error}</span>
							{/each}
						{/if}
						<div class="grid grid-cols-3 gap-2">
							<div class="w-full col-span-3" bind:offsetWidth={offsetTaskWidth}>
								<input
									class="input variant-form-material h-full {$errors.task
										? 'input-error'
										: undefined}"
									type="search"
									name="task"
									autocomplete="off"
									id="task-popup"
									bind:value={selectTask.service_name}
									use:popup={popupTask}
									placeholder="Select Service"
								/>
								<div data-popup="task-popup" class="w-full z-50">
									<div class="card max-h-60 overflow-auto w-[${offsetTaskWidth + 'px'}]">
										<Autocomplete
											bind:input={selectTask.service_name}
											options={taskOptions}
											on:selection={(e) => {
												selectTask.service_name = e.detail.label;
												selectTask.service_id = e.detail.value;
											}}
										/>
									</div>
								</div>
							</div>
							<input
								class="input variant-form-material {$errors.task ? 'input-error' : undefined}"
								placeholder="Count"
								type="number"
								bind:value={selectTask.count}
							/>

							<input
								class="input variant-form-material {$errors.task ? 'input-error' : undefined}"
								placeholder="Price"
								type="number"
								bind:value={selectTask.price}
							/>
							<button type="button" class="btn variant-form-material" on:click={addTask}>Add</button
							>
						</div>
					</div>
				</div>
			</div>

			<footer class="flex justify-between col-span-2">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button type="submit" class="btn {parent.buttonPositive}">Create Job</button>
			</footer>
		</form>
	</div>
{/if}
