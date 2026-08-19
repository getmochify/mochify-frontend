<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "How to Open HEIF Files on Windows (or Convert Them to JPG)",
        description: "Windows needs two codec extensions to open HEIF files, and 10-bit camera HIFs often fail anyway. Every fix that works, plus the fast JPG route.",
        category: "Image Formats",
        readTime: "12 min read",
        date: "August 19, 2026"
    };

    const toc = [
        { n: '01', href: '#the-short-answer', label: 'The short answer' },
        { n: '02', href: '#why-windows-cant-open-heif', label: "Why Windows can't open HEIF files" },
        { n: '03', href: '#which-heif', label: 'Which HEIF do you actually have?' },
        { n: '04', href: '#microsoft-store-extensions', label: 'Fix 1: the two Microsoft Store extensions' },
        { n: '05', href: '#viewer-with-own-decoder', label: 'Fix 2: a viewer with its own decoder' },
        { n: '06', href: '#the-10-bit-problem', label: 'The 10-bit problem: pro-camera .HIF files' },
        { n: '07', href: '#mochify-workflow', label: 'The fastest fix: convert to JPG' },
        { n: '08', href: '#cheat-sheet', label: 'Cheat Sheet: symptom to fix' },
        { n: '09', href: '#faq', label: 'FAQ' },
    ];

    const related = [
        { href: '/guides/heif-to-jpg-complete-guide', title: 'HEIF to JPG: The Complete Conversion Guide', desc: 'Every conversion method, from in-camera to vendor software to command line.' },
        { href: '/guides/what-is-a-hif-file', title: 'What Is a HIF File? (And How to Open One)', desc: 'The pro-camera format explained.' },
        { href: '/guides/sony-hif-to-jpg', title: 'How to Convert Sony HIF Files to JPG', desc: 'The Sony-specific workflow.' },
        { href: '/guides/does-hif-to-jpg-lose-quality', title: 'Does Converting HIF to JPG Reduce Quality?', desc: 'What 10-bit to 8-bit actually costs.' },
        { href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera', title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?', desc: 'The capture-side decision.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>How to Open HEIF Files on Windows (or Convert Them to JPG)</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="How to Open HEIF Files on Windows (or Convert Them to JPG)" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/open-heif-files-on-windows" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="How to Open HEIF Files on Windows (or Convert Them to JPG)" />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Open HEIF Files on Windows (or Convert Them to JPG)",
        "description": "Windows needs two codec extensions to open HEIF files, and 10-bit camera HIFs often fail anyway. Every fix that works, plus the fast JPG route.",
        "url": "https://mochify.app/guides/open-heif-files-on-windows",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/open-heif-files-on-windows"
        },
        "datePublished": "2026-08-19",
        "dateModified": "2026-08-19",
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
            { "@type": "Thing", "name": "HEIF" },
            { "@type": "Thing", "name": "HEVC codec" },
            { "@type": "Thing", "name": "Windows 10" },
            { "@type": "Thing", "name": "Microsoft Store extensions" },
            { "@type": "Thing", "name": "HIF files" },
            { "@type": "Thing", "name": "JPG conversion" }
        ],
        "keywords": "open heif files on windows, heif windows 10, heif image extensions, hevc video extensions, heif to jpg, hif to jpg windows, convert heif to jpg",
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
            { "@type": "ListItem", "position": 3, "name": "How to Open HEIF Files on Windows (or Convert Them to JPG)", "item": "https://mochify.app/guides/open-heif-files-on-windows" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "How to Open HEIF Files on Windows (or Convert Them to JPG)",
        "url": "https://mochify.app/guides/open-heif-files-on-windows",
        "description": "Windows needs two codec extensions to open HEIF files, and 10-bit camera HIFs often fail anyway. Every fix that works, plus the fast JPG route.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-08-19",
        "dateModified": "2026-08-19"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Why won't HEIF files open even after I installed both extensions?", "acceptedAnswer": { "@type": "Answer", "text": "Two documented reasons: a buggy or corrupted extension install (community threads track specific bad versions; repairing or reinstalling the extensions sometimes fixes it), or a 10-bit file from a professional camera, which fails regardless because Windows' HEIF support handles 8-bit files. If the file is a .HIF from a Canon, Sony, or Fujifilm body, it is almost certainly the second case." } },
            { "@type": "Question", "name": "Is there a free HEVC codec for Windows?", "acceptedAnswer": { "@type": "Answer", "text": "Effectively no longer. The free HEVC Video Extensions from Device Manufacturer listing has disappeared from normal Microsoft Store search, and 2025 reporting found it only via archive mirrors, with no guarantee it works with current apps. The supported route is the $0.99 HEVC Video Extensions, or skipping the codec entirely by using a viewer with its own decoder or converting the files." } },
            { "@type": "Question", "name": "Can Chrome or Edge display HEIF images?", "acceptedAnswer": { "@type": "Answer", "text": "No. As of August 2026, caniuse.com shows Safari 17 and later as the only major browser with HEIF support. Chrome, Edge, and Firefox all lack it, on every platform. If an image needs to display in a browser, it needs to be JPG, PNG, WebP, or AVIF." } },
            { "@type": "Question", "name": "Does converting HEIF to JPG lose quality?", "acceptedAnswer": { "@type": "Answer", "text": "JPG is an 8-bit format, so a 10-bit HEIF gives up tonal precision in principle, but at sensible quality settings the difference is not visible in normal viewing, and the compatibility gain is total. If the 10-bit depth matters to you, convert to AVIF instead, which keeps it. Our guide on whether HIF to JPG conversion loses quality covers the details." } },
            { "@type": "Question", "name": "What is the difference between .heif, .heic, and .hif?", "acceptedAnswer": { "@type": "Answer", "text": "They are the same container format (HEIF) written by different hardware. .heic is Apple's extension, written by iPhones. .hif is what professional cameras (Canon, Sony, Fujifilm) write, typically 10-bit and often HDR. .heif is the generic extension, mostly from software exports. The workflows differ: iPhone .heic files have their own conversion path, while camera .hif files hit the 10-bit limits described in this guide." } },
            { "@type": "Question", "name": "Why do iPhone photos open on my PC but my camera's .HIF files don't?", "acceptedAnswer": { "@type": "Answer", "text": "Bit depth. iPhone .heic files are standard 8-bit HEIF, which the Store extensions decode. Camera .HIF files are 10-bit, which they don't. Same format family, different depth, and Windows only handles the shallower one." } }
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
            How to Open HEIF Files on Windows (or Convert Them to JPG)
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-6">
            Windows cannot open HEIF files out of the box, and the fix Microsoft offers is stranger than most people expect: two separate Store extensions, one of which costs $0.99, and even that combination fails on the 10-bit HEIF files that modern cameras write. If you have just double-clicked a <code>.heif</code> or <code>.hif</code> file and hit "You need an extension to use this file," this guide covers every route that actually works: what to install, which viewers decode HEIF on their own, why pro-camera files are a special case, and when converting to JPG is simply the faster answer.
        </p>

        <p class="text-lg text-[#6C3F31] leading-relaxed max-w-2xl mb-8">
            We have a <a href="https://mochify.app/solutions/heif-to-jpg">HEIF to JPG converter</a>, so we have an obvious interest in the conversion route. We will still walk you through the native fixes first, including the ones that cost nothing, and be precise about where each one stops working.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published August 19, 2026 by the Mochify Engineering Team.</strong>
                Written for the moment Windows says it needs an extension: the free and paid fixes first, then why 10-bit camera files break anyway.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each toc as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <section id="the-short-answer" class="scroll-mt-24">
            <SectionHeading>The short answer</SectionHeading>
            <p>To open HEIF files on Windows you need both the free HEIF Image Extensions and the $0.99 HEVC Video Extensions from the Microsoft Store - the first parses the container, the second decodes the image data inside it. That combination works for most standard 8-bit HEIF files. It frequently does not work for 10-bit <code>.HIF</code> files from Canon, Sony, and Fujifilm cameras, which users report failing even with both extensions installed and paid for. For those files, and for anyone who would rather not install codecs at all, converting to JPG removes the problem permanently: JPG opens everywhere, no extensions required.</p>
        </section>

        <section id="why-windows-cant-open-heif" class="scroll-mt-24">
            <SectionHeading>Why Windows can't open HEIF files</SectionHeading>
            <p>HEIF support is missing from Windows because of patent licensing, not technical difficulty. HEIF is a container format, and the image data inside almost every real-world HEIF file is compressed with HEVC (H.265), a codec covered by multiple patent pools. Rather than absorb the royalty cost for every Windows license, Microsoft moved the decoder into a paid Store add-on and left the OS without one by default.</p>
            <p>The result is the error family every Windows user with HEIF files has seen: "You need an extension to use this file" is the one <a href="https://support.microsoft.com/en-us/windows/photos-app-video-editor-error-can-t-view-this-file-type-173ae0be-2b7d-d413-589e-84ccca0de02e" target="_blank" rel="noopener noreferrer">Microsoft's own support documentation</a> describes, and community threads add "It looks like we don't support this file format" and plain "Unable to open this file" depending on the Windows and Photos app version.</p>
            <p>The browser situation is just as closed. Per <a href="https://caniuse.com/heif" target="_blank" rel="noopener noreferrer">caniuse.com's HEIF support table</a>, as of August 2026 Safari 17 and later is the only major browser that displays HEIF at all. Chrome (through version 154), Edge (151), and Firefox (157) do not support it, for the same licensing reason. So on a Windows machine there is no native app <em>and</em> no browser that will show the file - which is why a format that phones and cameras have used since 2017 still feels broken on the desktop.</p>
        </section>

        <section id="which-heif" class="scroll-mt-24">
            <SectionHeading>Which HEIF do you actually have?</SectionHeading>
            <p>Check the file extension before you fix anything, because the extension tells you which path you are on. Three extensions share the HEIF family:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li><strong><code>.heic</code></strong> - Apple's variant, written by iPhones. If your files are <code>.heic</code> photos from an iPhone, that is a different workflow with its own tool: the <a href="https://mochify.app/heic-to-jpeg">HEIC to JPEG converter</a> is the direct route, and the rest of this guide will still apply to the Windows-codec mechanics but not to the iPhone-side settings.</li>
                <li><strong><code>.hif</code></strong> - the extension professional cameras write. Canon EOS R-series, Sony Alpha, and Fujifilm X-series bodies save HEIF stills as <code>.HIF</code>, typically 10-bit, often with HDR (PQ or HLG) encoding. These are the files with the extra failure mode covered in <a href="#the-10-bit-problem">the 10-bit section below</a>. Our <a href="https://mochify.app/guides/what-is-a-hif-file">what is a HIF file guide</a> has the full background.</li>
                <li><strong><code>.heif</code></strong> - the generic extension, rarer in the wild: exports from software, some Android devices, and stray files from image pipelines.</li>
            </ul>
            <p>Same container standard underneath, but the hardware that wrote the file determines the bit depth, the HDR encoding, and therefore whether Windows can decode it at all. Keep that in mind as you pick a fix.</p>
        </section>

        <section id="microsoft-store-extensions" class="scroll-mt-24">
            <SectionHeading>Fix 1: the two Microsoft Store extensions</SectionHeading>
            <p>The official fix is installing both Store packages, and for standard 8-bit files it works. The two pieces:</p>
            <ol class="list-decimal pl-6 space-y-3">
                <li><strong><a href="https://apps.microsoft.com/detail/9pmmsr1cgpwg" target="_blank" rel="noopener noreferrer">HEIF Image Extensions</a></strong> (free) - teaches Windows to parse the HEIF container. Microsoft's Store listing is explicit that it covers files with the <code>.heic</code>, <code>.hif</code>, and <code>.heif</code> extensions, and equally explicit that it is not enough on its own.</li>
                <li>HEVC Video Extensions ($0.99) - the actual decoder for the HEVC-compressed image data inside. Without it, the container opens and the picture does not.</li>
            </ol>
            <p>Requirements and caveats worth knowing before you spend the dollar:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li>You need Windows 10 version 1809 (build 17763) or later; on older builds the extension refuses to install.</li>
                <li>The free "HEVC Video Extensions from Device Manufacturer" listing that used to be the workaround is effectively gone: it no longer surfaces in normal Store search, and 2025 reporting found it obtainable only through archive mirrors, with no guarantee current apps accept it. Budget for the $0.99 rather than chasing the free variant.</li>
                <li>Nothing in recent Windows 11 releases changed this. We looked for evidence that 23H2, 24H2, or 25H2 bundled free HEVC decoding and found none - the paid model is unchanged as of August 2026.</li>
                <li>It does not always work even when correctly installed. A steady stream of Microsoft Q&amp;A and Community Hub threads document users who installed and paid for both extensions and still get "we don't support this file format," with some threads tracing failures to a specific buggy extension version and suggesting repairs, reinstalls, or downgrades. Set your expectations accordingly: this is the official path, not a reliable one.</li>
            </ul>
            <p>Our honest read as engineers: a $0.99 decoder for a format your own phone and camera write by default is an irritating tax, but it is the only supported way to make the Photos app itself display HEIF. If you need HEIF working <em>inside Windows' own apps</em>, buy it. If you just need to see and use your photos, keep reading - there are better-value routes.</p>
        </section>

        <section id="viewer-with-own-decoder" class="scroll-mt-24">
            <SectionHeading>Fix 2: a viewer with its own decoder</SectionHeading>
            <p>A third-party viewer that ships its own HEIF decoder bypasses the Store extensions entirely - but most Windows viewers do not actually ship one, so pick carefully:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li><strong>XnView MP</strong> decodes HEIC/HEIF with its own built-in decoder - its documentation states directly that a fresh install opens the files with no Store purchase and no codec pack. Free for private use. This is the strongest no-cost option for simply viewing files.</li>
                <li><strong>IrfanView and FastStone</strong> both lean on Windows' own codec chain (WIC) for HEIF, per their own plugin and format documentation - meaning they inherit the same Store-extension dependency and the same failures, and do not solve the problem on a machine without the codecs.</li>
                <li><strong>Adobe's position is split</strong>: <a href="https://helpx.adobe.com/lightroom-cc/kb/heic-files-support.html" target="_blank" rel="noopener noreferrer">Adobe's Lightroom documentation</a> states Lightroom, Lightroom Classic, and Camera Raw support HEIF files on Windows 10 directly, while Photoshop's help pages document installing the Windows HEIF and HEVC codecs as the prerequisite. If you live in Lightroom, you may never notice the problem; Photoshop users are back at Fix 1.</li>
            </ul>
            <p>A viewer solves <em>looking at</em> the files. It does not make them attach cleanly to emails, upload to marketplaces and portals, or open on the other side for whoever you send them to - the compatibility gap follows the file wherever it goes.</p>
        </section>

        <section id="the-10-bit-problem" class="scroll-mt-24">
            <SectionHeading>The 10-bit problem: pro-camera .HIF files</SectionHeading>
            <p>If your <code>.HIF</code> files from a Canon, Sony, or Fujifilm body still will not open after installing both extensions, the file's bit depth is the likely reason, and no amount of reinstalling fixes it. Windows' HEIF support handles the standard 8-bit files phones produce. Pro bodies write 10-bit HEIF, frequently with HDR PQ or HLG encoding - Canon's own EOS R5 manual documents HEIF capture as part of its HDR PQ mode, and Sony's HEIF documentation specifies 10-bit color with HLG and BT.2020 support. The pattern users have pinned down across Canon and Adobe community threads is consistent: 8-bit HEIF opens, 10-bit <code>.HIF</code> fails, even with both extensions installed and paid for. One documented Canon R6 II owner's summary is the whole story in a sentence: bought both extensions, still cannot open his camera's files.</p>
            <p>Two more things the forums have established so you do not have to:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li><strong>Renaming <code>.HIF</code> to <code>.heif</code> or <code>.heic</code> does not work.</strong> Users report trying it; the decoder gap is about what is inside the file, not the label on it.</li>
                <li><strong>The camera makers' own software is the reliable native route.</strong> Canon's Digital Photo Professional and Sony's Imaging Edge Desktop open and convert their own HEIF files without touching the Windows codec stack - Sony's support pages explicitly direct users there. It works, with the usual cost: one vendor application per camera brand, and a manual export step every time. Our <a href="https://mochify.app/guides/heif-to-jpg-complete-guide">complete HEIF to JPG conversion guide</a> walks through each maker's software path in detail.</li>
            </ul>
            <p>There is also a subtler issue once files <em>do</em> open somewhere: 10-bit HDR data has to be tone-mapped down for standard displays, and different applications do it differently. Photographers report the same HLG HEIF file looking correct in one viewer and oversaturated in another. That is not one bug - it is what happens when a format outruns the software around it.</p>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">The fastest fix: convert to JPG</h2>
            <p class="text-base mb-4">Converting HEIF to JPG removes the dependency instead of working around it, which is why it stays the fastest fix: a JPG opens in every viewer, browser, marketplace, and email client ever made, with no codecs, no extensions, and nothing for the recipient to install. You keep the HEIF originals (they are excellent capture files - Sony's own documentation puts HEIF compression efficiency at roughly twice JPEG's), and you hand the JPGs to everything that needs to display them.</p>
            <p class="text-base mb-4">Our <a href="https://mochify.app/solutions/heif-to-jpg">HEIF to JPG converter</a> is built for exactly the stuck-file case this guide describes:</p>
            <ul class="list-disc pl-6 space-y-3 text-base">
                <li>It accepts <code>.heif</code>, <code>.heic</code>, and <code>.hif</code> - including the 10-bit camera files Windows chokes on - and you can mix extensions in one batch.</li>
                <li>Nothing to install: it runs in the browser, so it works the same on a locked-down work PC as on your own machine.</li>
                <li>You describe what you want in plain English if you want more than a straight conversion - Magic Flow prompts like "convert these to JPG and keep them under 5MB for email" set format, quality, and size in one line.</li>
                <li>Output is standard JPG encoded with Google's jpegli encoder, so the files are efficient without any compatibility tricks.</li>
                <li>Privacy: files are streamed into memory, converted, and discarded - nothing is written to disk and nothing is logged. Metadata, including GPS location, is stripped by default.</li>
            </ul>
            <p class="text-base mt-4">The free session handles 3 files up to 20MB each with no signup; a free account covers 25 images a month, and paid tiers raise that with 25-file batches and 75MB files for full shoot-scale work. For photographers clearing whole cards regularly, the same conversions run from the Mochify CLI, so a folder of <code>.HIF</code> files becomes a folder of JPGs in one command.</p>
            <p class="text-base mt-4 mb-0">And if you specifically want to keep the 10-bit quality rather than flatten to JPG, converting <code>.HIF</code> to AVIF preserves the extra depth in a format browsers actually display - the <a href="https://mochify.app/solutions/hif-to-avif">HIF to AVIF converter</a> handles that route.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: symptom to fix</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Symptom</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Likely cause</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Fix</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">"You need an extension to use this file"</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No HEIF/HEVC codecs installed</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Store extensions (free + $0.99), or convert to JPG</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Installed both extensions, still fails</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Buggy extension version, or 10-bit file</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Repair/reinstall extensions; if <code>.HIF</code> from a camera, see 10-bit row</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold"><code>.HIF</code> from Canon/Sony/Fuji won't open anywhere</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">10-bit HEIF beyond Windows' 8-bit support</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Vendor software (DPP / Imaging Edge), or <a href="https://mochify.app/solutions/heif-to-jpg">convert to JPG</a></td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Renamed <code>.HIF</code> to <code>.heic</code>, still broken</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Decoder gap is in the data, not the extension</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Don't rename; convert instead</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Opens on your PC, recipient can't open it</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Their machine lacks codecs too</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Send JPG, keep HEIF originals</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Need it in Chrome/Edge/Firefox</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No browser supports HEIF except Safari 17+</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Convert to JPG (or AVIF for 10-bit)</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-24">
            <SectionHeading>FAQ</SectionHeading>
            <div>
                <div class="faq-item">
                    <h3>Why won't HEIF files open even after I installed both extensions?</h3>
                    <p>Two documented reasons: a buggy or corrupted extension install (community threads track specific bad versions; repairing or reinstalling the extensions sometimes fixes it), or a 10-bit file from a professional camera, which fails regardless because Windows' HEIF support handles 8-bit files. If the file is a <code>.HIF</code> from a Canon, Sony, or Fujifilm body, it is almost certainly the second case.</p>
                </div>
                <div class="faq-item">
                    <h3>Is there a free HEVC codec for Windows?</h3>
                    <p>Effectively no longer. The free "HEVC Video Extensions from Device Manufacturer" listing has disappeared from normal Microsoft Store search, and 2025 reporting found it only via archive mirrors, with no guarantee it works with current apps. The supported route is the $0.99 HEVC Video Extensions - or skipping the codec entirely by using a viewer with its own decoder or converting the files.</p>
                </div>
                <div class="faq-item">
                    <h3>Can Chrome or Edge display HEIF images?</h3>
                    <p>No. As of August 2026, caniuse.com shows Safari 17 and later as the only major browser with HEIF support - Chrome, Edge, and Firefox all lack it, on every platform. If an image needs to display in a browser, it needs to be JPG, PNG, WebP, or AVIF.</p>
                </div>
                <div class="faq-item">
                    <h3>Does converting HEIF to JPG lose quality?</h3>
                    <p>JPG is an 8-bit format, so a 10-bit HEIF gives up tonal precision in principle - but at sensible quality settings the difference is not visible in normal viewing, and the compatibility gain is total. If the 10-bit depth matters to you, convert to AVIF instead, which keeps it. Our guide on <a href="https://mochify.app/guides/does-hif-to-jpg-lose-quality">whether HIF to JPG conversion loses quality</a> covers the details.</p>
                </div>
                <div class="faq-item">
                    <h3>What is the difference between .heif, .heic, and .hif?</h3>
                    <p>They are the same container format (HEIF) written by different hardware. <code>.heic</code> is Apple's extension, written by iPhones. <code>.hif</code> is what professional cameras (Canon, Sony, Fujifilm) write, typically 10-bit and often HDR. <code>.heif</code> is the generic extension, mostly from software exports. The workflows differ: iPhone <code>.heic</code> files have their own conversion path, while camera <code>.hif</code> files hit the 10-bit limits described in this guide.</p>
                </div>
                <div class="faq-item">
                    <h3>Why do iPhone photos open on my PC but my camera's .HIF files don't?</h3>
                    <p>Bit depth. iPhone <code>.heic</code> files are standard 8-bit HEIF, which the Store extensions decode. Camera <code>.HIF</code> files are 10-bit, which they don't. Same format family, different depth, and Windows only handles the shallower one.</p>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Got a HEIF file Windows still won't open?</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Drop it into Mochify and prompt <em>"convert this HEIF to JPG and strip the metadata"</em> - you'll get a file that opens everywhere in seconds, no codecs required.</p>
            <a href="/solutions/heif-to-jpg" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Convert HEIF to JPG free →
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
