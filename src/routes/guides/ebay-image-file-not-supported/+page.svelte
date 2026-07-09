<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Why Does eBay Say My Image File Is Not Supported?",
        description: "eBay rejects HEIC, HIF, RAW and oversized images. Convert to JPEG before uploading to fix 'file not supported' errors instantly.",
        category: "Quick Guides",
        readTime: "2 min read",
        datePublished: "June 24, 2026"
    };

    const related = [
        {
            title: "What Image Format Should I Use for Product Photos?",
            href: "/guides/what-image-format-should-i-use-for-product-photos",
            desc: "A quick breakdown of JPEG, WebP, and AVIF for ecommerce product listings."
        },
        {
            title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt",
            href: "/guides/ecommerce-product-photo-workflow-resize-convert",
            desc: "How to batch-process product images for any marketplace using natural language."
        },
        {
            title: "Should I Optimize My Images Before I Upload Them?",
            href: "/guides/should-i-optimize-images-before-upload",
            desc: "Why pre-optimizing before any platform upload is faster and safer."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/ebay-image-file-not-supported" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Why Does eBay Say My Image File Is Not Supported?",
        "description": "eBay rejects HEIC, HIF, RAW and oversized images. Convert to JPEG before uploading to fix 'file not supported' errors instantly.",
        "url": "https://mochify.app/guides/ebay-image-file-not-supported",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/ebay-image-file-not-supported"
        },
        "datePublished": "2026-06-24",
        "dateModified": "2026-06-24",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
                {"@type": "ListItem", "position": 3, "name": "Why Does eBay Say My Image File Is Not Supported?", "item": "https://mochify.app/guides/ebay-image-file-not-supported"}
            ]
        },
        "about": [
            { "@type": "Thing", "name": "eBay image requirements" },
            { "@type": "Thing", "name": "Image format conversion" },
            { "@type": "Thing", "name": "JPEG compression" }
        ],
        "keywords": "ebay image file not supported, ebay image upload error, heic ebay, hif ebay, convert image to jpeg ebay"
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
                {metadata.readTime} · {metadata.datePublished}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Why Does eBay Say My Image File Is Not Supported?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            eBay rejects images in formats its upload tool does not accept, most commonly HEIC files from iPhones, HIF or RAW files from mirrorless cameras, and WebP or AVIF exports from editing software. Converting to JPEG before uploading fixes the error in almost every case.
        </p>

        <p class="text-sm text-[#875F42]">Published {metadata.datePublished} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong></p>
    </header>

    <div class="space-y-12 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-formats-does-ebay-accept" class="scroll-mt-24">
            <SectionHeading>What formats does eBay actually accept?</SectionHeading>
            <p class="mb-4">eBay's seller upload tool reliably accepts JPEG, PNG, GIF, BMP, and TIFF. Although eBay's developer documentation lists WebP, HEIC, and AVIF as supported at the server level, many sellers report that the web uploader rejects these formats with a "file not supported" message. JPEG is the safest choice for main product photos and is what seller guides consistently recommend.</p>
            <p class="mb-4">RAW files from cameras (CR3, ARW, NEF, and similar) and HIF files from professional mirrorless cameras are never accepted. Renaming a HEIC or RAW file with a <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">.jpg</code> extension does not work. eBay checks the actual file data, not just the extension.</p>

            <InfoBox type="tip" title="Good to know">
                The mismatch between eBay's developer docs (which list WebP and HEIC as supported) and the web uploader (which rejects them in practice) catches a lot of sellers out. When in doubt, export as JPEG.
            </InfoBox>
        </section>

        <section id="the-12mb-file-size-limit" class="scroll-mt-24">
            <SectionHeading>The 12&nbsp;MB file size limit</SectionHeading>
            <p class="mb-4">Every image must be under 12&nbsp;MB per file. This catches two common scenarios: RAW or TIFF exports, which can run into the tens or hundreds of megabytes, and high-resolution JPEGs where someone has exported at 100% quality from a large sensor camera.</p>
            <p class="mb-4">Exporting a JPEG at 80–90% quality and sizing the longest edge to around 1,600 pixels (eBay's recommended size for the zoom viewer) typically brings files well under the limit while keeping image quality high for buyers. Practical targets: files of 200–800&nbsp;KB work well for most listings.</p>
        </section>

        <section id="fix-it-in-one-step-with-mochify" class="scroll-mt-24">
            <SectionHeading>Fix it in one step with Mochify</SectionHeading>
            <p class="mb-4">Mochify's <a href="/solutions/ebay-image-converter">eBay Image Converter</a> handles both problems at once. Upload your HEIC, HIF, WebP, or oversized JPEG and describe what you need in plain English. You could type something like:</p>

            <div class="bg-[#FFF8F9] border border-pink-100 rounded-2xl px-6 py-5 my-6">
                <p class="font-mono text-sm text-[#4A2C2C] leading-relaxed">Convert to JPEG, resize to 1600px on the longest side, and keep quality around 85</p>
            </div>

            <p class="mb-4">Mochify interprets that and applies the right settings automatically. Your image is processed in-memory and deleted immediately: nothing is stored. The free plan covers 25 images per month, or 3 per session without signing up, which is enough for occasional listings.</p>
        </section>

        <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-8">
            <p class="text-[#6C3F31] leading-relaxed mb-5">Convert HEIC, HIF, RAW, or oversized images to eBay-ready JPEG in seconds. Just describe what you need: <em>"convert to JPEG, 1600px, quality 85"</em> and Mochify handles the rest.</p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Try it free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </aside>

        <RelatedGuides guides={related} />

    </div>
</article>
