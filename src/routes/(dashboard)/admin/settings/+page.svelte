<script lang="ts">
	import CompanySettings from '$lib/components/settings/CompanySettings.svelte';
	import ProfileSettings from '$lib/components/settings/ProfileSettings.svelte';
	import ServiceSettings from '$lib/components/settings/ServiceSettings.svelte';
	import TaxSettings from '$lib/components/settings/TaxSettings.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	export let data;

	let tabSet = 0;
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Settings</title>
</svelte:head>

<div class="p-4 flex flex-col gap-4">
	<TabGroup>
		<Tab bind:group={tabSet} name="Tax" value={0}>Tax</Tab>
		<Tab bind:group={tabSet} name="Services" value={1}>Services</Tab>
		<Tab bind:group={tabSet} name="User" value={2}>Profile</Tab>
		{#if data.user?.permission === 'OWNER'}
			<Tab bind:group={tabSet} name="Company" value={3}>Company</Tab>
		{/if}
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<TaxSettings {data} />
			{:else if tabSet === 1}
				<ServiceSettings {data} />
			{:else if tabSet === 2}
				<ProfileSettings {data} />
			{:else if tabSet === 3}
				<CompanySettings {data} />
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
