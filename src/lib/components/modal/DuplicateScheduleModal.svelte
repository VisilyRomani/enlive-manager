<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../../routes/(dashboard)/admin/schedule/[slug]/$types';
	const data = $page.data as PageData;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const { form, errors, enhance } = superForm(data.DuplicateSchedule, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalStore.close();
				toastStore.trigger({ message: 'Duplication Successfull!', background: 'bg-success-500' });
			} else {
				toastStore.trigger({ message: JSON.stringify($errors), background: 'bg-error-500' });
			}
		}
	});
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<form class="flex gap-3 flex-col" use:enhance method="post" action="?/duplicateSchedule">
			<input hidden name="schedule_id" />
			<div />
		</form>
	</div>
{/if}
