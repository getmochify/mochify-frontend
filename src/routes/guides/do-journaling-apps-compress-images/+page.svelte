<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Do Journaling Apps Compress Images? Avoid Storage Bloat.",
        seoTitle: "Do Journaling Apps Compress Images? Avoid Storage Bloat",
        description: "Most journaling apps skip real compression or make it worse. Day One converts HEIC to larger JPEGs. Here's how to fix storage bloat before it hits.",
        category: "Quick Guides",
        readTime: "4 min read",
        date: "May 18, 2026"
    };

    const related = [
                    { href: '/guides/exif-data-risks-image-compression-2026', title: 'EXIF Data Risks', desc: 'Why stripping metadata matters, especially for personal photo archives and journals.' },
                    { href: '/guides/history-image-compression-2026', title: 'History of Image Compression', desc: 'How we got from JPEG to AVIF and why modern formats matter for long-term storage.' },
                    { href: '/guides/heif-to-jpeg-workflow-photographers-guide', title: 'HEIF to JPEG Workflow', desc: 'A practical workflow for converting HEIC photos without the size penalty Day One introduces.' },
                    { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization', desc: 'Zero-retention compression explained - why it matters for personal photo archives.' },
                ];

    const toc = [
        { id: 'how-each-app-handles-images', label: 'How each app handles images' },
        { id: 'pain-points', label: 'Pain points: months 1–6 and beyond' },
        { id: 'fix-before-attach', label: 'Fix it before you attach' }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mochify.app/guides/do-journaling-apps-compress-images" />

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
        "image": "https://mochify.app/og/guides-do-journaling-apps-compress-images.png",
        "datePublished": "2026-05-18T12:00:00+00:00",
        "dateModified": "2026-05-18T12:00:00+00:00",
        "url": "https://mochify.app/guides/do-journaling-apps-compress-images",
        "about": [
            {"@type": "Thing", "name": "Image compression"},
            {"@type": "Thing", "name": "Journaling apps"},
            {"@type": "Thing", "name": "Storage management"},
            {"@type": "Thing", "name": "HEIC format"},
            {"@type": "Thing", "name": "Day One"}
        ],
        "keywords": "journaling apps image compression, Day One storage bloat, Apple Journal photos, journaling app storage, HEIC compression, image optimization, Mochify",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        }
        }
    </script>

    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/do-journaling-apps-compress-images"
        description={metadata.description}
        datePublished="2026-05-18"
        dateModified="2026-05-18"
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
			<AccentTitle title={metadata.title} accent="Journaling Apps" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Most journaling apps do little to nothing useful with your images. Some resize slightly, some convert formats in ways that actually increase file size, and none give you real control over compression. Your journal grows - and your storage shrinks.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-lg leading-relaxed text-[#6C3F31]">
                <strong>Published May 2026 by the Mochify Engineering Team.</strong> This guide covers how Day One, Apple Journal, GoodNotes, and others handle photo storage - and how to compress before you attach.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc} heading="What's in This Guide" />
        </section>

        <!-- Section 01 -->
        <section id="how-each-app-handles-images" class="scroll-mt-24">
            <SectionHeading>How Each App Handles Images</SectionHeading>

            <p class="mb-6">The table below summarises what each major journaling app actually does to your photos once you attach them.</p>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>App</th>
                            <th>Compression?</th>
                            <th>Typical Bloat Example</th>
                            <th>User Fixes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Day One</td>
                            <td>Resizes to 2100px (Premium: 3200px), converts to JPEG</td>
                            <td>Converts 2.4 MB HEIC to 4.8 MB JPG; GB growth despite iCloud</td>
                            <td>Offload to cloud manually; no upstream compression</td>
                        </tr>
                        <tr>
                            <td>Apple Journal</td>
                            <td>No clear compression; duplicates photos</td>
                            <td>180 MB for 4 photos; climbs past 700 MB for 20–30 MB originals; 1.3 GB local + 1.2 GB iCloud</td>
                            <td>None; users switch apps due to rapid accumulation</td>
                        </tr>
                        <tr>
                            <td>GoodNotes</td>
                            <td>Minimal; handwriting and images bloat files</td>
                            <td>20 GB+ for some users; 3 GB+ vs 1.3 GB in competitors</td>
                            <td>Export and re-import at lower res; compress PDFs externally</td>
                        </tr>
                        <tr>
                            <td>Reflect</td>
                            <td>Limited data; likely no proactive compression</td>
                            <td>No specific examples in 2024–2026 forums</td>
                            <td>N/A</td>
                        </tr>
                        <tr>
                            <td>Journey</td>
                            <td>Supports attachments; no compression details</td>
                            <td>Media suggestions fail or unsupported, implying full sizes</td>
                            <td>None specified</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>

            <p class="mb-4">The pattern is consistent: apps either skip compression or apply it in ways that backfire. Day One's HEIC-to-JPEG conversion is a textbook example of a format "fix" that doubles your file sizes instead of shrinking them.</p>

            <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6 flex gap-4 items-start">
                <div class="w-10 h-10 shrink-0 bg-pink-100 rounded-xl border border-pink-200 flex items-center justify-center text-lg">💡</div>
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-mochi-pink mb-2">Worth knowing</p>
                    <p class="text-base text-cocoa-deep leading-relaxed">HEIC was designed to save space. When Day One converts a 2.4 MB HEIC to a 4.8 MB JPEG, that's not compression - it's regression. Every photo you add doubles its footprint before it reaches your archive.</p>
                </div>
            </div>
        </section>

        <!-- Section 02 -->
        <section id="pain-points" class="scroll-mt-24">
            <SectionHeading>Pain Points</SectionHeading>

            <p class="mb-4">Month 1 feels fine. Month 6, your iPhone screams "Storage Full" mid-sync. Day One and Apple Journal users regularly report journals hitting multiple GBs within months, even with iCloud enabled - because iCloud syncs the bloat, it doesn't remove it.</p>

            <p class="mb-4">Apple Journal doesn't just store your photos - it duplicates them. Users report 180 MB for just 4 photos, climbing past 700 MB once you hit 20–30 MB of originals. One Apple Discussions thread documents 1.3 GB local storage plus 1.2 GB on iCloud for a single journal.</p>

            <p class="mb-4">GoodNotes becomes its own storage crisis. At 20 GB+ for some users - three to four times what competing apps consume - exports slow to a crawl and iCloud backups become a waiting game. There's no built-in fix; the workaround is exporting, re-importing at lower resolution, and hoping for the best.</p>

            <p>None of these apps let you set a maximum resolution, choose a format, or strip EXIF data before the image gets stored. You're at the app's mercy - and the app's defaults are not optimized for your storage budget.</p>
        </section>

        <!-- Section 03 -->
        <section id="fix-before-attach" class="scroll-mt-24">
            <SectionHeading>Fix It Before You Attach</SectionHeading>

            <p class="mb-4">Compress before you attach. That's the only reliable solution. <a href="https://mochify.app" class="text-mochi-pink font-bold hover:underline">Mochify</a> processes images in memory and deletes them immediately after - zero retention, no account required on the free tier, no data lingering on a server.</p>

            <p class="mb-6">Here's a practical workflow using Magic Flow, Mochify's natural-language interface:</p>

            <ol class="space-y-4 mb-8 list-none pl-0">
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-[10px] font-black text-mochi-pink mt-0.5">1</span>
                    <div>
                        <p class="mb-1"><strong>Batch your screenshots before adding them to your journal.</strong> Drag them into Mochify and type: <em>"resize screenshots to 1200px wide, convert to WebP at 80% quality"</em>. Magic Flow parses the intent and applies settings automatically - no format dropdowns, no manual configuration.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-[10px] font-black text-mochi-pink mt-0.5">2</span>
                    <div>
                        <p class="mb-1"><strong>Handle HEIC and JPEG photos in one pass.</strong> Type: <em>"convert HEIC and JPG to WebP, strip location and EXIF data"</em>. You'll typically see 80–90% file size reduction versus the originals Day One would have stored. A 4.8 MB JPEG from Day One's pipeline becomes roughly 400–600 KB.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-[10px] font-black text-mochi-pink mt-0.5">3</span>
                    <div>
                        <p class="mb-1"><strong>Run regular journal export cleanups.</strong> If you've already got a bloated archive, export your photos, batch-process them through Mochify, and re-import. It's a one-time fix that pays off across years of syncs.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-[10px] font-black text-mochi-pink mt-0.5">4</span>
                    <div>
                        <p class="mb-1"><strong>Use the API or CLI for automated workflows.</strong> If you're technically inclined, pipe images through the API with a plain-English description before they hit your journal app. The free tier covers 25 images per month with no account needed.</p>
                    </div>
                </li>
            </ol>

            <!-- CTA -->
            <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8">
                <p class="text-cocoa-deep leading-relaxed mb-6">Compress now - keep journaling forever. Drag your journal photos into Mochify and type <em>"convert to WebP at 80% quality, strip EXIF data"</em>. In-memory processing, zero retention, no account required.</p>
                <a href="https://mochify.app" class="inline-block bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm rounded-2xl px-6 py-3 shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] hover:-translate-y-0.5 transition-all no-underline">
                    Try it free at mochify.app
                </a>
            </div>
        </section>

        <!-- Related Guides -->
        <RelatedGuidesGrid guides={related} />

    </div>
</article>
