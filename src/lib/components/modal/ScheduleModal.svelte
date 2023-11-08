<script lang="ts">
	import { SlideToggle, getModalStore } from '@skeletonlabs/skeleton';
	import Calendar from '../Calendar.svelte';
	import type { Dayjs } from 'dayjs';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	const modalStore = getModalStore();
	let dates: Dayjs[] = [];
	let date = dayjs();
	let multiSelect = false;
	export let parent: any;
	$: console.log($page.data.jobList);

	let items = new Set<string>();
	$: console.log(items);
</script>

{#if $modalStore[0]}
	<div class="w-modal card p-3 flex flex-col gap-3">
		<h2 class="h2">{$modalStore[0].title}</h2>
		<SlideToggle size="sm" name="toggle" bind:checked={multiSelect}>
			<span>Schedule Recurrence</span>
		</SlideToggle>
		<Calendar {multiSelect} bind:selectedDates={dates} bind:date />
		<hr />
		<ul class="gap-3 flex flex-col h-80 overflow-auto">
			{#each $page.data.jobList as job}
				<button
					class="flex flex-row gap-3 items-center hover:bg-primary-300 group group-hover:text-primary-900 rounded-md {items.has(
						job.id
					) && '!bg-primary-200'}"
					on:click={() => {
						items.has(job.id) ? items.delete(job.id) : items.add(job.id);
						items = items;
					}}
				>
					<p class="w-3 p-3 text-primary-900 font-bold">
						{#if [...items].findIndex((i) => i === job.id) !== -1}
							{[...items].findIndex((i) => i === job.id) + 1}
						{/if}
					</p>
					<div class="divider-vertical h-14" />
					<li value={job.id} class="grid grid-cols-2 p-3 text-left">
						<div>
							<h5
								class="h5 group-hover:text-primary-900
                            {items.has(job.id) && 'text-primary-800'}"
							>
								{job.expand.address.expand.client.first_name}
								{job.expand.address.expand.client.last_name} |
								<span
									class="text-secondary-400 group-hover:text-secondary-700 {items.has(job.id) &&
										'!text-secondary-800'}">{job.id.slice(-4)}</span
								>
							</h5>
							<p
								class="text-gray-400 group-hover:text-gray-800 {items.has(job.id) &&
									'text-gray-800'}"
							>
								{job.expand.address.address}
							</p>
						</div>
						<div class="flex flex-wrap flex-row-reverse gap-1">
							{#each job.expand.task as task}
								<div
									class="w-fit h-fit chip variant-soft-primary group-hover:bg-gray-800 {items.has(
										job.id
									) && ' !bg-gray-800'}"
								>
									{task.expand.service.name}
								</div>
							{/each}
						</div>
					</li>
				</button>
			{/each}
		</ul>
		<footer class="modal-footer float-right">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="submit" class="btn {parent.buttonPositive}">Next</button>
		</footer>
	</div>
{/if}
