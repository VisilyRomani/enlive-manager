<script lang="ts">
	import { page } from '$app/stores';
	import {
		Autocomplete,
		getModalStore,
		type AutocompleteOption,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import Dinero from 'dinero.js';
	import type { PageData } from '../../../routes/(dashboard)/admin/jobs/$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { invalidate } from '$app/navigation';
	export let parent: any;

	const modalStore = getModalStore();

	const data = $page.data as PageData;

	let offsetClientWidth = 0;
	let offsetAddressWidth = 0;
	let offsetTaskWidth = 0;

	let selectTask = { service_name: '', service_id: '', price: 0 };
	let selectedSearch = { label: '', value: '' };
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

	const popupClient: PopupSettings = {
		event: 'focus-click',
		target: 'client-popup',
		placement: 'bottom'
	};
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

	$: clientOptions = data.clientList.map((c) => ({
		label: `${c.first_name} ${c.last_name}`,
		value: c.id,
		meta: c.expand.address.map((a) => ({ label: a.address, value: a.id }))
	}));

	$: addressOptions = clientOptions.find((c) => c.value === selectedSearch.value)?.meta as {
		label: string;
		value: string;
	}[];
	$: taskOptions = data.serviceList.map((s) => ({ value: s.id, label: s.name }));

	const addTask = () => {
		form.update(
			($form) => {
				if (!selectTask.service_name) {
					$errors.task = [...($errors.task ?? []), 'Missing Service Name'];
					return $form;
				}

				if (!selectTask.service_id) {
					$errors.task = [...($errors.task ?? []), 'Missing Service ID'];
					return $form;
				}
				if (selectTask.price < 0) {
					$errors.task = [...($errors.task ?? []), 'Price Must Be Positive'];

					return $form;
				}

				$form.task.set($form.task.size, {
					service_id: selectTask.service_id,
					service_name: selectTask.service_name,
					price: Math.trunc(selectTask.price * 100)
				});
				selectTask = { service_name: '', service_id: '', price: 0 };
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
		<form class="grid lg:grid-cols-2 gap-4" action="?/CreateJob" method="post" use:enhance>
			<div class="flex flex-col justify-between gap-3">
				<input type="text" style="display:none" />
				<div bind:offsetWidth={offsetAddressWidth}>
					<input
						class="input variant-form-material"
						type="search"
						id="client-popup"
						autocomplete="off"
						bind:value={selectedSearch.label}
						use:popup={popupClient}
						placeholder="Select Client"
					/>
					<div data-popup="client-popup" class="w-full z-50">
						<div class="card max-h-60 overflow-auto w-[${offsetClientWidth + 'px'}]">
							<Autocomplete
								bind:input={selectedSearch.label}
								options={clientOptions}
								on:selection={(e) => {
									selectedSearch.label = e.detail.label;
									selectedSearch.value = e.detail.value;
									selectedSearchAddress = { label: '', value: '' };
								}}
							/>
						</div>
					</div>
				</div>
				<div>
					<div bind:offsetWidth={offsetAddressWidth}>
						<input
							class="input variant-form-material h-full {$errors.address
								? 'input-error'
								: undefined}"
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
					</div>
					{#if $errors.address}
						<span class="text-xs text-red-500">{$errors.address}</span>
					{/if}
				</div>
				<textarea class="input variant-form-material" name="notes" placeholder="Notes" />
			</div>
			<div class="h-52 flex justify-between flex-col gap-2">
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th>Service</th>
								<th>Price </th>
							</tr>
						</thead>
						<tbody>
							{#each $form.task || [] as task}
								<tr>
									<td>
										{task[1].service_name}
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
					{#if $errors.task}
						{#each $errors.task as error}
							<span class="text-xs text-red-500">{error}</span>
						{/each}
					{/if}
					<div class="flex flex-row gap-2">
						<div class="w-full" bind:offsetWidth={offsetTaskWidth}>
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
								placeholder="Select Task"
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
							placeholder="Price"
							type="number"
							bind:value={selectTask.price}
						/>
						<button type="button" class="btn variant-form-material" on:click={addTask}>Add</button>
					</div>
				</div>
			</div>
			<footer class="modal-footer float-right">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button type="submit" class="btn {parent.buttonPositive}">Submit Form</button>
			</footer>
		</form>
	</div>
{/if}
