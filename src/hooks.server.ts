// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

import { POCKETBASE_URL } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a new PocketBase instance
	event.locals.pb = new PocketBase(POCKETBASE_URL);

	// Load the authStore from the cookie
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// Check if the user is authenticated
		if (event.locals.pb.authStore.isValid) {
			// Refresh the user's authentication
			await event.locals.pb.collection('users').authRefresh();
			const user = structuredClone(event.locals.pb.authStore.model)
			if (user) {
				// Set the user in the locals object
				event.locals.user = user;
			}
		}
	} catch (err) {
		// Clear the authStore if there is an error
		event.locals.pb.authStore.clear();
	}

	if (event.url.pathname.startsWith('/admin' || '/app')) {
		if (!event.locals.user) {
			console.error('missing user');
			throw redirect(303, '/login');
		}
		if (
			(!event.locals.user.first_name || !event.locals.user.company) &&
			![
				'/admin/initial-setup',
				'/admin/initial-setup/create',
				'/admin/initial-setup/connect'
			].includes(event.url.pathname)
		) {
			throw redirect(303, '/admin/initial-setup');
		}

		if (event.locals.user.permission === 'WORKER' && ![
			'/app/daily',
			'/app/forecast',
			'/admin/api/schedule',
			'/admin/settings'
		].includes(event.url.pathname)) {
			throw redirect(303, '/app/daily');

		}

		if (
			event.locals.user.first_name &&
			event.locals.user.company &&
			[
				'/admin/initial-setup',
				'/admin/initial-setup/create',
				'/admin/initial-setup/connect'
			].includes(event.url.pathname)
		) {
			throw redirect(303, '/admin/dashboard');
		}
	}

	// Resolve the request
	const response = await resolve(event);

	// Set the cookie
	const isProd = process.env.NODE_ENV === 'production' ? true : false;
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ secure: isProd, sameSite: 'Lax', httpOnly: false })
	);

	return response;
};
