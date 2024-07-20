import Dinero from 'dinero.js';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { _PaymentValidation } from '../+page.server';
import { zod } from 'sveltekit-superforms/adapters';

interface IInvoice {
	id: string;
	invoice_number: number;
	issue_date: Date;
	due_date: Date;
	invoice_pdf: string;
	pdf_url: string;
	job: string;
	cancelled: boolean;
	modified: boolean;
	expand: {
		'payments(invoice)': {
			method: string;
			paid: number;
			code: string;
		}[];
		invoice_data: {
			quantity: number;
			price: number;
			expand: {
				service: {
					expand: {
						tax: {
							name: string;
							percent: number;
						}[];
					};
					name: string;
				};
			};
		}[];
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
}

export const load: PageServerLoad = async ({ locals, params }) => {
	const record = await locals.pb.collection('invoice').getOne(params.slug);
	const createPaymentForm = await superValidate(zod(_PaymentValidation));

	const invoice = await locals.pb.collection('invoice').getOne<IInvoice>(params.slug, {
		expand: 'invoice_data.service.tax, job.address.client, payments(invoice)',
		fields: `id, 
                job,
                invoice_number,
				issue_date,
				due_date,
				cancelled,
				modified,
				invoice_pdf,
				expand.invoice_data.price,
				expand.invoice_data.quantity,
				expand.invoice_data.expand.service.name,
				expand.invoice_data.expand.service.expand.tax.percent,
				expand.invoice_data.expand.service.expand.tax.name,
				expand.payments(invoice).method,
				expand.payments(invoice).paid,
				expand.payments(invoice).code,
				expand.job.expand.address.expand.client.first_name,
				expand.job.expand.address.expand.client.last_name,
				expand.job.expand.address.expand.client.id`
	});
	const url = locals.pb.files.getUrl(record, invoice.invoice_pdf);
	const total = invoice.expand.invoice_data
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

	const paid = (invoice.expand['payments(invoice)'] ?? [])
		.reduce((acc, cur) => {
			return acc.add(Dinero({ amount: cur.paid }));
		}, Dinero({ amount: 0 }))
		.toObject();
	return {
		invoice: { ...invoice, pdf_url: url, total, paid },
		slug: params.slug,
		createPaymentForm
	};
};
