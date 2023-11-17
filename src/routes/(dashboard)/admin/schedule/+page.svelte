<script lang="ts">
	import dayjs from 'dayjs';
	import Calendar from '$lib/components/Calendar.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	const modalStore = getModalStore();
	const newScheduleModal = () => {
		modalStore.trigger({ type: 'component', component: 'ScheduleModal', title: 'Scheduler' });
	};

	$: itemsOnDay = data.scheduleList.map((s) => dayjs(s.scheduled_date));
	let date = dayjs();
	$: windowWidth = 0;
</script>

<div class="flex flex-col lg:flex-row h-full" bind:offsetWidth={windowWidth}>
	{#if windowWidth >= 1024}
		<div class="card p-4 h-full w-64 flex-col gap-2 hidden lg:flex">
			<button class="btn variant-form-material w-full btn-sm" on:click={newScheduleModal}>
				Create Schedule
			</button>
			<Calendar bind:date {itemsOnDay} />
		</div>
	{:else}
		<div class="flex sticky top-0 flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
			<button class="btn variant-form-material" on:click={newScheduleModal}>
				Create Schedule
			</button>
			<input type="date" class="input w-full h-fit" bind:value={date} />
		</div>
	{/if}
	<nav class="w-full mt-1">
		<ul class="space-y-1">
			{#each data.scheduleList.filter( (s) => dayjs(s.scheduled_date).isSame(date, 'day') ) as schedule}
				<li
					class="hover:bg-surface-700 bg-surface-800 shadow-md transition-colors border-l-4 rounded-md p-3"
				>
					<a href="/admin/schedule/{schedule.id}">
						<div class="grid grid-cols-2 justify-items-start justify-start">
							<div class="flex flex-col">
								<h3 class="h3">
									{schedule.title} |
									<span class="text-secondary-400 group-hover:text-secondary-700">
										{schedule.id.slice(-4)}
									</span>
								</h3>
								<div class="space-x-1">
									{#each schedule.expand.job as job}
										<a href="/admin/jobs/{job.id}">
											<p class="chip variant-ghost-tertiary">
												Job: {job.job_number}
											</p>
										</a>
									{/each}
								</div>
							</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
