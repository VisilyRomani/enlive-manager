<script lang="ts">
	import { Autocomplete, getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/invoice/$types';
	import { superForm } from 'sveltekit-superforms';
	import type { TJobInvoice } from '../../../routes/(dashboard)/admin/invoice/+page.server';
	import Dinero from 'dinero.js';
	import dayjs from 'dayjs';
	export let invoiceJobs: PageData['invoiceJobs'];
	export let companyInvoiceDetails: PageData['companyInvoiceDetails'];
	export let createInvoiceForm: PageData['createInvoiceForm'];
	let selectedJobData: TJobInvoice | undefined;
	let offsetJobWidth = 0;
	const toastStore = getToastStore();
	let previewPDf: Blob;

	const { form, errors, enhance } = superForm(createInvoiceForm, {
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toastStore.trigger({
					message: `Invoice NO. ${invoiceData.selectedJobData?.job_number} sent`,
					background: 'bg-success-500'
				});
				selectedJobData = undefined;
			}
		}
	});

	$: invoiceData = {
		companyInvoiceDetails,
		selectedJobData
	};
	$: invoiceData && updateFormJob();
	$: invoiceData && generatePdfPreview();

	const generatePdfPreview = async () => {
		if (selectedJobData) {
			const result = await fetch('/admin/api/invoice', {
				method: 'POST',
				body: JSON.stringify({
					...invoiceData,
					issue_date: $form.issue_date,
					due_date: $form.due_date
				})
			});
			previewPDf = await result.blob();
			form.update(
				($form) => {
					$form.invoice_pdf = new File([previewPDf], 'pdf');
					return $form;
				},
				{ taint: false }
			);
		}
	};

	const updateFormJob = () => {
		form.update(
			($form) => {
				$form.invoice_data =
					invoiceData.selectedJobData?.expand.task.map((t) => ({
						service: t.expand.service.id,
						price: t.price,
						quantity: t.count
					})) ?? [];
				return $form;
			},
			{ taint: false }
		);
	};

	const popupJob: PopupSettings = {
		event: 'focus-click',
		target: 'job-popup',
		placement: 'bottom'
	};
</script>

