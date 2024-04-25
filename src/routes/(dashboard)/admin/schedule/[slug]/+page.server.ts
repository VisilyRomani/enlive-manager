import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import type { TJob, TUser } from '../+page.server';
import { zod } from 'sveltekit-superforms/adapters';

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

const ChangeOrderValidation = z.object({
	schedule_id: z.string(),
	job_id: z.string(),
	order: z.number(),
	type: z.enum(['INCREASE', 'DECREASE'])
});
export const load: PageServerLoad = async ({ params, locals }) => {
	const schedule = await locals.pb.collection('schedule').getOne<TSchedule>(params.slug, {
		expand: 'job, employee, job.task, job.task.service, job.address, job.address.client',
		fields: ' id, title, scheduled_date, expand'
	});

	const userList = await locals.pb
		.collection('users')
		.getFullList<TUser>({ fields: 'id,first_name,last_name' });

	const jobList = await locals.pb.collection('job').getFullList<TJob>({
		filter: 'status = "PENDING" || status = "RESCHEDULE"',
		expand: 'address, task, address.client, task.service'
	});

	const OrderScheduleJob = await superValidate(
		{ schedule_id: schedule.id },
		zod(ChangeOrderValidation)
	);

	const EditScheduleDetails = await superValidate(
		{ title: schedule.title, scheduled_date: new Date(schedule.scheduled_date), id: schedule.id },
		zod(DetailValidation)
	);
	const EditScheduleEmployee = await superValidate(
		{ schedule_id: schedule.id, employees: schedule.expand.employee.map((e) => e.id) },
		zod(EmployeeValidation)
	);
	const AddScheduleJobs = await superValidate({ schedule_id: schedule.id }, zod(JobValiation));
	const DeleteScheduleJobs = await superValidate({ schedule_id: schedule.id }, zod(JobValiation));
	return {
		EditScheduleDetails,
		EditScheduleEmployee,
		OrderScheduleJob,
		AddScheduleJobs,
		DeleteScheduleJobs,
		schedule,
		userList,
		jobList
	};
};

export const actions = {
	editDetails: async ({ request, locals }) => {
		const EditScheduleDetails = await superValidate(request, zod(DetailValidation));
		const pb = locals.pb;
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
		const EditScheduleEmployee = await superValidate(request, zod(EmployeeValidation));
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
	editJobOrder: async ({ request, locals }) => {
		const OrderScheduleJob = await superValidate(request, zod(ChangeOrderValidation));
		const pb = locals.pb;
		if (!pb || !OrderScheduleJob.valid) {
			return fail(400, { OrderScheduleJob });
		}

		try {
			const schedule_jobs = (
				await pb.collection('schedule').getOne<{
					expand: {
						job: {
							id: string;
							order: number;
						}[];
					};
				}>(OrderScheduleJob.data.schedule_id, { expand: 'job', fields: 'expand.job' })
			).expand.job.sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0));

			const cur_job_idx = schedule_jobs.findIndex((i) => i.id === OrderScheduleJob.data.job_id);
			if (OrderScheduleJob.data.type === 'INCREASE') {
				if (cur_job_idx === 0) {
					return { OrderScheduleJob };
				}
				// Decrease priority for job infront of current
				await pb.collection('job').update(schedule_jobs[cur_job_idx - 1].id, {
					order: schedule_jobs[cur_job_idx - 1].order + 1
				});
				// Increase priority for current job
				await pb.collection('job').update(schedule_jobs[cur_job_idx].id, {
					order: schedule_jobs[cur_job_idx].order - 1
				});
			} else if (OrderScheduleJob.data.type === 'DECREASE') {
				if (cur_job_idx === schedule_jobs.length - 1) {
					return { OrderScheduleJob };
				}
				// Increase priority for job behind of current
				await pb.collection('job').update(schedule_jobs[cur_job_idx + 1].id, {
					order: schedule_jobs[cur_job_idx + 1].order - 1
				});
				// Decrease priority for current job
				await pb.collection('job').update(schedule_jobs[cur_job_idx].id, {
					order: schedule_jobs[cur_job_idx].order + 1
				});
			} else {
				return fail(400, { OrderScheduleJob });
			}
		} catch (e) {
			return fail(400, { OrderScheduleJob });
		}
	},
	addSchduleJob: async ({ request, locals }) => {
		const AddScheduleJobs = await superValidate(request, zod(JobValiation));
		const pb = locals.pb;
		if (!AddScheduleJobs.valid || !pb) {
			return fail(400, { AddScheduleJobs });
		}

		try {
			const job_order_detail = await pb.collection('schedule').getOne<{
				expand: {
					job: {
						id: string;
						order: number;
					}[];
				};
			}>(AddScheduleJobs.data.schedule_id, { expand: 'job', fields: 'expand.job' });

			const last_job = job_order_detail.expand?.job
				.sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
				.at(-1);

			await Promise.all(
				AddScheduleJobs.data.jobs.map((job, index) => {
					return pb.collection('job').update(
						job,
						{
							order: (last_job?.order ? last_job.order : 0) + (index + 1),
							status: 'SCHEDULED'
						},
						{ requestKey: null }
					);
				})
			);

			await pb
				.collection('schedule')
				.update(AddScheduleJobs.data.schedule_id, { 'job+': AddScheduleJobs.data.jobs });
		} catch (e) {
			return fail(400, { AddScheduleJobs });
		}
	},
	deleteScheduleJob: async ({ locals, request }) => {
		const DeleteScheduleJobs = await superValidate(request, zod(JobValiation));
		const pb = locals.pb;

		if (!pb || !DeleteScheduleJobs.valid) {
			return fail(400, { DeleteScheduleJobs });
		}

		const job_id = DeleteScheduleJobs.data.jobs.at(0);
		if (!job_id) {
			return fail(400, { DeleteScheduleJobs });
		}

		try {
			const job_order_detail = await pb.collection('schedule').getOne<{
				expand: {
					job: {
						id: string;
						order: number;
					}[];
				};
			}>(DeleteScheduleJobs.data.schedule_id, { expand: 'job', fields: 'expand.job' });

			const job_idx = job_order_detail.expand?.job.findIndex((j) => j.id === job_id);
			const last_job = job_order_detail.expand?.job.sort((a, b) =>
				a.order < b.order ? -1 : a.order > b.order ? 1 : 0
			);

			const reorder_jobs = last_job.slice(job_idx);

			await Promise.all([
				await pb.collection('job').update(job_id, { status: 'RESCHEDULE', order: null }),
				await pb
					.collection('schedule')
					.update(DeleteScheduleJobs.data.schedule_id, { 'job-': [job_id] }),
				...reorder_jobs.map(async (j) => {
					return await pb.collection('job').update(j.id, { order: j.order - 1 });
				})
			]);
		} catch (e) {
			return fail(400, { DeleteScheduleJobs });
		}

		return { DeleteScheduleJobs };
	}
};
