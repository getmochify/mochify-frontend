<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

    // Quick-answer profile: three short sections, so no TOC card. Same
    // guide-demo component set (open reading column, mochi glass surfaces)
    // as the long-form guides, minus the blocks a 3-minute piece has no use
    // for. /guides/style-demo stays as the noindex reference copy.

    const metadata = {
        title: "Does JPEG Support HDR?",
        description: "Yes: a JPEG can carry HDR as a gain map (Ultra HDR, Adaptive HDR, ISO 21496-1) and opens everywhere. Why most \"JPG to HDR\" converters give you the wrong file.",
        category: "Quick Guides",
        readTime: "3 min read",
        date: "September 20, 2026"
    };

    const related = [
        { title: "How to Make Any Photo Ultra HDR (Google Photos, Samsung, iPhone, Lightroom, or Online)", href: "/guides/how-to-make-any-photo-ultra-hdr", desc: "the step-by-step on every platform, and what conversion can and cannot do." },
        { title: "Why HDR Photos Look Flat When You Share Them (and How Gain Maps Fix It)", href: "/guides/why-hdr-photos-look-flat-when-shared", desc: "where the map gets lost and how to keep it." },
        { title: "Jpegli Guide 2026: Quality-Per-Byte", href: "/guides/jpeg-in-2026-jpegli", desc: "the encoder that keeps the second layer close to free." }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Does JPEG Support HDR? | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/does-jpeg-support-hdr" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Does JPEG Support HDR?",
        "description": "Yes: a JPEG can carry HDR as a gain map (Ultra HDR, Adaptive HDR, ISO 21496-1) and opens everywhere. Why most \"JPG to HDR\" converters give you the wrong file.",
        "url": "https://mochify.app/guides/does-jpeg-support-hdr",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/does-jpeg-support-hdr"
        },
        "datePublished": "2026-09-20",
        "dateModified": "2026-09-20",
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
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "about": [
            { "@type": "Thing", "name": "JPEG" },
            { "@type": "Thing", "name": "Ultra HDR" },
            { "@type": "Thing", "name": "Adaptive HDR" },
            { "@type": "Thing", "name": "HDR gain maps" },
            { "@type": "Thing", "name": "ISO 21496-1" },
            { "@type": "Thing", "name": "AVIF" }
        ],
        "keywords": "does jpeg support hdr, hdr jpeg, jpg to hdr, ultra hdr jpeg, gain map, convert jpeg to hdr",
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
            { "@type": "ListItem", "position": 3, "name": "Does JPEG Support HDR?", "item": "https://mochify.app/guides/does-jpeg-support-hdr" }
        ]
        }
    </script>
</svelte:head>

<!-- Single max-w-3xl reading column: header, prose, and every card share the
     same container edges. -->
