<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Remove the background from an AVIF, JPG, PNG, WebP or HEIC image and download a transparent AVIF, usually the smallest transparent format. Free, no signup.';

    const useCases = [
        'Ecommerce product shots on a clean background',
        'Hero images and cut-outs for your own site',
        'Profile pictures and team avatars',
        'Stickers, emotes & Discord assets',
        'Logos and product cutouts for decks',
        'Hero graphics and Open Graph images'
    ];

    const formatRows = [
        { fmt: 'AVIF', alpha: 'Yes', size: 'Usually the smallest', best: 'Modern sites with a fallback' },
        { fmt: 'WebP', alpha: 'Yes', size: 'Small', best: 'The widest support for a transparent file on the web' },
        { fmt: 'PNG', alpha: 'Yes', size: 'Large', best: 'Print, archive masters, older editors' },
        { fmt: 'JPEG', alpha: 'No', size: 'Small', best: 'Not for cut-outs: the background is flattened' }
    ];

    const faqs: FaqItem[] = [
        {
            q: 'Is the AVIF background remover free?',
            a: 'Yes. Background removal is included on every plan, including Free. Process 3 images a month with no signup, or 25 a month with a free account, at up to 20MB per file and 3 per batch. A $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans take 25 files per batch at up to 75MB each.'
        },
        {
            q: 'Can AVIF files be transparent?',
            a: 'Yes. AVIF carries a full alpha channel, stored as a second image inside the file, so soft edges and shadows survive. The file this page returns has the removed background as that alpha channel. If it appears on black or white somewhere, the app showing it cannot read AVIF transparency, or the site re-encoded it.'
        },
        {
            q: 'Can I upload an AVIF file?',
            a: 'Yes. Drop the .avif in directly; it does not need converting first. JPG, PNG, WebP, HEIC, HEIF and HIF files are accepted too, and every cut-out comes back as a transparent AVIF.'
        },
        {
            q: 'Should I use AVIF or WebP for a cut-out?',
            a: 'AVIF is usually the smaller file; WebP opens in more apps and tools. For a website that can serve a fallback, AVIF. For anything going into an editor, a CMS you have not tested, or a document, WebP is the safer choice, and the WebP background remover does the same cut-out.'
        },
        {
            q: 'Can I get a white background instead of a transparent one?',
            a: 'Not on this page, which always returns transparency. Use Magic Flow in the web app and ask for it, for example "remove the background and put it on a white background", and you get the flattened image in any format you name. It works on every plan.'
        },
        {
            q: 'What photos work best?',
            a: 'Photos with one clear subject, such as a product, a person or an object, give the cleanest edges. Busy scenes with no obvious foreground, or a subject that matches its background, are harder and get a best estimate, so check those results.'
        },
        {
            q: 'Can I remove backgrounds from many images at once?',
            a: 'Yes. Free and no-signup batches are 3 files; Seller, Pro and the Day Pass take 25 per batch. For larger jobs, call the REST API with removeBackground=true and type=avif, or run it from an AI agent through the Mochify MCP server.'
        },
        {
            q: 'Do you keep my photos?',
            a: 'No. They travel over HTTPS to api.mochify.app, are processed in memory and discarded. Nothing is written to disk, nothing containing your files is logged, and nothing is used to train AI. Metadata, including GPS location, is stripped by default; to keep it, use the web app\'s Strip EXIF switch or stripExif=false on the API.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify AVIF Background Remover',
        url: 'https://mochify.app/solutions/remove-background-avif',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Editor',
        operatingSystem: 'Web',
        description: metaDescription,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        featureList: [
            'Remove the background from a photo and download a transparent AVIF',
            'Full alpha channel in the AVIF output',
            'Accepts AVIF, JPG, PNG, WebP, HEIC, HEIF and HIF',
            'Background removal on every plan, including Free',
            'Up to 3 files with no signup; 25 per batch on paid plans',
            'REST API and MCP server for automated background removal',
            'Files processed in memory and never saved to disk; metadata including GPS stripped by default'
        ],
        provider: { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' },
        softwareRequirements: 'Modern Web Browser'
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>AVIF Background Remover - Transparent AVIF, Free | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="AVIF Background Remover - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="AVIF Background Remover - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    AI Background Removal
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F0FDF4] border border-green-100 shadow-sm text-green-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    Transparent AVIF
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    AVIF
                </span>
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    Background
                </span>
                Remover
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Remove the background from a photo and download the cut-out as a transparent AVIF in one step. It takes AVIF files as they are, along with JPG, PNG, WebP, HEIC, HEIF and HIF, and writes the subject on a full alpha channel in the format that usually produces the smallest transparent file. Three images with no signup, 25 a month with a free account, processed in memory and never saved to disk.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="avif" queryParams="removeBackground=true" types=".JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF" showTypes={true} showExifOption={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to remove the background from an AVIF image</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop the file in</strong> as it is: an .avif, or a JPG, PNG, WebP, HEIC, HEIF or HIF. Up to 3 per batch with no signup or a free account, 25 on Seller and Pro.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">The background is removed</strong> from each image and the subject is written out as an AVIF with a full alpha channel. There are no settings: one output, a transparent AVIF.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download the cut-outs.</strong> Nothing was converted to PNG along the way, so there is no second step.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Got an AVIF you cannot edit?</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        AVIF often arrives by accident. More sites serve it, saving an image from the browser then gives you an .avif, and plenty of software still will not open one. Windows 11 needs a Microsoft Store extension for AVIF previews in some setups, and many background removers either refuse the file or hand back a PNG. This page reads the .avif directly and returns an .avif. If what you actually need is a JPG copy, <a href="/avif-to-jpg" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">AVIF to JPG</a> does that, and <a href="/guides/what-is-an-avif-file" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">What is an AVIF file?</a> explains where they come from.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                    <ul class="space-y-3">
                        {#each useCases as item}
                            <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                <span class="w-2 h-2 rounded-full bg-[#C4B5FD] flex-shrink-0"></span> {item}
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Why AVIF for a cut-out</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        AVIF stores transparency as a second, grayscale AV1 image inside the same file (<a href="https://aomediacodec.github.io/av1-avif/v1.2.0.html" target="_blank" rel="noopener noreferrer" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">AVIF specification</a>), so the transparency is compressed with the same tools as the picture itself. On cut-outs with large transparent or soft-edged areas, that usually makes AVIF the smallest transparent option, smaller than WebP and far smaller than PNG. The gain depends on the image, so read it as usually, not always. The trade is reach: AVIF works in every current major browser, but older apps and some image libraries still show a transparent AVIF on black.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Where a transparent AVIF works</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        On the web, serve it inside a <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">&lt;picture&gt;</code> element with a WebP or PNG fallback, and every current browser picks the smallest file it can display (<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">browser support</a>). Outside the browser, support is thinner: some viewers and thumbnail generators do not read the alpha channel, and marketplaces generally re-encode uploads as JPEG, which flattens any transparency. For a listing, use the <a href="/solutions/remove-background-webp" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">WebP background remover</a> or ask Magic Flow in the <a href="/flow" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">web app</a> to "remove the background and put it on a white background". If a cut-out turns black or white somewhere, <a href="/guides/webp-avif-transparency" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Do WebP and AVIF support transparency?</a> covers the causes.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Removing a background on Windows, Mac or iPhone</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                The built-in tools work on one image at a time and none of them writes a transparent AVIF: Paint's Remove background on Windows 11 saves the cut-out as PNG, Preview's Remove Background on a Mac converts the image to PNG, and lifting a subject in iPhone Photos gives you a copied cut-out. Turning any of those into an AVIF is a separate conversion. This page does it in one step, for a batch, and accepts the AVIF those tools may not open.
            </p>
        </section>

        <!-- Format comparison -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">Transparent cutout: choosing the right format</h2>
            <div class="overflow-x-auto rounded-2xl border border-pink-50 shadow-sm">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Format</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Transparency</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">File size</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each formatRows as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-5 py-3.5 font-black text-[#4A2C2C] border-b border-pink-50">{row.fmt}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.alpha}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.size}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.best}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Bulk and automated background removal</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Background removal is included on every plan, Free and the Day Pass too. Seller and Pro accounts process up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. From an AI agent, use the hosted or local MCP server; from code, the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?removeBackground=true&amp;type=avif" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @product.avif \
  -o product-cutout.avif</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Files travel over HTTPS to api.mochify.app, are processed in memory and discarded. Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">Frequently asked questions</h2>
            <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP Background Remover →</p>
                        <p class="text-xs text-[#875F42]">Same cut-out as a transparent WebP</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0 border border-green-100">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to AVIF →</p>
                        <p class="text-xs text-[#875F42]">Rasterize vector assets to AVIF with transparency</p>
                    </div>
                </a>
                <a href="/guides/webp-avif-transparency" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Do WebP and AVIF support transparency? →</p>
                        <p class="text-xs text-[#875F42]">Why a cut-out sometimes turns up on white</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
