<script lang="ts">
	import InvoiceDatatable from '$lib/components/invoice/InvoiceDatatable.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	let searchValues = '';
	export let invoicedJobs: PageData['invoicedJobs'];
	$: invoicedJobs =
		InvoiceFilter === 1
			? invoicedJobs.filter((d) => d.outstanding.amount <= 0)
			: InvoiceFilter === 2
			? invoicedJobs.filter((d) => d.outstanding.amount > 0)
			: invoicedJobs;
	let InvoiceFilter = 0;
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<div>
			<h2 class="h2 m-3">Invoices</h2>
			<RadioGroup
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				rounded="rounded-token"
			>
				<RadioItem bind:group={InvoiceFilter} name="justify" value={0}>All</RadioItem>
				<RadioItem bind:group={InvoiceFilter} name="justify" value={1}>Paid</RadioItem>
				<RadioItem bind:group={InvoiceFilter} name="justify" value={2}>Due</RadioItem>
			</RadioGroup>
		</div>
		<div>
			<input bind:value={searchValues} class="input variant-outline-primary" placeholder="Search" />
		</div>
	</div>
	<InvoiceDatatable {invoicedJobs} {searchValues} />
</div>
