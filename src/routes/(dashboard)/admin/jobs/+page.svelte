<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let data;

	const modalStore = getModalStore();
	let jobFilter = '';

	const newJobModal = () => {
		modalStore.trigger({ type: 'component', component: 'JobModal', title: 'Create Job' });
	};
</script>

<div class="flex sticky top-0 flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
	<button class="btn variant-outline-secondary variant-form-material" on:click={newJobModal}
		>New Job</button
	>
	<input bind:value={jobFilter} placeholder="Search" class="input variant-form-material" />
</div>

<nav>
	<dl class="list-dl">
		{#each data.jobList ?? [] as job}
			<li class="hover:bg-surface-900 rounded-sm m-1 p-3">
				<a href="/admin/jobs/{job.id}">
					<span>
						<dt>
							<p class="text-lg">
								{job.expand.address.expand.client.first_name}
								{job.expand.address.expand.client.last_name} |
								<span class="text-primary-300">{job.id.slice(-4)}</span>
							</p>
							{job.expand.address.address}
						</dt>
						<ul>
							{#each job.expand?.task ?? [] as task}
								<li>
									<dd class="text-gray-500 break-all w-100% flex flex-col">
										{task.expand.service.name}
									</dd>
								</li>
							{/each}
						</ul>
					</span>
				</a>
			</li>
		{/each}
	</dl>
</nav>
