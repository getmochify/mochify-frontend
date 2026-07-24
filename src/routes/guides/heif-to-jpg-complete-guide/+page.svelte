<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "HEIF to JPG: The Complete Conversion Guide",
        description: "Convert HEIF (.HIF) files from Canon, Sony, and Fujifilm cameras to universally compatible JPG. Every method, the quality trade-offs, and batch workflows.",
        category: "Image Formats",
        readTime: "14 min read",
        date: "July 15, 2026",
        lastUpdated: "July 24, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100";

    const toc = [
        { n: '01', href: '#what-is-heif-and-why-does-your-camera-use-it', label: 'What is HEIF, and why does your camera use it?' },
        { n: '02', href: '#why-heif-files-need-converting-in-2026', label: 'Why HEIF files need converting in 2026' },
        { n: '03', href: '#how-to-convert-heif-to-jpg-every-method', label: 'How to convert HEIF to JPG: every method' },
        { n: '04', href: '#what-you-lose-converting-10-bit-heif-to-8-bit-jpg', label: 'What you lose converting 10-bit HEIF to 8-bit JPG' },
        { n: '05', href: '#should-you-keep-shooting-heif', label: 'Should you keep shooting HEIF?' },
        { n: '06', href: '#mochify-workflow', label: 'Mochify Workflow: HEIF to JPG in one prompt' },
        { n: '07', href: '#cheat-sheet', label: 'HEIF to JPG cheat sheet' },
        { n: '08', href: '#faq', label: 'FAQ' },
    ];

    const faqs = [
        {
            q: "How do I convert HEIF to JPG?",
            a: "On macOS, open the file in Preview and use File, Export, JPEG. On Windows, install the HEIF Image Extension and HEVC Video Extensions from the Microsoft Store, then export from Photos. Canon bodies convert in the Playback menu; Sony's Imaging Edge Desktop converts on the desktop. Online, Mochify converts up to 3 HEIF files per session free with no account."
        },
        {
            q: "Is HEIF the same as HEIC?",
            a: "Same format underneath (HEIF, ISO/IEC 23008-12), different hardware worlds. Professional cameras from Canon, Sony, and Fujifilm write .HIF files; iPhones write .HEIC. The workflows and tools differ, so pick the lane that matches your file: this guide for .HIF, or the HEIC to JPEG converter for iPhone files."
        },
        {
            q: "Can I convert HEIF to JPG without losing quality?",
            a: "Some loss is inherent: JPEG is 8-bit, so the HEIF's 10-bit tonal range (1,024 values per channel down to 256) is reduced in every conversion. In practice a good encoder at quality 85 or above makes the difference invisible in normal viewing. The most visible case is Canon HDR PQ files, where HDR-to-SDR tone mapping changes the look more than bit depth does."
        },
        {
            q: "Why won't my HEIF file open on Windows?",
            a: "Windows needs two codecs: the free HEIF Image Extension (bundled with Windows 11) and the HEVC Video Extensions, which cost $0.99 in the Microsoft Store because of HEVC patent licensing. Without the HEVC codec, the Photos app cannot decode the image data inside the HEIF container."
        },
        {
            q: "Can browsers display HEIF images?",
            a: "Only Safari (version 17 and later). Chrome, Edge, and Firefox have no HEIF support in any version, which leaves global browser coverage at about 13.6% per caniuse.com. For web use, convert HEIF to JPG, WebP, or AVIF."
        },
        {
            q: "Does converting HEIF to JPG remove the metadata?",
            a: "Not by default in most tools - platform converters like Preview and DPP generally carry EXIF across, including GPS coordinates. Decide deliberately: in Mochify, state it in the prompt (\"convert to JPG and strip all metadata,\" or \"remove GPS but keep copyright\"), and the output matches the instruction."
        },
        {
            q: "What is the best JPEG quality setting when converting from HEIF?",
            a: "Quality 85-90 is the sweet spot for delivery: clean enough for print and screen, without the wasted bytes above 95. Below 80, artifacts start appearing sooner than they would from an 8-bit source, because the conversion is already quantizing the 10-bit data."
        },
        {
            q: "Can I batch convert HEIF files to JPG?",
            a: "Yes, several ways: Canon's in-camera \"Select range,\" DPP and Imaging Edge batch processing, Preview's Export Selected Images, or Mochify with one prompt across a batch (3 files per free session, 25 per batch on Seller and Pro)."
        }
    ];

    const related = [
        { href: '/guides/hif-to-jpg-canon-sony-fujifilm', title: 'HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs', desc: 'The extension-level companion to this guide, with brand-by-brand camera menus and platform walkthroughs.' },
        { href: '/guides/heif-to-jpeg-workflow-photographers-guide', title: 'HIF/HEIF to JPEG for Professional Photographers', desc: 'Client delivery, archiving, and when to keep the HEIF originals.' },
        { href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera', title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?', desc: 'The capture decision, before conversion is ever needed.' },
        { href: '/guides/does-hif-to-jpg-lose-quality', title: 'Does Converting HIF to JPG Reduce Quality?', desc: 'The quality question answered with specifics: bit depth, tone mapping, and when it is visible.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide: Quality-Per-Byte', desc: "How the encoder behind Mochify's JPEG output closes the gap to modern formats." },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>HEIF to JPG - The Complete Conversion Guide</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="HEIF to JPG: The Complete Conversion Guide" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/heif-to-jpg-complete-guide" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="HEIF to JPG: The Complete Conversion Guide" />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "HEIF to JPG: The Complete Conversion Guide",
        "description": "Convert HEIF (.HIF) files from Canon, Sony, and Fujifilm cameras to universally compatible JPG. Every method, the quality trade-offs, and batch workflows.",
        "url": "https://mochify.app/guides/heif-to-jpg-complete-guide",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/heif-to-jpg-complete-guide"
        },
        "datePublished": "2026-07-15",
        "dateModified": "2026-07-24",
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
            { "@type": "Thing", "name": "JPEG" },
            { "@type": "Thing", "name": "image conversion" },
            { "@type": "Thing", "name": "HIF file" },
            { "@type": "Thing", "name": "HEVC codec" }
        ],
        "keywords": "heif to jpg, convert heif to jpg, heif to jpeg, HIF file, Canon HDR PQ, Sony HEIF, Fujifilm HEIF, 10-bit photography",
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
            { "@type": "ListItem", "position": 3, "name": "HEIF to JPG: The Complete Conversion Guide", "item": "https://mochify.app/guides/heif-to-jpg-complete-guide" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "HEIF to JPG: The Complete Conversion Guide",
        "url": "https://mochify.app/guides/heif-to-jpg-complete-guide",
        "description": "Convert HEIF (.HIF) files from Canon, Sony, and Fujifilm cameras to universally compatible JPG. Every method, the quality trade-offs, and batch workflows.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-15",
        "dateModified": "2026-07-15"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "How do I convert HEIF to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "On macOS, open the file in Preview and use File, Export, JPEG. On Windows, install the HEIF Image Extension and HEVC Video Extensions from the Microsoft Store, then export from Photos. Canon bodies convert in the Playback menu; Sony's Imaging Edge Desktop converts on the desktop. Online, Mochify converts up to 3 HEIF files per session free with no account." } },
            { "@type": "Question", "name": "Is HEIF the same as HEIC?", "acceptedAnswer": { "@type": "Answer", "text": "Same format underneath (HEIF, ISO/IEC 23008-12), different hardware worlds. Professional cameras from Canon, Sony, and Fujifilm write .HIF files; iPhones write .HEIC. The workflows and tools differ, so pick the lane that matches your file: this guide for .HIF, or the HEIC to JPEG converter for iPhone files." } },
            { "@type": "Question", "name": "Can I convert HEIF to JPG without losing quality?", "acceptedAnswer": { "@type": "Answer", "text": "Some loss is inherent: JPEG is 8-bit, so the HEIF's 10-bit tonal range (1,024 values per channel down to 256) is reduced in every conversion. In practice a good encoder at quality 85 or above makes the difference invisible in normal viewing. The most visible case is Canon HDR PQ files, where HDR-to-SDR tone mapping changes the look more than bit depth does." } },
            { "@type": "Question", "name": "Why won't my HEIF file open on Windows?", "acceptedAnswer": { "@type": "Answer", "text": "Windows needs two codecs: the free HEIF Image Extension (bundled with Windows 11) and the HEVC Video Extensions, which cost $0.99 in the Microsoft Store because of HEVC patent licensing. Without the HEVC codec, the Photos app cannot decode the image data inside the HEIF container." } },
            { "@type": "Question", "name": "Can browsers display HEIF images?", "acceptedAnswer": { "@type": "Answer", "text": "Only Safari (version 17 and later). Chrome, Edge, and Firefox have no HEIF support in any version, which leaves global browser coverage at about 13.6% per caniuse.com. For web use, convert HEIF to JPG, WebP, or AVIF." } },
            { "@type": "Question", "name": "Does converting HEIF to JPG remove the metadata?", "acceptedAnswer": { "@type": "Answer", "text": "Not by default in most tools - platform converters like Preview and DPP generally carry EXIF across, including GPS coordinates. Decide deliberately: in Mochify, state it in the prompt (convert to JPG and strip all metadata, or remove GPS but keep copyright), and the output matches the instruction." } },
            { "@type": "Question", "name": "What is the best JPEG quality setting when converting from HEIF?", "acceptedAnswer": { "@type": "Answer", "text": "Quality 85-90 is the sweet spot for delivery: clean enough for print and screen, without the wasted bytes above 95. Below 80, artifacts start appearing sooner than they would from an 8-bit source, because the conversion is already quantizing the 10-bit data." } },
            { "@type": "Question", "name": "Can I batch convert HEIF files to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, several ways: Canon's in-camera Select range, DPP and Imaging Edge batch processing, Preview's Export Selected Images, or Mochify with one prompt across a batch (3 files per free session, 25 per batch on Seller and Pro)." } }
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
                {metadata.readTime} · {metadata.date} · Updated {metadata.lastUpdated}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            HEIF to JPG: The Complete Conversion Guide
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-6">
            Your camera writes HEIF because it is the technically better format: 10-bit color, HDR-ready, roughly half the file size of an equivalent JPEG. Then you try to deliver the shoot and discover that browsers, client galleries, and print labs mostly cannot read it. Converting HEIF to JPG is the step that turns a superior capture format into a file the rest of the world can open. This guide covers every reliable conversion route, what you give up in the process, and how to keep the quality you paid for.
        </p>

        <p class="text-lg text-[#6C3F31] leading-relaxed max-w-2xl mb-8">
            One scope note before we start. This guide is about HEIF stills from professional mirrorless cameras - the <code class={inlineCode}>.HIF</code> files that Canon, Sony, and Fujifilm bodies write. If your file is a <code class={inlineCode}>.HEIC</code> from an iPhone, that is the same format family but a different hardware world and a different workflow: head to our <a href="https://mochify.app/heic-to-jpeg">HEIC to JPEG converter</a> instead.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 15, 2026 by the Mochify Engineering Team.</strong>
                This guide covers HEIF stills from professional mirrorless cameras - the .HIF files that Canon, Sony, and Fujifilm bodies write. If your file is a .HEIC from an iPhone, that is the same format family but a different workflow: head to our HEIC to JPEG converter instead.
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

        <section id="what-is-heif-and-why-does-your-camera-use-it" class="scroll-mt-24">
            <SectionHeading>What is HEIF, and why does your camera use it?</SectionHeading>
            <p>HEIF (High Efficiency Image File Format) is a still-image container standardized as ISO/IEC 23008-12, storing pictures compressed with the HEVC video codec. Professional mirrorless cameras save HEIF stills with the <code class={inlineCode}>.HIF</code> extension, and they do it for two reasons: the files are dramatically smaller than JPEG at the same quality, and they hold 10-bit color instead of JPEG's 8-bit ceiling.</p>
            <p>The efficiency numbers are not marketing. <a href="https://nokiatech.github.io/heif/technical.html" target="_blank" rel="noopener noreferrer">Nokia's HEIF technical documentation</a> - Nokia co-developed the format - measured that JPEG needs on average 139% more bitrate than HEVC still coding to hit the same objective quality. In other words, an equivalent JPEG runs about 2.4x the size. <a href="https://support.d-imaging.sony.co.jp/support/ilc/heif/01/en/index.html" target="_blank" rel="noopener noreferrer">Sony's own HEIF documentation</a> puts it more simply: compression efficiency roughly twice that of JPEG, with "rich 10-bit color depth gradation."</p>
            <p>That bit depth matters more than it sounds. An 8-bit JPEG stores 256 tonal values per channel, around 16.7 million colors. A 10-bit HEIF stores 1,024 values per channel, over a billion colors. The practical difference shows up in smooth gradients - skies, studio backdrops, skin - which band and posterize sooner in 8-bit when you push them in post.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Which cameras write HEIF</h3>
            <p><strong>Canon</strong> enables HEIF through the HDR PQ setting on most current EOS R bodies (R5, R5 Mark II, R6 Mark II, R3, R1, R7, R8, R10, plus the EOS-1D X Mark III). Canon's HEIF stills conform to the PQ HDR specification in ITU-R BT.2100.</p>
            <p><strong>Sony</strong> added HEIF with the a7S III and now offers it across the Alpha line (a1, a7 IV, a7R V, a7C II, a9 III and others) via the JPEG/HEIF Switch menu, with a choice of 4:2:0 or 4:2:2 color sampling and optional HLG HDR stills.</p>
            <p><strong>Fujifilm</strong> offers 10-bit HEIF on the X-H2S, X-H2, X-T5, and X100VI through the SELECT JPEG/HEIF image quality setting, with film simulations baked in at capture.</p>
            <p>For the brand-by-brand menu paths and deeper camera coverage, see our <a href="https://mochify.app/guides/hif-to-jpg-canon-sony-fujifilm">HIF to JPG guide for Canon, Sony, and Fujifilm</a>.</p>
        </section>

        <section id="why-heif-files-need-converting-in-2026" class="scroll-mt-24">
            <SectionHeading>Why HEIF files need converting in 2026</SectionHeading>
            <p>HEIF is a capture format, not a delivery format: outside your own ecosystem, almost nothing displays it. Converting HEIF to JPG is what makes the shoot shareable, printable, and publishable.</p>
            <p>The numbers are stark. According to <a href="https://caniuse.com/heif" target="_blank" rel="noopener noreferrer">caniuse.com's HEIF support table</a>, no version of Chrome, Edge, or Firefox can display HEIF at all. Safari 17 and later can. That works out to about 13.6% of global browser users - meaning roughly six of every seven visitors cannot see a HEIF image embedded in a web page. The reason browsers refuse it is licensing: HEVC decoding carries patent royalties, so browser vendors have put their weight behind royalty-free formats like AVIF and JPEG XL instead.</p>
            <p>The friction goes beyond browsers:</p>
            <ul class="list-disc pl-6 space-y-3">
                <li><strong>Client galleries reject it.</strong> ShootProof requires JPEG uploads in sRGB. Pixieset limits uploads to JPEG, PNG, GIF, and RAW - HEIF is not on the list, and print-product sales there require JPEG specifically.</li>
                <li><strong>Print labs almost universally want JPEG or TIFF.</strong> A March 2026 Fstoppers analysis of HEIF adoption found labs, plug-ins, and batch tools still failing on HEIF, sometimes silently.</li>
                <li><strong>Windows machines often cannot open it out of the box.</strong> The HEIF Image Extension is free and bundled with Windows 11, but decoding the HEVC data inside still requires Microsoft's HEVC Video Extensions, a $0.99 paid add-on. Your file can open fine on your Mac and show an error on your client's Windows desktop.</li>
                <li><strong>Sony says so itself.</strong> The company's HEIF documentation warns that "you may not be able to view or edit HEIF files depending on the computer or software."</li>
            </ul>
            <p>None of this is a flaw in your files. The format is fine; the ecosystem has not caught up. The fix is a clean conversion to JPEG for anything that leaves your machine.</p>
        </section>

        <section id="how-to-convert-heif-to-jpg-every-method" class="scroll-mt-24">
            <SectionHeading>How to convert HEIF to JPG: every method</SectionHeading>
            <p>The best HEIF to JPG method depends on where you are standing: at the camera, at a desktop with manufacturer software, or in a browser. Here is every reliable route.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">In-camera (Canon)</h3>
            <p>Canon bodies convert without touching a computer. In Playback, select an image (or "Select range" for a batch), choose <strong>HEIF to JPEG conversion</strong>, and the camera writes JPEG copies using its own tone-mapping engine. Canon's manual carries one honest caveat: "some scenes may look different after conversion," and the option is unavailable for cropped images and 4K/8K frame grabs. There is no quality setting - you get the camera's default.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Canon Digital Photo Professional (DPP)</h3>
            <p>DPP batch-converts HEIF to JPEG or TIFF, with a setup step: you must activate the HEVC codec first (Help menu, "Activate HEVC codec"; EOS R, Ra, and 5D Mark IV files need a separate codec download from Canon). Two limitations worth knowing from <a href="https://cam.start.canon/en/S002/manual/html/UG-12_HDRPQ_0070.html" target="_blank" rel="noopener noreferrer">Canon's own DPP documentation</a>: converted files are saved as SDR images with the color space locked to sRGB, and you cannot select the JPEG compression level when saving from HEIF.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Sony Imaging Edge Desktop</h3>
            <p>Sony's free desktop suite converts HEIF to JPEG or TIFF and is the manufacturer-recommended route for Alpha shooters. Sony's guidance is specific and worth following: export JPEG (8-bit) for delivery and playback compatibility, but export 16-bit TIFF when you plan further editing, because TIFF preserves the 10-bit gradation data that JPEG cannot hold. HLG (HDR) stills converted to TIFF should then be handled in color-managed software.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Fujifilm: the USB rename trick</h3>
            <InfoBox type="tip" title="Fujifilm's USB rename trick">
                <p>Fujifilm ships no dedicated HEIF converter, but the <a href="https://fujifilm-dsc.com/en/manual/x-t5/menu_shooting/image_quality_setting/" target="_blank" rel="noopener noreferrer">X-T5 manual</a> documents a genuinely useful quirk: when HEIF pictures are uploaded from the camera to a computer over USB, the <code class={inlineCode}>.HIF</code> extension is changed to <code class={inlineCode}>.HEIC</code> automatically, which lets any HEIF-aware app open them.</p>
            </InfoBox>
            <p>From there, macOS or Adobe tools handle the JPEG export. Fujifilm-specific depth, including film simulation handling, is in our <a href="https://mochify.app/guides/fujifilm-hif-to-jpg">Fuji HIF guide</a>.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">macOS: Preview and Photos</h3>
            <p>HEIF support has been built into macOS since High Sierra. Open the file in Preview or Photos, choose File, then Export, pick JPEG, set quality, save. Preview's "Export Selected Images" handles small batches. Note that Canon HDR PQ files come out as SDR JPEGs with automatic tone mapping - expect the exported file to look flatter than the HDR original did on an HDR display.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Windows: codecs first, then Photos</h3>
            <p>Install the free HEIF Image Extension from the Microsoft Store plus the $0.99 HEVC Video Extensions, and the Photos app can open <code class={inlineCode}>.HIF</code> files and save them as JPEG. Skip the codecs and you get "we can't open this file." For batches, IrfanView or ImageMagick built with libheif support remain the reliable free options.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Lightroom and Camera Raw</h3>
            <p><a href="https://helpx.adobe.com/lightroom-cc/kb/heic-files-support.html" target="_blank" rel="noopener noreferrer">Adobe's support matrix</a> confirms Lightroom Classic, Lightroom, and Camera Raw read HEIF files including the <code class={inlineCode}>.HIF</code> extension directly (macOS 10.13+, Windows 10+; Windows needs the Microsoft codecs installed). Import, edit, export as JPEG - the standard workflow, with full quality control. Photoshop on Windows likewise requires both Microsoft codecs.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Online converters</h3>
            <p>Generic upload-and-convert sites work for one-off files, but check two things before trusting them with client work: what encoder produces the JPEG (quality varies widely), and what happens to your upload afterward (retention policies range from clear to nonexistent). For a converter built around a stated zero-retention model and a modern JPEG encoder, see the <a href="#mochify-workflow">Mochify workflow below</a>.</p>
        </section>

        <section id="what-you-lose-converting-10-bit-heif-to-8-bit-jpg" class="scroll-mt-24">
            <SectionHeading>What you lose converting 10-bit HEIF to 8-bit JPG</SectionHeading>
            <p>The honest answer: bit depth always, HDR sometimes, and in a well-handled conversion neither is visible in normal delivery work. Understanding the two losses helps you decide when they matter.</p>
            <p><strong>Bit depth.</strong> Going from 1,024 tonal values per channel to 256 is inherent to JPEG - no converter avoids it. The risk is banding in smooth gradients, and it grows if the file gets edited after conversion. That argues for a simple rule: do your tonal edits on the 10-bit original (or a 16-bit TIFF, per Sony's guidance), and make JPEG the last step. A modern encoder also shrinks the visible cost: Mochify encodes JPEG with Google's jpegli, whose adaptive quantization specifically targets banding in slow gradients. Our <a href="https://mochify.app/guides/jpeg-in-2026-jpegli">jpegli guide</a> covers how it wrings more quality per byte out of a 34-year-old format.</p>
            <p><strong>HDR tone mapping.</strong> Canon HDR PQ files encode brightness the way an HDR display reproduces it. Any JPEG conversion tone-maps that to SDR, and Canon's documentation is upfront that "color and gradation will seem somewhat different from display in HDR PQ mode." Every converter makes slightly different highlight and shadow choices here, so check the result on a standard display before client delivery. The full quality analysis, with test methodology, is in <a href="https://mochify.app/guides/does-hif-to-jpg-lose-quality">Does Converting HIF to JPG Reduce Quality?</a></p>
            <p><strong>What survives.</strong> Sharpness, resolution, film simulations (on Fujifilm bodies, where HEIF is sRGB-locked in camera anyway), and your EXIF metadata - including GPS coordinates, which is worth a deliberate decision rather than a default. Strip location data on anything shared publicly; our <a href="https://mochify.app/guides/exif-data-risks-image-compression-2026">EXIF data risks guide</a> explains what lives in the metadata and why it matters.</p>
        </section>

        <section id="should-you-keep-shooting-heif" class="scroll-mt-24">
            <SectionHeading>Should you keep shooting HEIF?</SectionHeading>
            <p>Yes, if your camera offers it and your workflow includes a conversion step - the capture-quality upside costs you nothing but that one extra step. That is also roughly where the 2026 practitioner debate has landed: a widely shared <a href="https://fstoppers.com/gear/heif-vs-jpeg-should-switch-your-cameras-default-file-format-900251" target="_blank" rel="noopener noreferrer">Fstoppers analysis from March 2026</a> concluded "the format is better, the ecosystem isn't ready," recommending HEIF capture for high-volume shooters who deliver processed files, with JPEG remaining the pragmatic delivery format for another few years.</p>
            <p>The workflow that gets you both:</p>
            <ol class="list-decimal pl-6 space-y-2">
                <li><strong>Shoot HEIF</strong> (alone or alongside RAW) for the 10-bit headroom and the smaller cards-and-storage footprint.</li>
                <li><strong>Edit on the highest-bit-depth version</strong> you have - the HEIF itself, a RAW, or a 16-bit TIFF export.</li>
                <li><strong>Convert to JPG only at delivery</strong>, once, with a quality-aware encoder.</li>
                <li><strong>Archive the HEIF originals.</strong> They are the negatives; JPEGs are the prints.</li>
            </ol>
            <p>Still deciding at the menu screen? Our <a href="https://mochify.app/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera">HEIF or JPEG on a mirrorless camera guide</a> weighs the trade-offs before the shutter fires, and the <a href="https://mochify.app/guides/heif-to-jpeg-workflow-photographers-guide">professional HEIF workflow guide</a> covers client delivery and archiving strategy end to end.</p>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">Mochify Workflow: HEIF to JPG in one prompt</h2>
            <p class="text-base mb-7">Mochify converts HEIF files from Canon, Sony, and Fujifilm bodies to JPG in a single natural-language step, using jpegli for the encoding. No settings to decode - you describe the outcome.</p>
            <ol class="space-y-4 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Open the converter</strong>
                        <p class="text-base m-0">Go to <a href="https://mochify.app/solutions/hif-to-jpg">mochify.app/solutions/hif-to-jpg</a> - it accepts <code class={inlineCode}>.HIF</code> HEIF files directly.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Drop in your files</strong>
                        <p class="text-base m-0">Drop in your files. Up to 3 per session free with no signup, 25 per month with a free account, or 25-file batches with 75MB per file on Seller and Pro.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Describe what you want</strong>
                        <p class="text-base m-0">Type what you want in the Magic Flow prompt: <em>"Convert these to JPG"</em>, <em>"Convert to JPG, max 2048px on the long edge"</em>, <em>"Convert to JPG and strip all metadata"</em>, or <em>"Convert to JPG under 800KB each, keep copyright info but remove GPS"</em>.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Download your JPEGs</strong>
                        <p class="text-base m-0">Download your JPEGs.</p>
                    </div>
                </li>
            </ol>
            <p class="text-base mt-7 mb-0">HEIF originals from a full-frame or medium-format body can run well past what a free upload form or a generic web tool will accept. If a converted JPEG is still getting rejected on size, see <a href="/guides/photo-file-too-large-to-upload">why upload forms and free tools reject camera files</a>.</p>
            <p class="text-base mt-7 mb-0">Magic Flow runs a two-step pipeline: a language model (currently Mistral Small 4) parses the instruction, then the C++ engine executes it. Be explicit about metadata in the prompt - "strip all metadata" or "remove GPS" - so the output matches your privacy intent exactly.</p>
            <p class="text-base mt-4 mb-0">For batch and automated workflows, the same conversion runs from the CLI (<code class={inlineCode}>brew install mochify</code>) or from the local MCP server (<code class={inlineCode}>mochify serve</code>) inside an AI agent setup. Both are clients over the same API with no pickup store: outputs return straight to your machine, zero retention end to end. Tethered-to-deadline sports and event shooters can script an entire card dump this way.</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 my-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>mochify -p "convert to jpg and strip GPS" *.HIF</code></pre>
            <p class="text-base text-[#875F42] mt-7 mb-0"><strong>Privacy, stated precisely:</strong> your files travel to <code class={inlineCode}>api.mochify.app</code> over HTTPS, are streamed into RAM for encoding, and are wiped immediately - no disk writes, no logs containing file data. Video is the only Mochify capability that runs entirely in the browser; images like HEIF are processed server-side under that zero-retention model.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>HEIF to JPG cheat sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[900px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Method</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Best for</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Batch?</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Quality control</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">HDR PQ handling</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Canon in-camera conversion</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No-computer workflow</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes (select range)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Fixed</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Canon's own tone mapping</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Canon DPP</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Canon desktop batch</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No (fixed on HEIF saves)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">SDR output, sRGB locked</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Sony Imaging Edge Desktop</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Sony Alpha shooters</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG for delivery, TIFF for editing</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Fujifilm USB transfer + OS tools</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Fuji bodies (auto .HIF to .HEIC rename)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Via OS app</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">n/a (sRGB in camera)</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">macOS Preview / Photos</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Quick exports, any brand</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Small batches</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Quality slider</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Automatic SDR mapping</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Windows Photos + codecs</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Windows one-offs</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Limited</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Basic</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Lightroom / Camera Raw</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Edit-then-deliver workflow</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Full</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Color-managed</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold"><a href="https://mochify.app/solutions/hif-to-jpg">Mochify web (Magic Flow)</a></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Any brand, plain-English batch, jpegli output</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes (up to 25)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Via prompt</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Encoder tone mapping</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Mochify CLI / local MCP</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Scripted and agent pipelines</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Yes</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Via <code class={inlineCode}>-p</code> prompt</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Encoder tone mapping</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Turn HEIF files into shareable JPEGs</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base"><a href="https://mochify.app/solutions/hif-to-jpg">Try Mochify free</a> - no signup needed for your first three conversions.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try it free at mochify.app →
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
