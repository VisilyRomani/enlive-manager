<script lang="ts">
	import { page } from '$app/stores';
	// check for name then check for company before allowing to show menu
	import UserInfo from '$lib/components/setup/UserInfo.svelte';
	import NewCompany from '$lib/components/setup/NewCompany.svelte';
	export let data;

	$: setupStatus = !$page.data.user.first_name ? 0 : !$page.data.user.company ? 1 : 2;
</script>

{#if setupStatus === 0}
	<UserInfo data={data.userForm} />
{:else if setupStatus === 1}
	<NewCompany data={data.companyForm} />
{:else if setupStatus === 3}
	<p>should not see this</p>
{/if}
