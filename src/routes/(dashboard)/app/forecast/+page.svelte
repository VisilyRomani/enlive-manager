<script lang="ts">
	import { onMount } from 'svelte';

	let TempData;

	onMount(() => {
		window.navigator.geolocation.getCurrentPosition(
			async (position) => {
				const apiString = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max&timezone=auto`;
				const result = await fetch(apiString, { method: 'GET' });
				const temp = await result.json();
				TempData = temp;
				console.log(TempData);
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
