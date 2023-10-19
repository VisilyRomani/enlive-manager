<script>
	import { page } from '$app/stores';
	import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
</script>

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full"
>
	<TabAnchor href="/app/daily" selected={$page.url.pathname === '/app/daily'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Daily</span>
	</TabAnchor>

	<TabAnchor href="/app/forecast" selected={$page.url.pathname === '/app/forecast'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Forecast</span>
	</TabAnchor>
	<TabAnchor href="/admin/dashboard" selected={$page.url.pathname === '/admin/dashboard'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Dashboard</span>
	</TabAnchor>
</TabGroup>
