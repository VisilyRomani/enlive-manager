import { redirect } from '@sveltejs/kit';

export const actions = {
	updateUser: async ({ request, locals }) => {
		const data = await request.formData();
		console.log(data);
		const result = await locals.pb?.collection('users').update(locals.user?.id, data);
		locals.user = result;
	},
	createCompany: async ({ request, locals }) => {
		const data = await request.formData();
		console.log(data);
		const company = await locals.pb?.collection('companies').create(data);
		await locals.pb?.collection('users').update(locals.user?.id, { company: company?.id });
		locals.user = structuredClone(locals.pb?.authStore.model) ?? undefined;
		redirect(303, '/admin/dashboard');
	}
};
