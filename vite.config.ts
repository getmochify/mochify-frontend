import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	// The video worker code-splits (lazy mediabunny import), which iife
	// workers cannot do. Module workers match the WebCodecs support baseline.
	worker: {
		format: 'es'
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'prompt',
			injectRegister: null,
			manifest: false,
			workbox: {
				navigateFallback: null,
				// woff2-only: unicode-range keeps non-latin subsets inert, and no
				// evergreen browser falls back to .woff. OG cards are scraper-only
				// (og:image meta) and favicon.svg is unreferenced; neither belongs
				// in the offline shell.
				globPatterns: ['**/*.{js,css,ico,png,svg,webp,webmanifest,woff2}'],
				globIgnores: [
					'og/**',
					'favicon.svg',
					// Non-latin @fontsource subsets: unicode-range means the
					// browser only pulls these if matching glyphs render.
					'**/*cyrillic*',
					'**/*vietnamese*',
					'**/*latin-ext*'
				],
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.origin === 'https://api.mochify.app',
						handler: 'NetworkOnly'
					}
				]
			}
		})
	]
});
