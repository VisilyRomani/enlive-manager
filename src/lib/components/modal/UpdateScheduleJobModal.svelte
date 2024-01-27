<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../../../routes/(dashboard)/app/daily/[slug]/$types';
	import { invalidateAll } from '$app/navigation';
	const data = $page.data as PageData;
	const modalStore = getModalStore();

	const { form, errors, enhance } = superForm(data.nextJobForm, {
		warnings: { duplicateId: false },
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalStore.close();
				invalidateAll();
			}
		}
	});

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<form class="flex gap-3 flex-col" use:enhance method="post" action="?/updateScheudleJob">
			<input hidden name="job_id" type="text" bind:value={$form.job_id} />
			<input hidden name="schedule_id" type="text" bind:value={$form.schedule_id} />

			<select bind:value={$form.status} name="status" class="input variant-outline-primary">
				<option value="CANCELED"> Cancel </option>
				<option value="RESCHEDULE"> Rescheudle </option>
			</select>
			<textarea
				class="input variant-outline-primary"
				placeholder="Description"
				bind:value={$form.update_description}
				name="update_description"
			/>
			<div class="flex justify-between">
				<button
					type="button"
					on:click={() => modalStore.close()}
					class="btn variant-outline-primary"
				>
					Cancel
				</button>
				<button class="btn variant-outline-success"> Save </button>
			</div>
		</form>
	</div>
{/if}
