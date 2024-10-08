<script lang="ts">
	import dayjs, { Dayjs } from 'dayjs';
	import cleft from '$lib/photos/cleft.svg?raw';
	import cright from '$lib/photos/cright.svg?raw';

	export let date = dayjs();
	export let multiSelect: boolean;
	export let itemsOnDay: string[] = [];
	export let selectedDates: Date[] = [];
	export let disabledDates: Date[] = [];

	const getCells = (selectedDate: Dayjs) => {
		return new Array(selectedDate.daysInMonth())
			.fill('')
			.map((a, idx) => {
				const date = selectedDate
					.set('date', idx + 1)
					.set('hour', 12)
					.set('m', 0)
					.set('s', 0);
				if (idx === 0 && date.day() !== 0) {
					const values: Dayjs[] = [];
					for (let i = 0; i < date.day(); i++) {
						values.push(date.subtract(date.day() - i, 'day'));
					}
					values.push(date.set('date', idx + 1));
					return values;
				} else if (idx === selectedDate.daysInMonth() - 1 && date.day() !== 6) {
					const endDays: Dayjs[] = [];
					endDays.push(date);
					for (let i = 1; i <= 6 - date.day(); i++) {
						endDays.push(date.add(i, 'day'));
					}
					return endDays;
				}
				return date;
			})
			.flat();
	};

	const hasDate = (date: Dayjs) => {
		return !!selectedDates.find((d) => dayjs(d).isSame(date, 'day'));
	};

	const addDate = (cellDate: Dayjs) => {
		selectedDates = [...selectedDates, cellDate.toDate()];
	};
	const removeDate = (cellDate: Dayjs) => {
		selectedDates = [...selectedDates.filter((d) => !dayjs(d).isSame(cellDate, 'day'))];
	};

	// Used to clear the selected when multi select changes
	$: multiSelect,
		(() => {
			if (selectedDates.length > 1 && multiSelect === false) {
				selectedDates = [];
			}
		})();

	const weekDate = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	$: cells = getCells(date);
</script>

<div class="h-fit">
	<div class="flex justify-between whitespace-nowrap">
		<h5 class="h5 text-secondary-300">
			{date.format('MMMM YYYY')}
		</h5>
		<div class="whitespace-nowrap">
			<button
				type="button"
				class="hover:fill-secondary-500 fill-secondary-300"
				on:click={() => (date = date.subtract(1, 'month'))}
			>
				<svg class="mx-auto" width="2em" viewBox="0 0 24 24">{@html cleft}</svg>
			</button>
			<button
				type="button"
				class="hover:fill-secondary-500 fill-secondary-300"
				on:click={() => (date = date.add(1, 'month'))}
			>
				<svg class="mx-auto" width="2em" viewBox="0 0 24 24">{@html cright}</svg>
			</button>
		</div>
	</div>
	<div class="grid grid-cols-7 rounded-lg h-full gap-1">
		{#each weekDate as date}
			<p class="flex justify-center items-center m-2">{date}</p>
		{/each}
		{#each cells as cell, idx (idx)}
			<button
				type="button"
				disabled={!!disabledDates.find((d) => dayjs(d).isSame(cell, 'day'))}
				on:click={() => {
					if (multiSelect) {
						hasDate(cell) ? removeDate(cell) : addDate(cell);
					} else {
						selectedDates = [cell.toDate()];
						date = cell;
					}
				}}
				class="
				{!!disabledDates.find((d) => dayjs(d).isSame(cell, 'day')) &&
					'bg-gray-600 hover:bg-gray-600 hover:text-white text-white'}
				hover:bg-secondary-300 hover:text-black rounded-md text-md font-semibold
				{cell.isSame(dayjs(), 'day') && 'bg-secondary-200 text-black'}
				{!!itemsOnDay.find((i) => {
					return i === cell.toDate().toLocaleDateString();
				}) && 'bg-tertiary-500'}
				{cell.month() !== date.month() && 'bg-gray-700'}
				{selectedDates.find((d) => d.toLocaleDateString() === cell.toDate().toLocaleDateString()) &&
					'!bg-success-400 text-black'}
				"
			>
				<p>
					{cell.format('D')}
				</p>
			</button>
		{/each}
	</div>
</div>
