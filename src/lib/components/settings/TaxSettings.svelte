<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/settings/$types';
	import { superForm } from 'sveltekit-superforms';
	export let data: PageData;

	const { form, enhance, errors } = superForm(data.taxForm, {
		resetForm: true
	});
</script>

<h2 class="h2">Tax Settings</h2>
<form class="flex gap-3 my-4" use:enhance method="post" action="?/createTax">
	<div class="w-full">
		<input
			class="input variant-form-material {$errors.name ? 'input-error' : undefined}"
			name="name"
			placeholder="Tax name"
			bind:value={$form.name}
		/>
		{#if $errors.name}
			<span class="text-xs text-red-500">{$errors.name}</span>{/if}
	</div>
	<div class="w-full">
		<input
			class="input variant-form-material {$errors.percent ? 'input-error' : undefined}"
			placeholder="percent"
			name="percent"
			bind:value={$form.percent}
		/>
		{#if $errors.percent}
			<span class="text-xs text-red-500">{$errors.percent}</span>{/if}
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
				<th>Percent</th>
				<th>Active</th>
			</tr>
		</thead>
		<tbody>
			{#each data.taxes ?? [] as row, i}
				<tr>
					<td class="font-bold">{row.name}</td>
					<td class="font-bold">{row.percent}%</td>
					<td
						><SlideToggle
							name="slide"
							bind:checked={row.active}
							on:change={(e) => {
								// TODO: update active status
								// console.log(row.id);
							}}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
