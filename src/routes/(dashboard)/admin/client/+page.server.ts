import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const ClientValidation = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	addr: z.string().min(1, 'Address is required'),
	lat: z
		.number({
			errorMap: () => ({
				message: 'Require latitude number'
			})
		})
		.default('' as unknown as number),
	lng: z
		.number({
			errorMap: () => ({
				message: 'Require longitude number'
			})
		})
		.default('' as unknown as number),
	notes: z.string().optional()
});
export type ClientSchema = typeof ClientValidation;

export const load: PageServerLoad = async ({ request, locals }) => {
	const clientForm = await superValidate(request, ClientValidation);
	const clientList = await locals.pb?.collection('clients').getFullList({
		expand: 'address',
		fields: 'first_name, last_name, id,expand'
	});
	// const page = parseInt(url.searchParams.get('page') ?? '');
	// console.log(isNaN(page));
	// const clients = await locals.pb?.collection('clients').getList(isNaN(page) ? 1 : page, 20);
	return {
		clientForm,
		clientList
	};
};

export const actions = {
	CreateClient: async ({ locals, request }) => {
		const clientForm = await superValidate(request, ClientValidation);
		if (!clientForm.valid) {
			return fail(400, { clientForm });
		}

		const newClient = new FormData();
		const newClientAddress = new FormData();

		for (const [key, value] of Object.entries(clientForm.data)) {
			if (key === 'addr') {
				newClientAddress.append('address', String(value));
			} else if (key === 'lat' || key === 'lng') {
				newClientAddress.append(key, String(value));
			} else {
				newClient.append(key, String(value));
			}
		}

		newClientAddress.append('active', 'true');

		if (locals.user?.company) {
			newClient.append('company', locals.user?.company);
		} else {
			locals.pb?.authStore.clear();
		}

		try {
			const addr = await locals.pb?.collection('address').create(newClientAddress);

			if (addr) {
				newClient.append('address', addr.id);
			} else {
				return fail(400, { error: 'Could not create address' });
			}
			await locals.pb?.collection('clients').create(newClient);
			return { clientForm };
		} catch (e) {
			console.log(e);
			if (e instanceof Error) {
				return fail(400, { error: e.message });
			}
		}
		return { clientForm };
	}
};
