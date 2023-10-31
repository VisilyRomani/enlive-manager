import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import type { IClientList } from '../client/proxy+page.server';
import { fail } from '@sveltejs/kit';

const JobValidation = z.object({
	address: z.string().min(1, 'Job must have address'),
	notes: z.string().optional(),
	task: z
		.map(
			z.number(),
			z.object({
				service_name: z.string(),
				service_id: z.string(),
				price: z.number().default('' as unknown as number)
			})
		)
		.refine((t) => (t.size < 0 ? { message: 'Must have at least one Task' } : true))
		.default(new Map())
});

export const load: PageServerLoad = async ({ request, locals }) => {
	const jobForm = await superValidate(request, JobValidation);
	const clientList =
		(await locals.pb?.collection('client').getFullList<IClientList>({
			expand: 'address',
			fields: 'first_name, last_name, id, expand'
		})) ?? [];
	const serviceList =
		(await locals.pb?.collection('service').getFullList({
			filter: 'active=true',
			fields: 'name,id'
		})) ?? [];
	return {
		jobForm,
		clientList,
		serviceList
	};
};

export const actions = {
	CreateJob: async ({ request, locals }) => {
		const jobForm = await superValidate(request, JobValidation);
		console.log(jobForm);
		if (!jobForm.valid) {
			return fail(400, { jobForm });
		}

		const jobData = new FormData();

		jobData.append('address', jobForm.data.address);
		jobData.append('notes', jobForm.data.notes ?? '');
		jobData.append('status', 'PENDING');

		if (!locals.user?.company) {
			locals.pb?.authStore.clear();
		}
		jobData.append('company', locals.user?.company);

		try {
			const job = await locals.pb?.collection('job').create(jobData);

			const tasks = Array.from(jobForm.data.task).map((t) => {
				return locals.pb?.collection('task').create(
					{
						job: job?.id,
						service: t[1].service_id,
						price: t[1].price,
						company: locals.user?.company
					},
					{ requestKey: null }
				);
			});
			return { result: await Promise.all(tasks), jobForm };
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
				return fail(400, { jobForm });
			}
		}
	}
};
