<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Remove the background from any photo and download a transparent WebP, not a PNG you have to convert again. JPG, PNG, WebP, AVIF and HEIC in. Free, no signup, processed in memory and never saved to disk.';

    const useCases = [
        'Ecommerce product shots on a clean background',
        'Product shots for your own store',
        'Profile pictures and team avatars',
        'Stickers, emotes & Discord assets',
        'Logos and product cutouts for decks',
        'Hero graphics and Open Graph images'
    ];

    const formatRows = [
        { fmt: 'WebP', alpha: 'Yes', size: 'Small', best: 'Websites, CMSes, design tools: the default for a cut-out' },
        { fmt: 'AVIF', alpha: 'Yes', size: 'Usually the smallest', best: 'Modern sites with a WebP or PNG fallback' },
        { fmt: 'PNG', alpha: 'Yes', size: 'Large', best: 'Print, archive masters, older editors' },
        { fmt: 'JPEG', alpha: 'No', size: 'Small', best: 'Not for cut-outs: the background is flattened' }
    ];

    const faqs: FaqItem[] = [
        {
            q: 'Is the WebP background remover free?',
            a: 'Yes. Background removal is included on every plan, including Free. Process 3 images a month with no signup, or 25 a month with a free account, at up to 20MB per file and 3 per batch. A $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans take 25 files per batch at up to 75MB each.'
        },
        {
            q: 'Can a WebP have a transparent background?',
            a: 'Yes. WebP stores a full alpha channel, like PNG, so a cut-out keeps soft edges and sits on whatever is behind it. The file this page returns has the removed background as that alpha channel, with no white box added. If it shows up on white or black somewhere else, the site or app it passed through flattened it, usually by re-encoding it as a JPEG.'
        },
        {
            q: 'Can I remove the background from a WebP file?',
            a: 'Yes. Drop the .webp in as it is. WebP, AVIF, JPG, PNG, HEIC, HEIF and HIF files are all accepted, and the cut-out comes back as a transparent WebP, so there is no conversion to PNG on the way in or the way out.'
        },
        {
            q: 'Why WebP instead of PNG for a cut-out?',
            a: 'Size. Google puts lossless WebP at 26% smaller than PNG, with the same per-pixel transparency, and every current browser displays it. PNG is still the right choice for print, for an archive master, or for an editor that cannot open WebP.'
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
            a: 'Yes. Free and no-signup batches are 3 files; Seller, Pro and the Day Pass take 25 per batch. For a whole catalog, the REST API takes removeBackground=true with type=webp on each call, and an AI agent can run it through the Mochify MCP server.'
        },
        {
            q: 'Do you keep my photos?',
            a: 'No. They travel over HTTPS to api.mochify.app, are processed in memory and discarded. Nothing is written to disk, nothing containing your files is logged, and nothing is used to train AI. Metadata, including GPS location, is stripped by default; to keep it, use the web app\'s Strip EXIF switch or stripExif=false on the API.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify WebP Background Remover',
        url: 'https://mochify.app/solutions/remove-background-webp',
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
            'Remove the background from a photo and download a transparent WebP',
            'Full alpha channel in the WebP output',
            'Accepts JPG, PNG, WebP, AVIF, HEIC, HEIF and HIF',
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
    <title>WebP Background Remover - Transparent WebP in One Step | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="WebP Background Remover - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="WebP Background Remover - Mochify" />
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
                    Transparent WebP
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    WebP
                </span>
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    Background
                </span>
                Remover
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Remove the background from a photo and download the cut-out as a transparent WebP in one step. Drop in a JPG, PNG, WebP, AVIF, HEIC, HEIF or HIF file. The subject comes back on a full alpha channel, in a format that is smaller than PNG and opens in every current browser. Three images with no signup, 25 a month with a free account, processed in memory and never saved to disk.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="webp" queryParams="removeBackground=true" types=".JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF" showTypes={true} showExifOption={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to remove the background from an image and keep it as WebP</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop your images</strong> into the box above, or click browse. JPG, PNG, WebP, AVIF, HEIC, HEIF and HIF files all work, mixed in one batch: up to 3 at a time with no signup or a free account, 25 on Seller and Pro.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">The background is removed</strong> from each image separately and the subject is written out as a WebP with a full alpha channel. There is nothing to choose: one output, a transparent WebP.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download the cut-outs</strong> and drop them into your site, deck or design tool.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Why a WebP, not a PNG</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Many background removers accept a WebP but hand you back a PNG, so keeping the format you started with takes a second conversion. PNG keeps transparency but is the heavy option: Google's figure is that lossless WebP files are 26% smaller than PNGs (<a href="https://developers.google.com/speed/webp/faq" target="_blank" rel="noopener noreferrer" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">WebP FAQ</a>). WebP keeps the same per-pixel alpha, so soft edges and shadows survive. JPEG cannot store transparency at all, which is why a cut-out saved as JPEG always comes back on a solid color. For a product shot, a sticker, an avatar or a hero graphic bound for a website, WebP is the practical default. Keep a PNG when the next stop is print or an editor that cannot open WebP.
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
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">What gives the cleanest cut-out</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Background removal works best when the subject is obvious: a product on a table, a person against a wall, an object with clear edges. A busy scene with no clear foreground, or a subject the same color as what is behind it, is harder, and the result is a best estimate, so check those before you publish. Frame the shot so the subject fills most of it. More subject pixels give a cleaner edge.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Where a transparent WebP works, and where it gets flattened</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Every current browser shows WebP transparency as intended, and WordPress has accepted WebP uploads since version 5.8. Marketplaces are different: many re-encode uploads as JPEG, and a JPEG has no alpha channel, so the background comes back white or black whatever you uploaded. For a listing, a solid white background is usually what you want, and eBay's own advice is that white backgrounds are generally best. Ask Magic Flow in the <a href="/flow" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">web app</a> to "remove the background and put it on a white background" and you get the flattened image in whichever format you name. When a transparent file turns black or white somewhere else, <a href="/guides/webp-avif-transparency" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Do WebP and AVIF support transparency?</a> walks through every cause and how to check the file.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Removing a background on Windows, Mac or iPhone</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                You can do it one image at a time with what is already on your device, but none of the built-in routes saves the cut-out as a WebP. On Windows 11, Paint has a Remove background button; save the result as PNG to keep the transparency. On a Mac, Preview's Remove Background converts the image to PNG as it works. On iPhone, touch and hold the subject in Photos to lift it, then copy or share the cut-out. Each leaves you with a PNG or a copied image, so a WebP means a second conversion. This page does both steps at once, for a batch.
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
                Background removal is included on every plan, Free and the Day Pass too. Seller and Pro accounts process up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same cut-out runs from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?removeBackground=true&amp;type=webp" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @product.jpg \
  -o product.webp</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                The MCP server and the API are clients over the same engine as this page: files travel over HTTPS to api.mochify.app, are processed in memory and discarded. Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Need every cut-out square for a listing grid as well? The <a href="/solutions/bulk-ai-square-cropper" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">bulk square cropper</a> centers each crop on the subject.
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
                <a href="/solutions/svg-to-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to WebP →</p>
                        <p class="text-xs text-[#875F42]">Rasterize vector assets to WebP with transparency</p>
                    </div>
                </a>
                <a href="/solutions/remove-background-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0 border border-green-100">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">AVIF Background Remover →</p>
                        <p class="text-xs text-[#875F42]">Same cutout, the smallest transparent format</p>
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
