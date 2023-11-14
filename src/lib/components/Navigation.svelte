<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
	const navClose = () => {
		drawerStore.close();
	};

	const logout = async () => {
		try {
			await fetch('/auth/logout', { method: 'GET' });
			goto('/login');
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
			}
		}
	};
</script>

<nav class="list-nav p-4 flex flex-col justify-between h-full">
	<ul>
		<li>
			<a
				href="/admin/dashboard"
				class="!rounded-md {$page.url.pathname === '/admin/dashboard'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				on:click={navClose}>Dashboard</a
			>
		</li>
		<li>
			<a
				class="!rounded-md {$page.url.pathname === '/admin/client'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				href="/admin/client"
				on:click={navClose}>Client</a
			>
		</li>
		<li>
			<a
				class="!rounded-md {$page.url.pathname === '/admin/jobs'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				href="/admin/jobs"
				on:click={navClose}>Jobs</a
			>
		</li>
		<li>
			<a
				class="!rounded-md {$page.url.pathname === '/admin/schedule'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				href="/admin/schedule"
				on:click={navClose}>Schedule</a
			>
		</li>
		<li>
			<a
				class="!rounded-md {$page.url.pathname === '/admin/invoice'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				href="/admin/invoice"
				on:click={navClose}>Invoice</a
			>
		</li>
		<li>
			<a
				class="!rounded-md {$page.url.pathname === '/app/daily'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				href="/app/daily"
				on:click={navClose}>App Jobs</a
			>
		</li>
		<li>
			<a
				class="!rounded-md {$page.url.pathname === '/admin/settings'
					? '!bg-primary-900 text-cyan-50'
					: ''}"
				href="/admin/settings"
				on:click={navClose}>Settings</a
			>
		</li>
	</ul>
	<ul>
		<li>
			<button class="btn w-full variant-outline-tertiary" on:click={logout} on:click={navClose}
				>Logout</button
			>
		</li>
	</ul>
</nav>

<style>
	a {
		transition: ease 0.4s !important;
	}
</style>
