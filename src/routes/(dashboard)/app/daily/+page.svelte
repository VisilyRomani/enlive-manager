<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { IDailySchedule } from '../../admin/api/schedule/+server';
	let schedules: IDailySchedule[];

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	const getScheduleData = async () => {
		const result = await fetch(`/admin/api/schedule?date=${new Date().toLocaleDateString()}`);
		schedules = await result.json();
	};
	$: isMounted === true && getScheduleData();
</script>

<nav class="mt-1">
	<ul class="space-y-1">
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
	</ul>
</nav>
