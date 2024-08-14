<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/photos/map.svelte';
	import People from '$lib/photos/people.svelte';
	import Task from '$lib/photos/task.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;

	const modalStore = getModalStore();

	const { form, errors, enhance, delayed } = superForm(data.nextJobForm, {
		warnings: { duplicateId: false },
		onResult: async ({ result }) => {
			console.log(result);
			await invalidateAll();
		}
	});
</script>

<div class="flex flex-col h-full justify-between">
	<div>
		<div class="card p-3 mb-3 flex flex-col gap-3">
			<div class="flex justify-center flex-col items-center">
				<h3 class="h3">
					{data.job?.expand.address.expand.client.first_name}
					{data.job?.expand.address.expand.client.last_name}
				</h3>
				<dd>
					{data.job?.expand.address.address}
				</dd>
			</div>
			<div class="flex justify-around items-center w-full">
				<a class="btn" href="/admin/client/{data.job?.expand.address.expand.client.id}">
					<People size={30} fill="white" />
				</a>
				<a class="btn" href="/admin/jobs/{data.job?.id}">
					<Task size={30} fill="white" />
				</a>
				<a
					class="btn"
					href="https://maps.google.com/?q={data.job?.expand.address.address}
				"
					target="_blank"
				>
					<Map size={30} fill="white" />
				</a>
			</div>
		</div>
		<div class="card p-3 my-3 space-y-2">
			<h3 class="h3 m-1">Services</h3>
			<hr />
			<ul class="space-y-3 list">
				{#each data.job?.expand.task ?? [] as task}
					<li>
						<p class="flex-auto">{task.expand.service.name}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<form action="?/updateScheudleJob" method="post" use:enhance class="flex justify-between m-3">
		<input type="text" hidden name="job_id" bind:value={$form.job_id} />
		<input type="text" hidden name="schedule_id" bind:value={$form.schedule_id} />
		<input type="text" hidden name="status" bind:value={$form.status} />

		<button
			class="btn variant-outline-warning"
			type="button"
			on:click={() => {
				modalStore.trigger({
					type: 'component',
					title: 'Revise Scheduled Job',
					component: 'UpdateScheduleJobModal'
				});
			}}>Revise</button
		>
		<button
			disabled={$delayed}
			class="btn variant-outline-primary"
			on:click={() => {
				form.update(($form) => {
					$form.status = 'COMPLETED';
					return $form;
				});
			}}
		>
			{#if $delayed}
				<ProgressRadial />
			{:else}
				Next
			{/if}
		</button>
	</form>
</div>
