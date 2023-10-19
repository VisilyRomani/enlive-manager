<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	import { page } from '$app/stores';
	$: showNav = $page.url.pathname === '/admin/initial-setup' && 'hidden';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 {showNav}">
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>

	<slot />
</AppShell>
