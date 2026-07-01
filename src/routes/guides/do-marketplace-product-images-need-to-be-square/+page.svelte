<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Do Marketplace Product Images Need to Be Square?",
        description: "No marketplace universally requires square product images, but most crop thumbnails to 1:1 - making pre-cropped images the safer choice for any seller.",
        category: "Quick Guides",
        readTime: "2 min read",
        datePublished: "29 June 2026"
    };

    const related = [
        {
            title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt →",
            href: "/guides/ecommerce-product-photo-workflow-resize-convert",
            desc: "How to resize, convert, and optimise a full product catalogue in a single Magic Flow prompt."
        },
        {
            title: "What Image Format Should I Use for Product Photos? →",
            href: "/guides/what-image-format-should-i-use-for-product-photos",
            desc: "JPEG, WebP, AVIF, or JPEG XL - which format gives you the best quality-to-filesize trade-off for listings."
        },
        {
            title: "Should I Optimize My Images Before I Upload Them? →",
            href: "/guides/should-i-optimize-images-before-upload",
            desc: "Why pre-compressing beats relying on marketplace auto-processing for file size and quality."
        }
    ];

    const platforms = [
        {
            name: "Etsy",
            body: `Etsy is the most explicit. Its <a href="https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop" target="_blank" rel="noopener noreferrer">own help centre</a> states the first listing photo should be horizontal or square - not portrait - and that the first photo's shape determines how subsequent photos are cropped in thumbnail views. Sellers can adjust thumbnail cropping inside the listing editor, but Etsy recommends keeping the same image shape across a listing for a more cohesive browsing experience.`
        },
        {
            name: "Amazon",
            body: "Amazon specifies minimum pixel dimensions - the zoom feature activates at 1,000 pixels on the longest side - but no official aspect-ratio requirement. In practice, most sellers standardise on 1:1 because Amazon's product cards display at a square ratio in search results and category pages."
        },
        {
            name: "Shopify",
            body: "Shopify has no official square mandate. Whether product images appear at a consistent ratio depends on your theme: some Shopify themes crop all grid images to 1:1 by default, others preserve the uploaded ratio. If your theme is ratio-flexible and you upload mixed-orientation images, the browse grid will look mismatched."
        },
        {
            name: "eBay, Vinted, and Depop",
            body: "None of these platforms publish formal aspect-ratio requirements. All three display images in a full-image viewer on the listing page, but search result thumbnails typically render at or close to square."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/do-marketplace-product-images-need-to-be-square" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en_GB" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Do Marketplace Product Images Need to Be Square?",
        "description": "No marketplace universally requires square product images, but most crop thumbnails to 1:1 - making pre-cropped images the safer choice for any seller.",
        "url": "https://mochify.app/guides/do-marketplace-product-images-need-to-be-square",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/do-marketplace-product-images-need-to-be-square"
        },
        "datePublished": "2026-06-29",
        "dateModified": "2026-06-29",
        "inLanguage": "en-GB",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
                { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
                { "@type": "ListItem", "position": 3, "name": "Do Marketplace Product Images Need to Be Square?", "item": "https://mochify.app/guides/do-marketplace-product-images-need-to-be-square" }
            ]
        },
        "about": [
            { "@type": "Thing", "name": "product image aspect ratio" },
            { "@type": "Thing", "name": "marketplace product photography" },
            { "@type": "Thing", "name": "e-commerce image cropping" }
        ],
        "keywords": "marketplace product images, square product images, Etsy image requirements, Amazon product images, Shopify image ratio, product image aspect ratio, e-commerce image size"
    }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <!-- Header -->
    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.datePublished}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Do Marketplace Product Images Need to Be Square?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            No marketplace universally requires square product images, but most display listings in square or near-square thumbnail grids - which means a portrait or landscape image that has not been pre-cropped will be auto-cropped by the platform, often poorly. The practical rule for any seller with a mixed catalogue: standardise on a consistent aspect ratio before uploading, with square (1:1) or horizontal (4:3) as the safest choices for grid-based browsing.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published June 29, 2026 by the Mochify Engineering Team.</strong>
                Platform guidelines sourced from official help centres and checked against live documentation as of June 2026.
            </p>
        </div>
    </header>

    <!-- Article body -->
    <div class="space-y-14 text-lg text-[#6C3F31] leading-relaxed">

        <!-- Section 1 -->
        <section id="what-each-platform-actually-says" class="scroll-mt-24">
            <SectionHeading>What each platform actually says</SectionHeading>

            <div class="flex flex-col gap-4">
                {#each platforms as platform}
                    <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 px-6 py-5">
                        <strong class="block text-[#4A2C2C] font-bold mb-2">{platform.name}</strong>
                        <p class="text-[#6C3F31] text-base leading-relaxed m-0">{@html platform.body}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Section 2 -->
        <section id="when-square-matters-most" class="scroll-mt-24">
            <SectionHeading>When square matters most</SectionHeading>

            <p class="mb-4">
                Square crops matter in three situations: search result grids (where thumbnails are cut to 1:1 regardless of the original), social shopping surfaces such as Instagram Shopping and Pinterest product feeds, and catalogues on platforms like Etsy where the first image sets the visual rhythm of the whole shop.
            </p>

            <p class="mb-6">
                Portrait images shot at 2:3 or 3:4 carry the highest risk. A product centred on a portrait background will lose the top and bottom of the frame when auto-cropped to square. Uploading a pre-cropped square image keeps the focal point exactly where you intend it.
            </p>

            <InfoBox type="tip" title="Shooting tip">
                Keep your subject centred with breathing room on all four sides. An image with central subject placement survives square, portrait, and landscape thumbnail crops without losing the product - giving you one versatile photo that works across Etsy, Amazon, and Shopify in a single shot.
            </InfoBox>
        </section>

        <!-- Section 3 -->
        <section id="preparing-a-catalogue-for-upload" class="scroll-mt-24">
            <SectionHeading>Preparing a catalogue for upload</SectionHeading>

            <p class="mb-4">
                If you're working through a large product catalogue, Mochify's <a href="/solutions/bulk-ai-square-cropper">Bulk AI Square Cropper</a> uses saliency detection to identify the main subject in each image and crop to it, rather than defaulting to the geometric centre. Output sizes are 500, 800, 1000, 1200, 1500, and 2000 px - sized to clear most platforms' minimum resolution requirements while staying inside typical upload limits.
            </p>

            <p class="mb-4">
                You can also describe the task in plain language - tell Mochify <em>"square crop to 1200px, keep the main subject centred"</em> - and Magic Flow handles the batch automatically.
            </p>
        </section>

        <!-- CTA -->
        <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Crop your product catalogue to square automatically</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base leading-relaxed">
                Preparing a product catalogue for multiple marketplaces? Mochify's saliency engine identifies the focal point in each photo and crops to square automatically - no manual adjustments per image.
            </p>
            <a href="/solutions/bulk-ai-square-cropper" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline text-base">
                Try the Bulk AI Square Cropper →
            </a>
        </aside>

        <!-- Related guides -->
        <RelatedGuides guides={related} />

    </div>
</article>
