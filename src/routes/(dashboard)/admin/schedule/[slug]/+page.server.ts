import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import type { TJob, TUser } from '../+page.server';

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
	schedule_id: z.string().min(1),
	employees: z.array(z.string()).min(1, 'Schedule must contain at least 1 employee')
});

const JobValiation = z.object({
	schedule_id: z.string().min(1),
	jobs: z.array(z.string())
});
export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}

	const schedule = await pb.collection('schedule').getOne<TSchedule>(params.slug, {
		expand: 'job, employee, job.task, job.task.service, job.address, job.address.client',
		fields: ' id, title, scheduled_date, expand'
	});

	const userList = await pb
		.collection('users')
		.getFullList<TUser>({ fields: 'id,first_name,last_name' });

	const jobList = await pb.collection('job').getFullList<TJob>({
		filter: 'status = "PENDING" || status = "RESCHEDULE"',
		expand: 'address, task, address.client, task.service'
	});

	const EditScheduleDetails = superValidate(
		{ title: schedule.title, scheduled_date: new Date(schedule.scheduled_date), id: schedule.id },
		DetailValidation
	);
	const EditScheduleEmployee = superValidate(
		{ schedule_id: schedule.id, employees: schedule.expand.employee.map((e) => e.id) },
		EmployeeValidation
	);
	const EditScheduleJobs = superValidate(
		{ schedule_id: schedule.id, jobs: schedule.expand.job.map((j) => j.id) },
		JobValiation
	);

	const allJobs = [...jobList, ...schedule.expand.job];

	const unique = allJobs.filter((obj, index) => {
		return index === allJobs.findIndex((o) => obj.id === o.id);
	});
	return {
		EditScheduleDetails,
		EditScheduleEmployee,
		EditScheduleJobs,
		schedule,
		userList,
		jobList: unique
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
	},
	editEmployee: async ({ request, locals }) => {
		const EditScheduleEmployee = await superValidate(request, EmployeeValidation);
		const pb = locals.pb;
		if (!EditScheduleEmployee.valid || !pb) {
			return fail(400, { EditScheduleEmployee });
		}

		try {
			await pb.collection('schedule').update(EditScheduleEmployee.data.schedule_id, {
				employee: EditScheduleEmployee.data.employees
			});
		} catch (e) {
			return fail(400, { EditScheduleEmployee });
		}
		return { EditScheduleEmployee };
	},
	editJob: async ({ request, locals }) => {
		const EditScheduleJobs = await superValidate(request, JobValiation);
		const pb = locals.pb;
		if (!EditScheduleJobs.valid || !pb) {
			return fail(400, { EditScheduleJobs });
		}

		// :TODO pass in data in delete and update arrays
		try {
			await pb.collection('schedule').update(EditScheduleJobs.data.schedule_id, {
				job: EditScheduleJobs.data.jobs
			});

			// Promise.all(EditScheduleJobs.data.jobs.map(job => {

			// }))

			// Each Job update order, update Status
		} catch (e) {
			return fail(400, { EditScheduleJobs });
		}
	}
};
