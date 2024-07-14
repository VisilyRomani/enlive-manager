import { json } from '@sveltejs/kit';

export interface IDailySchedule {
	id: string;
	title: string;
	job: string[];
	completed: number;
	expand: { job: { status: string }[] };
}

export const GET = async ({ url, locals }) => {
	const date = url.searchParams.get('date');

	let schedules = await locals.pb?.collection('schedule').getFullList<IDailySchedule>({
		filter: ` schedule_date = "${date}" && employee.id?="${locals.user?.id}"`,
		expand: 'job',
		fields: 'job, expand.job.status, id, title'
	});

	schedules = schedules?.map((s) => {
		const completed =
			s.expand?.job.filter((j) => j.status === 'COMPLETED' || j.status === 'CANCELED').length /
			s.expand?.job.length;
		return {
			...s,
			completed: completed * 100
		};
	});

	return json(schedules);
};
