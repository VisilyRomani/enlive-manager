<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data.schedule);

	$: job = data.schedule?.expand.job.reduce(function (prev, curr) {
		return prev.order < curr.order ? prev : curr;
	});
	// $: console.log($page);
</script>

<div class="flex flex-col h-full">
	<div class="card p-3 mb-3">
		<button class="text-left">
			<h3 class="h3">
				{job?.expand.address.expand.client.first_name}
				{job?.expand.address.expand.client.last_name}
			</h3>
			<dd>
				{job?.expand.address.address}
			</dd>
		</button>
	</div>
	<div class="card p-3 my-3 space-y-2">
		<h3 class="h3 m-1">Tasks</h3>
		<hr />
		<ul class="space-y-3">
			{#each job?.expand.task ?? [] as task}
				<li>
					<p>{task.expand.service.name}</p>
				</li>
			{/each}
		</ul>
	</div>

	<div class="flex justify-between m-3">
		<button class="btn variant-outline-primary"> Report </button>

		<button class="btn variant-outline-primary"> Next Job </button>
	</div>
</div>
