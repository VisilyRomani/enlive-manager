import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { validateToken } from '$lib/server/Turnstile';
import { TURNSTILE_SECRET_KEY } from '$env/static/private';
export type OutputType = { authProviderRedirect: string; authProviderState: string };

const SignUpValidation = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		passwordConfirm: z.string().min(8),
		'cf-turnstile-response':z.string()
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.passwordConfirm) {
			ctx.addIssue({ code: 'custom', message: 'Password mismatch', path: ['passwordConfirm'] });
		}
	});

export const load: PageServerLoad<OutputType> = async ({ locals, url, request }) => {
	const authMethods = await locals.pb?.collection('users').listAuthMethods();
	const form = await superValidate(request, zod(SignUpValidation));
	if (!authMethods || !authMethods.authProviders.length) {
		return {
			form,
			authProviderRedirect: '',
			authProviderState: ''
		};
	}

	const redirectURL = `${url.origin}/auth`;
	const githubAuthProvider = authMethods.authProviders[0];

	const authProviderRedirect = `${githubAuthProvider.authUrl}${redirectURL}`;
	const state = githubAuthProvider.state;

	return {
		form,
		authProviderRedirect: authProviderRedirect,
		authProviderState: state
	};
};

export const actions = {
	passwordSignUp: async ({ locals, request }) => {
		const form = await superValidate(request, zod(SignUpValidation));
		
		const { success, error } = await validateToken(form.data['cf-turnstile-response'],TURNSTILE_SECRET_KEY);

		if (!success){
			form.errors['cf-turnstile-response'] = ["Failed to Validate Captcha"];
			return fail(400, { form });
		}
		if (!form.valid) {
			return fail(400, { form });
		}

		const signup = new FormData();

		signup.append('email', form.data.email);
		signup.append('password', form.data.password);
		signup.append('passwordConfirm', form.data.passwordConfirm);
		signup.append('active', 'true');

		try {
			await locals.pb?.collection('users').create(signup);
		} catch (err) {
			if (err instanceof Error) {
				return fail(400, { form, error: err.message });
			}
			console.error(err);
		}
		throw redirect(303, '/login');
	}
};
