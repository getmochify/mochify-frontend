<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const ogDescription =
        "Convert Fuji, Canon and Sony HIF photos to 10-bit AVIF for your website. Free, camera metadata kept by default, processed in memory.";

    const faqs: FaqItem[] = [
        {
            q: "Is this HIF to AVIF converter free?",
            a: "Yes. Without an account you can convert 3 photos a month, and a free account gives you 25 a month, up to 3 at a time. A paid plan or a $2 Day Pass takes batches of 25; the pricing page has the details."
        },
        {
            q: "Do you see my photos?",
            a: "No. Your HIF is sent to api.mochify.app, converted in memory and discarded once the AVIF is returned. Nothing is written to disk, no logs contain your file data, and your photos are never used to train AI."
        },
        {
            q: "Does the AVIF keep 10-bit color?",
            a: "Yes. The AVIF is encoded with 10 bits per channel, like your HIF, so smooth gradients keep their fine tonal steps."
        },
        {
            q: "Will my HDR photos stay HDR?",
            a: [
                "No. The AVIF is a standard-range sRGB image, so an HIF recorded in an HDR mode (HLG or PQ) does not display as HDR after converting. If you want a photo that shows extra brightness on HDR screens and still opens as a normal photo everywhere, an Ultra HDR JPEG is the other route; ",
                { href: '/guides/how-to-make-any-photo-ultra-hdr', label: 'our guide to making a photo Ultra HDR' },
                " explains when to choose which."
            ]
        },
        {
            q: "Does this keep Fuji film simulations?",
            a: "Yes. The film simulation (Velvia, Classic Chrome and the rest) is part of the picture the camera saved, so it carries into the AVIF like the rest of the image. Mochify does not add or remove a look."
        },
        {
            q: "What about EXIF metadata?",
            a: "By default, we preserve all camera metadata (ISO, shutter speed, GPS). If you want to remove it for privacy, add your files and then switch on the \"Strip EXIF\" toggle before converting."
        },
        {
            q: "Should I use AVIF or JPG?",
            a: "AVIF for photos on your own website: smaller files at the same quality, in every current browser. JPG for anything you send to someone else, print or upload elsewhere. The HIF to JPG converter on this site does that conversion."
        },
        {
            q: "Which browsers open AVIF?",
            a: "Current versions of Chrome, Edge, Firefox and Safari all display AVIF. For older browsers, serve a JPEG fallback with the HTML <picture> element."
        },
        {
            q: "Can I convert iPhone HEIC photos here?",
            a: "This page is built for the HIF files that Canon, Sony and Fujifilm cameras write. iPhone photos are HEIC; for those, use the HEIC to JPG converter."
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'HIF to AVIF Converter',
        description: ogDescription,
        url: 'https://mochify.app/solutions/hif-to-avif',
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
    <title>Convert HIF to AVIF Online (Fuji/Canon) - Free | Mochify</title>
    <meta name="description" content="Convert Fuji, Canon & Sony HIF photos to AVIF instantly. Perfect for photographers using X-T5, R5, or Sony Alpha. Free, secure, and runs in-memory.">
    <meta property="og:title" content="HIF to AVIF Converter - Mochify">
    <meta property="og:description" content={ogDescription} />
    <meta name="twitter:title" content="HIF to AVIF Converter - Mochify" />
    <meta name="twitter:description" content={ogDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">
        
        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Photographer Friendly
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert 
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    HIF
                </span> 
                to 
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    AVIF
                </span>
            </h1>
            
            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn 10-bit Fuji, Canon and Sony HIF photos into 10-bit AVIFs that open in every current browser.
            </p>
        </div>

        <div class="mb-16">
            <!-- quality goes in queryParams, NOT as a prop: ImageUpload takes no
                 `quality`/`showQuality`, so the `quality={90}` that used to sit here
                 was silently dropped and this page ran at core's AVIF default of 60.
                 72 rather than the 85 used on the JPEG pages: an explicit quality
                 overwrites both scales with one number, and AVIF's is not JPEG's.
                 72 lands about where JPEG 85 does perceptually while keeping the
                 size advantage that is the reason to pick AVIF at all. -->
            <ImageUpload types=".HEIF, .HIF" output="avif" showTypes={false} compact queryParams="photography=1&quality=72" showExifOption={true} stripExifDefault={false} />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert HIF to AVIF?</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        HIF is the HEIF file that Canon, Sony and Fujifilm cameras write, with 10 bits per color channel. The files are small and detailed, but most web browsers and a lot of editing software will not open them.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        AVIF compresses about as well as HEIF and opens in every current major browser, so it is a natural format for photos on your own website. Mochify keeps the 10 bits per channel, which gives finer tonal steps in skies and other smooth gradients than an 8-bit JPEG. The AVIF is a standard-range image: if your camera saved the HIF in an HDR mode (HLG or PQ), that HDR signal is not carried over.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Supported Camera Models</h3>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {#each ['Fuji X-T5 / X-H2', 'Fuji X100VI', 'Canon EOS R5 / R6', 'Canon R3 / 1D X', 'Sony A7 IV / RV', 'Sony Alpha 1'] as camera}
                            <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                <span class="w-2 h-2 rounded-full bg-[#81C784]"></span> {camera}
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">How to convert HIF to AVIF</h2>
            <ol class="list-decimal space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li>Drop your .HIF or .HEIF files on the box above, or click to choose them.</li>
                <li>Leave Strip EXIF off to keep your camera settings in the file, or switch it on to remove them (location included).</li>
                <li>Convert, then download your AVIFs.</li>
            </ol>
            <p class="leading-relaxed text-[#6C3F31]">The free plan converts up to 3 photos at a time, 20MB each.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">What you get</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">10-bit AVIF</strong> at the same pixel dimensions as your HIF. Nothing is cropped or resized.</li>
                <li><strong class="text-[#4A2C2C]">Your camera metadata</strong> (ISO, shutter speed, lens, GPS) is kept by default. Switch on Strip EXIF before converting to remove it.</li>
                <li><strong class="text-[#4A2C2C]">Standard dynamic range.</strong> The AVIF is tagged as a standard sRGB image. HIF files recorded in an HDR mode (for example Canon's HDR PQ setting, or HLG stills on Sony cameras) do not come out as HDR AVIFs, and they may not look exactly as they did on the camera's screen.</li>
                <li><strong class="text-[#4A2C2C]">Your film look.</strong> A Fujifilm film simulation is part of the picture the camera saved, so it carries over like the rest of the image. Mochify does not add or remove a look.</li>
            </ul>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">AVIF or JPG?</h2>
            <p class="leading-relaxed text-[#6C3F31]">Choose AVIF for photos on your own website or portfolio: smaller files than JPEG at the same visual quality, in every current major browser. Choose JPG when the photo is leaving your hands: clients, email, print labs, social uploads and older software all take JPEG without question. For those, use the <a href="/solutions/hif-to-jpg" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">HIF to JPG converter</a>.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting HIF to AVIF without a converter</h2>
            <p class="leading-relaxed text-[#6C3F31]">Neither Windows Photos nor Preview on a Mac exports AVIF. GIMP (version 2.10.22 or later) opens HEIF files and exports AVIF. In bulk, libheif's <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">heif-dec</code> turns HIF into 16-bit PNGs and libavif's <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">avifenc</code> encodes those as AVIF.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-[#6C3F31]">Without an account you can convert 3 photos a month; a free account gives you 25 a month, up to 3 at a time, 20MB each. Paid plans (Seller, Pro and Growth) take batches of 25 and files up to 75MB, and a $2 Day Pass gives 100 uploads over 24 hours with no account. The <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">pricing page</a> has the plans.</p>
            <p class="leading-relaxed text-[#6C3F31]">The same conversion works through the REST API on every plan, Free included. Send the raw HIF to <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">POST /v1/squish</code>; full reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>:</p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=avif&amp;stripExif=false" \
  -H "Content-Type: image/heif" \
  -H "Authorization: Bearer $MOCHIFY_API_KEY" \
  --data-binary @DSCF0001.HIF \
  --output DSCF0001.avif</code></pre>
            <p class="leading-relaxed text-[#6C3F31]"><code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">stripExif=false</code> keeps the camera metadata, as the page does by default. Add <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">&amp;width=2400</code> to resize for the web in the same call.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
            <FaqAccordion {faqs} />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/hif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F1F8E9] flex items-center justify-center shrink-0 border border-[#DCEDC8]">
                        <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">Same photos, maximum compatibility</p>
                    </div>
                </a>
                <a href="/solutions/heif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                        <svg class="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">Any .heif, .heic or .hif file</p>
                    </div>
                </a>
                <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPG →</p>
                        <p class="text-xs text-[#875F42]">The iPhone and iPad lane</p>
                    </div>
                </a>
            </div>
        </section>
    </div>
    
