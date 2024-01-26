import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}
	const schedule = await pb.collection('schedule').getOne<{
		expand: {
			job: {
				id: string;
				notes: string;
				order: number;
				expand: {
					address: {
						address: string;
						lat: number;
						lng: number;
						expand: { client: { first_name: string; last_name: string } };
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
			'expand.job.id, expand.job.order, expand.job.notes, expand.job.expand.task.expand.service.name, expand.job.expand.address.address,expand.job.expand.address.lat,expand.job.expand.address.lng,expand.job.expand.address.expand.client.first_name,expand.job.expand.address.expand.client.last_name'
	});

	return { schedule };
};
