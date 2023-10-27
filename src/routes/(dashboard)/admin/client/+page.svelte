<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let data;

	const modalStore = getModalStore();
	let company_clients = data.clientList ?? [];
	let clientFilter = '';

	const newClientModal = () => {
		modalStore.trigger({ type: 'component', component: 'clientModal', title: 'CreateClient' });
	};
</script>

<div class="h-[30em]">
	<div class="card variant-soft-surface w-full rounded-md flex flex-row items-center p-4 gap-4">
		<button class="btn variant-outline-secondary variant-form-material" on:click={newClientModal}
			>New Client</button
		>
		<input
			bind:value={clientFilter}
			placeholder="Search"
			class="input variant-form-material h-fit"
		/>
	</div>
	<nav
		class="list-nav flex flex-col p-4 m-4 h-[20em] card variant-soft-surface overflow-auto items-center"
	>
		<ul class="w-full">
			{#each company_clients as client}
				<li class="w-full block">
					<a href="/admin/client/{client.id}">
						<span>
							<dt>{client.first_name} {client.last_name}</dt>
							{#each client.expand?.address ?? [] as addr}
								<dd class="text-gray-500 text-sm break-all">
									{addr.address}
								</dd>
							{/each}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
