<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "What Is a JXL File? How to Open, Convert, and Share JPEG XL",
        description: "A .jxl file is a JPEG XL image. Chrome 155 and Firefox 158 open it; many apps still don't. How to open one, convert it to JPEG, or share it as a PDF.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "August 12, 2026",
        lastUpdated: "October 26, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const related = [
        { href: '/guides/chrome-145-jpeg-xl-default', title: 'Does Chrome 145 Enable JPEG XL by Default in 2026?', desc: 'What Chrome 145 shipped behind a flag, and the Chrome 155 release that turned it on.' },
        { href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl', title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?', desc: 'The quick format decision for web publishing in 2026.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL', desc: 'A complete overview of next-generation image formats and where browser support stands.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>What Is a JXL File? How to Open, Convert and Share JPEG XL</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/what-is-a-jxl-file" />
    <meta name="twitter:card" content="summary_large_image" />

    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/what-is-a-jxl-file"
        description={metadata.description}
        datePublished="2026-08-12"
        dateModified="2026-10-26"
        article={{
            about: ['JPEG XL', 'JXL file format', 'image formats', 'browser support'],
            keywords:
                'jxl file, what is a jxl file, jpeg xl, open jxl file, convert jxl, jxl to pdf, jxl to jpg, jpeg xl browser support'
        }}
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
			<AccentTitle title={metadata.title} accent="JXL File" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            A <code class={inlineCode}>.jxl</code> file is a JPEG XL image, defined under the ISO/IEC 18181 standard. It supports both lossy and lossless compression, wide color gamut, HDR, and high bit depth - and it can losslessly recode an existing JPEG to JXL and restore it byte-for-byte, cutting file size by around 22% in the process. Browsers caught up in October 2026 (Chrome 155 and Firefox 158 decode it by default; Safari has since version 17), but email clients, chat apps and many desktop viewers still do not, so if you have received a JXL file you cannot open, you will likely need to convert it first.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published August 12, 2026 by the Mochify Engineering Team.</strong>
                Based on caniuse.com data and official OS and app documentation current to June 2026.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="how-to-open-a-jxl-file" class="scroll-mt-24">
            <SectionHeading>How to Open a JXL File</SectionHeading>
            <p><strong>On macOS:</strong> Safari 17+ has partial native JXL support, so macOS Sonoma and later can view JXL images in the browser. Finder and Preview support varies by macOS version.</p>
            <p><strong>On Windows:</strong> Windows 11 does not display JXL files by default. Install the <a href="https://apps.microsoft.com/detail/9mzprth5c0tb" target="_blank" rel="noopener noreferrer">JPEG XL Image Extension</a> from the Microsoft Store; after installation, File Explorer and the Photos app can preview <code class={inlineCode}>.jxl</code> files.</p>
            <p><strong>Editing software:</strong> Adobe Photoshop added JXL support in June 2025, so current Creative Cloud subscribers can open and save <code class={inlineCode}>.jxl</code> files directly. GIMP exports JPEG XL natively, and Affinity Photo includes JXL support in its feature set.</p>
            <p>In a browser: Chrome 155 and later (released October 6, 2026), Firefox 158 and later (October 13) and Safari 17 and later all display a <code class={inlineCode}>.jxl</code> inline; Edge had not shipped it as of October 7, 2026. If your Chrome is on 152, 153 or 154, restart it to pick up the update. For the dated per-browser table and the rollout caveats, see our guide to <a href="https://mochify.app/guides/jpeg-xl-chrome-support">JPEG XL in Chrome and what changes now</a>.</p>
        </section>

        <section id="how-to-convert-or-share-a-jxl-file" class="scroll-mt-24">
            <SectionHeading>How to Convert or Share a JXL File</SectionHeading>
            <p><strong>JXL to JPEG</strong> is the most compatible output, and <a href="/solutions/jxl-to-jpg">Mochify's JXL to JPG converter</a> does it in the browser. JPEG opens everywhere - in email clients, older apps, and every browser. If you need to send a JXL image to a client or upload it to a platform that does not yet support the format, converting to JPEG is the safest route.</p>
            <p><strong>JXL to PDF</strong> is the right move when you need to share a batch of JXL images as a single document. If you have shot or received JXL files and need to send them to a client whose email viewer or platform cannot handle the format, bundling them into a PDF sidesteps the compatibility issue entirely. <a href="/solutions/jxl-to-pdf">Mochify's JXL to PDF tool</a> combines up to 20 JXL files - along with PNG, JPG, WebP, AVIF, or HEIC - into one shareable PDF. No software to install; the files are processed server-side and wiped immediately. Screenshots are the clearest case for lossless JXL: <a href="/guides/jxl-vs-png-for-screenshots">a real macOS screenshot came out 46% smaller than PNG</a> with the pixels intact.</p>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Work with your JXL files"
            href="/solutions/jxl-to-pdf"
            label="Try JXL to PDF free →"
        >
            Try <a href="/solutions/jxl-to-pdf">Mochify's JXL to PDF tool</a> to bundle JXL images into a shareable document, or use the <a href="/jpg-to-jpegxl">JPG to JXL converter</a> if you want to go the other direction and convert your JPEGs into space-efficient JXL files.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
