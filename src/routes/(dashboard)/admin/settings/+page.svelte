<script lang="ts">
	import { Avatar, FileDropzone, Tab, TabGroup } from '@skeletonlabs/skeleton';
	export let data;
	console.log(data);
	$: user = data.user;
	let tabSet = 0;
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Settings</title>
</svelte:head>

<div class="p-4 flex flex-col gap-4">
	<TabGroup>
		<Tab bind:group={tabSet} name="User" value={0}>Profile</Tab>
	</TabGroup>

	<h2 class="h2">Account Settings</h2>
	<form class="card p-4">
		<h3 class="h3">General Info</h3>
		<div class="flex flex-col lg:grid lg:grid-cols-2 gap-4">
			<label class="label">
				<span>FIRST NAME</span>
				<input class="input variant-form-material" type="text" value={user?.first_name} />
			</label>
			<label class="label">
				<span>LAST NAME</span>
				<input class="input variant-form-material" type="text" value={user?.last_name} />
			</label>
			<label class="label col-span-2">
				<span>EMAIL</span>
				<input class="input variant-form-material" type="email" value={user?.email} />
			</label>
			<div class="flex flex-row gap-4 col-span-2 items-center">
				<Avatar initials="{user?.first_name[0]}{user?.last_name[0]}" background="bg-primary-500" />
				<FileDropzone name="avatar" />
			</div>
		</div>
		<div class="flex flex-row-reverse mt-4">
			<button class="btn variant-form-material variant-filled-tertiary">Save</button>
		</div>
	</form>
</div>
