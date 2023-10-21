<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	let file: FileList;
</script>

<div class="lg:mx-60 lg:my-4 m-5 flex flex-col gap-4">
	<h1 class="h1">Setup Your Company 🏢</h1>
	<h3>General Information</h3>
	<form
		method="post"
		class="gap-4 flex flex-col"
		action="?/createCompany"
		enctype="multipart/form-data"
	>
		<div class=" card p-4 gap-4 grid lg:grid-cols-2">
			<input
				class="inpdivut variant-form-material"
				type="text"
				name="name"
				placeholder="Company Name"
			/>
			<input
				class="input variant-form-material"
				type="tel"
				name="phone"
				placeholder="Phone Number"
			/>
			<input
				class="input variant-form-material lg:col-span-2"
				type="email"
				name="email"
				placeholder="Email"
			/>
			<input class="input variant-form-material" type="text" name="address" placeholder="Address" />
			<input class="input variant-form-material" type="text" name="city" placeholder="City" />
		</div>
		<h3>Logo Upload</h3>
		<div class="flex flex-col gap-4 justify-center items-center">
			{#if file?.length}
				<img class="rounded-lg max-h-72 w-fit" src={URL.createObjectURL(file[0])} alt="" />
			{/if}
			<FileDropzone name="logo" multiple={false} accept="image/*" bind:files={file} />
		</div>
		<h3>Invoice Information</h3>
		<div class=" card p-4 gap-4 grid lg:grid-cols-2">
			<input
				class="inpdivut variant-form-material"
				type="text"
				name="gst"
				placeholder="GST Registration No."
			/>
			<input
				class="inpdivut variant-form-material"
				type="text"
				name="pst"
				placeholder="PST Registration No."
			/>
			<input
				class="inpdivut variant-form-material"
				type="text"
				name="url"
				placeholder="Website Link"
			/>
			<input class="inpdivut variant-form-material" type="text" name="terms" placeholder="Terms" />
			<input
				class="inpdivut variant-form-material"
				type="number"
				name="days_until_due"
				placeholder="Days Until Due"
			/>
			<input
				class="inpdivut variant-form-material"
				type="number"
				name="days_until_final"
				placeholder="Days Until Final Notice"
			/>
			<textarea
				class="inpdivut variant-form-material lg:col-span-2"
				name="footer"
				placeholder="Footer"
			/>
		</div>
		<button type="submit" class="btn variant-form-material variant-outline-secondary">Next</button>
	</form>
</div>
