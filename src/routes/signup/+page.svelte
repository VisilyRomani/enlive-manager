<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	export let data;
	const { form, enhance, errors } = superForm(data.form);
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Sign Up</title>
</svelte:head>
<div class="absolute">
	<SuperDebug data={$form} />
</div>
<div class="flex justify-center items-center h-full">
	<div class="card p-14 gap-3 flex flex-col w-96 text-center">
		<h2 class="h2">Sign Up</h2>
		<form class="space-y-5" action="?/passwordSignUp" method="post" use:enhance>
			<label class="flex flex-col w-full items-start">
				<input
					name="email"
					class="input variant-form-material {$errors.email ? 'input-error' : undefined}"
					type="email"
					placeholder="Email"
					bind:value={$form.email}
				/>
				{#if $errors.email} <span class="text-xs text-red-500">{$errors.email}</span>{/if}
			</label>

			<label class="flex flex-col w-full items-start">
				<input
					name="password"
					class="input variant-form-material {$errors.password ? 'input-error' : undefined}"
					type="password"
					placeholder="Password"
					bind:value={$form.password}
				/>
				{#if $errors.password} <span class="text-xs text-red-500">{$errors.password}</span>{/if}
			</label>

			<label class="flex flex-col w-full items-start">
				<input
					name="passwordConfirm"
					class="input variant-form-material {$errors.passwordConfirm ? 'input-error' : undefined}"
					type="password"
					placeholder="Confirm Password"
					bind:value={$form.passwordConfirm}
				/>
				{#if $errors.passwordConfirm}
					<span class="text-xs text-red-500">{$errors.passwordConfirm}</span>{/if}
			</label>

			<button type="submit" class=" w-full btn variant-form-material variant-outline-primary"
				>Submit</button
			>
			<p>Already have an account? <a class="anchor" href="/login">Login</a></p>
		</form>
		<hr />

		<button disabled class="btn w-full variant-form-material variant-outline-secondary"
			>Login with Google</button
		>
	</div>
</div>
