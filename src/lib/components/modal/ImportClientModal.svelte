<script lang="ts">
	import { FileDropzone, getModalStore } from '@skeletonlabs/skeleton';
	import FileIcon from '$lib/photos/file.svelte';
	import * as XLSX from 'xlsx';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import type { BulkClientSchema } from '../../../routes/(dashboard)/admin/client/proxy+page.server';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';

	const modalStore = getModalStore();
	const cBase = 'card p-4 w-full shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	let inputFileList: FileList;
	type SheetClient = {
		Name: string;
		'Company name': string;
		Phone: string;
		Email: string;
		'Street Address': string;
	};
	type FormattedClient = {
		first_name: string;
		last_name: string;
		client_company_name: string;
		phone: string;
		email: string;
		addr: string;
	};

	let FormattedData: FormattedClient[] = [];

	const handleNewSheet = async () => {
		const ab = await inputFileList[0].arrayBuffer();
		const workbook = XLSX.read(ab);
		const ws = workbook.Sheets[workbook.SheetNames[0]];
		FormattedData = XLSX.utils.sheet_to_json<SheetClient>(ws).map((c) => {
			const nameArray = c.Name.split(' ');
			if (nameArray.length === 2) {
				return {
					first_name: nameArray[0],
					last_name: nameArray[1],
					client_company_name: c['Company name'],
					phone: c.Phone,
					email: c.Email,
					addr: c['Street Address']
				};
			} else {
				return {
					first_name: c.Name,
					last_name: '',
					client_company_name: c['Company name'],
					phone: c.Phone,
					email: c.Email,
					addr: c['Street Address']
				};
			}
		});
		form.update(
			($form) => {
				$form.clients = FormattedData.map((f) => ({ ...f }));
				return $form;
			},
			{ taint: false }
		);
	};

	const bulkClientForm: SuperValidated<Infer<BulkClientSchema>> = $page.data.bulkClient;

	const { form, enhance } = superForm(bulkClientForm, {
		dataType: 'json',
		resetForm: true,
		onSubmit({ jsonData }) {
			jsonData({ clients: $form.clients.filter((c) => !!c.first_name && !!c.addr) });
		},
		async onResult(event) {
			if (event.result.type === 'success') {
				modalStore.close();
				await invalidate('/admin/client');
			}
		}
	});
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<div>
			<FileDropzone
				name="files"
				bind:files={inputFileList}
				on:change={handleNewSheet}
				multiple="false"
				accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			>
				<svelte:fragment slot="lead"
					><div class="flex justify-center w-full">
						<FileIcon size={50} fill="white" />
						<div />
					</div></svelte:fragment
				>
				<svelte:fragment slot="message"><b>Upload a file</b> or drag and drop</svelte:fragment>
				<svelte:fragment slot="meta">XLSX, XLS and CSV allowed</svelte:fragment>
			</FileDropzone>
		</div>

		{#if FormattedData?.length}
			<div class="table-container max-h-56">
				<table class="table table-compact">
					<thead>
						<tr>
							<th class="table-cell-fit" />
							<th class="table-cell-fit">First Name</th>
							<th class="table-cell-fit">Last Name</th>
							<th class="table-cell-fit">Email</th>
							<th class="table-cell-fit">Company Name</th>
							<th class="table-cell-fit">Street Address</th>
							<th class="table-cell-fit">Phone</th>
						</tr>
					</thead>
					<tbody>
						{#each FormattedData ?? [] as client, idx}
							<tr class={`${(!client.addr || !client.first_name) && 'bg-red-400'}`}>
								<td class="table-cell-fit">{idx}</td>
								<td class="table-cell-fit">
									{client.first_name}
								</td>
								<td class="table-cell-fit">
									{client.last_name}
								</td>

								<td class="table-cell-fit">
									{client.email ?? ''}
								</td>
								<td class="table-cell-fit">
									{client.client_company_name ?? ''}
								</td>
								<td class={`table-cell-fit `}>
									{client.addr ?? ''}
								</td>
								<td class="table-cell-fit">
									{client.phone ?? ''}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
		<form use:enhance action="?/BulkImportClient" method="post">
			<input hidden name="clients" bind:value={$form.clients} />
			<div class="flex justify-between">
				<button
					type="button"
					on:click={() => {
						modalStore.close();
					}}
					class="btn variant-ghost-primary">Close</button
				>
				<button class="btn variant-ghost-success">Submit</button>
			</div>
		</form>
	</div>
{/if}
