<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
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

	const {
		form: employeeForm,
		enhance: employeeEnhance,
		errors: employeeErrors
	} = superForm(data.EditScheduleEmployee, {
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({
					message: 'Successfully updated employees',
					background: 'bg-success-500'
				});
				modalStore.close();
			}
		}
	});

	const {
		form: editJobForm,
		enhance: editJobEnhance,
		errors: editJobErrors
	} = superForm(data.AddScheduleJobs, {
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({
					message: 'Successfully updated schedule jobs',
					background: 'bg-success-500'
				});
				modalStore.close();
			}
		}
	});

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

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
			<form use:employeeEnhance action="?/editEmployee" method="post">
				{#if $employeeErrors.employees?._errors}
					<span class="text-xs text-red-500">{$employeeErrors.employees?._errors}</span>
				{/if}
				{#if $employeeErrors.schedule_id}
					<span class="text-xs text-red-500">{$employeeErrors.schedule_id}</span>
				{/if}
				<input name="schedule_id" bind:value={$employeeForm.schedule_id} hidden />

				<ul class="flex flex-col gap-3 m-3">
					{#each data.userList as employee}
						<li class="flex gap-3">
							<input
								class="checkbox"
								type="checkbox"
								checked={!!$employeeForm.employees.find((e) => e === employee.id)}
								on:click={(e) => {
									employeeForm.update(
										($employeeForm) => {
											if (e.currentTarget.checked) {
												$employeeForm.employees.push(employee.id);
											} else {
												$employeeForm.employees = $employeeForm.employees.filter(
													(e) => e != employee.id
												);
											}
											return $employeeForm;
										},
										{ taint: false }
									);
								}}
							/>
							<p>
								{employee.first_name}
								{employee.last_name}
							</p>
						</li>
					{/each}
				</ul>
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
		{:else if $modalStore[0].meta === 'Jobs'}
			<form use:editJobEnhance class="flex gap-3 flex-col" method="post" action="?/addSchduleJob">
				<input name="schedule_id" hidden bind:value={$editJobForm.schedule_id} />
				<ul>
					{#if !data.jobList.length}
						<div class="flex justify-center items-center flex-col h-full">
							<p class="text-center text-3xl font-bold">No Jobs Found</p>
							<p class="text-center text-primary-500-400-token">Please create a job to scheudle</p>
						</div>
					{/if}
					{#each data.jobList as job}
						<li class="flex gap-3 items-center">
							<input
								class="checkbox"
								type="checkbox"
								checked={!!$editJobForm.jobs.find((j) => j === job.id)}
								on:click={(e) => {
									editJobForm.update(
										($editJobForm) => {
											if (e.currentTarget.checked) {
												$editJobForm.jobs.push(job.id);
											} else {
												$editJobForm.jobs = $editJobForm.jobs.filter((e) => e != job.id);
											}
											return $editJobForm;
										},
										{ taint: false }
									);
								}}
							/>

							<div class="flex flex-col">
								<h3 class="h3">
									{job.expand.address.expand.client.first_name}
									{job.expand.address.expand.client.last_name} |
									<span class="text-secondary-400">
										{job.id.slice(-4)}
									</span>
								</h3>
								<p class="text-gray-400">
									{job.expand.address.address}
								</p>

								<div>
									{#each job.expand.task as task}
										<p class="chip variant-ghost-tertiary">
											{task.expand.service.name}
										</p>
									{/each}
								</div>
							</div>
						</li>
					{/each}
				</ul>
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
		{/if}
	</div>
{/if}
