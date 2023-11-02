<script lang="ts">
	import Dinero from 'dinero.js';
	export let data;
	$: calcCost = data.job?.expand.task.reduce(
		(acc, cur) => {
			acc.subtotal = Dinero({ amount: cur.price }).multiply(cur.count).add(acc.subtotal);
			// acc.tax = cur.price * (cur.expand.service.expand.tax / 100) + acc.tax;
			acc.tax = cur.expand.service.expand.tax
				.reduce((acc, current) => {
					// = acc + cur.price * cur.count * (current.percent / 100);
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

<ol class="breadcrumb">
	<li class="crumb">
		<a class="anchor" href="/admin/jobs">
			<h3 class="h3">Jobs</h3>
		</a>
	</li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li>
		<h3 class="h3">
			{data.job?.id.slice(-4)}
		</h3>
	</li>
</ol>

<div class="card m-3 p-3">
	<div class="mb-3">
		<h5 class="h5">Client Details</h5>
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
		<span class="chip variant-filled">
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
			<!-- <td class="col-start-2">
					<p>Tax</p>
				</td> -->
		</tfoot>
	</table>
</div>
