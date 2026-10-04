import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	kit: {
		adapter: adapter(),
		paths: {
			relative: false
		},
		// Each open tab checks /_app/version.json this often, so a deploy is
		// noticed and the next navigation becomes a full load instead of a
		// request for a chunk that no longer exists (see the beforeNavigate
		// guard in src/routes/+layout.svelte). The file is tiny and edge-cached.
		version: {
			pollInterval: 5 * 60 * 1000
		},
	}
};

export default config;
