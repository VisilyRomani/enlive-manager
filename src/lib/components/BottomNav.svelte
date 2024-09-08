<script>
	import { page } from '$app/stores';
	import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
	import Task from '$lib/photos/task.svelte';
	import Weather from '$lib/photos/weather.svelte';
	import People from '$lib/photos/people.svelte';
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
		<div class="flex justify-center">
			<Task size={30} fill={$page.url.pathname === '/app/daily' ? 'black' : 'white'} />
		</div>
		<span class="text-xs">Daily</span>
	</TabAnchor>

	<TabAnchor href="/app/forecast" selected={$page.url.pathname === '/app/forecast'}>
		<div class="flex justify-center">
			<Weather size={30} fill={$page.url.pathname === '/app/forecast' ? 'black' : 'white'} />
		</div>
		<span class="text-xs">Forecast</span>
	</TabAnchor>
	<TabAnchor href="/admin/settings" selected={$page.url.pathname === '/admin/settings'}>
		<div class="flex justify-center">
			<People size={30} fill={$page.url.pathname === '/admin/settings' ? 'black' : 'white'} />
		</div>
		<span class="text-xs">Profile</span>
	</TabAnchor>
</TabGroup>
