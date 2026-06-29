<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const metadata = {
        title: "Does Converting HIF to JPG Reduce Quality?",
        description: "Converting HIF to JPG rarely reduces visible quality. The real exception is Canon HDR PQ, where the HDR-to-SDR tone-map changes the look more than bit depth.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "June 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const related = [
        { href: '/guides/hif-to-jpg-canon-sony-fujifilm', title: 'HIF to JPG for Canon, Sony, and Fujifilm', desc: 'The full conversion workflow and settings for professional cameras.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide 2026: Quality-Per-Byte', desc: 'How the encoder protects detail and avoids gradient banding.' },
        { href: '/heic-to-jpeg', title: 'HEIC to JPEG', desc: 'The separate route for Apple and iPhone .HEIC photos.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/does-hif-to-jpg-lose-quality" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/does-hif-to-jpg-lose-quality" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Does Converting HIF to JPG Reduce Quality?",
        "description": "Converting HIF to JPG rarely reduces visible quality. The real exception is Canon HDR PQ, where the HDR-to-SDR tone-map changes the look more than bit depth.",
        "url": "https://mochify.app/guides/does-hif-to-jpg-lose-quality",
        "datePublished": "2026-06-05",
        "dateModified": "2026-06-05",
        "inLanguage": "en-GB",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "about": [
            { "@type": "Thing", "name": "HIF file format" },
            { "@type": "Thing", "name": "HEIF" },
            { "@type": "Thing", "name": "JPEG" },
            { "@type": "Thing", "name": "Image conversion" },
            { "@type": "Thing", "name": "Colour bit depth" }
        ],
        "keywords": "does hif lose quality, hif to jpg quality, hif vs jpeg, convert hif to jpg, 10-bit to 8-bit, canon hdr pq, jpegli"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Does Converting HIF to JPG Reduce Quality?", "item": "https://mochify.app/guides/does-hif-to-jpg-lose-quality" }
        ]
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
            Does Converting HIF to JPG Reduce Quality?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Converting HIF to JPG does not visibly reduce quality for most photographs. A .HIF file stores 10-bit colour (about 1.07 billion possible values) and a standard JPG stores 8-bit (16.7 million), so the precision drop is real on paper. In practice it stays invisible for typical photographic content. The one case that genuinely changes how an image looks is not the bit-depth drop at all: it is converting a Canon HDR PQ file to a standard JPG without a tone-map.
        </p>

        <p class="text-sm text-[#875F42]">Published {metadata.date} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong>. Covers post-conversion quality for professional HIF/HEIF files from Canon, Sony, and Fujifilm cameras, not the separate iPhone .HEIC path.</p>
    </header>

    <!-- TOC -->
    <nav class="bg-[#FFF5F7] border border-pink-100 rounded-3xl p-8 mb-12" aria-label="What's in this guide">
        <h2 class="font-black text-[#4A2C2C] text-base mb-5 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-[#F06292] rounded-full shrink-0"></span>
            What's in This Guide
        </h2>
        <ol class="space-y-3">
            {#each [
                { n: '01', id: 'when-quality-drop-shows', label: 'When the quality drop actually shows' },
                { n: '02', id: 'canon-hdr-pq', label: 'The real exception: Canon HDR PQ' },
                { n: '03', id: 'keep-conversions-clean', label: 'How to keep conversions clean' },
            ] as item}
                <li class="flex items-center gap-4">
                    <span class="w-8 h-8 shrink-0 bg-[#FFF0F5] border border-pink-100 rounded-full flex items-center justify-center font-black text-[#F06292] text-xs">{item.n}</span>
                    <a href="#{item.id}" class="text-[#6C3F31] font-semibold text-sm hover:text-[#F06292] transition-colors">{item.label}</a>
                </li>
            {/each}
        </ol>
    </nav>

    <div class="space-y-12 text-lg text-[#6C3F31] leading-relaxed">

        <section id="when-quality-drop-shows" class="scroll-mt-24">
            <SectionHeading>When the quality drop actually shows</SectionHeading>
            <p class="mb-4">The 8-bit limit only becomes visible in smooth, low-contrast gradients: clear skies, skin in soft light, deep shadow roll-offs. Sony cites the sky gradient as the canonical reason HEIF records in 10-bit. In high-detail scenes (foliage, fabric, street textures) JPG compression masks the smaller tonal steps, and a well-encoded 8-bit file is effectively indistinguishable from the 10-bit source. Whether banding appears is content-dependent, so judge it per image rather than by rule.</p>
            <p class="mb-4">This holds across the pro-camera HIF/HEIF world: Canon, Sony, and Fujifilm all write HIF on the same 10-bit basis.</p>

            <InfoBox type="tip" title="HIF is not HEIC">
                .HEIC is the same HEIF format underneath but is Apple's iPhone variant. If you are converting iPhone photos, use the <a href="/heic-to-jpeg">HEIC to JPEG</a> route instead.
            </InfoBox>
        </section>

        <section id="canon-hdr-pq" class="scroll-mt-24">
            <SectionHeading>The real exception: Canon HDR PQ</SectionHeading>
            <p class="mb-4">If a conversion "looks wrong," bit depth is usually not the cause. Canon cameras can record .HIF in HDR PQ, and exporting that straight to a standard SDR JPG without a tone-map leaves the image flat, washed out, or clipped. That happens because the HDR luminance encoding is misread by an SDR pipeline, not because of the move to 8-bit.</p>
            <p>Apply a proper HDR-to-SDR tone-map first (for example, Lightroom Classic's SDR Rendition export) and the result looks correct. This visual change is far larger and more obvious than the 10-bit to 8-bit precision drop.</p>
        </section>

        <section id="keep-conversions-clean" class="scroll-mt-24">
            <SectionHeading>How to keep conversions clean</SectionHeading>
            <p class="mb-4">The encoder matters more than the format. A JPG quality of 85–90 is the well-established sweet spot for photographic conversion: perceptually lossless to most eyes, while keeping files much smaller than quality 95–100. Modern encoders go further. <a href="https://opensource.googleblog.com/2024/04/introducing-jpegli-new-jpeg-coding-library.html" target="_blank" rel="noopener noreferrer">Google's jpegli</a> was built to fix exactly the banding problem, encoding with 10+ bits of internal precision inside a standard 8-bit-compatible JPG, and it compresses high-quality images about 35% more than traditional JPEG codecs.</p>
            <p>Mochify encodes every JPG with jpegli, so gradient-heavy shots survive conversion better than a basic exporter manages. Because the interface is natural language, you can describe the job in plain English — for example: <code class={inlineCode}>convert these HIF photos to JPG at quality 90</code>. Your files stream into the encoder in memory on Mochify's API, are processed, and are wiped immediately with no retention.</p>
        </section>

        <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-8">
            <p class="text-[#6C3F31] leading-relaxed mb-5">Convert your Canon, Sony, or Fujifilm HIF files without the banding risk. Just tell Mochify what you want — for example <em>"convert these HIF photos to JPG at quality 90"</em> — and jpegli handles the rest.</p>
            <a href="/solutions/hif-to-jpg" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Convert HIF to JPG free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </aside>

        <RelatedGuides guides={related} />

    </div>
</article>
