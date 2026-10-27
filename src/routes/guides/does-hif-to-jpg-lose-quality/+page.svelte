<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Does Converting HIF to JPG Reduce Quality?",
        description: "Converting HIF to JPG rarely reduces visible quality. The exception is Canon HDR PQ, where the HDR-to-SDR tone-map changes the look more than bit depth.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "June 5, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const related = [
        { href: '/guides/hif-to-jpg-canon-sony-fujifilm', title: 'HIF to JPG for Canon, Sony, and Fujifilm', desc: 'The full conversion workflow and settings for professional cameras.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli vs MozJPEG: Which JPEG Encoder to Use in 2026', desc: 'How the encoder protects detail and avoids gradient banding.' },
        { href: '/heic-to-jpeg', title: 'HEIC to JPEG', desc: 'The separate route for Apple and iPhone .HEIC photos.' },
    ];

    const toc = [
        { id: 'when-quality-drop-shows', label: 'When the quality drop actually shows' },
        { id: 'canon-hdr-pq', label: 'The real exception: Canon HDR PQ' },
        { id: 'keep-conversions-clean', label: 'How to keep conversions clean' }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:type" content="article" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/does-hif-to-jpg-lose-quality" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Does Converting HIF to JPG Reduce Quality?",
        "description": "Converting HIF to JPG rarely reduces visible quality. The exception is Canon HDR PQ, where the HDR-to-SDR tone-map changes the look more than bit depth.",
        "url": "https://mochify.app/guides/does-hif-to-jpg-lose-quality",
        "image": "https://mochify.app/og/guides-does-hif-to-jpg-lose-quality.png",
        "datePublished": "2026-06-05T12:00:00+00:00",
        "dateModified": "2026-06-05T12:00:00+00:00",
        "inLanguage": "en",
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
            { "@type": "Thing", "name": "Color bit depth" }
        ],
        "keywords": "does hif lose quality, hif to jpg quality, hif vs jpeg, convert hif to jpg, 10-bit to 8-bit, canon hdr pq, jpegli"
        }
    </script>

    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/does-hif-to-jpg-lose-quality"
        description={metadata.description}
        datePublished="2026-06-05"
        dateModified="2026-06-05"
    />
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
			<AccentTitle title={metadata.title} accent="Reduce Quality" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Converting HIF to JPG does not visibly reduce quality for most photographs. A .HIF file stores 10-bit color (about 1.07 billion possible values) and a standard JPG stores 8-bit (16.7 million), so the precision drop is real on paper. In practice it stays invisible for typical photographic content. The one case that genuinely changes how an image looks is not the bit-depth drop at all: it is converting a Canon HDR PQ file to a standard JPG without a tone-map.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">Published {metadata.date} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong>. Covers post-conversion quality for professional HIF/HEIF files from Canon, Sony, and Fujifilm cameras, not the separate iPhone .HEIC path.</p>
        </div>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc} heading="What's in This Guide" />
        </section>

        <section id="when-quality-drop-shows" class="scroll-mt-24">
            <SectionHeading>When the quality drop actually shows</SectionHeading>
            <p class="mb-4">The 8-bit limit only becomes visible in smooth, low-contrast gradients: clear skies, skin in soft light, deep shadow roll-offs. Sony cites the sky gradient as the canonical reason HEIF records in 10-bit. In high-detail scenes (foliage, fabric, street textures) JPG compression masks the smaller tonal steps, and a well-encoded 8-bit file is effectively indistinguishable from the 10-bit source. Whether banding appears is content-dependent, so judge it per image rather than by rule.</p>
            <p class="mb-4">This holds across the pro-camera HIF/HEIF world: Canon, Sony, and Fujifilm all write HIF on the same 10-bit basis.</p>

            <GlassInfoBox type="tip" title="HIF is not HEIC">
                .HEIC is the same HEIF format underneath but is Apple's iPhone variant. If you are converting iPhone photos, use the <a href="/heic-to-jpeg">HEIC to JPEG</a> route instead.
            </GlassInfoBox>
        </section>

        <section id="canon-hdr-pq" class="scroll-mt-24">
            <SectionHeading>The real exception: Canon HDR PQ</SectionHeading>
            <p class="mb-4">If a conversion "looks wrong," bit depth is usually not the cause. Canon cameras can record .HIF in HDR PQ, and exporting that straight to a standard SDR JPG without a tone-map leaves the image flat, washed out, or clipped. That happens because the HDR luminance encoding is misread by an SDR pipeline, not because of the move to 8-bit.</p>
            <p>Apply a proper HDR-to-SDR tone-map first (for example, Lightroom Classic's SDR Rendition export) and the result looks correct. This visual change is far larger and more obvious than the 10-bit to 8-bit precision drop.</p>
        </section>

        <section id="keep-conversions-clean" class="scroll-mt-24">
            <SectionHeading>How to keep conversions clean</SectionHeading>
            <p class="mb-4">The encoder matters more than the format. A JPG quality of 85–90 is the well-established sweet spot for photographic conversion: perceptually lossless to most eyes, while keeping files much smaller than quality 95–100. Modern encoders go further. <a href="https://opensource.googleblog.com/2024/04/introducing-jpegli-new-jpeg-coding-library.html" target="_blank" rel="noopener noreferrer">Google's jpegli</a> was built to fix exactly the banding problem, encoding with 10+ bits of internal precision inside a standard 8-bit-compatible JPG, and it compresses high-quality images about 35% more than traditional JPEG codecs.</p>
            <p>Mochify encodes every JPG with jpegli, so gradient-heavy shots survive conversion better than a basic exporter manages. Because the interface is natural language, you can describe the job in plain English - for example: <code class={inlineCode}>convert these HIF photos to JPG at quality 90</code>. Your files stream into the encoder in memory on Mochify's API, are processed, and are wiped immediately with no retention.</p>
        </section>

        <GlassCTA href="/solutions/hif-to-jpg" label="Convert HIF to JPG free">
            Convert your Canon, Sony, or Fujifilm HIF files without the banding risk. Just tell Mochify what you want - for example <em>"convert these HIF photos to JPG at quality 90"</em> - and jpegli handles the rest.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
