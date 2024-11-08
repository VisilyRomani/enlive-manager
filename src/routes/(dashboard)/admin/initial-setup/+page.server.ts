import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

const UserValidation = z.object({ first_name: z.string().min(4), last_name: z.string().min(4) });

export type UserSchema = typeof UserValidation;

export const load: PageServerLoad = async ({ request, locals }) => {
	const userForm = await superValidate(request, zod(UserValidation));
	userForm.data = { first_name: locals.user?.first_name, last_name: locals.user?.last_name };

	return {
		userForm,
	};
};

export const actions = {
	updateUser: async ({ request, locals }) => {
		const userForm = await superValidate(request, zod(UserValidation));

		if (!userForm.valid) {
			return fail(400, { userForm });
		}

		const userData = new FormData();
		userData.append('first_name', userForm.data.first_name);
		userData.append('last_name', userForm.data.last_name);

		try {
			const result = await locals.pb?.collection('users').update(locals.user?.id, userData);
			locals.user = result;
		} catch (err) {
			if (err instanceof Error) {
				return fail(400, { userForm, error: err.message });
			}
		}

		return { userForm };
	}
};
