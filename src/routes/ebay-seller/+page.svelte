<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    // The visible accordion and the FAQPage schema are built from this one
    // array, so the two cannot drift: the page previously hand-wrote three
    // schema questions against five visible ones (handoff 2026-10-01, the same
    // fix /vinted-seller had on 2026-09-23).
    const faqs = [
        {
            q: "What is the best photo size for eBay?",
            a: "eBay's minimum is 500 by 500 pixels and it recommends about 1600 by 1600. Photos at 1600px look sharp on every device and give buyers room to zoom in. eBay also says 1:1 or 16:9 framing looks best. Ask Mochify for \"1600px, square crop\" and each photo comes back at that size with your item centered, with no upscaling of smaller originals."
        },
        {
            q: "What are eBay's photo requirements in 2026?",
            a: "From eBay's own help page: JPEG, PNG, GIF, TIFF, BMP, WebP, HEIC or AVIF; 12MB maximum per photo; up to 24 pictures per listing; minimum 500 by 500 pixels, about 1600 by 1600 recommended; a plain background, white generally best; no badges, logos, copyright notices or watermarks. Mochify's JPEG output meets the format and size rules by default, and one prompt handles the size and background."
        },
        {
            q: "How do I optimize photos for eBay in one go?",
            a: "Open Mochify's Magic Flow, drop in your photos and type what you want, for example \"resize to 1600px, white background, JPEG\". A language model reads the instruction and the image engine does the work: resize, crop, background, compression. Free accounts process 3 photos per batch and 25 a month; Seller, Pro and Growth process 25 per batch. If you only need the 1600px JPEG step, the eBay Image Resizer and Converter does it with nothing to type."
        },
        {
            q: "Does a white background help on eBay?",
            a: "eBay says white backgrounds generally work best, with darker backgrounds for reflective items, and its listing tool has its own button to replace a background with white. Mochify can do the same before you upload: ask for \"white background\" and you get a flattened JPEG; ask for a transparent PNG and you keep the cut-out to reuse on Vinted, Etsy or your own shop."
        },
        {
            q: "Will eBay accept HEIC photos from my iPhone?",
            a: "Yes. eBay's uploader accepts HEIC and AVIF alongside JPEG, PNG, GIF, TIFF, BMP and WebP. Converting to JPEG is still the safer choice for one reason: a JPEG looks the same in every browser and every buyer's app, while HEIC support depends on the device showing it. Mochify converts HEIC, HIF, WebP and AVIF to JPEG in the same step as the resize."
        },
        {
            q: "Are my photos private?",
            a: "Your photos are sent to Mochify's servers, processed in memory and never written to disk, logged or used to train AI; the original is discarded as soon as the result is encoded. There is no account requirement for your first 3 photos a month."
        }
    ] satisfies FaqItem[];

    const faqLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    });

    const metaDescription =
        "eBay's photo size and rules (1600px, white background, 12MB, 24 photos) and how to hit them in one Mochify prompt. Free, no signup for your first 3.";
</script>

