<script lang="ts">
	import { page } from '$app/stores';
	// check for name then check for company before allowing to show menu
	import UserInfo from '$lib/components/setup/UserInfo.svelte';
	import NewCompany from '$lib/components/setup/NewCompany.svelte';
	import { Step, Stepper } from '@skeletonlabs/skeleton';
	export let data;
</script>

<!-- Create Toast for Error Responses in User and company -->
<Stepper class="lg:mx-28">
	<Step locked={!$page.data.user.first_name}>
		<UserInfo data={data.userForm} />
	</Step>
	<Step locked={!$page.data.user.company}>
		<NewCompany data={data.companyForm} />
	</Step>
</Stepper>
