import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const ClientValidation = z.object({
	first_name: z.string().min(1),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.string().min(1),
	city: z.string().min(1),
	notes: z.string().optional()
});

export const load: PageServerLoad = async ({ request }) => {
	const userForm = await superValidate(request, ClientValidation);
	// const page = parseInt(url.searchParams.get('page') ?? '');
	// console.log(isNaN(page));
	// const clients = await locals.pb?.collection('clients').getList(isNaN(page) ? 1 : page, 20);
	return {
		userForm
		// clients
	};
	// try {
	// 	return {
	// 		userForm
	// 	};
	// } catch (err) {
	// 	if (err instanceof Error) {
	// 		console.error(err.message);
	// 	}
	// }

	// return {
	// 	userForm
	// };
};

export const actions = {
	CreateClient: async ({ locals, request }) => {
		const userForm = await superValidate(request, ClientValidation);
		if (!userForm.valid) {
			return fail(400, { userForm });
		}
		const newClient = new FormData();
		for (const [key, value] of Object.entries(userForm.data)) {
			newClient.append(key, value);
			if (locals.user?.company.id) {
				newClient.append('company', locals.user?.company.id);
			} else {
				locals.pb?.authStore.clear();
			}
		}
		locals.pb?.collection('clients').create();
	}
};
