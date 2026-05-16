<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Does Chrome 145 Enable JPEG XL by Default in 2026?",
        description: "Chrome 145 adds JPEG XL decoding support, but the feature is off by default and requires a browser flag. Here is what that means for serving images in 2026.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "April 10, 2026"
    };

    const related = [
        {
            title: "The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL",
            href: "/guides/2026-guide-next-gen-formats",
            desc: "Which next-gen format should you actually use? A practical comparison of WebP, AVIF, and JPEG XL for the web in 2026."
        },
        {
            title: "Jpegli Guide 2026: Why Jpegli Changes the Quality-Per-Byte Game",
            href: "/guides/jpeg-in-2026-jpegli",
            desc: "A deep dive into how Jpegli achieves 35% better compression than standard JPEG at equivalent visual quality."
        },
        {
            title: "The History of Image Compression: From BMP to AVIF & Jpegli",
            href: "/guides/history-image-compression-2026",
            desc: "Trace the evolution of image formats from BMP to AVIF and Jpegli, and what it means for web performance in 2026."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Does Chrome 145 Enable JPEG XL by Default? | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/chrome-145-jpeg-xl-default" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["Article", "WebPage"],
        "headline": "Does Chrome 145 Enable JPEG XL by Default in 2026?",
        "description": "Chrome 145 adds JPEG XL decoding support, but the feature is off by default and requires a browser flag. Here is what that means for serving images in 2026.",
        "url": "https://mochify.app/guides/chrome-145-jpeg-xl-default",
        "inLanguage": "en",
        "datePublished": "2026-04-10",
        "dateModified": "2026-04-10",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team"
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
        "about": ["JPEG XL", "Chrome 145", "browser support", "image formats", "web performance"],
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Guides", "item": "https://mochify.app/guides" },
                { "@type": "ListItem", "position": 2, "name": "Does Chrome 145 Enable JPEG XL by Default?", "item": "https://mochify.app/guides/chrome-145-jpeg-xl-default" }
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
            Does Chrome 145 Enable JPEG XL by Default in 2026?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Chrome 145 includes JPEG XL decoding support, but the Chrome 145 JPEG XL default is <strong>off</strong>. The feature is gated behind a browser flag, meaning the vast majority of Chrome users cannot render <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">.jxl</code> images without manually toggling a setting. Do not serve JPEG XL as your primary image format for public-facing websites yet.
        </p>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-chrome-145-added" class="scroll-mt-24">
            <SectionHeading>What Chrome 145 actually added</SectionHeading>
            <p class="mb-4">Chrome 145, released on 10 February 2026, re-introduced JPEG XL decoding using <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">jxl-rs</code> — a memory-safe, pure Rust decoder. This replaces the C++ libjxl implementation that Google removed in 2022. The decoder is present in the stable codebase for the first time in over three years.</p>
            <p class="mb-4">JPEG XL is a next-generation image codec. In plain English: it is a smarter way to compress images, delivering files 50–60% smaller than traditional JPEG at equivalent quality, and roughly 10–15% better compression than AVIF. It also supports lossless recompression of existing JPEGs, progressive decoding, HDR, and animation.</p>
        </section>

        <section id="flag-only-not-default" class="scroll-mt-24">
            <SectionHeading>Flag-only, not default</SectionHeading>
            <p class="mb-4">To use JPEG XL in Chrome 145, a user must navigate to <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">chrome://flags/#enable-jxl-image-format</code> and toggle the feature on manually. No ordinary user does this. As of early 2026, JPEG XL has roughly 12–17% browser support globally, concentrated in Safari on macOS and iOS. Chrome and Firefox both require a manual opt-in.</p>
            <p class="mb-4">Google has set explicit conditions for enabling the feature by default: a long-term maintenance commitment and meeting standard Chrome launch criteria. Neither has been publicly confirmed as met.</p>

            <InfoBox type="warning" title="Do not serve .jxl without a fallback">
                A <code>.jxl</code> file served without a <code>&lt;picture&gt;</code> fallback will fail silently for the majority of visitors. Until Chrome enables JPEG XL by default in a stable release, always pair it with an AVIF or WebP fallback.
            </InfoBox>
        </section>

        <section id="what-this-means" class="scroll-mt-24">
            <SectionHeading>What this means for web delivery</SectionHeading>
            <p class="mb-4">For production websites, nothing changes yet. Serving a <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">.jxl</code> file without a <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">&lt;picture&gt;</code> fallback will fail silently for the majority of visitors. E-commerce teams should treat JPEG XL as experimental, not a deployment target.</p>
            <p class="mb-4">AVIF remains the best choice for maximum compression on public sites. WebP covers broader compatibility. JPEG encoded with Jpegli handles legacy browsers and email clients.</p>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-6">
                <table class="w-full text-left bg-white">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Format</th>
                            <th class="p-4 font-black">Global support (early 2026)</th>
                            <th class="p-4 font-black">Recommended for production?</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">AVIF</td><td class="p-4">~93%</td><td class="p-4">Yes — best compression with broad support</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">WebP</td><td class="p-4">~97%</td><td class="p-4">Yes — widest compatibility</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Jpegli (JPEG)</td><td class="p-4">Universal</td><td class="p-4">Yes — best fallback for legacy browsers</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">JPEG XL</td><td class="p-4">~12–17%</td><td class="p-4">Not yet — flag-gated in Chrome and Firefox</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="the-2026-recommendation" class="scroll-mt-24">
            <SectionHeading>The 2026 recommendation</SectionHeading>
            <p class="mb-4">Use JPEG XL in controlled workflows — archiving, internal tools, or future-proofing your image library. For any public-facing web delivery, stick with AVIF or WebP and keep a JPEG fallback. Revisit JPEG XL for production use in late 2026 if Chrome ships it enabled by default in a stable release.</p>

            <InfoBox type="tip" title="Watch the Chrome release notes">
                The Chrome release notes at <code>developer.chrome.com/release-notes</code> are the authoritative source. When JPEG XL ships without a flag, the feature will be listed under "New in Chrome" without a <code>chrome://flags</code> reference.
            </InfoBox>

            <p class="mb-4">Mochify compresses and converts images to AVIF, WebP, and JPEG with privacy-first, zero-retention processing — no files stored, no data retained. Try it free at <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a>.</p>
        </section>

        <RelatedGuides guides={related} />

    </div>
</article>
