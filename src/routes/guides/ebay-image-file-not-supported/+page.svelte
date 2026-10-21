<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Why Does eBay Say My Image File Is Not Supported?",
        description: "eBay rejects HEIC, HIF, RAW and oversized images. Convert to JPEG before uploading to fix 'file not supported' errors instantly.",
        category: "Quick Guides",
        readTime: "2 min read",
        datePublished: "June 24, 2026",
        lastUpdated: "October 1, 2026"
    };

    const related = [
        {
            title: "What Image Format Should I Use for Product Photos?",
            href: "/guides/what-image-format-should-i-use-for-product-photos",
            desc: "A quick breakdown of JPEG, WebP, and AVIF for ecommerce product listings."
        },
        {
            title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt",
            href: "/guides/ecommerce-product-photo-workflow-resize-convert",
            desc: "How to batch-process product images for any marketplace using natural language."
        },
        {
            title: "Should I Optimize My Images Before I Upload Them?",
            href: "/guides/should-i-optimize-images-before-upload",
            desc: "Why pre-optimizing before any platform upload is faster and safer."
        },
        {
            title: "How to Take Vinted Photos That Sell",
            href: "/guides/vinted-photos-that-sell",
            desc: "Photo prep for the other big second-hand marketplace."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/ebay-image-file-not-supported" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Why Does eBay Say My Image File Is Not Supported?",
        "description": "eBay rejects HEIC, HIF, RAW and oversized images. Convert to JPEG before uploading to fix 'file not supported' errors instantly.",
        "url": "https://mochify.app/guides/ebay-image-file-not-supported",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/ebay-image-file-not-supported"
        },
        "image": "https://mochify.app/og/guides-ebay-image-file-not-supported.png",
        "datePublished": "2026-06-24",
        "dateModified": "2026-10-01",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "about": [
            { "@type": "Thing", "name": "eBay image requirements" },
            { "@type": "Thing", "name": "Image format conversion" },
            { "@type": "Thing", "name": "JPEG compression" }
        ],
        "keywords": "ebay image file not supported, ebay image upload error, heic ebay, hif ebay, convert image to jpeg ebay"
    }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/ebay-image-file-not-supported"
        description={metadata.description}
        datePublished="2026-06-24"
        dateModified="2026-10-01"
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
			<AccentTitle title={metadata.title} accent="Not Supported" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.datePublished} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            eBay rejects images its upload tool cannot read, most commonly RAW files and the .HIF files professional cameras write, files over its 12MB limit, and, for some sellers, iPhone HEIC photos, even though eBay now lists HEIC as accepted. Converting to JPEG before uploading fixes the error in almost every case.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">Published {metadata.datePublished} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong></p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="what-formats-does-ebay-accept" class="scroll-mt-24">
            <SectionHeading>What formats does eBay actually accept?</SectionHeading>
            <p class="mb-4">eBay's help page lists JPEG, PNG, GIF, TIFF, BMP, WebP, HEIC and AVIF as accepted formats, at up to 12MB per photo (<a href="https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148" target="_blank" rel="noopener noreferrer">eBay: Adding pictures to your listings</a>). In practice, sellers still report HEIC uploads failing on eBay's community forums, so JPEG remains the safest choice for main product photos.</p>
            <p class="mb-4">RAW files from cameras (CR3, ARW, NEF, and similar) and HIF files from professional mirrorless cameras are never accepted. Renaming a HEIC or RAW file with a <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">.jpg</code> extension does not work. eBay checks the actual file data, not just the extension. Mochify's uploader does the same, and when it refuses a file the cause is often not the format at all: <a href="/guides/why-did-my-upload-fail">the upload error guide</a> covers the sidecar and placeholder files behind many of those rejections.</p>

            <GlassInfoBox type="tip" title="Good to know">
                eBay's list of accepted formats has grown to include WebP, HEIC and AVIF, but the list is not the whole story: a camera's .HIF file is still not on it, and HEIC uploads still fail for some sellers. When in doubt, export as JPEG.
            </GlassInfoBox>
        </section>

        <section id="the-12mb-file-size-limit" class="scroll-mt-24">
            <SectionHeading>The 12&nbsp;MB file size limit</SectionHeading>
            <p class="mb-4">Every image must be under 12&nbsp;MB per file. This catches two common scenarios: RAW or TIFF exports, which can run into the tens or hundreds of megabytes, and high-resolution JPEGs where someone has exported at 100% quality from a large sensor camera.</p>
            <p class="mb-4">Exporting a JPEG at 80–90% quality and sizing the longest edge to around 1,600 pixels (eBay's recommended size for the zoom viewer) typically brings files well under the limit while keeping image quality high for buyers. Practical targets: files of 200–800&nbsp;KB work well for most listings.</p>
        </section>

        <section id="fix-it-in-one-step-with-mochify" class="scroll-mt-24">
            <SectionHeading>Fix it in one step with Mochify</SectionHeading>
            <p class="mb-4">Mochify's <a href="/solutions/ebay-image-converter">eBay image resizer and converter</a> does both in one step: it resizes each photo to eBay's recommended 1600 pixels on the long edge and converts HEIC, HIF, WebP, AVIF and PNG files to high-quality JPEG, with GPS location stripped by default and nothing to type. For anything more specific, ask Magic Flow in the <a href="/flow">web app</a> in plain English, for example:</p>

            <div class="bg-[#FFF8F9] border border-pink-100 rounded-2xl px-6 py-5 my-6">
                <p class="font-mono text-sm text-[#4A2C2C] leading-relaxed">Convert to JPEG, resize to 1600px on the longest side, and keep quality around 85</p>
            </div>

            <p class="mb-4">The <a href="/ebay-seller">eBay photo size and rules page</a> puts eBay's current limits and the one-prompt workflow on a single page.</p>

            <p class="mb-4">Your image is processed in-memory and deleted immediately: nothing is stored. The free plan covers 25 images per month, or 3 a month without signing up, which is enough for occasional listings.</p>

            <p class="mb-4">If you also sell on Vinted, photo prep is different there (portrait, not square, and no official spec) - covered in <a href="/guides/vinted-photos-that-sell">our Vinted photo guide</a>.</p>

            <p class="mb-4">Listing the same items on more than one platform? The <a href="/guides/cross-listing-marketplace-photo-requirements">photo requirements for every major marketplace</a> differ - eBay, Poshmark, Mercari, Depop, and Vinted each want a different shape, size, or format.</p>

            <p class="mb-4">Hitting upload errors on every listing is a volume problem as much as a format one. If you're reselling at any real scale, see <a href="/guides/is-reselling-worth-it">our reseller ROI guide</a> for the honest math on where the time actually goes.</p>
        </section>

        <GlassCTA href="/" label="Try it free">
            Convert HEIC, HIF, RAW, or oversized images to eBay-ready JPEG in seconds. Just describe what you need: <em>"convert to JPEG, 1600px, quality 85"</em> and Mochify handles the rest.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
