import type { PageServerLoad } from './$types';

interface IInvoice {
	id: string;
	invoice_number: number;
	issue_date: Date;
	invoice_pdf: Blob;
	job: string;
	cancelled: boolean;
	modified: boolean;
	invoice_data: {
		quantity: number;
		price: number;
		expand: {
			service: {
				name: string;
			};
		};
	}[];
}

export const load: PageServerLoad = async ({ locals, params }) => {
	console.log(params.slug);

	const invoice = await locals.pb.collection('invoice').getOne<IInvoice>(params.slug, {
		expand: 'invoice_data.service.tax',
		fields: `id, 
                job,
                invoice_number,
                issue_date,
                cancelled,
                modified,
                invoice_pdf,
                expand.invoice_data.price,
                expand.invoice_data.quantity,
                expand.invoice_data.expand.service.name,
                expand.invoice_data.expand.service.expand.tax.percent `
	});
	return { invoice, slug: params.slug };
};
