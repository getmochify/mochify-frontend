<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Should My Product Images Be AVIF or WebP in 2026?",
        description: "Neither, manually, on Shopify: the CDN already negotiates AVIF, WebP, or JPEG per browser. Manual conversion matters once you step outside that pipeline.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "August 14, 2026"
    };

    const related = [
        { href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl', title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?', desc: 'The broader format comparison beyond Shopify.' },
        { href: '/guides/is-jpeg-xl-ready-for-shopify-product-images', title: 'Is JPEG XL Ready for Shopify Product Images in 2026?', desc: 'The third format in the conversation.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL', desc: 'Full breakdown of all three formats.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Should My Product Images Be AVIF or WebP in 2026? | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/should-my-product-images-be-avif-or-webp-in-2026" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Should My Product Images Be AVIF or WebP in 2026?",
        "description": "Neither, manually, on Shopify: the CDN already negotiates AVIF, WebP, or JPEG per browser. Manual conversion matters once you step outside that pipeline.",
        "url": "https://mochify.app/guides/should-my-product-images-be-avif-or-webp-in-2026",
        "image": "https://mochify.app/og/guides-should-my-product-images-be-avif-or-webp-in-2026.png",
        "datePublished": "2026-08-14",
        "dateModified": "2026-08-14",
        "inLanguage": "en",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "about": [
            { "@type": "Thing", "name": "AVIF image format" },
            { "@type": "Thing", "name": "WebP image format" },
            { "@type": "Thing", "name": "Shopify image CDN" },
            { "@type": "Thing", "name": "Image compression" }
        ],
        "keywords": "AVIF vs WebP, product images 2026, Shopify image CDN, next-gen image formats"
        }
    </script>

    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/should-my-product-images-be-avif-or-webp-in-2026"
        description={metadata.description}
        datePublished="2026-08-14"
        dateModified="2026-08-14"
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
			<AccentTitle title={metadata.title} accent="AVIF or WebP" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            If you're running a standard Shopify storefront, the answer is neither, manually. Shopify's CDN has negotiated image format automatically since 2022, detecting what each visitor's browser supports and serving AVIF, WebP, or JPEG per request. Upload the best master image you have and let Shopify handle delivery. Manual AVIF/WebP conversion earns its keep once you step outside Shopify's native delivery path.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published August 14, 2026 by the Mochify Engineering Team.</strong>
                A quick answer for sellers deciding whether to pre-convert product photos, or simply upload a good master and let the platform handle format delivery.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="why-shopify-already-picks-the-format-for-you" class="scroll-mt-24">
            <SectionHeading>Why Shopify already picks the format for you</SectionHeading>
            <p>Shopify's changelog confirms the CDN "detect[s] which image formats are supported by the client browser and automatically optimize[s] for quality and file size," choosing between AVIF, WebP, and JPEG on a per-request basis. The <code>image_url</code> Liquid filter just returns a CDN URL for the size you ask for, capped at 5760px, and won't upscale beyond the original. Pre-converting a product photo to AVIF or WebP before upload is usually wasted effort on the primary storefront path, since the CDN re-negotiates format on every request anyway.</p>
        </section>

        <section id="avif-vs-webp-when-you-do-control-delivery" class="scroll-mt-24">
            <SectionHeading>AVIF vs. WebP when you do control delivery</SectionHeading>
            <p>Outside Shopify's CDN, the tradeoff is real. AVIF typically compresses harder than WebP at equivalent visual quality, but it carries a longer tail of older Safari and iOS support gaps. WebP is the more conservative, broadly supported choice for older clients and edge environments. As of caniuse's March 2026 table, both formats are widely supported in current browsers, though AVIF's compatibility tail is longer. This matters because image bytes are still one of the largest weight categories on a page: the 2025 Web Almanac puts the median mobile home page at 911 KB of images and the median desktop home page at 1,059 KB, both directly correlated with slower LCP.</p>
        </section>

        <section id="when-to-convert-manually" class="scroll-mt-24">
            <SectionHeading>When to convert manually</SectionHeading>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Headless or custom storefronts</strong>, where Shopify's automatic CDN negotiation isn't the delivery mechanism.</li>
                <li><strong class="text-[#4A2C2C]">Off-Shopify channels</strong>: external CDNs, marketplaces, and marketing assets that never touch Shopify's image pipeline.</li>
                <li><strong class="text-[#4A2C2C]">Email and social exports</strong>, where the receiving client won't negotiate AVIF/WebP the way a browser does.</li>
            </ul>
            <p>For any of these, you don't need to pick settings by hand. In Mochify's Magic Flow, you'd type something like "convert these product photos to AVIF, with a WebP fallback for older browsers," and the two-step pipeline (a language model reads the prompt, the C++ engine executes it) handles the pairing.</p>

            <GlassInfoBox type="note" title="Where images are processed">
                Images are streamed into RAM at <code>api.mochify.app</code> for encoding and wiped immediately after, so nothing is retained server-side.
            </GlassInfoBox>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Need format conversion for images that live outside Shopify's CDN?"
            href="/"
            label="Try Mochify free →"
        >
            Compare visual quality side by side at <a href="/comparison">mochify.app/comparison</a>.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
