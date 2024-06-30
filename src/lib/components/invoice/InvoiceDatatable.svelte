<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	import Dinero from 'dinero.js';
	import Info from '$lib/photos/info.svelte';
	import Payment from '$lib/photos/payment.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	let lastElement: HTMLTableRowElement;

	export let searchValues;
	export let invoicedJobs: PageData['invoicedJobs'] = [];
	const modalStore = getModalStore();

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

	const openPaymentModal = (invoice_id: string, invoice_number: number, amount: number) => {
		modalStore.trigger({
			type: 'component',
			component: 'PaymentModal',
			title: 'Create Payment',
			meta: { invoice_id, invoice_number, amount }
		});
	};
</script>

<div class="table-container space-y-4">
	<table class="table table-compact table-hover table-auto w-full">
		<thead class="font-bold">
			<tr>
				<td class="p-3 table-cell-fit">Id</td>
				<td class="p-3">Name</td>
				<td class="p-3">Address</td>
				<td class="p-3 table-cell-fit">Total</td>
				<td class="p-3 table-cell-fit">Collected</td>
				<td
					on:click={() => {
						handler.sort('outstanding', 'outstanding');
					}}
					class="p-3 table-cell-fit">Outstanding</td
				>
				<td class="table-cell-fit" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td class="table-cell-fit">{row.invoice_number}</td>
					<td
						>{row.expand?.job.expand.address.expand.client.first_name}
						{row.expand?.job.expand.address.expand.client.last_name}</td
					>
					<td>{row.expand?.job.expand.address.address}</td>
					<td class="table-cell-fit">{Dinero(row.total).toFormat('$0.00')}</td>

					<td class="table-cell-fit">
						{Dinero(row.collected).toFormat('$0.00')}
					</td>
					<td
						class={`${
							row.total.amount > row.collected.amount
								? 'text-red-500'
								: row.total.amount === row.collected.amount
								? 'text-green-500'
								: 'text-warning-500'
						} table-cell-fit`}
					>
						{Dinero(row.outstanding).toFormat('$0.00')}
					</td>
					<td class="space-x-5 flex">
						<button
							class="hover:fill-secondary-500 fill-white"
							on:click={() => {
								openPaymentModal(row.id, row.invoice_number, row.outstanding.amount);
							}}
							type="button"><Payment /></button
						>
						<a href="/admin/invoice/{row.id}" class="hover:fill-secondary-500 fill-white"
							><Info /></a
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
