<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	export let data: PageData;
	const { form, errors, enhance } = superForm(data.editClient, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toastStore.trigger({ message: 'Client Updated', background: 'bg-success-500' });
			}
		}
	});

	type TAddress = {
		address: string;
		lat: number;
		lng: number;
		id: string;
	};

	const modalStore = getModalStore();
	const handleEditAddress = (address: TAddress) => {
		modalStore.trigger({
			type: 'component',
			title: 'Edit Address',
			component: 'EditAddressModal',
			meta: address
		});
	};
</script>

<ol class="breadcrumb m-3">
	<li class="crumb">
		<a class="anchor" href="/admin/client">
			<h3 class="h3">Clients</h3>
		</a>
	</li>
	<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
	<li>
		<a class="anchor" href="/admin/client/{data.slug}">
			<h3 class="h3">
				{data.client?.first_name}
				{data.client?.last_name}
			</h3>
		</a>
	</li>
	<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
	<li>
		<h3 class="h3">Edit</h3>
	</li>
</ol>

<div class="card m-3 p-5 grid gap-5">
	<h3 class="h3">Client Details</h3>
	<form
		class="flex gap-3 flex-col"
		id="save_client"
		action="?/saveClient"
		use:enhance
		method="post"
	>
		<input name="id" hidden value={data.client.id} />
		<div>
			<label for="first">First Name</label>
			<input
				name="first_name"
				id="first"
				bind:value={$form.first_name}
				class="input variant-form-material {$errors.first_name ? 'input-error' : undefined}"
			/>
			{#if $errors.first_name}
				<span class="text-xs text-red-500">{$errors.first_name}</span>{/if}
		</div>
		<div>
			<label for="last">Last Name</label>
			<input
				name="last_name"
				id="last"
				class="input variant-form-material"
				bind:value={$form.last_name}
			/>
		</div>
		<div>
			<label for="email">Email</label>
			<input id="email" name="email" class="input variant-form-material" bind:value={$form.email} />
		</div>
		<div>
			<label for="phone">Phone</label>
			<input id="phone" name="phone" class="input variant-form-material" bind:value={$form.phone} />
		</div>
		<div>
			<label for="notes">Notes</label>
			<textarea
				name="notes"
				id="notes"
				class="input variant-form-material"
				bind:value={$form.notes}
			/>
		</div>
	</form>
	<div class="flex flex-col gap-3">
		<h3 class="h3">Addresses</h3>
		{#each data.client.expand['address(client)'] as address}
			<div class="flex justify-between items-center">
				<p>
					{address.address}
				</p>
				<div>
					<p>
						<span class="text-gray-400">Lat:</span>
						{address.lat}
					</p>

					<p>
						<span class="text-gray-400">Lng:</span>
						{address.lng}
					</p>
				</div>
				<div>
					<button
						type="button"
						class="btn btn-sm variant-ghost-primary"
						on:click={() => handleEditAddress(address)}>Edit</button
					>
				</div>
			</div>
		{/each}
		<button type="button" class="p-1 btn btn-sm variant-ghost-primary"> + </button>
	</div>

	<button type="submit" form="save_client" class="btn variant-ghost-success">Save</button>
</div>
