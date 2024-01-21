import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

type TSchedule = {
	id: string;
	title: string;
	scheduled_date: Date;
	expand: {
		employee: {
			first_name: string;
			last_name: string;
			id: string;
		}[];
		job: {
			id: string;
			job_number: number;
			notes: string;
			order: number;
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
					count: number;
					price: number;
					expand: {
						service: {
							name: string;
						};
					};
				}[];
			};
		}[];
	};
};

const DetailValidation = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	scheduled_date: z.date()
});
const EmployeeValidation = z.object({
	employees: z.array(z.object({ id: z.string().min(1), name: z.string() }))
});

const JobValiation = z.object({
	jobs: z.array(z.object({ id: z.string() }))
});
export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}
	const schedule = await pb.collection('schedule').getOne<TSchedule>(params.slug, {
		expand: 'job, employee, job.task, job.task.service, job.address, job.address.client',
		fields: ' id, title, scheduled_date,expand'
	});

	const EditScheduleDetails = superValidate(
		{ title: schedule.title, scheduled_date: new Date(schedule.scheduled_date), id: schedule.id },
		DetailValidation
	);
	const EditScheduleEmployee = superValidate(EmployeeValidation);
	const EditScheduleJobs = superValidate(JobValiation);

	return {
		EditScheduleDetails,
		EditScheduleEmployee,
		EditScheduleJobs,
		schedule
	};
};

export const actions = {
	editDetails: async ({ request, locals }) => {
		const EditScheduleDetails = await superValidate(request, DetailValidation);
		const pb = locals.pb;
		console.log(EditScheduleDetails.data);
		if (!pb || !EditScheduleDetails.valid) {
			return fail(400, { EditScheduleDetails });
		}
		try {
			await pb.collection('schedule').update(EditScheduleDetails.data.id, EditScheduleDetails.data);
		} catch (e) {
			return fail(400, { EditScheduleDetails });
		}
		return { EditScheduleDetails };
	}
};
