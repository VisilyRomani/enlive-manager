<script lang="ts">
	import { page } from '$app/stores';
	import UserInfo from '$lib/components/setup/UserInfo.svelte';
	export let data;
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Enlive Manager</title>
</svelte:head>
{#if !$page.data.user.first_name}
	<UserInfo data={data.userForm} />
{:else if !$page.data.user.company}
	<div class="flex justify-center h-full items-center flex-col">
		<h1 class="h1">Welcome to Enlive Manager</h1>
		<div class="max-w-2xl mb-5">
			<p class="p-4 text-lg text-center">
				Choose between "Connect" to explore opportunities with existing businesses or "Create" to
				start your entrepreneurial journey. We're here to support you, so let's begin!
			</p>
		</div>
		<div class="gap-3 grid grid-cols-2">
			<a
				href="/admin/initial-setup/connect"
				class="btn btn-xl variant-form-material variant-ghost-primary flex-1 flex">Connect</a
			>
			<a
				href="/admin/initial-setup/create"
				class="btn btn-xl variant-form-material variant-ghost-secondary flex-1 flex">Create</a
			>
		</div>
	</div>
{/if}
