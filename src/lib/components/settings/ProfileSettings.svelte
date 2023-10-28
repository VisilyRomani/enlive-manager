<script lang="ts">
	import { Avatar, FileDropzone } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/(dashboard)/admin/settings/$types';

	export let data: PageData;
</script>

<h2 class="h2">Account Settings</h2>
<form class="card p-4">
	<h3 class="h3">General Info</h3>
	<div class="flex flex-col lg:grid lg:grid-cols-2 gap-4">
		<label class="label">
			<span>First Name</span>
			<input class="input variant-form-material" type="text" value={data.user?.first_name} />
		</label>
		<label class="label">
			<span>Last Name</span>
			<input class="input variant-form-material" type="text" value={data.user?.last_name} />
		</label>
		<label class="label col-span-2">
			<span>Email</span>
			<input class="input variant-form-material" type="email" value={data.user?.email} />
		</label>
		<div class="flex flex-row gap-4 col-span-2 items-center">
			<Avatar
				initials="{data.user?.first_name[0]}{data.user?.last_name[0]}"
				background="bg-primary-500"
			/>
			<FileDropzone name="avatar" />
		</div>
	</div>
	<div class="flex flex-row-reverse mt-4">
		<button class="btn variant-form-material variant-filled-tertiary">Save</button>
	</div>
</form>
