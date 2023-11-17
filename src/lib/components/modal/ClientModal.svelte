<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ClientSchema } from '../../../routes/(dashboard)/admin/client/proxy+page.server';
	import { invalidate } from '$app/navigation';

	export let parent: any;
	const modalStore = getModalStore();
	const clientform: SuperValidated<ClientSchema> = $page.data.clientForm;

	const { form, errors, enhance } = superForm(clientform, {
		resetForm: true,
		async onResult(event) {
			if (event.result.type === 'success') {
				modalStore.close();
				await invalidate('/admin/client');
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
						$form.addr = place.formatted_address ?? '';
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
		<form class="grid lg:grid-cols-2 gap-4" action="?/CreateClient" method="post" use:enhance>
			<div>
				<input
					class="input variant-form-material {$errors.first_name ? 'input-error' : undefined}"
					bind:value={$form.first_name}
					type="text"
					autocapitalize="on"
					name="first_name"
					placeholder="First Name"
				/>
				{#if $errors.first_name}
					<span class="text-xs text-red-500">{$errors.first_name}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.last_name ? 'input-error' : undefined}"
					bind:value={$form.last_name}
					type="text"
					autocapitalize="on"
					name="last_name"
					placeholder="Last Name"
				/>
				{#if $errors.last_name}
					<span class="text-xs text-red-500">{$errors.last_name}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.phone ? 'input-error' : undefined}"
					bind:value={$form.phone}
					type="tel"
					name="phone"
					placeholder="Phone Number"
				/>
				{#if $errors.phone}
					<span class="text-xs text-red-500">{$errors.phone}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.email ? 'input-error' : undefined}"
					bind:value={$form.email}
					type="email"
					name="email"
					placeholder="Email"
				/>
				{#if $errors.email}
					<span class="text-xs text-red-500">{$errors.email}</span>{/if}
			</div>

			<div class="lg:col-span-2 gap-3 flex flex-wrap">
				<div class="w-full">
					<input
						class="input variant-form-material {$errors.addr ? 'input-error' : undefined}"
						id="auto-complete-input"
						type="search"
						name="addr"
						placeholder="Addr.."
						bind:value={$form.addr}
					/>
					{#if $errors.addr}
						<span class="text-xs text-red-500">{$errors.addr}</span>{/if}
				</div>

				<div class="grid gap-3 lg:grid-cols-2 w-full">
					<div>
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
					<div>
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
			</div>
			<div class="lg:col-span-2">
				<textarea
					class="input variant-form-material {$errors.notes ? 'input-error' : undefined}"
					placeholder="Notes"
					autocapitalize="on"
					name="notes"
					bind:value={$form.notes}
				/>
				{#if $errors.notes}
					<span class="text-xs text-red-500">{$errors.notes}</span>{/if}
			</div>
			<footer class="flex justify-between col-span-2">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button type="submit" class="btn {parent.buttonPositive}">Create Client</button>
			</footer>
		</form>
	</div>
{/if}
