<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	import { page } from '$app/stores';
	$: user = $page.data.user;
</script>

<AppShell
	slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 {(!user.first_name || !user.company) && 'hidden'}"
>
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<slot />
</AppShell>
