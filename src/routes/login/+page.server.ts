import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { POCKETBASE_URL } from '$env/static/private';
import type { AuthMethodsList } from 'pocketbase';

export type OutputType = { authProviderRedirect: string; authProviderState: string };
export const load: PageServerLoad<OutputType> = async ({ url }) => {
	// const authMethods = await locals.pb?.collection('users').listAuthMethods();
	const authMethods: AuthMethodsList = await (
		await fetch(`${POCKETBASE_URL}/api/collections/users/auth-methods`)
	).json();
	if (!authMethods) {
		return {
			authProviderRedirect: '',
			authProviderState: ''
		};
	}

	const redirectURL = `${url.origin}/auth`;
	const githubAuthProvider = authMethods.authProviders[0];

	const authProviderRedirect = `${githubAuthProvider.authUrl}${redirectURL}`;
	const state = githubAuthProvider.state;

	return {
		authProviderRedirect: authProviderRedirect,
		authProviderState: state
	};
};

export const actions = {
	passwordLogin: async ({ locals, cookies, request }) => {
		// const email = url.searchParams.get('email') ?? '';
		// const password = url.searchParams.get('password') ?? '';
		const data = await request.formData();
		const email = String(data.get('email'));
		const password = String(data.get('password'));
		try {
			await locals.pb?.collection('users').authWithPassword(email, password);
		} catch (err) {
			console.log(err);
		}
		cookies.set('cookie', locals.pb?.authStore.exportToCookie() ?? '');
		throw redirect(303, '/admin/initial-setup');
	}
};
