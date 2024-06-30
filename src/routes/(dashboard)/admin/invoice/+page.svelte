<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import CreateInvoice from '$lib/components/invoice/CreateInvoice.svelte';
	import ListInvoice from '$lib/components/invoice/ListInvoice.svelte';
	import type { PageData } from './$types';
	$: createInvoiceForm = data.createInvoiceForm;
	export let data: PageData;

	$: invoicedJobs =
		tabSet === 1
			? data.invoicedJobs.filter((d) => d.outstanding.amount <= 0)
			: tabSet === 2
			? data.invoicedJobs.filter((d) => d.outstanding.amount > 0)
			: data.invoicedJobs;
	let tabSet = 0;
</script>

<div class="p-4 flex flex-col gap-4">
	<TabGroup>
		<Tab bind:group={tabSet} name="InvoiceList" value={0}>Invoice List</Tab>
		<Tab bind:group={tabSet} name="PaidInvoice" value={1}>Paid Invoice</Tab>
		<Tab bind:group={tabSet} name="DueInvoice" value={2}>Due Invoice</Tab>
		<Tab bind:group={tabSet} name="CreateInvoice" value={3}>Create Invoice</Tab>

		<svelte:fragment slot="panel">
			{#if tabSet !== 3}
				<ListInvoice {invoicedJobs} ListType="tabset" />
			{:else if tabSet === 3}
				<CreateInvoice
					invoiceJobs={data.invoiceJobs}
					companyInvoiceDetails={data.companyInvoiceDetails}
					{createInvoiceForm}
				/>
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
