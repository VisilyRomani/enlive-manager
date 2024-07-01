import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const LoginValidation = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});
export type OutputType = {
	authProviderRedirect: string;
	authProviderState: string;
	loginForm: SuperValidated<Infer<typeof LoginValidation>>;
};

export const load: PageServerLoad<OutputType> = async ({ locals, url, request }) => {
	const loginForm = await superValidate(request, zod(LoginValidation));

	const authMethods = await locals.pb?.collection('users').listAuthMethods();
	if (!authMethods || !authMethods.authProviders.length) {
		return {
			loginForm,
			authProviderRedirect: '',
			authProviderState: ''
		};
	}

	const redirectURL = `${url.origin}/auth`;
	const githubAuthProvider = authMethods.authProviders[0];

	const authProviderRedirect = `${githubAuthProvider.authUrl}${redirectURL}`;
	const state = githubAuthProvider.state;

	return {
		loginForm,
		authProviderRedirect: authProviderRedirect,
		authProviderState: state
	};
};

export const actions = {
	passwordLogin: async ({ locals, cookies, request }) => {
		const loginForm = await superValidate(request, zod(LoginValidation));
		if (!loginForm.valid) {
			return fail(400, { loginForm });
		}

		try {
			await locals.pb
				?.collection('users')
				.authWithPassword(loginForm.data.email, loginForm.data.password);
		} catch (err) {
			loginForm.errors.email = ["Email and/or password didn't match"];

			return fail(401, { loginForm });
		}
		cookies.set('cookie', locals.pb?.authStore.exportToCookie() ?? '', { path: '/' });
		throw redirect(303, '/admin/initial-setup');
	}
};
