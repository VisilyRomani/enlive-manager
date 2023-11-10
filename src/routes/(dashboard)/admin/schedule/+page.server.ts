import dayjs, { Dayjs } from 'dayjs';
import type { PageServerLoad } from './$types';
import z from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

type TUser = {
	id: string;
	first_name: string;
	last_name: string;
};

const ScheduleValidate = z.object({
	title: z.string(),
	employee: z.array(z.string()).min(1),
	job: z.array(z.object({ id: z.string() })),
	dates: z.array(z.instanceof(dayjs as unknown as typeof Dayjs)).min(1)
});

export const load: PageServerLoad = async ({ locals, request }) => {
	const jobList = await locals.pb?.collection('job').getFullList({
		filter: 'status = "PENDING" || status = "RESCHEDULE"',
		expand: 'address, task, address.client, task.service'
	});

	const userList = await locals.pb
		?.collection('users')
		.getFullList<TUser>({ fields: 'id,first_name,last_name' });

	const scheduleForm = await superValidate(request, ScheduleValidate);

	return { jobList, userList, scheduleForm };
};

export const actions = {
	createSchedule: async ({ locals, request }) => {
		const scheduleForm = await superValidate(request, ScheduleValidate);

		if (!scheduleForm.valid) {
			return fail(400, { scheduleForm });
		}
		locals.pb;
	}
};
