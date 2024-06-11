<script lang="ts">
	import { FileDropzone, getModalStore } from '@skeletonlabs/skeleton';
	import FileIcon from '$lib/photos/file.svelte';
	import * as XLSX from 'xlsx';
	const modalStore = getModalStore();
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	let inputFileList: FileList;
	type IClient = {
		Name: String;
		client_company_name: String;
		phone: String;
		Email: String;
	};
	const sheetSchema = {
		Name: {
			prop: 'Name',
			type: String,
			required: true
		},
		'Company name': {
			prop: 'client_company_name',
			type: String
		},
		'Street Address': {
			prop: 'street'
		},
		Phone: {
			prop: 'Phone',
			type: String
		},
		Email: {
			prop: 'Email',
			type: String
		}
	};
	let FormattedData: IClient[] = [];
	$: console.log(FormattedData);
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title}</header>
		<div>
			<FileDropzone
				name="files"
				bind:files={inputFileList}
				on:change={async () => {
					const ab = await inputFileList[0].arrayBuffer();
					const workbook = XLSX.read(ab);
					const ws = workbook.Sheets[workbook.SheetNames[0]];
					const js = XLSX.utils.sheet_to_json<IClient>(ws);
					console.log(js);
				}}
				multiple="false"
				accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			>
				<svelte:fragment slot="lead"
					><div class="flex justify-center w-full">
						<FileIcon size={50} fill="white" />
						<div />
					</div></svelte:fragment
				>
				<svelte:fragment slot="message"><b>Upload a file</b> or drag and drop</svelte:fragment>
				<svelte:fragment slot="meta">XLSX and CSV allowed</svelte:fragment>
			</FileDropzone>
		</div>

		{#if FormattedData?.length}hasdata{/if}
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
	</div>
{/if}
