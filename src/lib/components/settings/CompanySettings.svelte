<script lang="ts">
	import { Avatar, FileDropzone } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/settings/$types';

	export let data: PageData;
</script>

<div class="space-y-3">
	<h2 class="h2 m-3">Company Settings</h2>
	<form class="card p-4">
		<h3 class="h3">Employees</h3>
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Permission</th>
						<th>Active</th>
					</tr>
				</thead>
				<tbody>
					{#each data.employees ?? [] as row, i}
						<tr>
							<td class="font-bold">{row.first_name} {row.last_name}</td>
							<td class="font-bold">{row.permission}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</form>

	<form class="card p-4">
		<h3 class="h3">Employee Connection Codes</h3>
	</form>
</div>
