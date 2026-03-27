import { statSync } from 'fs';
import { resolve } from 'path';

export const prerender = true;

function lastmod(urlPath: string): string {
    const routeDir = urlPath === '' ? '.' : urlPath.slice(1).replace(/\//g, '/');
    try {
        const file = resolve('src/routes', routeDir, '+page.svelte');
        return statSync(file).mtime.toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

export async function GET() {
    const site = 'https://mochify.app';
    const pages = ['', '/heic-to-jpeg', '/avif-to-jpg', '/jpg-to-jpegxl', '/avif-to-jpegxl', '/solutions', '/solutions/hif-to-avif', '/solutions/ebay-image-converter', '/solutions/hif-to-jpg', '/guides', '/guides/fujifilm-hif-to-jpg', '/guides/privacy-image-optimization', '/guides/2026-guide-next-gen-formats', '/guides/european-alternative-tinypng-gdpr-compliant-image-compression', '/guides/next-gen-image-formats-wordpress', '/guides/jpeg-in-2026-jpegli', '/guides/exif-data-risks-image-compression-2026', '/guides/history-image-compression-2026', '/guides/top-5-secure-image-compressors-2026', '/guides/self-hosting-image-optimization-docker', '/guides/optimizing-hero-images', '/guides/ai-image-compression-natural-language-2026', '/guides/mochify-mcp-image-compression-agent-2026', '/pricing', '/terms', '/privacy', '/service-terms', '/about', '/docs', '/comparison', '/ebay-seller', '/vinted-seller'];

    const urlRows = pages.map(page => `
  <url>
    <loc>${site}${page}</loc>
    <lastmod>${lastmod(page)}</lastmod>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlRows}\n</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}