<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../../../routes/(dashboard)/admin/jobs/[slug]/edit/$types';
	const data = $page.data as PageData;
	$: console.log(data);
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const { form, errors, enhance } = superForm(data.addTask, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalStore.close();
				toastStore.trigger({ message: 'Added task to job!', background: 'bg-success-500' });
			}
		}
	});

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<form class="flex gap-3 flex-col" use:enhance method="post" action="?/addTask">
			<input name="company" value={data.user?.company} hidden />
			<input name="job_id" value={data.job.id} hidden />
			{#if $errors.company}
				<span class="text-xs text-red-500">{$errors.company}</span>{/if}
			{#if $errors.job_id}
				<span class="text-xs text-red-500">{$errors.job_id}</span>{/if}

			<select name="service" placeholder="Service" class="select variant-outline-primary">
				{#each data.services as service}
					<option value={service.id}>{service.name}</option>
				{/each}
			</select>

			<div class="flex gap-3">
				<div class="w-full">
					<input
						class="input variant-form-material {$errors.count ? 'input-error' : undefined}"
						placeholder="Count"
						bind:value={$form.count}
						name="count"
						type="number"
					/>

					{#if $errors.count}
						<span class="text-xs text-red-500">{$errors.count}</span>{/if}
				</div>
				<div class="w-full">
					<input
						class="input variant-form-material {$errors.price ? 'input-error' : undefined}"
						placeholder="Price"
						name="price"
						bind:value={$form.price}
						type="number"
						step=".01"
					/>
					{#if $errors.price}
						<span class="text-xs text-red-500">{$errors.price}</span>{/if}
				</div>
			</div>
			<div class="flex gap-3 justify-between">
				<button type="button" class="btn variant-ghost-primary" on:click={() => modalStore.close()}
					>Cancel</button
				>
				<button class="btn variant-ghost-success">Submit</button>
			</div>
		</form>
	</div>
{/if}
