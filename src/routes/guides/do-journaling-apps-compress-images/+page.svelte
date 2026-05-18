<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Do Journaling Apps Compress Images? Avoid Storage Bloat.",
        description: "Most journaling apps skip real compression or make it worse. Day One converts HEIC to larger JPEGs. Here's how to fix storage bloat before it hits.",
        category: "Quick Guides",
        readTime: "4 min read",
        date: "May 18, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mochify.app/guides/do-journaling-apps-compress-images" />
    <link rel="canonical" href="https://mochify.app/guides/do-journaling-apps-compress-images" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Do Journaling Apps Compress Images? Avoid Storage Bloat.",
        "description": "Most journaling apps skip real compression or make it worse. Day One converts HEIC to larger JPEGs. Here's how to fix storage bloat before it hits.",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "datePublished": "2026-05-18",
        "dateModified": "2026-05-18",
        "url": "https://mochify.app/guides/do-journaling-apps-compress-images",
        "about": [
            {"@type": "Thing", "name": "Image compression"},
            {"@type": "Thing", "name": "Journaling apps"},
            {"@type": "Thing", "name": "Storage management"},
            {"@type": "Thing", "name": "HEIC format"},
            {"@type": "Thing", "name": "Day One"}
        ],
        "keywords": "journaling apps image compression, Day One storage bloat, Apple Journal photos, journaling app storage, HEIC compression, image optimisation, Mochify",
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
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Do Journaling Apps Compress Images?", "item": "https://mochify.app/guides/do-journaling-apps-compress-images" }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white md:rounded-3xl border border-pink-50 shadow-sm px-6 py-8 md:px-12 md:py-14">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-mochi-pink text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-cocoa-milk">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            {metadata.title}
        </h1>

        <p class="text-xl text-cocoa-deep opacity-90 leading-relaxed max-w-2xl mb-8">
            Most journaling apps do little to nothing useful with your images. Some resize slightly, some convert formats in ways that actually increase file size, and none give you real control over compression. Your journal grows — and your storage shrinks.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-cocoa-deep leading-relaxed">
                <strong>Published April 2026 by the Mochify Engineering Team.</strong> This guide covers how Day One, Apple Journal, GoodNotes, and others handle photo storage — and how to compress before you attach.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-cocoa-deep leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#how-each-app-handles-images" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">How each app handles images</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#pain-points" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Pain points: months 1–6 and beyond</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#fix-before-attach" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Fix it before you attach</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <!-- Section 01 -->
        <section id="how-each-app-handles-images" class="scroll-mt-24">
            <SectionHeading>How Each App Handles Images</SectionHeading>

            <p class="mb-6">The table below summarises what each major journaling app actually does to your photos once you attach them.</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 mb-6">
                <table class="w-full text-sm text-cocoa-deep border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-cocoa-milk border-b border-pink-100">App</th>
                            <th class="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-cocoa-milk border-b border-pink-100">Compression?</th>
                            <th class="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-cocoa-milk border-b border-pink-100">Typical Bloat Example</th>
                            <th class="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-cocoa-milk border-b border-pink-100">User Fixes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-pink-50 hover:bg-[#FFF5F7] transition-colors">
                            <td class="px-4 py-3 font-bold text-[#4A2C2C]">Day One</td>
                            <td class="px-4 py-3">Resizes to 2100px (Premium: 3200px), converts to JPEG</td>
                            <td class="px-4 py-3">Converts 2.4 MB HEIC to 4.8 MB JPG; GB growth despite iCloud</td>
                            <td class="px-4 py-3">Offload to cloud manually; no upstream compression</td>
                        </tr>
                        <tr class="border-b border-pink-50 hover:bg-[#FFF5F7] transition-colors">
                            <td class="px-4 py-3 font-bold text-[#4A2C2C]">Apple Journal</td>
                            <td class="px-4 py-3">No clear compression; duplicates photos</td>
                            <td class="px-4 py-3">180 MB for 4 photos; climbs past 700 MB for 20–30 MB originals; 1.3 GB local + 1.2 GB iCloud</td>
                            <td class="px-4 py-3">None; users switch apps due to rapid accumulation</td>
                        </tr>
                        <tr class="border-b border-pink-50 hover:bg-[#FFF5F7] transition-colors">
                            <td class="px-4 py-3 font-bold text-[#4A2C2C]">GoodNotes</td>
                            <td class="px-4 py-3">Minimal; handwriting and images bloat files</td>
                            <td class="px-4 py-3">20 GB+ for some users; 3 GB+ vs 1.3 GB in competitors</td>
                            <td class="px-4 py-3">Export and re-import at lower res; compress PDFs externally</td>
                        </tr>
                        <tr class="border-b border-pink-50 hover:bg-[#FFF5F7] transition-colors">
                            <td class="px-4 py-3 font-bold text-[#4A2C2C]">Reflect</td>
                            <td class="px-4 py-3">Limited data; likely no proactive compression</td>
                            <td class="px-4 py-3">No specific examples in 2024–2026 forums</td>
                            <td class="px-4 py-3">N/A</td>
                        </tr>
                        <tr class="hover:bg-[#FFF5F7] transition-colors">
                            <td class="px-4 py-3 font-bold text-[#4A2C2C]">Journey</td>
                            <td class="px-4 py-3">Supports attachments; no compression details</td>
                            <td class="px-4 py-3">Media suggestions fail or unsupported, implying full sizes</td>
                            <td class="px-4 py-3">None specified</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p class="mb-4">The pattern is consistent: apps either skip compression or apply it in ways that backfire. Day One's HEIC-to-JPEG conversion is a textbook example of a format "fix" that doubles your file sizes instead of shrinking them.</p>

            <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6 flex gap-4 items-start">
                <div class="w-10 h-10 shrink-0 bg-pink-100 rounded-xl border border-pink-200 flex items-center justify-center text-lg">💡</div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-mochi-pink mb-2">Worth knowing</p>
                    <p class="text-base text-cocoa-deep leading-relaxed">HEIC was designed to save space. When Day One converts a 2.4 MB HEIC to a 4.8 MB JPEG, that's not compression — it's regression. Every photo you add doubles its footprint before it reaches your archive.</p>
                </div>
            </div>
        </section>

        <!-- Section 02 -->
        <section id="pain-points" class="scroll-mt-24">
            <SectionHeading>Pain Points</SectionHeading>

            <p class="mb-4">Month 1 feels fine. Month 6, your iPhone screams "Storage Full" mid-sync. Day One and Apple Journal users regularly report journals hitting multiple GBs within months, even with iCloud enabled — because iCloud syncs the bloat, it doesn't remove it.</p>

            <p class="mb-4">Apple Journal doesn't just store your photos — it duplicates them. Users report 180 MB for just 4 photos, climbing past 700 MB once you hit 20–30 MB of originals. One Apple Discussions thread documents 1.3 GB local storage plus 1.2 GB on iCloud for a single journal.</p>

            <p class="mb-4">GoodNotes becomes its own storage crisis. At 20 GB+ for some users — three to four times what competing apps consume — exports slow to a crawl and iCloud backups become a waiting game. There's no built-in fix; the workaround is exporting, re-importing at lower resolution, and hoping for the best.</p>

            <p>None of these apps let you set a maximum resolution, choose a format, or strip EXIF data before the image gets stored. You're at the app's mercy — and the app's defaults are not optimised for your storage budget.</p>
        </section>

        <!-- Section 03 -->
        <section id="fix-before-attach" class="scroll-mt-24">
            <SectionHeading>Fix It Before You Attach</SectionHeading>

            <p class="mb-4">Compress before you attach. That's the only reliable solution. <a href="https://mochify.app" class="text-mochi-pink font-bold hover:underline">Mochify</a> processes images in memory and deletes them immediately after — zero retention, no account required on the free tier, no data lingering on a server.</p>

            <p class="mb-6">Here's a practical workflow using Magic Flow, Mochify's natural-language interface:</p>

            <ol class="space-y-4 mb-8 list-none pl-0">
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-xs font-black text-mochi-pink mt-0.5">1</span>
                    <div>
                        <p class="mb-1"><strong>Batch your screenshots before adding them to your journal.</strong> Drag them into Mochify and type: <em>"resize screenshots to 1200px wide, convert to WebP at 80% quality"</em>. Magic Flow parses the intent and applies settings automatically — no format dropdowns, no manual configuration.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-xs font-black text-mochi-pink mt-0.5">2</span>
                    <div>
                        <p class="mb-1"><strong>Handle HEIC and JPEG photos in one pass.</strong> Type: <em>"convert HEIC and JPG to WebP, strip location and EXIF data"</em>. You'll typically see 80–90% file size reduction versus the originals Day One would have stored. A 4.8 MB JPEG from Day One's pipeline becomes roughly 400–600 KB.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-xs font-black text-mochi-pink mt-0.5">3</span>
                    <div>
                        <p class="mb-1"><strong>Run regular journal export cleanups.</strong> If you've already got a bloated archive, export your photos, batch-process them through Mochify, and re-import. It's a one-time fix that pays off across years of syncs.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-xs font-black text-mochi-pink mt-0.5">4</span>
                    <div>
                        <p class="mb-1"><strong>Use the API or CLI for automated workflows.</strong> If you're technically inclined, pipe images through the API with a plain-English description before they hit your journal app. The free tier covers 25 images per month with no account needed.</p>
                    </div>
                </li>
            </ol>

            <!-- CTA -->
            <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8">
                <p class="text-cocoa-deep leading-relaxed mb-6">Compress now — keep journaling forever. Drag your journal photos into Mochify and type <em>"convert to WebP at 80% quality, strip EXIF data"</em>. In-memory processing, zero retention, no account required.</p>
                <a href="https://mochify.app" class="inline-block bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm rounded-2xl px-6 py-3 shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] hover:-translate-y-0.5 transition-all no-underline">
                    Try it free at mochify.app
                </a>
            </div>
        </section>

        <!-- Related Guides -->
        <section id="related-guides" class="scroll-mt-24">
            <SectionHeading>Related Guides</SectionHeading>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="/guides/exif-data-risks-image-compression-2026" class="group block bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all no-underline">
                    <h3 class="font-bold text-cocoa-deep group-hover:text-mochi-pink transition-colors mb-1">EXIF Data Risks →</h3>
                    <p class="text-sm text-cocoa-milk leading-relaxed">Why stripping metadata matters, especially for personal photo archives and journals.</p>
                </a>
                <a href="/guides/history-image-compression-2026" class="group block bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all no-underline">
                    <h3 class="font-bold text-cocoa-deep group-hover:text-mochi-pink transition-colors mb-1">History of Image Compression →</h3>
                    <p class="text-sm text-cocoa-milk leading-relaxed">How we got from JPEG to AVIF and why modern formats matter for long-term storage.</p>
                </a>
                <a href="/guides/heif-to-jpeg-workflow-photographers-guide" class="group block bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all no-underline">
                    <h3 class="font-bold text-cocoa-deep group-hover:text-mochi-pink transition-colors mb-1">HEIF to JPEG Workflow →</h3>
                    <p class="text-sm text-cocoa-milk leading-relaxed">A practical workflow for converting HEIC photos without the size penalty Day One introduces.</p>
                </a>
                <a href="/guides/privacy-image-optimization" class="group block bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all no-underline">
                    <h3 class="font-bold text-cocoa-deep group-hover:text-mochi-pink transition-colors mb-1">Privacy & Image Optimization →</h3>
                    <p class="text-sm text-cocoa-milk leading-relaxed">Zero-retention compression explained — why it matters for personal photo archives.</p>
                </a>
            </div>
        </section>

    </div>
</article>
