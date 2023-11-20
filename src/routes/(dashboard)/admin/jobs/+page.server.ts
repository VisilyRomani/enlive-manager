import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import type { IClientList } from '../client/proxy+page.server';
import { fail, redirect } from '@sveltejs/kit';

const JobValidation = z.object({
	address: z.string().min(1, 'Job must have address'),
	notes: z.string().optional(),
	task: z
		.map(
			z.number(),
			z.object({
				service_name: z.string(),
				service_id: z.string(),
				price: z
					.number()
					.min(0, 'Price must be at/greater than zero')
					.default('' as unknown as number),
				count: z
					.number()
					.min(1, 'Count must be greater than one')
					.default('' as unknown as number)
			})
		)
		.refine((t) => t.size > 0, { message: 'Must have at least one Task' })
		.default(new Map())
});

type TJobList = {
	id: string;
	note: string;
	job_number: number;
	status: string;
	expand: {
		address: {
			address: string;
			expand: {
				client: {
					first_name: string;
					last_name: string;
				};
			};
		};
		task: {
			expand: {
				service: { name: string };
			};
		}[];
	};
};

export const load: PageServerLoad = async ({ request, locals }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}
	const jobForm = await superValidate(request, JobValidation);
	const clientList = pb.collection('client').getFullList<IClientList>({
		expand: 'address(client)',
		fields: 'first_name, last_name, id, expand'
	});
	const serviceList = pb.collection('service').getFullList({
		filter: 'active=true',
		fields: 'name,id'
	});
	const jobList = pb.collection('job').getFullList<TJobList>({
		expand: 'task.service, address.client',
		fields:
			'expand.task.expand.service.name,id,notes,status, expand.address.address, expand.address.expand.client.first_name,expand.address.expand.client.last_name,job_number',
		sort: '-job_number'
	});
	return {
		jobForm,
		clientList,
		serviceList,
		streamed: {
			jobList
		}
	};
};

export const actions = {
	CreateJob: async ({ request, locals }) => {
		const pb = locals.pb;
		if (!pb) {
			throw redirect(300, '/');
		}
		const jobForm = await superValidate(request, JobValidation);
		if (!jobForm.valid) {
			return fail(400, { jobForm });
		}

		const jobData = new FormData();

		jobData.append('address', jobForm.data.address);
		jobData.append('notes', jobForm.data.notes ?? '');
		jobData.append('status', 'PENDING');

		if (!locals.user?.company) {
			pb.authStore.clear();
		}
		jobData.append('company', locals.user?.company);

		const company = await pb
			.collection('company')
			.getOne<{ job_count: number }>(locals.user?.company, { fields: 'job_count' });

		jobData.append('job_number', String(company.job_count + 1));

		try {
			const tasks = Array.from(jobForm.data.task).map((t) => {
				return pb.collection('task').create(
					{
						service: t[1].service_id,
						price: t[1].price,
						count: t[1].count,
						company: locals.user?.company
					},
					{ requestKey: null }
				);
			});

			(await Promise.all(tasks)).forEach((task) => {
				if (task) {
					jobData.append('task', task.id);
				}
			});
			const job = await pb.collection('job').create(jobData);

			await pb
				?.collection('company')
				.update(locals.user?.company, { job_count: company.job_count + 1 });
			return { result: job, jobForm };
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
				return fail(400, { jobForm });
			}
		}
	}
};
