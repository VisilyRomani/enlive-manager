import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const ScheduleJobValidation = z.object({
	schedule_id: z.string(),
	job_id: z.string().min(1),
	status: z.enum(['COMPLETED', 'CANCELED', 'RESCHEDULE']),
	update_description: z.string()
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const schedule = await locals.pb.collection('schedule').getOne<{
		id: string;
		expand: {
			job: {
				id: string;
				notes: string;
				status: string;
				order: number;
				expand: {
					address: {
						address: string;
						lat: number;
						lng: number;
						expand: { client: { first_name: string; last_name: string; id: string } };
					};
					task: {
						expand: {
							service: {
								name: string;
							};
						};
					}[];
				};
			}[];
		};
	}>(params.slug, {
		expand: 'job, job.address, job.address.client, job.task.service',
		fields:
			'id, expand.job.id, expand.job.order,expand.job.status, expand.job.notes, expand.job.expand.task.expand.service.name, expand.job.expand.address.address,expand.job.expand.address.lat,expand.job.expand.address.lng,expand.job.expand.address.expand.client.first_name,expand.job.expand.address.expand.client.last_name,expand.job.expand.address.expand.client.id'
	});

	const filter_jobs = schedule.expand.job.filter((j) => {
		return j.status !== 'CANCELED' && j.status !== 'COMPLETED';
	});

	console.log(filter_jobs);

	if (!filter_jobs.length) {
		throw redirect(300, '/app/daily');
	}

	const job = filter_jobs.reduce(function (prev, curr) {
		return prev.order < curr.order ? prev : curr;
	});

	if (job.status !== 'IN_PROGRESS') {
		locals.pb.collection('job').update(job.id, { status: 'IN_PROGRESS' });
	}
	const nextJobForm = superValidate(
		{ schedule_id: schedule.id, job_id: job.id },
		ScheduleJobValidation
	);

	return {
		job,
		nextJobForm
	};
};

export const actions = {
	updateScheudleJob: async ({ request, locals }) => {
		const nextJobForm = await superValidate(request, ScheduleJobValidation);

		try {
			await locals.pb.collection('job').update(nextJobForm.data.job_id, {
				status: nextJobForm.data.status,
				...(nextJobForm.data.status !== 'COMPLETED' && {
					update_description: nextJobForm.data.update_description
				})
			});

			if (nextJobForm.data.status === 'RESCHEDULE') {
				await locals.pb
					.collection('schedule')
					.update(nextJobForm.data.schedule_id, { 'job-': [nextJobForm.data.job_id] });
			}
		} catch (e) {
			return fail(400, { nextJobForm });
		}
		return { nextJobForm };
	}
};
