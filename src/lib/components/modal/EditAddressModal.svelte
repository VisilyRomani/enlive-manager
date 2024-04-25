<script lang="ts">
	import { page } from '$app/stores';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../../routes/(dashboard)/admin/client/[slug]/edit/$types';
	const data = $page.data as PageData;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const { form, errors, enhance } = superForm(data.editAddress, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalStore.close();
				toastStore.trigger({ message: 'Updated Address!', background: 'bg-success-500' });
			}
		}
	});
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	$: $modalStore[0]?.meta && updateForm();

	const updateForm = () => {
		form.update(
			($form) => {
				$form = $modalStore[0].meta;
				return $form;
			},
			{ taint: false }
		);
	};
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<form class="flex gap-3 flex-col" use:enhance method="post" action="?/editAddress">
			<input hidden name="id" bind:value={$form.id} />
			<div class="w-full">
				<input
					class="input variant-form-material {$errors.address ? 'input-error' : undefined}"
					name="address"
					placeholder="Address"
					bind:value={$form.address}
				/>

				{#if $errors.address}
					<span class="text-xs text-red-500">{$errors.address}</span>{/if}
			</div>
			<div class="flex gap-3 lg:flex-row">
				<div class="w-full">
					<input
						name="lat"
						placeholder="Lat"
						class="input variant-form-material {$errors.lat ? 'input-error' : undefined}"
						bind:value={$form.lat}
					/>
					{#if $errors.lat}
						<span class="text-xs text-red-500">{$errors.lat}</span>{/if}
				</div>
				<div class="w-full">
					<input
						class="input variant-form-material {$errors.lng ? 'input-error' : undefined}"
						name="lng"
						placeholder="Lng"
						bind:value={$form.lng}
					/>
					{#if $errors.lng}
						<span class="text-xs text-red-500">{$errors.lng}</span>{/if}
				</div>
			</div>
			<SlideToggle name="active" bind:checked={$form.active}>Active</SlideToggle>
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
