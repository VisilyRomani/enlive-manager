<script lang="ts">
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<slot />
	<svelte:fragment slot="footer">
		<BottomNav />
	</svelte:fragment>
</AppShell>
