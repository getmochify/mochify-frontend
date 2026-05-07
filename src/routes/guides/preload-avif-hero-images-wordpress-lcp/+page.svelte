<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const metadata = {
        title: "How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?",
        description: "Serving AVIF isn't enough — browsers still discover it late. Add a preload hint to your WordPress theme so the hero image starts downloading before the render tree is built, and hit Google's 2.5s LCP target.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "April 9, 2026"
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
            desc: "A plugin-free workflow for pre-optimising images with Mochify before uploading to WordPress."
        },
        {
            title: "The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL",
            href: "/guides/2026-guide-next-gen-formats",
            desc: "Which next-gen format should you actually use? A practical comparison of WebP, AVIF, and JPEG XL for the web in 2026."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/preload-avif-hero-images-wordpress-lcp" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "HowTo"],
        "headline": "How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?",
        "description": "Serving AVIF isn't enough — browsers still discover it late. Add a preload hint to your WordPress theme so the hero image starts downloading before the render tree is built.",
        "url": "https://mochify.app/guides/preload-avif-hero-images-wordpress-lcp",
        "inLanguage": "en",
        "datePublished": "2026-04-09",
        "dateModified": "2026-04-09",
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
            How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Switching your hero image to AVIF cuts file size by up to 50% — but if the browser still discovers it late in the render pipeline, your LCP score won't budge. A single <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">&lt;link rel="preload"&gt;</code> hint injected into <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">wp_head</code> tells the browser to start the download before any CSS or JavaScript has been parsed.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong>Quick answer:</strong> Add a preload hint for your AVIF hero image in <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">functions.php</code> using <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">wp_head</code>. Set <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">fetchpriority="high"</code> so the browser treats it as the highest-priority network request on the page.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="why-avif-alone-isnt-enough" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Why AVIF alone isn't enough</h2>
            <p class="mb-4">AVIF gives you the smallest file at the highest quality of any widely-supported format in 2026. WordPress 6.5 added native AVIF upload support, so serving it is no longer a challenge. The problem is discovery timing.</p>
            <p class="mb-4">When a browser loads a WordPress page it parses the HTML, builds the DOM, then fetches stylesheets, then — only after the CSS is parsed and the render tree is constructed — does it find the hero image URL buried in a CSS <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">background-image</code> rule or an <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">&lt;img&gt;</code> tag deep in the template. By that point, you've burned 300–600 ms of latency before the image download even starts.</p>
            <p class="mb-4">Google's LCP threshold is 2.5 seconds. On a typical shared-hosting WordPress site with a theme that loads 6–12 stylesheets, discovering the hero image late is the single biggest contributor to a failing LCP score — even when the image itself is small.</p>

            <InfoBox type="tip" title="LCP measures the largest visible element">
                Your hero image is almost always the Largest Contentful Paint element. Reducing its file size matters, but reducing its discovery delay matters more. Preloading addresses the delay; AVIF addresses the size. You need both.
            </InfoBox>
        </section>

        <section id="preload-the-hero-image" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Preload the hero image</h2>
            <p class="mb-4">Open your theme's <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">functions.php</code> (or a site-specific plugin) and add the following. Replace the URL with the path to your AVIF file in the WordPress Media Library.</p>

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

            <InfoBox type="note" title="If your hero image is in the Media Library">
                Replace <code>get_template_directory_uri() . '/images/hero.avif'</code> with the direct URL from the Media Library — for example, <code>https://example.com/wp-content/uploads/2026/04/hero.avif</code>. You can hardcode it or use <code>wp_get_attachment_url( $attachment_id )</code> if you store the ID in a theme option.
            </InfoBox>

            <p class="mb-4">The priority of <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">1</code> passed to <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">add_action</code> ensures the hint is output at the very top of <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">&lt;head&gt;</code>, before any stylesheets or scripts. The browser's preload scanner picks it up immediately and begins the AVIF download in parallel with everything else.</p>

            <p class="mb-4">The <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">is_front_page()</code> guard limits the hint to the homepage. If your hero changes per template (category pages, landing pages), duplicate the action with the appropriate conditional and the correct URL for each context.</p>

            <InfoBox type="warning" title="Only preload the image that is actually the LCP element">
                Preloading an image that isn't visible above the fold wastes bandwidth and can hurt performance by competing with critical resources. Confirm which element PageSpeed Insights flags as the LCP candidate before adding the hint.
            </InfoBox>
        </section>

        <section id="check-the-result" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Check the result</h2>
            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li><strong>Run PageSpeed Insights</strong> on your homepage URL. The "Preload Largest Contentful Paint image" audit should no longer appear as an opportunity.</li>
                <li><strong>Check the waterfall</strong> in Chrome DevTools (Network tab). Your AVIF file should now start downloading near the top of the waterfall — alongside your HTML — rather than after stylesheets resolve.</li>
                <li><strong>Confirm LCP in the Core Web Vitals report.</strong> Field data takes 28 days to update in Search Console, but lab data (Lighthouse, PageSpeed) updates immediately.</li>
            </ol>

            <p class="mb-4">A preloaded AVIF hero typically moves LCP discovery 300–600 ms earlier. Combined with the 40–50% file-size reduction from AVIF over standard JPEG, most WordPress sites with a hero-image LCP element comfortably hit the 2.5s "Good" threshold after both changes.</p>

            <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
                <h3 class="text-lg font-black text-[#4A2C2C] mb-3">Try Mochify for AVIF conversion</h3>
                <p class="text-[#6C3F31] leading-relaxed mb-4">
                    Convert your hero image to AVIF at <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a> — no account required, processed in RAM, never stored. Download the <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">.avif</code> file and upload it directly to your WordPress Media Library.
                </p>
                <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                    Convert to AVIF
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
            </div>
        </section>

        <RelatedGuides guides={related} />

    </div>
</article>
