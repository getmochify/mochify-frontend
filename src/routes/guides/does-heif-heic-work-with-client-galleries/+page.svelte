<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?",
        description: "HEIF and HEIC files don't work reliably with most client gallery platforms. Here's what actually happens on upload, and how to keep control of your output.",
        category: "Quick Guide",
        readTime: "3 min read",
        date: "April 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <link rel="canonical" href="https://mochify.app/guides/does-heif-heic-work-with-client-galleries" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?",
        "description": "HEIF and HEIC files don't work reliably with most client gallery platforms. Here's what actually happens on upload, and how to keep control of your output.",
        "url": "https://mochify.app/guides/does-heif-heic-work-with-client-galleries",
        "datePublished": "2026-04-26",
        "dateModified": "2026-04-26",
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

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?", "item": "https://mochify.app/guides/does-heif-heic-work-with-client-galleries" }
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
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            HEIF and HEIC files do not work reliably with most client gallery platforms in 2026. Some platforms accept HEIC uploads but immediately convert them to JPEG on ingest — discarding the original and applying their own compression settings without your input. Others reject HEIF outright. In either case, you lose control over output quality, colour profile, and dimensions unless you pre-convert before uploading.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                This guide covers how major gallery platforms handle HEIF on ingest, and how to pre-convert as a deliberate step so you stay in control of quality and metadata.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-happens-uploading-heif">
            <SectionHeading>What Actually Happens When You Upload HEIF to a Gallery</SectionHeading>
            <p>SmugMug accepts HEIC/HEIF as an upload format but converts it to JPEG during ingest and retains only the JPEG. The conversion is silent — there is no warning that your original file has been replaced, and you have no control over the JPEG quality setting or output dimensions the platform applies.</p>
            <p>Pixieset and similar platforms expect JPEG as the primary upload format, and their previewing, downloading, and print-ordering pipelines are built around JPEG delivery.</p>
            <p>Platforms running older open-source gallery software — such as Piwigo or some self-hosted WordPress gallery themes — often lack HEIF codec support entirely. Uploads are treated as unrecognised file types or generic attachments rather than images, which breaks thumbnail generation and gallery display.</p>
        </section>

        <section id="why-pre-converting">
            <SectionHeading>Why Pre-Converting Is the Right Approach</SectionHeading>
            <p>Pre-converting your HEIF or HIF files to JPEG before upload gives you direct control over three things the platform cannot decide for you:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Output quality</strong> — set a specific quality level that matches your visual standard, not the platform's default.</li>
                <li><strong class="text-[#4A2C2C]">Colour profile</strong> — convert to sRGB explicitly so gallery previews and client downloads display correctly on all screens.</li>
                <li><strong class="text-[#4A2C2C]">Long-edge dimension</strong> — set a consistent target (for example, 3,600 px for Pixieset proofs) across an entire batch, rather than letting each platform apply its own resizing logic.</li>
            </ul>
            <p>With Mochify, you can describe this entire conversion in one plain-English prompt using Magic Flow:</p>

            <InfoBox type="tip" title="Magic Flow example">
                <em>"Batch convert my Canon HIF files to sRGB JPEG for Pixieset, 3,600 px long edge, under 2 MB each, strip all EXIF."</em>
            </InfoBox>

            <p>Magic Flow interprets the intent, applies the right resize, encodes via jpegli — Google's modern JPEG encoder, which produces files roughly 25–30% smaller than traditional encoders at equivalent quality — strips all metadata, and returns a gallery-ready ZIP. Files are processed entirely in memory and discarded immediately after your download completes.</p>
        </section>

        <section id="exif-client-privacy">
            <SectionHeading>A Note on EXIF and Client Privacy</SectionHeading>
            <p>When a gallery platform performs its own HEIF-to-JPEG conversion on ingest, it often preserves EXIF metadata from the original file — including GPS coordinates, timestamps, and embedded thumbnails. Pre-converting with explicit EXIF stripping ensures your clients' location data and session timing are not embedded in the files sitting in an online gallery.</p>

            <InfoBox type="note" title="Zero retention">
                Mochify processes files entirely in memory. Files are wiped immediately after your download completes — no copies are stored on Mochify servers.
            </InfoBox>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3">Pre-convert HEIF to gallery-ready JPEG free</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base">Just describe what you need — Magic Flow handles the rest. No account needed for your first 3 files.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try it free at mochify.app →
            </a>
        </div>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {#each [
                    { href: '/guides/heif-to-jpeg-workflow-photographers-guide', title: 'HIF/HEIF to JPEG for Professional Photographers', desc: 'Privacy-first workflow blueprints for converting camera HEIF files to JPEG for professional delivery.' },
                    { href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera', title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?', desc: 'When to use each format at capture time, and how to convert for delivery.' },
                    { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'A complete breakdown of metadata types, privacy risks, and how to strip selectively.' },
                    { href: '/guides/should-i-optimize-images-before-upload', title: 'Should I Optimise Images Before I Upload Them?', desc: 'A practical guide covering LCP, EXIF privacy, format choice, and workflows for galleries and marketplaces.' },
                ] as guide}
                    <a href={guide.href} class="block bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 no-underline hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <h3 class="text-sm font-black text-[#4A2C2C] mb-1.5 mt-0">{guide.title} →</h3>
                        <p class="text-xs text-[#6C3F31] leading-relaxed m-0">{guide.desc}</p>
                    </a>
                {/each}
            </div>
        </section>

    </div>
</article>
