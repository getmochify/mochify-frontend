<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Compress JPEG files online with Google's jpegli encoder: smaller JPGs that stay standard JPEG and open everywhere. 3 files free, no signup, never saved to disk.";

    const faqs: FaqItem[] = [
        {
            q: 'Is this JPEG compressor free?',
            a: 'Yes. Compress up to 3 files a month with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time.'
        },
        {
            q: 'What is jpegli?',
            a: [
                "Jpegli is a JPEG encoder from Google, released in 2024. It borrows adaptive quantization from JPEG XL to spend bits where your eye notices them, and writes an ordinary JPEG. It is a better way of making a .jpg, not a new format. Our guide ",
                { href: '/guides/jpeg-in-2026-jpegli', label: 'Jpegli vs MozJPEG' },
                ' compares it with the other common encoders.'
            ]
        },
        {
            q: 'Will the compressed JPG open everywhere?',
            a: 'Yes. Jpegli output is standard JPEG, so it opens in every browser, phone gallery, photo editor, email client and upload form that already takes a .jpg. Nobody on the other end needs to install or update anything.'
        },
        {
            q: 'How much smaller will my files get?',
            a: "It depends on the photo and on how it was saved. In Google's rater study at high quality, jpegli used about 20% fewer bits than MozJPEG and 26% fewer than libjpeg-turbo for files raters slightly preferred. The biggest savings come from JPEGs exported at high quality straight from a camera, phone or editor. Removing metadata saves a little more on top."
        },
        {
            q: 'Can a JPEG come back larger?',
            a: 'Occasionally. A JPEG that was already saved at a low quality has little left to remove, and a fresh encode at quality 85 can land at about the same size or slightly above it. When that happens, keep your original. If you switch Strip EXIF off, the original bytes are returned whenever the new encode is no smaller.'
        },
        {
            q: 'Does compressing a JPEG again lose quality?',
            a: 'Every JPEG encode is lossy, so this is a new generation of the photo. At quality 85 with jpegli the difference is not visible on screen for typical photos, but avoid running the same file through repeatedly, and keep the original if you might need to edit it later.'
        },
        {
            q: 'What happens to the EXIF data and GPS location?',
            a: 'Metadata is stripped by default, GPS included, which also trims a few kilobytes. Once your files are in, a Strip EXIF switch appears; turn it off to keep camera settings, dates and location.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are compressed in memory and wiped as soon as your download is ready. Nothing is written to disk and no logs contain your image data.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify jpegli JPEG Compressor',
        url: 'https://mochify.app/solutions/jpegli-compressor',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Compressor',
        operatingSystem: 'Web',
        description: metaDescription,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        featureList: [
            "Compress JPEG files with Google's jpegli encoder",
            'Output stays standard JPEG, compatible with every viewer',
            'Encoded at quality 85',
            'Up to 3 files with no signup',
            'Processed in memory, never saved to disk',
            'Metadata including GPS stripped by default, with a switch to keep it',
            'Batch compression of up to 25 files on paid plans'
        ],
        softwareRequirements: 'Modern Web Browser'
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };

    const encoderRows = [
        {
            enc: 'jpegli (this page)',
            highlight: true,
            bytes: 'About 20% fewer bits than MozJPEG and 26% fewer than libjpeg-turbo at high quality',
            compat: 'Universal',
            best: 'Photos that must stay JPEG, high-quality exports'
        },
        {
            enc: 'MozJPEG',
            highlight: false,
            bytes: 'Better than libjpeg-turbo, close to jpegli at medium quality',
            compat: 'Universal',
            best: 'General web delivery, most optimization plugins'
        },
        {
            enc: 'libjpeg-turbo',
            highlight: false,
            bytes: 'The baseline',
            compat: 'Universal',
            best: 'Speed above all, the default in most software'
        }
    ];
</script>

<svelte:head>
    <title>Compress JPEG with jpegli - Smaller JPGs, Same Format | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-matcha text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Still a Standard JPG
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-amber text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    Google jpegli
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-cocoa-ink tracking-tight">
                Compress JPEG with
                <span class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent">
                    jpegli
                </span>
            </h1>

            <p class="text-lg text-cocoa-deep font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Drop JPEG photos here and get smaller JPEGs back, re-encoded at quality 85 with Google's <strong class="text-[#7E685E]">jpegli</strong> encoder. The output is still a standard .jpg, so it works in every app, marketplace and upload form that took the original. Up to 3 files a month with no signup and 20MB per file, or 25 a month with a free account. Files are processed in memory at api.mochify.app and wiped the moment your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload
                output="jpg"
                types=".JPG, .JPEG"
                showTypes={false}
                queryParams="quality=85"
                showExifOption={true}
                showDayPass={true}
                compact
            />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-cocoa-ink mb-6">How to compress a JPEG with jpegli</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Drop your JPEGs', d: 'Drag up to 3 files onto the box, or click it to choose them. No account is needed for your first files.' },
                    { n: '2', t: 'Keep or strip the metadata', d: 'A Strip EXIF switch appears once your files are in. It is on by default, which removes GPS and camera data; turn it off to keep them. There is nothing else to set.' },
                    { n: '3', t: 'Download', d: 'Each JPEG comes back in seconds. More than one file arrives as a single zip.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#F1F8F1] text-[#2E7D32] font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-bold text-cocoa-ink text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-cocoa-deep leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-cocoa-ink">Smaller JPEGs without changing format</h2>
                        <p class="leading-relaxed text-cocoa-deep">
                            Plenty of places only take JPEG: eBay and Etsy listings, older content management systems, print portals, job and government forms. Switching to WebP or AVIF is not an option there, so the only way to a smaller file is a better JPEG encoder. Jpegli is that encoder. It applies adaptive quantization from JPEG XL to put bits where they show, and writes a file fully compliant with the JPEG standard.
                        </p>
                        <p class="leading-relaxed text-cocoa-deep">
                            Mochify outputs standard JPEG files, encoded with Google's jpegli library for better efficiency at high quality settings, so you get the same interoperable JPEG format with fewer wasted bytes. Nobody downstream needs new software, and nothing about how the file is opened, uploaded or printed changes.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-cocoa-ink">When recompressing helps, and when it does not</h2>
                        <p class="leading-relaxed text-cocoa-deep">
                            The biggest savings come from JPEGs saved at high quality: straight out of a camera or phone, or exported from Lightroom or Photoshop at 90 and above. Those files carry bytes that a quality-85 jpegli encode can drop without a visible change. A JPEG that was already heavily compressed has little left to give, and may come back about the same size or slightly larger; keep the original when that happens.
                        </p>
                        <p class="leading-relaxed text-cocoa-deep">
                            Recompressing is a new lossy encode, so run each photo through once rather than repeatedly, and keep your originals if you might edit them later. Our <a href="/guides/jpeg-in-2026-jpegli" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">jpegli vs MozJPEG guide</a> covers the numbers and the trade-offs, and <a href="/guides/jpegli-shopify-product-images" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">jpegli for Shopify product images</a> applies them to a store.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-cocoa-ink mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Encoder comparison -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-cocoa-ink mb-6">jpegli, MozJPEG or libjpeg-turbo?</h2>
            <div class="overflow-x-auto rounded-2xl border border-pink-50 shadow-sm">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-mochi-blush">
                            <th class="text-left px-5 py-4 text-cocoa-milk font-black text-xs uppercase tracking-wider border-b border-pink-50">Encoder</th>
                            <th class="text-left px-5 py-4 text-cocoa-milk font-black text-xs uppercase tracking-wider border-b border-pink-50">Quality per byte</th>
                            <th class="text-left px-5 py-4 text-cocoa-milk font-black text-xs uppercase tracking-wider border-b border-pink-50">Opens in</th>
                            <th class="text-left px-5 py-4 text-cocoa-milk font-black text-xs uppercase tracking-wider border-b border-pink-50">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each encoderRows as row, i}
                            <tr class={row.highlight ? 'bg-[#F1F8F1]' : i % 2 === 0 ? 'bg-white' : 'bg-mochi-bg'}>
                                <td class="px-5 py-3.5 font-black text-cocoa-ink border-b border-pink-50">{row.enc}</td>
                                <td class="px-5 py-3.5 text-cocoa-deep border-b border-pink-50">{row.bytes}</td>
                                <td class="px-5 py-3.5 text-cocoa-deep border-b border-pink-50">{row.compat}</td>
                                <td class="px-5 py-3.5 text-cocoa-deep border-b border-pink-50">{row.best}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <p class="mt-4 text-sm text-cocoa-milk">
                Figures from Google's rater study at high quality on photographs. At medium quality the encoders are close and MozJPEG wins on some images.
            </p>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Bulk, batch and automated JPEG compression</h2>
            <p class="leading-relaxed text-cocoa-deep">
                Seller and Pro accounts compress up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same encode runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">mochify auth login</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;quality=85" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.jpg \
  -o photo-small.jpg</code></pre>
            <p class="leading-relaxed text-cocoa-deep">
                Every route encodes at api.mochify.app in memory and keeps nothing. Full parameter reference in the <a href="/docs" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">API documentation</a>. Need the file under a size limit rather than at a quality? Add <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">&amp;targetBytes=</code> with a ceiling in bytes and the API measures its way under it.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-cocoa-milk uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/jpg-to-jpegxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JPG to JXL →</p>
                        <p class="text-xs text-cocoa-milk">Smaller still, if the viewer reads JPEG XL</p>
                    </div>
                </a>
                <a href="/solutions/webp-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">WebP to JPG →</p>
                        <p class="text-xs text-cocoa-milk">Turn saved .webp images into jpegli JPEGs</p>
                    </div>
                </a>
                <a href="/solutions/ebay-image-converter" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">eBay Image Converter →</p>
                        <p class="text-xs text-cocoa-milk">Resize and convert for eBay listings</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
