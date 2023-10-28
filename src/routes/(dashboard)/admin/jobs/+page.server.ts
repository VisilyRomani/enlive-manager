import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

const JobValidation = z.object({
	client: z.string()
});

export const load: PageServerLoad = async ({ request, locals }) => {
	const jobForm = await superValidate(request, JobValidation);
	const clientList =
		(await locals.pb?.collection('clients').getFullList({
			expand: 'address',
			fields: 'first_name, last_name, id, expand'
		})) ?? [];
	return {
		jobForm,
		clientList
	};
};
