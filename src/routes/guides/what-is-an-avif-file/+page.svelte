<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "What Is an AVIF File? (And How to Open One)",
        description: "An AVIF file is an image in the AV1 Image File Format, up to 50% smaller than JPEG. Here's how to open it on Windows and Mac, or convert it to JPG.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "July 14, 2026",
        lastUpdated: "September 22, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const faqs = [
        {
            q: "Why did my downloaded image save as .avif instead of .jpg?",
            a: "The site served AVIF because your browser accepts it and the file is smaller. WordPress 6.5 and later serve AVIF out of the box, and most image CDNs deliver it automatically to any browser that supports it. So right-click-save gives you the format the server sent, not the JPG you expected."
        },
        {
            q: "Can every browser open an AVIF file?",
            a: "Effectively yes. Chrome, Firefox, Safari, and Edge all render AVIF natively, and 93.42% of global browser traffic supports it as of May 2026 per caniuse.com. The gap is outside the browser: plenty of desktop apps and upload forms still cannot read it."
        },
        {
            q: "How do I open an AVIF file on Windows?",
            a: "Install the free AV1 Video Extension from the Microsoft Store. Once it is in place, Photos, Paint, and File Explorer thumbnails all start handling .avif files. Before that, dragging the file into any modern browser tab is the quickest way to view it."
        },
        {
            q: "How do I open an AVIF file on a Mac?",
            a: "On macOS Ventura (macOS 13) and later, Preview and Quick Look open AVIF natively, so you can select the file and press spacebar to preview it. Older macOS versions have no built-in support, so open it in a browser or convert it to JPG."
        },
        {
            q: "Is AVIF better than JPEG?",
            a: "For the web, largely yes: AVIF files can be up to 50% smaller than equivalent JPEGs at the same visual quality, and the format also supports 10-bit color, HDR, transparency, and animation. JPEG's advantage is universal compatibility, which is why converting to JPG is still the safe choice when an app or workflow rejects AVIF."
        },
        {
            q: "How do I convert an AVIF file to JPG?",
            a: "Drop the file on Mochify's AVIF to JPG converter and describe what you want in plain English, for example \"convert to JPG and strip all metadata\". No signup is needed for up to 3 images a month, and your file is processed in memory and wiped immediately after conversion."
        }
    ];

    const related = [
        { href: '/guides/avif-to-jpg', title: 'AVIF to JPG: How to Convert AVIF Files on Any Device', desc: 'Every conversion route, on Windows, Mac, and the command line.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL', desc: 'Where AVIF fits and when to use it on your own site.' },
        { href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl', title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?', desc: 'The quick format decision for web publishing.' },
        { href: '/guides/optimizing-hero-images', title: 'Optimizing Hero Images for Web Performance', desc: 'Putting formats like AVIF to work for faster pages.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>What Is an AVIF File? | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:type" content="article" />
    <meta property="og:title" content="What Is an AVIF File? (And How to Open One)" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/what-is-an-avif-file" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "What Is an AVIF File? (And How to Open One)",
        "description": "An AVIF file is an image in the AV1 Image File Format, up to 50% smaller than JPEG. Here's how to open it on Windows and Mac, or convert it to JPG.",
        "url": "https://mochify.app/guides/what-is-an-avif-file",
        "datePublished": "2026-07-14",
        "dateModified": "2026-09-22",
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
            { "@type": "Thing", "name": "AVIF" },
            { "@type": "Thing", "name": "AV1 Image File Format" },
            { "@type": "Thing", "name": "Image formats" },
            { "@type": "Thing", "name": "Browser support" }
        ],
        "keywords": "AVIF file, AV1 Image File Format, open AVIF file, convert AVIF to JPG, AVIF vs JPEG"
        }
    </script>


    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Why did my downloaded image save as .avif instead of .jpg?", "acceptedAnswer": { "@type": "Answer", "text": "The site served AVIF because your browser accepts it and the file is smaller. WordPress 6.5 and later serve AVIF out of the box, and most image CDNs deliver it automatically to any browser that supports it. So right-click-save gives you the format the server sent, not the JPG you expected." } },
            { "@type": "Question", "name": "Can every browser open an AVIF file?", "acceptedAnswer": { "@type": "Answer", "text": "Effectively yes. Chrome, Firefox, Safari, and Edge all render AVIF natively, and 93.42% of global browser traffic supports it as of May 2026 per caniuse.com. The gap is outside the browser: plenty of desktop apps and upload forms still cannot read it." } },
            { "@type": "Question", "name": "How do I open an AVIF file on Windows?", "acceptedAnswer": { "@type": "Answer", "text": "Install the free AV1 Video Extension from the Microsoft Store. Once it is in place, Photos, Paint, and File Explorer thumbnails all start handling .avif files. Before that, dragging the file into any modern browser tab is the quickest way to view it." } },
            { "@type": "Question", "name": "How do I open an AVIF file on a Mac?", "acceptedAnswer": { "@type": "Answer", "text": "On macOS Ventura (macOS 13) and later, Preview and Quick Look open AVIF natively, so you can select the file and press spacebar to preview it. Older macOS versions have no built-in support, so open it in a browser or convert it to JPG." } },
            { "@type": "Question", "name": "Is AVIF better than JPEG?", "acceptedAnswer": { "@type": "Answer", "text": "For the web, largely yes: AVIF files can be up to 50% smaller than equivalent JPEGs at the same visual quality, and the format also supports 10-bit color, HDR, transparency, and animation. JPEG's advantage is universal compatibility, which is why converting to JPG is still the safe choice when an app or workflow rejects AVIF." } },
            { "@type": "Question", "name": "How do I convert an AVIF file to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Drop the file on Mochify's AVIF to JPG converter and describe what you want in plain English, for example \"convert to JPG and strip all metadata\". No signup is needed for up to 3 images a month, and your file is processed in memory and wiped immediately after conversion." } }
        ]
        }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/what-is-an-avif-file"
        description={metadata.description}
        datePublished="2026-07-14"
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
			<AccentTitle title={metadata.title} accent="AVIF File" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.lastUpdated ? 'Published ' : ''}{metadata.date}{metadata.lastUpdated ? ` · Updated ${metadata.lastUpdated}` : ''}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            An AVIF file is an image saved in the AV1 Image File Format, a modern format that stores pictures using the open-source AV1 video codec. Websites use it because AVIF files can be up to 50% smaller than equivalent JPEGs at the same visual quality, which makes pages load faster. Every modern browser opens AVIF - 93.42% of global browser traffic supports it as of May 2026, per <a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">caniuse.com</a> - but plenty of desktop apps still do not, which is why the file that saved from a website refuses to open on your computer.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published July 14, 2026 by the Mochify Engineering Team.</strong>
                Part of Mochify's Quick Guides series, answering fast, practical questions about the image formats reshaping how the modern web loads pictures.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="why-you-keep-running-into-avif-files" class="scroll-mt-24">
            <SectionHeading>Why You Keep Running Into AVIF Files</SectionHeading>
            <p>Websites switched to AVIF for speed, and the switch mostly happened without anyone telling you. WordPress 6.5 and later accepts AVIF uploads out of the box and can convert images to AVIF automatically, and image CDNs quietly serve AVIF to any browser that accepts it. So when you right-click and save an image, you often get an <code class={inlineCode}>.avif</code> file - the format the site served, not the JPG you expected.</p>
            <p>The format itself is genuinely good: alongside the smaller file sizes, AVIF supports 10-bit color, HDR, transparency, and even animation. If a transparent AVIF ever comes back on a black background, here is <a href="/guides/webp-avif-transparency">what flattened the alpha channel and how to fix it</a>. (AVIF stores HDR in the pixels rather than as a gain map over an SDR base, which changes how it falls back on ordinary screens; our guide to <a href="https://mochify.app/guides/why-hdr-photos-look-flat-when-shared">HDR photos that look flat when shared</a> covers the difference.) The catch is that support outside the browser lags behind.</p>
        </section>

        <section id="how-to-open-an-avif-file" class="scroll-mt-24">
            <SectionHeading>How to Open an AVIF File</SectionHeading>
            <p>The quickest way to view one is to drag it into any modern browser tab - Chrome, Firefox, Safari, and Edge all render AVIF natively. Beyond that, it depends on your system:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Windows 10/11:</strong> install the free AV1 Video Extension from the Microsoft Store, and Photos, Paint, and File Explorer thumbnails all start working.</li>
                <li><strong class="text-[#4A2C2C]">macOS:</strong> Preview and Quick Look open AVIF natively on Ventura (macOS 13) and later. Older versions have no built-in support.</li>
                <li><strong class="text-[#4A2C2C]">Everything else:</strong> if an app, upload form, or workflow rejects the file, convert it to JPG - the format that works everywhere.</li>
            </ul>
            <p>Converting takes seconds: drop the file on Mochify's <a href="/avif-to-jpg">AVIF to JPG converter</a> and type what you want in plain English, for example "convert to JPG and strip all metadata". No signup is needed for up to 3 images a month, and your file is processed in memory and wiped immediately after conversion.</p>

            <GlassInfoBox type="tip" title="AVIF is not the same as WebP or JPEG XL">
                AVIF, WebP, and JPEG XL are all next-gen formats that beat JPEG on size. If you are deciding which to serve on your own site rather than just trying to open a file, see <a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl">What Should I Use in 2026: WebP, AVIF, or JPEG XL?</a> Selling on a hosted storefront narrows the question further, because the platform may already be converting for you: see <a href="/guides/should-my-product-images-be-avif-or-webp-in-2026">whether your product images should be AVIF or WebP</a>.
            </GlassInfoBox>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Got an AVIF file that will not open where you need it to?"
            href="/avif-to-jpg"
            label="Try AVIF to JPG free →"
        >
            Drop it into Mochify and just describe what you want, like <em>"convert to JPG and strip all metadata"</em> - no signup needed for up to 3 images a month.
        </GlassCTA>

        <GlassFAQs items={faqs} jsonLd={false} />

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
