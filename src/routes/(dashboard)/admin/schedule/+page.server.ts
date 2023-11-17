import type { PageServerLoad } from './$types';
import z from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { error, fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';

type TUser = {
	id: string;
	first_name: string;
	last_name: string;
};

export type TJob = {
	id: string;
	address: string;
	notes: string;
	order: number;
	status: string;
	expand: {
		address: {
			active: boolean;
			address: string;
			lat: number;
			lng: number;
			expand: {
				client: {
					email: string;
					first_name: string;
					last_name: string;
				};
			};
		};
		task: {
			price: number;
			service: string;
			count: number;
			expand: {
				service: {
					active: true;
					name: string;
				};
			};
		}[];
	};
};

type TSchedule = {
	title: string;
	id: string;
	scheduled_date: Date;
	expand: {
		job: {
			job_number: number;
			id: string;
		}[];
	};
};

const ScheduleValidate = z.object({
	title: z.string(),
	employee: z
		.map(z.string(), z.string())
		.refine((u) => u.size > 0, { message: 'Must select at least one User' })
		.default(new Map()),
	job: z
		.object({
			address: z.string(),
			id: z.string(),
			notes: z.string(),
			order: z.number(),
			expand: z.object({
				address: z.object({ address: z.string() }),
				task: z.array(
					z.object({
						service: z.string(),
						price: z.number(),
						count: z.number()
					})
				)
			})
		})
		.array()
		.min(1, 'Schedule must contain at least one job')
		.default([]),
	dates: z.date().array().min(1, 'Must select at least one date').default([])
});

export const load: PageServerLoad = async ({ locals, request }) => {
	const pb = locals.pb;

	if (!pb) {
		throw redirect(300, '/');
	}
	const jobList = await pb.collection('job').getFullList<TJob>({
		filter: 'status = "PENDING" || status = "RESCHEDULE"',
		expand: 'address, task, address.client, task.service'
	});

	const userList = await pb
		.collection('users')
		.getFullList<TUser>({ fields: 'id,first_name,last_name' });

	const scheduleList = await pb.collection('schedule').getFullList<TSchedule>({
		expand: 'job, ',
		fields: 'id, expand,expand.job,title,scheduled_date'
	});

	const scheduleForm = await superValidate(request, ScheduleValidate);

	return { jobList, userList, scheduleForm, scheduleList };
};

export const actions = {
	createSchedule: async ({ locals, request }) => {
		const pb = locals.pb;

		if (!pb) {
			return fail(400, { message: 'Missing Database' });
		}
		const company = await pb
			.collection('company')
			.getOne<{ job_count: number }>(locals.user?.company, { fields: 'job_count' });

		const scheduleForm = await superValidate(request, ScheduleValidate);

		if (!scheduleForm.valid) {
			return fail(400, { scheduleForm });
		}

		// TODO: Job in schedule is used twice.
		try {
			pb.collection('schedule').create({
				scheduled_date: scheduleForm.data.dates[0],
				job: scheduleForm.data.job.map((j) => j.id),
				title:
					scheduleForm.data.dates.length > 1
						? `📋 | ${
								scheduleForm.data.title || dayjs(scheduleForm.data.dates[0]).format('DD/MM/YYYY')
						  }`
						: scheduleForm.data.title,
				employee: Array.from(scheduleForm.data.employee).map((e) => e[0]),
				company: String(locals.user?.company)
			});

			const updateJobs = scheduleForm.data.job.map((j) => {
				return pb.collection('job').update(j.id, { order: j.order, status: 'SCHEDULED' });
			});
			await Promise.all(updateJobs);
		} catch (e) {
			return fail(400, { message: 'Failed to create Schedule' });
		}

		if (scheduleForm.data.dates.length > 1) {
			const jobDuplicates = await Promise.all(
				scheduleForm.data.job.map(async (j, idx) => {
					const tasks = await Promise.all(
						j.expand.task.map((t) => {
							try {
								return pb.collection('task').create(
									{
										service: t.service,
										price: t.price,
										count: t.count,
										company: locals.user?.company
									},
									{ requestKey: null }
								);
							} catch (e) {
								return Promise.reject(new Error('Failed to create Duplicate task'));
							}
						})
					);
					const job = pb.collection('job').create(
						{
							status: 'SCHEDULED',
							company: String(locals.user?.company),
							notes: j.notes,
							address: j.address,
							task: tasks.map((t) => t?.id),
							order: j.order,
							job_number: company.job_count + idx + 1
						},
						{ requestKey: null }
					);

					return job;
				})
			);
			await pb.collection('company').update(locals.user?.company, {
				job_count: company.job_count + jobDuplicates.length
			});

			const duplicateSchedules = scheduleForm.data.dates.slice(1).map((date) => {
				return pb.collection('schedule').create(
					{
						scheduled_date: date,
						job: jobDuplicates.map((j) => j.id),
						title: `📋 | ${
							scheduleForm.data.title || dayjs(scheduleForm.data.dates[0]).format('DD/MM/YYYY')
						}`,
						employee: Array.from(scheduleForm.data.employee).map((e) => e[0]),
						company: String(locals.user?.company)
					},
					{ requestKey: null }
				);
			});

			const duplicateScheduleResult = await Promise.allSettled(duplicateSchedules);

			duplicateScheduleResult.map((res) => {
				if (res.status === 'rejected') {
					throw error(400, { message: 'Found rejected during duplicate schedule creation' });
				}
			});
		}

		return { scheduleForm };
	}
};
