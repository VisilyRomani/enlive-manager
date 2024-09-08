<script lang="ts">
	import Drop from '$lib/photos/drop.svelte';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	interface ITemperature {
		current: {
			time: Date;
			apparent_temperature: number;
		};
		current_units: {
			apparent_temperature: string;
		};
		daily: {
			time: Date[];
			precipitation_probability_max: number[];
			apparent_temperature_max: number[];
			apparent_temperature_min: number[];
		};
		daily_units: {
			precipitation_probability_max: string;
			apparent_temperature_max: string;
			apparent_temperature_min: string;
		};
		hourly: {
			apparent_temperature: number[];
			precipitation_probability: number[];
			time: Date[];
		};
		hourly_units: {
			apparent_temperature: string;
			precipitation_probability: string;
		};
	}
	let temperature_data: ITemperature;

	onMount(() => {
		window.navigator.geolocation.getCurrentPosition(
			async (position) => {
				const apiString = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}
				&current=apparent_temperature
				&hourly=apparent_temperature,precipitation_probability
				&daily=precipitation_probability_max,apparent_temperature_max,apparent_temperature_min&timezone=auto`;
				const result = await fetch(apiString, { method: 'GET' });
				temperature_data = await result.json();
			},

			(error) => {
				console.error(error);
			}
		);
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Enlive Manager</title>
</svelte:head>

<div class="flex flex-col items-center m-3 gap-3 overflow-hidden">
	{#if !temperature_data}
		<div class="h-16" />
		<section class="card w-full rounded-lg">
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-4 gap-3">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-4 gap-3">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-4 gap-3">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
			</div>
		</section>
		<section class="card w-full rounded-lg">
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
					<div class="placeholder animate-pulse" />
				</div>
			</div>
		</section>
	{:else}
		<h2 class="h2 font-bold font-sans text-4xl flex flex-col text-center m-3">
			{temperature_data?.current.apparent_temperature}{temperature_data?.current_units
				.apparent_temperature}
		</h2>
		<div class="overflow-auto w-full card rounded-lg">
			<div class="flex flex-row p-3 gap-3 relative">
				{#each temperature_data?.hourly.time.slice(0, 25) ?? [] as time, idx}
					<div class="whitespace-nowrap text-center">
						<p class="text-sm">
							{dayjs(time).format('h a')}
						</p>
						<div class="m-3">
							<span class="font-bold">
								{temperature_data?.hourly.apparent_temperature[idx]}{temperature_data?.hourly_units
									.apparent_temperature}
							</span>
						</div>
						<div class="m-3">
							<span class="text-sm flex flex-row gap-1">
								<Drop fill="#06b6d4" size={20} />
								{temperature_data?.hourly.precipitation_probability[idx]}{temperature_data
									?.hourly_units.precipitation_probability}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="overflow-auto w-full h-52 card rounded-lg">
			{#each temperature_data?.daily.time ?? [] as time, idx}
				<div class="grid grid-cols-3 gap-3 p-3">
					<p>{dayjs(time).format('dddd')}</p>
					<p class="text-center">
						{temperature_data?.daily.apparent_temperature_max[idx]} / {temperature_data?.daily
							.apparent_temperature_min[idx]}
					</p>
					<p class="flex flex-row justify-end gap-1">
						<Drop fill="#06b6d4" size={20} />
						{temperature_data?.daily.precipitation_probability_max[idx]}{temperature_data
							?.daily_units.precipitation_probability_max}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
