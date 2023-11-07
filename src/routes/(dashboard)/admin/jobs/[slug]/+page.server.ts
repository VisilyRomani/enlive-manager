import type { PageServerLoad } from './$types';

type TJobData = {
	id: string;

	expand: {
		task: {
			expand: { service: { name: string; expand: { tax: { percent: number }[] } } };
			price: number;
			count: number;
		}[];
		address: {
			address: string;
			expand: {
				client: {
					first_name: string;
					last_name: string;
					email: string;
				};
			};
		};
	};
	status: string;
	notes: string;
};

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const job = await locals.pb?.collection('job').getOne<TJobData>(params.slug, {
			expand: 'address,address.client, task, task.service, task.service.tax'
		});
		return { job };
	} catch (e) {
		console.log(e);
	}
	return {};
};
