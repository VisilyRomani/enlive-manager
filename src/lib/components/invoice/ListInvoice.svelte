<script lang="ts">
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';

	export let invoicedJobs: PageData['invoicedJobs'];
	$: console.log(invoicedJobs);
</script>

test
