<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?",
        seoTitle: "Does HEIF/HEIC Work With Pixieset and SmugMug Galleries?",
        description: "HEIF and HEIC files don't work reliably with most client gallery platforms. Here's what actually happens on upload, and how to keep control of your output.",
        category: "Quick Guide",
        readTime: "3 min read",
        date: "April 26, 2026",
        lastUpdated: "September 22, 2026"
    };

    const related = [
                    { href: '/guides/heif-to-jpeg-workflow-photographers-guide', title: 'HIF/HEIF to JPEG for Professional Photographers', desc: 'Privacy-first workflow blueprints for converting camera HEIF files to JPEG for professional delivery.' },
                    { href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera', title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?', desc: 'When to use each format at capture time, and how to convert for delivery.' },
                    { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'A complete breakdown of metadata types, privacy risks, and how to strip selectively.' },
                    { href: '/guides/should-i-optimize-images-before-upload', title: 'Should I Optimize Images Before I Upload Them?', desc: 'A practical guide covering LCP, EXIF privacy, format choice, and workflows for galleries and marketplaces.' },
                    { href: '/guides/heic-to-jpeg-or-webp-wordpress', title: 'Should I convert HEIC to JPEG or WebP for WordPress uploads?', desc: 'Converting HEIC for WordPress uploads: which target format to pick when a platform will not take HEIC.' },
                ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?",
        "description": "HEIF and HEIC files don't work reliably with most client gallery platforms. Here's what actually happens on upload, and how to keep control of your output.",
        "url": "https://mochify.app/guides/does-heif-heic-work-with-client-galleries",
        "image": "https://mochify.app/og/guides-does-heif-heic-work-with-client-galleries.png",
        "datePublished": "2026-04-26T12:00:00+00:00",
        "dateModified": "2026-09-22T12:00:00+00:00",
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
            { "@type": "Thing", "name": "HEIF" },
            { "@type": "Thing", "name": "HEIC" },
            { "@type": "Thing", "name": "Client gallery platforms" },
            { "@type": "Thing", "name": "Pixieset" },
            { "@type": "Thing", "name": "SmugMug" },
            { "@type": "Thing", "name": "Image conversion" },
            { "@type": "Thing", "name": "JPEG" }
        ],
        "keywords": "HEIF client gallery, HEIC Pixieset, HEIC SmugMug, upload HEIF gallery, convert HEIC to JPEG, client gallery image formats"
        }
    </script>

    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/does-heif-heic-work-with-client-galleries"
        description={metadata.description}
        datePublished="2026-04-26"
        dateModified="2026-09-22"
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
			<AccentTitle title={metadata.title} accent="Client Gallery Platforms" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            HEIF and HEIC files do not work reliably with most client gallery platforms in 2026. Some platforms accept HEIC uploads but immediately convert them to JPEG on ingest - discarding the original and applying their own compression settings without your input. Others reject HEIF outright. In either case, you lose control over output quality, color profile, and dimensions unless you pre-convert before uploading.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                This guide covers how major gallery platforms handle HEIF on ingest, and how to pre-convert as a deliberate step so you stay in control of quality and metadata.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="what-happens-uploading-heif" class="scroll-mt-24">
            <SectionHeading>What Actually Happens When You Upload HEIF to a Gallery</SectionHeading>
            <p>SmugMug accepts HEIC/HEIF as an upload format but converts it to JPEG during ingest and retains only the JPEG. The conversion is silent - there is no warning that your original file has been replaced, and you have no control over the JPEG quality setting or output dimensions the platform applies.</p>
            <p>Pixieset and similar platforms expect JPEG as the primary upload format, and their previewing, downloading, and print-ordering pipelines are built around JPEG delivery.</p>
            <p>Platforms running older open-source gallery software - such as Piwigo or some self-hosted WordPress gallery themes - often lack HEIF codec support entirely. Uploads are treated as unrecognized file types or generic attachments rather than images, which breaks thumbnail generation and gallery display.</p>
            <p>When no preview is generated, the browser side of the question matters too, because the raw file is what your client ends up looking at: <a href="https://mochify.app/guides/can-safari-open-heic-images">which browsers can display HEIC</a> comes down to Safari 17 and later, and nothing else.</p>
        </section>

        <section id="why-pre-converting" class="scroll-mt-24">
            <SectionHeading>Why Pre-Converting Is the Right Approach</SectionHeading>
            <p>Pre-converting your HEIF or HIF files to JPEG before upload gives you direct control over three things the platform cannot decide for you:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Output quality</strong> - set a specific quality level that matches your visual standard, not the platform's default.</li>
                <li><strong class="text-[#4A2C2C]">Color profile</strong> - convert to sRGB explicitly so gallery previews and client downloads display correctly on all screens.</li>
                <li><strong class="text-[#4A2C2C]">Long-edge dimension</strong> - set a consistent target (for example, 3,600 px for Pixieset proofs) across an entire batch, rather than letting each platform apply its own resizing logic.</li>
            </ul>
            <p>With Mochify, you can describe this entire conversion in one plain-English prompt using Magic Flow:</p>

            <GlassInfoBox type="tip" title="Magic Flow example">
                <em>"Batch convert my Canon HIF files to sRGB JPEG for Pixieset, 3,600 px long edge, under 2 MB each, strip all EXIF."</em>
            </GlassInfoBox>

            <p>Magic Flow interprets the intent, applies the right resize, encodes via jpegli - Google's modern JPEG encoder, which produces files roughly 25–30% smaller than traditional encoders at equivalent quality - strips all metadata, and returns a gallery-ready ZIP. Files are processed entirely in memory and discarded immediately after your download completes.</p>
            <p>If a platform will not accept HEIC at all rather than just re-compressing it, converting to a universally accepted format solves the same problem. If you host galleries on WordPress, see the format decision for <a href="https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress">converting HEIC for WordPress uploads</a>. For iPhone photo sets specifically, you can also <a href="https://mochify.app/guides/heic-to-pdf-iphone-photos">bundle iPhone HEIC photos into a single PDF</a> for delivery instead of a gallery link.</p>
        </section>

        <section id="exif-client-privacy" class="scroll-mt-24">
            <SectionHeading>A Note on EXIF and Client Privacy</SectionHeading>
            <p>When a gallery platform performs its own HEIF-to-JPEG conversion on ingest, it often preserves EXIF metadata from the original file - including GPS coordinates, timestamps, and embedded thumbnails. Pre-converting with explicit EXIF stripping ensures your clients' location data and session timing are not embedded in the files sitting in an online gallery.</p>

            <GlassInfoBox type="note" title="Zero retention">
                Mochify processes files entirely in memory. Files are wiped immediately after your download completes - no copies are stored on Mochify servers.
            </GlassInfoBox>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Pre-convert HEIF to gallery-ready JPEG free"
            href="/"
            label="Try it free at mochify.app →"
        >
            Just describe what you need - Magic Flow handles the rest. No account needed for your first 3 files.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
