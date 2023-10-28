import { setError, superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { fail } from 'assert';
import type Record from 'pocketbase';

const TaxValidation = z.object({
	name: z.string().min(1),
	percent: z
		.number({ errorMap: () => ({ message: 'Must be a number' }) })
		.max(100, 'Must be a valid Percent [0-100]')
		.default('' as unknown as number)
});

interface TTaxList extends Record {
	active: boolean;
	name: string;
	id: string;
	percent: number;
}

export const load: PageServerLoad = async ({ request, locals }) => {
	const taxForm = await superValidate(request, TaxValidation);

	try {
		const taxes = (await locals.pb?.collection('tax').getFullList<TTaxList>()) ?? [];
		return { taxForm, taxes };
	} catch (e) {
		if (e instanceof Error) {
			return fail(400, e.message);
		}
	}

	return { taxForm, taxes: [] };
};

export const actions = {
	createTax: async ({ locals, request }) => {
		const taxForm = await superValidate(request, TaxValidation);
		if (!taxForm.valid) {
			return { taxForm };
		}

		const taxData = new FormData();

		taxData.append('name', taxForm.data.name);
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
				console.log(e);
				return setError(taxForm, 'name', 'Name already exists.');
			}
		}
	}
};
