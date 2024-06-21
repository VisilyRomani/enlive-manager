<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	interface IClient {
		id: string;
		first_name: string;
		last_name: string;
		address: {
			address: string;
			id: string;
		}[];
	}

	export let clientList: IClient[];
	export let searchValues;
	const handler = new DataHandler(clientList);
	const rows = handler.getRows();
	$: searchValues && handler.search(searchValues, ['first_name', 'last_name', 'address']);
</script>

<div class="table-container space-y-4">
	<table class="table table-hover table-compact table-auto w-full">
		<tbody>
			{#each $rows as row}
				<tr>
					<td>
						<a href="/admin/client/{row.id}">
							<h3 class="h3">
								{row.first_name}
								{row.last_name}
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
