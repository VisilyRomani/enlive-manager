import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

const CompanyValidation = z.object({
	name: z.string().min(1, { message: 'Please enter company name' }),
	phone: z.string().min(1, { message: 'Please enter phone number' }),
	email: z.string().email(),
	address: z.string().min(1, { message: 'Please enter address' }),
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

export type CompanySchema = typeof CompanyValidation;

export const load: PageServerLoad = async ({ request, locals }) => {
	const companyForm = await superValidate(request, zod(CompanyValidation));
	return {
		companyForm
	};
};

export const actions = {
	createCompany: async ({ request, locals }) => {
		const formData = await request.formData();
		const companyForm = await superValidate(formData, zod(CompanyValidation));
		if (!companyForm.valid) {
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
			if (logo instanceof File) {
				companyData.append('logo', logo);
			}
		}

		companyData.append('job_count', String(2000));
		try {
			const company = await locals.pb?.collection('company').create(companyData);
			await locals.pb
				?.collection('users')
				.update(locals.user?.id, { company: company?.id, permission: 'OWNER' });
			return { companyForm };
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
				return fail(400, { companyForm, error: err.message });
			}
		}
		return { companyForm };
	}
};
