<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../../routes/(dashboard)/admin/schedule/[slug]/$types';
	import Calendar from '../Calendar.svelte';
	import dayjs from 'dayjs';
	const data = $page.data as PageData;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let selectedDates: Date[] = [];

	$: selectedDates,
		form.update(
			($form) => {
				$form.duplicated_dates = selectedDates.map((d) => dayjs(d).format('M/D/YYYY'));
				return $form;
			},
			{ taint: false }
		);
	const { form, errors, enhance } = superForm(data.DuplicateSchedule, {
		dataType: 'json',
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
			<input hidden name="schedule_id" bind:value={$form.schedule_id} />
			<input hidden name="duplicated_dates" />

			<Calendar
				multiSelect
				bind:selectedDates
				disabledDates={[dayjs($modalStore[0].meta).toDate()]}
			/>

			<div class="flex justify-between">
				<button
					type="button"
					on:click={() => {
						modalStore.close();
					}}
					class="btn variant-ghost-primary">Close</button
				>
				<button class="btn variant-ghost-success">Submit</button>
			</div>
		</form>
	</div>
{/if}
