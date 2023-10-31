import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	try {
		const client = await locals.pb
			?.collection('client')
			.getOne(params.slug, { expand: 'address(client)' });
		return { client, slug: params.slug };
	} catch (e) {
		if (e instanceof Error) {
			console.log(e.message);
		}
		throw redirect(300, '/admin/client');
		// return {
		// 	slug: params.slug
		// };
	}
};
