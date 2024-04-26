import { Resend } from 'resend';
import InvoiceEmailTemplate from './InvoiceEmailTemplate.svelte';
import { render } from 'svelte-email';
import { RESEND } from '$env/static/private';

const resend = new Resend(RESEND);

export interface IInvoiceTemplate {
	company: string;
	company_logo: string;
	invoice_number: number;
	client_name: string;
	client_email: string;
	issued: string;
	due: string;
	subtotal: Dinero.Dinero;
	tax: Dinero.Dinero;
	total: Dinero.Dinero;
	footer: string;
	invoice_pdf: File;
}

export const GenerateEmail = async (InvoiceData: IInvoiceTemplate) => {
	const emailHtml = render({
		template: InvoiceEmailTemplate,
		props: { InvoiceData }
	});
	const textEmailHtml = render({
		template: InvoiceEmailTemplate,
		props: { InvoiceData },
		options: {
			plainText: true
		}
	});
	console.log(InvoiceData.company_logo);

	return resend.emails.send({
		from: `${InvoiceData.company} <invoice@enlivemanager.com>`,
		to: ['visilyromanicm@gmail.com'],
		subject: `Invoice #${InvoiceData.invoice_number} from ${InvoiceData.company}`,
		attachments: [
			{
				filename: 'invoice.pdf',
				content: Buffer.from(await InvoiceData.invoice_pdf.arrayBuffer())
			}
		],
		html: emailHtml,
		text: textEmailHtml
	});
};
