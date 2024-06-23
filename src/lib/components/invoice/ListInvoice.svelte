<script lang="ts">
	import InvoiceDatatable from '$lib/components/invoice/InvoiceDatatable.svelte';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	let searchValues = '';
	export let invoicedJobs: PageData['invoicedJobs'];
	$: console.log(invoicedJobs);
</script>

<InvoiceDatatable {invoicedJobs} {searchValues} />
