<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	export let data;

	const { form, enhance, errors } = superForm(data.connectionForm);
</script>

<div class="flex justify-center">
	<div class="card m-3 p-10 text-center space-y-3">
		<h2 class="h2">Company Connection Verification</h2>
		<p class="text-lg">Enter the code provided by the company.</p>
		<form class="flex gap-3" use:enhance method="post" action="?/connectCompany">
			<input hidden name="user" value={data.user?.id} />
			<div class="w-full flex flex-col gap-1">
				<input
					class="input variant-ghost-primary"
					placeholder="Code"
					name="code"
					bind:value={$form.code}
				/>
				{#if $errors.code} <span class="text-xs text-red-500">{$errors.code}</span>{/if}
				{#if $errors.user} <span class="text-xs text-red-500">{$errors.user}</span>{/if}
			</div>
			<button class="btn variant-ghost-primary h-fit">Submit</button>
		</form>
	</div>
</div>
