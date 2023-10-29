<script lang="ts">
	import {
		Autocomplete,
		SlideToggle,
		type PopupSettings,
		popup,
		InputChip
	} from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/settings/$types';
	import { superForm } from 'sveltekit-superforms/client';
	export let data: PageData;

	const { form, enhance, errors } = superForm(data.serviceForm, {
		dataType: 'json',
		resetForm: true
	});
	const popupClient: PopupSettings = {
		event: 'focus-blur',
		target: 'tax-popup',
		placement: 'bottom'
	};
	let selectSearch = { label: '', value: '' };
	let offsetWidth = 0;
	$: search = `card max-h-60 overflow-auto w-[${offsetWidth + 'px'}] `;
	$: taxOptions = data.taxes.map((t) => ({ label: `${t.name} - ${t.percent}%`, value: t.id }));
	$: tax = $form.tax.flatMap((t) => {
		return t.label;
	});
</script>

<h2 class="h2">Services Settings</h2>
<form class="flex gap-3 my-4 z-0" use:enhance method="post" action="?/createService">
	<div class="w-full">
		<input
			class="input variant-form-material {$errors.name ? 'input-error' : undefined}"
			autocapitalize="characters"
			name="name"
			placeholder="Service name"
			bind:value={$form.name}
		/>
		{#if $errors.name}
			<span class="text-xs text-red-500">{$errors.name}</span>{/if}
	</div>
	<div class="w-full" bind:offsetWidth>
		<div use:popup={popupClient}>
			<InputChip
				bind:value={tax}
				name="tax"
				bind:input={selectSearch.label}
				on:remove={(e) => {
					form.update(
						($form) => {
							$form.tax = $form.tax.filter((t) => !(t.label === e.detail.chipValue));
							return $form;
						},
						{ taint: false }
					);
				}}
				autocomplete="off"
				class="input variant-form-material {$errors.tax ? 'input-error' : undefined}"
				placeholder="Tax"
			/>
		</div>

		<div data-popup="tax-popup" class="w-full z-50">
			<div class={search}>
				<Autocomplete
					bind:input={selectSearch.label}
					options={taxOptions}
					on:selection={(e) => {
						form.update(
							($form) => {
								if (!$form.tax.find((t) => t.value === e.detail.value)) {
									$form.tax.push({ label: e.detail.label, value: e.detail.value });
								}
								return $form;
							},
							{ taint: false }
						);
					}}
				/>
			</div>
		</div>
		{#if $errors.tax?._errors}
			{#each $errors.tax._errors as error}
				<span class="text-xs text-red-500">{error}</span>
			{/each}
		{/if}
	</div>
	<div>
		<button class="btn variant-form-material">Submit</button>
	</div>
</form>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Tax </th>
				<th>Active</th>
			</tr>
		</thead>
		<tbody>
			{#each data.services as row, i}
				<tr>
					<td class="font-bold">{row.name}</td>
					<td class="font-bold">
						<div class="flex flex-col">
							{#each row.expand.tax as t}
								<p>
									{t.name} - {t.percent}%
								</p>
							{/each}
						</div>
					</td>
					<td
						><SlideToggle
							class="static z-0"
							name="slide"
							bind:checked={row.active}
							on:change={(e) => {
								console.log(row.id);
							}}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