<form use:enhance action="?/CreateInvoice" method="post" enctype="multipart/form-data">
	<input hidden name="jobId" bind:value={$form.jobId} />
	<input hidden name="invoice_number" bind:value={$form.invoice_number} />
	<input hidden name="invoice_data" />
	<input hidden name="invoice_pdf" bind:value={$form.invoice_pdf} />

	<div class="space-y-3">
		<div class="flex justify-between">
			<h2 class="h2 m-3">Create Invoice</h2>
			<div class="">
				<button
					class="btn variant-ghost-primary"
					type="button"
					disabled={!previewPDf}
					on:click={() => {
						let pdfURl = URL.createObjectURL(previewPDf);
						window.open(pdfURl, 'invoice_pdf', 'resizable');
					}}>Preview</button
				>
				<button class="btn variant-ghost-success" type="submit">Send</button>
			</div>
		</div>

		<label class="label">
			<span>Select Job</span>
			<div bind:offsetWidth={offsetJobWidth}>
				<input
					class="input variant-form-material"
					type="search"
					id="job-popup"
					autocomplete="off"
					use:popup={popupJob}
					placeholder="Select Job"
					value={selectedJobData?.job_number || null}
				/>
				<div data-popup="job-popup" class="w-full z-50">
					<div class="card max-h-60 overflow-auto w-[${offsetJobWidth + 'px'}]">
						<Autocomplete
							options={invoiceJobs.map((i) => ({ label: String(i.job_number), value: i.id }))}
							on:selection={(e) => {
								selectedJobData = invoiceJobs.find((j) => j.id === e.detail.value);
								form.update(
									($form) => {
										$form.jobId = e.detail.value;
										$form.invoice_number = Number(e.detail.label);
										$form.client_email = selectedJobData?.expand.address.expand.client.email ?? '';
										return $form;
									},
									{ taint: false }
								);
							}}
						/>
					</div>
				</div>
			</div>
		</label>

		{#if selectedJobData}
			<div class="grid lg:grid-cols-2 gap-3">
				<div>
					<div class="card p-3">
						<h3 class="text-2xl font-bold text-center">Client Details</h3>
					</div>
					<label class="label">
						<span>Client</span>
						<input
							type="text"
							placeholder="Client"
							class="input variant-form-material"
							value={`${invoiceData.selectedJobData?.expand.address.expand.client?.first_name} ${selectedJobData.expand.address.expand.client?.last_name}`}
						/>
					</label>
					<label class="label">
						<span>Address</span>
						<input
							type="text"
							placeholder="Address"
							class="input variant-form-material"
							value={invoiceData.selectedJobData?.expand.address.address}
						/>
					</label>
					<label class="label">
						<span>Email</span>
						<input
							type="text"
							placeholder="Email"
							class="input variant-form-material"
							bind:value={$form.client_email}
						/>
					</label>

					<label class="label">
						<span>Issue Date</span>
						<input
							type="date"
							placeholder="Issue Date"
							class="input variant-form-material"
							name="issue_date"
							bind:value={$form.issue_date}
							on:change={(e) => {
								form.update(
									($form) => {
										const date = dayjs(e.currentTarget.value).add(
											invoiceData.companyInvoiceDetails.days_until_due,
											'days'
										);
										$form.due_date = date.format('YYYY-MM-DD');
										return $form;
									},
									{ taint: false }
								);
							}}
						/>
					</label>
					<label class="label">
						<span>Due Date</span>
						<input
							type="date"
							placeholder="Due Date"
							class="input variant-form-material"
							name="due_date"
							bind:value={$form.due_date}
						/>
					</label>
				</div>

				<div>
					<div class="card p-3">
						<h3 class="text-2xl font-bold text-center">Company Details</h3>
					</div>
					<label class="label">
						<span>Company Name</span>
						<input
							type="text"
							placeholder="Company Name"
							name="companyName"
							class="input variant-form-material"
							bind:value={invoiceData.companyInvoiceDetails.name}
						/>
					</label>
					<label class="label">
						<span>Company Email</span>
						<input
							type="text"
							placeholder="Company Email"
							name="companyEmail"
							class="input variant-form-material"
							bind:value={invoiceData.companyInvoiceDetails.email}
						/>
					</label>
					<label class="label">
						<span>Company Phone</span>
						<input
							type="text"
							placeholder="Company Phone"
							name="companyPhone"
							class="input variant-form-material"
							bind:value={invoiceData.companyInvoiceDetails.phone}
						/>
					</label>
					<label class="label">
						<span>Company URL</span>
						<input
							type="text"
							placeholder="Company URL"
							name="companyURL"
							class="input variant-form-material"
							bind:value={invoiceData.companyInvoiceDetails.url}
						/>
					</label>
				</div>
			</div>
			<div class="table-container">
				<table class="table">
					<thead>
						<tr>
							<th>Item</th>
							<th>Quantity</th>
							<th>Rate</th>
							<th>Tax</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each invoiceData.selectedJobData?.expand.task ?? [] as task}
							<tr>
								<td class="font-bold">{task.expand.service.name}</td>
								<td class="font-bold">{task.count}</td>
								<td class="font-bold">{Dinero({ amount: task.price }).toFormat('$0.00')}</td>
								<td class="font-bold"
									>{#each task.expand.service.expand.tax as tax}
										{tax.name}-{tax.percent}%
									{/each}</td
								>
								<td class="font-bold"
									>{Dinero({ amount: task.price })
										.multiply(task.count)
										.add(
											Dinero({ amount: task.price })
												.multiply(task.count)
												.multiply(
													task.expand.service.expand.tax.reduce((acc, cur) => {
														acc = acc + cur.percent;
														return acc;
													}, 0) * 0.01
												)
										)
										.toFormat('$0.00')}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div>
				<button type="button" class="btn variant-outline-primary">Add Row</button>
			</div>
			<textarea
				class="input"
				placeholder="Note"
				bind:value={invoiceData.companyInvoiceDetails.footer}
			/>
		{/if}
	</div>
</form>
