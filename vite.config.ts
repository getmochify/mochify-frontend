import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        VitePWA({
            // TEMPORARY — recovering from a bad service-worker deploy.
            // selfDestroying ships a SW that unregisters itself and deletes all
            // workbox caches, un-bricking clients stuck on the previous SW (which
            // served stale/relative-path precache → chunk 404 → client 500 page).
            // Keep this true for a release or two so installed clients update,
            // THEN set back to false to re-enable the real PWA (and fix the root
            // cause first — the precache manifest was emitting relative URLs).
            selfDestroying: true,
            registerType: 'autoUpdate',
            injectRegister: null,
            manifest: false,
            workbox: {
                navigateFallback: null,
                globPatterns: ['**/*.{js,css,ico,png,svg,webp,webmanifest,woff,woff2}'],
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
