import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
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
				message: 'Latitude is required'
			})
		})
		.default('' as unknown as number),
	lng: z
		.number({
			errorMap: () => ({
				message: 'longitude is required'
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
		const pb = locals.pb;

		if (!pb) {
			throw redirect(300, '/');
		}

		const clientForm = await superValidate(request, ClientValidation);

		if (!clientForm.valid) {
			return fail(400, { clientForm });
		}

		try {
			const client = await pb.collection('client').create({
				first_name:
					clientForm.data.first_name.at(0)?.toUpperCase() + clientForm.data.first_name.slice(1),
				last_name: clientForm.data.last_name
					? clientForm.data.last_name.at(0)?.toUpperCase() + clientForm.data.last_name.slice(1)
					: '',
				email: clientForm.data.email,
				phone: clientForm.data.phone,
				notes: clientForm.data.notes,
				company: locals.user?.company
			});

			await pb.collection('address').create({
				address: clientForm.data.addr,
				lat: clientForm.data.lat,
				lng: clientForm.data.lng,
				active: true,
				client: client.id
			});

			return { clientForm };
		} catch (e) {
			if (e instanceof Error) {
				return fail(400, { error: e.message });
			}
		}
		return { clientForm };
	}
};
