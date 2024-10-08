import { setError, superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import type Record from 'pocketbase';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

const TaxValidation = z.object({
	name: z.string().min(1),
	percent: z
		.number({ errorMap: () => ({ message: 'Must be a number' }) })
		.max(100, 'Must be a valid Percent [0-100]')
		.default('' as unknown as number)
});

const ToggleActiveValidation = z.object({ id: z.string().min(1), active: z.boolean() });

const ServiceValidation = z.object({
	name: z.string().min(1),
	tax: z.object({ label: z.string(), value: z.string() }).array().min(1)
});

const CodeValidation = z.object({
	permission: z.enum(['MANAGER', 'WORKER'])
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

interface TEmployeeList extends Record {
	id: string;
	first_name: string;
	last_name: string;
	permission: string;
	active: boolean;
}

interface TCodeList extends Record {
	id: string;
	permission: string;
	created: Date;
}

export const load: PageServerLoad = async ({ request, locals }) => {
	const taxForm = await superValidate(request, zod(TaxValidation));
	const taxActive = await superValidate(request, zod(ToggleActiveValidation));

	const serviceForm = await superValidate(request, zod(ServiceValidation));
	const serviceActive = await superValidate(request, zod(ToggleActiveValidation));

	const workerActive = await superValidate(request, zod(ToggleActiveValidation));

	const codeForm = await superValidate(request, zod(CodeValidation));

	if (locals.user?.permission !== 'WORKER') {
		const services =
			(await locals.pb?.collection('service').getFullList<TServiceList>({ expand: 'tax' })) ?? [];
		const taxes = (await locals.pb?.collection('tax').getFullList<TTaxList>()) ?? [];
		const employees = (await locals.pb?.collection('users').getFullList<TEmployeeList>()) ?? [];
		const codes =
			(await locals.pb
				?.collection('code')
				.getFullList<TCodeList>({ filter: `company="${locals.user.company}"` })) ?? [];

		return {
			taxForm,
			taxes,
			serviceForm,
			services,
			employees,
			codes,
			codeForm,
			taxActive,
			workerActive,
			serviceActive
		};
	} else {
		return {

		};
	}
};

export const actions = {
	createTax: async ({ locals, request }) => {
		const taxForm = await superValidate(request, zod(TaxValidation));
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
	toggleTax: async ({ locals, request }) => {
		const taxActive = await superValidate(request, zod(ToggleActiveValidation));
		if (taxActive.valid) {
			locals.pb.collection('tax').update(taxActive.data.id, { active: taxActive.data.active });
		}

		return { taxActive };
	},
	toggleWorker: async ({ locals, request }) => {
		const workerActive = await superValidate(request, zod(ToggleActiveValidation));
		if (workerActive.valid) {
			locals.pb
				.collection('users')
				.update(workerActive.data.id, { active: workerActive.data.active });
		}
	},
	createService: async ({ locals, request }) => {
		const serviceForm = await superValidate(request, zod(ServiceValidation));

		if (!serviceForm.valid) {
			return fail(400, { serviceForm });
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
	},
	toggleService: async ({ locals, request }) => {
		const serviceActive = await superValidate(request, zod(ToggleActiveValidation));
		if (serviceActive.valid) {
			locals.pb
				.collection('service')
				.update(serviceActive.data.id, { active: serviceActive.data.active });
		}
		return { serviceActive };
	},
	createCode: async ({ locals, request }) => {
		const codeForm = await superValidate(request, zod(CodeValidation));
		if (!codeForm.valid) {
			return fail(400, { codeForm });
		}

		await locals.pb
			?.collection('code')
			.create({ permission: codeForm.data.permission, company: locals.user?.company });
	}
};
