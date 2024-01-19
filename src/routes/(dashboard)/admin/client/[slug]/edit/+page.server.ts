import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
type TClient = {
	id: string;
	first_name: string;
	last_name: string;
	created: Date;
	email: string;
	phone: string;
	notes: string;
	expand: {
		'address(client)': {
			address: string;
			lat: number;
			lng: number;
			id: string;
		}[];
	};
};

const ClientValidation = z.object({
	id: z.string().min(1),
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	notes: z.string().optional()
});
const AddressValidation = z.object({
	id: z.string().min(1, 'id is requred'),
	address: z.string().min(1, 'id is requred'),
	lat: z.number().min(-90).max(90),
	lng: z.number().min(-180).max(180),
	active: z.boolean()
});

export const load = async ({ params, locals }) => {
	const pb = locals.pb;
	if (!pb) {
		throw redirect(300, '/');
	}

	const client = await pb
		.collection('client')
		.getOne<TClient>(params.slug, { expand: 'address(client)' });
	const editClient = superValidate(client, ClientValidation);
	const editAddress = superValidate(AddressValidation);

	return {
		client,
		editClient,
		editAddress,
		slug: params.slug
	};
};

export const actions = {
	saveClient: async ({ locals, request }) => {
		const pb = locals.pb;
		const editClient = await superValidate(request, ClientValidation);

		if (!pb || !editClient.valid) {
			return fail(400, { editClient });
		}

		try {
			await pb.collection('client').update(editClient.data.id, editClient.data);
		} catch {
			return { editClient };
		}
		return { editClient };
	},
	editAddress: async ({ locals, request }) => {
		const editAddress = await superValidate(request, AddressValidation);
		const pb = locals.pb;
		if (!editAddress.valid || !pb) {
			return fail(400, { editAddress });
		}

		try {
			await pb.collection('address').update(editAddress.data.id, editAddress.data);
		} catch {
			return fail(400, { editAddress });
		}
		return { editAddress };
	}
};
