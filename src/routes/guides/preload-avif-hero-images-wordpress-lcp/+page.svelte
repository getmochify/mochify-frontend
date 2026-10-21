<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?",
        seoTitle: "How Do I Preload AVIF Hero Images in WordPress for LCP?",
        description: "Serving AVIF isn't enough: browsers discover it late. Add a preload hint to your WordPress theme so the hero image loads early and hits the 2.5s LCP goal.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "April 9, 2026",
        lastUpdated: "July 13, 2026"
    };

    const related = [
        {
            title: "Optimizing Hero Images for Web Performance: A 2026 Guide",
            href: "/guides/optimizing-hero-images",
            desc: "Format choice, compression settings, and responsive techniques for the image that matters most to your LCP score."
        },
        {
            title: "Fix \"Next-Gen Formats\" in WordPress (No Plugins) & Boost LCP",
            href: "/guides/next-gen-image-formats-wordpress",
            desc: "A plugin-free workflow for pre-optimizing images with Mochify before uploading to WordPress."
        },
        {
            title: "The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL",
            href: "/guides/2026-guide-next-gen-formats",
            desc: "Which next-gen format should you actually use? A practical comparison of WebP, AVIF, and JPEG XL for the web in 2026."
        },
        {
            title: "What to Do When Someone Needs the AVIF as a JPG",
            href: "/guides/avif-to-jpg",
            desc: "Serving AVIF is right for your site - here's the fastest way to hand someone a JPG when they need one."
        },
        {
            title: "Should I Use fetchpriority or rel=\"preload\" for My LCP Image?",
            href: "/guides/fetchpriority-vs-preload-lcp-image",
            desc: "When a fetchpriority attribute beats a preload hint for your hero image, and when you need both."
        },
        {
            title: "Should I convert HEIC to JPEG or WebP for WordPress uploads?",
            href: "/guides/heic-to-jpeg-or-webp-wordpress",
            desc: "HEIC to JPEG or WebP for WordPress uploads: which target format to pick before the media library."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/preload-avif-hero-images-wordpress-lcp" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "HowTo"],
        "headline": "How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?",
        "description": "Serving AVIF isn't enough - browsers still discover it late. Add a preload hint to your WordPress theme so the hero image starts downloading before the render tree is built.",
        "url": "https://mochify.app/guides/preload-avif-hero-images-wordpress-lcp",
        "inLanguage": "en",
        "image": "https://mochify.app/og/guides-preload-avif-hero-images-wordpress-lcp.png",
        "datePublished": "2026-04-09",
        "dateModified": "2026-07-13",
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
        "about": ["AVIF", "LCP", "WordPress", "Core Web Vitals", "image preload"],
        "step": [
            { "@type": "HowToStep", "name": "Convert hero image to AVIF", "text": "Use Mochify to convert your hero image to AVIF. Download the .avif file." },
            { "@type": "HowToStep", "name": "Upload to WordPress", "text": "Upload the .avif file via the Media Library and note its URL." },
            { "@type": "HowToStep", "name": "Add preload hint to functions.php", "text": "Use wp_head to inject a <link rel='preload'> tag with type='image/avif' and fetchpriority='high'." },
            { "@type": "HowToStep", "name": "Verify with PageSpeed Insights", "text": "Run your URL through PageSpeed Insights and confirm LCP is below 2.5s." }
        ]
    }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/preload-avif-hero-images-wordpress-lcp"
        description={metadata.description}
        datePublished="2026-04-09"
        dateModified="2026-07-13"
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
			<AccentTitle title={metadata.title} accent="Preload AVIF Hero Images" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Switching your hero image to AVIF cuts file size by up to 50% - but if the browser still discovers it late in the render pipeline, your LCP score won't budge. A single <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;link rel="preload"&gt;</code> hint injected into <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">wp_head</code> tells the browser to start the download before any CSS or JavaScript has been parsed.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-lg leading-relaxed text-[#6C3F31]">
                <strong>Quick answer:</strong> Add a preload hint for your AVIF hero image in <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">functions.php</code> using <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">wp_head</code>. Set <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">fetchpriority="high"</code> so the browser treats it as the highest-priority network request on the page.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="why-avif-alone-isnt-enough" class="scroll-mt-24">
            <SectionHeading>Why AVIF alone isn't enough</SectionHeading>
            <p class="mb-4">AVIF gives you the smallest file at the highest quality of any widely-supported format in 2026. WordPress 6.5 added native AVIF upload support, so serving it is no longer a challenge. The problem is discovery timing.</p>
            <p class="mb-4">When a browser loads a WordPress page it parses the HTML, builds the DOM, then fetches stylesheets, then - only after the CSS is parsed and the render tree is constructed - does it find the hero image URL buried in a CSS <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">background-image</code> rule or an <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> tag deep in the template. By that point, you've burned 300–600 ms of latency before the image download even starts.</p>
            <p class="mb-4">Google's LCP threshold is 2.5 seconds. On a typical shared-hosting WordPress site with a theme that loads 6–12 stylesheets, discovering the hero image late is the single biggest contributor to a failing LCP score - even when the image itself is small.</p>

            <GlassInfoBox type="tip" title="LCP measures the largest visible element">
                Your hero image is almost always the Largest Contentful Paint element. Reducing its file size matters, but reducing its discovery delay matters more. Preloading addresses the delay; AVIF addresses the size. You need both.
            </GlassInfoBox>
        </section>

        <section id="preload-the-hero-image" class="scroll-mt-24">
            <SectionHeading>Preload the hero image</SectionHeading>
            <p class="mb-4">Open your theme's <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">functions.php</code> (or a site-specific plugin) and add the following. Replace the URL with the path to your AVIF file in the WordPress Media Library.</p>

            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3 flex items-center justify-between">
                    <span class="text-pink-200 text-xs font-black uppercase tracking-widest">functions.php</span>
                    <span class="text-pink-300 text-xs font-mono opacity-60">PHP</span>
                </div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed"><code>add_action( 'wp_head', function () &#123;
    if ( ! is_front_page() ) &#123;
        return;
    &#125;
    echo '&lt;link
        rel="preload"
        as="image"
        href="' . esc_url( get_template_directory_uri() . '/images/hero.avif' ) . '"
        type="image/avif"
        fetchpriority="high"
    &gt;';
&#125;, 1 );</code></pre>
            </div>

            <GlassInfoBox type="note" title="If your hero image is in the Media Library">
                Replace <code>get_template_directory_uri() . '/images/hero.avif'</code> with the direct URL from the Media Library - for example, <code>https://example.com/wp-content/uploads/2026/04/hero.avif</code>. You can hardcode it or use <code>wp_get_attachment_url( $attachment_id )</code> if you store the ID in a theme option.
            </GlassInfoBox>

            <p class="mb-4">The priority of <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">1</code> passed to <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">add_action</code> ensures the hint is output at the very top of <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;head&gt;</code>, before any stylesheets or scripts. The browser's preload scanner picks it up immediately and begins the AVIF download in parallel with everything else.</p>

            <p class="mb-4">The <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">is_front_page()</code> guard limits the hint to the homepage. If your hero changes per template (category pages, landing pages), duplicate the action with the appropriate conditional and the correct URL for each context.</p>

            <p class="mb-4">If your hero is a plain <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">&lt;img&gt;</code> already in the HTML rather than one discovered late via CSS, you may not need the preload tag at all: <a href="https://mochify.app/guides/fetchpriority-vs-preload-lcp-image">should you use fetchpriority instead of preload?</a></p>

            <GlassInfoBox type="warning" title="Only preload the image that is actually the LCP element">
                Preloading an image that isn't visible above the fold wastes bandwidth and can hurt performance by competing with critical resources. Confirm which element PageSpeed Insights flags as the LCP candidate before adding the hint.
            </GlassInfoBox>
        </section>

        <section id="check-the-result" class="scroll-mt-24">
            <SectionHeading>Check the result</SectionHeading>
            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li><strong>Run PageSpeed Insights</strong> on your homepage URL. The "Preload Largest Contentful Paint image" audit should no longer appear as an opportunity.</li>
                <li><strong>Check the waterfall</strong> in Chrome DevTools (Network tab). Your AVIF file should now start downloading near the top of the waterfall - alongside your HTML - rather than after stylesheets resolve.</li>
                <li><strong>Confirm LCP in the Core Web Vitals report.</strong> Field data takes 28 days to update in Search Console, but lab data (Lighthouse, PageSpeed) updates immediately.</li>
            </ol>

            <p class="mb-4">A preloaded AVIF hero typically moves LCP discovery 300–600 ms earlier. Combined with the 40–50% file-size reduction from AVIF over standard JPEG, most WordPress sites with a hero-image LCP element comfortably hit the 2.5s "Good" threshold after both changes.</p>

            <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
                <h3 class="text-lg font-bold text-[#4A2C2C] mb-3">Try Mochify for AVIF conversion</h3>
                <p class="text-[#6C3F31] leading-relaxed mb-4">
                    Convert your hero image to AVIF at <a href="https://mochify.app">mochify.app</a> - no account required, processed in RAM, never stored. Download the <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">.avif</code> file and upload it directly to your WordPress Media Library.
                </p>
                <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                    Convert to AVIF
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
            </div>
        </section>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
