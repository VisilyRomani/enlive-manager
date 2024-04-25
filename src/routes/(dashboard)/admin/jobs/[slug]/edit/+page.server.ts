import type { PageServerLoad } from './$types';
import z from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
enum StatusType {
	PENDING,
	IN_PROGRESS,
	COMPLETED,
	RESCHEUDLE,
	CANCELED,
	SCHEDULED
}
type TJobData = {
	id: string;
	job_number: number;
	expand: {
		task: {
			id: string;
			expand: { service: { name: string; expand: { tax: { percent: number }[] } } };
			price: number;
			count: number;
		}[];
		address: {
			address: string;
			expand: {
				client: {
					first_name: string;
					last_name: string;
					email: string;
					id: string;
				};
			};
		};
	};
	status: string;
	notes: string;
};

type TServices = {
	id: string;
	name: string;
};

const EditJobValidation = z.object({
	id: z.string().min(1),
	status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'RESCHEUDLE', 'CANCELED', 'SCHEDULED']),
	notes: z.string()
});

const AddTaskValidation = z.object({
	job_id: z.string().min(1),
	company: z.string().min(1),
	service: z.string(),
	price: z
		.number({ invalid_type_error: 'Must enter a valid price' })
		.min(0)
		.default('' as unknown as number),
	count: z
		.number({ invalid_type_error: 'Must enter a valid count' })
		.min(1, 'Must have atleast 1 count')
		.default('' as unknown as number)
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}
	const job = await pb.collection('job').getOne<TJobData>(params.slug, {
		expand: 'job_number, address.client, task, task.service, task.service.tax, task.id'
	});

	const services = await pb.collection('service').getFullList<TServices>({ filter: 'active=true' });

	const initData = {
		id: job.id,
		status: job.status as keyof typeof StatusType,
		notes: job.notes
	};

	const editJob = await superValidate(initData, zod(EditJobValidation));
	const addTask = await superValidate(zod(AddTaskValidation));

	return { job, editJob, services, addTask, slug: params.slug };
};

export const actions = {
	editJob: async ({ locals, request }) => {
		const editJob = await superValidate(request, zod(EditJobValidation));
		const pb = locals.pb;
		if (!editJob.valid || !pb) {
			return fail(400, { editJob });
		}

		await pb.collection('job').update(editJob.data.id, editJob.data);
		return { editJob };
	},
	addTask: async ({ locals, request }) => {
		const addTask = await superValidate(request, zod(AddTaskValidation));
		const pb = locals.pb;
		if (!pb || !addTask.valid) {
			return fail(400, { addTask });
		}

		try {
			const task = await pb
				.collection('task')
				.create({ ...addTask.data, price: Math.trunc(addTask.data.price * 100) });
			await pb.collection('job').update(addTask.data.job_id, { 'task+': task.id });
		} catch (e) {
			return fail(400, { addTask });
		}
		return { addTask };
	}
};
