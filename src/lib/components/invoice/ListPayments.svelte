<script lang="ts">
	import Payment from '$lib/photos/payment.svelte';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	import PaymentsDatatable from './PaymentsDatatable.svelte';

	let searchValues = '';

	export let payments: PageData['payments'];
	$: console.log(payments);
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<div>
			<h2 class="h2 m-3">Payments</h2>
		</div>

		<div>
			<input bind:value={searchValues} class="input variant-outline-primary" placeholder="Search" />
		</div>
	</div>
	<PaymentsDatatable {payments} {searchValues} />
</div>
