import type { PageServerLoad } from './$types';

export type OutputType = { authProviderRedirect: string; authProviderState: string };

export const load: PageServerLoad<OutputType> = async ({ locals, url }) => {
	const authMethods = await locals.pb?.collection('users').listAuthMethods();
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
