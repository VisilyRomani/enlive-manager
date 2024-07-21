<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	import Dinero from 'dinero.js';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import dayjs from 'dayjs';

	let lastElement: HTMLTableRowElement;

	export let searchValues;
	export let payments: PageData['payments'] = [];
	const modalStore = getModalStore();

	let counter = 50;
	const handler = new DataHandler(payments.slice(0, counter));
	const rows = handler.getRows();
	$: payments, handler.setRows(payments.slice(0, counter));
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
				handler.setRows(payments.slice(0, counter));
			},
			{ rootMargin: '100px' }
		);
		io.observe(target);
	};
</script>

<div class="table-container space-y-4">
	<table class="table table-compact table-hover table-auto w-full">
		<thead class="font-bold">
			<tr>
				<td class="p-3 table-cell-fit">Id</td>
				<td class="p-3 table-cell-fit">Invoice Number</td>
				<td class="p-3 table-cell-fit">Client</td>
				<td class="p-3 table-cell-fit">Amount Paid</td>
				<td class="p-3 table-cell-fit">Method</td>
				<td class="p-3 table-cell-fit">Reference Code</td>
				<td class="p-3 table-cell-fit">Created By</td>
				<td class="p-3 table-cell-fit">Created</td>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td class="table-cell-fit">{row.id}</td>
					<td class="table-cell-fit">
						<a class="text-primary-600" href={`/admin/invoice/${row.expand.invoice.id}`}>
							{row.expand.invoice.invoice_number}
						</a>
					</td>
					<td class="table-cell-fit">
						<a
							class="text-primary-600"
							href={`/admin/client/${row.expand.invoice.expand.job.expand.address.expand.client.id}`}
						>
							{row.expand.invoice.expand.job.expand.address.expand.client.first_name}
							{row.expand.invoice.expand.job.expand.address.expand.client.last_name}
						</a>
					</td>
					<td class="table-cell-fit">{Dinero({ amount: row.paid }).toFormat('$0.00')}</td>
					<td class="table-cell-fit">{row.method}</td>
					<td class="table-cell-fit">{row.reference_code}</td>
					<td class="table-cell-fit">
						{row.expand.created_by?.first_name || ''}
						{row.expand.created_by?.last_name || ''}
					</td>
					<td class="table-cell-fit">{dayjs(row.created).format('MMM D, YYYY h:mm A')}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
