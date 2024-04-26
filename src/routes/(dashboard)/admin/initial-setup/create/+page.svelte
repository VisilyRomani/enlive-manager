<script lang="ts">
	import { FileDropzone, ProgressBar } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { CompanySchema } from '../+page.server';
	import { onMount } from 'svelte';
	export let data: SuperValidated<Infer<CompanySchema>>;
	const { form, enhance, errors, delayed } = superForm(data, {
		dataType: 'json',
		delayMs: 500,
		timeoutMs: 8000
	});

	let files: FileList;

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
						$form.address = place.formatted_address ?? '';
					}
					return $form;
				},
				{ taint: false }
			);
		});
	});
</script>

<div class="lg:mx-60 lg:my-4 m-5 flex flex-col gap-4">
	<h1 class="h1">Setup Your Company 🏢</h1>
	<h3>General Information</h3>
	<form
		method="post"
		class="gap-4 flex flex-col"
		action="?/createCompany"
		enctype="multipart/form-data"
		use:enhance
	>
		<div class="card p-4 gap-4 grid lg:grid-cols-2">
			<div>
				<input
					class="input variant-form-material {$errors.name ? 'input-error' : undefined}"
					type="text"
					name="name"
					placeholder="Company Name"
					bind:value={$form.name}
				/>
				{#if $errors.name} <span class="text-xs text-red-500">{$errors.name}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.phone ? 'input-error' : undefined}"
					type="tel"
					name="phone"
					placeholder="Phone Number"
					bind:value={$form.phone}
				/>
				{#if $errors.phone} <span class="text-xs text-red-500">{$errors.phone}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.email ? 'input-error' : undefined}"
					type="email"
					name="email"
					placeholder="Email"
					bind:value={$form.email}
				/>
				{#if $errors.email} <span class="text-xs text-red-500">{$errors.email}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.address ? 'input-error' : undefined}"
					id="auto-complete-input"
					type="search"
					name="addr"
					placeholder="Addr.."
					bind:value={$form.address}
				/>
				{#if $errors.address} <span class="text-xs text-red-500">{$errors.address}</span>{/if}
			</div>
		</div>
		<h3>Logo Upload</h3>
		<div class="flex flex-col gap-4 justify-center items-center">
			{#if files?.length}
				<img class="rounded-lg max-h-72 w-fit" src={URL.createObjectURL(files[0])} alt="" />
			{/if}
			<FileDropzone
				class={$errors.name ? 'input-error' : undefined}
				name="logo"
				multiple={false}
				accept="image/*"
				bind:files
			/>
		</div>
		<h3>Invoice Information</h3>
		<div class=" card p-4 gap-4 grid lg:grid-cols-2">
			<div>
				<input
					class="input variant-form-material {$errors.gst ? 'input-error' : undefined}"
					type="text"
					name="gst"
					placeholder="GST Registration No."
					bind:value={$form.gst}
				/>
				{#if $errors.gst} <span class="text-xs text-red-500">{$errors.gst}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.pst ? 'input-error' : undefined}"
					type="text"
					name="pst"
					placeholder="PST Registration No."
					bind:value={$form.pst}
				/>
				{#if $errors.pst} <span class="text-xs text-red-500">{$errors.pst}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.url ? 'input-error' : undefined}"
					type="text"
					name="url"
					placeholder="Website Link"
					bind:value={$form.url}
				/>
				{#if $errors.url} <span class="text-xs text-red-500">{$errors.url}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.terms ? 'input-error' : undefined}"
					type="text"
					name="terms"
					placeholder="Terms"
					bind:value={$form.terms}
				/>
				{#if $errors.terms} <span class="text-xs text-red-500">{$errors.terms}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.days_until_due ? 'input-error' : undefined}"
					type="number"
					name="days_until_due"
					placeholder="Days Until Due"
					bind:value={$form.days_until_due}
				/>
				{#if $errors.days_until_due}
					<span class="text-xs text-red-500">{$errors.days_until_due}</span>{/if}
			</div>
			<div>
				<input
					class="input variant-form-material {$errors.days_until_final ? 'input-error' : undefined}"
					type="number"
					name="days_until_final"
					placeholder="Days Until Final Notice"
					bind:value={$form.days_until_final}
				/>
				{#if $errors.days_until_final}
					<span class="text-xs text-red-500">{$errors.days_until_final}</span>{/if}
			</div>
			<div class="lg:col-span-2">
				<textarea
					class="input variant-form-material {$errors.footer ? 'input-error' : undefined}"
					name="footer"
					placeholder="Invoice Footer"
					bind:value={$form.footer}
				/>
				{#if $errors.footer}
					<span class="text-xs text-red-500">{$errors.footer}</span>{/if}
			</div>
		</div>
		<button type="submit" class="btn variant-form-material variant-outline-secondary">Save</button>
	</form>
</div>
