<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Resize photos to eBay's recommended 1600px and convert HEIC, HIF, WebP, AVIF and PNG to high-quality JPEG. Free, no signup, GPS stripped by default.";

    // The resize switch label is quoted in the copy and in the FAQ below, so the
    // two must stay in step: change it here and nowhere else.
    const RESIZE_LABEL = 'Resize to 1600px (eBay recommended)';

    const faqs: FaqItem[] = [
        {
            q: 'Is the eBay image resizer free?',
            a: 'Yes. Resize and convert 3 images a month with no signup, or 25 a month with a free account, at up to 20MB per file and 3 per batch. A $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans take 25 files per batch at up to 75MB each.'
        },
        {
            q: 'What size should photos be for eBay?',
            a: 'At least 500 x 500 pixels; eBay recommends about 1600 x 1600, in a 1:1 or 16:9 ratio, and no more than 12MB per file. This page resizes the long edge to 1600 pixels by default, which meets eBay\'s recommendation and keeps every file far below the 12MB limit.'
        },
        {
            q: 'Will it make small photos bigger?',
            a: 'No. A photo that is already under 1600 pixels on its long edge keeps its size, because enlarging it would add pixels without adding detail. Only larger photos are scaled down.'
        },
        {
            q: 'Can I convert without resizing?',
            a: `Yes. Untick "${RESIZE_LABEL}" after uploading and the JPEGs keep their original dimensions.`
        },
        {
            q: 'What photo formats does eBay accept?',
            a: 'eBay\'s help page lists JPEG, PNG, GIF, TIFF, BMP, WebP, HEIC and AVIF, up to 12MB per photo. Camera .HIF files are not on the list, and HEIC uploads still fail for some sellers, so JPEG remains the format that always works.'
        },
        {
            q: "Why won't eBay accept my photo?",
            a: 'The usual causes are a file over 12MB, a format eBay does not read, such as a camera\'s .HIF or a RAW file, or a file that is not what its extension says. Resizing and converting to JPEG here fixes the first two in one step; the eBay file-not-supported guide covers the rest.'
        },
        {
            q: 'Does it remove location data from my photos?',
            a: 'Yes, by default. The Strip EXIF switch that appears after upload is on, which removes GPS location and camera details from the JPEG before you list it. Switch it off if you need the metadata kept.'
        },
        {
            q: 'Do you keep my photos?',
            a: 'No. They travel over HTTPS to api.mochify.app, are processed in memory and discarded. Nothing is written to disk, nothing containing your files is logged, and nothing is used to train AI.'
        }
    ];

    const softwareLd = {
        '@type': 'SoftwareApplication',
        name: 'Mochify eBay Image Resizer and Converter',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Converter',
        operatingSystem: 'Web',
        url: 'https://mochify.app/solutions/ebay-image-converter',
        description: metaDescription,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        featureList: [
            'Resize photos to 1600px on the long edge for eBay, on by default, never upscaled',
            'Convert HEIC, HEIF, HIF, WebP, AVIF, PNG and JPG to JPEG',
            "JPEG encoded with Google's jpegli",
            'Strip EXIF switch, on by default, removes GPS location',
            'Up to 3 files with no signup; 25 per batch on paid plans',
            'CLI, MCP server and REST API for automated resizing',
            'Files processed in memory and never saved to disk'
        ],
        softwareRequirements: 'Modern Web Browser'
    };

    const graphLd = {
        '@context': 'https://schema.org',
        '@graph': [softwareLd, { '@type': 'FAQPage', mainEntity: faqSchema(faqs) }]
    };
</script>

