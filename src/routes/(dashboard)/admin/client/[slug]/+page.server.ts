import Dinero from 'dinero.js';

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

interface IClientInvoices {
	id: string;
	invoice_number: number;
	collected: Dinero.DineroObject;
	total: Dinero.DineroObject;
	outstanding: Dinero.DineroObject;
	expand: {
		invoice_data: {
			price: number;
			quantity: number;
			expand: {
				service: {
					name: string;
					expand: {
						tax: {
							name: string;
							percent: number;
						}[];
					};
				};
			};
		}[];
		'payments(invoice)': {
			method: string;
			paid: number;
			code: string;
		}[];
	};
}

export const load = async ({ params, locals }) => {
	const client = await locals.pb
		.collection('client')
		.getOne<TClient>(params.slug, { expand: 'address(client)' });

	const jobs = Promise.all(
		client?.expand['address(client)'].map((addr) => {
			return locals.pb.collection('job').getFullList<TJob>({
				filter: `address~"${addr.id}"`,
				expand: 'address,task,task.service, ',
				fields: 'id,job_number,status, expand.address.address,expand.task.expand.service.name',
				requestKey: null
			});
		})
	);

	const invoices = (
		await locals.pb.collection('invoice').getFullList<IClientInvoices>({
			filter: `job.address.client="${client.id}"`,
			expand: 'invoice_data, invoice_data.service, invoice_data.service.tax, payments(invoice)',
			fields: `cancelled, 
			id,
		invoice_number,
		expand.payments(invoice).method,
		expand.payments(invoice).paid,
		expand.payments(invoice).code,
		expand.invoice_data.price,
		expand.invoice_data.quantity,
		expand.invoice_data.expand.service.expand.tax.percent,
		expand.invoice_data.expand.service.expand.tax.name,
		expand.invoice_data.expand.service.name,
		`
		})
	).map((job) => {
		job.collected = (job.expand['payments(invoice)'] ?? [])
			.reduce((acc, cur) => {
				return acc.add(Dinero({ amount: cur.paid }));
			}, Dinero({ amount: 0 }))
			.toObject();
		job.total = job.expand.invoice_data
			.reduce((acc, cur) => {
				const preTax = cur.price * cur.quantity;
				const tax_percent =
					cur.expand.service.expand.tax.reduce((acc, cur) => {
						acc += cur.percent;
						return acc;
					}, 0) / 100;

				acc = acc.add(
					Dinero({ amount: preTax }).add(Dinero({ amount: preTax }).multiply(tax_percent))
				);
				return acc;
			}, Dinero({ amount: 0 }))
			.toObject();
		job.outstanding = Dinero({ amount: job.total.amount - job.collected.amount }).toObject();
		return job;
	});

	return {
		client,
		slug: params.slug,
		streamed: {
			jobs,
			invoices
		}
	};
};
