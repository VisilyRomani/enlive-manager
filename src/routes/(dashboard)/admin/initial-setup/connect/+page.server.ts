import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

const ConnectionValidation = z.object({
	code: z.string().min(1, { message: 'Please enter a valid company code!' }),
	user: z.string().min(1)
});

export type ConnectionSchema = typeof ConnectionValidation;

export const load: PageServerLoad = async ({ request, locals }) => {
	const connectionForm = await superValidate(request, ConnectionValidation);
	return {
		connectionForm
	};
};

export const actions = {
	connectCompany: async ({ request, locals }) => {
		const formData = await request.formData();
		const companyForm = await superValidate(formData, ConnectionValidation);
		if (!companyForm.valid) {
			return fail(400, { companyForm });
		}

		try {
			const code = await locals.pb?.collection('code').getOne(companyForm.data.code);

			if (!!code?.company && !!code?.permission) {
				await locals.pb
					?.collection('users')
					.update(companyForm.data.user, { company: code.company, permission: code.permission });

				await locals.pb?.collection('code').delete(companyForm.data.code);
			}
		} catch (e) {
			return setError(companyForm, 'code', 'Please enter a valid company code!');
		}
		return { companyForm };
	}
};
