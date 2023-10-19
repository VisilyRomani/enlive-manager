import { redirect } from '@sveltejs/kit';

export const actions = {
	updateUser: async ({ request, locals }) => {
		const data = await request.formData();
		console.log(data);
		const result = await locals.pb?.collection('users').update(locals.user?.id, data);
		if (result) {
			throw redirect(303, '/admin/company');
		}
	}
};
