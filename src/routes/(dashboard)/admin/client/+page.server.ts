import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';

import type Record from 'pocketbase';
import { zod } from 'sveltekit-superforms/adapters';

const ClientValidation = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	addr: z.string().min(1, 'Address is required'),
	client_company_name: z.string().optional(),
	lat: z
		.number({
			errorMap: () => ({
				message: 'Latitude is required'
			})
		})
		.default('' as unknown as number)
		.optional(),
	lng: z
		.number({
			errorMap: () => ({
				message: 'longitude is required'
			})
		})
		.default('' as unknown as number)
		.optional(),
	notes: z.string().optional()
});

const BulkClientValidation = z.object({ clients: z.array(ClientValidation) });

export type ClientSchema = typeof ClientValidation;
export type BulkClientSchema = typeof BulkClientValidation;

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
	const clientForm = await superValidate(request, zod(ClientValidation));
	const bulkClient = await superValidate(request, zod(BulkClientValidation));

	const clientList = (
		await locals.pb?.collection('client').getFullList<IClientList>({
			expand: 'address(client)',
			fields: 'first_name, last_name, id, expand'
		})
	)
		?.map((c) => ({
			id: c.id,
			first_name: c.first_name,
			last_name: c.last_name,
			address: c.expand?.['address(client)']
		}))
		.sort((a, b) => a.first_name.localeCompare(b.first_name));
	return {
		clientForm,
		bulkClient,
		clientList: clientList
	};
};

export const actions = {
	BulkImportClient: async ({ locals, request }) => {
		const pb = locals.pb;
		const bulkClient = await superValidate(request, zod(BulkClientValidation));
		console.log(bulkClient.errors);
		if (!bulkClient.valid) {
			return fail(400, { bulkClient });
		}
		console.log(bulkClient.data.clients);

		const clientsPromise = bulkClient.data.clients.map(async (client) => {
			try {
				const dbClient = await pb
					.collection('client')
					.create({ ...client, company: locals.user?.company }, { requestKey: null });
				pb.collection('address').create(
					{
						address: client.addr,
						lat: undefined,
						lng: undefined,
						active: true,
						client: dbClient.id
					},
					{ requestKey: null }
				);
				return true;
			} catch (e) {
				return false;
			}
		});

		const result = await Promise.all(clientsPromise);

		if (result.find((i) => i === false)) {
			return fail(400, { bulkClient });
		} else {
			return { bulkClient };
		}
	},
	CreateClient: async ({ locals, request }) => {
		const pb = locals.pb;

		if (!pb) {
			throw redirect(300, '/');
		}

		const clientForm = await superValidate(request, zod(ClientValidation));

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
				company: locals.user?.company,
				client_company_name: clientForm.data.client_company_name
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
