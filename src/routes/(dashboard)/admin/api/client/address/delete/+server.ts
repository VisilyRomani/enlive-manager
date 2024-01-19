// import type { RequestHandler } from './$types';

// export const DELETE: RequestHandler = async ({ locals, request }) => {
// 	const pb = locals.pb;
// 	if (!pb) {
// 		throw new Error('Failed to Access DB');
// 	}
// 	const { id } = await request.json();
// 	try {
// 		await pb.collection('address').update(id, { active: false });
// 	} catch {
// 		throw new Error('Failed to update Address');
// 	}
// 	return new Response('SUCCESS');
// };
