<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import dayjs from 'dayjs';
	import type { PageData } from '../../../routes/(dashboard)/admin/schedule/[slug]/$types';
	const data = $page.data as PageData;
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const {
		form: detailsForm,
		enhance: detailsEnhance,
		errors: detailsErrors
	} = superForm(data.EditScheduleDetails, {
		onSubmit: ({ formData }) => {
			const date = formData.get('scheduled_date');
			const selectedDate = dayjs(String(date))
				.set('hour', new Date().getHours())
				.set('minute', new Date().getMinutes())
				.set('second', new Date().getSeconds())
				.toDate();
			formData.set('scheduled_date', selectedDate.toUTCString());
		},
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({
					message: 'Successfully updated schedule',
					background: 'bg-success-500'
				});
				modalStore.close();
			}
		}
	});

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<div class="absolute left-0 top-0">
	<!-- <SuperDebug data={$detailsForm} /> -->
</div>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		{#if $modalStore[0].meta === 'Details'}
			<form class="flex flex-col gap-3" action="?/editDetails" method="post" use:detailsEnhance>
				<input bind:value={$detailsForm.id} hidden name="id" />
				<div>
					<input
						class="input variant-outline-primary"
						name="title"
						placeholder="Title"
						bind:value={$detailsForm.title}
					/>
					{#if $detailsErrors.title}
						<span class="text-xs text-red-500">{$detailsErrors.title}</span>{/if}
				</div>
				<div>
					<input
						type="date"
						class="input variant-outline-primary"
						name="scheduled_date"
						placeholder="Schedule date"
						value={dayjs($detailsForm.scheduled_date).format('YYYY-MM-DD')}
					/>
					{#if $detailsErrors.scheduled_date}
						<span class="text-xs text-red-500">{$detailsErrors.scheduled_date}</span>{/if}
				</div>

				<div class="flex justify-between">
					<button
						type="button"
						on:click={() => modalStore.close()}
						class="btn variant-ghost-primary">Close</button
					>
					<button class="btn variant-ghost-success">Submit</button>
				</div>
			</form>
		{:else if $modalStore[0].meta === 'Employee'}
			ttt
		{:else if $modalStore[0].meta === 'Jobs'}
			tes
		{/if}
	</div>
{/if}
