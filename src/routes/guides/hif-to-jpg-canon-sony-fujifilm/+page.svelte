<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs",
        description: "Convert HIF to JPG from Canon, Sony and Fujifilm cameras. Every method on every platform, plus what you trade away going 10-bit to 8-bit.",
        category: "Image Formats",
        readTime: "19 min read",
        date: "June 4, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const toc = [
        { n: '01', label: 'What is a HIF file?', id: '#what-is-a-hif-file' },
        { n: '02', label: "Why your HIF files won't open or upload", id: '#why-hif-files-wont-open' },
        { n: '03', label: 'How to convert HIF to JPG: every method', id: '#how-to-convert-hif-to-jpg' },
        { n: '04', label: 'What you lose (and keep) going 10-bit HIF to 8-bit JPG', id: '#what-you-lose-and-keep' },
        { n: '05', label: 'EXIF metadata and GPS privacy', id: '#exif-metadata-and-gps-privacy' },
        { n: '06', label: 'Why JPG is still the safe universal share format', id: '#why-jpg-is-still-the-safe-format' },
        { n: '07', label: 'Mochify Workflow: convert HIF to JPG in one step', id: '#mochify-workflow' },
        { n: '08', label: 'HIF to JPG cheat sheet', id: '#cheat-sheet' },
        { n: '09', label: 'Frequently asked questions', id: '#faq' },
    ];

    const browserSupport = [
        { fmt: 'JPEG', chrome: 'Full', firefox: 'Full', edge: 'Full', safari: 'Full', notes: 'Universal baseline' },
        { fmt: 'WebP', chrome: 'Full', firefox: 'Full', edge: 'Full', safari: 'Full', notes: '~25–34% smaller than JPEG' },
        { fmt: 'AVIF', chrome: 'Full', firefox: 'Full', edge: 'Full', safari: 'Full (16.4+)', notes: '~50% smaller than JPEG' },
        { fmt: 'HEIF/HIF', chrome: 'None', firefox: 'None', edge: 'None', safari: 'Yes (17+)', notes: 'Not web-safe' },
        { fmt: 'JPEG XL', chrome: 'None', firefox: 'None', edge: 'None', safari: 'Partial (17+)', notes: 'Still limited' },
    ];

    const cheatSheet = [
        { method: 'Canon in-camera conversion', best: 'Canon HDR PQ, no computer needed', batch: 'Yes (select range)', quality: 'Fixed (camera default)', strips: 'No' },
        { method: 'Canon Digital Photo Professional', best: 'Canon HEIF/RAW workflows', batch: 'Yes', quality: 'Yes', strips: 'Optional' },
        { method: 'Sony Imaging Edge Desktop', best: 'Sony HLG/HEIF stills, batch export', batch: 'Yes', quality: 'Yes', strips: 'Optional' },
        { method: 'macOS Preview', best: 'Quick single file or small batch, any brand', batch: 'Yes', quality: 'Quality slider', strips: 'Optional' },
        { method: 'macOS Shortcuts / Quick Actions', best: 'Drag-and-drop batch, any brand', batch: 'Yes', quality: 'Fixed', strips: 'No' },
        { method: 'Windows Photos + HEIF codec', best: 'Windows users, any brand', batch: 'No (one at a time)', quality: 'Limited', strips: 'No' },
        { method: 'Mochify web / Magic Flow', best: 'Any brand, privacy-first, jpegli encoding', batch: 'Yes (up to 25)', quality: 'Via prompt', strips: 'Yes, via prompt' },
        { method: 'Mochify CLI / local MCP', best: 'Automated workflows, zero network retention', batch: 'Yes', quality: 'Via -p flag', strips: 'Yes' },
        { method: 'Third-party online converters', best: 'No software install, one-off jobs', batch: 'Varies by service', quality: 'Varies', strips: 'Usually no' },
    ];

    const workflowPrompts = [
        '"Convert to JPG"',
        '"Convert to JPG and resize to 1200px wide"',
        '"Convert to JPG and strip location data"',
        '"Convert to JPG, compress to under 500KB, remove all EXIF"',
        '"Convert these HIF files to web-ready JPEGs"',
    ];

    const faqs = [
        { q: 'What is a HIF file?', a: `A HIF file is a still image shot on a professional mirrorless camera (Canon, Sony, Fujifilm) and saved in the HEIF format with the .HIF extension. It uses HEVC (H.265) compression inside an ISO container at typically 10-bit color depth. The format delivers roughly twice the compression efficiency of JPEG at comparable perceived quality, with less gradient banding in skies and smooth tones.` },
        { q: 'How do I convert HIF to JPG?', a: `The fastest desktop methods: on macOS, open the file in Preview and choose File → Export → JPEG. On Windows, install HEIF Image Extensions from the Microsoft Store and export from the Photos app. Canon bodies have a built-in HEIF-JPEG conversion option in the Playback menu. For any brand online, Mochify's HIF-to-JPG converter accepts .HIF files directly, with no account required for up to 3 files per session.` },
        { q: 'Can I convert HIF to JPG without losing quality?', a: `There is always some information loss going from 10-bit HIF to 8-bit JPEG; the bit depth reduction is inherent. In practice, the difference is hard to see in most shots. Using a quality-aware encoder like jpegli and setting JPEG quality at 85 or above minimizes visible banding and artifacts. The most noticeable case is Canon HDR PQ files, where the HDR-to-SDR tone-mapping step alters the look more significantly than bit depth alone.` },
        { q: 'Why does my HIF file open on my Mac but get rejected on upload?', a: `macOS provides an OS-level HEIF codec that lets Photos and Preview render .HIF files regardless of whether a third-party app supports the format. Web platforms use their own decoders and often lack HEVC support or HEIF parsing. The file is valid; the upload destination simply cannot read it.` },
        { q: 'Is HIF the same as HEIC?', a: `They share the same underlying format (HEIF, ISO/IEC 23008-12, an ISO container with HEVC-encoded stills) but come from different hardware and serve different audiences. .HIF is the extension professional cameras write; .HEIC is the extension iPhones use. If your file is a .HEIC from an iPhone, use the HEIC to JPEG converter instead.` },
        { q: 'Does converting HIF to JPG strip EXIF data?', a: `It depends on the tool. Most platform converters (macOS Preview, Canon DPP) preserve EXIF by default. Mochify gives you explicit control: keep all EXIF, strip everything, or remove just GPS coordinates via the Magic Flow prompt ("convert to JPG and strip location data"). For any shared photo where privacy matters, stripping GPS before upload is good practice.` },
        { q: 'Can I batch-convert HIF to JPG?', a: `Yes. Canon in-camera conversion supports "Select range" for converting multiple frames at once. Canon DPP and Sony Imaging Edge Desktop both batch-process. macOS Preview's "Export Selected Images" converts multiple files in one go. Mochify processes up to 3 files per free session, or up to 25 per batch on Seller and Pro plans, using a single Magic Flow prompt.` },
        { q: 'What JPEG quality setting should I use when converting from HIF?', a: `85–90 is the practical sweet spot for most photography: visually clean for display and printing, with file sizes that work for sharing and web delivery. Above 95 adds bytes with minimal visible gain. Below 80 risks visible artifacts, particularly in 10-bit-to-8-bit conversions. Mochify's defaults are calibrated for high quality output with jpegli's adaptive quantisation handling the subtle detail.` },
    ];

    const related = [
        { href: '/guides/fujifilm-hif-to-jpg', title: 'Fuji HIF Files Explained: Convert X-T5, X-H2, X100VI, X-T50', desc: 'Deep dive into Fujifilm-specific HIF files, film simulations, and the best Fuji conversion workflows.' },
        { href: '/guides/heif-to-jpeg-workflow-photographers-guide', title: 'HIF/HEIF to JPEG for Professional Photographers', desc: 'Managing the full pro workflow: client delivery, archiving, and when to keep HIF originals.' },
        { href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera', title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?', desc: 'The format decision before you shoot, including when HIF is worth it and when JPEG is still the right call.' },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'What lives in your image metadata, why GPS data is a privacy risk, and how to handle it in your workflow.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide: Quality-Per-Byte', desc: "How Google's jpegli encoder closes the gap between 8-bit JPEG and modern formats like AVIF and WebP." },
        { href: '/guides/what-is-a-hif-file', title: 'What Is a HIF File? (And How to Open One)', desc: 'What the .HIF extension actually is, and how to open one on macOS, Windows, iOS and Linux.' },
        { href: '/guides/sony-hif-to-jpg', title: 'How to Convert Sony HIF Files to JPG', desc: 'Converting Sony HIF files to JPG with Imaging Edge Desktop or online, plus which Alpha bodies shoot HEIF.' },
        { href: '/guides/does-hif-to-jpg-lose-quality', title: 'Does Converting HIF to JPG Reduce Quality?', desc: 'Does converting HIF to JPG reduce quality? The honest answer, and the one case where it really shows.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
    <link rel="canonical" href="https://mochify.app/guides/hif-to-jpg-canon-sony-fujifilm" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/hif-to-jpg-canon-sony-fujifilm" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs",
        "description": "Convert HIF to JPG from Canon, Sony and Fujifilm cameras. Every method on every platform, plus what you trade away going 10-bit to 8-bit.",
        "url": "https://mochify.app/guides/hif-to-jpg-canon-sony-fujifilm",
        "datePublished": "2026-06-04",
        "dateModified": "2026-06-04",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
        "isPartOf": { "@type": "CollectionPage", "name": "Image Optimization Guides", "url": "https://mochify.app/guides" }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "What is a HIF file?", "acceptedAnswer": { "@type": "Answer", "text": "A HIF file is a still image shot on a professional mirrorless camera (Canon, Sony, Fujifilm) and saved in the HEIF format with the .HIF extension. It uses HEVC (H.265) compression inside an ISO container at typically 10-bit color depth. The format delivers roughly twice the compression efficiency of JPEG at comparable perceived quality, with less gradient banding in skies and smooth tones." } },
            { "@type": "Question", "name": "How do I convert HIF to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "The fastest desktop methods: on macOS, open the file in Preview and choose File > Export > JPEG. On Windows, install HEIF Image Extensions from the Microsoft Store and export from the Photos app. Canon bodies have a built-in HEIF-JPEG conversion option in the Playback menu. For any brand online, Mochify's HIF-to-JPG converter accepts .HIF files directly, with no account required for up to 3 files per session." } },
            { "@type": "Question", "name": "Can I convert HIF to JPG without losing quality?", "acceptedAnswer": { "@type": "Answer", "text": "There is always some information loss going from 10-bit HIF to 8-bit JPEG; the bit depth reduction is inherent. In practice, the difference is hard to see in most shots. Using a quality-aware encoder like jpegli and setting JPEG quality at 85 or above minimizes visible banding and artifacts. The most noticeable case is Canon HDR PQ files, where the HDR-to-SDR tone-mapping step alters the look more significantly than bit depth alone." } },
            { "@type": "Question", "name": "Why does my HIF file open on my Mac but get rejected on upload?", "acceptedAnswer": { "@type": "Answer", "text": "macOS provides an OS-level HEIF codec that lets Photos and Preview render .HIF files regardless of whether a third-party app supports the format. Web platforms use their own decoders and often lack HEVC support or HEIF parsing. The file is valid; the upload destination simply cannot read it." } },
            { "@type": "Question", "name": "Is HIF the same as HEIC?", "acceptedAnswer": { "@type": "Answer", "text": "They share the same underlying format (HEIF, ISO/IEC 23008-12) but come from different hardware. .HIF is the extension professional cameras write; .HEIC is the extension iPhones use." } },
            { "@type": "Question", "name": "Does converting HIF to JPG strip EXIF data?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on the tool. Most platform converters preserve EXIF by default. Mochify gives you explicit control: keep all EXIF, strip everything, or remove just GPS coordinates via the Magic Flow prompt. For any shared photo where privacy matters, stripping GPS before upload is good practice." } },
            { "@type": "Question", "name": "Can I batch-convert HIF to JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Canon in-camera conversion supports Select range. Canon DPP and Sony Imaging Edge Desktop both batch-process. macOS Preview converts multiple files at once. Mochify processes up to 3 files per free session, or up to 25 per batch on Seller and Pro plans." } },
            { "@type": "Question", "name": "What JPEG quality setting should I use when converting from HIF?", "acceptedAnswer": { "@type": "Answer", "text": "85-90 is the practical sweet spot for most photography. Above 95 adds bytes with minimal visible gain. Below 80 risks visible artifacts, particularly in 10-bit-to-8-bit conversions. Mochify's defaults are calibrated for high quality output with jpegli's adaptive quantisation." } }
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
            HIF to JPG: Convert Canon, Sony &amp; Fujifilm Photos to Shareable JPEGs
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            HIF files come off professional mirrorless cameras full of 10-bit color and punishing dynamic range, and then promptly refuse to open on half the computers in the world. If you need to convert HIF to JPG and want to understand what you are trading away in the process, this guide covers every method, on every platform, for every camera brand.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published June 2026 by the Mochify Engineering Team.</strong>
                Covering Canon EOS R-series, Sony Alpha, and Fujifilm X-series workflows, plus a deep dive into what actually changes when you go from 10-bit HIF to 8-bit JPEG.
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
                            <a href={item.id} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7" /></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- Section 1 -->
        <section id="what-is-a-hif-file">
            <SectionHeading>What is a HIF file?</SectionHeading>
            <p>A HIF file is a still image from a professional mirrorless camera saved in the HEIF (High Efficiency Image File Format) container, with <code class={inlineCode}>.HIF</code> as the vendor-specific file extension. Fujifilm's official camera manual states this directly: "HEIF pictures are stored on the memory card as files with the extension <code class={inlineCode}>.HIF</code>." Canon's Digital Photo Professional software uses the same <code class={inlineCode}>.HIF</code> convention for its HEIF save-as type. Under the hood, HIF uses HEVC (H.265) compression inside an ISO Base Media File Format container (the same family that underpins MP4 video) to pack more color depth into a smaller file than traditional JPEG. For a platform-by-platform primer on opening one, see <a href="https://mochify.app/guides/what-is-a-hif-file">what is a HIF file?</a></p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Which cameras write HIF files?</h3>
            <p>Three camera families produce the vast majority of HIF files photographers encounter:</p>
            <p><strong>Canon</strong> EOS R-series bodies, including the R3, R5, R5 Mark II, R6, R6 Mark II, R7, R8, R10, R50, and the EOS-1D X Mark III, can record stills as HEIF, often in HDR PQ mode conforming to ITU-R BT.2100 and SMPTE ST.2084. These files capture a dramatically wider tonal range than JPEG and are stored as <code class={inlineCode}>.HIF</code> on the memory card.</p>
            <p><strong>Sony</strong> Alpha bodies (ILCE-7M4/A7 IV, ILCE-6700, and other recent Alpha bodies) offer a JPEG/HEIF toggle in the Image Quality menu. Photographers can choose HEIF(4:2:0) or HEIF(4:2:2), the latter keeping more color detail. Sony's documentation describes this as "recording images with a rich 10-bit color depth gradation expression," with optional HLG (Hybrid Log-Gamma) stills for a second flavour of wide dynamic range.</p>
            <p><strong>Fujifilm</strong> X-series bodies (X-H2S, X-H2, X-T5, X100VI, X-T50) record 10-bit HEIF images as <code class={inlineCode}>.HIF</code> files with film simulations (Velvia, Classic Chrome, and others) baked in at capture, exactly as they are in a JPEG but with more headroom in the bit depth.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Why cameras shoot HIF rather than JPEG</h3>
            <p>The core case for HIF is 10-bit color and roughly half the file size at comparable quality. Sony's HEIF documentation puts the compression efficiency at approximately twice that of JPEG at equal perceived quality. One Sony user comparison found 8-bit JPEGs from the same scene at around 14.3 MB against 10-bit HEIF(4:2:2) at about 5.7 MB. The extra bit depth also reduces banding in smooth gradients (skies, skin tones, subtle color transitions) that shows up as posterisation in 8-bit JPEG when you push editing further in post.</p>
            <p>One important clarification before going further. HIF/HEIF and Apple's <code class={inlineCode}>.HEIC</code> extension share the same format family; both are ISO containers with HEVC-encoded stills, but they come from completely different hardware worlds. <code class={inlineCode}>.HEIC</code> is what iPhones write. <code class={inlineCode}>.HIF</code> is what professional mirrorless bodies write. If your file ends in <code class={inlineCode}>.HEIC</code> and came from an iPhone, that is a different path: see the <a href="/heic-to-jpeg">HEIC to JPEG converter</a>. This guide covers the pro-camera lane.</p>
        </section>

        <!-- Section 2 -->
        <section id="why-hif-files-wont-open">
            <SectionHeading>Why your HIF files won't open or upload</SectionHeading>
            <p>HIF files convert cleanly once you have the right tool, but they fail silently in a surprising number of everyday situations.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Windows is patchy without extra codecs</h3>
            <p>Windows 10 and 11 do not ship with HEIF/HEVC support on every installation. To open <code class={inlineCode}>.HIF</code> files in the Photos app, you typically need to install "HEIF Image Extensions" from the Microsoft Store and, on some machines, the "HEVC Video Extensions" too. These extensions are free on many machines but paid on others depending on region and OEM configuration. Without them, <code class={inlineCode}>.HIF</code> files show a generic "we can't open this file" error even if they preview fine on a Mac.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Browsers cannot display HEIF, except Safari</h3>
            <p>No mainstream browser has native HEIF/HEIC support except Safari, which gained it from version 17 onwards. <a href="https://caniuse.com/heif" target="_blank" rel="noopener noreferrer">Can I Use's HEIF/HEIC table</a> shows Chrome, Edge, Firefox, and most Android browsers as unsupported as of 2026. Upload a <code class={inlineCode}>.HIF</code> directly to a web platform and it either has to convert the file server-side or reject it.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Apps, platforms, and print services often reject HIF</h3>
            <p>Many desktop applications still do not recognise <code class={inlineCode}>.HIF</code> even if they handle <code class={inlineCode}>.HEIC</code>. Fujifilm and Canon users regularly hit "unknown format" errors in older Photoshop versions, various DAM tools, and print kiosk software. Marketplace and print services typically list JPEG and PNG as accepted formats with HEIF absent entirely.</p>
            <p>Social platforms vary. Large networks often auto-convert HEIF uploads to JPEG internally. Some CMSs and media libraries simply refuse the file.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Why it opens on your Mac but fails on upload</h3>
            <p>macOS uses an OS-level codec layer, so Photos and Preview can render <code class={inlineCode}>.HIF</code> files even when third-party web services cannot. The web service decodes the file using its own stack, and that stack may lack an HEVC license or HEIF parser. The same file that opens fine in Finder can be rejected when you try to upload it elsewhere; the file is not corrupt, the target just cannot read it.</p>
        </section>

        <!-- Section 3 -->
        <section id="how-to-convert-hif-to-jpg">
            <SectionHeading>How to convert HIF to JPG: every method</SectionHeading>
            <p>Converting HIF to JPG is straightforward once you know which tool to reach for. Here is every reliable method, by platform and camera brand.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">On Windows</h3>
            <ol class="list-decimal pl-6 space-y-2">
                <li>Install "HEIF Image Extensions" from the Microsoft Store (search by name). If files still won't open, also install "HEVC Video Extensions."</li>
                <li>Open the <code class={inlineCode}>.HIF</code> file in the Photos app.</li>
                <li>Use the "..." menu and choose "Save as" or a print-to-JPEG workflow to export as JPEG.</li>
            </ol>
            <p>For batch conversion on Windows, IrfanView and ImageMagick (built with libheif support) are the most reliable free options for converting a folder of <code class={inlineCode}>.HIF</code> files at once.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">On macOS</h3>
            <p>macOS is the smoothest desktop path for any camera brand:</p>
            <ol class="list-decimal pl-6 space-y-2">
                <li>Open one or more <code class={inlineCode}>.HIF</code> files in Preview (drag them onto the Preview icon in the Dock, or select them in Finder and press spacebar).</li>
                <li>Single file: File → Export, choose JPEG as the format, set quality, save.</li>
                <li>Multiple files: with all files open in Preview, select them in the thumbnail sidebar, then File → Export Selected Images, choose JPEG.</li>
            </ol>
            <p>macOS 12 and later adds Shortcuts and Finder Quick Actions. Right-clicking a batch of <code class={inlineCode}>.HIF</code> files and choosing "Convert Image" produces JPEGs without opening any app.</p>

            <InfoBox type="note" title="Canon HDR PQ on macOS">
                When exporting Canon HDR PQ files, macOS maps the HDR PQ tone curve to standard dynamic range automatically. The result may look slightly darker or flatter than the file appeared on an HDR-capable display. That is not a macOS bug; it is the inherent 10-bit-HDR-to-8-bit-SDR conversion at work.
            </InfoBox>

            <InfoBox type="tip" title="Fujifilm on older macOS">
                Some apps do not recognise the <code class={inlineCode}>.HIF</code> extension even if they handle <code class={inlineCode}>.HEIC</code>. Renaming <code class={inlineCode}>.HIF</code> to <code class={inlineCode}>.HEIC</code> is a widely reported workaround that lets Photos and other HEIF-aware apps open the file, though it is not officially documented by Apple or Fujifilm.
            </InfoBox>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">In-camera conversion (Canon)</h3>
            <p>Canon's EOS R-series gives you a JPEG conversion path that never touches a computer:</p>
            <ol class="list-decimal pl-6 space-y-2">
                <li>Enter Playback mode on the camera body.</li>
                <li>Select a HEIF image, or choose "Select range" to mark a batch.</li>
                <li>Navigate to the "HEIF-JPEG conversion" option in the playback menu.</li>
                <li>Confirm. The camera saves JPEG copies alongside (or instead of) the originals.</li>
            </ol>
            <p>This uses the camera's own tone-mapping engine, preserves EXIF, and handles HDR PQ mapping correctly. Quality is solid, but you have no control over the JPEG quality setting.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Via manufacturer software</h3>
            <p><strong>Canon Digital Photo Professional (DPP):</strong> Activate the HEVC codec in Help → Activate HEVC Codec, then open your <code class={inlineCode}>.HIF</code> files from a compatible body. Use "Convert and save" or "Batch process" to output Exif-JPEG or TIFF. Canon notes that HDR PQ HEIFs converted this way are saved as SDR images; the colors and gradations will differ somewhat from HDR display, but the output is universally shareable.</p>
            <p><strong>Sony Imaging Edge Desktop:</strong> Download the app and activate the HEIF Extension using your camera's serial number (a one-time step). Open your HEIF stills in the Viewer, edit as needed, and export to JPEG or TIFF. Important: for HLG (Hybrid Log-Gamma) stills, enable "Apply the gamma to leave the highlight tone of HLG still images" before exporting, or bright areas will clip. For the Sony-specific walkthrough, see <a href="https://mochify.app/guides/sony-hif-to-jpg">converting Sony HIF files to JPG</a>.</p>
            <p><strong>Fujifilm:</strong> Fujifilm's X RAW Studio processes <code class={inlineCode}>.RAF</code> raw files using the camera as the engine over USB and outputs JPEG, though it is not a direct HIF-to-JPG converter. For <code class={inlineCode}>.HIF</code> files, the most reliable paths are the in-camera or third-party routes above. For Fujifilm-specific depth on film simulations and conversion workflows, see our <a href="/guides/fujifilm-hif-to-jpg">Fuji HIF to JPG guide</a>.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Online and browser-based converters</h3>
            <p>Two types exist, and the distinction matters for privacy:</p>
            <p><strong>Server-side converters:</strong> You upload the file, it is processed on a remote server, and you download the JPEG. Fast, but your file leaves your device. Quality depends entirely on the service's encoder.</p>
            <p><strong>Client-side (WebAssembly) converters:</strong> These run libheif or ImageMagick compiled to WebAssembly inside your browser tab. The file never leaves your machine. Performance is CPU-dependent. Look for explicit "runs locally" or "processed in your browser" language on the service page.</p>
            <p>For a privacy-first option that uses jpegli for JPEG encoding, see the Mochify Workflow section below.</p>
        </section>

        <!-- Section 4 -->
        <section id="what-you-lose-and-keep">
            <SectionHeading>What you lose (and keep) going 10-bit HIF to 8-bit JPG</SectionHeading>
            <p>The core trade-off is bit depth. HIF files from professional cameras are typically 10-bit per channel. Standard JPEG is 8-bit. That means moving from 1,024 tonal steps per channel to 256, and in smooth gradients like skies and skin, that compression can show up as banding or posterisation. For the short version, <a href="https://mochify.app/guides/does-hif-to-jpg-lose-quality">does converting HIF to JPG reduce quality?</a></p>
            <p>In practice, the risk is more theoretical than catastrophic for well-exposed shots. Good converters apply perceptual tone-mapping and dithering to spread quantisation across imperceptible steps. Photoshop users, for example, can enable "Use dither" when exporting 8-bit images from higher-bit sources to hide gradient steps.</p>
            <p>Google's jpegli encoder (introduced April 2024) takes this further: it uses adaptive quantisation and higher-precision internal computation, specifically targeting visible banding in slow gradients. <a href="https://opensource.googleblog.com/2024/04/introducing-jpegli-new-jpeg-coding-library.html" target="_blank" rel="noopener noreferrer">Google's benchmarks show jpegli achieving around 35% better compression than traditional JPEG at high quality settings</a> while maintaining or improving visual quality, a meaningful gap-closer when your source is a 10-bit HIF. Mochify uses jpegli as its JPEG encoder, which is why our JPG outputs hold quality that traditional converters sacrifice at the same file size. See our <a href="/guides/jpeg-in-2026-jpegli">jpegli guide</a> for the technical detail.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Canon HDR PQ: what to expect from the SDR conversion</h3>
            <p>Canon's HDR PQ files are the most demanding to convert. They encode a wide dynamic range using a PQ gamma curve that SDR displays cannot reproduce. Any HIF-to-JPG conversion from a Canon HDR PQ file involves tone-mapping; some tonal relationships will shift, and the output will look different from the HDR original on an HDR-capable screen. Canon's own tools (DPP and in-camera conversion) aim to produce the most credible SDR approximation, but every converter makes different choices about highlight and shadow handling. Verify the result on an SDR display before delivering to a client.</p>
            <p>The full pro-workflow implications, including archiving strategy and when to keep HIF originals, are covered in our <a href="/guides/heif-to-jpeg-workflow-photographers-guide">HIF/HEIF to JPEG for Professional Photographers guide</a>.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Fujifilm film simulations</h3>
            <p>Fujifilm's film simulations are baked into both JPEG and HIF renders at capture. When you convert a HIF to JPG with a color-profile-aware converter, the film sim look survives. The risk is converters that ignore embedded ICC profiles or apply heavy re-compression on top, which can subtly shift Velvia saturation or Classic Chrome's roll-off. A quality-aware encoder that respects the color profile will preserve the look as intended.</p>
        </section>

        <!-- Section 5 -->
        <section id="exif-metadata-and-gps-privacy">
            <SectionHeading>EXIF metadata and GPS privacy</SectionHeading>
            <p>HIF files carry the same EXIF payload as JPEG: camera make and model, lens, ISO, shutter speed, aperture, software, and often GPS coordinates with metre-level precision.</p>
            <p>GPS data in EXIF is a privacy risk that is easy to miss. Anyone who downloads the original file can read the GPS tag with a free EXIF viewer. Privacy researchers have documented how unstripped location data in shared images can reveal home addresses, workplaces, schools, and daily routines. The EXIF specification also includes device serial numbers, which are useful for fingerprinting a photographer's gear across public archives.</p>
            <p>Most professional workflows either strip GPS fields for public sharing or remove all EXIF when sending to clients who do not need it. A good HIF-to-JPG converter should give you explicit control over what metadata survives. For the full picture on EXIF risk and how to manage metadata throughout your image workflow, see our <a href="/guides/exif-data-risks-image-compression-2026">guide to EXIF data risks</a>.</p>
        </section>

        <!-- Section 6 -->
        <section id="why-jpg-is-still-the-safe-format">
            <SectionHeading>Why JPG is still the safe universal share format</SectionHeading>
            <p>JPEG remains the one format that every browser, social network, CMS, marketplace, and print service can handle without question. That is not because JPEG is the most efficient format; modern alternatives are measurably better, but universal acceptance is worth more than compression gains when a file needs to open everywhere.</p>
            <p>The <a href="https://almanac.httparchive.org/en/2022/media" target="_blank" rel="noopener noreferrer">HTTP Archive Web Almanac</a> reports images account for around 36–37% of total page weight on a median website, making format choice a meaningful performance lever. Despite this, browser support for newer formats is still uneven:</p>

            <ScrollableTable class="my-6">
                <table class="w-full min-w-[600px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Format</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Chrome</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Firefox</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Edge</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Safari</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each browserSupport as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">{row.fmt}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.chrome}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.firefox}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.edge}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.safari}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.notes}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>
            <p class="text-sm text-[#875F42]">Sources: <a href="https://caniuse.com/heif" target="_blank" rel="noopener noreferrer">caniuse.com/heif</a>, <a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">caniuse.com/avif</a>, <a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer">caniuse.com/jpegxl</a>, checked June 2026.</p>

            <p>JPEG's durability is reinforced by jpegli. The ~35% compression improvement at high quality settings narrows the gap between traditional JPEG and modern formats like AVIF and WebP considerably. When compatibility cannot be compromised, a well-encoded jpegli JPEG is the practical answer: it opens everywhere and wastes fewer bytes doing it.</p>
            <p>For photographers deciding which format to capture in, our <a href="/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera">Should I Shoot HEIF or JPEG guide</a> weighs the trade-offs before the shutter fires.</p>
        </section>

        <!-- Section 7 -->
        <section id="mochify-workflow">
            <SectionHeading>Mochify Workflow: convert HIF to JPG in one step</SectionHeading>
            <p>Mochify's HIF-to-JPG converter accepts <code class={inlineCode}>.HIF</code> files directly from Canon, Sony, and Fujifilm cameras. The fastest path is natural language via Magic Flow; describe what you want in plain English, and the tool resolves format, quality, resize, and metadata settings automatically.</p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-7 my-6">
                <ol class="flex flex-col gap-5 list-none p-0 m-0">
                    <li class="flex gap-4 items-start m-0 p-0">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">1</span>
                        <div class="flex-1 pt-0.5"><p class="text-[#6C3F31] text-base m-0">Go to <a href="/solutions/hif-to-jpg">mochify.app/solutions/hif-to-jpg</a>.</p></div>
                    </li>
                    <li class="flex gap-4 items-start m-0 p-0">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">2</span>
                        <div class="flex-1 pt-0.5"><p class="text-[#6C3F31] text-base m-0">Drop your <code class={inlineCode}>.HIF</code> files into the upload area. Up to 3 files per session on Free with no account needed; up to 25 per batch on Seller and Pro.</p></div>
                    </li>
                    <li class="flex gap-4 items-start m-0 p-0">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">3</span>
                        <div class="flex-1 pt-0.5">
                            <p class="text-[#6C3F31] text-base mb-2">Type your instruction in the Magic Flow prompt. Examples that work:</p>
                            {#each workflowPrompts as prompt}
                                <blockquote class="border-l-4 border-[#F06292] bg-[#FFF0F5] rounded-r-xl px-4 py-2 italic text-[#4A2C2C] text-sm my-2">{prompt}</blockquote>
                            {/each}
                        </div>
                    </li>
                    <li class="flex gap-4 items-start m-0 p-0">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center">4</span>
                        <div class="flex-1 pt-0.5"><p class="text-[#6C3F31] text-base m-0">Mochify processes the files and returns your JPEGs for download.</p></div>
                    </li>
                </ol>

                <div class="mt-6 pt-5 border-t border-pink-100 space-y-3 text-base text-[#6C3F31]">
                    <p>Magic Flow uses a two-step pipeline: a language model (currently Mistral Small) parses your instruction, then Mochify's C++ encoder executes using jpegli for JPEG output. You get a universally compatible JPEG that holds significantly more quality per byte than a conventionally encoded file.</p>
                    <p><strong>For larger shoots:</strong> a Seller or Pro subscription lifts the batch limit to 25 files and the file size ceiling to 75 MB, useful for high-resolution 10-bit HIF files from full-frame bodies.</p>
                </div>

                <div class="mt-5 pt-5 border-t border-pink-100 text-sm text-[#875F42] space-y-3">
                    <p>🔒 <strong>Privacy:</strong> when you upload a <code class={inlineCode}>.HIF</code> file to Mochify, it travels to our encoder at <code class={inlineCode}>api.mochify.app</code> over HTTPS. We stream it into RAM, encode it, and wipe the original immediately - no disk writes, no logs containing file data.</p>
                    <p>The CLI and local MCP (<code class={inlineCode}>mochify serve</code>) use the same zero-retention model. Files travel to <code class={inlineCode}>api.mochify.app</code> for encoding, but the output is returned directly to your local binary with nothing held server-side:</p>
                    <div class="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm shadow-inner border border-slate-700 overflow-x-auto not-italic">mochify -p "convert to jpg and strip GPS" yourfile.hif</div>
                    <p>Magic Flow is also available through the REST API at <code class={inlineCode}>POST /v1/prompt</code> on <code class={inlineCode}>api.mochify.app</code> for server-side automation.</p>
                </div>
            </div>
        </section>

        <!-- Section 8 -->
        <section id="cheat-sheet">
            <SectionHeading>HIF to JPG cheat sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Method</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Best for</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Batch?</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Quality control</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Strips metadata?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each cheatSheet as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">{row.method}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.best}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.batch}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.quality}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.strips}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} heading="Frequently Asked Questions" />

        <!-- CTA -->
        <div class="my-10 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Convert HIF to JPG in one step</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6">Drop your files, type a prompt like <em>"convert to JPG and strip location data"</em>, and Mochify handles the rest - jpegli for quality-first encoding and your choice of metadata handling.</p>
            <a href="/solutions/hif-to-jpg" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try HIF to JPG free →
            </a>
        </div>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7" /></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
