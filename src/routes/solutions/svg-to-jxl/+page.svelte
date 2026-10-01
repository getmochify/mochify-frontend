<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Convert SVG to JPEG XL (JXL), lossy or lossless, at the size you need, with transparency kept. Free, no signup, processed in memory.";

    const faqs: FaqItem[] = [
        {
            q: "Is this SVG to JPEG XL converter free?",
            a: "Yes. Without an account you can convert 3 images a month, and a free account gives you 25 a month, up to 3 at a time. A paid plan or a $2 Day Pass takes batches of 25; the pricing page has the details."
        },
        {
            q: "Is the JXL lossless?",
            a: "Only if you switch on Lossless. The default is a high-quality lossy JPEG XL, the smallest file; Lossless gives a pixel-exact JXL of the rendered SVG."
        },
        {
            q: "Does JPEG XL keep my SVG's transparency?",
            a: "Yes. JPEG XL has a full alpha channel, so transparent areas stay transparent."
        },
        {
            q: "Can I use JXL files on my website?",
            a: "With a fallback. Browser support is still uneven, so serve JXL inside a <picture> element with an AVIF or WebP alternative, or use AVIF or WebP on their own."
        },
        {
            q: "What size will my JXL be?",
            a: "With Original, the size your SVG declares: a 300 x 150 SVG becomes a 300 x 150 JXL. Pick 512, 1024, 1200, 2048 or 4096 and that becomes the long edge, with the other side in proportion."
        },
        {
            q: "Will a large size look blurry?",
            a: "No. The vector is drawn at the size you pick, so a 4096-pixel JXL has edges as clean as a small one. Nothing is stretched from a smaller image."
        },
        {
            q: "Why does the text look different?",
            a: "Web fonts that the SVG loads by URL are not fetched, so text falls back to a default font. Convert the text to outlines before exporting (Inkscape: Path > Object to Path; Illustrator: Type > Create Outlines)."
        },
        {
            q: "What happens to linked images and animation?",
            a: "Images linked by URL are left out, so embed them in the SVG first. Animation is ignored: the JXL is a still image of the SVG before anything moves."
        },
        {
            q: "What happens to my files?",
            a: "Your SVG is sent to api.mochify.app, rendered and encoded in memory, and discarded once the JXL is returned. Nothing is written to disk, no logs contain your file data, and your files are never used to train AI."
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: "SVG to JPEG XL Converter",
        description: "Convert SVG to JPEG XL (JXL), lossy or lossless, at the size you need, with transparency kept. Free, no signup, processed in memory.",
        url: "https://mochify.app/solutions/svg-to-jxl",
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
</script>

<svelte:head>
    <title>SVG to JPEG XL (JXL) Converter - Free, Online | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="SVG to JPEG XL Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />

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
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm text-amber-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    Next-Gen Format
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    SVG
                </span>
                to
                <span class="bg-gradient-to-r from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent">
                    JPEG XL
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Rasterize SVG files to JPEG XL, lossy or lossless, with transparency intact.
            </p>

            <!-- Browser support notice -->
            <div class="inline-flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 text-left max-w-xl mx-auto">
                <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                <p class="text-amber-800 text-sm font-medium m-0">
                    Browser support for JPEG XL is still uneven, so a JXL on a public page needs an AVIF or WebP fallback. Our <a href="/guides/chrome-145-jpeg-xl-default" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Chrome 145 explainer</a> has the current state.
                </p>
            </div>
        </div>

        <div class="mb-12">
            <ImageUpload output="jxl" types=".SVG" showTypes={true} showExifOption={false} resizeOptions={[512, 1024, 1200, 2048, 4096]} resizeOptionsLabel="Long edge" showLosslessOption={true} losslessDefault={false} compact />
        </div>

        <section class="mt-4 max-w-4xl mx-auto space-y-4">
            <p class="leading-relaxed text-[#6C3F31]">Drop SVG files here and get JPEG XL files back, with transparent areas still transparent. Keep the size your SVG declares or pick a long edge up to 4096 pixels; the vector is drawn at that size, so edges stay sharp. The conversion runs in memory at api.mochify.app and nothing is saved to disk.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">How to convert SVG to JPEG XL</h2>
            <ol class="list-decimal space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Pick a size.</strong> Original keeps the width and height your SVG declares (or its viewBox when those are missing). Or choose a long edge of 512, 1024, 1200, 2048 or 4096 pixels.</li>
                <li><strong class="text-[#4A2C2C]">Drop your SVGs.</strong> Up to 3 at a time on the free plan, 25 on a paid plan.</li>
                <li><strong class="text-[#4A2C2C]">Switch on Lossless for a pixel-exact file,</strong> then download your JXL files.</li>
            </ol>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Lossy or lossless</h2>
            <p class="leading-relaxed text-[#6C3F31]">By default this page makes a high-quality lossy JPEG XL, the smallest file, which is not pixel-exact. Switch on Lossless for a pixel-exact JXL of the rendered SVG; for flat-color graphics a lossless JXL is usually still smaller than the same image as a PNG (see <a href="/guides/jxl-vs-png-for-screenshots" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">JPEG XL vs PNG for screenshots</a>).</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">What the converter keeps and drops</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Kept:</strong> transparency; shapes, paths and text; images embedded in the file. Edges stay sharp at every size, because the vector is drawn at the size you pick.</li>
                <li><strong class="text-[#4A2C2C]">Dropped:</strong> web fonts loaded by URL (outline lettering first), images linked from a URL (left out without warning) and animation (the un-animated state is what you get).</li>
                <li><strong class="text-[#4A2C2C]">Size:</strong> the long edge you pick, or with Original the SVG's width and height, else its viewBox; a file with none of them has no size to work from, so add one first.</li>
            </ul>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">When JPEG XL makes sense for SVG artwork</h2>
            <p class="leading-relaxed text-[#6C3F31]">JPEG XL suits a raster master you keep alongside the SVG: an archive copy at 4096 pixels, a handoff to a team whose tools read JXL, or an asset pipeline that already supports it. For a live web page, AVIF or WebP is the safer first choice today. <a href="/guides/converting-images-to-jpeg-xl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Converting images to JPEG XL</a> covers where JXL opens and how to serve it with a fallback; <a href="/guides/what-is-a-jxl-file" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">What is a JXL file?</a> covers opening one.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting SVG to JPEG XL without a converter</h2>
            <p class="leading-relaxed text-[#6C3F31]">Neither Inkscape's Export dialog nor Figma's export panel offers JPEG XL. Export a PNG at the size you need, then encode it with libjxl's command-line tool: <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">cjxl logo.png logo.jxl -d 0</code> for lossless, or <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">-d 1</code> for a high-quality lossy file.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-[#6C3F31]">Without an account you can convert 3 images a month; a free account gives you 25 a month, up to 3 at a time, 20MB each. Paid plans (Seller, Pro and Growth) take batches of 25 and files up to 75MB, and a $2 Day Pass gives 100 uploads over 24 hours with no account. The <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">pricing page</a> has the plans.</p>
            <p class="leading-relaxed text-[#6C3F31]">Through the REST API, on every plan, Free included; full reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>:</p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jxl&amp;width=4096&amp;lossless=1" \
  -H "Content-Type: image/svg+xml" \
  -H "Authorization: Bearer $MOCHIFY_API_KEY" \
  --data-binary @logo.svg \
  --output logo.jxl</code></pre>
            <p class="leading-relaxed text-[#6C3F31]"><code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">width</code> sets the output width in pixels and the vector is drawn at that width; <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">lossless=1</code> makes the file pixel-exact. Leave either out for the defaults.</p>
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
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to WebP →</p>
                        <p class="text-xs text-[#875F42]">The most widely supported of the three</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0 border border-green-100">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to AVIF →</p>
                        <p class="text-xs text-[#875F42]">Usually smaller than WebP, for modern websites</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

