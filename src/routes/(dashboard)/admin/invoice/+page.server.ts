import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import z from 'zod';
import dayjs from 'dayjs';
import { zod } from 'sveltekit-superforms/adapters';
import { GenerateEmail } from '$lib/server/email/InvoiceEmail';
import Dinero from 'dinero.js';
import { fail } from '@sveltejs/kit';

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

interface IPaymentData {
	id: string;
	created: Date;
	expand: {
		created_by: {
			first_name: string;
			last_name: string;
		};
		invoice: {
			id: string;
			invoice_number: number;
			expand: {
				job: {
					expand: {
						address: {
							expand: {
								client: {
									first_name: string;
									last_name: string;
									id: string;
								};
							};
						};
					};
				};
			};
		};
	};
	method: string;
	paid: number;
	reference_code: string;
}

export interface IInvoicedData {
	id: string;
	cancelled: boolean;
	issue_date: Date;
	due_date: Date;
	total: Dinero.DineroObject;
	collected: Dinero.DineroObject;
	outstanding: Dinero.DineroObject;
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
			created: Date;
		}[];
		job: {
			id: string;
			expand: {
				address: {
					address: string;
					expand: {
						client: {
							first_name: string;
							last_name: string;
							name: string;
						};
					};
				};
			};
		};
	};
}

const InvoiceValidation = z.object({
	jobId: z.string().min(1),
	invoice_number: z.number().nonnegative(),
	issue_date: z.string(),
	due_date: z.string(),
	client_email: z.string()
		.min(1, { message: "This field has to be filled." })
		.email(),
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

export const _PaymentValidation = z
	.object({
		invoice: z.string().min(1),
		paid: z.number().min(0),
		method: z.enum(['CASH', 'E-TRANSFER', 'CREDIT', 'DEBIT', 'CHEQUE']),
		reference_code: z.string().optional()
	})
	.refine(
		(val) => {
			if (val.method !== 'CASH') {
				return val.reference_code !== undefined;
			}
			return true;
		},
		{ message: 'Reference code is required', path: ['reference_code'] }
	);

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

	const invoicedJobs = (
		await locals.pb.collection('invoice').getFullList<IInvoicedData>({
			expand:
				'invoice_data, invoice_data.service, invoice_data.service.tax, job, job.address.client, job.address, payments(invoice)',
			fields: `cancelled, 
			id,
		invoice_number,
		issue_date,
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
		job.expand.job.expand.address.expand.client.name = `${job.expand.job.expand.address.expand.client.first_name} ${job.expand.job.expand.address.expand.client.last_name}`;

		return job;
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

	const payments = await locals.pb.collection('payments').getFullList<IPaymentData>({
		sort: '-created',
		expand: 'invoice.job.address.client, created_by',
		fields: `
			id,
			paid, 
			method, 
			reference_code,
			created,
			expand.created_by.first_name,
			expand.created_by.last_name,
			expand.invoice.expand.job.expand.address.expand.client.first_name,
			expand.invoice.expand.job.expand.address.expand.client.id,
			expand.invoice.expand.job.expand.address.expand.client.last_name,
			expand.invoice.id,
			expand.invoice.invoice_number
			`
	});

	const createPaymentForm = await superValidate(zod(_PaymentValidation));
	return {
		invoicedJobs,
		invoiceJobs,
		companyInvoiceDetails,
		createPaymentForm,
		createInvoiceForm,
		payments
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
	},
	CreatePayment: async ({ request, locals }) => {
		const pb = locals.pb;
		const createPaymentForm = await superValidate(request, zod(_PaymentValidation));
		if (!createPaymentForm.valid) {
			return fail(400, { createPaymentForm });
		}

		try {
			pb.collection('payments').create({
				...createPaymentForm.data,
				created_by: locals.user.id,
				paid: Math.trunc(+createPaymentForm.data.paid * 100)
			});
		} catch (e) {
			return fail(400, { createPaymentForm, error: e });
		}
		return { createPaymentForm };
	}
};
