import { redirect } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

// Define the GET request handler
export const GET: RequestHandler = async ({ locals }: RequestEvent) => {
	try {
		locals.pb?.authStore.clear();
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
	throw redirect(307, '/login');
};
