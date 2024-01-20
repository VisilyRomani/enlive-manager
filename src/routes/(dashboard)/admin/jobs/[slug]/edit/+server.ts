import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const pb = locals.pb;
	if (!pb) {
		throw new Error('Failed to Access DB');
	}
	const { id }: { id: string } = await request.json();
	try {
		await pb.collection('task').delete(id);
	} catch {
		throw new Error('Failed to delete task');
	}
	return new Response('SUCCESS');
};
