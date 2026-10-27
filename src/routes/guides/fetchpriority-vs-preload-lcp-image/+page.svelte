<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Should I Use fetchpriority or rel=\"preload\" for My LCP Image?",
        seoTitle: "Should I Use fetchpriority or preload for My LCP Image?",
        description: "Use fetchpriority=\"high\" on an <img> tag found in HTML. Use rel=\"preload\" when the browser discovers the image late, via CSS or JavaScript.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "June 20, 2026"
    };

    const related = [
        {
            title: "Optimizing Hero Images for Web Performance: A 2026 Guide",
            href: "/guides/optimizing-hero-images",
            desc: "Format choice, compression settings, and responsive techniques for the image that matters most to your LCP score."
        },
        {
            title: "How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?",
            href: "/guides/preload-avif-hero-images-wordpress-lcp",
            desc: "Step-by-step instructions for adding a preload hint to a WordPress theme without a plugin."
        },
        {
            title: "What Should I Use in 2026: WebP, AVIF, or JPEG XL?",
            href: "/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl",
            desc: "Browser support and compression trade-offs to help you pick the right format for the LCP slot."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/fetchpriority-vs-preload-lcp-image" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Should I Use fetchpriority=\"high\" or rel=\"preload\" for My LCP Image?",
        "description": "Use fetchpriority=\"high\" on an img tag found in HTML. Use rel=\"preload\" when the browser discovers the image late, via CSS or JavaScript.",
        "url": "https://mochify.app/guides/fetchpriority-vs-preload-lcp-image",
        "inLanguage": "en",
        "image": "https://mochify.app/og/guides-fetchpriority-vs-preload-lcp-image.png",
        "datePublished": "2026-06-20T12:00:00+00:00",
        "dateModified": "2026-06-20T12:00:00+00:00",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": ["Largest Contentful Paint", "Core Web Vitals", "fetchpriority", "rel preload", "Web Performance"]
    }
    </script>
    <GuideSchema
        name='Should I Use fetchpriority="high" or rel="preload" for My LCP Image?'
        url="https://mochify.app/guides/fetchpriority-vs-preload-lcp-image"
        description='Use fetchpriority="high" on an <img> tag found in HTML. Use rel="preload" when the browser discovers the image late, via CSS or JavaScript.'
        datePublished="2026-06-20"
        dateModified="2026-06-20"
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
			Should I Use <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-2xl md:text-4xl font-bold border border-pink-100">fetchpriority="high"</code> or <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-2xl md:text-4xl font-bold border border-pink-100">rel="preload"</code> for My LCP Image?
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Use <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">fetchpriority="high"</code> on the <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;img&gt;</code> element when your LCP image is already in the HTML. Use <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">rel="preload"</code> when the browser discovers the image late - because it lives behind a CSS file, a JavaScript file, or a request chain. In most cases, the right answer is one or the other, not both.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-lg leading-relaxed text-[#6C3F31]">
                <strong>Quick answer:</strong> If your LCP image is an <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;img&gt;</code> tag in the HTML, add <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">fetchpriority="high"</code> to it. If it is discovered late via CSS or JavaScript, add <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;link rel="preload" as="image"&gt;</code> in the <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;head&gt;</code>. Don't use both on the same plain <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;img&gt;</code> - you will download it twice.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="the-key-difference-discovery-vs-priority" class="scroll-mt-24">
            <SectionHeading>The key difference: discovery vs. priority</SectionHeading>
            <p class="mb-4">Both hints push your LCP image up the queue, but they fix different problems.</p>
            <p class="mb-4"><code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">fetchpriority="high"</code> tells the browser to download this image before other same-priority resources. It does not change <em>when</em> the browser discovers the image - only how urgently it fetches it once it does.</p>

            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3 flex items-center justify-between">
                    <span class="text-pink-200 text-xs font-black uppercase tracking-widest">Image in HTML</span>
                    <span class="text-pink-300 text-xs font-mono opacity-60">HTML</span>
                </div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed"><code>&lt;img src="hero.avif" alt="..." fetchpriority="high" width="1200" height="675" /&gt;</code></pre>
            </div>

            <p class="mb-4"><code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">rel="preload"</code> moves discovery to the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;head&gt;</code>, so the browser sees the image request before it has even parsed the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;body&gt;</code>. It is the right tool when an image would otherwise sit behind a request chain - for example, a CSS <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">background-image</code> that the browser cannot discover until the stylesheet has downloaded and been parsed.</p>

            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3 flex items-center justify-between">
                    <span class="text-pink-200 text-xs font-black uppercase tracking-widest">Late-discovered image</span>
                    <span class="text-pink-300 text-xs font-mono opacity-60">HTML</span>
                </div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed"><code>&lt;link rel="preload" as="image" href="hero.avif" /&gt;</code></pre>
            </div>
        </section>

        <section id="which-one-to-use" class="scroll-mt-24">
            <SectionHeading>Which one to use</SectionHeading>
            <p class="mb-4"><strong>Your LCP is an <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> tag directly in the HTML.</strong> The browser finds it during HTML parsing. Add <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">fetchpriority="high"</code> to the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> element. You do not need a preload hint - the browser has already discovered the image.</p>
            <p class="mb-4"><strong>Your LCP is a CSS <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">background-image</code> or injected by JavaScript.</strong> The browser cannot see it until the CSS or JavaScript has loaded. Use <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;link rel="preload" as="image"&gt;</code> in the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;head&gt;</code> to pull the fetch forward, and add <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">fetchpriority="high"</code> to that preload link to give it maximum priority.</p>

            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3 flex items-center justify-between">
                    <span class="text-pink-200 text-xs font-black uppercase tracking-widest">Preload + priority</span>
                    <span class="text-pink-300 text-xs font-mono opacity-60">HTML</span>
                </div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed"><code>&lt;link
  rel="preload"
  as="image"
  href="/hero.avif"
  fetchpriority="high"
/&gt;</code></pre>
            </div>

            <p class="mb-4">Google's LCP guidance targets a 2.5-second threshold for a "good" score at the 75th percentile. For a hero image, a late-discovered fetch can add a second or more of resource load delay - often the single biggest gain available once you have already compressed the file.</p>
        </section>

        <section id="the-one-mistake-to-avoid" class="scroll-mt-24">
            <SectionHeading>The one mistake to avoid</SectionHeading>
            <p class="mb-4">Do not add both a preload link <em>and</em> <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">fetchpriority="high"</code> on a plain <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> tag for the same image. You will request the image twice and waste bandwidth - one of the most common self-inflicted LCP regressions.</p>

            <GlassInfoBox type="tip" title="Rule of thumb">
                If you use a <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;link rel="preload"&gt;</code>, that is the fetch. The <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> tag reuses the preloaded response from the browser cache - no <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">fetchpriority</code> needed on the element itself.
            </GlassInfoBox>
        </section>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <h3 class="text-lg font-bold text-[#4A2C2C] mb-3">Make either hint count</h3>
            <p class="text-[#6C3F31] leading-relaxed mb-4">
                Get the image small enough that the priority hint actually moves your LCP. Use <a href="https://mochify.app">mochify.app</a> to compress and convert your hero image to AVIF or WebP before wiring up the hints - try prompting <em>"convert to AVIF and optimize for a 1200px hero slot"</em> to get a web-ready file in seconds.
            </p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Try it free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
