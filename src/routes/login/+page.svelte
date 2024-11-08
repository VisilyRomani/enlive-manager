<script lang="ts">
	import { browser } from '$app/environment';
	import { superForm } from 'sveltekit-superforms';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	export let data;
	let TurnstileFinished = false;

	function gotoAuthProvider() {
		if (browser) {
			document.cookie = `state=${data?.authProviderState}`;
		}
		window.location.href = data.authProviderRedirect || '';
	}

	const { form, enhance, errors } = superForm(data.loginForm, {
		taintedMessage: false
	});
	const callback = (e: { returnValue: boolean }) => {
		TurnstileFinished = e.returnValue;
	};
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Login</title>
</svelte:head>

<div class="flex justify-center items-center h-full">
	<div class="card p-10 gap-3 flex flex-col w-96 text-center">
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
			<div>
				<Turnstile on:callback={callback} siteKey={PUBLIC_TURNSTILE_SITE_KEY} theme="dark" />
			</div>

			<button
				type="submit"
				disabled={!TurnstileFinished}
				class=" w-full btn variant-form-material variant-outline-primary">Submit</button
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
