import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}
	const schedule = pb.collection('schedule').getOne<TSchedule>(params.slug, {
		expand: 'job, employee, job.task, job.task.service, job.address, job.address.client',
		fields: ' id, title, scheduled_date,expand'
	});

	return {
		streamed: { schedule }
	};
};
