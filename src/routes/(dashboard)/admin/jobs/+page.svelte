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

<nav>
	<ul>
		{#each data.jobList ?? [] as job}
			<li class="hover:bg-surface-600 rounded-md p-3">
				<a href="/admin/jobs/{job.id}">
					<div class="grid grid-cols-2 justify-items-start justify-start">
						<div class="flex flex-col">
							<h3 class="h3">
								<span>{job.job_number}</span>
								| {job.expand.address.expand.client.first_name}
								{job.expand.address.expand.client.last_name} |
								<span class="text-secondary-400 group-hover:text-secondary-700">
									{job.id.slice(-4)}
								</span>
							</h3>
							<p>
								{job.expand.address.address}
							</p>
							<ul class="space-x-2">
								{#each job.expand?.task ?? [] as task}
									<li class="chip variant-ghost-primary">
										<p>
											{task.expand.service.name}
										</p>
									</li>
								{/each}
							</ul>
						</div>
						<div class="justify-self-end self-center">
							<p class="chip text-xl {statusColor(job.status)}">
								{job.status}
							</p>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</nav>
