<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Convert SVG logos and icons to PNG at the size you need, pixel-exact with transparency kept. Free, no signup, processed in memory.";

    const faqs: FaqItem[] = [
        {
            q: "Is this SVG to PNG converter free?",
            a: "Yes. Without an account you can convert 3 images a month, and a free account gives you 25 a month, up to 3 at a time. A paid plan or a $2 Day Pass takes batches of 25; the pricing page has the details."
        },
        {
            q: "Does PNG keep my SVG's transparency?",
            a: "Yes. PNG has a full alpha channel, so transparent areas stay transparent and semi-transparent fills keep their opacity. No white background is added."
        },
        {
            q: "What size will my PNG be?",
            a: "With Original, the size your SVG declares: a 300 x 150 SVG becomes a 300 x 150 PNG. Pick 512, 1024, 1200, 2048 or 4096 and that becomes the long edge, with the other side in proportion."
        },
        {
            q: "Will a large size look blurry?",
            a: "No. The vector is drawn at the size you pick, so a logo at 4096 pixels has edges as clean as at 512. Nothing is stretched from a smaller image."
        },
        {
            q: "Is the PNG lossless?",
            a: "Yes, always. PNG has no quality setting: every pixel of the rendered SVG is stored exactly, so flat colors and hard edges come through untouched."
        },
        {
            q: "Why is my PNG bigger than my SVG?",
            a: "An SVG stores drawing instructions; a PNG stores every pixel. A simple logo can be a few kilobytes as an SVG and much more as a large PNG, and the bigger the size you pick, the bigger the file. If file size matters more than compatibility, SVG to WebP or SVG to AVIF give smaller files with transparency kept."
        },
        {
            q: "Why did the font in my logo change?",
            a: "Web fonts that the SVG loads by URL are not fetched, so live text falls back to a default font. Convert the text to outlines before exporting: in Inkscape, Path > Object to Path; in Illustrator, Type > Create Outlines."
        },
        {
            q: "Why is an image missing from my PNG?",
            a: "Images that the SVG links to by URL are not fetched and are left out. Embed the image in the SVG instead of linking it (most editors offer both), then convert again."
        },
        {
            q: "What happens to my files?",
            a: "Your SVG is sent to api.mochify.app, rendered and encoded in memory, and discarded once the PNG is returned. Nothing is written to disk, no logs contain your file data, and your files are never used to train AI."
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: "SVG to PNG Converter",
        description: metaDescription,
        url: "https://mochify.app/solutions/svg-to-png",
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' }
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };

    const linkClass = 'font-bold text-[#F06292] hover:text-[#D81B60] transition-colors';
    const codeClass = 'px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm';
</script>

<svelte:head>
    <title>SVG to PNG Converter - Free, Keeps Transparency | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="SVG to PNG Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="SVG to PNG Converter - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    Design Assets
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F0FDF4] border border-green-100 shadow-sm text-green-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Transparency Preserved
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    SVG
                </span>
                to
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    PNG
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Rasterize SVG files to pixel-exact PNG at the size you need, with transparency intact.
            </p>
        </div>

        <div class="mb-12">
            <ImageUpload output="png" types=".SVG" showTypes={true} showExifOption={false} resizeOptions={[512, 1024, 1200, 2048, 4096]} resizeOptionsLabel="Long edge" compact />
        </div>

        <section class="mt-4 max-w-4xl mx-auto space-y-4">
            <p class="leading-relaxed text-[#6C3F31]">Drop SVG files here and get PNG images back, with transparent areas still transparent. Keep the size your SVG declares or pick a long edge from 512 to 4096 pixels: the vector is drawn at that size, so edges stay sharp however large you go. PNG is lossless, so every pixel of the rendered SVG is kept exactly. The conversion runs in memory at api.mochify.app and nothing is saved to disk.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">How to convert SVG to PNG</h2>
            <ol class="list-decimal space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Pick a size.</strong> Original keeps the size your SVG declares: its width and height, or its viewBox when those are missing. Or choose a long edge of 512, 1024, 1200, 2048 or 4096 pixels, and the other side follows the SVG's proportions.</li>
                <li><strong class="text-[#4A2C2C]">Drop your SVGs.</strong> Up to 3 at a time on the free plan, 25 on a paid plan.</li>
                <li><strong class="text-[#4A2C2C]">Download your PNG files.</strong> Transparent areas stay transparent, so a logo sits cleanly on a light or a dark background.</li>
            </ol>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Which size to pick</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Original:</strong> you already set the size in your editor.</li>
                <li><strong class="text-[#4A2C2C]">512 px:</strong> app icons, favicons and avatars.</li>
                <li><strong class="text-[#4A2C2C]">1024 px:</strong> logos and graphics on web pages, sharp on high-density screens.</li>
                <li><strong class="text-[#4A2C2C]">1200 px:</strong> social link previews; 1200 pixels is the usual width for an Open Graph image.</li>
                <li><strong class="text-[#4A2C2C]">2048 px:</strong> hero graphics and slides.</li>
                <li><strong class="text-[#4A2C2C]">4096 px:</strong> print and high-resolution masters.</li>
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">Because the vector is redrawn at the size you pick, nothing is stretched from a smaller image, and 4096 is as crisp as 512. A PNG cannot be enlarged later without going soft, so pick the largest size you will need.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">What happens to your SVG</h2>
            <p class="leading-relaxed text-[#6C3F31]">An SVG is a set of drawing instructions; a PNG is a grid of pixels. Turning one into the other fixes the size and flattens anything that depended on a browser at display time:</p>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Size:</strong> the long edge you pick, or with Original the SVG's width and height (or its viewBox when those are missing). A file with none of the three has no size to work from, so add a viewBox or a width and height first.</li>
                <li><strong class="text-[#4A2C2C]">Transparency:</strong> kept. Transparent areas stay transparent and semi-transparent fills keep their opacity.</li>
                <li><strong class="text-[#4A2C2C]">Pixels:</strong> stored exactly. PNG is lossless, so there is no quality setting and nothing is smoothed away.</li>
                <li><strong class="text-[#4A2C2C]">Text:</strong> rendered, but web fonts linked by URL are not fetched, so live text falls back to a default font. Convert text to outlines before you export if the typeface matters, which for a logo it always does.</li>
                <li><strong class="text-[#4A2C2C]">Linked images:</strong> an image the SVG loads from a URL is dropped without warning. Images embedded in the file render.</li>
                <li><strong class="text-[#4A2C2C]">Animation:</strong> ignored. You get the SVG as it looks before anything moves.</li>
            </ul>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">When a PNG copy of an SVG is the right call</h2>
            <p class="leading-relaxed text-[#6C3F31]">Keep the SVG wherever it is accepted: on your own site it stays sharp at every size and is usually the smaller file. Make a raster copy for the places that refuse or strip SVG, such as WordPress without a plugin, many marketplaces and social link previews. Our <a href="/guides/svg-conversion-guide-vector-vs-raster" class={linkClass}>SVG conversion guide</a> walks through the decision platform by platform.</p>
            <p class="leading-relaxed text-[#6C3F31]">Pick PNG when the copy has to open anywhere: email signatures, slide decks, documents, marketplace uploads and older software all take PNG, and it keeps transparency where JPEG cannot. The trade-off is size. For a page on your own site, the <a href="/solutions/svg-to-webp" class={linkClass}>SVG to WebP</a> and <a href="/solutions/svg-to-avif" class={linkClass}>SVG to AVIF</a> converters keep transparency in a much smaller file.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting SVG to PNG without a converter</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Inkscape</strong> (free, Windows, Mac and Linux): File > Export, choose PNG in the Export dialog, set the DPI or pixel size, and export.</li>
                <li><strong class="text-[#4A2C2C]">Figma:</strong> select the frame or layer, add a PNG export in the Export panel at the scale you need, and export.</li>
                <li>A browser screenshot is not a route: it captures the screen at display resolution and bakes in the background.</li>
            </ul>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-[#6C3F31]">Without an account you can convert 3 images a month; a free account gives you 25 a month, up to 3 at a time, 20MB each. Paid plans (Seller, Pro and Growth) take batches of 25 and files up to 75MB, and a $2 Day Pass gives 100 uploads over 24 hours with no account. The <a href="/pricing" class={linkClass}>pricing page</a> has the plans.</p>
            <p class="leading-relaxed text-[#6C3F31]">The same conversion works through the REST API on every plan, Free included. Send the raw SVG to <code class={codeClass}>POST /v1/squish</code>; full reference in the <a href="/docs" class={linkClass}>API documentation</a>:</p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=png&amp;width=1200" \
  -H "Content-Type: image/svg+xml" \
  -H "Authorization: Bearer $MOCHIFY_API_KEY" \
  --data-binary @logo.svg \
  --output logo.png</code></pre>
            <p class="leading-relaxed text-[#6C3F31]"><code class={codeClass}>width</code> sets the output width in pixels and the vector is drawn at that width; leave it out to keep the SVG's own size.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
            <FaqAccordion {faqs} />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/svg-to-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0 border border-green-100">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to WebP →</p>
                        <p class="text-xs text-[#875F42]">Transparency kept in a much smaller file, for websites</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to AVIF →</p>
                        <p class="text-xs text-[#875F42]">Usually the smallest file, for modern websites</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
