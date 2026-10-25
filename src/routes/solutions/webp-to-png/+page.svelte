<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Convert WebP to PNG online with transparency kept: logos, stickers and cut-outs come back see-through, pixel for pixel. Free, no signup, batch up to 25.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this WebP to PNG converter free?',
            a: 'Yes. Convert up to 3 files at a time with no signup, or 25 a month with a free account, at up to 20MB per file. For a bigger folder, a $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans convert 25 files per batch.'
        },
        {
            q: 'Does the PNG keep transparency?',
            a: 'Yes. The alpha channel is carried through, so transparent backgrounds and soft edges come back exactly as they were in the WebP.'
        },
        {
            q: 'Is the conversion lossless?',
            a: 'Yes. The PNG reproduces the pixels of the WebP exactly; nothing is compressed away in the conversion. It cannot restore detail a lossy WebP already discarded, so the PNG looks exactly like the WebP, no better and no worse.'
        },
        {
            q: 'Why is the PNG bigger than the WebP?',
            a: [
                'Because PNG stores every pixel exactly, while most WebPs are lossy and much more compact. A PNG several times the size of the WebP is normal, especially for photos. If you only need a photo to open everywhere and it has no transparency, ',
                { href: '/solutions/webp-to-jpg', label: 'WebP to JPG' },
                ' gives you a much smaller file.'
            ]
        },
        {
            q: 'Can I convert an animated WebP?',
            a: 'Only as a still: the first frame of an animated WebP becomes the PNG.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are converted in memory and discarded as soon as your download is ready. Nothing is written to disk and no logs contain your image data.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify WebP to PNG Converter',
        url: 'https://mochify.app/solutions/webp-to-png',
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
            'Convert WebP to PNG in the browser',
            'Transparency preserved',
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
    <title>WebP to PNG Converter - Keeps Transparency, Free | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="WebP to PNG Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-violet text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Transparency Kept
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-[#A5D6A7] to-[#43A047] bg-clip-text text-transparent">
                    WebP
                </span>
                to
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    PNG
                </span>
                Converter
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Turn .webp logos, stickers, icons and cut-outs into PNGs with the transparent background intact, pixel for pixel. No signup, nothing to install.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload types=".WEBP" output="png" showTypes={false} compact showExifOption={true} showDayPass={true} />
        </div>

        <section class="mt-10 max-w-4xl mx-auto">
            <h2 class="text-2xl font-extrabold text-[#4A2C2C] mb-6">How to convert WebP to PNG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop your .webp files</strong> in the box above, or click browse. Up to 3 files per batch with no signup or on a free account, and 25 per batch on a Day Pass or any paid plan. A whole folder to convert? A <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">$2 Day Pass</a> covers 100 uploads in 24 hours, no account needed.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Convert.</strong> There is nothing to set: each file becomes a pixel-exact PNG with its transparency kept. A Strip EXIF switch appears once your files are in if you want to keep embedded metadata.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download your PNGs.</strong> More than one file comes back as a single zip, ready for Canva, Photoshop, Figma, slides or any upload form.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">When PNG is the right choice</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Pick PNG when the image has a transparent background, sharp edges or text: logos, icons, stickers, product cut-outs, screenshots and graphics you will keep editing. PNG keeps every pixel and the alpha channel, and every design tool, office app and upload form accepts it.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            For an ordinary photo with no transparency, <a href="/solutions/webp-to-jpg" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">WebP to JPG</a> is usually the better trade: it opens just as widely in a much smaller file.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Need a smaller PNG?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            In the <a href="/flow" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Mochify web app</a> you can type <span class="font-semibold">"convert to PNG and compress"</span> to get a reduced-palette PNG, typically 4 to 5 times smaller, or <span class="font-semibold">"PNG under 500kb"</span> to set a size limit. Both keep transparency. Graphics compress very well this way; photos can show banding, so keep those as JPG.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Bulk and automated WebP to PNG</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Seller and Pro accounts convert up to 25 files per batch at up to 75MB each. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify *.webp -p "convert to png"</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=png" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @logo.webp \
  -o logo.png</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/webp-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP to JPG →</p>
                        <p class="text-xs text-[#875F42]">Smaller files for photos</p>
                    </div>
                </a>
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Remove background →</p>
                        <p class="text-xs text-[#875F42]">Make the background transparent first</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-png" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to PNG →</p>
                        <p class="text-xs text-[#875F42]">Logos and icons from vector files</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
