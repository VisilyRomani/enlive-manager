import { redirect } from '@sveltejs/kit';
type TClient = {
	id: string;
	first_name: string;
	last_name: string;
	created: Date;
	email: string;
	phone: string;
	notes: string;
	expand: {
		'address(client)': {
			address: string;
			active: boolean;
			lat: number;
			lng: number;
			id: string;
		}[];
	};
};

type TJob = {
	id: string;
	status: string;
	job_number: number;
	expand: {
		address: {
			address: string;
		};
		task: {
			expand: { service: { name: string } };
		}[];
	};
};

export const load = async ({ params, locals }) => {
	const client = await locals.pb
		.collection('client')
		.getOne<TClient>(params.slug, { expand: 'address(client)' });

	const jobs = Promise.all(
		client?.expand['address(client)'].map((addr) => {
			return locals.pb.collection('job').getFullList<TJob>({
				filter: `address~"${addr.id}"`,
				expand: 'address,task,task.service',
				fields: 'id,job_number,status, expand.address.address,expand.task.expand.service.name',
				requestKey: null
			});
		})
	);

	return {
		client,
		slug: params.slug,
		streamed: {
			jobs
		}
	};
};