<article class="relative mx-auto w-full max-w-3xl px-5 sm:px-6 md:px-0 pt-6 md:pt-0 text-lg text-[#6C3F31] leading-relaxed">

    <!-- Top-only mochi wash, faded out by a mask before the body text starts. -->
    <div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F06292] mb-3 mt-0">
            {metadata.category} · Guide
        </p>
        <h1 class="text-3xl md:text-[2.75rem] font-black text-[#4A2C2C] tracking-tight leading-[1.1] mb-0">
            Does JPEG Support HDR?
        </h1>
        <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
        <p class="mt-5 text-sm font-bold text-[#875F42] mb-0">
            {metadata.readTime} · {metadata.date} · Mochify Engineering Team
        </p>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed mt-8 mb-0">
            Yes. A JPEG can carry HDR through a gain map: a small second image stored inside the same file that tells an HDR display how much brighter each region may go than the normal picture. Google calls the result Ultra HDR, Apple calls it Adaptive HDR, and since July 2025 the mechanism is an international standard, ISO 21496-1. The file is still an ordinary JPEG, so it opens in every app and browser; only screens and software that understand the map show the extra brightness, and everything else shows the standard photo underneath.
        </p>
    </header>

    <div class="space-y-12">

        <section>
            <GlassPanel label="Quick answer">
                <p>
                    Yes. A JPEG can carry HDR as a gain map (Ultra HDR / Adaptive HDR, ISO 21496-1): it opens everywhere as a normal photo and shows extra brightness on HDR screens.
                </p>
            </GlassPanel>
        </section>

        <!-- 01 -->
        <section id="how-a-jpeg-carries-hdr" class="scroll-mt-24">
            <SectionHeading>How a JPEG carries HDR</SectionHeading>
            <p class="mb-4">An Ultra HDR JPEG is two pictures in one container. The base image is a normal 8-bit JPEG. Appended to it is the gain map, a grayscale ratio image that Android's specification recommends storing at a quarter of the width and height, so one sixteenth of the pixels, compressed like any other JPEG (<a href="https://developer.android.com/media/platform/hdr-image-format" target="_blank" rel="noopener noreferrer">Android Ultra HDR image format</a>). On Mochify's pipeline the map typically adds a low single-digit percentage to the file size. A viewer that reads the map multiplies the base image by it and pushes highlights past white; a viewer that does not simply ignores the extra data. Recent Pixels capture Ultra HDR by default, and Apple's engineers confirmed at WWDC 2024 that JPEG "fully supports" its Adaptive HDR gain maps alongside HEIF.</p>
        </section>

        <!-- 02 -->
        <section id="jpg-to-hdr-converter-trap" class="scroll-mt-24">
            <SectionHeading>The trap: "JPG to HDR converter" usually means a different HDR</SectionHeading>
            <p class="mb-4">Search "convert JPG to HDR" and most of the tools that rank will give you an <code>.hdr</code> file, not an HDR JPEG. That extension belongs to Radiance RGBE, a 1980s format used for lighting 3D scenes in Blender and Maya, and the converter sites say so in their own copy (ChangeMyFile's page describes its output as "environment maps for 3D lighting"). Your phone cannot open it, Instagram will not accept it, and it adds no brightness to anything. The tell is the output: if the result is <code>.hdr</code>, <code>.pic</code> or <code>.exr</code>, you have the wrong HDR. If it is a <code>.jpg</code> that mentions a gain map or Ultra HDR, you have the right one; our guide to <a href="/guides/how-to-make-any-photo-ultra-hdr">making any photo Ultra HDR</a> lists the tools that produce one on each platform. A third thing sold as HDR, the "HDR filter" in photo apps, is a look applied to an ordinary image and displays identically on every screen.</p>
        </section>

        <!-- 03 -->
        <section id="jpeg-xl-avif-webp-and-png" class="scroll-mt-24">
            <SectionHeading>What about JPEG XL, AVIF, WebP and PNG?</SectionHeading>
            <p class="mb-4">They handle HDR differently or not at all. AVIF and JPEG XL can store HDR in the pixels themselves, with no standard-range fallback image, so they look right only where the viewer decodes HDR. WebP and PNG cannot carry HDR in common use. That is why Mochify's converter returns a gain map only on JPG output: ask for AVIF, JXL, WebP or PNG and you get a standard-range file, because none of those can carry an Ultra HDR map on this path.</p>
        </section>

        <!-- Final CTA -->
        <GlassCTA
            heading="Want to make one?"
            href="/solutions/sdr-to-hdr"
            label="Convert SDR to HDR →"
        >
            Mochify's SDR to HDR converter turns any photo into an Ultra HDR JPEG, keeping a gain map that is already there and generating a modest one, about 1.5 stops, when there is none. It also shows the same photo as SDR and Ultra HDR side by side, which tells you in one glance whether your screen displays HDR at all. It works the other way too: run an Ultra HDR file through as JPG without asking for HDR and the map is dropped, so you get a plain standard-range JPEG back.
        </GlassCTA>

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

    .hero-wash {
        position: absolute;
        top: -20rem; /* start well above the viewport so no seam shows behind the nav */
        left: 50%;
        transform: translateX(-50%);
        width: 100vw;
        height: 1450px;
        z-index: -1;
        pointer-events: none;
        background:
            radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.4) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.32) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.25) 0%, transparent 70%);
        mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
    }

    @media (max-width: 768px) {
        .hero-wash {
            height: 1000px;
            background:
                radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.22) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.16) 0%, transparent 70%),
                radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.12) 0%, transparent 70%);
        }
    }
</style>
