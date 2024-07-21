<script lang="ts">
	import { RadioGroup, RadioItem, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import CreateInvoice from '$lib/components/invoice/CreateInvoice.svelte';
	import ListInvoice from '$lib/components/invoice/ListInvoice.svelte';
	import type { PageData } from './$types';
	import ListPayments from '$lib/components/invoice/ListPayments.svelte';
	$: createInvoiceForm = data.createInvoiceForm;
	export let data: PageData;

	let tabSet = 0;
</script>

<div class="p-4 flex flex-col gap-4">
	<TabGroup>
		<Tab bind:group={tabSet} name="InvoiceList" value={0}>Invoice List</Tab>
		<Tab bind:group={tabSet} name="CreateInvoice" value={1}>Create Invoice</Tab>
		<Tab bind:group={tabSet} name="CreateInvoice" value={2}>Payments List</Tab>

		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<ListInvoice invoicedJobs={data.invoicedJobs} />
			{:else if tabSet === 1}
				<CreateInvoice
					invoiceJobs={data.invoiceJobs}
					companyInvoiceDetails={data.companyInvoiceDetails}
					{createInvoiceForm}
				/>
			{:else if tabSet === 2}
				<ListPayments payments={data.payments} />
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
