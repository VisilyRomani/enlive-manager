import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const jobList = await locals.pb?.collection('job').getFullList({
		filter: 'status = "PENDING" || status = "RESCHEDULE"',
		expand: 'address, task, address.client, task.service'
	});

	const userList = await locals.pb?.collection('users').getFullList();

	return { jobList, userList };
};
