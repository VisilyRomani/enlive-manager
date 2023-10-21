<script lang="ts">
	import { page } from '$app/stores';
	// check for name then check for company before allowing to show menu
	import UserInfo from '$lib/components/setup/UserInfo.svelte';
	import NewCompany from '$lib/components/setup/NewCompany.svelte';

	$: setupStatus = !$page.data.user.first_name ? 0 : !$page.data.user.company ? 1 : 2;
	$: console.log(setupStatus);
</script>

{#if setupStatus === 0}
	<UserInfo />
{:else if setupStatus === 1}
	<NewCompany />
{:else if setupStatus === 3}
	<p>should not see this</p>
{/if}
