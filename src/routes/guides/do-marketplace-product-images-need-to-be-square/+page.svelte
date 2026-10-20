<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Do Marketplace Product Images Need to Be Square?",
        description: "No marketplace universally requires square product images, but most crop thumbnails to 1:1 - making pre-cropped images the safer choice for any seller.",
        category: "Quick Guides",
        readTime: "2 min read",
        datePublished: "June 29, 2026",
        lastUpdated: "September 22, 2026"
    };

    const related = [
        {
            title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt →",
            href: "/guides/ecommerce-product-photo-workflow-resize-convert",
            desc: "How to resize, convert, and optimize a full product catalog in a single Magic Flow prompt."
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
        },
        {
            title: "Vinted Photo Size and Aspect Ratio →",
            href: "/guides/vinted-photos-that-sell#technical-facts",
            desc: "Vinted's real sizes and ratios, and what its search grid crops."
        }
    ];

    const platforms = [
        {
            name: "Etsy",
            body: `Etsy is the most explicit. Its <a href="https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop" target="_blank" rel="noopener noreferrer">own help center</a> states the first listing photo should be horizontal or square - not portrait - and that the first photo's shape determines how subsequent photos are cropped in thumbnail views. Sellers can adjust thumbnail cropping inside the listing editor, but Etsy recommends keeping the same image shape across a listing for a more cohesive browsing experience.`
        },
        {
            name: "Amazon",
            body: "Amazon specifies minimum pixel dimensions - the zoom feature activates at 1,000 pixels on the longest side - but no official aspect-ratio requirement. In practice, most sellers standardize on 1:1 because Amazon's product cards display at a square ratio in search results and category pages."
        },
        {
            name: "Shopify",
            body: "Shopify has no official square mandate. Whether product images appear at a consistent ratio depends on your theme: some Shopify themes crop all grid images to 1:1 by default, others preserve the uploaded ratio. If your theme is ratio-flexible and you upload mixed-orientation images, the browse grid will look mismatched."
        },
        {
            name: "eBay, Vinted, and Depop",
            body: `None of these platforms publish formal aspect-ratio requirements. All three display images in a full-image viewer on the listing page, but search result thumbnails typically render at or close to square. Vinted is the clearest portrait exception - its search grid crops every thumbnail to a portrait window. See <a href="/guides/vinted-photos-that-sell#technical-facts">Vinted photo size and aspect ratio</a>.`
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
        "dateModified": "2026-09-22",
        "inLanguage": "en",
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

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

    <!-- Header -->
    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="Need to Be Square" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.datePublished} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            No marketplace universally requires square product images, but most display listings in square or near-square thumbnail grids - which means a portrait or landscape image that has not been pre-cropped will be auto-cropped by the platform, often poorly. The practical rule for any seller with a mixed catalog: standardize on a consistent aspect ratio before uploading, with square (1:1) or horizontal (4:3) as the safest choices for grid-based browsing.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published June 29, 2026 by the Mochify Engineering Team.</strong>
                Platform guidelines sourced from official help centers and checked against live documentation as of June 2026.
            </p>
        </div>
    </header>

    <!-- Article body -->
    <div class="space-y-12">

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
                Square crops matter in three situations: search result grids (where thumbnails are cut to 1:1 regardless of the original), social shopping surfaces such as Instagram Shopping and Pinterest product feeds, and catalogs on platforms like Etsy where the first image sets the visual rhythm of the whole shop.
            </p>

            <p class="mb-6">
                Portrait images shot at 2:3 or 3:4 carry the highest risk. A product centered on a portrait background will lose the top and bottom of the frame when auto-cropped to square. Uploading a pre-cropped square image keeps the focal point exactly where you intend it.
            </p>

            <p class="mb-6">
                The shape question also cuts the other way now: Poshmark moved its display layer to 3:4 portrait in March 2026, joining Vinted, so "square-safe" is no longer a universal default. When you list the same item across several platforms, <a href="/guides/cross-listing-marketplace-photo-requirements">the cross-listing photo guide</a> maps each marketplace's current shape, size, and format in one place.
            </p>

            <GlassInfoBox type="tip" title="Shooting tip">
                Keep your subject centered with breathing room on all four sides. An image with central subject placement survives square, portrait, and landscape thumbnail crops without losing the product - giving you one versatile photo that works across Etsy, Amazon, and Shopify in a single shot.
            </GlassInfoBox>
        </section>

        <!-- Section 3 -->
        <section id="preparing-a-catalogue-for-upload" class="scroll-mt-24">
            <SectionHeading>Preparing a catalog for upload</SectionHeading>

            <p class="mb-4">
                If you're working through a large product catalog, Mochify's <a href="/solutions/bulk-ai-square-cropper">Bulk Square Cropper</a> uses saliency detection to identify the main subject in each image and crop to it, rather than defaulting to the geometric center. Output sizes are 500, 800, 1000, 1200, 1500, and 2000 px - sized to clear most platforms' minimum resolution requirements while staying inside typical upload limits. For the free alternatives, and why almost all of them crop from the center whatever your subject is doing, see <a href="/guides/batch-crop-photos-to-square">how batch cropping actually works on each platform</a>.
            </p>

            <p class="mb-4">
                You can also describe the task in plain language - tell Mochify <em>"square crop to 1200px, keep the main subject centered"</em> - and Magic Flow handles the batch automatically.
            </p>

            <p class="mb-4">
                Pre-cropping at batch scale is a time question as much as a formatting one - see <a href="/guides/is-reselling-worth-it">what listing volume actually costs a reseller</a> for the honest math on where those hours go.
            </p>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Crop your product catalog to square automatically"
            href="/solutions/bulk-ai-square-cropper"
            label="Try the Bulk Square Cropper →"
        >
            Preparing a product catalog for multiple marketplaces? Mochify's saliency engine identifies the focal point in each photo and crops to square automatically - no manual adjustments per image.

        </GlassCTA>

        <!-- Related guides -->
        <RelatedGuidesGrid guides={related} />

    </div>
</article>
