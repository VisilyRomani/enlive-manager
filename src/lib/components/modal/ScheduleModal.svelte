<script lang="ts">
	import {
		Autocomplete,
		SlideToggle,
		getModalStore,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import Calendar from '../Calendar.svelte';
	import type { Dayjs } from 'dayjs';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import type { PageData } from '../../../routes/(dashboard)/admin/schedule/$types';
	const modalStore = getModalStore();
	let dates: Dayjs[] = [];
	let date = dayjs();
	let multiSelect = false;
	const data = $page.data as PageData;
	export let parent: any;

	let userSearch = '';
	let offsetWidth = 0;

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'userPopup',
		placement: 'bottom'
	};

	$: selectedUsers = new Map<string, string>();
	let items = new Set<string>();

	const userOptions = data.userList?.map((u) => ({
		value: u.id,
		label: `${u.first_name} ${u.last_name}`
	}));
</script>

{#if $modalStore[0]}
	<div class="w-modal card p-3 flex flex-col gap-3">
		<h2 class="h2">{$modalStore[0].title}</h2>
		<SlideToggle size="sm" name="toggle" bind:checked={multiSelect}>
			<span>Duplicate Schedule</span>
		</SlideToggle>
		<div class="grid lg:grid-cols-2 gap-3">
			<div class="space-y-3">
				<input class="input" placeholder="Label" />
				<div bind:offsetWidth>
					<input
						class="input"
						placeholder="Schedule Users"
						bind:value={userSearch}
						use:popup={popupSettings}
					/>
					<div data-popup="userPopup" class=" w-full z-50">
						<div class="card max-h-60 overflow-auto w-[${offsetWidth + 'px'}]">
							<Autocomplete
								options={userOptions}
								bind:input={userSearch}
								on:selection={(e) => {
									if (selectedUsers.has(e.detail.value)) {
										selectedUsers.delete(e.detail.value);
									} else {
										selectedUsers.set(e.detail.value, e.detail.label);
									}
									selectedUsers = selectedUsers;
								}}
							/>
						</div>
					</div>
				</div>
				<div>
					{#each selectedUsers as user}
						<button
							class="chip variant-ghost-primary"
							on:click={() => {
								selectedUsers.delete(user[0]);
								selectedUsers = selectedUsers;
							}}
						>
							{user[1]} 🗙
						</button>
					{/each}
				</div>
			</div>
			<Calendar {multiSelect} bind:selectedDates={dates} bind:date />
		</div>
		<hr />
		<ul class="gap-3 flex flex-col h-80 overflow-auto">
			{#each $page.data.jobList as job}
				<button
					class="flex flex-row items-center hover:bg-primary-300 group group-hover:text-primary-900 rounded-md {items.has(
						job.id
					) && '!bg-primary-200'}"
					on:click={() => {
						items.has(job.id) ? items.delete(job.id) : items.add(job.id);
						items = items;
					}}
				>
					<p class="w-3 text-primary-900 font-bold p-2">
						{#if [...items].findIndex((i) => i === job.id) !== -1}
							{[...items].findIndex((i) => i === job.id) + 1}
						{/if}
					</p>
					<div class="divider-vertical h-9 mx-2" />
					<li value={job.id} class="grid grid-cols-2 text-left">
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
								class="text-gray-400 text-sm group-hover:text-gray-800 {items.has(job.id) &&
									'text-gray-800'}"
							>
								{job.expand.address.address}
							</p>
						</div>
						<div class="flex flex-wrap flex-row-reverse gap-1 m-1">
							{#each job.expand.task as task}
								<p
									class="w-fit h-fit chip variant-soft-primary group-hover:bg-primary-500 group-hover:text-surface-800 {items.has(
										job.id
									) && ' !bg-primary-500 !text-surface-800'}"
								>
									{task.expand.service.name}
								</p>
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
			<button type="submit" class="btn {parent.buttonPositive}">Create</button>
		</footer>
	</div>
{/if}
