<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "What Size Should Vinted Photos Be?",
        description: "The best Vinted photo size is portrait 3:4, around 1080x1440px, item centered. Vinted sets no official spec - here is what its image pipeline actually does.",
        category: "Quick Guides",
        readTime: "2 min read",
        date: "July 19, 2026"
    };

    const related = [
        { href: '/guides/do-marketplace-product-images-need-to-be-square', title: 'Do Marketplace Product Images Need to Be Square?', desc: 'Why Vinted is a portrait platform while others crop to 1:1.' },
        { href: '/guides/what-image-format-should-i-use-for-product-photos', title: 'What Image Format Should I Use for Product Photos?', desc: 'The practical format order for marketplace uploads.' },
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize & Convert in One Prompt', desc: 'Batch-preparing product photos across platforms.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/vinted-photo-size" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/vinted-photo-size" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "What Size Should Vinted Photos Be?",
        "description": "The best Vinted photo size is portrait 3:4, around 1080x1440px, item centered. Vinted sets no official spec - here is what its image pipeline actually does.",
        "url": "https://mochify.app/guides/vinted-photo-size",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/vinted-photo-size"
        },
        "datePublished": "2026-07-19",
        "dateModified": "2026-07-19",
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
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            { "@type": "Thing", "name": "Vinted" },
            { "@type": "Thing", "name": "photo size" },
            { "@type": "Thing", "name": "aspect ratio" },
            { "@type": "Thing", "name": "marketplace listing photos" }
        ],
        "keywords": "vinted photo size, vinted picture size, vinted aspect ratio, vinted image size, vinted photo dimensions",
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
            { "@type": "ListItem", "position": 3, "name": "What Size Should Vinted Photos Be?", "item": "https://mochify.app/guides/vinted-photo-size" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "What Size Should Vinted Photos Be?",
        "url": "https://mochify.app/guides/vinted-photo-size",
        "description": "The best Vinted photo size is portrait 3:4, around 1080x1440px, item centered. Vinted sets no official spec - here is what its image pipeline actually does.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-19",
        "dateModified": "2026-07-19"
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-[#F06292] text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            What Size Should Vinted Photos Be?
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            The best size for Vinted photos is portrait orientation at a 3:4 aspect ratio, around 1080x1440 pixels, with your item centered in the frame. Vinted itself publishes no official photo size, ratio, or format requirement anywhere in its help center - the widely repeated "requirements" you see in blog posts are guesses. What matters is how Vinted actually displays photos: the feed and search grid show a tightly cropped portrait thumbnail, so a centered portrait shot survives intact while landscape photos lose their edges exactly where buyers make their first decision.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl mb-8">
            <p class="text-lg text-[#6C3F31] leading-relaxed m-0">
                <strong>Quick answer:</strong> Shoot portrait at 3:4 (around 1080x1440px), keep the item centered, and upload JPEG or PNG. Vinted documents no official spec and recompresses everything anyway, so a sharp, well-framed original beats exact pixel counts.
            </p>
        </div>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 19, 2026 by the Mochify Engineering Team.</strong>
                Part of Mochify's Quick Guides series, answering fast, practical questions for marketplace sellers.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-vinted-does-to-your-photos">
            <SectionHeading>What Vinted actually does to your photos</SectionHeading>
            <p>We checked the live site rather than repeating the usual numbers. As of July 2026, Vinted's help pages set content rules only - up to 20 photos per listing, the first photo showing the entire item, no collages, no stock images - and state no pixel dimensions, no aspect ratio, and no file-size limit (<a href="https://www.vinted.co.uk/help/48-what-photos-you-should-upload" target="_blank" rel="noopener noreferrer">Vinted Help Center</a>).</p>
            <p>Behind the scenes, Vinted re-encodes every upload and serves it in WebP format. Item-page photos are delivered at roughly 800 pixels on the long side with your original aspect ratio preserved, and the catalog grid serves a fixed 310x430 pixel portrait crop of your first photo. Two practical conclusions follow:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Resolution above ~1600px is wasted.</strong> Vinted downscales everything, so a sharp, well-lit 1080x1440 original beats a huge file every time.</li>
                <li><strong class="text-[#4A2C2C]">The grid crop is unforgiving.</strong> If your item is off-center or shot landscape, the 310x430 thumbnail can cut it off. Portrait 3:4 with the item centered is the frame that survives.</li>
            </ul>
            <p>JPEG and PNG are the safe upload formats. iPhone HEIC photos work in the Vinted app, but convert them to JPEG if you are listing from a browser - see our <a href="/heic-to-jpeg">HEIC to JPEG converter</a>.</p>
        </section>

        <section id="the-fast-way-to-get-every-photo-right">
            <SectionHeading>The fast way to get every photo right</SectionHeading>
            <p>Batch-fixing a pile of listing photos is a one-prompt job in Mochify. Drop them in and type what you want in plain English, for example: "crop these to 3:4 portrait, center the item, resize to 1440px tall, convert to JPEG, and strip all metadata". Stripping metadata matters more than most sellers realize - photos taken at home can carry GPS coordinates in their EXIF data. No signup is needed for up to 3 images per session, and your photos are processed in memory and wiped immediately after conversion.</p>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Get every Vinted photo listing-ready</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">The Vinted photo optimizer smart-crops your shots to portrait, cleans them up, and keeps every listing consistent - just prompt <em>"crop these to 3:4 portrait, center the item, and strip all metadata"</em>.</p>
            <a href="/vinted-seller" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try the Vinted photo optimizer →
            </a>
        </div>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">· {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
