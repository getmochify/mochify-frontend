<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "What Is an AVIF File? (And How to Open One)",
        description: "An AVIF file is an image in the AV1 Image File Format, up to 50% smaller than JPEG. Here's how to open it on Windows and Mac, or convert it to JPG.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "July 14, 2026"
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
            a: "Drop the file on Mochify's AVIF to JPG converter and describe what you want in plain English, for example \"convert to JPG and strip all metadata\". No signup is needed for up to 3 images per session, and your file is processed in memory and wiped immediately after conversion."
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
    <link rel="canonical" href="https://mochify.app/guides/what-is-an-avif-file" />
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
        "dateModified": "2026-07-14",
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
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "What Is an AVIF File? (And How to Open One)", "item": "https://mochify.app/guides/what-is-an-avif-file" }
        ]
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
            { "@type": "Question", "name": "How do I convert an AVIF file to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Drop the file on Mochify's AVIF to JPG converter and describe what you want in plain English, for example \"convert to JPG and strip all metadata\". No signup is needed for up to 3 images per session, and your file is processed in memory and wiped immediately after conversion." } }
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
            What Is an AVIF File? (And How to Open One)
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            An AVIF file is an image saved in the AV1 Image File Format, a modern format that stores pictures using the open-source AV1 video codec. Websites use it because AVIF files can be up to 50% smaller than equivalent JPEGs at the same visual quality, which makes pages load faster. Every modern browser opens AVIF - 93.42% of global browser traffic supports it as of May 2026, per <a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">caniuse.com</a> - but plenty of desktop apps still do not, which is why the file that saved from a website refuses to open on your computer.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 14, 2026 by the Mochify Engineering Team.</strong>
                Part of Mochify's Quick Guides series, answering fast, practical questions about the image formats reshaping how the modern web loads pictures.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="why-you-keep-running-into-avif-files">
            <SectionHeading>Why You Keep Running Into AVIF Files</SectionHeading>
            <p>Websites switched to AVIF for speed, and the switch mostly happened without anyone telling you. WordPress 6.5 and later accepts AVIF uploads out of the box and can convert images to AVIF automatically, and image CDNs quietly serve AVIF to any browser that accepts it. So when you right-click and save an image, you often get an <code class={inlineCode}>.avif</code> file - the format the site served, not the JPG you expected.</p>
            <p>The format itself is genuinely good: alongside the smaller file sizes, AVIF supports 10-bit color, HDR, transparency, and even animation. The catch is that support outside the browser lags behind.</p>
        </section>

        <section id="how-to-open-an-avif-file">
            <SectionHeading>How to Open an AVIF File</SectionHeading>
            <p>The quickest way to view one is to drag it into any modern browser tab - Chrome, Firefox, Safari, and Edge all render AVIF natively. Beyond that, it depends on your system:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Windows 10/11:</strong> install the free AV1 Video Extension from the Microsoft Store, and Photos, Paint, and File Explorer thumbnails all start working.</li>
                <li><strong class="text-[#4A2C2C]">macOS:</strong> Preview and Quick Look open AVIF natively on Ventura (macOS 13) and later. Older versions have no built-in support.</li>
                <li><strong class="text-[#4A2C2C]">Everything else:</strong> if an app, upload form, or workflow rejects the file, convert it to JPG - the format that works everywhere.</li>
            </ul>
            <p>Converting takes seconds: drop the file on Mochify's <a href="/avif-to-jpg">AVIF to JPG converter</a> and type what you want in plain English, for example "convert to JPG and strip all metadata". No signup is needed for up to 3 images per session, and your file is processed in memory and wiped immediately after conversion.</p>

            <InfoBox type="tip" title="AVIF is not the same as WebP or JPEG XL">
                AVIF, WebP, and JPEG XL are all next-gen formats that beat JPEG on size. If you are deciding which to serve on your own site rather than just trying to open a file, see <a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl">What Should I Use in 2026: WebP, AVIF, or JPEG XL?</a>
            </InfoBox>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Got an AVIF file that will not open where you need it to?</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Drop it into Mochify and just describe what you want, like <em>"convert to JPG and strip all metadata"</em> - no signup needed for up to 3 images per session.</p>
            <a href="/avif-to-jpg" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try AVIF to JPG free →
            </a>
        </div>

        <GuideFAQs items={faqs} />

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
