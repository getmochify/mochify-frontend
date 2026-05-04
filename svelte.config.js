import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	kit: {
		adapter: adapter(),
		paths: {
			relative: false
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'connect-src': [
					'self',
					'https://api.mochify.app',
					'https://tokens.mochify.app',
					'https://t.mochify.app',
					...(process.env.PUBLIC_API_URL && process.env.PUBLIC_API_URL !== 'https://api.mochify.app'
						? [process.env.PUBLIC_API_URL]
						: []),
					...(process.env.PUBLIC_WORKER_URL &&
					process.env.PUBLIC_WORKER_URL !== 'https://tokens.mochify.app'
						? [process.env.PUBLIC_WORKER_URL]
						: [])
				],
				'img-src': ['self', 'data:', 'blob:'],
				'media-src': ['self', 'https://assets.mochify.xyz'],
				'worker-src': ['self'],
				'frame-ancestors': ['none'],
				'upgrade-insecure-requests': true
			}
		}
	}
};

export default config;
