<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const SIZES = [500, 800, 1000, 1200, 1500, 2000] as const;
    type Size = typeof SIZES[number];

    let squareSize: Size = $state(1000);
    const queryParams = $derived(`width=${squareSize}&height=${squareSize}&smartCrop=1`);

    // Mode 11 rewrite (2026-09-22). The page ranks as Google's preferred URL for
    // square-crop queries on this site, so the title and H1 are written in the
    // words the SERP uses ("crop images to square", "bulk") rather than as a
    // product name. "AI" moved into the first sentence: the "ai image cropper"
    // SERP is ad-heavy and split across unrelated intents.
    const metaDescription =
        'Crop a batch of photos to a perfect square online. AI finds the subject in every image and centers the crop on it, at 500 to 2000 px. Free, no signup, processed in memory and never saved to disk.';

    const steps = [
        {
            n: '1',
            t: 'Pick the square size',
            d: 'Above the uploader: 500, 800, 1000, 1200, 1500 or 2000 px. Every image in the batch comes out at that size, so set it before you upload.'
        },
        {
            n: '2',
            t: 'Drop your images',
            d: 'Or click browse. Up to 3 with no signup or a free account, 25 per batch on Seller and Pro. JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF and JPEG XL files can all go in the same batch. Once they are in, a format row appears under the thumbnails: JPEG is selected, or switch the batch to PNG, WebP, AVIF or JPEG XL.'
        },
        {
            n: '3',
            t: 'Download the squares',
            d: 'Each image is analyzed on its own, so a portrait, a landscape product shot and a phone snapshot in the same batch each get their own crop.'
        }
    ];

    const sizeGuide = [
        {
            px: '1000 px',
            note: 'covers most e-commerce listings; Amazon\'s zoom activates at 1,000 px on the longest side, so this is the safe floor for product images.'
        },
        {
            px: '1200 px',
            note: 'for Shopify and other high-DPI product grids, and for Instagram, which displays square posts at 1080 px.'
        },
        { px: '500 or 800 px', note: 'for thumbnails, avatars, previews and general web use.' },
        {
            px: '1500 or 2000 px',
            note: 'when the square is your master copy: Etsy crops the same first photo three ways, and a 2000 × 2000 square is the most crop-resistant upload it can have. Upscaling is not applied, so pick a size the originals can support.'
        }
    ];

    // Nine FAQs, answers verbatim from the handoff copy. FaqAccordion renders the
    // question as an <h3> inside the <summary> and keeps answers in the served
    // HTML; faqSchema builds the FAQPage block from this same array so the two
    // cannot drift.
    const faqs: FaqItem[] = [
        {
            q: 'Is the bulk square cropper free?',
            a: 'Yes. Crop up to 3 images with no signup, or 25 a month with a free account, at up to 20MB per file and 3 per batch. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans batch 25 files at a time at up to 75MB each.'
        },
        {
            q: 'How does it know where to crop?',
            a: 'A saliency model scores each image for the region a viewer looks at first, usually the face, product or focal subject, and the square is centered on that region rather than on the middle of the frame. Each image in a batch is analyzed on its own. It works best when the subject is obvious; a frame with no clear subject gets a best estimate.'
        },
        {
            q: 'Can I crop multiple images to a square at once?',
            a: 'Yes. Drop them in together and every one comes back at the size you picked. Free and no-signup batches are 3 files; Seller, Pro and the Day Pass take 25 per batch, and the CLI takes a whole folder in one command.'
        },
        {
            q: 'Which square size should I choose?',
            a: '1000 px suits most product listings and clears Amazon\'s zoom threshold; 1200 px for Shopify grids and Instagram; 500 or 800 px for thumbnails and previews; 2000 px when the square is your master copy for Etsy. The size is applied to the whole batch, so set it before uploading.'
        },
        {
            q: 'Can I make an image square without cropping it?',
            a: 'Not on this page. This tool crops to the subject; keeping the whole picture and filling the sides with a blur or a color is padding, which is a different tool. If the subject should fill the frame, cropping is what you want.'
        },
        {
            q: 'What formats can I upload, and what do I get back?',
            a: 'JPG, JPEG, PNG, WebP, AVIF, HEIC, HEIF, HIF and JPEG XL, mixed in one batch, so iPhone photos and camera files can go straight in. Squares come back as JPEG by default, encoded with Google\'s jpegli for better quality per byte; after upload you can switch the whole batch to PNG, WebP, AVIF or JPEG XL. Nothing is upscaled, so choose a size the originals can support.'
        },
        {
            q: 'Do you keep my photos?',
            a: 'No. They travel to our encoder over HTTPS, are streamed into memory, cropped, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included; if you need it kept, use the web app\'s Strip EXIF switch or stripExif=false on the API.'
        },
        {
            q: 'What happens if the subject is near an edge?',
            a: 'The crop window moves as close to the subject as it can without leaving the image, so a subject at the edge stays in the square rather than being cut in half.'
        },
        {
            q: 'How do I crop hundreds of images to square automatically?',
            a: 'Use the CLI, which takes a folder and one plain-English instruction, or call POST /v1/squish with smartCrop=true and equal width and height from a script. Both run the same saliency crop as this page and neither needs the browser open. The Day Pass covers 100 uploads in 24 hours for $2 without an account.'
        }
    ];

    const faqLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    });

    const guideLinks = [
        {
            href: '/guides/do-marketplace-product-images-need-to-be-square',
            title: 'Do marketplace product images need to be square?',
            desc: 'The platform-by-platform answer'
        },
        {
            href: '/guides/product-image-requirements-marketplace-guide',
            title: 'Product image requirements for every marketplace',
            desc: 'Sizes, ratios and formats per platform'
        },
        {
            href: '/guides/etsy-listing-photo-size-guide',
            title: 'Etsy listing photo size',
            desc: 'What Etsy does to your first photo'
        }
    ];
