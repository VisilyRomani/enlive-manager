<div class="lg:mx-60 lg:my-4 m-5 flex flex-col gap-4">
	<h1 class="h1">Hello 👋</h1>
	<h3>Tell us a little about you.</h3>
	<form method="post" class="gap-4 flex flex-col" action="?/updateUser">
		<label class="label">
			<span>What's your name?</span>
			<div class="grid lg:grid-cols-2 gap-4">
				<input
					class="input variant-form-material"
					type="text"
					name="first_name"
					placeholder="First Name"
				/>
				<input
					class="input variant-form-material"
					type="text"
					name="last_name"
					placeholder="Last Name"
				/>
			</div>
		</label>
		<button type="submit" class="btn variant-form-material variant-outline-secondary">Next</button>
	</form>
</div>
