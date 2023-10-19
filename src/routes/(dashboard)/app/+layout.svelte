<script lang="ts">
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="pageFooter">
		<BottomNav />
	</svelte:fragment>
</AppShell>

<slot />