<svelte:head>
    <title>eBay Image Resizer &amp; Converter - 1600px JPEG, Free | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="eBay Image Resizer &amp; Converter - Mochify">
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="eBay Image Resizer &amp; Converter - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(graphLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                    </svg>
                    1600px for eBay
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                    </svg>
                    Never Saved to Disk
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#875F42]/10 shadow-sm text-[#875F42] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18"/>
                    </svg>
                    GPS Stripped by Default
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                eBay
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    Image Resizer
                </span>
                and Converter
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Get every photo ready for an eBay listing in one step: resized to the 1600 pixels eBay recommends, converted to a high-quality JPEG, and stripped of location data. Drop in iPhone HEIC, camera HIF, WebP, AVIF, PNG or JPG files. Three images with no signup, 25 a month with a free account, processed in memory and never saved to disk.
            </p>
        </div>

        <div class="mb-16">
            <!-- Two switches after upload, both on by default: the 1600px long-edge
                 resize and Strip EXIF. Equal width/height without smartCrop fits the
                 photo inside the box, keeps its proportions and never upscales. -->
            <ImageUpload
                types=".JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF"
                output="jpg"
                showTypes={false}
                compact
                showExifOption={true}
                showResizeOption={true}
                resizeLongEdge={1600}
                resizeLabel={RESIZE_LABEL}
            />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">How to resize and convert photos for eBay</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop your photos</strong> into the box above, or click browse. HEIC, HEIF, HIF, WebP, AVIF, PNG and JPG files can go in the same batch: up to 3 at a time with no signup or a free account, 25 on Seller and Pro.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Check the two switches.</strong> "{RESIZE_LABEL}" is ticked, so each photo comes back 1600 pixels on its long edge with its shape unchanged. Strip EXIF is on, so GPS location and camera details are removed. Untick either one if you need the original size or the metadata.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download the JPEGs</strong> and add them in the Photos section of your listing. eBay takes up to 24 photos per listing.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">eBay photo size: why 1600 pixels</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        eBay asks for at least 500 x 500 pixels and recommends about 1600 x 1600, and says photos in a 1:1 or 16:9 ratio look best in listings and search (<a href="https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148" target="_blank" rel="noopener noreferrer" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">eBay: Adding pictures to your listings</a>). This page resizes the long edge to 1600 pixels and keeps the photo's shape, so a portrait shot stays portrait and a landscape stays landscape. Nothing is enlarged: a photo already smaller than 1600 pixels keeps its size, because upscaling adds pixels without adding detail. A 1600-pixel JPEG is also far below eBay's 12MB limit per photo, even from a large camera sensor, and uploads quickly from a phone connection. For square listing photos, use the <a href="/solutions/bulk-ai-square-cropper" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">bulk square cropper</a>, which centers each crop on the item.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">What eBay accepts, and why JPEG is still the safe choice</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        eBay's help page lists JPEG, PNG, GIF, TIFF, BMP, WebP, HEIC and AVIF as accepted formats, with a limit of 12MB per photo. Two gaps remain in practice. The .HIF files professional cameras write are not on that list, and sellers still report failed HEIC uploads on eBay's community forums. JPEG is accepted by eBay and by every other marketplace you might cross-list to, so converting once settles it. If eBay still refuses a file after conversion, <a href="/guides/ebay-image-file-not-supported" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">why eBay says a file is not supported</a> goes through the other causes.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-black text-[#4A2C2C]">Backgrounds and what eBay rewards</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                eBay's own advice: white backgrounds are generally best, a darker one can suit shiny or reflective items, the main photo should show the whole item face-on, and badges, logos and watermarks can hurt a listing's placement in search. eBay's listing tool has a Background button that swaps a background for solid white. To do it before you list, ask Magic Flow in the <a href="/flow" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">web app</a> to "remove the background and put it on a white background"; background removal is included on every plan. The <a href="/guides/product-image-requirements-marketplace-guide" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">marketplace image requirements guide</a> has the numbers for every other platform, and the <a href="/guides/cross-listing-marketplace-photo-requirements" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">cross-listing photo guide</a> preps one set of photos for all of them.
            </p>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-black text-[#4A2C2C]">Resizing and converting on iPhone, Mac or Windows</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                For future photos, an iPhone can shoot JPEG instead of HEIC: Settings, Camera, Formats, Most Compatible (<a href="https://support.apple.com/HT207022" target="_blank" rel="noopener noreferrer" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Apple</a>). On a Mac, Preview's File, Export saves a copy as JPEG, and Tools, Adjust Size changes its dimensions, one file at a time. On Windows, open the photo in Photos or Paint, resize it, and save a copy as JPEG; HEIC files need Microsoft's HEIF Image Extensions installed. None of these reads a camera's .HIF file reliably or handles a mixed folder in one pass, which is where this page earns its keep.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-black text-[#4A2C2C]">Bulk and automated resizing</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Seller and Pro accounts process up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. For a whole inventory, the same job runs from the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify auth login</code>), from an AI agent through the hosted or local MCP server, and from the REST API, where <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">width</code> and <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">height</code> together keep the long edge at 1600 pixels:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;width=1600&amp;height=1600" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @listing-01.heic \
  -o listing-01.jpg</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Files travel over HTTPS to api.mochify.app, are processed in memory and discarded. Full parameter reference in the <a href="/docs" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Frequently asked questions</h2>
            <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/bulk-ai-square-cropper" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F1F8E9] flex items-center justify-center shrink-0 border border-[#DCEDC8]">
                        <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Bulk Square Cropper →</p>
                        <p class="text-xs text-[#875F42]">Square listing photos, centered on the item</p>
                    </div>
                </a>
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP Background Remover →</p>
                        <p class="text-xs text-[#875F42]">Cut the subject out on a transparent background</p>
                    </div>
                </a>
                <a href="/guides/ebay-image-file-not-supported" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Why does eBay say my image file is not supported? →</p>
                        <p class="text-xs text-[#875F42]">The other causes, once the format is right</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
