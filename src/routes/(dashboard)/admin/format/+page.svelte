<script lang="ts">
	import { PUBLIC_GOOGLE_MAPS } from '$env/static/public';
	import { nextClosestLatLng } from '$lib/helper/LocationHelper';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	const toastStore = getToastStore();

	$: initial = '';
	let addressesString = '';

	let startLocation = { address: '', lat: 0, lng: 0 };

	let sortedList = [] as { address: string; lat: number; lng: number }[];

	$: errors = [] as string[];
	let googleLoaded = false;

	onMount(async () => {
		// Wait for Google Maps to be loaded
		if (typeof google === 'undefined') {
			console.log('missing ggogole');
			window.addEventListener('google-maps-loaded', () => {
				setupGoogleAutocomplete();
				googleLoaded = true;
			});
		} else {
			setupGoogleAutocomplete();
			googleLoaded = true;
		}
	});

	function setupGoogleAutocomplete() {
		const autoCompleteInput = document.getElementById('auto-complete-input') as HTMLInputElement;
		if (!autoCompleteInput) return;

		let googlePlaces = new google.maps.places.Autocomplete(autoCompleteInput, {
			types: ['address'],
			componentRestrictions: { country: 'CA' },
			fields: ['geometry', 'formatted_address']
		});
		let id = googlePlaces.addListener('place_changed', () => {
			const place = googlePlaces.getPlace();
			if (place.geometry?.location?.lat() && place.geometry?.location?.lng())
				startLocation = {
					address: place.formatted_address ?? '',
					lat: place.geometry?.location?.lat(),
					lng: place.geometry?.location?.lng()
				};
		});
		return google.maps.event.removeListener.bind(null, id);
	}

	const sortAddresses = async () => {
		if (!googleLoaded) {
			toastStore.trigger({
				message: "Google Maps hasn't loaded yet. Please wait a moment and try again.",
				timeout: 5000,
				background: 'bg-yellow-400'
			});
			return;
		}

		sortedList = [];
		errors = [];
		let splitAddress = addressesString.split('\n');
		const addressList = splitAddress.filter((addr) => addr.trim() !== '');
		let geocoder = new google.maps.Geocoder();

		try {
			const geoResult: google.maps.GeocoderResponse[] = await Promise.all(
				addressList.map(async (address) => {
					try {
						const result = await geocoder.geocode({
							address: address,
							region: 'CA'
						});
						return result;
					} catch (err: any) {
						errors = [...errors, `${address} | ${err.code}`];
						toastStore.trigger({
							message: `Error with "${address}" | ${err.code}`,
							timeout: 10000,
							background: 'bg-red-400'
						});
						return []; // or you could rethrow if you want to stop on error
					}
				})
			).then((results) => results.flat());

			let formatted = geoResult.reduce((acc, cur) => {
				if (cur.results && cur.results[0]) {
					acc.push({
						address: cur.results[0].formatted_address,
						lat: cur.results[0].geometry.location?.lat(),
						lng: cur.results[0].geometry.location?.lng()
					});
				}
				return acc;
			}, [] as { address: string; lat: number; lng: number }[]);

			while (formatted.length !== 0) {
				let closest = sortedList.at(-1);
				sortedList.push(nextClosestLatLng(formatted, !!closest ? closest : { ...startLocation }));
				formatted = formatted.filter((i) => i.address !== sortedList.at(-1)?.address);
			}
			sortedList = [...sortedList];
		} catch (error) {
			console.error('Error sorting addresses:', error);
			toastStore.trigger({
				message: 'An error occurred while sorting addresses',
				timeout: 5000,
				background: 'bg-red-400'
			});
		}
	};

	$: googleEmbeddedParams = () => {
		let googleList = sortedList.slice(0, sortedList.length - 1);
		let lastItem = sortedList.at(-1);

		const destination = `&destination=${encodeURIComponent(lastItem?.address ?? '')}`;
		const waypoints = googleList.length
			? `&waypoints=${encodeURIComponent(googleList.map((i) => i.address).join('|'))}`
			: '';

		return `https://www.google.com/maps/embed/v1/directions?key=${PUBLIC_GOOGLE_MAPS}&mode=driving&origin=${
			startLocation.lat
		},${startLocation.lng}${destination + waypoints}`;
	};
</script>

<div class="flex flex-col md:flex-row m-5 gap-3">
	<div class="flex flex-col gap-3 w-full">
		{#if errors.length}
			<div class="bg-red-200 p-3 flex flex-col">
				{#each errors as error}
					<span class="text-red-800 font-bold"> {error} </span>
				{/each}
			</div>
		{/if}
		<label class="label">
			<span class="label-text">Paste Address</span>
			<textarea class="textarea" rows="4" bind:value={addressesString} />
		</label>

		<label class="label">
			<span class="label-text">Starting Address</span>
			<input
				id="auto-complete-input"
				type="search"
				name="addr"
				class="input"
				placeholder="Starting Address"
				bind:value={initial}
			/>
		</label>
		<button
			disabled={startLocation.lat === 0}
			type="button"
			class="btn variant-outline-primary"
			on:click={sortAddresses}>Calculate Route</button
		>
	</div>

	{#if sortedList.length && startLocation.lat != 0}
		<iframe
			width="100%"
			height="500"
			title="GMaps"
			frameborder="0"
			style="border:0"
			referrerpolicy="no-referrer-when-downgrade"
			allowfullscreen
			src={googleEmbeddedParams()}
		/>
	{/if}
</div>
