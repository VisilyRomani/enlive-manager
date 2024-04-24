<script lang="ts">
	import { browser } from '$app/environment';
	import { superForm } from 'sveltekit-superforms/client';

	function gotoAuthProvider() {
		if (browser) {
			document.cookie = `state=${data?.authProviderState}`;
		}
		window.location.href = data.authProviderRedirect || '';
	}

	export let data;
	const { form, enhance, errors } = superForm(data.loginForm, {
		taintedMessage: false
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Login</title>
</svelte:head>

<div class="flex justify-center items-center h-full">
	<div class="card p-14 gap-3 flex flex-col w-96 text-center">
		<h1 class="h2">Login</h1>
		<form method="post" class="space-y-5" action="?/passwordLogin" use:enhance>
			<label class="flex flex-col w-full items-start">
				<input
					name="email"
					class="input variant-form-material {$errors.email ? 'input-error' : undefined}"
					type="email"
					placeholder="Email"
					bind:value={$form.email}
				/>
				{#if $errors.email}
					<span class="text-xs text-[rgb(var(--color-error-500))]">{$errors.email}</span>{/if}
			</label>
			<label class="flex flex-col w-full items-start">
				<input
					name="password"
					class="input variant-form-material {$errors.password ? 'input-error' : undefined}"
					type="password"
					placeholder="Password"
					bind:value={$form.password}
				/>
				{#if $errors.password}
					<span class="text-xs text-[rgb(var(--color-error-500))]">{$errors.password}</span>{/if}
			</label>
			<button type="submit" class=" w-full btn variant-form-material variant-outline-primary"
				>Submit</button
			>
			<p>Don't have an account? <a class="anchor" href="/signup">Sign Up</a></p>
		</form>
		<hr />

		<button
			disabled
			on:click={gotoAuthProvider}
			class="btn w-full variant-form-material variant-outline-secondary">Login with Google</button
		>
	</div>
</div>
