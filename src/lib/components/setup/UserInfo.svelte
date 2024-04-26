<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { UserSchema } from '../../../routes/(dashboard)/admin/initial-setup/proxy+page.server';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<Infer<UserSchema>>;

	const { form, enhance, errors } = superForm(data);
</script>

<div class="lg:mx-60 lg:my-4 m-5 flex flex-col gap-4">
	<h1 class="h1">Hello 👋</h1>
	<h3>Tell us a little about you.</h3>
	<form method="post" class="gap-4 flex flex-col" action="?/updateUser" use:enhance>
		<label class="label">
			<span>What's your name?</span>
			<div class="grid lg:grid-cols-2 gap-4">
				<div>
					<input
						class="input variant-form-material {$errors.first_name ? 'input-error' : undefined}"
						bind:value={$form.first_name}
						type="text"
						name="first_name"
						placeholder="First Name"
					/>
					{#if $errors.first_name}
						<span class="text-xs text-red-500">{$errors.first_name}</span>{/if}
				</div>

				<div>
					<input
						class="input variant-form-material {$errors.last_name ? 'input-error' : undefined}"
						bind:value={$form.last_name}
						type="text"
						name="last_name"
						placeholder="Last Name"
					/>
					{#if $errors.last_name} <span class="text-xs text-red-500">{$errors.last_name}</span>{/if}
				</div>
			</div>
		</label>
		<button type="submit" class="btn variant-form-material variant-outline-secondary">Save</button>
	</form>
</div>
