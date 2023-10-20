<script lang="ts">
	import { page } from '$app/stores';

	// check for name then check for company before allowing to show menu
	import UserInfo from '$lib/components/setup/UserInfo.svelte';

	$: setupStatus = !$page.data.user.first_name ? 0 : !$page.data.user.company ? 1 : 2;
</script>

<UserInfo />
