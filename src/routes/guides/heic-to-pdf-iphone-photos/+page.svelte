<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "How to Convert iPhone Photos (HEIC) to PDF",
        description: "Convert iPhone HEIC photos to PDF on any device - iPhone, Mac, Windows, or online. Native methods, batch tips, and a one-click tool. No app needed.",
        category: "Image Formats",
        readTime: "12 min read",
        datePublished: "29 June 2026"
    };

    const related = [
        {
            title: "HIF/HEIF to JPEG for Professional Photographers →",
            href: "/guides/heif-to-jpeg-workflow-photographers-guide",
            desc: "Converting .HIF files from Canon, Sony, and Fujifilm mirrorless bodies, with a focus on preserving 10-bit quality."
        },
        {
            title: "Does HEIF/HEIC Work With Client Gallery Platforms? →",
            href: "/guides/does-heif-heic-work-with-client-galleries",
            desc: "Which hosting and delivery platforms accept HEIC natively and which require conversion before upload."
        },
        {
            title: "The Risks of EXIF Data in Image Compression →",
            href: "/guides/exif-data-risks-image-compression-2026",
            desc: "A full breakdown of what metadata travels with your images, how to check it, and when stripping it matters."
        },
        {
            title: "Privacy & Image Optimization: A Comprehensive Guide →",
            href: "/guides/privacy-image-optimization",
            desc: "How Mochify's zero-retention model works and what it means for privacy-sensitive image workflows."
        },
        {
            title: "Should I Shoot HEIF or JPEG on My Mirrorless Camera? →",
            href: "/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera",
            desc: "The tradeoffs in format choice at capture time, from file size and editing flexibility to compatibility."
        }
    ];

    const tocItems = [
        { num: "01", id: "why-heic-causes-compatibility-problems", label: "Why HEIC Causes Compatibility Problems" },
        { num: "02", id: "why-pdf-is-the-better-sharing-format", label: "Why PDF Is the Better Sharing Format" },
        { num: "03", id: "convert-heic-to-pdf-on-iphone-or-ipad", label: "Convert HEIC to PDF on iPhone or iPad" },
        { num: "04", id: "convert-heic-to-pdf-on-mac", label: "Convert HEIC to PDF on Mac" },
        { num: "05", id: "convert-heic-to-pdf-on-windows", label: "Convert HEIC to PDF on Windows" },
        { num: "06", id: "batch-conversions", label: "Batch Conversions: 10, 20, or 50 Photos" },
        { num: "07", id: "mochify-workflow", label: "Mochify Workflow: HEIC Photos to PDF" },
        { num: "08", id: "privacy-exif", label: "Privacy: What Happens to Your EXIF and Location Data" },
        { num: "09", id: "troubleshooting", label: "Troubleshooting Common Failures" },
        { num: "10", id: "cheat-sheet", label: "Quick Reference Cheat Sheet" },
    ];

    const faqs = [
        {
            q: "Can I convert HEIC to PDF without installing anything on Windows?",
            a: "Yes, if your Windows 11 build already includes the HEIF Image Extensions (some OEM configurations do), you can use Photos > Print > Microsoft Print to PDF with no additional installs. If not, you need to install the extension from the Microsoft Store, or use an online converter that runs in the browser."
        },
        {
            q: "Does converting HEIC to PDF reduce image quality?",
            a: `The conversion itself doesn't add a compression artefact the way a JPEG re-encode would. PDF embeds the image data, and for most conversion paths the output quality matches what you'd see viewing the original HEIC. The exception is if you choose a very low-resolution layout option in a print dialog — the "4 images per page" layout on Windows, for example, will scale photos down to fit the page.`
        },
        {
            q: "Can I convert HEIC to PDF on Android?",
            a: "Android 10 and later support HEIC in principle, but the codec is OEM-dependent — not every Android device can open HEIC natively. There's no standard built-in route to HEIC-to-PDF on Android. The cleanest option is an online converter that runs in the browser, which sidesteps the local codec question entirely."
        },
        {
            q: "Will my location data appear in the PDF?",
            a: "It depends on the tool. Many generic conversion paths strip EXIF data, including GPS coordinates, during the PDF creation process. Some dedicated tools preserve it. If you want to be certain, use a metadata viewer to inspect the output PDF, or treat the original HEIC as your EXIF archive and assume the PDF may not carry it. If you're sharing photos of sensitive locations, that automatic strip is usually a good outcome."
        },
        {
            q: "How many HEIC photos can I combine into one PDF?",
            a: "With native tools on Mac (Finder Quick Action or Preview), there's no documented page limit — users routinely handle tens of images. On iPhone, the Files app \"Create PDF\" is also undocumented on limits, constrained in practice by device memory. Online free tiers typically cap at 15–50 files per batch. Mochify's HEIC-to-PDF tool handles up to 20 files per conversion."
        },
        {
            q: "Is there a way to automate HEIC-to-PDF on iPhone?",
            a: `Yes — build a Shortcut with three actions: "Select Photos," "Make PDF," and "Save File." Once set up, you can trigger it from the home screen or the share sheet in the Photos app. Apple's Shortcuts framework includes both actions natively, so no third-party app is required.`
        },
        {
            q: "Why doesn't my email client show HEIC photos inline?",
            a: "Most email clients outside Apple's ecosystem don't support HEIC rendering — they either display the file as an attachment or ignore the inline display entirely. If you need recipients on Windows, Android, or webmail to see your photos without opening a separate file, convert to JPEG for inline display or attach a PDF as a document."
        },
        {
            q: "What's the difference between .HEIC and .HEIF?",
            a: "They're from the same format family. .HEIC is Apple's iPhone variant using HEVC encoding. .HEIF is the broader container format that professional cameras from Canon, Sony, and Fujifilm also write — often as .HIF files with 10-bit colour and HDR metadata. If you have .HIF files from a mirrorless camera rather than an iPhone, that's a different workflow."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/heic-to-pdf-iphone-photos" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Convert iPhone Photos (HEIC) to PDF",
        "description": "Convert iPhone HEIC photos to PDF on any device - iPhone, Mac, Windows, or online. Native methods, batch tips, and a one-click tool. No app needed.",
        "url": "https://mochify.app/guides/heic-to-pdf-iphone-photos",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/heic-to-pdf-iphone-photos"
        },
        "datePublished": "2026-06-29",
        "dateModified": "2026-06-29",
        "inLanguage": "en-GB",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
                {"@type": "ListItem", "position": 3, "name": "How to Convert iPhone Photos (HEIC) to PDF", "item": "https://mochify.app/guides/heic-to-pdf-iphone-photos"}
            ]
        },
        "about": [
            { "@type": "Thing", "name": "HEIC" },
            { "@type": "Thing", "name": "PDF conversion" },
            { "@type": "Thing", "name": "iPhone photos" },
            { "@type": "Thing", "name": "HEIF image format" }
        ],
        "keywords": "heic to pdf, convert iphone photos to pdf, heic pdf iphone, heic pdf mac, heic pdf windows"
    }
    </script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can I convert HEIC to PDF without installing anything on Windows?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, if your Windows 11 build already includes the HEIF Image Extensions (which some OEM configurations do), you can use Photos > Print > Microsoft Print to PDF with no additional installs. If not, you need to install the extension from the Microsoft Store, or use an online converter that runs in the browser."
                }
            },
            {
                "@type": "Question",
                "name": "Does converting HEIC to PDF reduce image quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The conversion itself does not add a compression artefact the way a JPEG re-encode would. PDF embeds the image data, and for most conversion paths the output quality matches what you would see viewing the original HEIC. The exception is if you choose a very low-resolution layout option in a print dialog - the '4 images per page' layout on Windows, for example, will scale photos down to fit the page."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert HEIC to PDF on Android?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Android 10 and later support HEIC in principle, but the codec is OEM-dependent - not every Android device can open HEIC natively. There is no standard built-in route to HEIC-to-PDF on Android. The cleanest option is an online converter that runs in the browser, which sidesteps the local codec question entirely."
                }
            },
            {
                "@type": "Question",
                "name": "Will my location data appear in the PDF?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It depends on the tool. Many generic conversion paths strip EXIF data, including GPS coordinates, during the PDF creation process. Some dedicated tools preserve it. If you want to be certain, use a metadata viewer to inspect the output PDF, or treat the original HEIC as your EXIF archive and assume the PDF may not carry it."
                }
            },
            {
                "@type": "Question",
                "name": "How many HEIC photos can I combine into one PDF?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With native tools on Mac (Finder Quick Action or Preview), there is no documented page limit. On iPhone, the Files app Create PDF is also undocumented on limits, constrained in practice by device memory. Online free tiers typically cap at 15-50 files per batch. Mochify's HEIC-to-PDF tool handles up to 20 files per conversion."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a way to automate HEIC-to-PDF on iPhone?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes - build a Shortcut with three actions: Select Photos, Make PDF, and Save File. Once set up, you can trigger it from the home screen or the share sheet in the Photos app. Apple's Shortcuts framework includes both actions natively, so no third-party app is required."
                }
            },
            {
                "@type": "Question",
                "name": "Why doesn't my email client show HEIC photos inline?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most email clients outside Apple's ecosystem do not support HEIC rendering - they either display the file as an attachment or ignore the inline display entirely. If you need recipients on Windows, Android, or webmail to see your photos without opening a separate file, convert to JPEG for inline display or attach a PDF as a document."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between .HEIC and .HEIF?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "They are from the same format family. .HEIC is Apple's iPhone variant using HEVC encoding. .HEIF is the broader container format that professional cameras from Canon, Sony, and Fujifilm also write - often as .HIF files with 10-bit colour and HDR metadata. If you have .HIF files from a mirrorless camera rather than an iPhone, that is a different workflow."
                }
            }
        ]
    }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <!-- Header -->
    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.datePublished}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            How to Convert iPhone Photos (HEIC) to PDF
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            iPhone photos save as HEIC by default, and HEIC causes compatibility headaches the moment you need to share a document: Windows machines often can't open it, browsers don't render it, and submission portals almost universally want a single PDF. This guide covers every practical conversion path — native iPhone methods with no apps required, Mac and Windows workflows, online tools, and how to convert a batch of HEIC photos into one clean, multi-page PDF.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published June 2026 by the Mochify Engineering Team.</strong>
                All conversion paths tested on iOS 18, macOS Sequoia, and Windows 11 — native-only methods included, no paid apps required.
            </p>
        </div>
    </header>

    <!-- Table of Contents -->
    <section class="mb-12">
        <SectionHeading>What's in This Guide</SectionHeading>
        <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner" aria-label="Table of contents">
            <ul class="space-y-3">
                {#each tocItems as item}
                    <li>
                        <a href="#{item.id}" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.num}</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </section>

    <!-- Article body -->
    <div class="space-y-14 text-lg text-[#6C3F31] leading-relaxed">

        <!-- Section 1 -->
        <section id="why-heic-causes-compatibility-problems" class="scroll-mt-24">
            <SectionHeading>Why HEIC Causes Compatibility Problems</SectionHeading>
            <p class="mb-4">
                HEIC is Apple's format for iPhone photos — efficient, high quality, and essentially invisible on Apple hardware. Off Apple, it's a different story. Windows requires a separate codec from the Microsoft Store to open HEIC files at all, and that codec may be blocked entirely on managed corporate machines. As of early 2026, <a href="https://caniuse.com/heif" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">no major browser supports HEIC natively</a> — Chrome, Firefox, and Edge will not display a <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded text-sm border border-pink-100">.heic</code> file. Platforms like WordPress and Shopify either reject HEIC uploads outright or silently convert them on the server side.
            </p>
            <p class="mb-4">
                The format is a HEIF container using HEVC compression — technically capable and space-efficient, carrying about twice the image quality per byte of JPEG. But that encoding depends on hardware decoding support that isn't guaranteed outside Apple's ecosystem. Android 10 and later can technically support HEIC, but only when device manufacturers ship the required codecs, which makes Android compatibility vendor-dependent rather than reliable.
            </p>
            <p class="mb-4">
                HEIC also carries EXIF metadata by default: the camera model, timestamp, and — if Location Services is enabled for the Camera app — the GPS coordinates of where the photo was taken. All of that travels with the file unless a tool explicitly strips it.
            </p>

            <InfoBox type="note" title="Note on .HIF files from professional cameras">
                Canon, Sony, and Fujifilm cameras write <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded text-sm border border-pink-100">.HIF</code> files using the same HEIF standard underneath, but that's a different workflow for a different audience. If your file is <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded text-sm border border-pink-100">.HIF</code> from a mirrorless body, see the <a href="/guides/heif-to-jpeg-workflow-photographers-guide" class="text-[#F06292] hover:text-[#D81B60] transition-colors">HIF/HEIF to JPEG for Professional Photographers</a> guide. This guide covers iPhone <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded text-sm border border-pink-100">.HEIC</code> only.
            </InfoBox>
        </section>

        <!-- Section 2 -->
        <section id="why-pdf-is-the-better-sharing-format" class="scroll-mt-24">
            <SectionHeading>Why PDF Is the Better Sharing Format</SectionHeading>
            <p class="mb-4">
                PDF is universally accepted and opens consistently on every platform — no codecs, no app dependencies. For multi-photo submissions, it keeps everything in one file in the right order, which matters for assignment portals, print shops, and scanning services.
            </p>
            <p class="mb-4">
                Adobe notes that PDF's main strength is consistency: "a PDF's content will always display consistently across any device," which is why printers prefer it. Prepress guidance from Swift Publisher is direct: "almost all print shops accept materials in the PDF and TIFF formats" — HEIC doesn't appear on that list. Scanning and recognition platforms like PaperSurvey recommend PDF specifically because it combines multiple pages into one file and works universally across scanners and OCR pipelines.
            </p>
            <p class="mb-4">
                If you're submitting coursework, you've almost certainly hit a portal that requires "one PDF only" and won't accept a folder of images. That preference is well-founded: a PDF keeps the page order fixed, compresses predictably, and doesn't require the recipient to manage ten separate files.
            </p>
            <p class="mb-4">
                Converting directly to PDF rather than going HEIC to JPEG first also saves a step and avoids the quality loss of an extra JPEG compression pass. You end up with the single-file format most workflows actually want.
            </p>
        </section>

        <!-- Section 3 -->
        <section id="convert-heic-to-pdf-on-iphone-or-ipad" class="scroll-mt-24">
            <SectionHeading>Convert HEIC to PDF on iPhone or iPad</SectionHeading>
            <p class="mb-4">
                iPhone and iPad have three built-in routes to PDF, none of which require a third-party app. Apple doesn't label any of them "convert HEIC to PDF" — they're general-purpose PDF tools that happen to work equally well on HEIC files.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-3">Route 1: Share &gt; Print &gt; Pinch &gt; Save to Files</h3>
            <p class="mb-3">The most reliable method for a single photo or a small set.</p>
            <ol class="mb-4 space-y-2 list-decimal pl-6">
                <li>Open the photo in the <strong class="text-[#4A2C2C]">Photos</strong> app.</li>
                <li>Tap the <strong class="text-[#4A2C2C]">Share</strong> button (the box with an upward arrow).</li>
                <li>Choose <strong class="text-[#4A2C2C]">Print</strong>.</li>
                <li>In the print preview, <strong class="text-[#4A2C2C]">pinch outward</strong> on the preview thumbnail to open a full-screen PDF view.</li>
                <li>Tap the <strong class="text-[#4A2C2C]">Share</strong> button again, then choose <strong class="text-[#4A2C2C]">Save to Files</strong>.</li>
                <li>Pick a folder and save — your HEIC photo is now a PDF.</li>
            </ol>
            <p class="mb-4">You can set the paper size (A4, Letter) before completing the share step. On iOS 18, this workflow is unchanged from earlier iOS versions.</p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-3">Route 2: Files App &gt; Quick Actions &gt; Create PDF</h3>
            <p class="mb-3">The faster route when you have multiple photos to combine into one PDF.</p>
            <ol class="mb-4 space-y-2 list-decimal pl-6">
                <li>Open the <strong class="text-[#4A2C2C]">Files</strong> app and save your HEIC photos there first (from Photos, Share &gt; Save to Files for each one).</li>
                <li>In Files, tap <strong class="text-[#4A2C2C]">Select</strong> in the top right.</li>
                <li>Choose the HEIC files you want in the PDF.</li>
                <li>Tap the <strong class="text-[#4A2C2C]">(...)</strong> button, then choose <strong class="text-[#4A2C2C]">Create PDF</strong>.</li>
            </ol>
            <p class="mb-4">Files produces a single multi-page PDF in the same folder. The page order matches the selection order, so tap files in the order you want them to appear.</p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-3">Route 3: Shortcuts Automation</h3>
            <p class="mb-4">
                If you regularly convert batches of photos, a Shortcut that chains <strong class="text-[#4A2C2C]">Select Photos &gt; Make PDF &gt; Save File</strong> is worth setting up. Tap it from your home screen or share sheet, choose your photos, and it saves the resulting PDF straight to Files. Apple's Shortcuts framework includes both the "Make PDF" and "Save File" actions natively — no third-party apps required.
            </p>
        </section>

        <!-- Section 4 -->
        <section id="convert-heic-to-pdf-on-mac" class="scroll-mt-24">
            <SectionHeading>Convert HEIC to PDF on Mac</SectionHeading>
            <p class="mb-4">
                macOS has supported HEIC since High Sierra (10.13), so these conversion tools work without any setup on a modern Mac.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-3">Preview: Export as PDF</h3>
            <ol class="mb-4 space-y-2 list-decimal pl-6">
                <li>Open the HEIC file in <strong class="text-[#4A2C2C]">Preview</strong> — double-click it in Finder, or drag it onto Preview.</li>
                <li>Go to <strong class="text-[#4A2C2C]">File &gt; Export</strong>.</li>
                <li>In the Format pop-up menu, choose <strong class="text-[#4A2C2C]">PDF</strong>.</li>
                <li>Name the file and save.</li>
            </ol>
            <p class="mb-4">For multiple images in one PDF: open all the HEIC files in a single Preview window, select them all in the sidebar, then use File &gt; Export. Each image becomes one page.</p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-3">Finder Quick Action: Create PDF</h3>
            <p class="mb-3">The fastest route for a batch.</p>
            <ol class="mb-4 space-y-2 list-decimal pl-6">
                <li>Select all the HEIC files in Finder.</li>
                <li>Right-click (or Control-click) &gt; <strong class="text-[#4A2C2C]">Quick Actions &gt; Create PDF</strong>.</li>
            </ol>
            <p class="mb-4">Finder creates a multi-page PDF in the same folder. Pages appear in the order the files were selected, so sort by name or date first if order matters. There's no documented hard limit on the number of images you can combine this way.</p>
        </section>

        <!-- Section 5 -->
        <section id="convert-heic-to-pdf-on-windows" class="scroll-mt-24">
            <SectionHeading>Convert HEIC to PDF on Windows</SectionHeading>
            <p class="mb-4">
                Windows support for HEIC is real but conditional. Windows 11 handles HEIC through the HEIF Image Extensions, published by Microsoft via the Microsoft Store. Some OEM builds include this by default; others don't. On locked-down corporate machines where the Store is blocked by policy, HEIC files may simply be unreadable without administrator intervention.
            </p>
            <p class="mb-4">
                To check: try opening a HEIC file in the Photos app. If Windows prompts you to install the HEIF Image Extension from the Store, you need it. <a href="https://learn.microsoft.com/en-us/windows/win32/wic/heif-codec" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">Microsoft's HEIF codec documentation</a> treats this as an extension rather than a core OS feature, which is why it doesn't ship everywhere by default.
            </p>
            <p class="mb-3">Once HEIC opens in Photos:</p>
            <ol class="mb-4 space-y-2 list-decimal pl-6">
                <li>Open your HEIC file in <strong class="text-[#4A2C2C]">Photos</strong> (or Paint, once codecs are installed).</li>
                <li>Press <strong class="text-[#4A2C2C]">Ctrl+P</strong> to Print, or use File &gt; Print.</li>
                <li>Set the printer to <strong class="text-[#4A2C2C]">Microsoft Print to PDF</strong>.</li>
                <li>Choose your paper size (A4 or Letter) and orientation.</li>
                <li>Click <strong class="text-[#4A2C2C]">Print</strong>, name the file, and save.</li>
            </ol>
            <p class="mb-4">
                For multiple photos in one PDF: select them all in File Explorer, right-click &gt; <strong class="text-[#4A2C2C]">Print</strong>, choose Microsoft Print to PDF, set the layout (1, 2, or 4 images per page), then click Print.
            </p>
        </section>

        <!-- Section 6 -->
        <section id="batch-conversions" class="scroll-mt-24">
            <SectionHeading>Batch Conversions: 10, 20, or 50 Photos</SectionHeading>
            <p class="mb-4">
                For 10–50 photos, all the native methods above work without hitting any documented limits. Here's what to reach for depending on where you are:
            </p>
            <div class="overflow-x-auto rounded-2xl border border-pink-100 shadow-sm mb-4">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="px-5 py-3 text-left font-bold text-[#4A2C2C] border-b border-pink-100">Platform</th>
                            <th class="px-5 py-3 text-left font-bold text-[#4A2C2C] border-b border-pink-100">Best batch method</th>
                            <th class="px-5 py-3 text-left font-bold text-[#4A2C2C] border-b border-pink-100">Limit</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50">
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">iPhone / iPad</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Files app &gt; Create PDF</td>
                            <td class="px-5 py-3 text-[#6C3F31]">No documented limit; practical limit is device memory</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Mac</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Finder Quick Action &gt; Create PDF</td>
                            <td class="px-5 py-3 text-[#6C3F31]">No documented limit</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Windows</td>
                            <td class="px-5 py-3 text-[#6C3F31]">File Explorer &gt; Print &gt; Microsoft Print to PDF</td>
                            <td class="px-5 py-3 text-[#6C3F31]">No documented limit; RAM-bound</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Online tools</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Service-dependent</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Typically 15–50 files, 50 MB per file on free tiers</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Mochify</td>
                            <td class="px-5 py-3 text-[#6C3F31]"><a href="/solutions/heif-to-pdf" class="text-[#F06292] hover:text-[#D81B60] transition-colors">mochify.app/solutions/heif-to-pdf</a></td>
                            <td class="px-5 py-3 text-[#6C3F31]">Up to 20 files per conversion</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="mb-4">
                Online converters are useful for one-off jobs when you're not on your usual machine. File size caps typically run 50–100 MB per file, and free tiers usually allow 15–50 files per batch. For large personal archives (hundreds of photos), you'll outgrow free tiers quickly.
            </p>
        </section>

        <!-- Section 7: Mochify Workflow -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <div class="bg-gradient-to-br from-[#FFF5F7] to-white border border-pink-100 rounded-3xl p-8 md:p-10">
                <h2 class="text-2xl font-black text-[#4A2C2C] mb-6 flex items-center gap-3">
                    <span class="w-1.5 h-7 bg-[#F06292] rounded-full inline-block flex-shrink-0"></span>
                    Mochify Workflow: HEIC Photos to PDF
                </h2>
                <p class="text-[#6C3F31] text-base mb-8 leading-relaxed">
                    The Mochify HEIC-to-PDF tool at <a href="/solutions/heif-to-pdf" class="text-[#D81B60] hover:text-[#F06292] font-semibold transition-colors">mochify.app/solutions/heif-to-pdf</a> bundles iPhone and iPad <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded text-sm border border-pink-100">.heic</code> files into a single, shareable multi-page PDF in seconds. Useful when you want a clean result without touching a print dialog, or when native methods produce PDFs with awkward margins or page sizes.
                </p>

                <ol class="space-y-5 list-none p-0 m-0 mb-8">
                    <li class="flex items-start gap-4">
                        <span class="flex-shrink-0 w-8 h-8 bg-[#F06292] text-white rounded-full flex items-center justify-center font-black text-sm">1</span>
                        <div class="pt-1 text-[#6C3F31] text-base">
                            <strong class="text-[#4A2C2C]">Go to mochify.app/solutions/heif-to-pdf.</strong> The tool opens directly in your browser — no account required to try it. Free accounts get 25 images per month; sign in for the full limit.
                        </div>
                    </li>
                    <li class="flex items-start gap-4">
                        <span class="flex-shrink-0 w-8 h-8 bg-[#F06292] text-white rounded-full flex items-center justify-center font-black text-sm">2</span>
                        <div class="pt-1 text-[#6C3F31] text-base">
                            <strong class="text-[#4A2C2C]">Drag in your .heic files or use the file picker.</strong> Up to 20 files per conversion. Seller and Pro plans raise the file size limit to 75 MB and the batch size to 25 files.
                        </div>
                    </li>
                    <li class="flex items-start gap-4">
                        <span class="flex-shrink-0 w-8 h-8 bg-[#F06292] text-white rounded-full flex items-center justify-center font-black text-sm">3</span>
                        <div class="pt-1 text-[#6C3F31] text-base">
                            <strong class="text-[#4A2C2C]">Download your PDF.</strong> Mochify converts the batch and returns a downloadable multi-page PDF with your photos in the order you uploaded them.
                        </div>
                    </li>
                </ol>

                <div class="border-t border-pink-100 pt-6 text-sm text-[#875F42] leading-relaxed">
                    <strong class="text-[#6C3F31]">Privacy:</strong> Your HEIC files are uploaded to <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded text-xs border border-pink-100">api.mochify.app</code> over HTTPS, processed in RAM, and wiped immediately after encoding. No disk write of the source file, no logs containing file data. The same zero-retention model applies here as to all image processing on Mochify. If you want JPEG output instead, the <a href="/heic-to-jpeg" class="text-[#875F42] hover:text-[#F06292] transition-colors">HEIC to JPEG converter</a> handles that separately.
                </div>
            </div>
        </section>

        <!-- Section 8 -->
        <section id="privacy-exif" class="scroll-mt-24">
            <SectionHeading>Privacy: What Happens to Your EXIF and Location Data</SectionHeading>
            <p class="mb-4">
                If Location Services is enabled for the Camera app when you take a photo, that GPS coordinate is embedded in the HEIC file. <a href="https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">Apple's personal safety guidance</a> is explicit: "when photos and videos that include location metadata are shared, the people you share them with may be able to access the location metadata and learn where it was taken."
            </p>
            <p class="mb-4">
                What happens to that EXIF data during HEIC-to-PDF conversion depends entirely on the tool — there is no consistent answer across platforms. Some generic conversion paths (including certain online converters) strip EXIF data, including GPS coordinates, during the PDF creation process. Some dedicated converter apps on iOS and macOS advertise explicit EXIF preservation. Apple's own tools don't document their EXIF handling at all.
            </p>
            <p class="mb-4">
                The safe approach: assume that any generic image-to-PDF path may strip EXIF data, and keep your original HEIC files if you need the metadata later. If you're sharing a PDF of photos taken at your home, at a private event, or of anything sensitive — that automatic strip is usually a feature, not a bug.
            </p>
            <p class="mb-4">
                For a thorough look at metadata risks in image workflows, see the <a href="/guides/exif-data-risks-image-compression-2026" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">EXIF Data Risks in Image Compression guide</a>. That article covers how to check what metadata a file carries and when stripping it matters most.
            </p>
        </section>

        <!-- Section 9 -->
        <section id="troubleshooting" class="scroll-mt-24">
            <SectionHeading>Troubleshooting Common Failures</SectionHeading>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-6 mb-3">"I can't open a HEIC file on Windows."</h3>
            <p class="mb-4">
                Install the HEIF Image Extensions from the Microsoft Store. If the Store is blocked (common in corporate environments), this may require administrator help. Alternatively, use an online converter or a Mac.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-6 mb-3">"My HEIC isn't available to convert — it shows a cloud icon."</h3>
            <p class="mb-4">
                If your iPhone photos are set to "Optimise iPhone Storage," the full-resolution originals live in iCloud while a lower-resolution thumbnail is kept on-device. The full file needs to download before any app can convert it. Tap the photo in the Photos app to trigger a download, wait for it to complete, then retry.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-6 mb-3">"The PDF came out rotated."</h3>
            <p class="mb-4">
                HEIC files store orientation in metadata rather than rotating the actual pixel data. Some converters — especially online tools — ignore this flag and output the photo sideways. Pre-rotate the photos in the Photos app before converting, or look for a "rotate" option in the converter you're using.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-6 mb-3">"Preview gave me a 'could not be exported' error."</h3>
            <p class="mb-4">
                This is usually resolved by using <strong class="text-[#4A2C2C]">File &gt; Save As</strong> instead of Export, or by updating macOS to the latest release. Occasionally it's a file permissions issue with the destination folder.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-6 mb-3">"The Files app Create PDF option is missing."</h3>
            <p class="mb-4">
                Make sure you're selecting files in Files, not in a gallery view. Go to the folder, tap Select, then choose the files — the (...) menu that appears should include Create PDF. If it doesn't appear, restart Files and try again.
            </p>
        </section>

        <!-- Section 10: Cheat Sheet -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Quick Reference Cheat Sheet</SectionHeading>
            <div class="overflow-x-auto rounded-2xl border border-pink-100 shadow-sm mb-4">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="px-5 py-3 text-left font-bold text-[#4A2C2C] border-b border-pink-100">Scenario</th>
                            <th class="px-5 py-3 text-left font-bold text-[#4A2C2C] border-b border-pink-100">Best method</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50">
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">One photo, on iPhone</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Share &gt; Print &gt; Pinch &gt; Save to Files</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Multiple photos, on iPhone</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Files app &gt; Select &gt; (...) &gt; Create PDF</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Batch on Mac</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Finder: select all &gt; Quick Actions &gt; Create PDF</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Batch on Mac, fine control</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Preview: open all in one window &gt; File &gt; Export</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Windows (Store available)</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Photos &gt; Print &gt; Microsoft Print to PDF</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Windows (Store blocked)</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Use online converter or Mac</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Up to 20 photos, any device</td>
                            <td class="px-5 py-3 text-[#6C3F31]"><a href="/solutions/heif-to-pdf" class="text-[#F06292] hover:text-[#D81B60] transition-colors">mochify.app/solutions/heif-to-pdf</a></td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Need JPEG, not PDF</td>
                            <td class="px-5 py-3 text-[#6C3F31]"><a href="/heic-to-jpeg" class="text-[#F06292] hover:text-[#D81B60] transition-colors">mochify.app/heic-to-jpeg</a></td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Want to check EXIF / GPS</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Keep original HEIC; inspect before sharing</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="px-5 py-3 text-[#6C3F31]">Hundreds of photos</td>
                            <td class="px-5 py-3 text-[#6C3F31]">Native Mac method (no documented batch limit)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-8 flex items-center gap-3">
                <span class="w-1.5 h-7 bg-[#F06292] rounded-full inline-block flex-shrink-0"></span>
                FAQ
            </h2>
            <div class="divide-y divide-pink-50">
                {#each faqs as faq}
                    <div class="py-6">
                        <h3 class="font-bold text-[#4A2C2C] text-lg mb-3">{faq.q}</h3>
                        <p class="text-[#6C3F31] text-base leading-relaxed">{faq.a}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- CTA -->
        <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3">Convert HEIC photos to PDF free</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base leading-relaxed">
                Convert up to 20 iPhone HEIC photos to a single PDF in seconds — no app to install, no account required to try it. Upload and download, done.
            </p>
            <a href="/solutions/heif-to-pdf" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline text-base">
                Convert HEIC to PDF at mochify.app →
            </a>
        </aside>

        <!-- Related guides -->
        <RelatedGuides guides={related} />

    </div>
</article>
