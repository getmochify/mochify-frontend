import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: null,
            manifest: false,
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest,woff,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.origin === 'https://api.mochify.xyz',
                        handler: 'NetworkOnly'
                    }
                ],
                navigateFallback: '/'
            }
        })
    ]
});
