<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import Dinero from 'dinero.js';
	/** Dashboard Statistics - 
 * Completed Jobs revenue - 1 month - 3 months - yearly - 
* Invoices - overdue - not due yet - last 365 days -
amount of Jobs Created - last 30 - scheduled - completed */
	export let data: PageData;
	let selected_month = 12;

	$: console.log(data);
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Enlive Manager</title>
</svelte:head>
<div class="flex flex-col items-center w-full p-3">
	<h2 class="h2 mb-5">Dashboard Statistics</h2>
	<div class="grid grid-cols-1 lg:grid-cols-3 w-full gap-5">
		<div class="card h-fit p-3 flex flex-col items-center">
			<p class="font-bold text-gray-300 mr-auto">Gross Revenue</p>
			<hr class="w-full" />
			{#if selected_month === 1}
				<h2 class="h2 p-3">{Dinero(data.company_finance.gross_month).toFormat('$0.00')}</h2>
			{:else if selected_month === 3}
				<h2 class="h2 p-3">{Dinero(data.company_finance.gross_three_month).toFormat('$0.00')}</h2>
			{:else if selected_month === 12}
				<h2 class="h2 p-3">{Dinero(data.company_finance.gross_year).toFormat('$0.00')}</h2>
			{/if}

			<div class="mt-auto flex w-full justify-end">
				<select class="select w-fit h-10" bind:value={selected_month}>
					<option value={1}>1 Month</option>
					<option value={3}>3 Month</option>
					<option value={12}>12 Month</option>
				</select>
			</div>
		</div>
		<div class="card p-3 flex flex-col h-fit">
			<div class="mb-5">
				<p class="font-bold font-sans text-gray-300 mr-auto">Invoices</p>
				<hr class="w-full" />
				<h4 class="h4 font-bold font-sans">
					{Dinero(data.company_finance.unpaid_overdue)
						.add(Dinero(data.company_finance.unpaid_not_due_yet))
						.toFormat('$0.00')} UNPAID
					<span class="font-normal font-sans text-sm">Last 365 days</span>
				</h4>
				<div class="w-full flex justify-between">
					<div>
						<p class="font-bold text-orange-500">
							{Dinero(data.company_finance.unpaid_overdue).toFormat('$0.00')}
						</p>
						<p>Overdue</p>
					</div>
					<div>
						<p class="text-right">
							{Dinero(data.company_finance.unpaid_not_due_yet).toFormat('$0.00')}
						</p>
						<p class="text-right">Not Due Yet</p>
					</div>
				</div>
				<ProgressBar
					height="h-5"
					meter="bg-orange-500"
					value={Dinero(data.company_finance.unpaid_overdue).toObject().amount}
					max={Dinero(data.company_finance.unpaid_overdue).toObject().amount +
						Dinero(data.company_finance.unpaid_not_due_yet).toObject().amount}
				/>
			</div>
			<div class="mb-5">
				<h4 class="h4 font-bold font-sans">
					{Dinero(data.company_finance.paid_month).toFormat('$0.00')} Paid
					<span class="font-normal font-sans text-sm">Last 30 days</span>
				</h4>
			</div>
		</div>
		<div class="card p-3 flex flex-col items-center h-fit">
			<p class="font-bold text-gray-300 mr-auto">
				Jobs Created <span class="font-normal text-sm">(last 30 days)</span>
			</p>
			<hr class="w-full" />
			<h2 class="h2 p-3">{data.month_job_count}</h2>
		</div>
	</div>
</div>
