<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: console.log(data.invoice);
</script>

<div class="flex justify-between">
	<ol class="breadcrumb mx-3 px-3">
		<li class="crumb">
			<a class="anchor" href="/admin/invoice">
				<h3 class="h3">Invoice</h3>
			</a>
		</li>
		<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
		<li>
			<h3 class="h3">
				{data.invoice.invoice_number}
			</h3>
		</li>
	</ol>
</div>
<div class="card m-3 p-3 grid">
	<div class="mb-3 flex justify-between">
		<h5 class="h5 text-center self-center">Invoice Details</h5>
		<a href="/admin/jobs/{data.invoice.job}" class="btn variant-outline-primary">Job Details</a>
	</div>
	<hr />
	<div class="grid lg:grid-cols-2 gap-3 m-3">\</div>
</div>
