<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "What Image Format Should I Use for Product Photos?",
        description: "Use AVIF for the smallest files, WebP as a fallback, and JPEG for the broadest compatibility. Here's the practical order for ecommerce product images.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "May 19, 2026"
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
            desc: "In 2026, use AVIF as your primary format with WebP as fallback. JPEG XL is not production-ready for web delivery."
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
        "dateModified": "2026-05-19",
        "inLanguage": "en-GB",
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
            {"@type": "Thing", "name": "Image optimisation"},
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

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            What Image Format Should I Use for Product Photos?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Use AVIF as your primary format, WebP as your first fallback, and JPEG as your universal fallback. AVIF consistently produces the smallest files at good visual quality for photographic content, WebP covers browsers that don't yet handle AVIF cleanly, and JPEG ensures nothing breaks for older systems or third-party integrations.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-[#6C3F31] leading-relaxed">
                <strong>Published May 2026 by the Mochify Engineering Team.</strong> This article covers the practical format fallback order for ecommerce product images and explains when JPEG is still the right choice for marketplace uploads.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="fallback-order" class="scroll-mt-24">
            <SectionHeading>The practical fallback order</SectionHeading>
            <p class="mb-4">The strongest pattern for serving product images on the web is the HTML <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">&lt;picture&gt;</code> element, which lets browsers pick the best format they can decode:</p>

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

            <p>Browsers try AVIF first, then WebP, then fall back to JPEG. This means visitors always receive the smallest file their browser can handle — with no manual decision-making per image.</p>
        </section>

        <section id="why-avif-leads" class="scroll-mt-24">
            <SectionHeading>Why AVIF leads, not WebP</SectionHeading>
            <p class="mb-4">AVIF typically produces files 20–50% smaller than equivalent WebP images at comparable visual quality, with gains most visible in smooth gradients and skin tones — common in product photography. WebP is still the safer choice if you cannot serve format fallbacks, because its browser support is broader and more consistent across older versions. JPEG remains important for marketplace uploads, email templates, print workflows, and any system that doesn't parse modern format headers reliably.</p>
        </section>

        <section id="keep-jpeg" class="scroll-mt-24">
            <SectionHeading>When to keep JPEG as your only format</SectionHeading>
            <p class="mb-4">If you're uploading directly to a marketplace (Amazon, eBay, Etsy) or a CMS that re-processes images on ingest, JPEG is often the right choice for your upload file. Those platforms apply their own compression pipeline, so delivering AVIF at upload doesn't give you control over what they serve. For your own storefront — Shopify, WooCommerce, a custom build — serving AVIF via <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">&lt;picture&gt;</code> gives you full control and the best results.</p>

            <InfoBox type="tip" title="Marketplace tip">
                Keep a separate set of high-quality JPEG exports specifically for marketplace uploads. Your own storefront and your marketplace listings have different requirements — don't try to use the same file for both.
            </InfoBox>
        </section>

        <section id="preparing-images" class="scroll-mt-24">
            <SectionHeading>Preparing your product images before upload</SectionHeading>
            <p class="mb-4">Compress product photos to AVIF or WebP before uploading to your storefront, and keep JPEG fallback versions for marketplace listings and older integrations. At <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a> you can describe the task in plain English — for example, type <em>"convert to AVIF and compress for product pages"</em> — and Magic Flow handles the format conversion, compression, and EXIF stripping in one step. Files are processed without being stored, so nothing is retained after your session ends.</p>
        </section>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
            <h3 class="text-lg font-black text-[#4A2C2C] mb-3">Compress product photos to AVIF or WebP in one step</h3>
            <p class="text-[#6C3F31] leading-relaxed mb-4">
                Just type something like <em>"convert to AVIF and compress for product pages"</em> — Magic Flow handles format conversion, compression, and EXIF stripping. Files are processed in-memory and wiped after your session ends. No account required for up to 3 files.
            </p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Try it free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

        <RelatedGuides guides={related} />

    </div>
</article>
