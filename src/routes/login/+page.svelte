<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	// Define the data variable
	export let data: PageData;

	// Define the gotoAuthProvider function
	function gotoAuthProvider() {
		// Save the state in the cookie
		if (browser) {
			document.cookie = `state=${data?.authProviderState}`;
		}

		// Redirect the user to the OAuth login for Github
		window.location.href = data.authProviderRedirect || '';
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Login</title>
</svelte:head>

<div class="flex justify-center items-center h-full">
	<div class="card p-14 gap-3 flex flex-col w-96 text-center">
		<h1 class="h2">Login</h1>
		<form method="post" class="space-y-5" action="?/passwordLogin">
			<input name="email" class="input variant-form-material" type="email" placeholder="email" />
			<input
				name="password"
				class="input variant-form-material"
				type="password"
				placeholder="Password"
			/>
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
