<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
	const navClose = () => {
		drawerStore.close();
	};
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/admin/dashboard" on:click={navClose}>Dashboard</a></li>
		<li><a href="/admin/client" on:click={navClose}>Client</a></li>
		<li><a href="/admin/jobs" on:click={navClose}>Jobs</a></li>
		<li><a href="/admin/schedule" on:click={navClose}>Schedule</a></li>
		<li><a href="/admin/invoice" on:click={navClose}>Invoice</a></li>
		<li><a href="/admin/settings" on:click={navClose}>Settings</a></li>
		<li><a href="/app/daily" on:click={navClose}>App Jobs</a></li>
	</ul>
</nav>
