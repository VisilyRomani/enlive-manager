<script lang="ts">
	import {
		Button,
		Column,
		Container,
		Head,
		Hr,
		Html,
		Img,
		Preview,
		Section,
		Text
	} from 'svelte-email';
	import type { IInvoiceTemplate } from './InvoiceEmail';
	import dayjs from 'dayjs';

	export let InvoiceData: IInvoiceTemplate;

	const fontFamily =
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

	const main = {
		backgroundColor: '#ffffff'
	};

	const container = {
		margin: '0 auto',
		padding: '20px 0 48px',
		width: '580px'
	};

	const logo = {
		margin: '0 auto'
	};

	const header = {
		fontFamily,
		fontSize: '24px',
		fontWeight: 'bold',
		textAlign: 'center' as const,
		color: '#484848'
	};

	const sub_header = {
		// fontFamily,
		fontSize: '12',
		textAlign: 'center' as const,
		color: 'gray'
	};

	const hr = {
		borderColor: '#cccccc',
		margin: '20px 0'
	};

	const tableCell = { display: 'table-cell' };

	const columns = {
		margin: '0 auto',
		lineHeight: '26px',
		...tableCell
	};

	const footer = {
		fontFamily,
		color: '#8898aa',
		fontSize: '12px',
		margin: '0 auto',
		textAlign: 'center' as const
	};
</script>

<Html lang="en">
	<Head>
		<title>Invoice {InvoiceData.invoice_number}</title>
		<meta name="invoice" content={`Email invoice no. ${InvoiceData.invoice_number}`} />
		<style>
			body: {
				backgroundcolor: '#fef9ff';
			}
		</style>
	</Head>
	<Preview preview="Invoice" />
	<Section style={main}>
		<Container style={container}>
			<Img
				src={InvoiceData.company_logo}
				alt="Company logo"
				style={logo}
				width="200"
				height="auto"
			/>
			<Text style={header}>Thank you for supporting us</Text>
			<Text style={sub_header}>
				Your invoice summary is below. A detailed invoice is attached as a pdf.
			</Text>

			<Text style={{ fontWeight: 'bold', fontFamily }}>Invoice #{InvoiceData.invoice_number}</Text>
			<Text style={{ margin: 0, fontFamily }}>Customer:</Text>
			<Text style={{ margin: 0, fontWeight: 'bold', fontFamily }}
				>{InvoiceData.client_name}
				<span
					style="margin: 0; font-weight: normal; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif"
				>
					({InvoiceData.client_email})
				</span>
			</Text>
			<Text style={{ margin: 0, fontFamily }}>Issue Date:</Text>
			<Text style={{ margin: 0, fontWeight: 'bold', fontFamily }}>
				{dayjs(InvoiceData.issued).format('MMMM D, YYYY')}
			</Text>
			<Text style={{ margin: 0, fontFamily }}>Due Date:</Text>
			<Text style={{ margin: 0, fontWeight: 'bold', fontFamily }}>
				{dayjs(InvoiceData.due).format('MMMM D, YYYY')}
			</Text>

			<table
				style="width:100%"
				align="center"
				border="0"
				cellpadding="0"
				cellspacing="0"
				role="presentation"
			>
				<tbody
					><tr
						><td style="margin:0 auto;"
							><p
								style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif"
							>
								Subtotal
							</p>
							<p
								style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif"
							>
								Tax
							</p>
							<p
								style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif"
							>
								Total
							</p></td
						>
						<td style="margin:0 auto;line-height:26px"
							><p
								style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif"
							>
								{InvoiceData.subtotal.toFormat('$0.00')}
							</p>
							<p
								style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif"
							>
								{InvoiceData.tax.toFormat('$0.00')}
							</p>
							<p
								style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif"
							>
								{InvoiceData.total.toFormat('$0.00')}
							</p></td
						></tr
					></tbody
				>
			</table>
			<Section>
				<Hr style={hr} />
				<Text style={footer}>{InvoiceData.footer}</Text>
			</Section>
		</Container>
	</Section>
</Html>
