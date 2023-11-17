<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let data;

	const modalStore = getModalStore();
	let jobFilter = '';

	const newJobModal = () => {
		modalStore.trigger({ type: 'component', component: 'JobModal', title: 'Create Job' });
	};

	const statusColor = (status: string) => {
		switch (status) {
			case (status = 'PENDING'):
				return 'variant-ghost-secondary';
			case (status = 'SCHEDULED'):
				return 'variant-ghost-success';
			case (status = 'IN_PROGRESS'):
				return 'variant-ghost-success';
			case (status = 'COMPLETED'):
				return 'variant-ghost-success';
			case (status = 'CANCELED'):
				return 'variant-ghost-error';
			case (status = 'RESCHEUDLE'):
				return 'variant-ghost-warning';
			default:
				return 'variant-ghost-primary';
		}
	};
</script>

<div class="flex sticky top-0 flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
	<button class="btn variant-outline-secondary variant-form-material" on:click={newJobModal}
		>New Job</button
	>
	<input bind:value={jobFilter} placeholder="Search" class="input variant-form-material" />
</div>

<nav class="mt-1">
	<ul class="space-y-1">
		{#each data.jobList ?? [] as job}
			<li
				class="hover:bg-surface-700 bg-surface-800 shadow-md transition-colors border-l-4 rounded-md p-3"
			>
				<a href="/admin/jobs/{job.id}">
					<div class="grid grid-cols-2 justify-items-start justify-start">
						<div class="flex flex-col">
							<h3 class="h3">
								<span>{job.job_number}</span>
								| {job.expand.address.expand.client.first_name}
								{job.expand.address.expand.client.last_name}
							</h3>
							<p class="text-secondary-400 break-all flex flex-col">
								{job.expand.address.address.split(',').slice(0, 2)}
							</p>
							<ul class="space-x-2">
								<p class="chip {statusColor(job.status)}">
									{job.status}
								</p>
							</ul>
						</div>
						<div class="justify-self-end self-center">
							{#each job.expand?.task ?? [] as task}
								<li class="chip variant-ghost-primary">
									<p>
										{task.expand.service.name}
									</p>
								</li>
							{/each}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</nav>
