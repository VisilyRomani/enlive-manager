<script lang="ts">
	import { Avatar, SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ol class="breadcrumb mx-3 px-3">
	<li class="crumb">
		<a class="anchor" href="/admin/client">
			<h3 class="h3">Clients</h3>
		</a>
	</li>
	<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
	<li>
		<h3 class="h3">
			{data.client?.first_name}
			{data.client?.last_name}
		</h3>
	</li>
</ol>

<div class="grid lg:grid-cols-2">
	<div class="card m-3 p-3 grid grid-cols-2">
		<div class="flex gap-3">
			<div class="">
				<Avatar width="w-20" initials={data.client?.first_name} />
			</div>
			<div class="flex flex-col justify-between">
				<div>
					<h5 class="h5">
						{data.client?.first_name}
						{data.client?.last_name}
					</h5>
					<dd class="text-gray-400">
						ID: {data.client?.id}
					</dd>
					<dd class="text-gray-400">
						{data.client?.created && new Date(data.client.created).toLocaleString()}
					</dd>
				</div>
				<div>
					<span class="badge variant-outline-success">Good Standing</span>
				</div>
			</div>
		</div>
		<div class="w-full flex flex-row-reverse">
			<div class="flex flex-col justify-between">
				<button class="btn variant-outline-secondary">Edit</button>
				<SlideToggle name="slider-large" active="bg-primary-500" size="sm">Inactive</SlideToggle>
			</div>
		</div>
	</div>

	<div class="card m-3 p-3">
		<h4 class="h4">Personal Details</h4>
		<div class="grid lg:grid-cols-2 gap-2">
			<div class="flex flex-col justify-around">
				<p class="text-gray-400">
					First Name: <span class="text-gray-50">{data.client?.first_name} </span>
				</p>
				<p class="text-gray-400">
					Last Name: <span class="text-gray-50">{data.client?.last_name} </span>
				</p>
				<p class="text-gray-400">
					Email: <span class="text-gray-50">{data.client?.email} </span>
				</p>
				<p class="text-gray-400">
					phone: <span class="text-gray-50">{data.client?.phone} </span>
				</p>
			</div>
			<div>
				<span>Notes</span>
				<p class="text-gray-400">{data.client?.notes}</p>
			</div>
		</div>
	</div>
</div>
<div class="card m-3 p-3">
	<div class="flex justify-between p-1">
		<h4 class="h4 self-center">Addresses</h4>
		<button type="button" class="btn variant-outline-primary">Edit</button>
	</div>
	<hr class="hr" />
	<dl class="list-dl">
		{#each data.client?.expand?.['address(client)'] as addr}
			<a
				class="hover:bg-secondary-900 flex flex-row p-1 bg-surface-700 rounded-lg my-3"
				href="https://maps.google.com/?q={addr.address}
					"
				target="_blank"
			>
				<div>
					<span class="badge bg-primary-500">📍</span>
				</div>
				<span class="flex-auto">
					<dt>{addr.address}</dt>
					<dd>
						Lat: {addr.lat}
						Lng: {addr.lng}
					</dd>
				</span>
			</a>
		{/each}
	</dl>
</div>

<div class="card m-3 p-3">
	<h4 class="h4 self-center">Jobs</h4>
	<hr class="hr" />
	{#await data.streamed.jobs}
		<p>loading</p>
	{:then jobs}
		<div class="overflow-auto max-h-96">
			{#each jobs.flat().sort((a, b) => (a.job_number > b.job_number ? -1 : 0)) as job}
				<a
					href="/admin/jobs/{job.id}"
					class="flex items-center gap-3 hover:bg-primary-800 p-1 rounded-md"
				>
					<p>
						{job.job_number}
					</p>
					<div class="flex flex-col">
						<div class="flex flex-row flex-wrap gap-3">
							{#each job.expand.task as task}
								<p class="chip variant-outline-tertiary">
									{task.expand.service.name}
								</p>
							{/each}
						</div>
						<p>
							{job.expand.address.address.split(',').slice(0, 2)}
						</p>
					</div>
				</a>
				<hr class="hr" />
			{/each}
		</div>
	{/await}
</div>
