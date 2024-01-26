import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const startDate = new Date();
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date();
	endDate.setHours(23, 59, 59, 999);

	let schedules = await locals.pb?.collection('schedule').getFullList<{
		id: string;
		title: string;
		job: string[];
		completed: number;
		expand: { job: { status: string }[] };
	}>({
		filter: `employee.id?="${locals.user?.id}" && scheduled_date>="${startDate
			.toISOString()
			.replace('T', ' ')}" && scheduled_date<="${endDate.toISOString().replace('T', ' ')}"`,
		expand: 'job',
		fields: 'job, expand.job.status, id, title'
	});

	schedules = schedules?.map((s) => {
		const completed = s.expand?.job.filter((j) => j.status === 'COMPLETED').length / s.job.length;
		return {
			...s,
			completed: completed * 100
		};
	});
	return { schedules };
};
