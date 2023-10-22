import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

const UserValidation = z.object({ first_name: z.string().min(4), last_name: z.string().min(4) });
const CompanyValidation = z.object({
	name: z.string().min(1, { message: 'Please enter company name' }),
	phone: z.string().min(1, { message: 'Please enter phone number' }),
	email: z.string().email(),
	address: z.string().min(1, { message: 'Please enter address' }),
	city: z.string().min(1, { message: 'Please enter city' }),
	gst: z.string().optional(),
	pst: z.string().optional(),
	url: z.string().url(),
	terms: z.string().min(1, { message: 'Please enter invoice terms' }),
	days_until_due: z
		.number()
		.nonnegative()
		.default('' as unknown as number),
	days_until_final: z
		.number()
		.nonnegative()
		.default('' as unknown as number),
	footer: z.string().min(1, { message: 'Please enter invoice footer' })
});

export type UserSchema = typeof UserValidation;

export type CompanySchema = typeof CompanyValidation;

export const load: PageServerLoad = async ({ request }) => {
	const userForm = await superValidate(request, UserValidation);
	const companyForm = await superValidate(request, CompanyValidation);

	return {
		userForm,
		companyForm
	};
};

export const actions = {
	updateUser: async ({ request, locals }) => {
		const userForm = await superValidate(request, UserValidation);

		if (!userForm.valid) {
			return fail(400, { userForm });
		}
		console.log(userForm);

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
	},
	createCompany: async ({ request, locals }) => {
		const formData = await request.formData();
		const companyForm = await superValidate(formData, CompanyValidation);
		if (!companyForm.valid) {
			console.log(companyForm);
			return fail(400, { companyForm });
		}

		const companyData = new FormData();

		for (const [key, value] of Object.entries(companyForm.data)) {
			if (typeof value === 'number') {
				companyData.append(key, String(value));
			} else {
				companyData.append(key, value);
			}
		}
		if (formData.has('logo')) {
			const logo = formData.get('logo');
			console.log(logo);
			if (logo instanceof File) {
				companyData.append('logo', logo);
			}
		}

		try {
			const company = await locals.pb?.collection('companies').create(companyData);
			await locals.pb?.collection('users').update(locals.user?.id, { company: company?.id });
			locals.user = structuredClone(locals.pb?.authStore.model) ?? undefined;
			return { companyForm };
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
				return fail(400, { companyForm, error: err.message });
			}
		}
		return { companyForm };
	}
};
