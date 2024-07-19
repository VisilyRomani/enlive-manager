<script lang="ts">
	import { getToastStore, SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/settings/$types';
	import { superForm } from 'sveltekit-superforms';
	export let data: PageData;

	const toastStore = getToastStore();

	const { form, enhance } = superForm(data.codeForm, {
		taintedMessage: false
	});

	const {
		form: formActive,
		enhance: serviceEnhance,
		submit
	} = superForm(data.taxActive, { dataType: 'json' });

	const submitForm = (id: string, active: boolean) => {
		formActive.update(
			($formActive) => {
				$formActive.id = id;
				$formActive.active = active;
				return $formActive;
			},
			{ taint: false }
		);
		submit();
	};
</script>

<div class="space-y-3">
	<h2 class="h2 m-3">Company Settings</h2>
	<div class="card p-4 space-y-3">
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
							<td>
								<form method="post" action="?/toggleWorker" use:serviceEnhance>
									<input name="id" hidden />
									<SlideToggle
										class="static z-0"
										name="active"
										disabled={row.permission === 'OWNER'}
										checked={row.active}
										on:change={() => {
											submitForm(row.id, !row.active);
										}}
									/>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="card p-4 space-y-3">
		<form use:enhance action="?/createCode" method="post">
			<h3 class="h3">Employee Connection Codes</h3>
			<div class="flex gap-3">
				<select name="permission" class="select" bind:value={$form.permission}>
					<option value="MANAGER">Manager</option>
					<option value="WORKER">Worker</option>
				</select>
				<button class="btn variant-outline-primary">New Code</button>
			</div>
		</form>

		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th>Code</th>
						<th>Permission</th>
						<th>Date Created</th>
					</tr>
				</thead>
				<tbody>
					{#each data.codes ?? [] as row}
						<tr>
							<td
								class="font-bold"
								on:click={() => {
									toastStore.trigger({
										message: `Copied Code to Clipboard`,
										background: 'bg-tertiary-500'
									});
									navigator.clipboard.writeText(row.id);
								}}>{row.id}</td
							>
							<td class="font-bold">{row.permission}</td>
							<td class="font-bold">{new Date(row.created)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
