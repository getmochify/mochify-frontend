import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte'],
    kit: {
        adapter: adapter(),
        csp: {
            mode: 'auto',
            directives: {
                'default-src': ['self'],
                // 1. Allow the analytics script to load
                'script-src': ['self', 'https://analytics.mochify.xyz'], 
                'style-src': ['self', 'unsafe-inline'],
                // 2. Allow the script to send data back to analytics
                'connect-src': [
                    'self',
                    'https://api.mochify.xyz',
                    ...(process.env.PUBLIC_API_URL && process.env.PUBLIC_API_URL !== 'https://api.mochify.xyz'
                        ? [process.env.PUBLIC_API_URL]
                        : []),
                    'https://analytics.mochify.xyz',
                    'https://joxsqjvaqedvurajuavb.supabase.co',
                    'wss://joxsqjvaqedvurajuavb.supabase.co'
                ],
                'img-src': ['self', 'data:', 'blob:'],
                'frame-ancestors': ['none'],
                'upgrade-insecure-requests': true
            }
        }
    }
};

export default config;