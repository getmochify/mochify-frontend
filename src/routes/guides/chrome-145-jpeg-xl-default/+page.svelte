<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Does Chrome 145 Enable JPEG XL by Default in 2026?",
        description: "Chrome 145 shipped JPEG XL behind a flag. Chrome 155, released October 6, 2026, turned it on by default. What that changes for serving JXL on the web.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "April 10, 2026",
        lastUpdated: "October 7, 2026"
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
        },
        {
            title: "Converting Images to JPEG XL: The Practical Guide for 2026",
            href: "/guides/converting-images-to-jpeg-xl",
            desc: "Every conversion path to JXL, the October 2026 browser picture, and how to serve it with picture fallbacks."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Chrome 145 JPEG XL: Flag Only. Chrome 155 Is On | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/chrome-145-jpeg-xl-default" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["Article", "WebPage"],
        "headline": "Does Chrome 145 Enable JPEG XL by Default in 2026?",
        "description": "Chrome 145 shipped JPEG XL behind a flag. Chrome 155, released October 6, 2026, turned it on by default. What that changes for serving JXL on the web.",
        "url": "https://mochify.app/guides/chrome-145-jpeg-xl-default",
        "inLanguage": "en",
        "datePublished": "2026-04-10",
        "dateModified": "2026-10-07",
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
                {metadata.readTime} · {metadata.date}{metadata.lastUpdated ? ` · Updated ${metadata.lastUpdated}` : ''} · Mochify Engineering Team
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Does Chrome 145 Enable JPEG XL by Default in 2026?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            No. Chrome 145 includes JPEG XL decoding support, but it is off by default and gated behind a browser flag, and that stayed true through Chrome 154. The version that turned it on is Chrome 155, released on October 6, 2026: it decodes <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">.jxl</code> images by default on every platform Chrome ships on, with no flag. Firefox 158 follows on October 13. A JPEG XL image on a public page still needs an AVIF or WebP fallback while installed browsers catch up, but the format is no longer experimental on the web.
        </p>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-chrome-145-added" class="scroll-mt-24">
            <SectionHeading>What Chrome 145 actually added</SectionHeading>
            <p class="mb-4">Chrome 145, released on February 10, 2026, re-introduced JPEG XL decoding using <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">jxl-rs</code> - a memory-safe, pure Rust decoder that replaces the C++ libjxl implementation Chrome removed in early 2023. In Chrome 145 to 154 the decoder shipped in the stable codebase but stayed behind a flag. Chrome 155, released on October 6, 2026, is the release that enabled it by default; Google's announcement is at developer.chrome.com/blog/jpeg-xl-in-chrome.</p>
            <p class="mb-4">JPEG XL is a next-generation image codec. In plain English: it is a smarter way to compress images, delivering files that Google puts at 30–50% smaller than traditional JPEG at equivalent quality, with lossless compression, lossless recompression of existing JPEGs, progressive decoding, HDR, and animation. Against AVIF the result depends on the image and the quality level, which is why Google's own advice is to try both.</p>
        </section>

        <section id="flag-only-not-default" class="scroll-mt-24">
            <SectionHeading>Flag-only, not default</SectionHeading>
            <p class="mb-4">To use JPEG XL in Chrome 145 to 154, a user must navigate to <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">chrome://flags/#enable-jxl-image-format</code> and toggle the feature on manually, and no ordinary user does that. From Chrome 155 there is nothing to toggle. The caveat is rollout: Chrome updates in the background over days to weeks, enterprise fleets pin versions, and Edge, Samsung Internet and the other Chromium browsers ship on their own schedules. On October 7, the day after the release, caniuse still measured global JPEG XL support at about 17%, almost all of it Safari; that number climbs through October and November as Chrome 155 and Firefox 158 reach installed browsers.</p>
            <p class="mb-4">Google has set explicit conditions for enabling the feature by default: a long-term maintenance commitment and meeting standard Chrome launch criteria. Neither has been publicly confirmed as met.</p>

            <p class="mb-4">Because most users cannot render one, a <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">.jxl</code> that lands in your downloads folder is usually a dead end until you convert it. Our explainer covers <a href="/guides/what-is-a-jxl-file">what a JXL file is and how to open one</a> on Windows, macOS, and the web.</p>

            <InfoBox type="warning" title="Do not serve .jxl without a fallback">
                A <code>.jxl</code> file served without a <code>&lt;picture&gt;</code> fallback will fail silently for the majority of visitors. Until Chrome enables JPEG XL by default in a stable release, always pair it with an AVIF or WebP fallback.
            </InfoBox>
        </section>

        <section id="what-this-means" class="scroll-mt-24">
            <SectionHeading>What this means for web delivery</SectionHeading>
            <p class="mb-4">For production websites, one thing changes: JPEG XL is now a safe first source in a <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;picture&gt;</code> element, with AVIF, WebP and a JPEG <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> below it. Serving a <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">.jxl</code> file on its own still fails silently for everyone on an older Chrome, on Edge, or in an email client, so the fallback stays. E-commerce teams on Shopify are unaffected either way, because Shopify does not accept JXL uploads.</p>
            <p class="mb-4">AVIF remains the best choice for maximum compression on public sites. WebP covers broader compatibility. JPEG encoded with Jpegli handles legacy browsers and email clients.</p>

            <ScrollableTable class="mb-6">
                <table class="w-full text-left bg-white">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Format</th>
                            <th class="p-4 font-black">Global support (October 2026)</th>
                            <th class="p-4 font-black">Recommended for production?</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">AVIF</td><td class="p-4">~93%</td><td class="p-4">Yes - best compression with broad support</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">WebP</td><td class="p-4">~97%</td><td class="p-4">Yes - widest compatibility</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Jpegli (JPEG)</td><td class="p-4">Universal</td><td class="p-4">Yes - best fallback for legacy browsers</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">JPEG XL</td><td class="p-4">~17% on Oct 7, rising as Chrome 155 and Firefox 158 roll out</td><td class="p-4">Yes, as the first source in a picture element with AVIF and WebP fallbacks</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <section id="the-2026-recommendation" class="scroll-mt-24">
            <SectionHeading>The 2026 recommendation</SectionHeading>
            <p class="mb-4">Use JPEG XL where it is strongest: lossless masters, archives of existing JPEGs (the reversible transcode saves about 20% with a byte-exact undo), and high-fidelity photography. For public web delivery, put JXL first in a picture element and keep AVIF, WebP and a JPEG fallback beneath it for the months it takes installed browsers to catch up. When you are ready to start, see <a href="https://mochify.app/guides/converting-images-to-jpeg-xl">converting images to JPEG XL: the practical guide</a>.</p>

            <p class="mb-4">For the dated per-browser table (Chrome, Edge, Firefox, Safari, Android), the rollout caveats and what to do by stack, read our guide to <a href="https://mochify.app/guides/jpeg-xl-chrome-support">JPEG XL in Chrome: what changes for your images now</a>.</p>

            <InfoBox type="tip" title="Watch the Chrome release notes">
                The Chrome release notes at <code>developer.chrome.com/release-notes</code> are the authoritative source. That is what happened in Chrome 155: the release notes list "JPEG XL decoding support (image/jxl) in blink" with no <code>chrome://flags</code> reference, and Google's blog post explains the Rust decoder and the security reasoning behind it.
            </InfoBox>

            <p class="mb-4">Mochify compresses and converts images to AVIF, WebP, and JPEG with privacy-first, zero-retention processing - no files stored, no data retained. Try it free at <a href="https://mochify.app">mochify.app</a>.</p>

            <p class="mb-4">Off the web, the calculation changes: for screenshots you keep rather than serve, <a href="/guides/jxl-vs-png-for-screenshots">lossless JXL is already the better archive format</a>.</p>
        </section>

        <RelatedGuides guides={related} />

    </div>
</article>
