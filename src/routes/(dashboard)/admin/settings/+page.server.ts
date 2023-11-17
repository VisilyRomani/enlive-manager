import { setError, superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import type Record from 'pocketbase';
import { fail } from '@sveltejs/kit';

const TaxValidation = z.object({
	name: z.string().min(1),
	percent: z
		.number({ errorMap: () => ({ message: 'Must be a number' }) })
		.max(100, 'Must be a valid Percent [0-100]')
		.default('' as unknown as number)
});

const ServiceValidation = z.object({
	name: z.string().min(1),
	tax: z.object({ label: z.string(), value: z.string() }).array().min(1)
});

interface TTaxList extends Record {
	active: boolean;
	name: string;
	id: string;
	percent: number;
}

interface TServiceList extends Record {
	name: string;
	expand: { tax: { name: string; percent: number }[] };
	active: boolean;
	id: string;
}

export const load: PageServerLoad = async ({ request, locals }) => {
	const taxForm = await superValidate(request, TaxValidation);
	const serviceForm = await superValidate(request, ServiceValidation);

	try {
		const taxes = (await locals.pb?.collection('tax').getFullList<TTaxList>()) ?? [];
		const services =
			(await locals.pb?.collection('service').getFullList<TServiceList>({ expand: 'tax' })) ?? [];

		return { taxForm, taxes, serviceForm, services };
	} catch (e) {
		if (e instanceof Error) {
			return fail(400, { message: e.message });
		}
	}

	return { taxForm, serviceForm, taxes: [], services: [] };
};

export const actions = {
	createTax: async ({ locals, request }) => {
		const taxForm = await superValidate(request, TaxValidation);
		if (!taxForm.valid) {
			return { taxForm };
		}

		const taxData = new FormData();

		taxData.append('name', taxForm.data.name.toUpperCase());
		taxData.append('percent', String(taxForm.data.percent));
		taxData.append('active', 'true');
		if (locals.user?.company) {
			taxData.append('company', locals.user.company);
		} else {
			locals.pb?.authStore.clear();
		}

		try {
			const newTax = await locals.pb?.collection('tax').create(taxData);
			return { taxForm, newTax };
		} catch (e) {
			if (e instanceof Error) {
				console.error(e);
				return setError(taxForm, 'name', 'Name already exists.');
			}
		}
		return { taxForm };
	},
	createService: async ({ locals, request }) => {
		const serviceForm = await superValidate(request, ServiceValidation);

		if (!serviceForm.valid) {
			return { serviceForm };
		}

		const serviceData = new FormData();
		serviceData.append('name', serviceForm.data.name.toUpperCase());
		if (locals.user?.company) {
			serviceData.append('company', locals.user.company);
		} else {
			locals.pb?.authStore.clear();
		}
		serviceData.append('active', 'true');

		serviceForm.data.tax.map((t) => {
			serviceData.append('tax', t.value);
		});

		try {
			await locals.pb?.collection('service').create(serviceData);
		} catch (e) {
			if (e instanceof Error) {
				return setError(serviceForm, 'name', e.message);
			}
		}
		return { serviceForm };
	}
};
