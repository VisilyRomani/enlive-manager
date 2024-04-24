<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import CreateInvoice from '$lib/components/invoice/CreateInvoice.svelte';
	import type { PageData } from './$types';
	$: createInvoiceForm = data.createInvoiceForm;
	export let data: PageData;
	let tabSet = 0;
</script>

<div class="p-4 flex flex-col gap-4">
	<TabGroup>
		<Tab bind:group={tabSet} name="InvoiceList" value={0}>Invoice List</Tab>
		<Tab bind:group={tabSet} name="PaidInvoice" value={1}>Paid Invoice</Tab>
		<Tab bind:group={tabSet} name="DueInvoice" value={2}>Due Invoice</Tab>
		<Tab bind:group={tabSet} name="CreateInvoice" value={3}>Create Invoice</Tab>

		<svelte:fragment slot="panel">
			{#if tabSet === 3}
				<!-- <TaxSettings {data} /> -->
			{:else if tabSet === 1}
				<!-- <ServiceSettings {data} /> -->
			{:else if tabSet === 2}
				<!-- <ProfileSettings {data} /> -->
			{:else if tabSet === 0}
				<CreateInvoice
					invoiceJobs={data.invoiceJobs}
					companyInvoiceDetails={data.companyInvoiceDetails}
					{createInvoiceForm}
				/>
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
