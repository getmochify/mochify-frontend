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
