<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';

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
	<table class="table table-hover table-compact table-auto w-full">
		<thead>
			<tr>
				<td>Id</td>
				<td>Name</td>
				<td>Address</td>
				<td>Total</td>
				<td>Collected</td>
				<td>Outstanding</td>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<a href="/admin/inovice/{row.id}">
						<td>{row.job_number}</td>
						<!-- <td
							>{row.expand}
							{row.expand.address.expand.client.last_name}
						</td>
						<td>{row.expand.address.address}</td> -->
					</a>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
