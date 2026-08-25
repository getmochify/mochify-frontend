import { fetchUsage } from '$lib/server/usage';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, platform }) => {
	return Response.json(await fetchUsage({ locals, request, platform }));
};
