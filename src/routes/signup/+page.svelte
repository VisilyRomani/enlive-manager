<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Sign Up</title>
</svelte:head>
<div class="flex justify-center items-center h-full">
	<div class="card p-14 gap-3 flex flex-col w-96 text-center">
		<h2 class="h2">Sign Up</h2>
		<form class="space-y-5" action="?/passwordSignUp" method="post">
			<input name="email" class="input variant-form-material" type="email" placeholder="Email" />
			<input
				name="password"
				class="input variant-form-material"
				type="password"
				placeholder="Password"
			/>
			<input
				name="passwordConfirm"
				class="input variant-form-material"
				type="password"
				placeholder="Confirm Password"
			/>
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
