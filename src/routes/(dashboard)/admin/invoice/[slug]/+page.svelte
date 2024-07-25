<script lang="ts">
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	export let data: PageData;
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Dinero from 'dinero.js';
	const modalStore = getModalStore();

	const openPaymentModal = (invoice_id: string, invoice_number: number, amount: number) => {
		modalStore.trigger({
			type: 'component',
			component: 'PaymentModal',
			title: 'Create Payment',
			meta: { invoice_id, invoice_number, amount }
		});
	};
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
<div class="card m-3 p-3 grid space-y-1">
	<div class="mb-3 flex justify-between">
		<h5 class="h5 text-center self-center">Invoice Details</h5>
		<a href="/admin/jobs/{data.invoice.job}" class="btn variant-outline-primary">Job Details</a>
	</div>
	<div class="flex flex-row space-x-3">
		{#if data.invoice.cancelled}
			<div>
				<p class="chip variant-ghost-error">Cancelled</p>
			</div>
		{/if}
		{#if data.invoice.modified}
			<div>
				<p class="chip variant-ghost-warning">Modified</p>
			</div>
		{/if}
	</div>
	<hr />
	<div class="grid lg:grid-cols-4 grid-cols-2 gap-3 m-3">
		<div>
			<p class="font-bold">Invoice Number</p>
			<p>{data.invoice.invoice_number}</p>
		</div>
		<div>
			<p class="font-bold">Client:</p>
			<p>
				<a
					class="text-sky-200"
					href={`/admin/client/${data.invoice.expand.job.expand.address.expand.client.id}`}
				>
					{data.invoice.expand.job.expand.address.expand.client.first_name}
					{data.invoice.expand.job.expand.address.expand.client.last_name}
				</a>
			</p>
		</div>
		<div>
			<p class="font-bold">Invoice Date:</p>
			<p>{dayjs(data.invoice.issue_date).format('D/M/YYYY')}</p>
		</div>
		<div>
			<p class="font-bold">Due Date:</p>
			<p>{dayjs(data.invoice.due_date).format('D/M/YYYY')}</p>
		</div>
	</div>
	<div class="grid lg:grid-cols-4 grid-cols-2 gap-3 m-3" />
</div>

<div class="card m-3 p-3 grid space-y-1">
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>Rate</th>
					<th>Quantity</th>
					<th>Tax</th>
					<th>Tax Amount</th>
					<th>Line Total</th>
				</tr>
			</thead>
			<tbody>
				{#each data.invoice.expand.invoice_data as id}
					<tr>
						<td>{id.expand.service.name}</td>
						<td>{Dinero({ amount: id.price }).toFormat('$0.00')}</td>
						<td>{id.quantity}</td>
						<td class="space-x-1">
							{#each id.expand.service.expand.tax as tax}
								<p class="chip variant-ghost-primary">{tax.name}</p>
							{/each}
						</td>
						<td class="space-x-1">
							{Dinero({ amount: id.price })
								.multiply(id.quantity)
								.multiply(
									id.expand.service.expand.tax.reduce((acc, cur) => {
										return (acc = acc + cur.percent);
									}, 0) / 100
								)
								.toFormat('$0.00')}
						</td>
						<td>{Dinero({ amount: id.price }).multiply(id.quantity).toFormat('$0.00')}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th colspan="4" class="!m-0 !p-0" />
					<td class="float-right !m-0 !px-1 !py-2">SubTotal</td>
					<td class="m-0 !px-4 !py-2">
						{data.invoice.expand.invoice_data
							.reduce((acc, cur) => {
								acc = acc.add(Dinero({ amount: cur.price }).multiply(cur.quantity));
								return acc;
							}, Dinero({ amount: 0 }))
							.toFormat('$0.00')}
					</td>
				</tr>
				<tr>
					<th colspan="4" class="!m-0 !p-0" />
					<td class="float-right !m-0 !px-1 !py-2">Tax</td>
					<td class="m-0 !px-4 !py-2"
						>{data.invoice.expand.invoice_data
							.reduce((acc, cur) => {
								const tax =
									cur.expand.service.expand.tax.reduce((acc, cur) => {
										return (acc = acc += cur.percent);
									}, 0) / 100;

								return (acc = acc.add(
									Dinero({ amount: cur.price }).multiply(cur.quantity).multiply(tax)
								));
							}, Dinero({ amount: 0 }))
							.toFormat('$0.00')}
					</td>
				</tr>
				<tr>
					<th colspan="4" class="!m-0 !p-0" />
					<td class="float-right !m-0 !px-1 !py-2">Total</td>
					<td class="m-0 !px-4 !py-2"
						>{data.invoice.expand.invoice_data
							.reduce((acc, cur) => {
								const tax =
									cur.expand.service.expand.tax.reduce((acc, cur) => {
										return (acc = acc += cur.percent);
									}, 0) / 100;
								const sub = Dinero({ amount: cur.price }).multiply(cur.quantity);
								return (acc = acc.add(sub.multiply(tax).add(sub)));
							}, Dinero({ amount: 0 }))
							.toFormat('$0.00')}</td
					>
				</tr>
				<tr>
					<th colspan="4" class="!m-0 !p-0" />
					<td class="float-right !m-0 !px-1 !py-2">Paid</td>
					<td class="m-0 !px-4 !py-2">
						{Dinero(data.invoice.paid).toFormat('$0.00')}
					</td>
				</tr>
				<tr class="font-bold">
					<th colspan="4" class="!m-0 !p-0" />
					<td class="float-right !m-0 !px-1 !py-2">Outstanding</td>
					<td class="m-0 !px-4 !py-2">
						{Dinero(data.invoice.total).subtract(Dinero(data.invoice.paid)).toFormat('$0.00')}
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>

<hr class="m-3" />
<div class="m-3">
	<button
		class="btn variant-ghost-primary"
		type="button"
		on:click={() => {
			openPaymentModal(
				data.invoice.id,
				data.invoice.invoice_number,
				Dinero(data.invoice.total).subtract(Dinero(data.invoice.paid)).getAmount()
			);
		}}
		>Add Payment
	</button>
	<button
		class="btn variant-ghost-primary"
		type="button"
		on:click={() => {
			window.open(data.invoice.pdf_url, 'invoice_pdf', 'resizable');
		}}>Print</button
	>
</div>
