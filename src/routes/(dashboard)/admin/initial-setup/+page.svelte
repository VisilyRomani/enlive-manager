<script lang="ts">
	import { page } from '$app/stores';
	// check for name then check for company before allowing to show menu
	import UserInfo from '$lib/components/setup/UserInfo.svelte';
	import NewCompany from '$lib/components/setup/NewCompany.svelte';
	import { RadioGroup, RadioItem, Step, Stepper } from '@skeletonlabs/skeleton';
	export let data;
	let value: number = 0;

	// TODO: create option to create company or connect
	// then move form from components to parent component
</script>

<div class="text-center space-y-3">
	<h2 class="h2">Welcome!</h2>
	<h3 class="h3">Would you like to Create or Connect to a company?</h3>

	<a class="btn variant-ghost-primary" href="/admin/initial-setup/create">Create</a>
	<a class="btn variant-ghost-primary" href="/admin/initial-setup/connect">Connect</a>
</div>
