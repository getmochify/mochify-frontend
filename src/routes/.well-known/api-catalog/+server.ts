import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

// RFC 9727 well-known API catalog, served as a Linkset (RFC 9264).
export const GET: RequestHandler = () => {
	const apiUrl = env.PUBLIC_API_URL || 'https://api.mochify.app';

	const linkset = {
		linkset: [
			{
				anchor: apiUrl,
				'service-doc': [{ href: 'https://mochify.app/docs' }]
			}
		]
	};

	return new Response(JSON.stringify(linkset), {
		headers: {
			'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
		}
	});
};
