import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import type Record from 'pocketbase';

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

export interface IClientList extends Record {
	id: string;
	first_name: string;
	last_name: string;
	expand: {
		'address(client)': {
			address: string;
			id: string;
		}[];
	};
}

export const load: PageServerLoad = async ({ request, locals }) => {
	const clientForm = await superValidate(request, ClientValidation);
	const clientList = (
		await locals.pb?.collection('client').getFullList<IClientList>({
			expand: 'address(client)',
			fields: 'first_name, last_name, id, expand'
		})
	)?.map((c) => ({
		id: c.id,
		first_name: c.first_name,
		last_name: c.last_name,
		address: c.expand?.['address(client)']
	}));
	return {
		clientForm,
		clientList: clientList
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
			if (!(key === 'email' && !value) && !!value) {
				newClient.append(key, String(value));
			}

			// Used to seperate the form for Address
			if (key === 'addr') {
				newClientAddress.append('address', String(value));
			}
			if (key === 'lat' || key === 'lng') {
				newClientAddress.append(key, String(value));
			}
		}

		newClientAddress.append('active', 'true');

		if (locals.user?.company) {
			newClient.append('company', locals.user?.company);
		} else {
			locals.pb?.authStore.clear();
		}

		try {
			const client = await locals.pb?.collection('client').create(newClient);
			if (client) {
				newClientAddress.append('client', client?.id);
			} else {
				return fail(400, { error: 'failed to create client address' });
			}

			const addr = await locals.pb?.collection('address').create(newClientAddress);

			if (addr) {
				newClient.append('address', addr.id);
			} else {
				return fail(400, { error: 'Could not create address' });
			}
			return { clientForm };
		} catch (e) {
			if (e instanceof Error) {
				return fail(400, { error: e.message });
			}
		}
		return { clientForm };
	}
};
