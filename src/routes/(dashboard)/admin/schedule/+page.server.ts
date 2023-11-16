import type { PageServerLoad } from './$types';
import z from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

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
				address: z.object({ address: z.string(), lat: z.number(), lng: z.number() }),
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
		.min(1)
		.default([]),
	dates: z.date().array().min(1, 'Must select at least one date').default([])
});

export const load: PageServerLoad = async ({ locals, request }) => {
	const jobList =
		(await locals.pb?.collection('job').getFullList<TJob>({
			filter: 'status = "PENDING" || status = "RESCHEDULE"',
			expand: 'address, task, address.client, task.service'
		})) ?? [];

	const userList = await locals.pb
		?.collection('users')
		.getFullList<TUser>({ fields: 'id,first_name,last_name' });

	const scheduleForm = await superValidate(request, ScheduleValidate);

	return { jobList, userList, scheduleForm };
};

export const actions = {
	createSchedule: async ({ locals, request }) => {
		const scheduleForm = await superValidate(request, ScheduleValidate);

		console.log(scheduleForm.data);

		if (!scheduleForm.valid) {
			return fail(400, { scheduleForm });
		}

		locals.pb;

		return { scheduleForm };
	}
};
