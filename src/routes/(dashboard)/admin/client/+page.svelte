<script lang="ts">
	import {
		getModalStore,
		type TableSource,
		tableMapperValues,
		Table
	} from '@skeletonlabs/skeleton';
	import PocketBase from 'pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	export let data;

	type ClientList = {
		id: string;
		first_name: string;
		last_name: string;
		expand?: { address: { address: string; city: string }[] };
	}[];
	let company_clients: ClientList = [];
	const client = new PocketBase(PUBLIC_POCKETBASE_URL);

	let clientFilter = '';
	onMount(async () => {
		client.authStore.loadFromCookie(document.cookie ?? '');

		company_clients = (await client.collection('clients').getFullList({
			expand: 'address',
			fields: 'first_name, last_name, id,expand'
		})) as ClientList;
		client.authStore.onChange(() => {
			document.cookie = client.authStore.exportToCookie({ httpOnly: false });
		});
		client.collection('clients').subscribe('*', ({ action, record }) => {
			switch (action) {
				case 'create':
					// data.clients.push(record);
					break;
				case 'update':
					break;
			}
		});
	});

	onDestroy(() => {
		client.collection('clients').unsubscribe('*');
	});
	// const tableSource: TableSource = {
	// 	head: ['first_name', 'last_name', 'email', 'address']
	// 	// body: tableMapperValues(data.clients, ['first_name', 'last_name', 'email', 'address'])
	// };

	const newClientModal = () => {
		modalStore.trigger({ type: 'component', component: 'clientModal', title: 'CreateClient' });
	};
</script>

<div>
	<div class="relative card w-full rounded-md flex flex-row items-center p-4 gap-4">
		<button class="btn variant-outline-secondary variant-form-material" on:click={newClientModal}
			>New Client</button
		>
		<input bind:value={clientFilter} placeholder="Search" class="input h-fit" />
	</div>
	<nav class="list-nav flex flex-col p-4 h-full overflow-auto absolute w-full">
		<ul>
			{#each company_clients as client}
				<li>
					<a href="/admin/client/{client.id}">
						<span class="badge bg-primary-500">💀</span>
						<span class="flex-auto">
							<dt>{client.first_name} {client.last_name}</dt>
							{#each client.expand?.address ?? [] as addr}
								<dd class="text-gray-500">{addr.address}, {addr.city}</dd>
							{/each}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<style>
</style>
