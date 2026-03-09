export const prerender = true;

export async function GET() {
    const site = 'https://mochify.xyz';
    const pages = ['', '/heic-to-jpeg', '/avif-to-jpg', '/jpg-to-jpegxl', '/avif-to-jpegxl', '/solutions', '/solutions/hif-to-avif', '/solutions/ebay-image-converter', '/solutions/hif-to-jpg', '/guides', '/guides/fujifilm-hif-to-jpg', '/guides/privacy-image-optimization', '/guides/2026-guide-next-gen-formats', '/guides/next-gen-image-formats-wordpress', '/guides/jpeg-in-2026-jpegli', '/guides/exif-data-risks-image-compression-2026', '/guides/history-image-compression-2026', '/guides/top-5-secure-image-compressors-2026', '/guides/self-hosting-image-optimization-docker', '/guides/optimizing-hero-images', '/guides/ai-image-compression-natural-language-2026', '/pricing', '/terms', '/privacy', '/service-terms', '/about', '/docs'];

    // Create rows without internal tabs/newlines
    const urlRows = pages.map(page => `
  <url>
    <loc>${site}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

    // Construct the final string with NO leading space
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlRows}\n</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}