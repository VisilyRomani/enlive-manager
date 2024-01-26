<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/photos/map.svelte';
	import People from '$lib/photos/people.svelte';
	import Task from '$lib/photos/task.svelte';

	export let data: PageData;
	console.log(data.schedule);

	$: job = data.schedule?.expand.job.reduce(function (prev, curr) {
		return prev.order < curr.order ? prev : curr;
	});
</script>

<div class="flex flex-col h-full justify-between">
	<div>
		<div class="card p-3 mb-3 flex flex-col gap-3">
			<div>
				<h3 class="h3">
					{job?.expand.address.expand.client.first_name}
					{job?.expand.address.expand.client.last_name}
				</h3>
				<dd>
					{job?.expand.address.address}
				</dd>
			</div>
			<div class="flex justify-around items-center w-full">
				<a class="btn" href="/admin/client/{job.expand.address.expand.client.id}">
					<People size={30} fill="white" />
				</a>
				<a class="btn" href="/admin/jobs/{job.id}">
					<Task size={30} fill="white" />
				</a>
				<a
					class="btn"
					href="https://maps.google.com/?q={job?.expand.address.address}
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
				{#each job?.expand.task ?? [] as task}
					<li>
						<p class="flex-auto">{task.expand.service.name}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="flex justify-between m-3">
		<button class="btn variant-outline-warning" type="button"> Revise </button>

		<button class="btn variant-outline-primary"> Next</button>
	</div>
</div>
