<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Can WordPress 7.1 Optimize Images Without a Plugin?",
        description: "Mostly, yes. WordPress 7.1 compresses, resizes, and converts HEIC images in-browser, but only in Chrome/Edge and only to fixed defaults.",
        category: "WordPress Performance",
        readTime: "2 min read",
        date: "August 21, 2026",
        lastUpdated: "August 25, 2026"
    };

    const related = [
        { href: '/guides/heic-to-jpeg-or-webp-wordpress', title: 'Should I convert HEIC to JPEG or WebP for WordPress uploads?', desc: 'choosing the right target format before upload.' },
        { href: '/guides/next-gen-image-formats-wordpress', title: 'Fix "Next-Gen Formats" in WordPress (No Plugins)', desc: 'the PageSpeed delivery-side fix.' },
        { href: '/guides/does-stripping-exif-data-improve-wordpress-image-seo', title: 'Does Stripping EXIF Data Improve WordPress Image SEO?', desc: 'what metadata does and does not affect.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Can WordPress 7.1 Optimize Images Without a Plugin?",
        "description": "Mostly, yes. WordPress 7.1 compresses, resizes, and converts HEIC images in-browser, but only in Chrome/Edge and only to fixed defaults.",
        "url": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin"
        },
        "datePublished": "2026-08-21",
        "dateModified": "2026-08-25",
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
            { "@type": "Thing", "name": "WordPress 7.1" },
            { "@type": "Thing", "name": "libvips" },
            { "@type": "Thing", "name": "HEIC image format" },
            { "@type": "Thing", "name": "AVIF image format" },
            { "@type": "Thing", "name": "HDR gain maps" },
            { "@type": "Thing", "name": "EXIF metadata" }
        ],
        "keywords": "WordPress 7.1 image optimization without plugin, wordpress 7.1 image optimization, wordpress image compression without plugin, heic to jpeg wordpress uploads, avif support wordpress, wordpress media library optimization, libvips image processing",
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
            { "@type": "ListItem", "position": 3, "name": "Can WordPress 7.1 Optimize Images Without a Plugin?", "item": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Can WordPress 7.1 Optimize Images Without a Plugin?",
        "url": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin",
        "description": "Mostly, yes. WordPress 7.1 compresses, resizes, and converts HEIC images in-browser, but only in Chrome/Edge and only to fixed defaults.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-08-21",
        "dateModified": "2026-08-25"
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
                {metadata.readTime} · {metadata.date} · Updated {metadata.lastUpdated}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Can WordPress 7.1 Optimize Images Without a Plugin?
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Mostly, yes. WordPress 7.1 image optimization without a plugin is now real: the release (August 19, 2026) moves image compression, resizing, and thumbnail generation into your browser, converts iPhone HEIC photos to JPEG on upload, decodes AVIF natively, and preserves HDR gain maps. For routine upload-time optimization, most sites no longer need a dedicated plugin. The trade-off is control: WordPress optimizes to its own defaults, only in supported browsers, and it never touches the full-size original you upload.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl mb-8">
            <p class="text-lg text-[#6C3F31] leading-relaxed m-0">
                <strong>Quick answer:</strong> Yes, largely. WordPress 7.1's browser-based pipeline (released August 19, 2026) handles upload-time compression, resizing, thumbnails, HEIC-to-JPEG conversion, and native AVIF decoding without a plugin. It uses fixed defaults, works fully only in Chrome and Edge 137+, and leaves your original file's metadata untouched.
            </p>
        </div>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published August 21, 2026 by the Mochify Engineering Team.</strong>
                This quick answer separates what WordPress 7.1's new browser-based pipeline automates from what still requires a dedicated tool.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-wordpress-7-1-does-natively">
            <SectionHeading>What WordPress 7.1 does natively</SectionHeading>
            <p>The new pipeline runs in the browser through a WebAssembly build of the libvips image library, so processing no longer hits PHP memory limits or upload timeouts on shared hosting. According to the <a href="https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/" target="_blank" rel="noopener noreferrer">WordPress 7.1 dev notes</a>, libvips produces JPEGs around 15% smaller than the old server-side pipeline, and the <a href="https://wordpress.org/news/2026/08/mary-lou/" target="_blank" rel="noopener noreferrer">release announcement</a> confirms native handling for AVIF, HEIC, and HDR gain maps.</p>
            <p>In practice: HEIC photos are decoded in the browser and uploaded as web-ready JPEG (the HEIC original is kept as a companion file), 10-bit and 12-bit AVIF sources keep their bit depth in generated sizes, and HDR gain-map data survives across every thumbnail.</p>
            <p>One important limit: client-side processing currently works in Chrome and Edge 137+ only. Firefox, Safari, and low-memory devices silently fall back to the old server-side processing, so results are not identical for every user who uploads.</p>
        </section>

        <section id="what-it-still-leaves-to-you">
            <SectionHeading>What it still leaves to you</SectionHeading>
            <p>WordPress applies its own defaults, not your decisions. JPEG quality stays fixed at 82 unless a developer adds code-level filters, there is no per-image choice of output format or quality in the admin, and the release notes describe nothing for re-optimizing images already in your media library. Scaling still caps large uploads at 2560px rather than the exact dimensions your theme needs.</p>
            <p>The original file is also untouched by design. WordPress has never stripped metadata from the full-size original, so an uploaded photo's EXIF data, including GPS location, stays in that file on your server. If that matters for privacy, it needs handling before upload; our <a href="/guides/does-stripping-exif-data-improve-wordpress-image-seo">EXIF and WordPress SEO Quick Answer</a> covers why.</p>
        </section>

        <section id="where-pre-upload-optimization-still-fits">
            <SectionHeading>Where pre-upload optimization still fits</SectionHeading>
            <p>Optimizing before upload gives you what 7.1 does not: exact dimensions, your chosen format and quality, and clean metadata, identical in every browser. WordPress is one case of a pattern that now runs everywhere; see <a href="/guides/what-automatic-image-optimization-actually-does">the bigger picture on platform defaults</a> for how the same trade-off plays out across Shopify, Instagram, and the marketplaces. Files are streamed into memory on Mochify's servers for processing and wiped immediately, with nothing retained. If your library is full of iPhone photos, start with the <a href="/heic-to-jpeg">HEIC to JPEG converter</a>, and see our guide to <a href="/guides/next-gen-image-formats-wordpress">fixing next-gen image formats in WordPress</a> for the delivery side that 7.1 still does not solve.</p>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Optimize before you upload</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base">With Mochify you can describe the whole job in plain English, for example: <em>"resize these to 1600px wide, convert to WebP, and strip GPS data."</em></p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Open mochify.app →
            </a>
        </div>

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
