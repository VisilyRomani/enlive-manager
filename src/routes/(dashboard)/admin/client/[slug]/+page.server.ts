export const load = async ({ params, locals }) => {
	try {
		const client = await locals.pb?.collection('').getOne(params.slug, { expand: 'address' });
		return { client, slug: params.slug };
	} catch (e) {
		if (e instanceof Error) {
			console.log(e.message);
		}
		return {
			slug: params.slug
		};
	}
};
