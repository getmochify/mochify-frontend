<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions",
        description: "Why we softened Mochify's 'wiped immediately' claim on hosted MCP compressions to a five-minute pickup window, what we kept end-to-end, and what it means for your workflow.",
        category: "Privacy & Engineering",
        readTime: "5 min read",
        date: "May 29, 2026",
    };

    const faqItems = [
        {
            q: "Does my original image still get wiped immediately?",
            a: "Yes. The original is processed in RAM, encoded, and discarded the moment the response goes out. No disk writes of the source, no logs containing image data, no change from before."
        },
        {
            q: "What exactly is held for five minutes?",
            a: "Only the compressed output, on the hosted MCP path. We hold it in memory so we can serve it via a short-lived download URL instead of trying to return the bytes inline (which was unreliable across chat clients). It is evicted after five minutes regardless of pickup."
        },
        {
            q: "Does this affect the local install or the CLI?",
            a: "No. The local mochify binary (whether you run it as a CLI or as a local MCP server with mochify serve) receives compressed bytes from api.mochify.app and writes them straight to your disk. No pickup store is involved on those paths."
        },
        {
            q: "Why not encrypt the compressed result client-side so the pickup is opaque to Mochify?",
            a: "We considered it. It's a stronger story and we may build it later. For this first cut we chose the simplest viable architecture so we could ship the URL passback fix without delay."
        },
        {
            q: "How do I know when the URL expires?",
            a: "The tool response states \"expires in ~5 minutes\" alongside the URL, and the URL stops resolving at that point. Any downstream automation can rely on the five-minute window without guessing."
        },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mochify.app/guides/why-we-relaxed-zero-retention-for-mcp" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions",
      "description": "Why we softened Mochify's 'wiped immediately' claim on hosted MCP compressions to a five-minute pickup window, what we kept end-to-end, and what it means for your workflow.",
      "url": "https://mochify.app/guides/why-we-relaxed-zero-retention-for-mcp",
      "datePublished": "2026-05-29",
      "dateModified": "2026-05-29",
      "inLanguage": "en",
      "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
      "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
      "isPartOf": { "@type": "CollectionPage", "name": "Image Optimization Guides", "url": "https://mochify.app/guides" },
      "about": [
        { "@type": "Thing", "name": "Image compression" },
        { "@type": "Thing", "name": "MCP server" },
        { "@type": "Thing", "name": "Data retention" }
      ],
      "keywords": "Mochify MCP, zero retention, image compression privacy, hosted MCP server, data retention policy"
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
        { "@type": "ListItem", "position": 3, "name": "Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions", "item": "https://mochify.app/guides/why-we-relaxed-zero-retention-for-mcp" }
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
          "name": "Does my original image still get wiped immediately?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The original is processed in RAM, encoded, and discarded the moment the response goes out. No disk writes of the source, no logs containing image data, no change from before." }
        },
        {
          "@type": "Question",
          "name": "What exactly is held for five minutes?",
          "acceptedAnswer": { "@type": "Answer", "text": "Only the compressed output, on the hosted MCP path. We hold it in memory so we can serve it via a short-lived download URL instead of trying to return the bytes inline (which was unreliable across chat clients). It is evicted after five minutes regardless of pickup." }
        },
        {
          "@type": "Question",
          "name": "Does this affect the local install or the CLI?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. The local mochify binary receives compressed bytes from api.mochify.app and writes them straight to your disk. No pickup store is involved on those paths." }
        },
        {
          "@type": "Question",
          "name": "How do I know when the URL expires?",
          "acceptedAnswer": { "@type": "Answer", "text": "The tool response states 'expires in ~5 minutes' alongside the URL, and the URL stops resolving at that point." }
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
            Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            We added a five-minute hold on compressed outputs from the hosted MCP server so we can return a short-lived download URL instead of inline binary content. Your original image is still discarded immediately after encoding. The local <code class="bg-pink-100 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify</code> binary - CLI and <code class="bg-pink-100 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify serve</code> - still has nothing held server-side at all.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong class="text-[#4A2C2C]">Published 29 May 2026 by the Mochify Engineering Team.</strong> The softening is narrow on purpose, and we'd rather describe the server accurately than carry a phrase that no longer matches what it does.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each [
                        { n: '01', href: '#the-problem',   label: 'The problem we hit' },
                        { n: '02', href: '#the-fix',       label: 'The fix we wanted to build' },
                        { n: '03', href: '#what-we-shipped', label: 'What we shipped, and what we held the line on' },
                        { n: '04', href: '#your-workflow', label: 'What this means for your workflow' },
                        { n: '05', href: '#faq',           label: 'FAQ' },
                    ] as item}
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

        <section id="the-problem" class="scroll-mt-24">
            <SectionHeading>The Problem We Hit</SectionHeading>
            <p class="mb-4">The hosted MCP server at <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mcp.mochify.app</code> used to return compressed images inline to the conversation as binary content. On paper this was the cleanest possible path: one round-trip, no extra fetch step, no third-party storage. In practice it broke. Chat clients vary widely in how they render or save binary returns from MCP tool calls, and the two most common outcomes were the tool call hanging without completing, or the result appearing in the response but proving impossible for the user to save.</p>
            <p>From our side the compression was working: sub-second responses, large reductions, the right output format. The bytes were getting back to the client. The handoff from the chat client to the user was where things came apart, and for a tool that positions itself as the image toolkit for AI-native workflows, "the compression works but you can't actually get your file" is not an acceptable outcome. The full breakdown lives in <a href="/guides/how-the-mochify-mcp-server-works">how the Mochify MCP server works</a>.</p>
        </section>

        <section id="the-fix" class="scroll-mt-24">
            <SectionHeading>The Fix We Wanted to Build</SectionHeading>
            <p class="mb-4">We're agentic-workflow led: the hosted MCP has to actually deliver compressed images to the user, regardless of how well or badly the chat client handles binary returns. That ruled out staying inline. The obvious shape was URL passback. The tool response becomes a short text URL, the chat client treats it like any other link - every chat client handles links - and the user fetches or saves the file directly. Tokens-in-context drop on the return side because a URL is a few dozen bytes rather than an encoded image. Reliability across chat clients goes up because clients have years of experience handling links and almost none handling inline binary from tools.</p>
            <p>The question wasn't whether to do URL passback. It was how to do it without quietly breaking the privacy posture that made Mochify worth using in the first place.</p>
        </section>

        <section id="what-we-shipped" class="scroll-mt-24">
            <SectionHeading>What We Shipped, and What We Held the Line On</SectionHeading>
            <p class="mb-4">We chose the smallest possible relaxation that actually solves the problem.</p>
            <p class="mb-4">The compressed result is held in memory in a pickup store keyed by an unguessable hash, with a five-minute TTL. After five minutes the bytes are evicted whether or not the URL was ever fetched, and the URL stops resolving at the same moment. The tool response itself explicitly states "expires in ~5 minutes" alongside the URL, so downstream tools and saved scripts have no excuse to drift past the expiry.</p>
            <p class="mb-4">What we deliberately kept:</p>

            <ul class="space-y-3 mb-6 marker:text-[#F06292] list-disc pl-6">
                <li>Your original image is still streamed into the encoder in RAM and discarded immediately. No disk writes of the source, no logs containing image data, no change from the web app or any other surface.</li>
                <li>No per-account history of compressed images. No analytics on what was processed beyond the usage counter exposed by the <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">check_usage</code> tool.</li>
                <li>The two local install paths - the <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify</code> CLI and <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify serve</code> as a local MCP server - don't touch the pickup store at all. The compressed bytes come back from <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">api.mochify.app</code> to your local binary and are written straight to your disk. End-to-end zero retention is intact for any workflow where you've installed the binary.</li>
            </ul>

            <InfoBox type="note" title="The relaxation is narrow on purpose">
                It applies to the compressed output, on the hosted MCP path, for the five minutes between encoding and pickup. Everything else is unchanged.
            </InfoBox>
        </section>

        <section id="your-workflow" class="scroll-mt-24">
            <SectionHeading>What This Means for Your Workflow</SectionHeading>
            <p class="mb-4">Use the hosted MCP server if drag-and-drop chat is the experience you want, and the compressed image transiting <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">files.mochify.app</code> for up to five minutes is a trade-off you're comfortable with. For most users, most of the time, that's a fine line to draw.</p>
            <p class="mb-4">If you need a stronger end-to-end privacy posture, install the local binary with <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">brew install mochify</code> and use either <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify serve</code> (chat-driven) or the CLI direct (build pipelines, batch jobs, anything scripted). Compressed bytes never sit on Mochify infrastructure beyond the encoding step itself. If you need to take Mochify off the path entirely, self-host the engine via the <a href="/guides/self-hosting-image-optimization-docker">Docker self-hosting guide</a>.</p>
            <p>A softer retention claim is a less catchy marketing line than "wiped immediately." We'd rather match the words to what the server actually does.</p>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqItems} />

        <!-- CTA -->
        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">Free Tool</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3">
                Try Mochify - privacy-first image compression
            </h3>
            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                Tell Mochify what you need in plain language and Magic Flow handles the rest, whether you're on the hosted MCP or running the local binary.
            </p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Start Optimizing Free</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

        <!-- Related -->
        <section id="related" class="scroll-mt-24">
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each [
                    { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples', desc: 'The architectural detail behind URL passback, token costs, and four worked examples.' },
                    { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide', desc: 'The broader zero-retention story and what it means across every Mochify surface.' },
                    { href: '/guides/self-hosting-image-optimization-docker', title: 'Self-Hosting Image Optimization with Docker', desc: 'For users who need the engine itself never to touch Mochify infrastructure.' },
                ] as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
