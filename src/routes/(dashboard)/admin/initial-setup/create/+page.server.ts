import { fail } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

const CompanyValidation = z.object({
	name: z.string().min(1, { message: 'Please enter company name' }),
	phone: z.string().min(1, { message: 'Please enter phone number' }),
	email: z.string().email(),
	address: z.string().min(1, { message: 'Please enter address' }),
	logo: z.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 5242880, 'Max 5.24 MB upload size.'),
	gst: z.string(),
	pst: z.string(),
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

export const load: PageServerLoad = async ({ request }) => {
	const companyForm = await superValidate(request, zod(CompanyValidation));
	return withFiles({ companyForm })

};

export const actions = {
	createCompany: async ({ request, locals }) => {
		const companyForm = await superValidate(request, zod(CompanyValidation));
		if (!companyForm.valid) {
			return fail(400, withFiles({ companyForm }));
		}

		try {
			const company = await locals.pb?.collection('company').create({ ...companyForm.data, job_count: 2000 });
			await locals.pb
				?.collection('users')
				.update(locals.user?.id, { company: company?.id, permission: 'OWNER' });
			return withFiles({ companyForm })
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
				return fail(400, withFiles({ companyForm }));

			}
		}
		return withFiles({ companyForm })
	}
};
