export const load = async ({ params, locals }) => {
	try {
		const client = await locals.pb?.collection('clients').getOne(params.slug);
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
