<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Datatable from './Datatable.svelte';
	export let data;

	const modalStore = getModalStore();
	$: searchValues = '';

	const newClientModal = () => {
		modalStore.trigger({ type: 'component', component: 'ClientModal', title: 'Create Client' });
	};
	const importClientModal = () => {
		modalStore.trigger({
			type: 'component',
			component: 'ImportClientModal',
			title: 'Import Client'
		});
	};
</script>

<div class="mx-1">
	<div class="flex sticky top-0 flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
		<button class="btn variant-outline-secondary variant-form-material" on:click={newClientModal}
			>New Client</button
		>
		<button
			class="btn variant-outline-secondary variant-form-material hidden lg:block"
			on:click={importClientModal}>Import</button
		>
		<input bind:value={searchValues} placeholder="Search" class="input variant-form-material" />
	</div>

	{#if !data.clientList}
		<div>
			<div class="placeholder animate-pulse" />
		</div>
	{/if}

	<nav class="mt-1">
		<Datatable clientList={data.clientList} {searchValues} />
	</nav>
</div>
