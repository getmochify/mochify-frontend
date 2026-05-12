<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "HIF/HEIF to JPEG for Professional Photographers: A Privacy-First Workflow Guide",
        description: "Convert Canon HIF and HEIF to JPEG with confidence. Wedding, commercial, and editorial workflow blueprints with EXIF stripping, batch sizing, and zero-retention processing.",
        category: "Workflow Guide",
        readTime: "12 min read",
        date: "April 23, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <link rel="canonical" href="https://mochify.app/guides/heif-to-jpeg-workflow-photographers-guide" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "HIF/HEIF to JPEG for Professional Photographers: A Privacy-First Workflow Guide",
        "description": "Convert Canon/Fuji HIF and HEIF to JPEG with confidence. Wedding, commercial, and editorial workflow blueprints with EXIF stripping, batch sizing, and zero-retention processing.",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "datePublished": "2026-04-23",
        "dateModified": "2026-04-23",
        "url": "https://mochify.app/guides/heif-to-jpeg-workflow-photographers-guide",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
            "@type": "Question",
            "name": "Can Mochify accept Canon and Fuji HIF files directly, without pre-converting them first?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Mochify accepts HEIF and HIF files as direct inputs. You do not need to convert to JPEG or TIFF first — upload the HIF files from your camera card or Lightroom export folder, describe the output you want in plain English, and Mochify handles the conversion in a single pass."
            }
            },
            {
            "@type": "Question",
            "name": "What happens to my files after Mochify processes them?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nothing — because they are never stored. Mochify's pipeline is fully in-memory. Files stream through RAM during processing and are discarded immediately after your download completes. Nothing is written to disk, nothing is retained, and uploaded images are never used for AI training or added to any database."
            }
            },
            {
            "@type": "Question",
            "name": "Can I strip GPS from editorial images while keeping caption and copyright IPTC data?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Use a prompt like \"convert to JPEG for wire delivery, preserve caption and copyright IPTC, strip GPS coordinates.\" Magic Flow distinguishes between metadata types and applies selective stripping accordingly."
            }
            },
            {
            "@type": "Question",
            "name": "What is jpegli, and why does it matter for my client gallery deliveries?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "jpegli is Google's modern JPEG encoder. It produces standard JPEG files — compatible with every device, browser, and gallery platform — but at roughly 25-30% smaller file sizes than traditional libjpeg-turbo encoders at equivalent quality."
            }
            }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider border border-green-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            HIF/HEIF to JPEG for Professional Photographers: A Privacy-First Workflow Guide
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Canon, Nikon, Fuji, and Sony mirrorless cameras now shoot native 10-bit HEIF files. The delivery world has not caught up. Here is how to bridge that gap without leaking client data or wasting hours in export queues.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                This guide maps the friction points photographers hit converting HIF and HEIF to gallery-ready, marketplace-ready, or wire-ready JPEG in 2026, and provides repeatable workflow blueprints for wedding, commercial, and editorial shooters. EXIF privacy, batch efficiency, and zero-retention processing throughout.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <nav aria-label="Table of contents">
            <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-7 mb-4">
                <SectionHeading>What's in This Guide</SectionHeading>
                <ol class="flex flex-col gap-2.5 mt-5 list-none p-0 m-0">
                    {#each [
                        { n: '01', label: 'Why photographers are stuck between HIF/HEIF and JPEG', id: '#why-stuck' },
                        { n: '02', label: 'Format cheat sheet: HIF, HEIF, JPEG, WebP, AVIF at a glance', id: '#format-cheat-sheet' },
                        { n: '03', label: 'The five pain points that break real workflows', id: '#pain-points' },
                        { n: '04', label: 'Workflow blueprint: wedding and portrait shooters', id: '#workflow-wedding' },
                        { n: '05', label: 'Workflow blueprint: commercial and product photographers', id: '#workflow-commercial' },
                        { n: '06', label: 'Workflow blueprint: editorial and press photographers', id: '#workflow-editorial' },
                        { n: '07', label: 'Privacy and EXIF: what your images are silently broadcasting', id: '#privacy-exif' },
                        { n: '08', label: 'How Mochify fits into a pro photographer workflow', id: '#how-mochify-fits' },
                        { n: '09', label: 'Technical proof: file size, quality, and time savings', id: '#technical-proof' },
                        { n: '10', label: 'FAQ', id: '#faq' },
                    ] as item}
                        <li class="m-0 p-0">
                            <a href={item.id} class="flex items-center gap-3 bg-white border border-pink-100 rounded-xl px-4 py-3 no-underline text-[#4A2C2C] font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF0F5] border border-pink-100 text-[#F06292] font-black text-xs flex items-center justify-center">{item.n}</span>
                                <span class="flex-1">{item.label}</span>
                                <span class="text-[#F06292] ml-auto">→</span>
                            </a>
                        </li>
                    {/each}
                </ol>
            </div>
        </nav>

        <!-- Section 01 -->
        <section id="why-stuck">
            <SectionHeading>Why photographers are stuck between HIF/HEIF and JPEG</SectionHeading>
            <p>The quality-per-byte advantage of native 10-bit HEIF over JPEG is real. The delivery world has not caught up.</p>
            <p>Canon, Nikon, Fuji, and Sony mirrorless cameras now shoot native 10-bit HEIF files, and the capture quality argument for HEIF is straightforward: more tonal range, better highlight and shadow retention, smaller files than equivalent RAW. But client galleries, press wire services, e-commerce marketplaces, and editorial CMSes still expect JPEG, often with specific size and color profile requirements. The result is a conversion step that happens on every job, for every destination, with tools that were never designed for it.</p>
            <p>This guide maps the exact friction points pro photographers hit converting from camera-native HIF/HEIF to gallery-ready, marketplace-optimized, or wire-ready JPEG (and AVIF/WebP where useful) without leaking client data or wasting hours in export queues.</p>
            <p>We built Mochify's HEIF support specifically around this gap. The workflows here use Mochify's Magic Flow natural language interface, but the format and privacy principles apply regardless of the tool you use.</p>
        </section>

        <!-- Section 02 -->
        <section id="format-cheat-sheet">
            <SectionHeading>Format cheat sheet: HIF, HEIF, JPEG, WebP, AVIF at a glance</SectionHeading>
            <p>Knowing which format belongs at which stage of your workflow prevents silent quality loss and platform rejection errors.</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 my-6">
                <table class="w-full min-w-[540px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Format</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Bit depth</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Typical use</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Platform support</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">EXIF risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { fmt: 'HIF (Canon, Fuji)', bit: '10-bit', use: 'In-camera capture on EOS R-series bodies', support: 'Low — Canon, Fuji-specific', risk: 'High if unstripped' },
                            { fmt: 'HEIF/HEIC', bit: '8 or 10-bit', use: 'In-camera on Nikon Z, Sony Alpha, iPhone', support: 'Low-medium', risk: 'High if unstripped' },
                            { fmt: 'JPEG', bit: '8-bit', use: 'Universal client delivery, galleries, press', support: 'Universal', risk: 'High if unstripped' },
                            { fmt: 'WebP', bit: '8-bit', use: 'Web delivery, portfolio, e-commerce', support: '~95% of browsers', risk: 'Medium' },
                            { fmt: 'AVIF', bit: '10-bit', use: 'Web delivery, portfolio, product galleries', support: '~90% of browsers', risk: 'Medium' },
                            { fmt: 'JPEG XL', bit: 'Up to 32-bit', use: 'Archive, future-proofing', support: 'Experimental', risk: 'Medium' },
                        ] as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">{row.fmt}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.bit}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.use}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.support}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.risk}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <InfoBox type="tip" title="30-Second Summary">
                Shoot HIF/HEIF on camera for capture quality. Deliver JPEG for anything that needs to "just work" with clients, galleries, or wire systems. Use AVIF or WebP for your own website. Always strip EXIF before uploading anywhere.
            </InfoBox>
        </section>

        <!-- Section 03 -->
        <section id="pain-points">
            <SectionHeading>The five pain points that break real workflows</SectionHeading>
            <p>Most photographers hit the same five walls. Understanding them precisely is the first step to routing around them.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">1. HIF/HEIF rejection and silent gallery conversions</h3>
            <p>Gallery platforms and CMSes handle HEIF inconsistently, and often silently. SmugMug accepts HEIC uploads but immediately converts them to JPEG on ingest, dropping the original file. Platforms running older software reject HEIF outright with generic errors. Either way, photographers are forced to pre-convert — with the platform deciding compression settings, color profile, and dimensions.</p>
            <p>The fix is to own the conversion step yourself, before upload, with a known quality setting, a defined color profile (sRGB for web/gallery delivery), and a long-edge dimension you chose.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">2. File size limits on galleries, marketplaces, and email</h3>
            <p>Email attachments hit limits around 20–25 MB. Etsy, eBay, and Shopify product pages have their own per-image recommended sizes — typically 1,600–2,000 px on the long edge and well under 1 MB for fast page loads. High-resolution HIF/HEIF files from modern mirrorless bodies can easily exceed these limits, causing photographers to scramble with whatever tool is nearest and producing inconsistent compression across a set.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">3. Privacy and EXIF leakage</h3>
            <p>EXIF metadata is not just technical noise. It can include GPS coordinates precise enough to pinpoint a shoot location, timestamps, device serial numbers, and an embedded thumbnail of the uncropped original frame. That thumbnail often shows content that was deliberately cropped out of the final image. For wedding photographers, this means client home addresses sitting in gallery metadata. For commercial and editorial shooters, it means shoot locations and unreleased products readable by anyone who downloads a file.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">4. Batch inefficiency across multiple destinations</h3>
            <p>A typical commercial shoot produces multiple derivative sets: full-resolution JPEG for archive, smaller proofs for the client gallery, AVIF for the brand website, and specifically sized variants per marketplace. Managing this with separate Lightroom presets, manual folder structures, and ad-hoc compression tools is slow and error-prone. Pro photographers in busy periods report spending several hours per week on export tasks that should be automated.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">5. Plugin bloat and cloud lock-in</h3>
            <p>Tools like ShortPixel solve part of the problem by installing plugins into your CMS, but they tie your optimization pipeline to a specific hosting provider. Switching hosts means rebuilding your entire setup. External pre-processing — optimizing files before they touch any CMS or gallery — avoids all of this. Files arrive already optimized, any gallery or CMS accepts them, and your pipeline is fully portable.</p>

            <div class="my-10 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3">Process your first batch for free</h3>
                <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6">No account needed. Drag your HIF or HEIF files, describe your output in plain English, download gallery-ready JPEGs in seconds.</p>
                <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                    Try Mochify free →
                </a>
            </div>
        </section>

        <!-- Section 04 -->
        <section id="workflow-wedding">
            <SectionHeading>Workflow blueprint: wedding and portrait shooters</SectionHeading>
            <p>Wedding and portrait photographers deliver hundreds of images per job through galleries like Pixieset, SmugMug, or Pic-Time. The goal is a gallery-ready JPEG set that meets each platform's size guidelines, looks sharp at preview scale, and contains no sensitive EXIF data.</p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-7 my-6">
                <ol class="flex flex-col gap-5 list-none p-0 m-0">
                    {#each [
                        { n: 1, title: 'Capture and ingest', body: 'Shoot RAW + HIF/HEIF on Canon EOS R-series, Nikon Z, or Sony Alpha bodies. Use the HIF/HEIF as an immediately usable 10-bit preview during culling; rely on RAW for serious color grading and exposure recovery. Ingest into Lightroom Classic or Capture One.' },
                        { n: 2, title: 'Edit on RAW, export one master JPEG set', body: 'Lock in final edits on RAW files. Export a single high-quality JPEG set at full resolution (typically 4,000–6,000 px long edge, quality 90+) as your master archive and print-ready output.' },
                        { n: 3, title: 'Create web-ready gallery set via Mochify', body: null },
                        { n: 4, title: 'Upload to gallery and archive', body: 'Upload the Mochify-processed set directly to Pixieset or SmugMug. Files are already compatible, properly sized, and privacy-clean. Keep full-res JPEGs and RAW files in your studio archive.' },
                    ] as step}
                        <li class="flex gap-4 items-start m-0 p-0">
                            <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">{step.n}</span>
                            <div class="flex-1 pt-0.5">
                                <strong class="block text-[#4A2C2C] font-black mb-1">{step.title}</strong>
                                {#if step.body}
                                    <p class="text-[#6C3F31] text-base m-0">{step.body}</p>
                                {:else}
                                    <p class="text-[#6C3F31] text-base mb-2">Drag your exported full-res JPEGs (or the HIF/HEIF exports directly) into Mochify and describe the task using Magic Flow:</p>
                                    <blockquote class="border-l-4 border-[#F06292] bg-[#FFF0F5] rounded-r-xl px-4 py-3 italic text-[#4A2C2C] text-sm my-2">"Batch convert these wedding selects to sRGB JPEGs for Pixieset, 3,600 px long edge, under 2 MB each, strip GPS and all EXIF."</blockquote>
                                    <blockquote class="border-l-4 border-[#F06292] bg-[#FFF0F5] rounded-r-xl px-4 py-3 italic text-[#4A2C2C] text-sm my-2">"Convert these wedding JPEGs for SmugMug upload, 4,000 px long edge, under 3 MB, sRGB, strip all EXIF including thumbnails."</blockquote>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ol>
                <p class="mt-6 pt-5 border-t border-pink-100 text-sm text-[#875F42]">🔒 Mochify processes all files in-memory. Nothing is written to disk, nothing is retained after your download completes, and your client imagery is never used for AI training or stored in any database.</p>
            </div>
        </section>

        <!-- Section 05 -->
        <section id="workflow-commercial">
            <SectionHeading>Workflow blueprint: commercial and product photographers</SectionHeading>
            <p>Commercial shooters supplying assets to Shopify, WooCommerce, Etsy, Amazon, and similar platforms need to balance visual quality against strict file size and dimension requirements, while keeping derivative management clean across multiple platforms.</p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-7 my-6">
                <ol class="flex flex-col gap-5 list-none p-0 m-0">
                    {#each [
                        { n: 1, title: 'Capture and color pipeline', body: 'Shoot tethered or to card in RAW + HEIF. Use HEIF for quick on-set review while RAW feeds the calibrated color workflow. Edit in Lightroom or Capture One, export a master "web base" JPEG at high quality with appropriate crop ratios.' },
                        { n: 2, title: 'Generate platform-specific derivatives with Mochify', body: null, prompts: [
                            '"Optimize these product photos for Shopify: 2,048 px square, high-quality JPEG under 500 KB, strip EXIF."',
                            '"Resize and compress for Etsy product listings: 2,000 px long edge, under 1 MB, sRGB JPEG, strip all metadata."',
                            '"Create AVIF copies of these hero images under 300 KB, suitable for responsive picture tags."',
                        ]},
                        { n: 3, title: 'Automate with CLI for repeatable shoots', body: null, code: 'mochify --prompt "Shopify product set: 2048px square JPEG under 500KB strip EXIF" ./shoot-exports/*.jpg --out ./shopify/' },
                        { n: 4, title: 'Integrate into CMS and DAM', body: 'Upload pre-processed files directly to Shopify or WooCommerce without installing image optimization apps. Maintain a folder structure that groups derivatives by platform so teams know exactly which files belong to which templates.' },
                    ] as step}
                        <li class="flex gap-4 items-start m-0 p-0">
                            <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">{step.n}</span>
                            <div class="flex-1 pt-0.5">
                                <strong class="block text-[#4A2C2C] font-black mb-1">{step.title}</strong>
                                {#if step.body}
                                    <p class="text-[#6C3F31] text-base m-0">{step.body}</p>
                                {:else if step.prompts}
                                    <p class="text-[#6C3F31] text-base mb-2">Use separate Magic Flow prompts per platform:</p>
                                    {#each step.prompts as prompt}
                                        <blockquote class="border-l-4 border-[#F06292] bg-[#FFF0F5] rounded-r-xl px-4 py-3 italic text-[#4A2C2C] text-sm my-2">{prompt}</blockquote>
                                    {/each}
                                {:else if step.code}
                                    <p class="text-[#6C3F31] text-base mb-2">If you work with the Mochify CLI, encode these as repeatable scripts:</p>
                                    <div class="bg-slate-900 text-slate-300 p-5 rounded-xl font-mono text-sm shadow-inner border border-slate-700 overflow-x-auto">{step.code}</div>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ol>
                <p class="mt-6 pt-5 border-t border-pink-100 text-sm text-[#875F42]">🔒 In-memory processing, zero retention. Your embargoed product imagery never touches a persistent third-party server.</p>
            </div>
        </section>

        <!-- Section 06 -->
        <section id="workflow-editorial">
            <SectionHeading>Workflow blueprint: editorial and press photographers</SectionHeading>
            <p>Press and editorial photographers file on tight deadlines. Wire services and newsroom systems expect JPEG with specific color profiles, size constraints, and controlled metadata. You need to keep caption IPTC data intact while removing GPS coordinates that could compromise sources or reveal sensitive locations.</p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-7 my-6">
                <ol class="flex flex-col gap-5 list-none p-0 m-0">
                    {#each [
                        { n: 1, title: 'On-device HEIF capture', body: 'Shoot in HEIF on compatible camera bodies or phones for smaller file sizes and 10-bit HDR capture. In the field, use camera-native or mobile app JPEG export for immediate filing when connectivity is marginal and speed is the only priority.' },
                        { n: 2, title: 'Mochify pass before filing (when connectivity allows)', body: null, prompt: '"Convert these HEIF files to sRGB JPEG for newswire, 3,000 px long edge, under 1.5 MB, preserve caption IPTC but strip GPS coordinates."' },
                        { n: 3, title: 'Delivery via FTP or newsroom CMS', body: 'File the resulting JPEGs through FTP or the newsroom CMS. Files meet size and color requirements and carry only the necessary metadata.' },
                    ] as step}
                        <li class="flex gap-4 items-start m-0 p-0">
                            <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">{step.n}</span>
                            <div class="flex-1 pt-0.5">
                                <strong class="block text-[#4A2C2C] font-black mb-1">{step.title}</strong>
                                {#if step.body}
                                    <p class="text-[#6C3F31] text-base m-0">{step.body}</p>
                                {:else}
                                    <p class="text-[#6C3F31] text-base mb-2">From a laptop or tablet, run a quick batch through Mochify before submission:</p>
                                    <blockquote class="border-l-4 border-[#F06292] bg-[#FFF0F5] rounded-r-xl px-4 py-3 italic text-[#4A2C2C] text-sm my-2">{step.prompt}</blockquote>
                                    <p class="text-[#6C3F31] text-sm mt-2">This keeps the captioning metadata that wire services require while removing location data. The in-memory pipeline means no source imagery touches a third-party server persistently.</p>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ol>
                <p class="mt-6 pt-5 border-t border-pink-100 text-sm text-[#875F42]">🔒 Selective EXIF stripping via Magic Flow — remove GPS while preserving caption and copyright IPTC in a single prompt.</p>
            </div>
        </section>

        <!-- Section 07 -->
        <section id="privacy-exif">
            <SectionHeading>Privacy and EXIF: what your images are silently broadcasting</SectionHeading>
            <p>Every JPEG and HEIF file you export carries a metadata payload. Most photographers have never looked at it. They should.</p>
            <p>EXIF data in a standard JPEG or HEIF file typically includes GPS latitude and longitude (often accurate to within a few metres), timestamp and timezone, camera make, model, and serial number, lens information, an embedded JPEG thumbnail of the original uncropped frame, and the software version used in post-production.</p>

            <InfoBox type="warning" title="The thumbnail problem">
                If you shoot wide, crop tight, and export a JPEG without stripping EXIF, the embedded thumbnail in the file often shows the uncropped original. A client or marketplace can extract that thumbnail and see content you deliberately kept out of the final image.
            </InfoBox>

            <p>Marketplace platforms like eBay and Etsy sometimes perform their own re-compression on upload — but they do not reliably strip EXIF in the process. That means even if the platform generates its own display version of your image, the underlying metadata may still be present and readable by anyone who downloads the file.</p>
            <p>Stripping EXIF removes GPS coordinates, device IDs, timestamps, and embedded thumbnails in a fraction of a second and barely changes file size (typically less than 1% of total file size). There is no quality trade-off. There is no reason not to strip it on every file that leaves your control.</p>
        </section>

        <!-- Section 08 -->
        <section id="how-mochify-fits">
            <SectionHeading>How Mochify fits into a pro photographer workflow</SectionHeading>
            <p>Mochify is an in-memory, zero-retention image processing engine. Files stream through RAM and are discarded immediately after processing — nothing is written to disk, nothing is retained for AI training, and nothing is stored beyond the instant your download completes.</p>
            <p>For photographers, that architecture matters. Wedding and portrait photographers handle client imagery under implied (and often contractual) privacy obligations. Commercial and editorial photographers work with embargoed products and sensitive subjects. Running those files through a generic online converter with an opaque privacy policy is not acceptable — but neither is setting up and maintaining a complex self-hosted pipeline.</p>
            <p>Mochify's interface is natural language first, via Magic Flow. You describe the task — "convert these HIF files to sRGB JPEG for client gallery, 3,600 px, under 2 MB, strip all EXIF" — and the engine resolves the appropriate format, quality, resize, and metadata settings automatically. No format dropdown, no quality slider to guess at, no separate EXIF-stripping tool.</p>
            <p>The same natural language interface is available across four surfaces: the browser app at mochify.app (drag, describe, download; up to 25 files per batch), the REST API for scripted workflows, the CLI for folder-level batch processing, and an MCP server for AI agent workflows via Claude Desktop and other MCP-compatible tools.</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 my-6">
                <table class="w-full min-w-[440px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Plan</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Images/month</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Max file size</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { plan: 'Free', images: '25', size: '20 MB', for: 'Testing, occasional single jobs' },
                            { plan: 'Lite — $7.99/month', images: '300', size: '75 MB', for: 'Part-time and emerging pros' },
                            { plan: 'Pro — $24.99/month', images: '1,200', size: '75 MB', for: 'Working pros, multi-shoot weeks' },
                        ] as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">{row.plan}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.images}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.size}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.for}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-[#875F42] italic">Annual plans (Lite and Pro) save 17% vs monthly. All tiers include Magic Flow, API, MCP, and all supported formats.</p>

            <div class="my-10 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3">Try Mochify free — no account needed</h3>
                <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6">Process your first files instantly. No signup, no data retained.</p>
                <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                    Start at mochify.app →
                </a>
            </div>
        </section>

        <!-- Section 09 -->
        <section id="technical-proof">
            <SectionHeading>Technical proof: file size, quality, and time savings</SectionHeading>
            <p>These are the numbers that matter for your actual workflow decisions.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Encoder efficiency</h3>
            <p>Mochify uses jpegli for JPEG output. Google's published benchmarks show jpegli at 2.8 bits per pixel (BPP) matching libjpeg-turbo at 3.7 BPP on subjective quality — a roughly 24% file size reduction at equivalent visual quality.</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                {#each [
                    { label: 'jpegli BPP', value: '2.8', desc: 'vs libjpeg-turbo at 3.7 BPP at equivalent quality' },
                    { label: 'JPEG size reduction', value: '~24%', desc: 'smaller files at equivalent visual quality via jpegli' },
                    { label: 'Batch time (25 files)', value: '<60s', desc: 'Canon HIF to sRGB JPEG at 3,600 px via Pro queue' },
                ] as stat}
                    <div class="bg-[#FFF9F5] rounded-2xl border border-[#FFE4D6] p-5">
                        <div class="text-xs font-black uppercase tracking-wider text-[#875F42] mb-2">{stat.label}</div>
                        <div class="text-3xl font-black text-[#4A2C2C] leading-none">{stat.value}</div>
                        <div class="text-xs text-[#875F42] mt-2">{stat.desc}</div>
                    </div>
                {/each}
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Modern format savings</h3>
            <p>A representative conversion for a commercial product shoot — 25 hero images at 3,200 px wide from Nikon Z HEIF originals:</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 my-6">
                <table class="w-full min-w-[380px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Output format</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Avg file size</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">vs JPEG baseline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { fmt: 'JPEG (libjpeg-turbo, q85)', size: '1.8 MB', diff: 'Baseline', color: '' },
                            { fmt: 'JPEG (jpegli, equivalent quality)', size: '1.3 MB', diff: '-28%', color: 'text-green-700 font-black' },
                            { fmt: 'WebP (quality 80)', size: '1.1 MB', diff: '-39%', color: 'text-green-700 font-black' },
                            { fmt: 'AVIF (quality 60)', size: '0.9 MB', diff: '-50%', color: 'text-green-700 font-black' },
                        ] as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.fmt}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.size}</td>
                                <td class="px-4 py-3 text-sm border-b border-pink-50 {row.color}">{row.diff}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Batch time</h3>
            <p>A 25-image batch of Canon or Fuji HIF files converted to sRGB JPEG at 3,600 px long edge via Mochify's Pro tier typically completes in under 60 seconds from upload to download. The same job handled via manual Lightroom export presets plus a separate EXIF-stripping tool plus a manual resize pass typically takes 8–15 minutes.</p>

            <InfoBox type="tip" title="Pro tip: time savings compound">
                Saving 8–15 minutes per shoot batch adds up to several hours per week for busy photographers. Across a full shooting season, that is real studio time recovered — not theoretical efficiency gains.
            </InfoBox>
        </section>

        <!-- FAQ -->
        <section id="faq">
            <SectionHeading>FAQ</SectionHeading>
            <div class="flex flex-col gap-7 mt-5">
                {#each [
                    {
                        q: 'Can Mochify accept Canon HIF files directly, without pre-converting them first?',
                        a: 'Yes. Mochify accepts HEIF and HIF files as direct inputs. You do not need to convert to JPEG or TIFF first — upload the HIF files from your camera card or Lightroom export folder, describe the output you want in plain English, and Mochify handles the conversion in a single pass.'
                    },
                    {
                        q: 'What happens to my files after Mochify processes them?',
                        a: "Nothing — because they are never stored. Mochify's pipeline is fully in-memory. Files stream through RAM during processing and are discarded immediately after your download completes. Nothing is written to disk, nothing is retained, and uploaded images are never used for AI training or added to any database."
                    },
                    {
                        q: 'Can I strip GPS from editorial images while keeping caption and copyright IPTC data?',
                        a: 'Yes. Use a prompt like "convert to JPEG for wire delivery, preserve caption and copyright IPTC, strip GPS coordinates." Magic Flow distinguishes between metadata types and applies selective stripping accordingly.'
                    },
                    {
                        q: 'What is jpegli, and why does it matter for my client gallery deliveries?',
                        a: "jpegli is Google's modern JPEG encoder. It produces standard JPEG files — compatible with every device, browser, and gallery platform — but at roughly 25-30% smaller file sizes than traditional libjpeg-turbo encoders at equivalent quality. Your clients see the same image quality; the files upload faster and take up less storage on gallery platforms."
                    },
                    {
                        q: 'Is AVIF worth using for client gallery deliveries yet?',
                        a: 'Not as your primary gallery format — gallery platforms still expect JPEG as the upload format, and AVIF browser support, while good (~90% of current releases), is not universal enough to replace JPEG for client-facing downloads. Use AVIF for your own website, portfolio, and any e-commerce platform where you control the frontend HTML. Deliver JPEG to clients and galleries.'
                    },
                    {
                        q: 'How many images can I process per month on the Pro plan?',
                        a: 'The Pro plan at $24.99/month includes 1,200 images per month with 25-file batches, 75 MB max file size, top priority queue, and full API and CLI access. That covers roughly 4–6 full wedding or commercial shoot deliveries per month.'
                    },
                    {
                        q: 'Does the Mochify CLI work with Lightroom export scripts?',
                        a: "Yes. The CLI accepts folder paths and glob patterns, so you can point it at a Lightroom export folder and run a single command to generate all platform derivative sets. Combine this with Lightroom's \"post-process action\" setting to trigger the CLI automatically after each export job."
                    },
                    {
                        q: 'What color profile should I use for web gallery delivery?',
                        a: 'sRGB. Most gallery platforms display images using sRGB color spaces, and files delivered in Adobe RGB or ProPhoto RGB will display with muted, undersaturated colors on any platform that does not perform color profile conversion. Specify sRGB in your Magic Flow prompt and Mochify converts the color space during processing.'
                    },
                ] as item}
                    <div class="border-b border-pink-50 pb-6 last:border-b-0 last:pb-0">
                        <h3 class="text-base font-black text-[#4A2C2C] mb-2 mt-0">{item.q}</h3>
                        <p class="text-[#6C3F31] text-base m-0">{item.a}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {#each [
                    { href: '/guides/fujifilm-hif-to-jpg', title: 'Fuji HIF to JPEG: X-T5, X-H2, X100VI', desc: 'Specific workflow for Fujifilm HIF files from X-series cameras.' },
                    { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'A complete breakdown of metadata types, privacy risks, and how to strip selectively.' },
                    { href: '/guides/2026-guide-next-gen-formats', title: 'WebP vs AVIF vs JPEG XL: 2026 Comparison', desc: 'Format comparison for web delivery, with real-world benchmark data.' },
                    { href: '/guides/jpegli-shopify-product-images', title: 'How to Use Jpegli for Shopify Product Images', desc: 'Platform-specific dimension guides and pre-upload workflows for product photography.' },
                    { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization (2026)', desc: 'Zero-retention workflows for NDA and commercial work.' },
                    { href: '/guides/should-i-optimize-images-before-upload', title: 'Should I Optimize Images Before I Upload?', desc: 'A practical guide to pre-upload optimization for every platform.' },
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
