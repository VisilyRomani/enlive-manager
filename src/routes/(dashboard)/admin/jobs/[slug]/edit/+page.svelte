<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	export let data: PageData;
	import Dinero from 'dinero.js';
	import Trash from '$lib/photos/trash.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const { form, enhance, errors } = superForm(data.editJob, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toastStore.trigger({ message: 'Updated Job!', background: 'bg-success-500' });
			} else {
				toastStore.trigger({ message: 'failed to update job!', background: 'bg-error-500' });
			}
		}
	});

	const handleDeleteTask = async (id: string) => {
		const result = await fetch(`/admin/jobs/${data.slug}/edit`, {
			method: 'DELETE',
			body: JSON.stringify({ id })
		});
		if (result.ok) {
			toastStore.trigger({ message: 'Deleted Task!', background: 'bg-success-500' });
		} else {
			toastStore.trigger({ message: 'Failed to delete task!', background: 'bg-error-500' });
		}
		await invalidateAll();
	};
	const handleAddTask = () => {
		modalStore.trigger({ type: 'component', component: 'AddTaskModal', title: 'Add Task' });
	};
</script>

<ol class="breadcrumb m-3 px-3">
	<li class="crumb">
		<a class="anchor" href="/admin/jobs">
			<h3 class="h3">Jobs</h3>
		</a>
	</li>
	<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
	<li>
		<a class="anchor" href="/admin/jobs/{data.slug}">
			<h3 class="h3">
				{data.job?.job_number}
			</h3>
		</a>
	</li>
	<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
	<li>
		<h3 class="h3">Edit</h3>
	</li>
</ol>

<div class="card m-3 p-5 grid gap-5">
	<h3 class="h3">Job Details</h3>
	<form action="?/editJob" method="post" use:enhance class="gap-3 flex flex-col">
		<input name="id" class="input variant-outline-primary" hidden bind:value={$form.id} />
		<div class="flex gap-3">
			<input
				name="client"
				class="input variant-outline-primary"
				disabled
				placeholder="Client Name"
				value={`${data.job?.expand.address.expand.client.first_name} ${data.job?.expand.address.expand.client.last_name}`}
			/>
			<input
				name="number"
				class="input variant-outline-primary"
				disabled
				placeholder="Address"
				value={data.job?.expand.address.address}
			/>
		</div>
		<div>
			<select name="status" bind:value={$form.status} class="select variant-outline-primary">
				<option value="PENDING"> Pending </option>
				<option value="IN_PROGRESS">In Progress</option>
				<option value="COMPLETED">Completed</option>
				<option value="RESCHEUDLE">Reschedule</option>
				<option value="CANCELED">Canceled</option>
				<option value="SCHEDULED">Scheduled</option>
			</select>
		</div>
		<textarea
			name="notes"
			class="input variant-outline-primary"
			placeholder="Notes"
			bind:value={$form.notes}
		/>
		<button class="btn variant-ghost-success">Save</button>
	</form>
	<h3 class="h3">Job Tasks</h3>
	<ul class="flex flex-col gap-5">
		{#each data.job?.expand.task ?? [] as task}
			<li class="flex justify-between">
				<p>
					{task.expand.service.name}
					{task.count} x
					{Dinero({ amount: task.price }).toFormat('$0.00')}
				</p>
				<button
					type="button"
					on:click={() => handleDeleteTask(task.id)}
					class="fill-slate-500 hover:fill-slate-400"
				>
					<Trash size={30} />
				</button>
			</li>
		{/each}
		<button class="btn btn-sm variant-outline-primary" type="button" on:click={handleAddTask}
			>+</button
		>
	</ul>
</div>