<svelte:head>
    <title>eBay Photo Size and Rules - Optimize in One Prompt | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta name="keywords" content="eBay image size, optimize images for eBay, eBay photo requirements, eBay listing photos, eBay background removal">
    <meta property="og:title" content="eBay photo size and rules, handled in one prompt">
    <meta property="og:description" content={metaDescription}>

    {@html `<script type="application/ld+json">${faqLd}<\/script>`}
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
    <Navigation />

    <!-- Hero -->
    <section class="relative max-w-5xl mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8 w-full text-center">
        <div class="flex flex-wrap justify-center gap-3 mb-8">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                eBay photo size and rules
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                1600px recommended
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#875F42]/10 shadow-sm text-[#875F42] text-xs font-bold tracking-wide uppercase">
                White background in one prompt
            </span>
        </div>

        <h1 class="text-4xl sm:text-6xl font-black text-[#4A2C2C] tracking-tight leading-tight mb-6">
            eBay photo size and rules,<br>
            <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                handled in one prompt.
            </span>
        </h1>

        <p class="text-xl text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            eBay recommends about 1600 by 1600 pixels, a white background, no watermarks, and JPEG, PNG, WebP, HEIC or AVIF under 12MB. Drop your phone photos into <a href="/flow" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Mochify</a>, type "resize to 1600px, white background, JPEG", and every photo comes back listing-ready.
        </p>

        <a href="/auth/register" class="inline-flex items-center gap-2 bg-[#F06292] hover:bg-[#E91E8C] text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
            Try it free, no card needed
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
        </a>
        <p class="text-sm text-[#7E685E] mt-3">25 free images a month with an account, or 3 a month with no signup. No credit card.</p>
    </section>

    <!-- Video demo -->
    <section class="relative max-w-3xl mx-auto px-4 pb-4 sm:px-6 lg:px-8 w-full">
        <div class="rounded-3xl overflow-hidden border border-pink-100 shadow-lg bg-white">
            <div class="px-5 py-3 border-b border-pink-50 flex items-center gap-2">
                <div class="flex gap-1.5">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#FFCDD2]"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-[#FFE0B2]"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-[#F1F8E9]"></div>
                </div>
                <span class="text-xs text-[#875F42]/50 font-medium ml-1">Mochify: eBay photo optimizer</span>
            </div>
            <div class="aspect-[16/10] bg-[#FFF5F7]">
                <!-- svelte-ignore a11y_media_has_caption -->
                <video class="w-full h-full object-cover" autoplay loop muted playsinline>
                    <source src="https://assets.mochify.xyz/mochi.webm" type="video/webm" />
                    <source src="https://assets.mochify.xyz/mochi.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    </section>

    <!-- Benefits grid -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <h2 class="text-2xl sm:text-3xl font-black text-[#4A2C2C] text-center mb-10">
            What eBay asks for,<br>
            <span class="text-[#F06292]">and what buyers respond to.</span>
        </h2>

        <div class="grid sm:grid-cols-3 gap-6">
            {#each [
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>`,
                    color: 'bg-[#FFF5F7] border-pink-100 text-[#F06292]',
                    title: '1600px, the size eBay recommends',
                    body: "eBay's minimum is 500 by 500 pixels and it recommends about 1600 by 1600, with 1:1 or 16:9 framing looking best. Ask Mochify for 1600px and it resizes to fit; ask for a square crop too and its AI finds your item and crops around it."
                },
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>`,
                    color: 'bg-[#F3E5F5] border-purple-100 text-purple-600',
                    title: 'White background, if you want one',
                    body: "eBay says white backgrounds generally work best, darker ones for reflective items. Tell Mochify \"remove the background and make it white\" and you get the flattened JPEG eBay's uploader expects; ask for a transparent PNG instead and you keep the cut-out for other marketplaces. Background removal is included on every plan, Free too."
                },
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/></svg>`,
                    color: 'bg-[#F1F8E9] border-[#DCEDC8] text-[#33691E]',
                    title: 'Up to 24 photos, all consistent',
                    body: "eBay lets you add up to 24 pictures per listing. Shoot every angle, then run the whole set through one prompt so the size, framing and background match across the listing. Consistent photos read as a careful seller, and careful sellers get fewer lowball offers."
                }
            ] as benefit}
                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-8 space-y-4">
                    <div class="w-12 h-12 rounded-2xl {benefit.color} border flex items-center justify-center">
                        {@html benefit.icon}
                    </div>
                    <h3 class="font-black text-[#4A2C2C] text-lg">{benefit.title}</h3>
                    <p class="text-[#6C3F31] text-sm leading-relaxed">{benefit.body}</p>
                </div>
            {/each}
        </div>
    </section>

    <!-- Social proof / conversion angle -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div class="bg-gradient-to-br from-[#FFF0F3] to-[#FFF5F7] rounded-3xl border border-pink-100 p-10 text-center space-y-6">
            <h2 class="text-2xl sm:text-3xl font-black text-[#4A2C2C]">
                Your main photo is competing with hundreds of others.
            </h2>
            <p class="text-[#6C3F31] max-w-2xl mx-auto leading-relaxed">
                In eBay search results the gallery photo does the selling. A bright, correctly sized photo with the item centered on a plain background gets the click; a dark, blurry or badly cropped one gets scrolled past, however good the item is. eBay's own guidance says the same: fill the frame, keep the background plain, no badges or watermarks.
            </p>
            <div class="grid sm:grid-cols-3 gap-6 pt-4">
                {#each [
                    { stat: '1600px', label: "eBay's recommended size (500px minimum)" },
                    { stat: '12MB', label: "eBay's limit per photo; Mochify's output is far smaller" },
                    { stat: '24 photos', label: 'Per eBay listing, every angle, one prompt' }
                ] as item}
                    <div class="bg-white rounded-2xl border border-pink-100 p-6 space-y-2">
                        <div class="text-3xl font-black text-[#F06292]">{item.stat}</div>
                        <div class="text-sm text-[#6C3F31] leading-snug">{item.label}</div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- How it works -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-8">
            <h2 class="text-xl font-black text-[#4A2C2C] mb-8 text-center">From phone to listing in three steps</h2>
            <div class="grid sm:grid-cols-3 gap-8 relative">
                {#each [
                    { n: 1, title: 'Upload', body: 'Drop in your photos, straight from your camera roll: 3 at a time on Free, up to 25 at once on Seller, Pro and Growth. JPEG, HEIC from iPhone, HIF from a camera, PNG, WebP and AVIF all work.' },
                    { n: 2, title: 'Optimize', body: 'Type what you want in <a href="/flow" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Magic Flow</a>: "resize to 1600px, white background, JPEG" covers most listings; add "square crop" if you want 1:1. Mochify\'s engine resizes to fit (never upscales), finds your item for the crop, removes the background and encodes a high-quality JPEG. No settings to learn.' },
                    { n: 3, title: 'List', body: 'Download the photos, or the ZIP for a batch, and add them to your eBay listing. If you would rather not type anything, the <a href="/solutions/ebay-image-converter" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">eBay Image Resizer and Converter</a> does the 1600px JPEG step with one click.' }
                ] as step}
                    <div class="text-center relative z-10">
                        <div class="w-10 h-10 mx-auto mb-4 rounded-full bg-[#FFF0F3] border border-pink-100 text-[#F06292] flex items-center justify-center font-black text-sm">
                            {step.n}
                        </div>
                        <h3 class="font-black text-[#4A2C2C] text-sm uppercase tracking-widest mb-2">{step.title}</h3>
                        <p class="text-[#6C3F31] text-sm leading-relaxed opacity-90">{@html step.body}</p>
                    </div>
                {/each}
                <div class="hidden sm:block absolute top-5 left-[16.66%] right-[16.66%] h-px bg-pink-100 -z-0"></div>
            </div>
        </div>
    </section>

    <!-- FAQ (keyword-rich) -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6 text-center">eBay photo questions, answered</h2>
        <div class="space-y-3 max-w-3xl mx-auto">
            {#each faqs as faq}
                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none">
                        <h3 class="m-0 text-base font-bold text-[#4A2C2C]">{faq.q}</h3>
                        <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ml-4">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
                        </span>
                    </summary>
                    <div class="px-6 pb-6 text-sm text-[#6C3F31] leading-relaxed">{faq.a}</div>
                </details>
            {/each}
        </div>
    </section>

    <!-- Final CTA -->
    <section class="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full text-center">
        <div class="bg-gradient-to-br from-[#F06292] to-[#E91E8C] rounded-3xl p-12 space-y-6 shadow-xl">
            <h2 class="text-3xl sm:text-4xl font-black text-white leading-tight">
                Ready to list faster on eBay?
            </h2>
            <p class="text-white/90 text-lg max-w-xl mx-auto leading-relaxed">
                Get 25 optimizations a month free with an account, or try 3 with no signup at all. No credit card, no setup: just type what you need.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/auth/register" class="inline-flex items-center justify-center gap-2 bg-white text-[#F06292] font-black px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                    Start optimizing free
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                </a>
                <a href="/solutions/ebay-image-converter" class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg border border-white/20 transition-all duration-200">
                    Try without signing up
                </a>
            </div>
            <p class="text-white/70 text-sm">25 free per month · No credit card · Cancel any time</p>
        </div>
    </section>

    <Footer />
</div>