</script>

<svelte:head>
    <title>Bulk Square Crop - Crop Images to Square Automatically | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="Bulk Square Crop - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Bulk Square Crop - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Mochify Bulk Square Cropper",
        "description": "Crop a batch of photos to a perfect square online. AI finds the subject in every image and centers the crop on it, at 500 to 2000 px. Free, no signup, processed in memory and never saved to disk.",
        "url": "https://mochify.app/solutions/bulk-ai-square-cropper",
        "applicationCategory": "MultimediaApplication",
        "applicationSubCategory": "Image Editor",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "featureList": [
            "Crop a batch of images to a 1:1 square in the browser",
            "Saliency detection centers each crop on the subject, per image",
            "Output sizes of 500, 800, 1000, 1200, 1500 or 2000 px",
            "Accepts JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF and JPEG XL",
            "Output as JPEG, PNG, WebP, AVIF or JPEG XL",
            "Up to 3 files with no signup; 25 per batch on paid plans",
            "CLI, MCP server and REST API for automated cropping",
            "Files processed in memory and never saved to disk; metadata including GPS stripped by default"
        ],
        "softwareRequirements": "Modern Web Browser",
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>

    <!-- FAQPage built from the same `faqs` array the accordion renders, so the
         schema can never drift from the visible answers. -->
    {@html `<script type="application/ld+json">${faqLd}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                    Square Crop
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-violet-50 border border-violet-100 shadow-sm text-violet-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    AI Saliency
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Crop Images to
                <span class="bg-gradient-to-r from-[#F06292] to-violet-500 bg-clip-text text-transparent">
                    Square
                </span>
                in Bulk
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop in a batch of photos and get every one back as a perfect square with the subject in the middle. Mochify looks at each image separately, finds the face, product or focal point, and centers the 1:1 crop on it, so product shots, portraits and snapshots in the same batch all come out framed correctly without you touching one. Pick a size from 500 to 2000 px, upload, download. Three images with no signup, 25 a month with a free account, processed in memory and never saved to disk.
            </p>
        </div>

        <!-- Size picker -->
        <div class="max-w-2xl mx-auto mb-8">
            <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
                <p class="text-xs font-black uppercase tracking-widest text-[#875F42] mb-4">Square size</p>
                <div class="flex flex-wrap gap-2">
                    {#each SIZES as size}
                        <button
                            type="button"
                            onclick={() => squareSize = size}
                            class="rounded-full px-4 py-2 text-sm font-bold transition-all {squareSize === size
                                ? 'bg-[#F06292] text-white shadow-sm'
                                : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}"
                        >
                            {size} px
                        </button>
                    {/each}
                </div>
                <p class="text-xs text-[#875F42] mt-3 opacity-70">
                    Current: {squareSize} × {squareSize} px &nbsp;·&nbsp; AI saliency centers the crop on the main subject
                </p>
            </div>
        </div>

        <div class="mb-16">
            <ImageUpload {queryParams} />
        </div>

        <!-- How to -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">How to crop images to a square in bulk</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each steps as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-violet-50 text-violet-600 font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- How the crop decides -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How the crop decides where to cut</h2>
            <div class="space-y-4 max-w-3xl">
                <p class="text-[#6C3F31] leading-relaxed">
                    A plain center crop takes the middle of the frame and hopes the subject is there. Often it is not: a product shot with headroom, a person standing to one side, an item low in the frame all lose the thing that mattered, and bulk tools that apply one rectangle to every image repeat the mistake across the batch.
                </p>
                <p class="text-[#6C3F31] leading-relaxed">
                    Mochify runs a saliency model on each image to find the region a viewer's eye goes to first, typically a face, a product or the focal subject, and centers the square on that region instead of the geometric center. If the subject sits near an edge, the crop window slides as far toward it as the image allows without leaving the frame. It is a best guess, not a promise: when the subject is obvious, a product on a plain background or a person in the frame, it lands where you would have cropped by hand; a busy scene with no clear subject gets the model's best estimate, so check those. Every square in the batch is framed on its own subject, which is what a marketplace grid or a profile-card layout needs.
                </p>
            </div>
        </section>

        <!-- Which size -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Which square size to pick</h2>
            <div class="bg-violet-50 border border-violet-100 rounded-2xl p-6 space-y-3 max-w-3xl">
                <ul class="space-y-3">
                    {#each sizeGuide as row}
                        <li class="flex items-start gap-2.5 text-sm text-violet-900 leading-relaxed">
                            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2"></span>
                            <span><strong class="font-black">{row.px}</strong> {row.note}</span>
                        </li>
                    {/each}
                </ul>
            </div>
            <p class="text-[#6C3F31] leading-relaxed mt-5 max-w-3xl">
                The <a href="/guides/product-image-requirements-marketplace-guide" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">marketplace image requirements guide</a> has the per-platform numbers.
            </p>
        </section>

        <!-- Square without cropping -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Square without cropping?</h2>
            <p class="text-[#6C3F31] leading-relaxed max-w-3xl">
                This page crops. If you need the whole picture kept and the sides filled with a blurred or solid background, that is a padded square, a different job and not one this tool does. Cropping is the right choice when the subject should fill the frame: product listings, portraits, profile pictures and any grid that displays 1:1 thumbnails. Padding is the right choice for a landscape you cannot afford to cut.
            </p>
        </section>

        <!-- Desktop / phone routes -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Cropping to square on Windows, Mac or iPhone without a tool</h2>
            <p class="text-[#6C3F31] leading-relaxed max-w-3xl">
                You can, one image at a time. Windows Photos and the Mac's Preview both crop a single image to 1:1; the iPhone's Photos app does the same from Edit, Crop, then the Square preset. None of them handles a folder. The batch routes that exist, IrfanView's batch conversion on Windows, an Automator Crop Images action on a Mac, a Shortcuts Crop Image action on iPhone, Photoshop's Actions with Batch, all apply one fixed rectangle to every file, which is the center-crop problem again. This page is for the batch where each crop has to be decided per image. If you want the full walkthrough of those native routes, and what each one does to your framing, see our <a href="/guides/batch-crop-photos-to-square">guide to batch cropping photos to square</a>.
            </p>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Bulk, batch and automated square cropping</h2>
            <p class="text-[#6C3F31] leading-relaxed mb-6 max-w-3xl">
                A catalog, a client shoot or a whole marketplace inventory is the usual case. Seller and Pro accounts crop up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same saliency crop runs from the terminal with the Mochify CLI (<span class="font-mono font-bold text-[#4A2C2C]">mochify</span>, one plain-English prompt for a whole folder, sign in once with <span class="font-mono font-bold text-[#4A2C2C]">mochify auth login</span>), from an AI agent through the hosted or local MCP server, and from the REST API, where <span class="font-mono font-bold text-[#4A2C2C]">smartCrop</span> with equal width and height is the square crop:
            </p>
            <div class="bg-[#2D2320] rounded-2xl px-6 py-5 overflow-x-auto shadow-sm">
                <pre class="text-sm font-mono text-[#F5E9E2] leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?smartCrop=true&width=1000&height=1000&type=jpg" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @product-01.heic \
  -o product-01.jpg</code></pre>
            </div>
            <p class="text-sm text-[#875F42] leading-relaxed mt-4 max-w-3xl">
                The CLI, MCP and API are clients over the same engine as this page: files travel over HTTPS to api.mochify.app, are cropped in memory and discarded. Full parameter reference in the <a href="/docs" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Need a transparent cutout as well as a square? The <a href="/solutions/remove-background-webp" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">background remover</a> pairs with this crop.
            </p>
        </section>

        <!-- Marketplaces -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Square crops for marketplaces and grids</h2>
            <p class="text-[#6C3F31] leading-relaxed max-w-3xl">
                Most marketplaces do not require a square upload, and most crop your thumbnail to one anyway: eBay and Depop render listing thumbnails at or close to 1:1, Etsy asks for a landscape or square first photo and then crops it three ways, and Amazon standardizes search cards on 1:1 without mandating the ratio. A pre-cropped square survives all of that with the product where you framed it; <a href="/guides/do-marketplace-product-images-need-to-be-square" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">do marketplace product images need to be square?</a> has the platform-by-platform answer. Vinted and Poshmark are the exceptions, displaying 3:4 portrait; the <a href="/guides/vinted-photos-that-sell" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Vinted photo guide</a> covers that crop. For one photo set that has to work everywhere, the <a href="/guides/cross-listing-marketplace-photo-requirements" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">cross-listing photo guide</a> has the batch workflow, and <a href="/guides/ecommerce-product-photo-workflow-resize-convert" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">resize and convert product photos in one pass</a> takes it from phone to listing.
            </p>
        </section>

        <!-- FAQ -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">FAQ</h2>
            <FaqAccordion {faqs} />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/ebay-image-converter" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">eBay Image Converter →</p>
                        <p class="text-xs text-[#875F42]">Fix file-not-supported errors and stay under the 12 MB limit</p>
                    </div>
                </a>
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100">
                        <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Background Remover →</p>
                        <p class="text-xs text-[#875F42]">AI cutout with transparent WebP output, great alongside square crops</p>
                    </div>
                </a>
            </div>

            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mt-10 mb-4">Want the long version?</p>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each guideLinks as guide}
                    <a href={guide.href} class="block bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                        <p class="font-black text-[#4A2C2C] text-sm mb-1 group-hover:text-[#F06292] transition-colors">{guide.title} →</p>
                        <p class="text-xs text-[#875F42]">{guide.desc}</p>
                    </a>
                {/each}
            </div>
        </section>

    </div>
