<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../../../routes/(dashboard)/admin/client/[slug]/edit/$types';
	import { onMount } from 'svelte';
	const data = $page.data as PageData;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const { form, errors, enhance } = superForm(data.addAddress, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalStore.close();
				toastStore.trigger({ message: 'Added Address!', background: 'bg-success-500' });
			} else {
				toastStore.trigger({ message: 'Failed to add Address!', background: 'bg-error-500' });
			}
		}
	});

	onMount(() => {
		const autoCompleteInput = document.getElementById('auto-complete-input') as HTMLInputElement;
		let googlePlaces = new google.maps.places.Autocomplete(autoCompleteInput, {
			types: ['address'],
			componentRestrictions: { country: 'ca' },
			fields: ['geometry', 'formatted_address']
		});
		googlePlaces.addListener('place_changed', () => {
			const place = googlePlaces.getPlace();
			form.update(
				($form) => {
					if (!!place.geometry?.location?.lat() && !!place.geometry?.location?.lng()) {
						$form.lat = place.geometry?.location?.lat();
						$form.lng = place.geometry?.location?.lng();
						$form.address = place.formatted_address ?? '';
					}
					return $form;
				},
				{ taint: false }
			);
		});
	});

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<form class="flex gap-3 flex-col" use:enhance method="post" action="?/addAddress">
			<input hidden name="client" bind:value={$modalStore[0].meta} />

			<div class="w-full">
				<input
					class="input variant-form-material {$errors.address ? 'input-error' : undefined}"
					id="auto-complete-input"
					type="search"
					name="address"
					placeholder="Addr.."
					bind:value={$form.address}
				/>
				{#if $errors.address}
					<span class="text-xs text-red-500">{$errors.address}</span>{/if}
			</div>

			<div class="flex gap-3 lg:flex-row flex-col">
				<div class="w-full">
					<input
						class="input variant-form-material {$errors.lat ? 'input-error' : undefined}"
						type="text"
						placeholder="Latitude"
						name="lat"
						bind:value={$form.lat}
					/>
					{#if $errors.lat}
						<span class="text-xs text-red-500">{$errors.lat}</span>{/if}
				</div>
				<div class="w-full">
					<input
						class="input variant-form-material {$errors.lng ? 'input-error' : undefined}"
						type="text"
						name="lng"
						placeholder="Longitude"
						bind:value={$form.lng}
					/>
					{#if $errors.lng}
						<span class="text-xs text-red-500">{$errors.lng}</span>{/if}
				</div>
			</div>

			<div class="flex justify-between">
				<button
					type="button"
					on:click={() => modalStore.close()}
					class="btn variant-outline-primary"
				>
					Cancel
				</button>
				<button class="btn variant-outline-success"> Save </button>
			</div>
		</form>
	</div>
{/if}
