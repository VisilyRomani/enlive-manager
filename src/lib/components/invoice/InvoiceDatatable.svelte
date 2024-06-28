<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	import Dinero from 'dinero.js';

	let lastElement: HTMLTableRowElement;

	export let searchValues;
	export let invoicedJobs: PageData['invoicedJobs'] = [];

	let counter = 50;
	const handler = new DataHandler(invoicedJobs.slice(0, counter));
	const rows = handler.getRows();
	$: invoicedJobs, handler.setRows(invoicedJobs.slice(0, counter));
	$: searchValues, handler.search(searchValues);
	$: lastElement, lazyLoad(lastElement);

	const lazyLoad = (target: Element | undefined) => {
		if (!target) return;
		const io = new IntersectionObserver(
			(entries) => {
				const lastItem = entries.at(-1);
				if (!lastItem?.isIntersecting) return;
				counter += 50;
				io.unobserve(lastItem.target);
				handler.setRows(invoicedJobs.slice(0, counter));
			},
			{ rootMargin: '100px' }
		);
		io.observe(target);
	};
</script>

<div class="table-container space-y-4">
	<table class="table table-hover table-auto w-full">
		<thead class="font-bold">
			<tr>
				<td class="p-3">Id</td>
				<td class="p-3">Name</td>
				<td class="p-3">Address</td>
				<td class="p-3">Total</td>
				<td class="p-3">Collected</td>
				<td
					on:click={() => {
						handler.sort('outstanding', 'outstanding');
					}}
					class="p-3">Outstanding</td
				>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td>{row.invoice_number}</td>
					<td
						>{row.expand?.job.expand.address.expand.client.first_name}
						{row.expand?.job.expand.address.expand.client.last_name}</td
					>
					<td>{row.expand?.job.expand.address.address}</td>
					<td>{Dinero(row.total).toFormat('$0.00')}</td>

					<td>
						{Dinero(row.collected).toFormat('$0.00')}
					</td>
					<td class={`${row.total.amount > row.collected.amount && 'text-red-500'}`}>
						{Dinero(row.outstanding).toFormat('$0.00')}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
