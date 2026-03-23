<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>eBay Image Optimization for Sellers | Mochify</title>
    <meta name="description" content="Better eBay photos sell faster and for more money. Mochify resizes to eBay's 1600×1600 standard, removes backgrounds, and smart-crops your listings in seconds.">
    <meta name="keywords" content="eBay image size, optimize images for eBay, eBay photo requirements, eBay listing photos, eBay background removal">
    <meta property="og:title" content="Better eBay Photos. More Sales. Higher Prices.">
    <meta property="og:description" content="Mochify optimizes your eBay listing photos to the exact right size, quality, and clean background — so buyers click and buy.">
    <link rel="canonical" href="https://mochify.xyz/ebay-seller">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the correct eBay image size?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "eBay recommends a minimum of 500×500 pixels and displays photos at up to 1600×1600 pixels. For best results and to qualify for eBay's zoom feature, upload images at exactly 1600×1600px. Mochify automatically resizes and crops your photos to this standard."
                }
            },
            {
                "@type": "Question",
                "name": "What are eBay's photo requirements?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "eBay requires images to be JPEG, PNG, GIF, or BMP format, under 12MB each, and at least 500 pixels on the longest side. eBay also recommends a clean white or neutral background, no watermarks, and no added borders."
                }
            },
            {
                "@type": "Question",
                "name": "Do better photos really help eBay sales?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. eBay's own research shows listings with high-quality, properly sized images receive significantly more views and sell for higher prices. Clean backgrounds help buyers focus on the item, and the zoom feature — only available at 1600px+ — increases buyer confidence."
                }
            }
        ]
    }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col">
    <Navigation />
    <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9InJnYmEoMjQwLCA5OCwgMTQ2LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] pointer-events-none"></div>

    <!-- Hero -->
    <section class="relative max-w-5xl mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8 w-full text-center">
        <div class="flex flex-wrap justify-center gap-3 mb-8">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                eBay Image Size Requirements
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                1600×1600px Standard
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#875F42]/10 shadow-sm text-[#875F42] text-xs font-bold tracking-wide uppercase">
                Background Removal
            </span>
        </div>

        <h1 class="text-4xl sm:text-6xl font-black text-[#4A2C2C] tracking-tight leading-tight mb-6">
            Better eBay Photos.<br>
            <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                More Sales. Higher Prices.
            </span>
        </h1>

        <p class="text-xl text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Buyers judge your listing in under two seconds. Mochify gets your photos to the exact right size, strips messy backgrounds, and makes every listing look professional — automatically.
        </p>

        <a href="/auth/register" class="inline-flex items-center gap-2 bg-[#F06292] hover:bg-[#E91E8C] text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
            Try it free — no card needed
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
        </a>
        <p class="text-sm text-[#7E685E] mt-3">25 free optimizations per day. No credit card.</p>
    </section>

    <!-- Benefits grid -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <h2 class="text-2xl sm:text-3xl font-black text-[#4A2C2C] text-center mb-10">
            Everything eBay's algorithm wants.<br>
            <span class="text-[#F06292]">Everything buyers respond to.</span>
        </h2>

        <div class="grid sm:grid-cols-3 gap-6">
            {#each [
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>`,
                    color: 'bg-[#FFF5F7] border-pink-100 text-[#F06292]',
                    title: 'Perfect 1600×1600px',
                    body: "eBay unlocks the zoom feature at 1600px — letting buyers inspect every detail before they buy. We resize and smart-crop every photo to hit that standard exactly, so your listings qualify automatically."
                },
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>`,
                    color: 'bg-[#F3E5F5] border-purple-100 text-purple-600',
                    title: 'Clean White Backgrounds',
                    body: "eBay's own guidelines recommend a clean, neutral background. Our AI removes cluttered backgrounds and replaces them with clean white — the way professional product photographers do it, without the studio cost."
                },
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/></svg>`,
                    color: 'bg-[#F1F8E9] border-[#DCEDC8] text-[#33691E]',
                    title: 'Higher Sale Prices',
                    body: "Listings with professional photos consistently sell for more. Buyers associate image quality with item quality — a clean, properly sized photo signals a careful seller and gives buyers the confidence to pay full price."
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
                Your photos are the first thing buyers see.
            </h2>
            <p class="text-[#6C3F31] max-w-2xl mx-auto leading-relaxed">
                On eBay search results, your main photo is competing against hundreds of other listings. A bright, clean, properly-sized photo with the item centred and the background removed stops the scroll. A dark, blurry, or awkwardly-cropped photo gets skipped — no matter how good the item is.
            </p>
            <div class="grid sm:grid-cols-3 gap-6 pt-4">
                {#each [
                    { stat: '1600px', label: 'eBay recommended photo size for zoom feature' },
                    { stat: '12MB', label: 'Maximum file size — we always come in well under' },
                    { stat: '25 files', label: 'Optimized at once — do your whole inventory in minutes' }
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
                    { n: 1, title: 'Upload', body: 'Drag in your photos — up to 25 at once. Works with JPEG, HEIC from iPhone, PNG, and more.' },
                    { n: 2, title: 'Optimize', body: 'We resize to 1600×1600px, smart-crop to centre your item, remove the background, and compress to well under 12MB.' },
                    { n: 3, title: 'List', body: 'Download your optimized photos and upload directly to eBay. Professional results, zero effort.' }
                ] as step}
                    <div class="text-center relative z-10">
                        <div class="w-10 h-10 mx-auto mb-4 rounded-full bg-[#FFF0F3] border border-pink-100 text-[#F06292] flex items-center justify-center font-black text-sm">
                            {step.n}
                        </div>
                        <h3 class="font-black text-[#4A2C2C] text-sm uppercase tracking-widest mb-2">{step.title}</h3>
                        <p class="text-[#6C3F31] text-sm leading-relaxed opacity-90">{step.body}</p>
                    </div>
                {/each}
                <div class="hidden sm:block absolute top-5 left-[16.66%] right-[16.66%] h-px bg-pink-100 -z-0"></div>
            </div>
        </div>
    </section>

    <!-- FAQ (keyword-rich) -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6 text-center">eBay Photo Requirements — Answered</h2>
        <div class="space-y-3 max-w-3xl mx-auto">
            {#each [
                {
                    q: 'What is the correct eBay image size?',
                    a: "eBay requires a minimum of 500px on the longest side, but strongly recommends 1600×1600px to activate the zoom feature — one of the most important tools for converting browsers into buyers. Mochify resizes and smart-crops every photo to exactly 1600×1600px automatically."
                },
                {
                    q: 'What are eBay\'s photo requirements in 2025?',
                    a: "eBay requires images to be JPEG, PNG, GIF, or BMP. Files must be under 12MB. eBay recommends a clean white or neutral background, no watermarks, no added borders, and that the item fills at least 90% of the frame. Mochify meets every one of these requirements automatically."
                },
                {
                    q: 'How do I optimize images for eBay to get more sales?',
                    a: "The biggest impact comes from three things: correct size (1600×1600px for zoom), a clean background (white or neutral so buyers focus on the item), and sharp framing (item centred and filling the frame). Mochify handles all three in one step — no Photoshop required."
                },
                {
                    q: 'Does background removal really help eBay sales?',
                    a: "Yes — especially for items like clothing, electronics, and collectibles where buyer confidence depends on seeing the item clearly. A clean white background removes distractions, looks more professional, and aligns with what eBay's algorithm promotes in search results."
                },
                {
                    q: 'Are my photos kept private?',
                    a: "Completely. Images are processed in memory on our servers and discarded the moment your download is ready. They are never stored, logged, or seen by anyone."
                }
            ] as faq}
                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none">
                        <span>{faq.q}</span>
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
                Ready to sell more on eBay?
            </h2>
            <p class="text-white/90 text-lg max-w-xl mx-auto leading-relaxed">
                Join sellers who've stopped losing sales to bad photos. Get your first 25 optimizations free — no credit card, no setup.
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
            <p class="text-white/70 text-sm">25 free per day · No credit card · Cancel any time</p>
        </div>
    </section>

    <Footer />
</div>
