<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	import { invalidateAll } from '$app/navigation';
	const data = $page.data as PageData;
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const {
		form: paymentForm,
		errors,
		enhance
	} = superForm(data.createPaymentForm, {
		onError: (e) => {
			console.log(e);
			toastStore.trigger({ message: 'Failed to Create Payment!', background: 'bg-error-500' });
		},
		onResult: async ({ result }) => {
			console.log(result.type);
			if (result.type === 'success') {
				modalStore.close();
				invalidateAll();
				toastStore.trigger({ message: 'Payment Created!', background: 'bg-success-500' });
			}
		}
	});
	$: $modalStore[0]?.meta?.amount,
		paymentForm.update(($paymentForm) => {
			if ($modalStore[0]?.meta?.amount) {
				$paymentForm.paid = $modalStore[0].meta?.amount / 100;
			}
			return $paymentForm;
		});

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title} - {$modalStore[0].meta.invoice_number}</header>
		<form class="flex gap-3 flex-col" use:enhance method="post" action="?/CreatePayment">
			<input type="text" name="invoice" hidden bind:value={$modalStore[0].meta.invoice_id} />
			<select
				bind:value={$paymentForm.method}
				name="method"
				class={`input variant-outline-primary ${$errors.method ? 'input-error' : undefined}`}
			>
				<option value="CASH"> Cash </option>
				<option value="CHEQUE"> Cheque </option>
				<option value="E-TRANSFER"> E-Transfer </option>
				<option value="CREDIT"> Credit</option>
				<option value="DEBIT"> Debit</option>
			</select>
			{#if $errors.method}
				<span class="text-xs text-red-500">{$errors.method}</span>
			{/if}
			{#if $paymentForm.method !== 'CASH'}
				<input
					type="text"
					name="reference_code"
					placeholder="Payment Identifier"
					class={`input variant-outline-primary ${
						$errors.reference_code ? 'input-error' : undefined
					}`}
					bind:value={$paymentForm.reference_code}
				/>
				{#if $errors.reference_code}
					<span class="text-xs text-red-500">{$errors.reference_code}</span>
				{/if}
			{/if}
			<input
				class={`input variant-outline-primary ${$errors.paid ? 'input-error' : undefined}`}
				name="paid"
				placeholder="Amount Paid"
				type="number"
				step="any"
				bind:value={$paymentForm.paid}
			/>
			{#if $errors.paid}
				<span class="text-xs text-red-500">{$errors.paid}</span>
			{/if}

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
