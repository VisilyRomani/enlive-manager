<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { RecordModel } from 'pocketbase';
	export let data;

	const modalStore = getModalStore();
	let clientFilter = '';

	const newClientModal = () => {
		modalStore.trigger({ type: 'component', component: 'clientModal', title: 'CreateClient' });
	};
</script>

<div class="fixed flex flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
	<button class="btn variant-outline-secondary variant-form-material" on:click={newClientModal}
		>New Client</button
	>
	<input bind:value={clientFilter} placeholder="Search" class="input variant-form-material h-fit" />
</div>
<hr />
<div class="relative top-20 z-0 overflow-auto">
	<nav>
		<dl class="list-dl">
			{#each data.clientList ?? [] as client}
				<li class="hover:bg-surface-900 rounded-sm m-1 p-3">
					<a href="/admin/client/{client.id}">
						<span>
							<dt>{client.first_name} {client.last_name}</dt>
							{#each client.expand?.address ?? [] as addr}
								<dd class="text-gray-500 break-all w-100% flex flex-col">
									{addr.address}
								</dd>
							{/each}
						</span>
					</a>
				</li>
			{/each}
		</dl>
	</nav>
</div>
