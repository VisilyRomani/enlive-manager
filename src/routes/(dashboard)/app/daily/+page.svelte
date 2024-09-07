<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { IDailySchedule } from '../../admin/api/schedule/+server';
	import dayjs from 'dayjs';
	let schedules: IDailySchedule[] = [];

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	const getScheduleData = async () => {
		const result = await fetch(`/admin/api/schedule?date=${dayjs().format('M/D/YYYY')}`);
		console.log(await result.json());
		// schedules = await result.json();
	};
	$: isMounted === true && getScheduleData();
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Enlive Manager</title>
</svelte:head>
<nav class="mt-1">
	<ul class="space-y-1">
		{#if schedules?.length}
			{#each schedules ?? [] as schedule}
				<li
					class="hover:bg-surface-700 bg-surface-800 shadow-md transition-colors border-l-4 {schedule.completed ===
						100 && 'border-success-500'} rounded-md p-3"
				>
					<a href="/app/daily/{schedule.id}" class="flex justify-between">
						<div>
							<h3>{schedule.title}</h3>
							<p>Jobs: {schedule.job.length}</p>
						</div>
						<ProgressRadial
							meter={schedule.completed ? 'stroke-success-500' : ''}
							value={schedule.completed}
							width="w-14"
							stroke={70}
							font={120}
						>
							{schedule.completed.toFixed(0)}%
						</ProgressRadial>
					</a>
				</li>
			{/each}
		{:else}
			<div class="flex justify-center items-center flex-col h-full">
				<p class="text-center text-3xl font-bold">No Jobs Found</p>
				<p class="text-center text-primary-500-400-token">There are no schedules for today</p>
			</div>
		{/if}
	</ul>
</nav>
