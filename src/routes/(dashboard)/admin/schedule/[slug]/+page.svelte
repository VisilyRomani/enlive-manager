<script lang="ts">
	import up from '$lib/photos/up.svg?raw';
	import down from '$lib/photos/down.svg?raw';
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let data: PageData;
</script>

{#await data.streamed.schedule}
	load
{:then schedule}
	<ol class="breadcrumb mx-3 px-3">
		<li class="crumb">
			<a class="anchor" href="/admin/schedule">
				<h3 class="h3">Schedule</h3>
			</a>
		</li>
		<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
		<li>
			<h3 class="h3">
				{schedule.title}
			</h3>
		</li>
	</ol>
	<div class="grid lg:grid-cols-2">
		<div class="card m-3 p-3">
			<div class="grid grid-cols-2 gap-1">
				<div class="flex items-center">
					<h5 class="h5">Schedule Details</h5>
				</div>
				<div class="flex justify-end">
					<button class="btn variant-form-material" type="button">Edit</button>
				</div>
				<hr class="hr col-span-2" />
			</div>
			<p>Title: {schedule.title}</p>
			<p>Date: {dayjs(schedule.scheduled_date).format('DD-MM-YYYY')}</p>
		</div>
		<div class="card m-3 p-3">
			<div class="grid grid-cols-2 gap-1">
				<div class="flex items-center">
					<h5 class="h5">Employees</h5>
				</div>
				<div class="flex justify-end">
					<button class="btn variant-form-material" type="button">Edit</button>
				</div>
				<hr class="hr col-span-2" />
			</div>
			{#each schedule.expand.employee as employee}
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
			<div class="flex items-center">
				<h5 class="h5">Jobs</h5>
			</div>
			<div class="flex justify-end">
				<button class="btn variant-form-material" type="button">Edit</button>
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
						<th>Status</th>
						<th>More</th>
					</tr>
				</thead>
				<tbody>
					{#each schedule.expand.job as job}
						<tr>
							<td class="flex gap-4 items-center">
								<p>
									{job.order}
								</p>
								<div class="flex flex-col items-center">
									<button class="group">
										<svg
											class="mx-auto fill-secondary-500 group-hover:fill-secondary-200"
											width="2em"
											viewBox="0 0 24 24">{@html up}</svg
										>
									</button>
									<button class="group">
										<svg
											class="mx-auto fill-secondary-500 group-hover:fill-secondary-200"
											width="2em"
											viewBox="0 0 24 24">{@html down}</svg
										>
									</button>
								</div>
							</td>
							<td>
								{job.job_number}
							</td>
							<td>
								<p class="whitespace-normal">
									{job.expand.address.expand.client.first_name}
									{job.expand.address.expand.client.last_name}
								</p>
							</td>
							<td>
								<div class="flex gap-1 flex-wrap">
									<p class="chip variant-ghost-primary">
										{job.status}
									</p>
								</div>
							</td>
							<td>
								<a href="/admin/jobs/{job.id}" class="btn variant-ghost-tertiary">Info</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/await}
