<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "Photo File Too Large to Upload? Why Free Tools Reject Camera Files",
        seoTitle: "File Too Large to Upload? The Fix for Big Camera Photos",
        description: "Why free tools reject modern camera files: real sizes from 45-61MP bodies, the 5-20MB caps that refuse them, and the fastest path to files that upload anywhere.",
        category: "Image Optimization",
        readTime: "12 min read",
        date: "July 23, 2026"
    };

    const toc = [
        { n: '01', href: '#the-short-answer', label: 'The Short Answer' },
        { n: '02', href: '#how-big-camera-files-are', label: 'How Big Camera Files Actually Are' },
        { n: '03', href: '#the-free-tool-wall', label: 'The Free-Tool Wall' },
        { n: '04', href: '#why-free-tools-reject-big-files', label: 'Why Free Tools Reject Big Files' },
        { n: '05', href: '#the-other-wall', label: 'The Other Wall: Destination Limits' },
        { n: '06', href: '#the-right-fix', label: 'The Right Fix for Each File Type' },
        { n: '07', href: '#mochify-workflow', label: 'Mochify Workflow' },
        { n: '08', href: '#cheat-sheet', label: 'Cheat Sheet' },
        { n: '09', href: '#faq', label: 'FAQ' },
    ];

    const faqs = [
        {
            q: "Why is my photo too large to upload?",
            a: "Because current cameras outproduce most upload caps by default: a 45-61MP camera writes 13-52MB JPEGs and HEIFs, while free compression tools cap input at 5-20MB and destinations like eBay (12MB), Vinted (10MB), and Gmail (25MB) cap it again. The file is normal; the caps are just calibrated for smaller files."
        },
        {
            q: "How do I compress a photo that is over 20MB?",
            a: "Use a compressor whose input limit exceeds your file size - for 35-52MB files from 61MP cameras that means a 75MB-class tier (Mochify Seller or Pro, or TinyPNG's paid Web Pro) - then resize to the destination's display resolution and re-encode. Resizing typically contributes far more of the reduction than compression alone."
        },
        {
            q: "Can I compress a RAW file online?",
            a: "You should not. RAW is unprocessed sensor data that needs demosaicing in a raw converter (Lightroom, Capture One, or your camera maker's software) before it is a viewable image. Convert RAW to JPEG or HEIF there, then compress that export online. Services that accept RAW directly are converting it invisibly with a generic rendering."
        },
        {
            q: "How big are Sony A7R V files?",
            a: "Measured across real scenes: 35-52MB for JPEG Extra Fine, 12-27MB for HEIF 4:2:2, 64-73MB for compressed RAW, and 125-134MB for uncompressed RAW. Scene detail moves the number: skies compress small, foliage and texture run large."
        },
        {
            q: "Why do free compression tools have file size limits?",
            a: "Because uploads cost the tool bandwidth and compute, and a size cap keeps the free tier's cost bounded. Most caps were set when typical files were a few megabytes; camera resolution has since tripled. The limit is a pricing boundary, not a technical one - paid tiers of the same services accept far larger files."
        },
        {
            q: "What size should photos be for eBay and Vinted?",
            a: "Under eBay's 12MB per-photo cap and Vinted's 10MB cap, at roughly 1600-2000px on the long edge. In practice a resized, well-encoded JPEG for either platform lands around 1-2MB, far under both caps, and uploads dramatically faster than the original."
        },
        {
            q: "Does resizing a 45MP photo lose quality?",
            a: "Not at the destination's display size. A marketplace or gallery showing images at 1600-2000px cannot display 8192px of detail, so resizing to the display resolution discards only pixels that would never be seen. Keep your full-resolution original archived and export sized copies per destination."
        }
    ];

    const related = [
        { href: '/guides/heif-to-jpg-complete-guide', title: 'HEIF to JPG: The Complete Conversion Guide', desc: 'Every conversion path for pro-camera HEIF files.' },
        { href: '/guides/hif-to-jpg-canon-sony-fujifilm', title: 'HIF to JPG: Convert Canon, Sony & Fujifilm Photos', desc: 'The per-brand workflows, including what 10-bit to 8-bit costs you.' },
        { href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera', title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?', desc: 'The capture-side decision that sets your file sizes.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide 2026: Quality-Per-Byte', desc: 'The encoder math behind 35% smaller JPEGs.' },
        { href: '/guides/european-alternative-tinypng-gdpr-compliant-image-compression', title: 'A European Alternative to TinyPNG (GDPR, Zero-Retention)', desc: 'How the compressor landscape differs on privacy.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/photo-file-too-large-to-upload" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.seoTitle} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/photo-file-too-large-to-upload" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.seoTitle} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Photo File Too Large to Upload? Why Free Tools Reject Camera Files",
        "description": "Why free tools reject modern camera files: real sizes from 45-61MP bodies, the 5-20MB caps that refuse them, and the fastest path to files that upload anywhere.",
        "url": "https://mochify.app/guides/photo-file-too-large-to-upload",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/photo-file-too-large-to-upload"
        },
        "datePublished": "2026-07-23",
        "dateModified": "2026-07-23",
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
            { "@type": "Thing", "name": "image file size" },
            { "@type": "Thing", "name": "upload limits" },
            { "@type": "Thing", "name": "image compression" },
            { "@type": "Thing", "name": "HEIF" },
            { "@type": "Thing", "name": "JPEG" },
            { "@type": "Thing", "name": "RAW files" },
            { "@type": "Thing", "name": "mirrorless cameras" },
            { "@type": "Thing", "name": "Sony A7R V" },
            { "@type": "Thing", "name": "Canon EOS R5" }
        ],
        "keywords": "file too large to upload, photo too big to upload, compress large photos, image file size limit, camera file sizes, compress 45mp photos",
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
            { "@type": "ListItem", "position": 3, "name": "Photo File Too Large to Upload? Why Free Tools Reject Camera Files", "item": "https://mochify.app/guides/photo-file-too-large-to-upload" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Photo File Too Large to Upload? Why Free Tools Reject Camera Files",
        "url": "https://mochify.app/guides/photo-file-too-large-to-upload",
        "description": "Why free tools reject modern camera files: real sizes from 45-61MP bodies, the 5-20MB caps that refuse them, and the fastest path to files that upload anywhere.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-23",
        "dateModified": "2026-07-23"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Why is my photo too large to upload?", "acceptedAnswer": { "@type": "Answer", "text": "Because current cameras outproduce most upload caps by default: a 45-61MP camera writes 13-52MB JPEGs and HEIFs, while free compression tools cap input at 5-20MB and destinations like eBay (12MB), Vinted (10MB), and Gmail (25MB) cap it again. The file is normal; the caps are just calibrated for smaller files." } },
            { "@type": "Question", "name": "How do I compress a photo that is over 20MB?", "acceptedAnswer": { "@type": "Answer", "text": "Use a compressor whose input limit exceeds your file size - for 35-52MB files from 61MP cameras that means a 75MB-class tier (Mochify Seller or Pro, or TinyPNG's paid Web Pro) - then resize to the destination's display resolution and re-encode. Resizing typically contributes far more of the reduction than compression alone." } },
            { "@type": "Question", "name": "Can I compress a RAW file online?", "acceptedAnswer": { "@type": "Answer", "text": "You should not. RAW is unprocessed sensor data that needs demosaicing in a raw converter (Lightroom, Capture One, or your camera maker's software) before it is a viewable image. Convert RAW to JPEG or HEIF there, then compress that export online. Services that accept RAW directly are converting it invisibly with a generic rendering." } },
            { "@type": "Question", "name": "How big are Sony A7R V files?", "acceptedAnswer": { "@type": "Answer", "text": "Measured across real scenes: 35-52MB for JPEG Extra Fine, 12-27MB for HEIF 4:2:2, 64-73MB for compressed RAW, and 125-134MB for uncompressed RAW. Scene detail moves the number: skies compress small, foliage and texture run large." } },
            { "@type": "Question", "name": "Why do free compression tools have file size limits?", "acceptedAnswer": { "@type": "Answer", "text": "Because uploads cost the tool bandwidth and compute, and a size cap keeps the free tier's cost bounded. Most caps were set when typical files were a few megabytes; camera resolution has since tripled. The limit is a pricing boundary, not a technical one - paid tiers of the same services accept far larger files." } },
            { "@type": "Question", "name": "What size should photos be for eBay and Vinted?", "acceptedAnswer": { "@type": "Answer", "text": "Under eBay's 12MB per-photo cap and Vinted's 10MB cap, at roughly 1600-2000px on the long edge. In practice a resized, well-encoded JPEG for either platform lands around 1-2MB, far under both caps, and uploads dramatically faster than the original." } },
            { "@type": "Question", "name": "Does resizing a 45MP photo lose quality?", "acceptedAnswer": { "@type": "Answer", "text": "Not at the destination's display size. A marketplace or gallery showing images at 1600-2000px cannot display 8192px of detail, so resizing to the display resolution discards only pixels that would never be seen. Keep your full-resolution original archived and export sized copies per destination." } }
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
            Photo File Too Large to Upload? Why Free Tools Reject Camera Files
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            If you keep seeing "file too large to upload," your camera is probably not doing anything wrong - the tools on the other end are. Modern mirrorless cameras produce 13MB to 50MB photos as a matter of routine, while most free compression tools cap uploads at 5MB to 20MB, and most destinations (marketplaces, email, portals) cap them again at 10MB to 25MB. This guide names the wall: exactly how big today's camera files are, exactly where the free-tool limits sit, why those limits exist, and the fastest honest path to files that upload everywhere.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 23, 2026 by the Mochify Engineering Team.</strong>
                Written for the moment an upload form says no: real file sizes from current camera bodies, the caps that reject them, and which fix fits which file.
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
            <SectionHeading>The Short Answer</SectionHeading>
            <p>A "file too large" error means your photo exceeds a hard cap set by either the tool you are compressing with or the site you are uploading to - and with current 40-61 megapixel cameras, exceeding those caps is normal, not a mistake. The fix is a compressor whose input limit actually fits camera files: check the tool's max file size against your camera's real output (13-52MB for high-resolution JPEG and HEIF stills) before you waste time re-exporting. And if the file is a RAW, no web compressor is the right tool - convert it to JPEG in your raw software first.</p>
            <p>We sell one of the tools in this comparison, so we will show our own limits alongside everyone else's, including the case our paid tier does <em>not</em> solve.</p>
        </section>

        <section id="how-big-camera-files-are" class="scroll-mt-24">
            <SectionHeading>How Big Camera Files Actually Are in 2026</SectionHeading>
            <p>Straight-out-of-camera stills from current high-resolution bodies routinely run 13MB to 52MB, and RAW files run far beyond that. The resolution race made this normal: Fujifilm's X-T5 and X-H2 shoot 40MP, Canon's EOS R5 45MP, Sony's A7R V 61MP - pixel counts that were medium-format territory a few years ago are now the enthusiast default.</p>
            <p>Real numbers, from two sources. <a href="https://cam.start.canon/en/C003/manual/html/UG-09_Reference_0100.html" target="_blank" rel="noopener noreferrer">Canon's official EOS R5 specifications</a> list approximate file sizes of 13.5MB for a Fine Large JPEG, 13.4MB for a Fine Large HEIF (<code>.HIF</code>), 21.9MB for C-RAW, and 45.4MB for RAW. Those are Canon's averages; detailed scenes run higher.</p>
            <p>At 61MP the numbers jump. AlphaShooters' <a href="https://www.alphashooters.com/sony-a7rv-file-size/" target="_blank" rel="noopener noreferrer">measured Sony A7R V file sizes</a> across four test scenes:</p>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[480px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">A7R V file type</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Measured size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">JPEG Extra Fine</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">35-52MB</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">HEIF 4:2:2 Extra Fine</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">12-27MB</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">HEIF 4:2:0 Extra Fine</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">10-23MB</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Compressed RAW</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">64-73MB</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Uncompressed RAW</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">125-134MB</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Read that JPEG row again: a maximum-quality JPEG from a current 61MP body is 35-52MB. Not RAW - JPEG. Every one of those files sails past a 5MB cap, most pass 20MB, and the detailed-scene ones pass anything short of 75MB.</p>
            <p>Two format notes. First, HEIF is doing real work in that table - the same scenes that produce 35-52MB JPEGs produce 12-27MB HEIFs, which is why pro bodies push the format; our guide on <a href="/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera">shooting HEIF vs JPEG on mirrorless cameras</a> covers that trade-off. Second, a demarcation we insist on: <code>.HIF</code> files come from professional cameras (Canon, Sony, Fujifilm); <code>.HEIC</code> files come from iPhones. Same format family underneath, completely different workflows. This guide is in the pro-camera lane; if your too-large file is a <code>.HEIC</code> from an iPhone, the <a href="/heic-to-jpeg">HEIC to JPEG converter</a> is your faster path.</p>
        </section>

        <section id="the-free-tool-wall" class="scroll-mt-24">
            <SectionHeading>The Free-Tool Wall: Where the Size Limits Sit</SectionHeading>
            <p>Most free compression tiers cap input files at 5MB to 20MB, which means they reject typical pro-camera output before compression even starts. The caps as of July 2026:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">TinyPNG (free web tool): 5MB per image.</strong> A respected tool, but its free cap is smaller than nearly every file in the A7R V table above, and smaller than plenty of phone photos. Tinify's paid Web Pro raises it to 75MB.</li>
                <li><strong class="text-[#4A2C2C]">Compressor.io (free): commonly reported at 10MB.</strong></li>
                <li><strong class="text-[#4A2C2C]">Mochify (Free tier): 20MB.</strong> Covers a Canon R5 Fine Large JPEG or <code>.HIF</code> (about 13.5MB), most HEIFs, and effectively all phone photos - but not a 61MP Extra Fine JPEG.</li>
                <li><strong class="text-[#4A2C2C]">Mochify (Seller and Pro): 75MB.</strong> Covers everything in the stills table above except uncompressed RAW.</li>
            </ul>
            <p>Stated plainly, because this is the article's honest core: our free cap is 4x TinyPNG's, and there is still a class of file it rejects. A Sony A7R V or similar 61MP body producing 35-52MB Extra Fine JPEGs needs the 75MB ceiling of a paid tier - ours ($7.99/month Seller) or someone else's. And <strong class="text-[#4A2C2C]">no tier of any web compressor is the right home for a 125MB uncompressed RAW</strong> - more on that below.</p>
            <p>Competitor numbers are dated for a reason: caps change. These were verified in July 2026; check the tool's own pricing page if you are reading this much later.</p>
        </section>

        <section id="why-free-tools-reject-big-files" class="scroll-mt-24">
            <SectionHeading>Why Free Tools Reject Big Files</SectionHeading>
            <p>File-size caps exist because every megabyte you upload costs the tool real bandwidth and compute, and free tiers have to bound that cost somewhere. A 50MB upload consumes 10x the bandwidth of a 5MB one, occupies an encoder worker for longer, and produces a larger result to send back. Free tiers are marketing expenses; a size cap is the simplest lever that keeps the marketing expense proportional to the value of a free user. That is not a scandal - we do it too, at 20MB - but it explains the pattern: the cap is set where the <em>typical free user's</em> files top out, and pro-camera files are not typical. The 5MB caps were calibrated for an era of 12-24MP compressed JPEGs. Sensors moved; many caps did not.</p>
            <p>The practical consequence: "file too large" from a free tool is usually a <em>pricing boundary</em>, not a technical one. The same service will often happily take the identical file on a paid tier. Knowing that changes the question from "what is wrong with my photo" to "which tier or tool actually fits my camera" - a five-second spec check instead of an evening of frustrated re-exporting.</p>
        </section>

        <section id="the-other-wall" class="scroll-mt-24">
            <SectionHeading>The Other Wall: Upload Limits at the Destination</SectionHeading>
            <p>Even after you find a compressor that accepts your file, the destination has its own cap - and those caps are much lower than camera output. The ones sellers and photographers hit most, as of July 2026:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">eBay: 12MB per photo</strong> (<a href="https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148" target="_blank" rel="noopener noreferrer">eBay's picture guidelines</a>), up to 24 photos per listing.</li>
                <li><strong class="text-[#4A2C2C]">Vinted: 10MB per photo</strong>, up to 20 photos.</li>
                <li><strong class="text-[#4A2C2C]">Gmail: 25MB per message</strong> including all attachments (<a href="https://support.google.com/mail/answer/6584" target="_blank" rel="noopener noreferrer">Google's attachment limits</a>) - two full-quality R5 JPEGs and you are done.</li>
                <li><strong class="text-[#4A2C2C]">Client galleries, portals, forms:</strong> commonly 10-25MB, often unstated until the error.</li>
            </ul>
            <p>So the real target is not "under my compressor's cap" - it is "under the destination's cap, at the destination's ideal resolution." A 45MP, 8192px-wide image is wasted on a marketplace that displays 1600px; resizing to the display size is where the giant savings come from, with compression doing the rest. A 40MB Extra Fine JPEG resized to 2000px and re-encoded lands around 1-2MB with no visible loss at display size - a 95%+ reduction, most of it from resolution nobody would ever see.</p>
        </section>

        <section id="the-right-fix" class="scroll-mt-24">
            <SectionHeading>The Right Fix for Each File Type</SectionHeading>
            <p>Match the fix to what the file actually is - the answer differs by extension:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Oversized JPEG (10-52MB):</strong> resize to the destination's display resolution and re-encode with a modern encoder. This is the everyday case and any capable compressor handles it, size cap permitting. Mochify re-encodes JPEGs with Google's jpegli encoder, which delivers roughly 35% better compression than legacy encoders at the same visual quality - our <a href="/guides/jpeg-in-2026-jpegli">Jpegli guide</a> has the numbers.</li>
                <li><strong class="text-[#4A2C2C]">HIF/HEIF from a pro body (10-27MB):</strong> convert to JPEG for compatibility (the <a href="/solutions/hif-to-jpg">HIF to JPG converter</a> handles Canon, Sony, and Fujifilm files), or go to <a href="/solutions/hif-to-avif">AVIF to keep the 10-bit quality</a> in a smaller file. The full decision tree is in our <a href="/guides/heif-to-jpg-complete-guide">complete HEIF to JPG conversion guide</a>.</li>
                <li><strong class="text-[#4A2C2C]">RAW (45-134MB):</strong> stop - a web compressor is the wrong tool, including ours. RAW is unprocessed sensor data; it needs demosaicing in your raw converter (Lightroom, Capture One, the maker's own software), which then exports a JPEG or HEIF. Compress <em>that</em> export. Any web service claiming to "compress RAW" is quietly converting it first, with a generic rendering of your carefully shot file.</li>
                <li><strong class="text-[#4A2C2C]">Scans and TIFF exports (often 50-500MB):</strong> flatten and export to JPEG or PNG at the needed resolution first; then compress.</li>
            </ul>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">Mochify Workflow: Getting Oversized Photos Web-Ready</h2>
            <p class="text-base mb-7">One check, one upload, one prompt takes a camera file from "too large" to accepted anywhere:</p>
            <ol class="space-y-4 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Check the file type first</strong>
                        <p class="text-base m-0">RAW goes through your raw converter; JPEG and HIF/HEIF continue to step 2.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Load your files into Mochify</strong>
                        <p class="text-base m-0">Free takes files up to 20MB, 3 per batch, 25 per month. Seller and Pro take up to 75MB per file, 25 per batch, 300 or 1,200 per month, with a priority queue - the tier for 61MP bodies and weekly shoot volume.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">One plain-English prompt does the whole transformation</strong>
                        <p class="text-base m-0">Prompt <em>"resize these to 2000px on the long edge, convert to JPEG, keep each under 10MB, and strip all metadata"</em>. Magic Flow parses the prompt with a language model, then our C++ engine executes it.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Delivering HDR or high-bit-depth work?</strong>
                        <p class="text-base m-0">Prompt <em>"convert to AVIF, preserve 10-bit"</em> instead of JPEG.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">5</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Download the batch</strong>
                        <p class="text-base m-0">Now at a size every marketplace, gallery, and inbox accepts.</p>
                    </div>
                </li>
            </ol>
            <p class="text-base text-[#875F42] mt-7 mb-0">Two notes worth being precise about. State the metadata handling explicitly in your prompt (as above): camera files carry EXIF including GPS coordinates, and you should decide deliberately whether it travels with your photos. And the privacy model, stated exactly: your images travel to <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">api.mochify.app</code> over HTTPS, are processed in RAM, and are wiped immediately after encoding - no disk writes, no logs containing file data, zero retention. Your photos must leave your machine for the encoding; they are never kept.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: File Sizes vs Tool Limits</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">File</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Typical size</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Fits free caps?</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Right move</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Phone photo (JPEG/HEIC)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">2-8MB</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Usually (5MB caps: sometimes not)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Compress + resize; iPhone <code>.HEIC</code> to JPEG</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Canon R5 JPEG / <code>.HIF</code> (45MP)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~13-20MB</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">20MB yes; 5-10MB caps no</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Resize + re-encode (jpegli)</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Sony A7R V JPEG Extra Fine (61MP)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">35-52MB</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No free cap fits</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">75MB-tier tool: resize + re-encode</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">HEIF 4:2:2 from 61MP body</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">12-27MB</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">20MB usually; 5-10MB no</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Convert to JPEG or AVIF</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">C-RAW / compressed RAW</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">22-73MB</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Raw converter first, then compress export</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Uncompressed RAW</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">125MB+</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">No (exceeds 75MB tiers too)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Raw converter first - always</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Destination caps to hit: eBay 12MB, Vinted 10MB, Gmail 25MB. Caps verified July 2026: TinyPNG free 5MB, Compressor.io ~10MB (reported), Mochify Free 20MB, Mochify Seller/Pro 75MB.</p>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Hit a size wall today?</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Drop the file into Mochify and prompt <em>"resize to 2000px, convert to JPEG, keep under 10MB"</em> - 3 images per session free with no signup, 20MB per file on the Free tier.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Start Optimizing Now →
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
