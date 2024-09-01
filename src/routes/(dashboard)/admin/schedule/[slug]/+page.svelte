<script lang="ts">
	import up from '$lib/photos/up.svg?raw';
	import down from '$lib/photos/down.svg?raw';
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { statusColor } from '$lib/helper/StyleHelper';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	export let data: PageData;
	import Trash from '$lib/photos/trash.svelte';
	import Info from '$lib/photos/info.svelte';
	import { superForm } from 'sveltekit-superforms';
	const toastStore = getToastStore();

	const modalStore = getModalStore();
	const { form, enhance, errors } = superForm(data.OrderScheduleJob, {
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'error') {
				toastStore.trigger({
					message: 'Error: failed to change job order',
					background: 'bg-error-500'
				});
			}
		}
	});
	const {
		form: deleteForm,
		enhance: deleteFormEnhance,
		errors: deleteFormErrors
	} = superForm(data.DeleteScheduleJobs, {
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'error') {
				toastStore.trigger({
					message: 'Error: failed to delete job',
					background: 'bg-error-500'
				});
			}
		}
	});

	const DuplicateSchedule = () => {
		modalStore.trigger({
			type: 'component',
			component: 'DuplicateScheduleModal',
			title: 'Duplicate Schedule',
			meta: data.schedule.schedule_date
		});
	};
</script>

<div class="flex flex-row">
	<ol class="breadcrumb mx-3 px-3">
		<li class="crumb">
			<a class="anchor" href="/admin/schedule">
				<h3 class="h3">Schedule</h3>
			</a>
		</li>
		<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
		<li>
			<h3 class="h3">
				{data.schedule.title}
			</h3>
		</li>
	</ol>
	<button type="button" class="btn variant-ghost-primary m-3" on:click={DuplicateSchedule}
		>Duplicate</button
	>
</div>
<div class="grid lg:grid-cols-2">
	<div class="card m-3 p-3">
		<div class="grid grid-cols-2 gap-1">
			<h5 class="self-center h5">Schedule Details</h5>
			<div class="flex justify-end">
				<button
					class="btn variant-ghost-primary"
					type="button"
					on:click={() => {
						modalStore.trigger({
							type: 'component',
							title: 'Edit Schedule Details',
							meta: 'Details',
							component: 'EditScheduleModal'
						});
					}}>Edit</button
				>
			</div>
			<hr class="hr col-span-2" />
		</div>
		<p>
			<span class="text-gray-400"> ID: </span>
			{data.schedule.id}
		</p>
		<p>
			<span class="text-gray-400"> Title: </span>
			{data.schedule.title}
		</p>
		<p>
			<span class="text-gray-400"> Schedule Date: </span>
			{data.schedule.schedule_date}
		</p>
	</div>
	<div class="card m-3 p-3">
		<div class="grid grid-cols-2 gap-1">
			<h5 class="h5 self-center">Employees</h5>
			<div class="flex justify-end">
				<button
					class="btn variant-ghost-primary"
					type="button"
					on:click={() => {
						modalStore.trigger({
							type: 'component',
							title: 'Edit Schedule Employee',
							meta: 'Employee',
							component: 'EditScheduleModal'
						});
					}}
				>
					Edit
				</button>
			</div>
			<hr class="hr col-span-2" />
		</div>
		{#each data.schedule.expand.employee as employee}
			<div class="flex flex-row items-center gap-3 p-3">
				<Avatar
					width="w-12"
					initials="{employee.first_name}{employee.last_name}"
					background="bg-primary-500"
				/>{employee.first_name}
				{employee.last_name}
			</div>
		{/each}
	</div>
</div>
<div class="card flex gap-3 flex-col m-3 p-3">
	<div class="grid grid-cols-2 gap-1">
		<h5 class="h5 self-center">Jobs</h5>
		<div class="flex justify-end">
			<button
				class="btn variant-ghost-primary"
				type="button"
				on:click={() => {
					modalStore.trigger({
						type: 'component',
						title: 'Add Schedule Jobs',
						meta: 'Jobs',
						component: 'EditScheduleModal'
					});
				}}
			>
				Add</button
			>
		</div>
		<hr class="hr col-span-2" />
	</div>
	<div class="table-container">
		<table class="table table-compact">
			<thead>
				<tr>
					<th class="table-cell-fit">Order</th>
					<th class="table-cell-fit">Job No.</th>
					<th>Client</th>
					<th>Address</th>
					<th>Status</th>
					<th class="table-cell-fit">More</th>
				</tr>
			</thead>
			<tbody>
				{#each data.schedule.expand.job?.sort( (a, b) => (a.order > b.order ? 1 : a.order < b.order ? -1 : 0) ) ?? [] as job}
					<tr>
						<td class="!align-middle"
							><div class="flex items-center gap-1 !align-middle">
								{job.order}
								<div class="flex flex-col">
									<form method="post" action="?/editJobOrder" use:enhance>
										<input bind:value={$form.schedule_id} name="schedule_id" hidden />
										<input bind:value={$form.job_id} name="job_id" hidden />
										<input bind:value={$form.order} name="order" hidden />
										<input bind:value={$form.type} name="type" hidden />
										<button
											class="group"
											on:click={() => {
												form.update(
													($form) => {
														$form.order = job.order;
														$form.job_id = job.id;
														$form.type = 'INCREASE';
														return $form;
													},
													{ taint: false }
												);
											}}
										>
											<svg
												class="mx-auto fill-secondary-500 group-hover:fill-secondary-200"
												width="2em"
												viewBox="0 0 24 24">{@html up}</svg
											>
										</button>
										<button
											class="group"
											on:click={() => {
												form.update(
													($form) => {
														$form.order = job.order;
														$form.job_id = job.id;
														$form.type = 'DECREASE';
														return $form;
													},
													{ taint: false }
												);
											}}
										>
											<svg
												class="mx-auto fill-secondary-500 group-hover:fill-secondary-200"
												width="2em"
												viewBox="0 0 24 24">{@html down}</svg
											>
										</button>
									</form>
								</div>
							</div>
						</td>
						<td class="!align-middle">
							{job.job_number}
						</td>
						<td class="!align-middle">
							<p class="whitespace-normal">
								{job.expand.address.expand.client.first_name}
								{job.expand.address.expand.client.last_name}
							</p>
						</td>
						<td class="!align-middle">
							<p class="whitespace-normal">
								{job.expand.address.address}
							</p>
						</td>
						<td class="!align-middle">
							<div class="chip {statusColor(job.status)}">
								{job.status}
							</div>
						</td>
						<td class="!align-middle">
							<div class="flex gap-1">
								<a href="/admin/jobs/{job.id}" class="hover:fill-primary-500 fill-primary-300"
									><Info size={30} /></a
								>
								<form action="?/deleteScheduleJob" use:deleteFormEnhance method="post">
									<input bind:value={$deleteForm.schedule_id} name="schedule_id" hidden />
									<input bind:value={$deleteForm.jobs} name="job_id" hidden />
									<button
										class="hover:fill-primary-500 fill-primary-300"
										on:click={() => {
											deleteForm.update(($deleteForm) => {
												$deleteForm.jobs = [job.id];
												return $deleteForm;
											});
										}}><Trash size={30} /></button
									>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
