<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	interface IClient {
		id: string;
		first_name: string;
		last_name: string;
		client_company_name: string;
		address: {
			address: string;
			id: string;
		}[];
	}
	let lastElement: HTMLTableRowElement;
	export let clientList: IClient[];

	export let searchValues;
	let counter = 50;
	const handler = new DataHandler(clientList);
	const rows = handler.getRows();
	// Jank fix for search causes initial lag when searching need to fix in future
	$: clientList,
		searchValues.length >= 2
			? handler.setRows(clientList)
			: handler.setRows(clientList.slice(0, counter));

	$: searchValues,
		handler.search(searchValues, ['first_name', 'last_name', 'address', 'client_company_name']);
	$: lastElement, lazyLoad(lastElement);

	const lazyLoad = (target: Element | undefined) => {
		if (!target) return;
		const io = new IntersectionObserver(
			(entries) => {
				const lastItem = entries.at(-1);
				if (!lastItem?.isIntersecting) return;
				counter += 50;
				io.unobserve(lastItem.target);
				handler.setRows(clientList.slice(0, counter));
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
						<a href="/admin/client/{row.id}">
							<h3 class="h3">
								{row.first_name}
								{row.last_name}
								{#if row.client_company_name}
									- {row.client_company_name}
								{/if}
							</h3>
							{#each row.address ?? [] as addr}
								<p class="text-secondary-400 break-all flex flex-col">
									{addr.address.split(',').slice(0, 2)}
								</p>
							{/each}
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
