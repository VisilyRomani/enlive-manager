import dayjs from 'dayjs';
import type { PageServerLoad } from './$types';
import Dinero from 'dinero.js';
import type { IInvoicedData } from '../invoice/+page.server';



export const load: PageServerLoad = async ({ request, locals }) => {
    let twelve_month_date = dayjs().subtract(365, 'day');
    let three_month_date = dayjs().subtract(90, 'day');
    let one_month_date = dayjs().subtract(30, 'day');

    const year_invoice = await locals.pb.collection('invoice').getFullList<IInvoicedData>({ filter: `issue_date > "${twelve_month_date.format('YYYY-MM-D')} 00:00:00.000Z" && cancelled = false`, expand: 'payments(invoice), invoice_data.service.tax' })

    const gross_data_dinero = (year_invoice ?? []).reduce((acc, cur) => {
        // taxed total for all jobs of a single invoice
        const invoice_total = cur.expand.invoice_data.reduce((acc, cur) => {
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

        // amount paid for spesific invoice and filtered for stuff within last month
        const paid_amount = (cur.expand['payments(invoice)'] ?? []).reduce((paid_acc, paid_cur) => {
            paid_acc = { ...paid_acc, all_payments: paid_acc.all_payments + paid_cur.paid }

            if (dayjs(paid_cur.created).isAfter(one_month_date)) {
                paid_acc = { ...paid_acc, month_payments: paid_acc.month_payments + paid_cur.paid }
            }

            return paid_acc
        }, { all_payments: 0, month_payments: 0 });

        // sum all payments within last 30 days
        acc = { ...acc, paid_month: acc.paid_month.add(Dinero({ amount: paid_amount.month_payments })) }

        // overdue invoices
        if (dayjs(cur.due_date).isBefore(dayjs())) {
            acc = { ...acc, unpaid_overdue: invoice_total.subtract(Dinero({ amount: paid_amount.all_payments })) }
        } else {
            acc = { ...acc, unpaid_not_due_yet: invoice_total.subtract(Dinero({ amount: paid_amount.all_payments })) }
        }

        // sort for gross
        if (dayjs(cur.issue_date).isAfter(one_month_date)) {
            acc = { ...acc, gross_month: acc.gross_month.add(invoice_total) }
        }

        if (dayjs(cur.issue_date).isAfter(three_month_date)) {
            acc = { ...acc, gross_three_month: acc.gross_three_month.add(invoice_total) }

        }
        if (dayjs(cur.issue_date).isAfter(twelve_month_date)) {
            acc = { ...acc, gross_year: acc.gross_year.add(invoice_total) }

        }
        return acc
    }, {
        gross_month: Dinero({ amount: 0 }),
        gross_three_month: Dinero({ amount: 0 }),
        gross_year: Dinero({ amount: 0 }),
        unpaid_overdue: Dinero({ amount: 0 }),
        unpaid_not_due_yet: Dinero({ amount: 0 }),
        paid_month: Dinero({ amount: 0 })
    })

    const job_count = await locals.pb.collection('job').getFullList({
        filter: `created < "${one_month_date}"`
    })
    const company_finance = {
        gross_month: gross_data_dinero.gross_month.toObject(),
        gross_three_month: gross_data_dinero.gross_three_month.toObject(),
        gross_year: gross_data_dinero.gross_year.toObject(),
        unpaid_overdue: gross_data_dinero.unpaid_overdue.toObject(),
        unpaid_not_due_yet: gross_data_dinero.unpaid_not_due_yet.toObject(),
        paid_month: gross_data_dinero.paid_month.toObject()
    }

    return { company_finance, month_job_count: job_count.length }
}
