import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import z from 'zod';
import dayjs from 'dayjs';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { GenerateEmail } from '$lib/server/email/InvoiceEmail';
import Dinero from 'dinero.js';

export interface TInvoiceData {
	companyInvoiceDetails: TCompanyInvoce;
	selectedJobData: TJobInvoice & { client_name: string };
	due_date: string;
	issue_date: string;
}

interface TCompanyInvoce {
	days_until_due: number;
	days_until_final: number;
	logo: string;
	phone: string;
	pst: string;
	address: string;
	gst: string;
	terms: string;
	url: string;
	footer: string;
	email: string;
	name: string;
}

export interface TJobInvoice {
	id: string;
	job_number: number;
	expand: {
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
		task: {
			count: number;
			price: number;
			expand: {
				service: {
					id: string;
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
	};
}

const InvoiceValidation = z.object({
	jobId: z.string().min(1),
	invoice_number: z.number().nonnegative(),
	issue_date: z.string(),
	due_date: z.string(),
	client_email: z.string().email(),
	invoice_data: z
		.object({
			service: z.string().min(1),
			price: z.number().min(0),
			quantity: z.number().min(0)
		})
		.array()
		.min(1),
	invoice_pdf: z.instanceof(File)
});

interface IInvoiceCreate {
	id: string;
	quantity: number;
	price: number;
	expand: {
		service: {
			expand: {
				tax: {
					percent: number;
				}[];
			};
		};
	};
}

interface IInvoicedData {
	cancelled: boolean;
	invoice_number: number;
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
		};
		job: {
			id: string;
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
			};
		};
	};
}
export const load: PageServerLoad = async ({ locals }) => {
	const companyInvoiceDetails = await locals.pb
		.collection('company')
		.getOne<TCompanyInvoce>(locals.user.company);

	const invoiceJobs = await locals.pb.collection('job').getFullList<TJobInvoice>({
		expand: 'address.client, task.service.tax',
		filter: 'invoiced=false && status="COMPLETED"',
		fields: `id, 
            job_number, 
            expand.address.address, 
            expand.address.expand.client.first_name, 
            expand.address.expand.client.last_name, 
            expand.address.expand.client.email,
            expand.task.count,
            expand.task.price,
            expand.task.expand.service.id,
			expand.task.expand.service.name,
            expand.task.expand.service.expand.tax.name,
            expand.task.expand.service.expand.tax.percent
            `
	});

	const invoicedJobs = await locals.pb.collection('invoice').getFullList<IInvoicedData>({
		expand:
			'invoice_data, invoice_data.service, invoice_data.service.tax, job, job.address.client, job.address, payments(invoice)',
		fields: `cancelled, 
		invoice_number,
		expand.job.id,
		expand.job.expand.address.expand.client.first_name,
		expand.job.expand.address.expand.client.last_name,
		expand.job.expand.address.address,
		expand.payments(invoice).method,
		expand.payments(invoice).paid,
		expand.payments(invoice).code,
		expand.invoice_data.price,
		expand.invoice_data.quantity,
		expand.invoice_data.expand.service.expand.tax.percent,
		expand.invoice_data.expand.service.expand.tax.name,
		expand.invoice_data.expand.service.name,
		`
	});
	const createInvoiceForm = await superValidate(
		{
			issue_date: dayjs(new Date()).format('YYYY-MM-DD'),
			due_date: dayjs(new Date())
				.add(companyInvoiceDetails.days_until_due, 'days')
				.format('YYYY-MM-DD')
		},
		zod(InvoiceValidation)
	);

	return {
		invoicedJobs,
		invoiceJobs,
		companyInvoiceDetails,
		createInvoiceForm
	};
};

export const actions = {
	CreateInvoice: async ({ request, locals }) => {
		const createInvoiceForm = await superValidate(request, zod(InvoiceValidation));

		if (!createInvoiceForm.valid) {
			return fail(400, withFiles({ createInvoiceForm }));
		}

		const record = await locals.pb.collection('company').getOne(locals.user.company);
		const url = locals.pb.files.getUrl(record, record.logo);

		const InvoiceData = await Promise.all(
			createInvoiceForm.data.invoice_data.map((i) => {
				return locals.pb
					.collection('invoice_data')
					.create<IInvoiceCreate>(
						{ quantity: i.quantity, price: i.price, service: i.service },
						{ requestKey: null, expand: 'service.tax' }
					);
			})
		);

		const Invoice = await locals.pb.collection('invoice').create(
			{
				job: createInvoiceForm.data.jobId,
				invoice_number: createInvoiceForm.data.invoice_number,
				issue_date: createInvoiceForm.data.issue_date,
				due_date: createInvoiceForm.data.due_date,
				invoice_pdf: createInvoiceForm.data.invoice_pdf,
				invoice_data: InvoiceData.map((i) => i.id)
			},
			{ requestKey: null, expand: 'job.address.client' }
		);

		await locals.pb
			.collection('job')
			.update(createInvoiceForm.data.jobId, { invoiced: true }, { requestKey: null });

		const subtotal = InvoiceData.reduce((acc, cur) => {
			acc = acc.add(Dinero({ amount: cur.price }).multiply(cur.quantity));
			return acc;
		}, Dinero({ amount: 0 }));

		const tax = InvoiceData.reduce((acc, cur) => {
			acc = acc.add(
				Dinero({ amount: cur.price })
					.multiply(cur.quantity)
					.multiply(
						cur.expand.service.expand.tax.reduce((acc, cur) => (acc = acc + cur.percent), 0) * 0.01
					)
			);
			return acc;
		}, Dinero({ amount: 0 }));

		const emailResult = await GenerateEmail({
			invoice_pdf: createInvoiceForm.data.invoice_pdf,
			company: record.name,
			company_logo: url,
			invoice_number: createInvoiceForm.data.invoice_number,
			client_name: `${Invoice.expand?.job.expand.address.expand.client.first_name} ${Invoice.expand?.job.expand.address.expand.client.last_name}`,
			client_email: createInvoiceForm.data.client_email,
			issued: createInvoiceForm.data.issue_date,
			due: createInvoiceForm.data.due_date,
			subtotal: subtotal,
			tax: tax,
			total: subtotal.add(tax),
			footer: record.footer
		});
		console.log(emailResult);

		return withFiles({ createInvoiceForm });
	}
};
