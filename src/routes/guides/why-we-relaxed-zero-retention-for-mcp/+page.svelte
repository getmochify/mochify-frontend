<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions",
        seoTitle: "Why We Relaxed Zero Retention for MCP Server Compressions",
        description: "Why we softened Mochify's 'wiped immediately' claim on hosted MCP compressions to a five-minute pickup window, what we kept, and what it means for you.",
        category: "Privacy & Engineering",
        readTime: "5 min read",
        date: "May 29, 2026",
        lastUpdated: "October 15, 2026",
    };

    const faqItems = [
        {
            q: "Does my original image still get wiped immediately?",
            a: "Yes, for every image sent by URL or inline: it is processed in RAM, encoded, and discarded the moment the response goes out, with no disk writes of the source and no logs containing image data. The one exception is an image you choose to drop on a one-time upload link: that original is kept in private storage until processing starts, deleted at that moment, and never kept longer than 15 minutes."
        },
        {
            q: "What exactly is held for five minutes?",
            a: "Only the compressed output, on the hosted MCP path. We hold it in short-lived storage so we can serve it via a short-lived download URL instead of trying to return the bytes inline (which was unreliable across chat clients). It is evicted after five minutes regardless of pickup."
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

    const related = [
                    { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples', desc: 'The architectural detail behind URL passback, token costs, and four worked examples.' },
                    { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide', desc: 'The broader zero-retention story and what it means across every Mochify surface.' },
                    { href: '/guides/self-hosting-image-optimization-docker', title: 'Self-Hosting Image Optimization with Docker', desc: 'For users who need the engine itself never to touch Mochify infrastructure.' },
                ];

    const toc = [
                        { n: '01', href: '#the-problem',   label: 'The problem we hit' },
                        { n: '02', href: '#the-fix',       label: 'The fix we wanted to build' },
                        { n: '03', href: '#what-we-shipped', label: 'What we shipped, and what we held the line on' },
                        { n: '04', href: '#upload-links',  label: 'Update, October 2026: one-time upload links' },
                        { n: '05', href: '#your-workflow', label: 'What this means for your workflow' },
                        { n: '06', href: '#faq',           label: 'FAQ' },
                    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle}</title>
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
      "description": "Why we softened Mochify's 'wiped immediately' claim on hosted MCP compressions to a five-minute pickup window, what we kept, and what it means for you.",
      "url": "https://mochify.app/guides/why-we-relaxed-zero-retention-for-mcp",
      "datePublished": "2026-05-29",
      "dateModified": "2026-10-15",
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
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, for every image sent by URL or inline: it is processed in RAM, encoded, and discarded the moment the response goes out, with no disk writes of the source and no logs containing image data. The one exception is an image you choose to drop on a one-time upload link: that original is kept in private storage until processing starts, deleted at that moment, and never kept longer than 15 minutes." }
        },
        {
          "@type": "Question",
          "name": "What exactly is held for five minutes?",
          "acceptedAnswer": { "@type": "Answer", "text": "Only the compressed output, on the hosted MCP path. We hold it in short-lived storage so we can serve it via a short-lived download URL instead of trying to return the bytes inline (which was unreliable across chat clients). It is evicted after five minutes regardless of pickup." }
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
			<AccentTitle title={metadata.title} accent="Zero-Retention Policy" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            We added a five-minute hold on compressed outputs from the hosted MCP server so we can return a short-lived download URL instead of inline binary content. An original you send by URL or inline is still discarded immediately after encoding. Since October 2026 there is one narrower exception, which you opt into: a one-time upload link (see the update below). The local <code class="bg-pink-100 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify</code> binary - CLI and <code class="bg-pink-100 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify serve</code> - still has nothing held server-side at all.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-lg leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published 29 May 2026 by the Mochify Engineering Team.</strong> The softening is narrow on purpose, and we'd rather describe the server accurately than carry a phrase that no longer matches what it does.
            </p>
            <p class="text-lg text-[#6C3F31] leading-relaxed mt-4 mb-0">
                <strong class="text-[#4A2C2C]">Updated 15 October 2026.</strong> We added one-time upload links, the first case where the hosted MCP stores an <em>original</em>. What they hold and for how long is in <a href="#upload-links">the update section</a>.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc.map((t) => ({ id: t.href.replace('#', ''), label: t.label }))} heading="What's in This Guide" />
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
            <p class="mb-4">The compressed result is held in a pickup store keyed by an unguessable hash, with a five-minute TTL. After five minutes the bytes are evicted whether or not the URL was ever fetched, and the URL stops resolving at the same moment. The tool response itself explicitly states "expires in ~5 minutes" alongside the URL, so downstream tools and saved scripts have no excuse to drift past the expiry.</p>
            <p class="mb-4">What we deliberately kept:</p>

            <ul class="space-y-3 mb-6 marker:text-[#F06292] list-disc pl-6">
                <li>Your original image is still streamed into the encoder in RAM and discarded immediately. No disk writes of the source, no logs containing image data, no change from the web app or any other surface.</li>
                <li>No per-account history of compressed images. No analytics on what was processed beyond the usage counter exposed by the <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">check_usage</code> tool.</li>
                <li>The two local install paths - the <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify</code> CLI and <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify serve</code> as a local MCP server - don't touch the pickup store at all. The compressed bytes come back from <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">api.mochify.app</code> to your local binary and are written straight to your disk. End-to-end zero retention is intact for any workflow where you've installed the binary.</li>
            </ul>

            <GlassInfoBox type="note" title="The relaxation is narrow on purpose">
                It applies to the compressed output, on the hosted MCP path, for the five minutes between encoding and pickup. Everything else is unchanged.
            </GlassInfoBox>
        </section>

        <section id="upload-links" class="scroll-mt-24">
            <SectionHeading>Update, October 2026: One-Time Upload Links</SectionHeading>
            <p class="mb-4">The hosted MCP took an image two ways: a public URL, or base64 bytes inside the tool call. Neither works for the most common case, a photo you attach to a chat. An assistant sees an attachment as pixels, not as a file, so in a plain chat it has no bytes to send at all - and even where it can read the file, typing a full-size photo out as base64 is impractical.</p>
            <p class="mb-4">So the hosted server now has a <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">create_upload</code> tool. It returns a one-time link: you open it and drop the original (or an assistant with file access uploads it directly), and <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">squish</code> then reads it by ID. That means the hosted MCP now stores an <strong class="text-[#4A2C2C]">original</strong> in one case, and we would rather say so plainly than leave the sentence above quietly out of date. The limits:</p>
            <ul class="space-y-3 mb-6 marker:text-[#F06292] list-disc pl-6">
                <li>It only happens when you choose to use a link. Images sent by URL or inline are still never stored.</li>
                <li>The original sits in a private bucket that is never publicly served - separate from the pickup store for results.</li>
                <li>It is deleted the moment it is read, before processing even starts, so a failed request leaves no copy behind.</li>
                <li>A link that is never used expires after 15 minutes, and its upload goes with it.</li>
                <li>A link works once, and only the account that created it can process what was uploaded.</li>
            </ul>
            <p>The same feature is what lets an assistant crop or redact a photo by looking at it - "hide the number plate", "blur the faces" - while the looking stays with the model you already use. Mochify receives the box coordinates, not a description of the image, and no Mochify model sees it.</p>
        </section>

        <section id="your-workflow" class="scroll-mt-24">
            <SectionHeading>What This Means for Your Workflow</SectionHeading>
            <p class="mb-4">Use the hosted MCP server if drag-and-drop chat is the experience you want, and the compressed image transiting <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">files.mochify.app</code> for up to five minutes is a trade-off you're comfortable with. For most users, most of the time, that's a fine line to draw.</p>
            <p class="mb-4">If you need a stronger end-to-end privacy posture, install the local binary with <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">brew install getmochify/mochify/mochify</code> and use either <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify serve</code> (chat-driven) or the CLI direct (build pipelines, batch jobs, anything scripted). Compressed bytes never sit on Mochify infrastructure beyond the encoding step itself. If you need to take Mochify off the path entirely, self-host the engine via the <a href="/guides/self-hosting-image-optimization-docker">Docker self-hosting guide</a>.</p>
            <p>A softer retention claim is a less catchy marketing line than "wiped immediately." We'd rather match the words to what the server actually does.</p>
        </section>

        <!-- FAQ -->
        <GlassFAQs items={faqItems} jsonLd={false} />

        <!-- CTA -->
        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">Free Tool</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-extrabold text-[#4A2C2C] relative z-10 mb-3">
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
        <RelatedGuidesGrid guides={related} />

    </div>
</article>

<style>
	/* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. */
	:global(nav[aria-label='Breadcrumb']) {
		max-width: 48rem;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1.25rem;
	}

	/* Match the article's mobile gutter (px-5 vs the breadcrumb's px-4). */
	@media (max-width: 767px) {
		:global(nav[aria-label='Breadcrumb']) {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}
</style>
