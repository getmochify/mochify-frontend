// Source of truth for build-time Open Graph cards.
//
// Each entry renders to `static/og/<slug>.png` (1200x630) via `bun run og`
// (see scripts/generate-og.js). The same list drives the <meta og:image> tag
// injected from the root layout, so the set of paths here is exactly the set
// of pages that get a bespoke card. Everything else falls back to the generic
// `static/og/default.png`.
//
// Titles are display copy for the card, not the page <title>. They are seeded
// from each page's og:title but may be trimmed for the card. House style: no
// em dashes.
export const cards = [
	{
		path: '/',
		eyebrow: 'IMAGE TOOLKIT',
		title: 'Intelligent Image Workflows & Next-Gen Compression'
	},
	{ path: '/about', eyebrow: 'MOCHIFY', title: 'About Mochify' },
	{ path: '/avif-to-jpegxl', eyebrow: 'CONVERTER', title: 'Convert AVIF to JPEG XL' },
	{ path: '/avif-to-jpg', eyebrow: 'CONVERTER', title: 'AVIF to JPG Converter' },
	{
		path: '/comparison',
		eyebrow: 'MOCHIFY',
		title: 'Image Comparison Tool – See the savings in real time'
	},
	{ path: '/contact', eyebrow: 'MOCHIFY', title: 'Contact Mochify' },
	{ path: '/docs', eyebrow: 'MOCHIFY', title: 'API Documentation' },
	{
		path: '/ebay-seller',
		eyebrow: 'FOR SELLERS',
		title: 'Better eBay Photos. More Sales. Higher Prices.'
	},
	{ path: '/guides', eyebrow: 'GUIDES', title: 'Image Optimization Guides' },
	{
		path: '/guides/2026-guide-next-gen-formats',
		eyebrow: 'GUIDE',
		title: 'WebP vs AVIF vs JPEG XL: 2026 Comparison Guide'
	},
	{
		path: '/guides/ai-agent-workflow-automation-photographers',
		eyebrow: 'GUIDE',
		title: 'AI Agent Workflow Automation for Photographers: Save Hours with Claude and Mochify'
	},
	{
		path: '/guides/ai-image-compression-conversion',
		eyebrow: 'GUIDE',
		title: 'AI Image Compression and Conversion: Describe the Result, Skip the Settings'
	},
	{
		path: '/guides/ai-image-compression-natural-language-2026',
		eyebrow: 'GUIDE',
		title: 'AI Image Compression with Natural Language - Mochify 2026'
	},
	{
		path: '/guides/avif-to-jpg',
		eyebrow: 'GUIDE',
		title: 'AVIF to JPG: How to Convert AVIF Files on Any Device'
	},
	{ path: '/guides/can-safari-open-heic-images', eyebrow: 'GUIDE', title: 'Can Safari Open HEIC Images on the Web?' },
	{
		path: '/guides/chrome-145-jpeg-xl-default',
		eyebrow: 'GUIDE',
		title: 'Does Chrome 145 Enable JPEG XL by Default?'
	},
	{
		path: '/guides/compress-optimize-ai-generated-images',
		eyebrow: 'GUIDE',
		title: 'How to Compress and Optimize AI-Generated Images (in Automated and Agent Workflows)'
	},
	{
		path: '/guides/converting-images-to-jpeg-xl',
		eyebrow: 'GUIDE',
		title: 'Converting Images to JPEG XL: The Practical Guide for 2026'
	},
	{
		path: '/guides/cross-listing-marketplace-photo-requirements',
		eyebrow: 'GUIDE',
		title: 'Cross-Listing for Resellers: One Set of Photos, Every Marketplace'
	},
	{
		path: '/guides/do-journaling-apps-compress-images',
		eyebrow: 'GUIDE',
		title: 'Do Journaling Apps Compress Images? Avoid Storage Bloat.'
	},
	{
		path: '/guides/do-marketplace-product-images-need-to-be-square',
		eyebrow: 'GUIDE',
		title: 'Do Marketplace Product Images Need to Be Square?'
	},
	{
		path: '/guides/does-heif-heic-work-with-client-galleries',
		eyebrow: 'GUIDE',
		title: 'Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?'
	},
	{
		path: '/guides/does-hif-to-jpg-lose-quality',
		eyebrow: 'GUIDE',
		title: 'Does Converting HIF to JPG Reduce Quality?'
	},
	{
		path: '/guides/ebay-image-file-not-supported',
		eyebrow: 'GUIDE',
		title: 'Why Does eBay Say My Image File Is Not Supported?'
	},
	{
		path: '/guides/ecommerce-product-photo-workflow-resize-convert',
		eyebrow: 'GUIDE',
		title: 'Ecommerce Product Photo Workflow: Resize & Convert in One Prompt'
	},
	{
		path: '/guides/etsy-listing-photo-size-guide',
		eyebrow: 'GUIDE',
		title: 'Etsy Listing Photo Size: The Complete Guide'
	},
	{
		path: '/guides/european-alternative-tinypng-gdpr-compliant-image-compression',
		eyebrow: 'GUIDE',
		title: 'A European Alternative to TinyPNG: Privacy-First, Zero-Retention Image Compression'
	},
	{
		path: '/guides/exif-data-risks-image-compression-2026',
		eyebrow: 'GUIDE',
		title: 'EXIF Data Risks: Strip Image Metadata for Global Privacy'
	},
	{
		path: '/guides/fetchpriority-vs-preload-lcp-image',
		eyebrow: 'GUIDE',
		title: 'Should I Use fetchpriority or rel="preload" for My LCP Image?'
	},
	{
		path: '/guides/fujifilm-hif-to-jpg',
		eyebrow: 'GUIDE',
		title: 'Fuji HIF Files Explained: How to Convert X‑T5 / X‑H2 / X100VI / X‑T50 HIF to JPEG'
	},
	{
		path: '/guides/heic-to-jpeg-or-webp-wordpress',
		eyebrow: 'GUIDE',
		title: 'Should I convert HEIC to JPEG or WebP for WordPress uploads?'
	},
	{
		path: '/guides/heic-to-pdf-iphone-photos',
		eyebrow: 'GUIDE',
		title: 'How to Convert iPhone Photos (HEIC) to PDF'
	},
	{
		path: '/guides/heif-to-jpeg-workflow-photographers-guide',
		eyebrow: 'GUIDE',
		title: 'HIF/HEIF to JPEG for Professional Photographers: A Privacy-First Workflow Guide'
	},
	{
		path: '/guides/heif-to-jpg-complete-guide',
		eyebrow: 'GUIDE',
		title: 'HEIF to JPG: The Complete Conversion Guide'
	},
	{
		path: '/guides/hif-to-jpg-canon-sony-fujifilm',
		eyebrow: 'GUIDE',
		title: 'HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs'
	},
	{
		path: '/guides/history-image-compression-2026',
		eyebrow: 'GUIDE',
		title: 'The History of Image Compression: From BMP to AVIF & Jpegli (2026 Guide)'
	},
	{
		path: '/guides/how-the-mochify-mcp-server-works',
		eyebrow: 'GUIDE',
		title: 'How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples'
	},
	{
		path: '/guides/image-compression-claude-code-cli-mcp',
		eyebrow: 'GUIDE',
		title: 'Image Compression Inside Claude Code: The Mochify CLI + MCP Guide'
	},
	{
		path: '/guides/is-jpeg-xl-ready-for-shopify-product-images',
		eyebrow: 'GUIDE',
		title: 'Is JPEG XL Ready for Shopify Product Images in 2026?'
	},
	{
		path: '/guides/is-reselling-worth-it',
		eyebrow: 'GUIDE',
		title: 'Is Reselling Worth It in 2026? The Honest Math'
	},
	{
		path: '/guides/jpeg-in-2026-jpegli',
		eyebrow: 'GUIDE',
		title: 'JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game'
	},
	{
		path: '/guides/jpegli-shopify-product-images',
		eyebrow: 'GUIDE',
		title: 'How to Use Jpegli for Shopify Product Images'
	},
	{
		path: '/guides/llm-image-token-costs',
		eyebrow: 'GUIDE',
		title: 'LLM Image Token Costs: How Many Tokens Does an Image Use?'
	},
	{
		path: '/guides/mochify-mcp-image-compression-agent-2026',
		eyebrow: 'GUIDE',
		title: 'How to Self-Host an Image Optimization API with Docker'
	},
	{
		path: '/guides/mochify-vs-tinypng',
		eyebrow: 'GUIDE',
		title: 'Mochify vs TinyPNG - An Honest 2026 Comparison'
	},
	{
		path: '/guides/mp4-to-webm-web-video-guide',
		eyebrow: 'GUIDE',
		title: 'Convert MP4 to WebM for the Web: Smaller Files, Faster Pages, No Upload Required'
	},
	{
		path: '/guides/next-gen-image-formats-wordpress',
		eyebrow: 'GUIDE',
		title: 'Fix “Serve Images in Next-Gen Formats” in WordPress (No Plugins)'
	},
	{
		path: '/guides/on-device-ai-agents-image-optimization',
		eyebrow: 'GUIDE',
		title: 'On-Device AI Agents - Image and PDF Optimization for Local Workflows'
	},
	{
		path: '/guides/optimizing-hero-images',
		eyebrow: 'GUIDE',
		title: 'Optimizing Hero Images: Fix LCP & Boost SEO with No Plugins'
	},
	{
		path: '/guides/photo-file-too-large-to-upload',
		eyebrow: 'GUIDE',
		title: 'Photo File Too Large to Upload? Why Free Tools Reject Camera Files'
	},
	{
		path: '/guides/product-image-requirements-marketplace-guide',
		eyebrow: 'GUIDE',
		title: 'Product Image Requirements for Every Major Marketplace'
	},
	{
		path: '/guides/preload-avif-hero-images-wordpress-lcp',
		eyebrow: 'GUIDE',
		title: 'How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?'
	},
	{
		path: '/guides/privacy-image-optimization',
		eyebrow: 'GUIDE',
		title: 'Secure Your Images with Zero-Retention Optimization'
	},
	{
		path: '/guides/self-hosting-image-optimization-docker',
		eyebrow: 'GUIDE',
		title: 'Self-Host Your Own Image Optimizer: Mochify-Lite on Docker'
	},
	{
		path: '/guides/should-i-optimize-images-before-upload',
		eyebrow: 'GUIDE',
		title: 'Should I Optimize My Images Before I Upload Them?'
	},
	{
		path: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera',
		eyebrow: 'GUIDE',
		title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?'
	},
	{
		path: '/guides/sony-hif-to-jpg',
		eyebrow: 'GUIDE',
		title: 'How Do I Convert Sony HIF Files to JPG?'
	},
	{
		path: '/guides/svg-conversion-guide-vector-vs-raster',
		eyebrow: 'GUIDE',
		title: 'SVG Conversion Guide: When to Keep Vector and When to Rasterize'
	},
	{
		path: '/guides/top-5-secure-image-compressors-2026',
		eyebrow: 'GUIDE',
		title: 'Top 5 Secure Image Compressors - Privacy & Performance Comparison (2026)'
	},
	{
		path: '/guides/vinted-photo-size',
		eyebrow: 'GUIDE',
		title: 'What Size Should Vinted Photos Be?'
	},
	{
		path: '/guides/vinted-photos-that-sell',
		eyebrow: 'GUIDE',
		title: 'How to Take Vinted Photos That Sell'
	},
	{
		path: '/guides/what-image-format-should-i-use-for-product-photos',
		eyebrow: 'GUIDE',
		title: 'What Image Format Should I Use for Product Photos?'
	},
	{
		path: '/guides/what-is-a-hif-file',
		eyebrow: 'GUIDE',
		title: 'What Is a HIF File? (And How to Open One)'
	},
	{
		path: '/guides/what-is-a-jxl-file',
		eyebrow: 'GUIDE',
		title: 'What Is a JXL File? How to Open, Convert, and Share JPEG XL'
	},
	{
		path: '/guides/what-is-an-avif-file',
		eyebrow: 'GUIDE',
		title: 'What Is an AVIF File? (And How to Open One)'
	},
	{
		path: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
		eyebrow: 'GUIDE',
		title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?'
	},
	{
		path: '/guides/why-we-relaxed-zero-retention-for-mcp',
		eyebrow: 'GUIDE',
		title: 'Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions'
	},
	{
		path: '/guides/extract-images-from-pdf-agent-workflows',
		eyebrow: 'GUIDE',
		title: 'Extract Images from PDF in AI Agent Workflows - Split & Convert'
	},
	{ path: '/heic-to-jpeg', eyebrow: 'CONVERTER', title: 'Convert HEIC to JPEG' },
	{ path: '/jpg-to-jpegxl', eyebrow: 'CONVERTER', title: 'Convert JPG to JPEG XL' },
	{ path: '/pricing', eyebrow: 'MOCHIFY', title: 'Simple, Honest Pricing' },
	{ path: '/solutions', eyebrow: 'TOOLS', title: 'Compare & Choose the Best Image Optimizer' },
	{
		path: '/solutions/bulk-ai-square-cropper',
		eyebrow: 'TOOL',
		title: 'Bulk AI Square Cropper - Smart-Crop Images to a Square'
	},
	{
		path: '/solutions/ebay-image-converter',
		eyebrow: 'TOOL',
		title: 'eBay Image Compressor - Optimize Photos for Listings'
	},
	{
		path: '/solutions/heif-to-pdf',
		eyebrow: 'TOOL',
		title: 'HEIC/HEIF to PDF - Convert iPhone Photos to a PDF'
	},
	{ path: '/solutions/hif-to-avif', eyebrow: 'TOOL', title: 'Convert HIF to AVIF (Fuji/Canon)' },
	{ path: '/solutions/hif-to-jpg', eyebrow: 'TOOL', title: 'Convert HIF to JPG (Fuji/Canon)' },
	{
		path: '/solutions/jxl-to-pdf',
		eyebrow: 'TOOL',
		title: 'JPEG XL to PDF - Convert JXL Images to a PDF'
	},
	{
		path: '/solutions/mp4-to-webm',
		eyebrow: 'TOOL',
		title: 'MP4 to WebM - Free & Private In-Browser Converter'
	},
	{
		path: '/solutions/png-to-jxl',
		eyebrow: 'TOOL',
		title: 'Convert PNG to JPEG XL (JXL) - Free, Private & Instant'
	},
	{
		path: '/solutions/remove-background-avif',
		eyebrow: 'TOOL',
		title: 'Remove Background to AVIF - Free & Private'
	},
	{
		path: '/solutions/remove-background-webp',
		eyebrow: 'TOOL',
		title: 'Remove Background to WebP - Free & Private'
	},
	{
		path: '/solutions/svg-to-avif',
		eyebrow: 'TOOL',
		title: 'Convert SVG to AVIF - Free, Private & Instant'
	},
	{
		path: '/solutions/svg-to-jxl',
		eyebrow: 'TOOL',
		title: 'Convert SVG to JPEG XL (JXL) - Free, Private & Instant'
	},
	{
		path: '/solutions/svg-to-webp',
		eyebrow: 'TOOL',
		title: 'Convert SVG to WebP - Free, Private & Instant'
	},
	{
		path: '/solutions/webp-to-pdf',
		eyebrow: 'TOOL',
		title: 'WebP to PDF - Combine Images into One PDF'
	},
	{ path: '/sustainability', eyebrow: 'MOCHIFY', title: 'Sustainability' },
	{
		path: '/v2launch',
		eyebrow: 'MOCHIFY',
		title: 'Image, video & PDF compression for AI-native workflows'
	},
	{
		path: '/vinted-seller',
		eyebrow: 'FOR SELLERS',
		title: 'Better Vinted Photos. More Likes. Faster Sales.'
	}
];

const ORIGIN = 'https://mochify.app';

/**
 * Filename stem for a route's card, e.g. '/guides/foo' -> 'guides-foo', '/' -> 'home'.
 * @param {string} path
 */
export function slugFor(path) {
	if (path === '/') return 'home';
	return path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\//g, '-');
}

const byPath = new Map(cards.map((c) => [c.path, c]));

/**
 * Absolute OG image URL for a route. Pages with a bespoke card get their own
 * PNG; everything else gets the generic default card.
 * @param {string} pathname
 */
export function ogImageFor(pathname) {
	const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
	return byPath.has(clean) ? `${ORIGIN}/og/${slugFor(clean)}.png` : `${ORIGIN}/og/default.png`;
}
