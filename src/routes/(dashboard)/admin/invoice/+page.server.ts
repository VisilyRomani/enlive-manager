import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import z from 'zod';
import dayjs from 'dayjs';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';

export interface TInvoiceData {
	companyInvoiceDetails: TCompanyInvoce;
	selectedJobData: TJobInvoice;
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

export const load: PageServerLoad = async ({ request, locals, fetch }) => {
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
		invoiceJobs,
		companyInvoiceDetails,
		createInvoiceForm
	};
};

export const actions = {
	CreateInvoice: async ({ request, locals }) => {
		const createInvoiceForm = await superValidate(request, zod(InvoiceValidation));
		console.log(await createInvoiceForm.data);
		if (!createInvoiceForm.valid) {
			return fail(400, withFiles({ createInvoiceForm }));
		}
		return withFiles({ createInvoiceForm });
	}
};
