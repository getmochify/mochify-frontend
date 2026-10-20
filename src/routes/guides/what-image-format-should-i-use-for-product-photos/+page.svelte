<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "What Image Format Should I Use for Product Photos?",
        description: "Use AVIF for the smallest files, WebP as a fallback, and JPEG for the broadest compatibility. Here's the practical order for ecommerce product images.",
        category: "Quick Guides",
        readTime: "2 min read",
        datePublished: "May 19, 2026",
        lastUpdated: "October 7, 2026"
    };

    const related = [
        {
            title: "Should I Optimize My Images Before I Upload Them?",
            href: "/guides/should-i-optimize-images-before-upload",
            desc: "When pre-upload optimization is mandatory, when it's optional, and the right workflow for Shopify, WordPress, and marketplaces."
        },
        {
            title: "How to Use Jpegli for Shopify Product Images",
            href: "/guides/jpegli-shopify-product-images",
            desc: "How Google's jpegli encoder delivers up to 35% smaller JPEGs at high quality, and how to use it for Shopify product image workflows."
        },
        {
            title: "What Should I Use in 2026: WebP, AVIF, or JPEG XL?",
            href: "/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl",
            desc: "Use AVIF as your primary format with WebP as fallback, and where JPEG XL now fits after Chrome 155 and Firefox 158."
        },
        {
            title: "Do Marketplace Product Images Need to Be Square?",
            href: "/guides/do-marketplace-product-images-need-to-be-square",
            desc: "Square vs non-square product images for marketplaces: what each platform requires and how thumbnails get cropped."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/what-image-format-should-i-use-for-product-photos" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "What Image Format Should I Use for Product Photos?",
        "description": "Use AVIF for the smallest files, WebP as a fallback, and JPEG for the broadest compatibility. Here's the practical order for ecommerce product images.",
        "url": "https://mochify.app/guides/what-image-format-should-i-use-for-product-photos",
        "datePublished": "2026-05-19",
        "dateModified": "2026-10-07",
        "inLanguage": "en",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            {"@type": "Thing", "name": "AVIF"},
            {"@type": "Thing", "name": "WebP"},
            {"@type": "Thing", "name": "JPEG"},
            {"@type": "Thing", "name": "Image optimization"},
            {"@type": "Thing", "name": "Ecommerce product photography"}
        ],
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
                {"@type": "ListItem", "position": 3, "name": "What Image Format Should I Use for Product Photos?", "item": "https://mochify.app/guides/what-image-format-should-i-use-for-product-photos"}
            ]
        }
    }
    </script>
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="Product Photos" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.datePublished} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Use AVIF as your primary format, WebP as your first fallback, and JPEG as your universal fallback. AVIF consistently produces the smallest files at good visual quality for photographic content, WebP covers browsers that don't yet handle AVIF cleanly, and JPEG ensures nothing breaks for older systems or third-party integrations.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong>Published May 2026 by the Mochify Engineering Team.</strong> This article covers the practical format fallback order for ecommerce product images and explains when JPEG is still the right choice for marketplace uploads.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="fallback-order" class="scroll-mt-24">
            <SectionHeading>The practical fallback order</SectionHeading>
            <p class="mb-4">The strongest pattern for serving product images on the web is the HTML <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;picture&gt;</code> element, which lets browsers pick the best format they can decode:</p>

            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-4">
                <div class="bg-[#4A2C2C] px-5 py-3 flex items-center justify-between">
                    <span class="text-pink-200 text-xs font-black uppercase tracking-widest">HTML</span>
                </div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed"><code>&lt;picture&gt;
  &lt;source srcset="product.avif" type="image/avif"&gt;
  &lt;source srcset="product.webp" type="image/webp"&gt;
  &lt;img src="product.jpg" alt="Product name"&gt;
&lt;/picture&gt;</code></pre>
            </div>

            <p>Browsers try AVIF first, then WebP, then fall back to JPEG. This means visitors always receive the smallest file their browser can handle - with no manual decision-making per image.</p>
        </section>

        <section id="why-avif-leads" class="scroll-mt-24">
            <SectionHeading>Why AVIF leads, not WebP</SectionHeading>
            <p class="mb-4">AVIF typically produces files 20–50% smaller than equivalent WebP images at comparable visual quality, with gains most visible in smooth gradients and skin tones - common in product photography. If you're not sure <a href="/guides/what-is-an-avif-file">what an AVIF file actually is</a>, it's a newer codec built for exactly this kind of compression win. WebP is still the safer choice if you cannot serve format fallbacks, because its browser support is broader and more consistent across older versions. JPEG remains important for marketplace uploads, email templates, print workflows, and any system that doesn't parse modern format headers reliably.</p>
        </section>

        <section id="keep-jpeg" class="scroll-mt-24">
            <SectionHeading>When to keep JPEG as your only format</SectionHeading>
            <p class="mb-4">If you're uploading directly to a marketplace (Amazon, eBay, Etsy) or a CMS that re-processes images on ingest, JPEG is often the right choice for your upload file. Those platforms apply their own compression pipeline, so delivering AVIF at upload doesn't give you control over what they serve, and picking the wrong one is a common way to <a href="https://mochify.app/guides/ebay-image-file-not-supported">fix "file not supported" errors on eBay</a> before they happen. For your own storefront - Shopify, WooCommerce, a custom build - serving AVIF via <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;picture&gt;</code> gives you full control and the best results.</p>
            <p class="mb-4">Format support also varies more between platforms than most sellers expect, and the differences are rarely documented in one place. Before you standardize on a single export preset, it is worth checking <a href="/guides/product-image-requirements-marketplace-guide">what each marketplace actually accepts</a> for format, dimensions, and file size.</p>

            <GlassInfoBox type="tip" title="Marketplace tip">
                Keep a separate set of high-quality JPEG exports specifically for marketplace uploads. Your own storefront and your marketplace listings have different requirements - don't try to use the same file for both.
            </GlassInfoBox>
        </section>

        <section id="preparing-images" class="scroll-mt-24">
            <SectionHeading>Preparing your product images before upload</SectionHeading>
            <p class="mb-4">Compress product photos to AVIF or WebP before uploading to your storefront, and keep JPEG fallback versions for marketplace listings and older integrations. At <a href="https://mochify.app">mochify.app</a> you can describe the task in plain English - for example, type <em>"convert to AVIF and compress for product pages"</em> - and Magic Flow handles the format conversion, compression, and EXIF stripping in one step. Files are processed without being stored, so nothing is retained after your session ends.</p>
        </section>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
            <h3 class="text-lg font-bold text-[#4A2C2C] mb-3">Compress product photos to AVIF or WebP in one step</h3>
            <p class="text-[#6C3F31] leading-relaxed mb-4">
                Just type something like <em>"convert to AVIF and compress for product pages"</em> - Magic Flow handles format conversion, compression, and EXIF stripping. Files are processed in-memory and wiped after your session ends. No account required for up to 3 files.
            </p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Try it free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>

<style>
	/* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. */
	:global(nav[aria-label='Breadcrumb']) {
		max-width: 48rem;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1.25rem;
	}

	/* Match the article's mobile gutter (px-5 vs the breadcrumb's px-4). */
	@media (max-width: 767px) {
		:global(nav[aria-label='Breadcrumb']) {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}
</style>
