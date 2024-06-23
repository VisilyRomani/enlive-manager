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
		<tbody>
			{#each $rows as row}
				<tr bind:this={lastElement}>
					<td>
						<a href="/admin/inovice/{row.id}">
							<!-- <h3 class="h3" /> -->
							<!-- {#each row.address ?? [] as addr}
								<p class="text-secondary-400 break-all flex flex-col">
									{addr.address.split(',').slice(0, 2)}
								</p>
							{/each} -->
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
