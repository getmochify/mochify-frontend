<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: 'AI Image Compression and Conversion: Describe the Result, Skip the Settings',
        description: 'AI image compression and conversion: describe the result in plain English and let Mochify pick the format, quality and size, across web, CLI, API and MCP.',
        category: 'AI & Automation',
        readTime: '12 min read',
        date: 'June 30, 2026',
    };

    const toc = [
        { n: '01', href: '#the-real-problem', label: 'The real problem: image settings are a guessing game' },
        { n: '02', href: '#format-landscape', label: 'The 2026 format landscape, in plain terms' },
        { n: '03', href: '#speed-and-revenue', label: 'Why this is really a speed-and-revenue problem' },
        { n: '04', href: '#how-ai-removes-guesswork', label: 'How AI image compression removes the guesswork' },
        { n: '05', href: '#every-surface', label: 'One interface, every surface' },
        { n: '06', href: '#bulk-work', label: 'Bulk work without the busywork' },
        { n: '07', href: '#mochify-workflow', label: 'The Mochify workflow: a web-ready product set' },
        { n: '08', href: '#how-mochify-compares', label: 'How Mochify compares to the tools you know' },
        { n: '09', href: '#privacy-gdpr', label: 'Privacy, retention, and GDPR' },
        { n: '10', href: '#cheat-sheet', label: 'Cheat sheet' },
        { n: '11', href: '#faq', label: 'FAQ' },
        { n: '12', href: '#related-guides', label: 'Related guides' },
    ];

    const formatTable = [
        { goal: 'Default web photos', use: 'AVIF, WebP fallback, JPEG safety net', why: 'Smallest files with full browser coverage' },
        { goal: 'Logos, icons, UI, screenshots', use: 'SVG or lossless PNG/WebP', why: 'Pixel-perfect, no visible artefacts' },
        { goal: 'Photography or Apple-only audience', use: 'JPEG XL (deliberately)', why: 'Excellent compression, but ~14% native browser support' },
        { goal: 'Universal compatibility, minimal change', use: 'JPEG via jpegli', why: 'Familiar JPEG output, fewer wasted bytes' },
    ];

    const surfaceTable = [
        { you: 'A creator or seller, occasional jobs', use: 'Web app or Chrome extension' },
        { you: 'A developer scripting a build', use: 'CLI (mochify -p "...") or REST API' },
        { you: 'Building with an AI agent', use: 'Local MCP server (paths, no image bytes in context)' },
        { you: 'A non-developer who wants no install', use: 'Hosted MCP server (short-lived download URL)' },
    ];

    const faqs = [
        {
            q: 'How should I choose between JPEG, WebP, AVIF, and JPEG XL for my website?',
            a: 'For most sites in 2026, generate AVIF as the primary format, WebP as a widely supported fallback, and JPEG or PNG as a final safety net. AVIF usually gives the smallest files, WebP still beats JPEG and PNG comfortably, and JPEG XL, while technically strong, has limited browser support and is best kept for niche or photography use.',
        },
        {
            q: 'What quality setting should I use to compress images without losing quality?',
            a: 'For JPEG, the 65 to 85 percent range usually balances quality and size well, and AVIF or WebP can match the look at smaller sizes. The right value depends on the image, which is why describing your goal and letting the tool target it is more reliable than fixing a single number for every file.',
        },
        {
            q: 'How do I compress images for my website without making them look blurry?',
            a: 'Pick an efficient modern format such as AVIF or WebP, resize each image to no larger than the size it actually displays at, and compress at a moderate quality while checking a few key images by eye. Never upscale a low-resolution original, and use lossless settings for logos and UI rather than photographic compression.',
        },
        {
            q: 'How can I bulk-compress images for a website or shop?',
            a: 'For a few files, a browser tool handles it. For a catalogue, integrate a CLI or REST API into your upload or build process so images are converted, resized, and compressed automatically. With Mochify you can process three files at a time on the free tier, up to 25 per batch on a paid tier, or automate any volume through the CLI, API, or an MCP-connected agent.',
        },
        {
            q: 'Does compressing images actually help my SEO rankings?',
            a: "Indirectly, yes. Compression is not a direct ranking factor, but it reduces page weight and improves Largest Contentful Paint, which is part of Google's Core Web Vitals and page experience signals. Lighter images help you pass those thresholds, and studies link small speed gains to measurable conversion improvements.",
        },
        {
            q: 'What is the difference between this and AI image generation?',
            a: 'Generative AI invents new pixels. Natural-language compression does not create or alter image content; it reads your plain-English instruction, works out the correct format, quality, and size, and hands the encoding to a deterministic engine. The output is your image, optimised, not a synthetic one.',
        },
        {
            q: 'Is AVIF safe to use when some browsers still lag?',
            a: 'Yes, when served with fallbacks. Every major evergreen browser supports AVIF, and the standard pattern is to deliver AVIF with WebP and JPEG fallbacks so older clients still get a working image. Mochify generates the modern format and its fallback for you.',
        },
        {
            q: 'What privacy issues should I think about with online image compressors?',
            a: 'If your images contain people or personal metadata, you are sending personal data to a third-party processor, so GDPR rules on contracts, security, retention, and international transfers apply. Choose a processor with a clear retention policy and a data processing agreement. Mochify keeps zero retention on images and PDFs and processes video entirely in your browser.',
        },
    ];

    const related = [
        { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local', desc: 'Set up image compression for AI agents, on either surface.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The Guide to Next-Gen Formats: WebP, AVIF, JPEG XL', desc: 'The deeper format trade-offs behind the cheat sheet.' },
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize and Convert in One Prompt', desc: 'The bulk product-image pattern end to end.' },
        { href: '/guides/optimizing-hero-images', title: 'Optimizing Hero Images for Web Performance', desc: 'The LCP mechanics in detail.' },
        { href: '/guides/privacy-image-optimization', title: 'Privacy and Image Optimization: A Comprehensive Guide', desc: 'What zero retention means for agencies and regulated work.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mochify.app/guides/ai-image-compression-conversion" />
    <link rel="canonical" href="https://mochify.app/guides/ai-image-compression-conversion" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "AI Image Compression and Conversion: Describe the Result, Skip the Settings",
      "description": "AI image compression and conversion: describe the result in plain English and let Mochify pick the format, quality and size, across web, CLI, API and MCP.",
      "url": "https://mochify.app/guides/ai-image-compression-conversion",
      "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
      "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app", "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" } },
      "datePublished": "2026-06-29",
      "dateModified": "2026-06-29",
      "inLanguage": "en-GB",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://mochify.app/guides/ai-image-compression-conversion" },
      "about": [
        {"@type": "Thing", "name": "AI image compression"},
        {"@type": "Thing", "name": "Image conversion"},
        {"@type": "Thing", "name": "AVIF"},
        {"@type": "Thing", "name": "WebP"},
        {"@type": "Thing", "name": "Core Web Vitals"},
        {"@type": "Thing", "name": "Model Context Protocol"}
      ],
      "keywords": "ai image compression, ai image converter, ai image optimization, optimize images for web, bulk image compression, avif, webp, jpeg xl, magic flow, mcp server"
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/"},
        {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
        {"@type": "ListItem", "position": 3, "name": "AI Image Compression and Conversion", "item": "https://mochify.app/guides/ai-image-compression-conversion"}
      ]
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How should I choose between JPEG, WebP, AVIF, and JPEG XL for my website?",
          "acceptedAnswer": {"@type": "Answer", "text": "For most sites in 2026, generate AVIF as the primary format, WebP as a widely supported fallback, and JPEG or PNG as a final safety net. AVIF usually gives the smallest files, WebP still beats JPEG and PNG comfortably, and JPEG XL, while technically strong, has limited browser support and is best kept for niche or photography use."}
        },
        {
          "@type": "Question",
          "name": "What quality setting should I use to compress images without losing quality?",
          "acceptedAnswer": {"@type": "Answer", "text": "For JPEG, the 65 to 85 percent range usually balances quality and size well, and AVIF or WebP can match the look at smaller sizes. The right value depends on the image, which is why describing your goal and letting the tool target it is more reliable than fixing a single number for every file."}
        },
        {
          "@type": "Question",
          "name": "How do I compress images for my website without making them look blurry?",
          "acceptedAnswer": {"@type": "Answer", "text": "Pick an efficient modern format such as AVIF or WebP, resize each image to no larger than the size it actually displays at, and compress at a moderate quality while checking a few key images by eye. Never upscale a low-resolution original, and use lossless settings for logos and UI rather than photographic compression."}
        },
        {
          "@type": "Question",
          "name": "How can I bulk-compress images for a website or shop?",
          "acceptedAnswer": {"@type": "Answer", "text": "For a few files, a browser tool handles it. For a catalogue, integrate a CLI or REST API into your upload or build process so images are converted, resized, and compressed automatically. With Mochify you can process three files at a time on the free tier, up to 25 per batch on a paid tier, or automate any volume through the CLI, API, or an MCP-connected agent."}
        },
        {
          "@type": "Question",
          "name": "Does compressing images actually help my SEO rankings?",
          "acceptedAnswer": {"@type": "Answer", "text": "Indirectly, yes. Compression is not a direct ranking factor, but it reduces page weight and improves Largest Contentful Paint, which is part of Google's Core Web Vitals and page experience signals. Lighter images help you pass those thresholds, and studies link small speed gains to measurable conversion improvements."}
        },
        {
          "@type": "Question",
          "name": "What is the difference between this and AI image generation?",
          "acceptedAnswer": {"@type": "Answer", "text": "Generative AI invents new pixels. Natural-language compression does not create or alter image content; it reads your plain-English instruction, works out the correct format, quality, and size, and hands the encoding to a deterministic engine. The output is your image, optimised, not a synthetic one."}
        },
        {
          "@type": "Question",
          "name": "Is AVIF safe to use when some browsers still lag?",
          "acceptedAnswer": {"@type": "Answer", "text": "Yes, when served with fallbacks. Every major evergreen browser supports AVIF, and the standard pattern is to deliver AVIF with WebP and JPEG fallbacks so older clients still get a working image. Mochify generates the modern format and its fallback for you."}
        },
        {
          "@type": "Question",
          "name": "What privacy issues should I think about with online image compressors?",
          "acceptedAnswer": {"@type": "Answer", "text": "If your images contain people or personal metadata, you are sending personal data to a third-party processor, so GDPR rules on contracts, security, retention, and international transfers apply. Choose a processor with a clear retention policy and a data processing agreement. Mochify keeps zero retention on images and PDFs and processes video entirely in your browser."}
        }
      ]
    }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            AI Image Compression and Conversion: Describe the Result, Skip the Settings
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-4">
            AI image compression and conversion means turning heavy, inconsistent photos into fast, standards-compliant files (AVIF, WebP, or a well-tuned JPEG) at the right size and quality, without you having to know which format or quality value to pick. You describe the outcome you want in plain English, a language model works out the settings, and a native engine does the encoding.
        </p>

        <p class="text-base text-[#875F42] max-w-2xl mb-8">
            This guide covers why image settings are a guessing game, the 2026 format landscape, how natural-language compression actually works, how it differs from generative AI, and how to use it from a single browser prompt to a fully agentic pipeline.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong class="text-[#4A2C2C]">Published June 30, 2026 by the Mochify Engineering Team.</strong> The same approach scales from one person dropping three photos into a browser to a developer wiring image processing straight into an AI agent.
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

        <!-- 1. The real problem -->
        <section id="the-real-problem" class="scroll-mt-24">
            <SectionHeading>The real problem: image settings are a guessing game</SectionHeading>
            <p class="mb-4">Getting images right is hard because the decision is multi-dimensional: format, quality, dimensions, responsive sizing, and the lossless-versus-lossy trade-off all interact, and there is no single correct answer for every image. Google's own optimisation guidance calls image optimisation "both an art and a science," which is a polite way of saying most people are guessing.</p>
            <p class="mb-4">The first trap is format choice. <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types" target="_blank" rel="noopener noreferrer">MDN's image-format guide</a> lists a long menu of web image types, each with different compression behaviour, transparency support, and browser compatibility. Pick "just JPEG" out of habit and you can easily ship double the bytes you need. The second trap is quality and effort settings: <a href="https://web.dev/articles/serve-images-webp" target="_blank" rel="noopener noreferrer">web.dev's compression guidance</a> notes that most images can be heavily compressed with little visible loss, but the right value has to be found by eye, and it changes with the content of each image. The usual sweet spot sits somewhere around 65 to 85 percent quality, except when it does not.</p>
            <p class="mb-4">Then there is sizing. A camera produces a 6000px-wide file; your layout shows it at 1600px. Serving the original means the browser downloads roughly four times the pixels it can use. Responsive markup (<code>srcset</code>, <code>sizes</code>, and <code>&lt;picture&gt;</code>) fixes this, but it asks content editors to reason about layout width, device pixel ratio, and art-direction crops. That is well beyond what most people creating product listings or blog posts signed up for. Finally, "lossless versus lossy" is a genuinely technical distinction dressed up in marketing language like "compress without losing quality," which leaves non-experts unsure when a tiny, invisible quality loss is a fair trade for a much smaller file (it usually is, for photographs).</p>
            <p class="mb-0">None of this is unknowable. It is just specialist knowledge that has nothing to do with running a shop, shooting a gallery, or writing a page. That gap, between what good optimisation requires and what a normal user can reasonably hold in their head, is exactly what an AI front end is built to close.</p>
        </section>

        <!-- 2. Format landscape -->
        <section id="format-landscape" class="scroll-mt-24">
            <SectionHeading>The 2026 format landscape, in plain terms</SectionHeading>
            <p class="mb-4">For most sites in 2026 the pragmatic answer is: serve AVIF first, fall back to WebP, and keep JPEG or PNG as a final safety net. That single rule captures almost all of the available savings while staying compatible with every browser in use.</p>
            <p class="mb-4">Here is why. WebP is effectively universal across evergreen browsers, and <a href="https://web.dev/articles/serve-images-webp" target="_blank" rel="noopener noreferrer">web.dev reports it typically cuts file size by 25–35% versus JPEG and PNG</a> at comparable quality. AVIF goes further again, usually shaving another meaningful chunk off WebP at the same visual quality, and <a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">Can I Use shows AVIF now supported across current Chrome, Edge, Firefox, and Safari</a> and their mobile versions. That combination is why Google's own Lighthouse flags images that are not in a modern format: the savings are large and the support is there.</p>
            <p class="mb-4">JPEG XL is the interesting outlier. It compresses superbly, but its browser support is split: <a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer">Can I Use shows it enabled by default in Safari 17 and later</a>, while Chrome and Edge keep it off by default and Firefox hides it behind a preference. Industry estimates put the share of browsers that can natively display JPEG XL at roughly 14 percent. That makes it excellent for archival, photography pipelines, and Apple-centric audiences, but not yet a safe default for general web delivery. The honest position is that JPEG XL is a "use it deliberately, not by default" format in 2026.</p>
            <p class="mb-0">The practical takeaway is that you do not need to memorise any of this. You need a tool that knows the current support picture and applies it for you, generating the modern format with the right fallback rather than making you choose. We keep a <a href="/comparison">live quality comparison tool</a> so you can see the formats side by side on your own images, and our <a href="/guides/2026-guide-next-gen-formats">next-gen formats guide</a> goes deeper on the trade-offs.</p>
        </section>

        <!-- 3. Speed and revenue -->
        <section id="speed-and-revenue" class="scroll-mt-24">
            <SectionHeading>Why this is really a speed-and-revenue problem</SectionHeading>
            <p class="mb-4">Image weight is not a cosmetic concern; it is usually the single biggest lever on page speed, and page speed feeds directly into rankings and revenue. Images are consistently the heaviest resource type on a typical page, accounting for the largest share of transferred bytes according to the HTTP Archive Web Almanac. Cut that weight and you move the metric Google actually measures.</p>
            <p class="mb-4">That metric is Largest Contentful Paint. <a href="https://web.dev/articles/lcp" target="_blank" rel="noopener noreferrer">Web.dev defines a "good" LCP as occurring within 2.5 seconds</a>, and on most content-led and commercial pages the LCP element is an image, typically a hero shot or the main product photo. The arithmetic is unforgiving: on a typical mobile connection a 500 KB hero takes several times longer to arrive than a 100 KB optimised version, and that difference lands squarely on your LCP before the server or the browser has done anything else. Compress and resize that one image well and you can claw back a few hundred milliseconds on the most visible part of the page.</p>
            <p class="mb-4">Those milliseconds have a price. <a href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener noreferrer">Google Search Central confirms Core Web Vitals are used by its ranking systems</a>, acting as a real tiebreaker between pages of similar relevance, which matters most on competitive commercial queries. And the commercial impact is measurable: <a href="https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html" target="_blank" rel="noopener noreferrer">Deloitte's "Milliseconds Make Millions" study</a>, commissioned by Google, found that a 0.1 second improvement in mobile site speed was associated with an 8.4% lift in retail conversion rate and a 9.2% rise in average order value. Akamai's Image Manager case study with The Telegraph reported that reducing image weight by around 50% improved overall page load time by 9.6% and cut mobile load time by nearly a third.</p>
            <p class="mb-0">This is the part worth sitting with. The edge here is not exotic. It is the same images everyone else has, shipped lighter and faster. A competitor relying on default export settings ships heavy pages; you ship light ones; over thousands of visits that compounds into better rankings, lower bounce, and more orders. Our <a href="/guides/optimizing-hero-images">hero image optimisation guide</a> covers the LCP mechanics in more detail.</p>
        </section>

        <!-- 4. How AI removes guesswork -->
        <section id="how-ai-removes-guesswork" class="scroll-mt-24">
            <SectionHeading>How AI image compression removes the guesswork (and how it differs from generative AI)</SectionHeading>
            <p class="mb-4">A natural-language interface for image work means you describe your goal in plain English and a language model maps it to precise operations, which a deterministic engine then executes. This is the opposite of generative AI. Nothing is being invented or hallucinated. The model is not drawing new pixels; it is choosing a format, a quality, and a size based on best practice, then handing the actual encoding to a native engine that produces the same output every time.</p>
            <p class="mb-4">That distinction matters because the "AI image" space is crowded with tools that generate or detect synthetic pictures. This is neither. Instead of clicking through dropdowns for <em>"convert to AVIF, resize to 1600px wide, quality 75, strip metadata,"</em> you type something like <em>"make these product photos web-ready, under 120 KB each, and remove the location data,"</em> and the system resolves the parameters for you. Mochify calls this Magic Flow. Under the hood it is a two-step pipeline: a language model (currently Mistral Small 4) parses your prompt, then Mochify's native C++ engine does the compression. There is no quality slider to misjudge and no settings panel to learn. The plain-English description is the interface.</p>
            <p class="mb-0">For a non-technical creator or seller, this collapses a stack of specialist decisions into one sentence about the result they want. Phrases that map cleanly to real intent work well: <em>"compress these for Shopify listings,"</em> <em>"convert to AVIF with a fallback and keep them sharp,"</em> <em>"shrink this for an email newsletter."</em> The model carries the knowledge of LCP, chroma subsampling, and AVIF tuning so you do not have to. And because the same prompt interface is available to developers and agents too, the knowledge gap closes for everyone at once rather than only for the people who already understand codecs.</p>
        </section>

        <!-- 5. Every surface -->
        <section id="every-surface" class="scroll-mt-24">
            <SectionHeading>One interface, every surface: from a single prompt to an agentic pipeline</SectionHeading>
            <p class="mb-4">The same natural-language approach runs everywhere you might want to work, which is what lets a casual user and a power user use one tool rather than two. It helps to separate two ideas the rest of this section relies on. Surfaces are <em>where</em> you reach Mochify: the web app, the Chrome extension, the command-line tool, the local MCP server, and the hosted MCP server. Formats are <em>what</em> it does to your files: images, PDFs, and video. They are different kinds of thing, so we keep them separate.</p>
            <p class="mb-4">At the casual end, the web app and the Chrome extension are point-and-describe: drop in your files, type what you want, download the result. Images and PDFs are sent to Mochify's servers for encoding; video is the exception, processed entirely inside your browser so the footage never leaves your device.</p>
            <p class="mb-4">At the power-user end, the same engine is a developer surface. The <a href="https://github.com/getmochify/mochify-cli" target="_blank" rel="noopener noreferrer">command-line tool</a> (<code>mochify</code>, installed with <code>brew install mochify</code>) brings Magic Flow to your terminal with a <code>-p</code> flag, so a prompt fits straight into a build script:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-xl p-4 mb-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>mochify -p "convert to avif, max 1600px wide, keep them sharp" ./images</code></pre>
            <p class="mb-4">The REST API at <code>api.mochify.app</code> exposes the same capability through <code>POST /v1/prompt</code> for natural language, <code>POST /v1/squish</code> for direct image work, and <code>POST /v1/pdf</code> for document pages. Authentication is a one-time <code>mochify auth login</code> in the browser.</p>
            <p class="mb-0">The surface that defines the category, though, is the MCP server. The Model Context Protocol is an <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">open standard from Anthropic</a> that lets AI assistants call external tools in a controlled, structured way, often described as a USB-C port for AI applications. Mochify ships two MCP surfaces. The local MCP server (<code>mochify serve</code>, the same binary as the CLI) returns file paths and metadata rather than image bytes, so the picture data never bloats the agent's context, which is the right default for developers building with Claude Code, Cursor, or Cline. The hosted MCP server at <code>mcp.mochify.app</code> needs no install and returns a short-lived download URL (valid for about five minutes) instead of inline binary, which suits non-developers who just want it to work. Both surfaces are available on every pricing tier, including Free; MCP and API access are not paywalled. Our <a href="/guides/how-the-mochify-mcp-server-works">guide to the hosted vs local MCP server</a> walks through setup for each.</p>
        </section>

        <!-- 6. Bulk work -->
        <section id="bulk-work" class="scroll-mt-24">
            <SectionHeading>Bulk work without the busywork</SectionHeading>
            <p class="mb-4">The volume problem is where the spectrum pays off, because real catalogues and galleries generate far more images than anyone wants to drag through a browser one batch at a time. A product catalogue, a photographer's shoot, or a marketplace listing set can run to hundreds or thousands of files, and manual optimisation simply does not scale to those numbers; it gets skipped, and the site ships heavy.</p>
            <p class="mb-4">Manual batching is fine for a handful of images. On the free tier you can process three files at a time, and on a paid tier up to 25 in a single batch, which covers most one-off jobs. Beyond that, the answer is to stop touching individual files. Wire the CLI into your upload step or build, and every new image is converted to AVIF with a WebP fallback, resized, and compressed automatically. Or let an AI agent do it: because the engine is exposed over MCP, an agent can scan a folder for oversized images, batch-convert them, and report back, all from one natural-language instruction. A non-technical colleague describes the policy once ("all new listings as AVIF and WebP, max 2000px"), a developer wires it in once, and after that it runs in the background. Our <a href="/guides/ecommerce-product-photo-workflow-resize-convert">product photo workflow guide</a> and the <a href="/guides/ai-agent-workflow-automation-photographers">photographer automation guide</a> show both patterns in practice.</p>
            <p class="mb-0">The time saved is real even if it is hard to put a single number on: an afternoon of manual work per campaign becomes a process that runs itself.</p>
        </section>

        <!-- 7. Mochify workflow -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: a web-ready product set in one prompt</SectionHeading>
            <p class="mb-6">Here is the end-to-end flow for the most common job, getting a set of product photos web-ready, led by Magic Flow.</p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl p-6 md:p-8 border border-pink-100 mb-6">
                <ol class="space-y-6">
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Describe the outcome.</strong>
                            <p class="mb-0">In the web app, the CLI, or through an agent, type what you want in plain English: <em>"Make these product photos web-ready: convert to AVIF with a WebP fallback, scale to a maximum of 1600px wide, keep them under 120 KB each, and strip the location data."</em></p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Let the model resolve the settings.</strong>
                            <p class="mb-0">Magic Flow parses the prompt, picks the format and quality, sets the resize, and queues the batch. You do not choose a quality value or a codec.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">The engine encodes.</strong>
                            <p class="mb-0">Mochify's native C++ engine does the compression on the server and returns the optimised files (or, through the local CLI and local MCP server, writes them straight to disk).</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Drop them in.</strong>
                            <p class="mb-0">Upload the AVIF set with its fallbacks to your store or CMS, or let your pipeline do it if you have wired the CLI or API in.</p>
                        </div>
                    </li>
                </ol>
            </div>

            <InfoBox type="note" title="A note on what happens to your files">
                For images and PDFs, the request travels to <code>api.mochify.app</code> over HTTPS, is processed in memory, and is wiped immediately after encoding, with no disk writes of the original and no logs containing file data. That is zero retention on the image and PDF path. Video is different: it is processed in your browser and never leaves your device.
            </InfoBox>
        </section>

        <!-- 8. How Mochify compares -->
        <section id="how-mochify-compares" class="scroll-mt-24">
            <SectionHeading>How Mochify compares to the tools you already know</SectionHeading>
            <p class="mb-4">The established tools are good at what they do; the gap is in how you reach them and how much you need to know. TinyPNG now offers smart AVIF, WebP, PNG, and JPEG compression through a friendly web app plus a REST API and SDKs, which is a solid option for basics and for developers happy to script against an HTTP endpoint. Squoosh, Google's open-source app and CLI, exposes fine-grained, codec-level control (WebP, AVIF, JPEG XL, MozJPEG, and more) and is excellent for developers who want to turn every knob, though it runs as a local dev tool rather than a managed service. ILoveIMG provides pragmatic browser utilities and a general image API. ShortPixel pairs a cloud service with WordPress plugins and a CDN. Cloudinary is a full media platform with automatic format selection and a deep transformation API.</p>
            <p class="mb-0">Two things stand out across all of them. First, modern-format support is converging on WebP and AVIF, but a true natural-language interface is not something any of the mainstream services currently offer; they expect you to operate dashboards, plugins, sliders, or API parameters yourself. Second, none of them ships a first-class MCP server for AI agents. That is the niche Mochify is built for: best-practice image and PDF engines reachable by plain-English prompt across the web, a browser extension, a CLI, two MCP surfaces, and a REST API. If your work is mostly manual and WebP is enough, the incumbents are perfectly good. If you want the settings decided for you, or you are building agentic workflows, that is where the difference shows. You can see the output quality for yourself on our <a href="/comparison">comparison tool</a>, and our <a href="/guides/european-alternative-tinypng-gdpr-compliant-image-compression">European alternative to TinyPNG guide</a> covers the privacy angle in detail.</p>
        </section>

        <!-- 9. Privacy -->
        <section id="privacy-gdpr" class="scroll-mt-24">
            <SectionHeading>Privacy, retention, and GDPR</SectionHeading>
            <p class="mb-4">If your images show identifiable people or carry metadata like GPS coordinates, they count as personal data under UK and EU GDPR, which means the tool you use to process them is a data processor and you are the controller. That makes retention and data transfer real compliance questions, not just nice-to-haves. Regulators including the UK ICO and the EDPB expect controllers to use only processors that provide sufficient guarantees, to hold clear contracts covering the nature and purpose of processing, and to understand where data is stored and whether it leaves the UK or EEA.</p>
            <p class="mb-4">This is why Mochify's retention model is built the way it is, and why it is worth being precise rather than making a single blanket claim. Images and PDFs are streamed into server memory at <code>api.mochify.app</code>, encoded, and wiped immediately, with no disk writes of the source and no logs containing file data. The hosted MCP server additionally holds the <em>compressed output</em> behind an unguessable, five-minute download URL so an agent can fetch it, then evicts it; the original is still discarded at once. The local CLI and local MCP server skip that pickup step entirely and stay zero retention end to end. Video, as noted, never leaves your browser at all. The aggregate position is simple to state honestly: zero retention on image and PDF, and video never leaves the device.</p>

            <InfoBox type="tip" title="For compliance teams">
                For teams that need the paperwork, we publish a <a href="/dpa">Data Processing Agreement</a>, and our <a href="/guides/privacy-image-optimization">privacy and image optimisation guide</a> explains what zero retention means for agencies and regulated work. If you handle client or NDA-bound images, that DPA is the document to send to your compliance team.
            </InfoBox>
        </section>

        <!-- 10. Cheat sheet -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat sheet</SectionHeading>

            <p class="mb-3"><strong>Format decision, at a glance</strong></p>
            <ScrollableTable class="mb-8">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Goal</th>
                            <th class="p-4 font-black">Use</th>
                            <th class="p-4 font-black">Why</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        {#each formatTable as row}
                            <tr>
                                <td class="p-4 font-semibold text-[#4A2C2C]">{row.goal}</td>
                                <td class="p-4">{row.use}</td>
                                <td class="p-4">{row.why}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>

            <p class="mb-3"><strong>Which surface</strong></p>
            <ScrollableTable class="mb-6">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">You are</th>
                            <th class="p-4 font-black">Use</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        {#each surfaceTable as row}
                            <tr>
                                <td class="p-4 font-semibold text-[#4A2C2C]">{row.you}</td>
                                <td class="p-4">{row.use}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>

            <InfoBox type="tip" title="The one rule">
                Describe the result you want in plain English. Let Magic Flow pick the format, quality, and size. MCP and API access are on every tier, including Free.
            </InfoBox>
        </section>

        <!-- 11. FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">Free Tool</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3">
                Stop guessing at quality sliders and format menus
            </h3>
            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                Drop a batch into Mochify and just say what you want: <em>"make these product photos web-ready, convert to AVIF with a fallback, max 1600px, under 120 KB each."</em>
            </p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Try it free at mochify.app</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

        <!-- 12. Related guides -->
        <div id="related-guides">
            <RelatedGuides guides={related} />
        </div>

    </div>
</article>
