<script lang="ts">
	import { statusColor } from '$lib/helper/StyleHelper.js';
	import Dinero from 'dinero.js';
	export let data;
	$: calcCost = data.job?.expand.task?.reduce(
		(acc, cur) => {
			acc.subtotal = Dinero({ amount: cur.price }).multiply(cur.count).add(acc.subtotal);
			acc.tax = cur.expand.service.expand.tax
				.reduce((acc, current) => {
					acc = acc.add(
						Dinero({ amount: cur.price })
							.multiply(cur.count)
							.multiply(current.percent / 100)
					);
					return acc;
				}, Dinero({ amount: 0 }))
				.add(acc.tax);
			return acc;
		},
		{ tax: Dinero({ amount: 0 }), subtotal: Dinero({ amount: 0 }) }
	);
</script>

<div class="flex justify-between">
	<ol class="breadcrumb mx-3 px-3">
		<li class="crumb">
			<a class="anchor" href="/admin/jobs">
				<h3 class="h3">Jobs</h3>
			</a>
		</li>
		<li class="crumb-separator text-4xl" aria-hidden>&rsaquo;</li>
		<li>
			<h3 class="h3">
				{data.job?.job_number}
			</h3>
		</li>
	</ol>
	<div class="m-3 px-3">
		<a class="btn variant-outline-secondary" href="/admin/jobs/{data.slug}/edit">Edit</a>
	</div>
</div>
<div class="card m-3 p-3">
	<div class="mb-3 flex justify-between">
		<h5 class="h5 text-center self-center">Client Details</h5>
		<a
			href="/admin/client/{data.job?.expand.address.expand.client.id}"
			class="btn variant-outline-primary">More Details</a
		>
	</div>
	<hr />
	<div class="grid lg:grid-cols-2 gap-3 m-3">
		<p>
			{data.job?.expand.address.expand.client.first_name}
			{data.job?.expand.address.expand.client.last_name}
		</p>
		<p>
			{data.job?.expand.address.address}
		</p>
		<p>
			{data.job?.expand.address.expand.client.email}
		</p>
	</div>
</div>

<div class="card m-3 p-3">
	<div class="flex flex-row justify-between mb-3">
		<h5 class="h5">Job Tasks</h5>
		<span class="badge {statusColor(data.job?.status ?? '')}">
			{data.job?.status}
		</span>
	</div>
	<hr />
	<table class="table">
		<tbody>
			{#each data.job?.expand.task ?? [] as task}
				<tr>
					<td>
						{task.expand.service.name}
					</td>

					<td>
						{task.count} x {Dinero({ amount: task.price }).toFormat('$0.00')}
					</td>
					<td class="table-cell-fit">
						{Dinero({ amount: task.price }).multiply(task.count).toFormat('$0.00')}
					</td>
				</tr>
			{/each}
		</tbody>
		{#if calcCost}
			<tfoot>
				<tr>
					<td>
						<div>
							<h6 class="h6">Notes:</h6>
							<p class="text-gray-400">{data.job?.notes}</p>
						</div>
					</td>
					<td colspan="2">
						<div class="w-full flex flex-col items-end">
							<div class="grid grid-cols-2 justify-items-end">
								<p>Subtotal</p>
								{calcCost?.subtotal.toFormat('$0.00')}
								<p>Tax</p>
								{calcCost?.tax.toFormat('$0.00')}
								<p>Total</p>
								{calcCost?.subtotal.add(calcCost?.tax).toFormat('$0.00')}
							</div>
						</div>
					</td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
