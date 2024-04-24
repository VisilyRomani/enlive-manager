import { generateInvoicePdf } from '$lib/server/GenerateInvoice';
import type { TInvoiceData } from '../../invoice/+page.server';

const blobToBase64 = async (blob: Blob) => {
	const buffer = Buffer.from(await blob.arrayBuffer());
	return `data:${blob.type};base64,${buffer.toString('base64')}`;
};

export const POST = async ({ setHeaders, request, locals, fetch }) => {
	const invoice_data: TInvoiceData = await request.json();
	const record = await locals.pb.collection('company').getOne(locals.user.company);
	const url = locals.pb.files.getUrl(record, invoice_data.companyInvoiceDetails.logo);
	let logo = await blobToBase64(await fetch(url).then((r) => r.blob()));

	const pdf = await generateInvoicePdf(invoice_data, logo);

	setHeaders({
		'Content-Type': 'application/pdf',
		'Content-Length': pdf.size.toString(),
		'Last-Modified': new Date().toUTCString(),
		'Cache-control': 'public, max-age=600'
	});

	return new Response(pdf);
};
