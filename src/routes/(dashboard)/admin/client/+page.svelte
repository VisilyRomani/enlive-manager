<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let data;

	const modalStore = getModalStore();
	let clientFilter = '';

	const newClientModal = () => {
		modalStore.trigger({ type: 'component', component: 'ClientModal', title: 'Create Client' });
	};
</script>

<div class="mx-1">
	<div class="flex sticky top-0 flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
		<button class="btn variant-outline-secondary variant-form-material" on:click={newClientModal}
			>New Client</button
		>
		<input bind:value={clientFilter} placeholder="Search" class="input variant-form-material" />
	</div>

	{#if !data.clientList}
		<div>
			<div class="placeholder animate-pulse" />
		</div>
	{/if}

	<nav>
		<dl class="list-dl">
			{#each data.clientList ?? [] as client}
				<li class="hover:bg-surface-900 rounded-sm">
					<a href="/admin/client/{client.id}">
						<p class="p-3 m-1">
							<dt>{client.first_name} {client.last_name}</dt>
							{#each client.address ?? [] as addr}
								<dd class="text-gray-500 break-all w-100% flex flex-col">
									{addr.address}
								</dd>
							{/each}
						</p>
					</a>
				</li>
			{/each}
		</dl>
	</nav>
</div>
