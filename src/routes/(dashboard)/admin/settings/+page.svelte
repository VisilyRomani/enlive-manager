<script lang="ts">
	import ProfileSettings from '$lib/components/settings/ProfileSettings.svelte';
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

		<Tab bind:group={tabSet} name="User" value={1}>Profile</Tab>
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<TaxSettings {data} />
			{:else if tabSet === 1}
				<ProfileSettings {data} />
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
