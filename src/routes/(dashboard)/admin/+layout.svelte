<script>
	import { AppBar, AppRail, AppRailAnchor, AppShell } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 ">
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>

	<slot />
</AppShell>
