import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import type { IClientList } from '../client/proxy+page.server';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

const JobValidation = z.object({
	address: z.string().min(1, 'Job must have address'),
	lat: z.number().optional(),
	lng: z.number().optional(),
	new_client: z.boolean().default(false),
	notes: z.string().optional(),
	task: z
		.map(
			z.number(),
			z.object({
				service_name: z.string(),
				service_id: z.string(),
				price: z
					.number(),
				// .min(0, 'Price must be at/greater than zero')
				// .default('' as unknown as number),
				count: z
					.number()
					.min(1, 'Count must be greater than one')
					.default(1)
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
	const jobForm = await superValidate(request, zod(JobValidation));
	const clientList = await locals.pb.collection('client').getFullList<IClientList>({
		expand: 'address(client)',
		fields: 'first_name, last_name, id, expand'
	});
	const serviceList = await locals.pb.collection('service').getFullList({
		filter: 'active=true',
		fields: 'name,id'
	});
	const jobList = locals.pb.collection('job').getFullList<TJobList>({
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
		const jobForm = await superValidate(request, zod(JobValidation));
		if (!jobForm.valid) {
			return fail(400, { jobForm });
		}
		const company = await locals.pb
			.collection('company')
			.getOne<{ job_count: number }>(locals.user?.company, { fields: 'job_count' });



		try {
			const tasks = Array.from(jobForm.data.task).map((t) => {
				return locals.pb.collection('task').create(
					{
						service: t[1].service_id,
						price: t[1].price,
						count: t[1].count,
						company: locals.user.company
					},
					{ requestKey: null }
				);
			});
			const task_ids = (await Promise.all(tasks)).map(t => t.id)


			if (jobForm.data.new_client) {
				const client = await locals.pb.collection('client').create({ first_name: jobForm.data.address, company: locals.user.company });
				const address = await locals.pb.collection('address').create({ address: jobForm.data.address, lat: jobForm.data.lat, lng: jobForm.data.lng, client: client.id, active: true })
				await locals.pb.collection('job').create({
					...jobForm.data,
					address: address.id,
					job_number: String(company.job_count + 1),
					status: 'PENDING', task: task_ids,
					company: locals.user?.company
				});
			} else {
				await locals.pb.collection('job').create({
					...jobForm.data,
					job_number: String(company.job_count + 1),
					status: 'PENDING', task: task_ids,
					company: locals.user?.company
				});
			}
			await locals.pb
				.collection('company')
				.update(locals.user?.company, { job_count: company.job_count + 1 });

		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
				return fail(400, { jobForm });
			}
		}


		return { jobForm };
	}
};
