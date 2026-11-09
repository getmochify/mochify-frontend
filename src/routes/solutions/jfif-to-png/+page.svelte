<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Convert JFIF to PNG online, free: a high-quality PNG of your .jfif for apps and forms that ask for PNG, or for editing without recompression. No signup.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this JFIF to PNG converter free?',
            a: 'Yes. Convert up to 3 files at a time with no signup, or 25 a month with a free account, at up to 20MB per file. For a bigger folder, a $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans convert 25 files per batch.'
        },
        {
            q: 'What is a JFIF file?',
            a: 'A JPEG. JFIF (JPEG File Interchange Format) is the standard layout most JPEG files have always used, and Windows often gives JPEGs saved from a browser the .jfif extension. The picture inside is an ordinary JPEG.'
        },
        {
            q: 'Is the conversion lossless?',
            a: 'Yes. The PNG reproduces the decoded pixels of the JFIF exactly, and nothing is compressed away in the conversion. It cannot restore detail the JPEG compression already discarded, so the PNG looks exactly like the JFIF, no better and no worse.'
        },
        {
            q: 'Why is the PNG so much bigger than the JFIF?',
            a: [
                'Because PNG stores every pixel exactly, while a JPEG is lossy and far more compact. For a photo, a PNG several times the size of the JFIF is normal. If you only need the file to open in more places, ',
                { href: '/solutions/jfif-to-jpg', label: 'JFIF to JPG' },
                ' gives you a much smaller file.'
            ]
        },
        {
            q: 'Will the PNG have a transparent background?',
            a: 'No. A JFIF has no transparency, so the PNG keeps the same solid background the image already had. Converting to PNG does not cut anything out.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are converted in memory and discarded as soon as your download is ready. Nothing is written to disk and no logs contain your image data.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify JFIF to PNG Converter',
        url: 'https://mochify.app/solutions/jfif-to-png',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Converter',
        operatingSystem: 'Web',
        description: metaDescription,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        featureList: [
            'Convert JFIF to PNG in the browser',
            'Pixel-exact PNG output',
            'Up to 3 files with no signup',
            'Batch conversion of up to 25 files on paid plans and the Day Pass',
            'Processed in memory, never saved to disk'
        ],
        softwareRequirements: 'Modern Web Browser'
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>JFIF to PNG Converter - Free Online, High Quality | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-violet text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pixel for Pixel
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-cocoa-ink tracking-tight">
                <span class="bg-gradient-to-r from-[#FFB74D] to-[#F57C00] bg-clip-text text-transparent">
                    JFIF
                </span>
                to
                <span class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent">
                    PNG
                </span>
                Converter
            </h1>

            <p class="text-lg text-cocoa-deep font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Got a .jfif and need a PNG? Drop it here for a lossless PNG of the same image, ready for any app, form or editor that asks for PNG. No signup, nothing to install.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload types=".JFIF" output="png" showTypes={false} compact showExifOption={true} showDayPass={true} />
        </div>

        <section class="mt-10 max-w-4xl mx-auto">
            <h2 class="text-2xl font-extrabold text-cocoa-ink mb-6">How to convert JFIF to PNG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Drop your .jfif files</strong> in the box above, or click browse. Up to 3 files per batch with no signup or on a free account, and 25 per batch on a Day Pass or any paid plan. A whole folder to convert? A <a href="/pricing" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">$2 Day Pass</a> covers 100 uploads in 24 hours, no account needed.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Convert.</strong> Each file becomes a pixel-exact PNG. Metadata is removed by default; a Strip EXIF switch appears once your files are in if you want to keep it.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Download your PNGs.</strong> More than one file comes back as a single zip, ready for Canva, Photoshop, Figma, slides or any upload form.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-cocoa-ink">When PNG is the right choice</h2>
                        <p class="leading-relaxed text-cocoa-deep">
                            A JFIF is already a JPEG, so most of the time all it needs is a .jpg extension: <a href="/solutions/jfif-to-jpg" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">JFIF to JPG</a> does that and keeps the file small. Pick PNG when an app, template or upload form asks for PNG specifically, or when you will edit and save the image several times: a JPEG adds a little compression each time it is saved, and a PNG adds none.
                        </p>
                        <p class="leading-relaxed text-cocoa-deep">
                            Expect the PNG to be several times larger than the JFIF for a photo. That is the cost of storing every pixel exactly, and it is why the web serves photos as JPEG in the first place. Screenshots and graphics with flat color grow much less.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-cocoa-ink">Need a smaller PNG?</h2>
                        <p class="leading-relaxed text-cocoa-deep">
                            In the <a href="/flow" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">Mochify web app</a> you can type <span class="font-semibold">"convert to PNG and compress"</span> to get a reduced-palette PNG, or <span class="font-semibold">"PNG under 500kb"</span> to set a size limit. Graphics compress very well this way; photos can show banding, so keep those as JPG.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-cocoa-ink mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Bulk and automated JFIF to PNG</h2>
            <p class="leading-relaxed text-cocoa-deep">
                Seller and Pro accounts convert up to 25 files per batch at up to 75MB each. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">mochify *.jfif -p "convert to png"</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=png" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @image.jfif \
  -o image.png</code></pre>
            <p class="leading-relaxed text-cocoa-deep">
                Full parameter reference in the <a href="/docs" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">API documentation</a>.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-cocoa-milk uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/jfif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JFIF to JPG →</p>
                        <p class="text-xs text-cocoa-milk">Smaller files that open everywhere</p>
                    </div>
                </a>
                <a href="/solutions/webp-to-png" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">WebP to PNG →</p>
                        <p class="text-xs text-cocoa-milk">Keeps transparency</p>
                    </div>
                </a>
                <a href="/solutions/jpegli-compressor" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JPEG Compressor →</p>
                        <p class="text-xs text-cocoa-milk">Smaller JPEGs with jpegli</p>
                    </div>
                </a>
                <a href="/solutions/jfif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JFIF to PDF →</p>
                        <p class="text-xs text-cocoa-milk">Merge .jfif images into one PDF</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
