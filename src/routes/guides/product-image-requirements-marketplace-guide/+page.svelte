<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideCTA from '$lib/components/GuideCTA.svelte';

    const metadata = {
        title: "Product Image Requirements for Every Major Marketplace",
        description: "The 2026 spec guide for Amazon, Shopify, Etsy, eBay, WooCommerce, Vinted, and Depop - dimensions, formats, file size limits, and what each platform enforces.",
        category: "Image Formats",
        readTime: "17 min read",
        datePublished: "August 6, 2026"
    };

    const toc = [
        { n: '01', href: '#the-three-rules-every-marketplace-shares', label: 'The Three Rules Every Marketplace Shares' },
        { n: '02', href: '#amazon-the-strictest-spec-in-the-room', label: 'Amazon: The Strictest Spec in the Room' },
        { n: '03', href: '#shopify-flexible-but-your-theme-decides', label: 'Shopify: Flexible, but Your Theme Decides' },
        { n: '04', href: '#etsy-resolution-affects-your-search-ranking', label: 'Etsy: Resolution Affects Your Search Ranking' },
        { n: '05', href: '#ebay-generous-on-format-firm-on-minimum-size', label: 'eBay: Generous on Format, Firm on Minimum Size' },
        { n: '06', href: '#woocommerce-your-theme-your-rules', label: 'WooCommerce: Your Theme, Your Rules' },
        { n: '07', href: '#vinted-guidance-over-specs', label: 'Vinted: Guidance Over Specs' },
        { n: '08', href: '#depop-square-or-be-cropped', label: 'Depop: Square or Be Cropped' },
        { n: '09', href: '#cheat-sheet', label: 'Quick-Reference Cheat Sheet' },
        { n: '10', href: '#mochify-workflow', label: 'Mochify Workflow: Prep Images for Any Marketplace' },
        { n: '11', href: '#faq', label: 'FAQ' },
    ];

    const related = [
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize and Convert in One Prompt', desc: 'A step-by-step workflow for processing a full product image batch with Magic Flow.' },
        { href: '/guides/what-image-format-should-i-use-for-product-photos', title: 'What Image Format Should I Use for Product Photos?', desc: 'JPEG vs WebP vs AVIF vs JPEG XL for marketplace listings, with platform compatibility notes.' },
        { href: '/guides/should-i-optimize-images-before-upload', title: 'Should I Optimize My Images Before I Upload Them?', desc: 'Why pre-upload optimization beats relying on platform recompression, with before/after data.' },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'What EXIF metadata your product photos contain and when stripping it matters.' },
        { href: '/guides/is-jpeg-xl-ready-for-shopify-product-images', title: 'Is JPEG XL Ready for Shopify Product Images?', desc: 'A practical check on JPEG XL support across Shopify stores and CDN pipelines in 2026.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Product Image Requirements for Every Major Marketplace - Prep Once, Sell Everywhere</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Product Image Requirements for Every Major Marketplace" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/product-image-requirements-marketplace-guide" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Product Image Requirements for Every Major Marketplace - Prep Once, Sell Everywhere" />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Product Image Requirements for Every Major Marketplace",
        "description": "The 2026 spec guide for Amazon, Shopify, Etsy, eBay, WooCommerce, Vinted, and Depop - dimensions, formats, file size limits, and what each platform enforces.",
        "url": "https://mochify.app/guides/product-image-requirements-marketplace-guide",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/product-image-requirements-marketplace-guide"
        },
        "datePublished": "2026-08-06",
        "dateModified": "2026-08-06",
        "inLanguage": "en",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mochify.app/logo.png"
            }
        },
        "isPartOf": {
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            { "@type": "Thing", "name": "Amazon image requirements" },
            { "@type": "Thing", "name": "Shopify product images" },
            { "@type": "Thing", "name": "Etsy image requirements" },
            { "@type": "Thing", "name": "eBay photo requirements" },
            { "@type": "Thing", "name": "WooCommerce image sizes" },
            { "@type": "Thing", "name": "product photography" }
        ],
        "keywords": "product image requirements, marketplace image specs, Amazon image requirements, Shopify product images, Etsy image size, eBay photo requirements, ecommerce product photography",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".article-intro", "h1"]
        }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Product Image Requirements for Every Major Marketplace", "item": "https://mochify.app/guides/product-image-requirements-marketplace-guide" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Product Image Requirements for Every Major Marketplace",
        "url": "https://mochify.app/guides/product-image-requirements-marketplace-guide",
        "description": "The 2026 spec guide for Amazon, Shopify, Etsy, eBay, WooCommerce, Vinted, and Depop - dimensions, formats, file size limits, and what each platform enforces.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-08-06",
        "dateModified": "2026-08-06"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Does Amazon require square images?", "acceptedAnswer": { "@type": "Answer", "text": "No. Amazon doesn't mandate a 1:1 aspect ratio for most product categories. The MAIN image rules are about background (pure white), fill percentage (~85% of frame), and content (real photo, product only, no text or watermarks) - not aspect ratio. Some category-specific guides, such as those for clothing, specify ratios close to 3:4, but there's no universal square requirement." } },
            { "@type": "Question", "name": "Why does Etsy rank lower-resolution images lower in search?", "acceptedAnswer": { "@type": "Answer", "text": "Etsy's Search Visibility documentation states that a primary photo with \"high-resolution images (we recommend a width and height of 2000 pixels or more)\" is one of the requirements for \"a chance to receive priority placement in relevant search results.\" Etsy has a direct commercial interest in its listings converting well, and higher-resolution images tend to result in more confident buyers." } },
            { "@type": "Question", "name": "Does eBay convert WebP and AVIF uploads to JPEG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. eBay's developer documentation (EPS) confirms that JPEG, PNG, and GIF retain their original format, but \"other non-JPG format files are converted to JPG\" server-side. So uploading WebP, AVIF, or HEIC to eBay results in a JPEG being stored and delivered to buyers. Save yourself the conversion uncertainty and upload JPEG directly." } },
            { "@type": "Question", "name": "What's the difference between Vinted's portrait format and Depop's square format?", "acceptedAnswer": { "@type": "Answer", "text": "Vinted's mobile-first feed is designed around portrait images - taller than wide - which take up more screen space and look more natural in a scrolling feed. Depop's grid is built around squares, and the platform explicitly tells sellers to shoot 1:1. If you're selling the same item on both platforms, you'll need two crops." } },
            { "@type": "Question", "name": "Can Shopify's CDN serve AVIF if I upload JPEG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Shopify's CDN negotiates format delivery based on the browser's Accept header, serving AVIF where supported, WebP as a second option, and JPEG as a fallback. You upload once (JPEG, PNG, WebP, etc.) and Shopify handles format negotiation for delivery. You do not need to upload AVIF files to get AVIF delivery on Shopify." } },
            { "@type": "Question", "name": "How does WooCommerce decide what size to display my product images at?", "acceptedAnswer": { "@type": "Answer", "text": "WooCommerce registers three image sizes with defaults (300 px square thumbnails, 600 px single-product, 100 px gallery navigation), but themes can override these widths in their code. The actual displayed size is a combination of the WooCommerce settings, your theme's declarations, and CSS. If images look wrong after upload, check your theme's recommended image dimensions first, regenerate thumbnails (using a plugin like Regenerate Thumbnails), and confirm your source images are at least 1.5-2x the rendered pixel width." } },
            { "@type": "Question", "name": "What file format should I use across all platforms?", "acceptedAnswer": { "@type": "Answer", "text": "JPEG is the only format accepted on all seven platforms covered here (even eBay converts others to JPEG). PNG is accepted everywhere except Vinted and Depop, where the format isn't officially documented but is widely assumed to work. WebP is only reliably accepted as an upload format on Shopify and eBay (where it's converted to JPEG anyway). For maximum compatibility, JPEG at 85-90% quality is the sensible default for marketplace uploads. See What Image Format Should I Use for Product Photos? for a deeper look." } },
            { "@type": "Question", "name": "Should I optimize before uploading or let the platform handle it?", "acceptedAnswer": { "@type": "Answer", "text": "Optimize before uploading. Every platform recompresses on ingest, and starting from a well-optimized JPEG at the right dimensions gives the platform's encoder better material to work with than an unoptimized raw or PSD. Shopify's CDN, for example, generates multiple sizes from your upload - so uploading at 2,048 x 2,048 px, compressed cleanly to around 300-500 KB, gives it a sharp source to downscale without hitting the 20 MB upload limit. See Should I Optimize My Images Before I Upload Them? for the full rationale." } }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-[#F06292] text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · Published {metadata.datePublished}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Product Image Requirements for Every Major Marketplace
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Getting rejected from Amazon because your background isn't quite white enough is annoying. Getting demoted in Etsy search because your first photo is 600 pixels wide is worse - it can cost you sales for months before you even notice. Every major marketplace has its own image rules, and they disagree with each other in ways that matter: what Amazon calls mandatory, eBay treats as optional; what Shopify leaves to your theme, WooCommerce bakes into its thumbnail pipeline. This guide pulls the official technical requirements for seven major selling platforms into one place, with honest notes about where the "rules" are actually vendor-sourced estimates rather than documented specs. By the end, you'll have a clear picture of what each platform demands, where to invest your image-editing time, and how to run a batch through a consistent prep workflow before uploading. A bit of context on why this is worth taking seriously: Amazon links image zoom directly to revenue, stating in its own Seller Central documentation that "zoom has been proven to enhance sales" - and zoom requires images of at least 1,000 pixels on the longest side. Etsy is more explicit still, tying the resolution of your primary photo to where your listing shows up in search. These aren't soft suggestions.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published August 2026 by the Mochify Engineering Team.</strong>
                Platform specs checked against each marketplace's official help and developer documentation June 2026; third-party estimates are clearly labeled throughout.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each toc as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <section id="the-three-rules-every-marketplace-shares" class="scroll-mt-24">
            <SectionHeading>The Three Rules Every Marketplace Shares</SectionHeading>
            <p>Before diving into platform specifics: three requirements appear in some form across every platform covered here, even if the enforcement mechanism differs.</p>
            <p><strong>No added text, logos, or watermarks on primary images.</strong> Amazon and eBay make this explicit in their picture policies. Etsy's guidance implies the same. If your MAIN image includes your brand name in the corner, expect removal or suppression.</p>
            <p><strong>Resolution is not optional.</strong> Every platform either enforces a hard minimum or ties image quality to algorithmic benefits. The practical floor for 2026 is 1,000 pixels on the longest side; anything below that leaves zoom disabled on Amazon and risks lower search placement on Etsy.</p>
            <p><strong>File format matters more than you think.</strong> Amazon and Etsy still only accept JPEG, PNG, TIFF, and (non-animated) GIF uploads. eBay's developer API also takes WebP, AVIF, and HEIC - but converts all of them to JPEG on its servers. Shopify is the most permissive on upload formats, accepting WebP and HEIC natively and serving AVIF or WebP to browsers automatically via its CDN.</p>
        </section>

        <section id="amazon-the-strictest-spec-in-the-room" class="scroll-mt-24">
            <SectionHeading>Amazon: The Strictest Spec in the Room</SectionHeading>
            <p>Amazon enforces the tightest, most detailed set of image rules of any platform here. These come from Amazon's official Seller Central documentation checked June 2026.</p>
            <p><strong>Accepted formats:</strong> JPEG (recommended), TIFF, PNG, and non-animated GIF. No WebP, no AVIF, no HEIC, no PSD. JPEG is the safe choice.</p>
            <p><strong>Dimensions:</strong> Images should be at least 1,000 pixels on the longest side for zoom to activate. Amazon explicitly states this is the threshold where zoom - which it documents as a driver of sales - kicks in. There's a floor of 500 pixels, but images below 1,000 will not trigger zoom and may generate warnings. The hard maximum is 10,000 pixels on the longest side.</p>
            <p><strong>MAIN image rules:</strong> This is where Amazon stands apart. Your primary listing image (the "MAIN" slot in Seller Central) must:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li>Show only the product being sold, outside its packaging (with narrow category exceptions)</li>
                <li>Have a pure white background - RGB 255,255,255 exactly. Non-pure-white backgrounds trigger automated suppression</li>
                <li>Be a real photograph of the actual product, not an illustration, mockup, or placeholder</li>
                <li>Show the product in full, with nothing cropped off by the frame edges</li>
                <li>Fill roughly 85% of the image area</li>
                <li>Contain no added text, logos, watermarks, borders, color blocks, or inset images</li>
            </ul>
            <p>Additional images (the other slots beyond MAIN) have far more flexibility - lifestyle shots, context, multiple angles, packaging, and scale references are all fine.</p>
            <p><strong>How many images:</strong> Amazon recommends at least six images and one video per product. The current Seller Central UI typically shows up to nine image slots. No hard maximum is documented.</p>
            <p><strong>Common errors:</strong> A listing gets suppressed when the MAIN image background fails the pure-white check. Images smaller than 500 pixels won't upload cleanly; images between 500 and 1,000 pixels upload but disable zoom.</p>
        </section>

        <section id="shopify-flexible-but-your-theme-decides" class="scroll-mt-24">
            <SectionHeading>Shopify: Flexible, but Your Theme Decides</SectionHeading>
            <p>Shopify is intentionally permissive on image requirements because it's a platform for building stores, not a marketplace with its own quality control. The rules that do exist are about what you can upload, not how your images look.</p>
            <p><strong>Accepted formats:</strong> PNG (recommended for quality), JPEG, PSD, TIFF, BMP, GIF, SVG, HEIC, and WebP. Animated GIF and animated WebP are both supported. Notably, Shopify does not accept AVIF as an upload format as of June 2026 - but its CDN serves AVIF to supported browsers automatically after you upload in another format.</p>
            <p><strong>Dimensions and file size:</strong> Product and collection images can be up to 5,000 x 5,000 pixels (25 megapixels), with a hard 20 MB per-file limit. Shopify will reject images that exceed either limit.</p>
            <p><strong>What Shopify recommends:</strong> For square product images, Shopify states that 2,048 x 2,048 pixels "usually displays best." This is the practical target for most stores. It's a recommendation, not a rule - non-square images are accepted, and actual display depends entirely on your theme.</p>
            <p><strong>CDN and delivery:</strong> Shopify automatically generates multiple sizes when you upload an image. Its CDN negotiates the delivery format based on browser capability, serving AVIF first where supported, then WebP, then JPEG as a fallback. This means a JPEG you upload may reach a buyer as AVIF or WebP - which is good for performance but worth knowing if you're troubleshooting image quality at the browser level.</p>
            <p><strong>Theme control:</strong> Whether your images appear square, portrait, or landscape in collection grids is a theme decision, not a platform rule. Many popular themes crop thumbnails to 1:1 using CSS, even if your original image is 4:3. If your images look cropped in the wrong place on a Shopify store, it's the theme doing it - and adding padding or adjusting subject positioning in your source images is the fix.</p>
            <p><strong>Performance note:</strong> Images typically account for 50-80% of total page weight on Shopify stores. Uploading at 2,048 x 2,048 and letting Shopify's CDN handle downscaling is usually the right trade-off: high enough quality for zoom and retina displays, small enough not to tank LCP scores on mobile.</p>
        </section>

        <section id="etsy-resolution-affects-your-search-ranking" class="scroll-mt-24">
            <SectionHeading>Etsy: Resolution Affects Your Search Ranking</SectionHeading>
            <p>Etsy is unusual because it has made the link between image resolution and search placement explicit in its own documentation. This is documented on the "How to Use the Etsy Search Visibility Page" help article (checked June 2026): active listings need, among other requirements, a primary photo containing "high-resolution images (we recommend a width and height of 2000 pixels or more)" to have "a chance to receive priority placement in relevant search results."</p>
            <p><strong>Accepted formats:</strong> JPEG (.jpg), GIF, and PNG only. WebP is not in the accepted list. Animated GIFs and transparent PNGs are not supported - transparent areas render as black.</p>
            <p><strong>Dimensions:</strong> Etsy recommends primary photos with a width and height of at least 2,000 pixels. The minimum for your first listing photo - the one that appears in search results - is 635 x 635 pixels; below that, Etsy's documentation warns your listing "may show up lower in searches." The practical upshot: 2,000 x 2,000 is the target for competitive search placement.</p>
            <p><strong>File size:</strong> No hard cap is documented in Etsy's official help, but Etsy warns that images larger than 1 MB "may not finish uploading, especially on a slower internet connection." Third-party sources cite a ~20 MB practical limit. Keeping files in the 1-5 MB range after optimization is safe for both upload reliability and loading speed.</p>
            <p><strong>How many images:</strong> Up to 10 images per listing.</p>
            <p><strong>Aspect ratio and cropping:</strong> Etsy doesn't mandate a specific ratio. In practice, images are displayed differently depending on context - search results, listing detail pages, and shop views all crop differently. The safe approach is to center your subject with some margin, so the key product detail isn't at the very edge where a dynamic crop might cut it off.</p>
            <p>See also <a href="/guides/what-image-format-should-i-use-for-product-photos">What Image Format Should I Use for Product Photos?</a> for a comparison of JPEG vs WebP vs AVIF for marketplace listings specifically.</p>
        </section>

        <section id="ebay-generous-on-format-firm-on-minimum-size" class="scroll-mt-24">
            <SectionHeading>eBay: Generous on Format, Firm on Minimum Size</SectionHeading>
            <p>eBay is more lenient than Amazon on content rules - no white background requirement, no precise fill percentage - but it has a clear minimum dimension and a detailed set of upload errors worth knowing.</p>
            <p><strong>Accepted formats:</strong> eBay's developer API (EPS) accepts JPEG, PNG, GIF, BMP, TIFF, AVIF, HEIC, and WebP. The catch: GIF, PNG, and JPEG keep their format on the server; AVIF, HEIC, WebP and other non-JPEG formats are converted to JPEG on upload. So even if you upload HEIC or AVIF, buyers receive a JPEG.</p>
            <p><strong>Dimensions:</strong> The documented minimum is 500 pixels on the longest side. Community guidance from eBay's help resources suggests 1,600 x 1,600 pixels for best zoom quality - this is framed as a recommendation rather than a hard rule, but it's worth treating as the practical target for competitive listings. The hard maximum via the developer API is a combined height + width of 15,000 pixels; images exceeding this are rejected (error code 190202).</p>
            <p><strong>File size:</strong> The safe cap for manual web-tool uploads is 7 MB per image. The API/EPS limit is 12 MB. If you're managing listings programmatically, use 12 MB as the absolute ceiling; if you're uploading through the standard listing UI, aim to stay under 7 MB.</p>
            <p><strong>Picture policy:</strong> eBay prohibits borders, text overlays, marketing graphics, and watermarks on listing photos. Backgrounds don't need to be white, but the guidance emphasizes clean, neutral backgrounds and well-lit images.</p>
            <p><strong>How many images:</strong> Up to 24 images per listing in most categories at no extra cost. Multi-variation listings support up to 12 images per variation. At least one image is required.</p>
            <p><strong>Common errors and their codes</strong> (from eBay's developer documentation):</p>
            <ul class="list-disc pl-6 space-y-3">
                <li>190201: File above the maximum size (~12 MB) - compress before uploading</li>
                <li>190202: Combined height + width exceeds the maximum - downscale large-dimension images</li>
                <li>190203: Unsupported file format (e.g., PSD) - convert to JPEG or PNG first</li>
                <li>190204: Image URL not HTTPS or not accessible - direct file uploads avoid this</li>
            </ul>
            <p>If you're running into eBay's format and size requirements at scale, the <a href="https://mochify.app/solutions/ebay-image-converter">eBay Image Converter</a> at Mochify handles conversion to JPEG and compression to under the 12 MB API limit in one step.</p>
        </section>

        <section id="woocommerce-your-theme-your-rules" class="scroll-mt-24">
            <SectionHeading>WooCommerce: Your Theme, Your Rules</SectionHeading>
            <p>WooCommerce is a self-hosted platform, which means there is no central pixel count or file-size rule - it depends entirely on your WordPress installation, your server configuration, and your active theme.</p>
            <p>What WooCommerce does control is three registered image sizes that themes build on:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li><strong>woocommerce_thumbnail</strong> - used in product grids (shop and category pages); default 300 px wide, square-cropped</li>
                <li><strong>woocommerce_single</strong> - used on individual product pages; shows the full uploaded image uncropped, default 600 px wide</li>
                <li><strong>woocommerce_gallery_thumbnail</strong> - navigation thumbnails below the main image; always square-cropped, default 100 x 100 px</li>
            </ul>
            <p>Store owners can adjust thumbnail cropping in the Customizer: options are 1:1 (square), a custom ratio, or uncropped. Starting with WooCommerce 3.3, themes can also declare their own preferred image widths, which overrides the admin settings.</p>
            <p><strong>Practical guidance:</strong> Because there's no platform-level minimum, the right target size is whatever your theme's single-product display actually renders at - typically 600-1,200 px wide. Uploading at least 1,600 px wide and letting WordPress regenerate thumbnails at the correct sizes is a safe approach. The "Fixing blurry product images" article in WooCommerce's own documentation covers this well.</p>
            <p><strong>Formats:</strong> WooCommerce inherits WordPress's media library, which in current releases supports JPEG, PNG, GIF, and WebP. AVIF support depends on your WordPress version and server configuration - check before assuming it will work.</p>
        </section>

        <section id="vinted-guidance-over-specs" class="scroll-mt-24">
            <SectionHeading>Vinted: Guidance Over Specs</SectionHeading>
            <p>Vinted's English-language help content focuses almost entirely on what to photograph - authenticity shots, natural lighting, branded item close-ups - and gives almost nothing in the way of technical specs.</p>
            <p><strong>What the official docs say:</strong> Up to 20 photos per listing. Photos should show the full item first, then defects and branded details. No file format, pixel dimension, or file size limits are stated anywhere in Vinted's publicly available help center as of June 2026.</p>
            <p><strong>What third-party sources suggest</strong> (treat as best-practice estimates, not rules): Portrait images in a 3:4 ratio - around 900 x 1,200 px or 1,080 x 1,350 px - appear to work well with Vinted's vertical feed layout. A minimum shortest side of 600-800 px and a maximum file size around 20 MB are commonly cited. These are not confirmed by Vinted's documentation; they reflect what consistently works in practice.</p>
            <p><strong>Practical approach:</strong> Shoot or crop to a portrait 3:4 ratio, keep files under 5 MB after compression, and ensure the shortest side is at least 800 px. Vinted compresses on upload, so starting from a sharp original gives you more to work with.</p>
        </section>

        <section id="depop-square-or-be-cropped" class="scroll-mt-24">
            <SectionHeading>Depop: Square or Be Cropped</SectionHeading>
            <p>Depop is unusual in that its own seller education explicitly tells you what to do even when a technical spec document isn't publicly available.</p>
            <p><strong>Official guidance:</strong> Depop's Level Up seller video (produced by Depop's Seller Success Team) instructs: "Always upload a square 1:1 ratio and show the full item in the photo." This is the clearest platform-endorsed requirement, even without a formal technical spec sheet.</p>
            <p><strong>Third-party specs</strong> (sourcing from a Depop Seller Photography Guide PDF referenced by multiple independent sellers): The widely cited figures are 1,080 x 1,080 px recommended, 640 x 640 px minimum, JPEG or PNG formats, 15 MB maximum per image. These numbers are consistent across Depop-specific tools but do not appear in Depop's public help center, so treat the precise figures as plausible rather than verified.</p>
            <p><strong>How many images:</strong> Up to 4 photos plus a short video per listing (per the current Depop app UI and community references).</p>
            <p><strong>Cropping behavior:</strong> Third-party tools report that non-square images are auto-cropped to square for cover thumbnails, consistent with Depop's square-first feed design. This isn't documented in a public spec, but it aligns with the seller education telling you to shoot 1:1 from the start.</p>
            <p>For listings across platforms where thumbnail cropping behavior is unclear, the <a href="https://mochify.app/solutions/bulk-ai-square-cropper">Bulk AI Square Cropper</a> at Mochify uses saliency-guided cropping to center on the main subject, with output sizes from 500 to 2,000 px.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Quick-Reference Cheat Sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[1200px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Platform</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Min dimensions</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Sweet spot</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Max file size</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Accepted upload formats</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">White BG required?</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Square required?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Amazon</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">500 px (long side); 1,000 px for zoom</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,600-2,000 px</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~10,000 px long side (no MB cap stated)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG, PNG, TIFF, GIF (non-animated)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes - MAIN image, RGB 255/255/255</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Shopify</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">None enforced</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">2,048 x 2,048 px</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">20 MB</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG, PNG, WebP, HEIC, SVG, GIF, BMP, TIFF, PSD</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Recommended for consistent grids; not required</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Etsy</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">635 px (for search); 2,000 px for priority placement</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">2,000 x 2,000 px</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~20 MB (1 MB warned as upload risk)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG, PNG, GIF (no animated, no transparent PNG)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No (but common)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">eBay</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">500 px (long side)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,600 x 1,600 px</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">7 MB (web UI) / 12 MB (API)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG, PNG, GIF, BMP, TIFF, AVIF, HEIC, WebP (non-JPEG converted to JPEG server-side)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">WooCommerce</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">None (theme-dependent)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Match your theme's single-product width (typically 800-1,600 px)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">None (server-dependent)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG, PNG, GIF, WebP (via WordPress)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Thumbnails square by default; configurable</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Vinted</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Not documented</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">900 x 1,200 px or 1,080 x 1,350 px (3:4 portrait; third-party estimate)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Not documented (~20 MB cited in third-party guides)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Not documented (JPEG/PNG assumed)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No (portrait 3:4 better suited)</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Depop</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~640 px (from third-party sources)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,080 x 1,080 px square</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~15 MB (from third-party sources)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG, PNG (assumed from third-party guides)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes - strongly; non-square images get auto-cropped to square</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">Mochify Workflow: Prep Images for Any Marketplace</h2>
            <p class="text-base mb-7">Getting images to spec across multiple platforms involves the same few operations repeatedly: resize to the right dimensions, compress to meet file size limits, convert to an accepted format, and remove backgrounds where needed. A single plain-English prompt handles all of this in one pass.</p>
            <ol class="space-y-4 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Describe what you need</strong>
                        <p class="text-base m-0">Open <a href="https://mochify.app">mochify.app</a> and type the task in plain English. Magic Flow interprets the intent and applies the right combination of resize, format conversion, and compression settings. For marketplace prep, prompts like these work directly:</p>
                        <ul class="list-disc pl-6 space-y-2 my-4 text-base">
                            <li><strong>"Resize to 2000x2000 JPEG, keep quality high"</strong> (Etsy primary images)</li>
                            <li><strong>"Convert to JPEG, max 1600px on longest side, compress for web"</strong> (Amazon MAIN images)</li>
                            <li><strong>"Compress to under 7MB as JPEG"</strong> (eBay web-tool uploads)</li>
                            <li><strong>"Square crop to 1080px, center the subject"</strong> (Depop)</li>
                        </ul>
                        <p class="text-base m-0">Magic Flow runs a two-step pipeline: a language model parses your prompt, then the C++ compression engine executes the output. The result is a JPEG, WebP, AVIF, or PNG - whichever you asked for - ready to upload.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Process in batches</strong>
                        <p class="text-base m-0">If you're preparing images for multiple SKUs in one session, Mochify processes up to 25 files at once on Seller and Pro plans, or 3 per session on Free. Upload your batch, describe the transformation once, and download the full set.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Background removal</strong>
                        <p class="text-base m-0">For Amazon MAIN images and other white-background requirements, background removal is available on every plan, including Free. Run a natural-language prompt like <strong>"remove background and export as JPEG on white"</strong> to get an image that meets the RGB 255,255,255 rule cleanly.</p>
                    </div>
                </li>
            </ol>
            <p class="text-base text-[#875F42] mt-7 mb-0">Privacy note: images you upload to Mochify are streamed into the encoder in RAM, processed, and wiped immediately - no disk writes of your source files, no logs containing file data. If you're working with product images that carry location metadata or other EXIF data you'd rather not expose, say so in the prompt - for example <strong>"resize to 2000x2000 JPEG and strip all metadata"</strong> - and the output matches the instruction.</p>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-24">
            <SectionHeading>FAQ</SectionHeading>
            <div>
                <div class="faq-item">
                    <h3>Does Amazon require square images?</h3>
                    <p>No. Amazon doesn't mandate a 1:1 aspect ratio for most product categories. The MAIN image rules are about background (pure white), fill percentage (~85% of frame), and content (real photo, product only, no text or watermarks) - not aspect ratio. Some category-specific guides, such as those for clothing, specify ratios close to 3:4, but there's no universal square requirement.</p>
                </div>
                <div class="faq-item">
                    <h3>Why does Etsy rank lower-resolution images lower in search?</h3>
                    <p>Etsy's Search Visibility documentation states that a primary photo with "high-resolution images (we recommend a width and height of 2000 pixels or more)" is one of the requirements for "a chance to receive priority placement in relevant search results." Etsy has a direct commercial interest in its listings converting well, and higher-resolution images tend to result in more confident buyers.</p>
                </div>
                <div class="faq-item">
                    <h3>Does eBay convert WebP and AVIF uploads to JPEG?</h3>
                    <p>Yes. eBay's developer documentation (EPS) confirms that JPEG, PNG, and GIF retain their original format, but "other non-JPG format files are converted to JPG" server-side. So uploading WebP, AVIF, or HEIC to eBay results in a JPEG being stored and delivered to buyers. Save yourself the conversion uncertainty and upload JPEG directly.</p>
                </div>
                <div class="faq-item">
                    <h3>What's the difference between Vinted's portrait format and Depop's square format?</h3>
                    <p>Vinted's mobile-first feed is designed around portrait images - taller than wide - which take up more screen space and look more natural in a scrolling feed. Depop's grid is built around squares, and the platform explicitly tells sellers to shoot 1:1. If you're selling the same item on both platforms, you'll need two crops.</p>
                </div>
                <div class="faq-item">
                    <h3>Can Shopify's CDN serve AVIF if I upload JPEG?</h3>
                    <p>Yes. Shopify's CDN negotiates format delivery based on the browser's Accept header, serving AVIF where supported, WebP as a second option, and JPEG as a fallback. You upload once (JPEG, PNG, WebP, etc.) and Shopify handles format negotiation for delivery. You do not need to upload AVIF files to get AVIF delivery on Shopify.</p>
                </div>
                <div class="faq-item">
                    <h3>How does WooCommerce decide what size to display my product images at?</h3>
                    <p>WooCommerce registers three image sizes with defaults (300 px square thumbnails, 600 px single-product, 100 px gallery navigation), but themes can override these widths in their code. The actual displayed size is a combination of the WooCommerce settings, your theme's declarations, and CSS. If images look wrong after upload, check your theme's recommended image dimensions first, regenerate thumbnails (using a plugin like Regenerate Thumbnails), and confirm your source images are at least 1.5-2x the rendered pixel width.</p>
                </div>
                <div class="faq-item">
                    <h3>What file format should I use across all platforms?</h3>
                    <p>JPEG is the only format accepted on all seven platforms covered here (even eBay converts others to JPEG). PNG is accepted everywhere except Vinted and Depop, where the format isn't officially documented but is widely assumed to work. WebP is only reliably accepted as an upload format on Shopify and eBay (where it's converted to JPEG anyway). For maximum compatibility, JPEG at 85-90% quality is the sensible default for marketplace uploads. See <a href="/guides/what-image-format-should-i-use-for-product-photos">What Image Format Should I Use for Product Photos?</a> for a deeper look.</p>
                </div>
                <div class="faq-item">
                    <h3>Should I optimize before uploading or let the platform handle it?</h3>
                    <p>Optimize before uploading. Every platform recompresses on ingest, and starting from a well-optimized JPEG at the right dimensions gives the platform's encoder better material to work with than an unoptimized raw or PSD. Shopify's CDN, for example, generates multiple sizes from your upload - so uploading at 2,048 x 2,048 px, compressed cleanly to around 300-500 KB, gives it a sharp source to downscale without hitting the 20 MB upload limit. See <a href="/guides/should-i-optimize-images-before-upload">Should I Optimize My Images Before I Upload Them?</a> for the full rationale.</p>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <GuideCTA
            heading="Prep once, sell everywhere"
            href="/"
            label="Try it free at mochify.app →"
        >
            Once your images are at the right spec, they upload cleanly to any platform in this guide - no per-platform re-editing required. <a href="https://mochify.app">Optimize your marketplace images at mochify.app</a>.
        </GuideCTA>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">· {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
