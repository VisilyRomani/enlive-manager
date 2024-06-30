<script lang="ts">
	import InvoiceDatatable from '$lib/components/invoice/InvoiceDatatable.svelte';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	let searchValues = '';
	export let ListType = '';
	export let invoicedJobs: PageData['invoicedJobs'];
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<h2 class="h2 m-3">Invoices</h2>
		<div>
			<input bind:value={searchValues} class="input variant-outline-primary" placeholder="Search" />
		</div>
	</div>
	<InvoiceDatatable {invoicedJobs} {searchValues} />
</div>
