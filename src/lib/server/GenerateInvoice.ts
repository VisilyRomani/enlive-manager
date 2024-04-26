import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { TInvoiceData } from '../../routes/(dashboard)/admin/invoice/+page.server';
import blobStream, { type IBlobStream } from 'blob-stream';
import PdfPrinter from 'pdfmake';
import dayjs from 'dayjs';
import Dinero from 'dinero.js';

interface ITax {
	type: string;
	percent: number;
	calculatedAmount: Dinero.Dinero;
	net: Dinero.Dinero;
}

var fonts = {
	Courier: {
		normal: 'Courier',
		bold: 'Courier-Bold',
		italics: 'Courier-Oblique',
		bolditalics: 'Courier-BoldOblique'
	},
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	},
	Times: {
		normal: 'Times-Roman',
		bold: 'Times-Bold',
		italics: 'Times-Italic',
		bolditalics: 'Times-BoldItalic'
	},
	Symbol: {
		normal: 'Symbol'
	},
	ZapfDingbats: {
		normal: 'ZapfDingbats'
	}
};
const printer = new PdfPrinter(fonts);

export const generateInvoicePdf = async (
	invoice_data: TInvoiceData,
	logo: string | undefined
): Promise<Blob> => {
	let subtotal = invoice_data.selectedJobData.expand.task.reduce((acc, cur) => {
		return acc.add(Dinero({ amount: cur.price }).multiply(cur.count));
	}, Dinero({ amount: 0 }));

	let taxInfo = invoice_data.selectedJobData.expand.task.reduce((acc, cur) => {
		cur.expand.service.expand.tax.map((tax) => {
			let idx = acc.findIndex((t) => t.type === tax.name);
			if (idx !== -1) {
				acc[idx].calculatedAmount = acc[idx].calculatedAmount.add(
					Dinero({ amount: cur.price })
						.multiply(cur.count)
						.multiply(tax.percent / 100)
				);
				acc[idx].net = acc[idx].net.add(Dinero({ amount: cur.price }).multiply(cur.count));
			} else {
				acc.push({
					type: tax.name,
					percent: tax.percent,
					calculatedAmount: Dinero({ amount: cur.price })
						.multiply(cur.count)
						.multiply(tax.percent / 100),
					net: Dinero({ amount: cur.price }).multiply(cur.count)
				});
			}
		});
		return acc;
	}, [] as ITax[]);

	const file: TDocumentDefinitions = {
		pageSize: 'A4',
		pageMargins: [30, 30, 30, 80],
		content: [
			{
				columns: [
					[
						{
							text: 'Invoice\n',
							style: { bold: true, fontSize: 24, lineHeight: 1.5, color: '#0369a1' }
						},
						{
							columns: [
								{
									text: [
										{ text: `Invoice number\n`, style: { bold: true, fontSize: 10 } },
										{ text: `Date of issue\n`, style: { fontSize: 10 } },
										{ text: `Date Due\n`, style: { fontSize: 10 } }
									],
									width: 'auto',
									marginRight: 20
								},
								{
									text: [
										{
											text: `${invoice_data.selectedJobData.job_number}\n`,
											style: { bold: true, fontSize: 10 }
										},
										{
											text: `${dayjs(invoice_data.issue_date).format('MMMM D, YYYY')}\n`,
											style: { fontSize: 10 }
										},
										{
											text: `${dayjs(invoice_data.due_date).format('MMMM D, YYYY')}\n`,
											style: { fontSize: 10 }
										}
									],
									width: '*'
								}
							],
							lineHeight: 1.5
						}
					],

					logo
						? {
								image: logo,
								fit: [100, 75],
								alignment: 'right'
						  }
						: ''
				],
				marginBottom: 15
			},
			{
				columns: [
					{
						text: [
							{
								text: `${invoice_data.companyInvoiceDetails.name}\n`,
								style: { bold: true, fontSize: 10 }
							},
							{
								text: `${invoice_data.companyInvoiceDetails.address.split(',').join('\n')}\n`,
								style: { bold: false, fontSize: 10 }
							},
							{
								text: `${invoice_data.companyInvoiceDetails.email}\n`,
								style: { bold: false, fontSize: 10 }
							},
							invoice_data.companyInvoiceDetails.gst
								? {
										text: `GST: ${invoice_data.companyInvoiceDetails.gst}\n`,
										style: { bold: false, fontSize: 10 }
								  }
								: '',
							invoice_data.companyInvoiceDetails.pst
								? {
										text: `PST: ${invoice_data.companyInvoiceDetails.pst}\n`,
										style: { bold: false, fontSize: 10 }
								  }
								: ''
						]
					},
					{
						stack: [
							{
								text: 'Bill to:',
								style: { bold: true, fontSize: 10, alignment: 'left' }
							},
							{
								text: `${invoice_data.selectedJobData.expand.address.expand.client.first_name} ${invoice_data.selectedJobData.expand.address.expand.client.last_name}`,
								style: { bold: false, fontSize: 10, alignment: 'left' }
							},
							{
								text: `${invoice_data.selectedJobData.expand.address.address
									.split(',')
									.join('\n')}`,
								style: { bold: false, fontSize: 10, alignment: 'left' }
							},
							{
								text: `${invoice_data.selectedJobData.expand.address.expand.client.email}`,
								style: { bold: false, fontSize: 10, alignment: 'left' }
							}
						],
						alignment: 'right'
					}
				],
				lineHeight: 1.5,
				marginBottom: 15
			},
			{
				table: {
					widths: [200, '*', '*', '*', '*'],
					body: [
						[
							{ text: 'DESCRIPTION', style: { color: '#0369a1', bold: true } },
							{ text: 'QTY', style: { color: '#0369a1' }, bold: true, alignment: 'right' },
							{ text: 'RATE', style: { color: '#0369a1', bold: true, alignment: 'right' } },
							{ text: 'TAX', style: { color: '#0369a1', bold: true, alignment: 'right' } },
							{ text: 'AMOUNT', style: { color: '#0369a1', bold: true, alignment: 'right' } }
						],
						...invoice_data.selectedJobData.expand.task.map((t) => {
							return [
								{ text: t.expand.service.name, color: '#3A3B3C', fontSize: 10 },
								{ text: t.count, color: '#3A3B3C', fontSize: 10, alignment: 'right' },
								{
									text: Dinero({ amount: t.price }).toFormat('$0.00'),
									color: '#3A3B3C',
									fontSize: 10,
									alignment: 'right'
								},
								{
									text: t.expand.service.expand.tax.map((t) => t.name).join('/'),
									color: '#3A3B3C',
									fontSize: 10,
									alignment: 'right'
								},
								{
									text: Dinero({ amount: t.price }).multiply(t.count).toFormat('$0.00'),
									color: '#3A3B3C',
									fontSize: 10,
									alignment: 'right'
								}
							];
						})
					]
				},
				layout: {
					paddingLeft: function (i, node) {
						return 5;
					},
					paddingRight: function (i, node) {
						return 5;
					},
					paddingTop: function (i, node) {
						return 5;
					},
					paddingBottom: function (i, node) {
						return 5;
					},

					vLineWidth: function (i) {
						return 0;
					},
					hLineWidth: function (i, node) {
						return i > 1 ? 0.5 : 0;
					},
					hLineColor: function (i) {
						return 'lightgray';
					},
					fillColor: function (row, col, node) {
						return row === 0 ? '#bae6fd' : null;
					}
				},
				marginBottom: 15
			},
			{
				columns: [
					'',
					{
						stack: [
							{
								columns: [
									{
										stack: [
											{ text: 'SUBTOTAL', style: { color: 'gray' } },
											...taxInfo.map((t) => ({
												text: `${t.type} @ ${t.percent}%`,
												style: { color: 'gray' }
											}))
										],
										style: { lineHeight: 1.5, fontSize: 10 }
									},
									{
										stack: [
											{ text: subtotal.toFormat('$0.00'), style: { color: 'gray' } },
											...taxInfo.map((t) => ({
												text: t.calculatedAmount.toFormat('$0.00'),
												style: { color: 'gray' }
											}))
										],
										alignment: 'right',
										style: { lineHeight: 1.5, fontSize: 10 }
									}
								]
							},
							{
								canvas: [
									{
										type: 'line',
										x1: 0,
										y1: 5,
										x2: 535 / 2,
										y2: 5,
										dash: { length: 4, space: 8 },
										lineColor: 'gray'
									}
								],
								margin: [0, 0, 0, 12]
							},
							{
								columns: [
									{ text: 'BALANCE DUE', style: { color: 'black', bold: true } },
									{
										text: subtotal
											.add(
												taxInfo.reduce((acc, cur) => {
													acc = acc.add(cur.calculatedAmount);
													return acc;
												}, Dinero({ amount: 0 }))
											)
											.toFormat('$0.00'),
										style: { color: 'black', bold: true },
										alignment: 'right'
									}
								]
							}
						],
						unbreakable: true
					}
				],
				marginBottom: 15
			},
			{
				stack: [
					{ text: 'TAX SUMMARY', style: { color: '#0369a1', bold: true } },
					{
						table: {
							widths: [200, '*', '*', '*'],
							body: [
								[
									{ text: '', style: { color: '#0369a1', bold: true }, alignment: 'right' },
									{ text: 'RATE', style: { color: '#0369a1' }, bold: true, alignment: 'right' },
									{ text: 'TAX', style: { color: '#0369a1', bold: true }, alignment: 'right' },
									{ text: 'NET', style: { color: '#0369a1', bold: true }, alignment: 'right' }
								],
								...taxInfo.map((t) => {
									return [
										{ text: '' },
										{
											text: `${t.type} @ ${t.percent}%`,
											color: '#3A3B3C',
											fontSize: 10,
											alignment: 'right'
										},
										{
											text: t.calculatedAmount.toFormat('$0.00'),
											color: '#3A3B3C',
											fontSize: 10,
											alignment: 'right'
										},
										{
											text: t.net.toFormat('$0.00'),
											color: '#3A3B3C',
											fontSize: 10,
											alignment: 'right'
										}
									];
								})
							]
						},
						layout: {
							paddingLeft: function (i, node) {
								return 5;
							},
							paddingRight: function (i, node) {
								return 5;
							},
							paddingTop: function (i, node) {
								return 5;
							},
							paddingBottom: function (i, node) {
								return 5;
							},

							vLineWidth: function (i) {
								return 0;
							},
							hLineWidth: function (i, node) {
								return i > 1 ? 0.5 : 0;
							},
							hLineColor: function (i) {
								return 'lightgray';
							},
							fillColor: function (row, col, node) {
								return row === 0 ? '#bae6fd' : null;
							}
						},
						marginBottom: 20
					},
					{
						text: invoice_data.companyInvoiceDetails.footer,
						style: { color: 'gray', fontSize: 10 },
						alignment: 'center'
					}
				],
				unbreakable: true
			}
		],
		footer: function (currentPage, pageCount, pageSize) {
			return {
				stack: [
					{
						canvas: [
							{
								type: 'line',
								x1: 30,
								y1: 20,
								x2: pageSize.width - 30,
								y2: 20,
								lineWidth: 0.5,
								lineColor: '#D3D3D3'
							}
						],
						marginBottom: 20
					},
					{
						columns: [
							{
								text: `${invoice_data.selectedJobData.job_number} - ${subtotal
									.add(
										taxInfo.reduce((acc, cur) => {
											acc = acc.add(cur.calculatedAmount);
											return acc;
										}, Dinero({ amount: 0 }))
									)
									.toFormat('$0.00')} due ${dayjs(invoice_data.due_date).format('MMMM D, YYYY')}`,
								style: { fontSize: 8 }
							},
							{
								text: `Page ${currentPage.toString() + ' of ' + pageCount}`,
								style: { fontSize: 8, alignment: 'right' }
							}
						],
						color: 'gray',
						margin: [30, 0, 30, 30]
					}
				]
			};
		},
		defaultStyle: {
			font: 'Helvetica'
		}
	};

	return new Promise((resolve, reject) => {
		const pdf = printer.createPdfKitDocument(file);
		pdf
			.pipe(blobStream())
			.on('finish', function (this: IBlobStream) {
				console.log('Finished generating PDF');
				resolve(this.toBlob('application/pdf'));
			})
			.on('error', (err) => {
				console.error('err', err);
				reject(err);
			});

		pdf.end();
	});
};
