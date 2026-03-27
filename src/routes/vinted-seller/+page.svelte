<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>Vinted Photo Optimization for Sellers | Mochify</title>
    <meta name="description" content="Better Vinted photos get more likes, more messages, and faster sales. Mochify resizes to the perfect 3:4 portrait, removes backgrounds, and makes your listings stand out.">
    <meta name="keywords" content="Vinted photo size, optimize images for Vinted, Vinted image requirements, best photos for Vinted, Vinted listing photos">
    <meta property="og:title" content="Better Vinted Photos. More Likes. Faster Sales.">
    <meta property="og:description" content="Mochify gets your Vinted photos to the perfect size with clean backgrounds — so buyers stop scrolling and start buying.">
    <link rel="canonical" href="https://mochify.app/vinted-seller">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the best photo size for Vinted?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vinted recommends a 3:4 portrait aspect ratio at 1080×1440px for listing photos. Mochify automatically resizes and smart-crops your photos to a clean 1080×1440px portrait so your item fills the frame the way Vinted's layout expects."
                }
            },
            {
                "@type": "Question",
                "name": "What are Vinted's image requirements?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vinted accepts JPEG and PNG images up to 10MB per photo, with a minimum of 640×640px. Photos must show the actual item — no stock images, no watermarks, and no added borders. A clean background is strongly recommended as it helps buyers focus on the clothing."
                }
            },
            {
                "@type": "Question",
                "name": "Do better photos help you sell faster on Vinted?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Vinted's feed is highly visual — buyers scroll quickly and click the photos that stand out. Clean backgrounds, square crops, and bright well-lit photos consistently get more favourites and messages than cluttered or poorly-framed shots, and items sell faster and at better prices."
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
                Vinted Photo Requirements
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3E5F5] border border-purple-100 shadow-sm text-purple-600 text-xs font-bold tracking-wide uppercase">
                3:4 Portrait Crop
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                Background Removal
            </span>
        </div>

        <h1 class="text-4xl sm:text-6xl font-black text-[#4A2C2C] tracking-tight leading-tight mb-6">
            Your closet deserves<br>
            <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                photos that sell.
            </span>
        </h1>

        <p class="text-xl text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Vinted is a scroll. Buyers decide in a glance. Mochify turns your casual phone shots into clean, portrait-cropped listing photos at exactly the size Vinted recommends — so your items get clicked, not skipped.
        </p>

        <a href="/auth/register" class="inline-flex items-center gap-2 bg-[#F06292] hover:bg-[#E91E8C] text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
            Try it free — no card needed
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
        </a>
        <p class="text-sm text-[#7E685E] mt-3">25 free optimizations per month. No credit card.</p>
    </section>

    <!-- Benefits grid -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <h2 class="text-2xl sm:text-3xl font-black text-[#4A2C2C] text-center mb-10">
            What makes a Vinted photo work.<br>
            <span class="text-[#F06292]">And what makes buyers scroll past.</span>
        </h2>

        <div class="grid sm:grid-cols-3 gap-6">
            {#each [
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>`,
                    color: 'bg-[#FFF5F7] border-pink-100 text-[#F06292]',
                    title: 'Smart 3:4 Portrait Crop',
                    body: "Vinted recommends portrait photos at 3:4 (1080×1440px). Photos that don't match get letterboxed or awkwardly cut. Our AI detects where your item is and crops tight around it — centred, portrait, and ready to fill the frame the way Vinted's layout expects."
                },
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>`,
                    color: 'bg-[#F3E5F5] border-purple-100 text-purple-600',
                    title: 'Clean Backgrounds',
                    body: "A messy bedroom or patterned floor behind your item screams casual listing. Our AI isolates your clothing or item and places it on a clean white background — the same look as the brand's own product photos, for free."
                },
                {
                    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/></svg>`,
                    color: 'bg-[#F1F8E9] border-[#DCEDC8] text-[#33691E]',
                    title: 'Faster Offers, Better Prices',
                    body: "Buyers on Vinted make snap judgements. A listing that looks like a brand's own photo signals quality and care — and buyers pay more for items that look well-presented. Better photos mean fewer lowball offers and faster sales."
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

    <!-- Conversion angle -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div class="bg-gradient-to-br from-[#FFF0F3] to-[#FFF5F7] rounded-3xl border border-pink-100 p-10 text-center space-y-6">
            <h2 class="text-2xl sm:text-3xl font-black text-[#4A2C2C]">
                The Vinted feed rewards good photos.
            </h2>
            <p class="text-[#6C3F31] max-w-2xl mx-auto leading-relaxed">
                When a buyer searches for a hoodie or a pair of trainers, they see a grid of portrait thumbnails. The listings with clean, bright, correctly-proportioned photos get favourited first. The ones with dark, cropped-off, or cluttered shots get ignored — even if the item is identical. Your photo is your shop window.
            </p>
            <div class="grid sm:grid-cols-3 gap-6 pt-4">
                {#each [
                    { stat: '1080×1440', label: 'Recommended portrait size for sharp Vinted photos' },
                    { stat: '20 photos', label: 'Per listing — show every angle, perfectly optimized' },
                    { stat: '< 10MB', label: "Vinted's file size limit — we always come in well under" }
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
            <h2 class="text-xl font-black text-[#4A2C2C] mb-8 text-center">From phone photo to Vinted listing in seconds</h2>
            <div class="grid sm:grid-cols-3 gap-8 relative">
                {#each [
                    { n: 1, title: 'Upload', body: 'Drop in your photos straight from your camera roll — up to 25 at once. JPEG, HEIC from iPhone, PNG, all supported.' },
                    { n: 2, title: 'Optimize', body: 'We smart-crop to the recommended 3:4 portrait, centre your item, remove the background, and compress to under 10MB while keeping quality sharp.' },
                    { n: 3, title: 'List', body: 'Download your optimized photos and upload to your Vinted listing. The whole batch takes seconds.' }
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

    <!-- FAQ -->
    <section class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6 text-center">Vinted Photo Questions — Answered</h2>
        <div class="space-y-3 max-w-3xl mx-auto">
            {#each [
                {
                    q: 'What is the best photo size for Vinted?',
                    a: "Vinted recommends a 3:4 portrait aspect ratio at 1080×1440px for listing photos — portrait orientation fits their layout without letterboxing or unwanted cropping. Mochify automatically resizes and smart-crops your photos to 1080×1440px so your item fills the frame perfectly."
                },
                {
                    q: 'What are Vinted\'s image requirements in 2026?',
                    a: "Vinted accepts JPEG and PNG images under 10MB, with a minimum of 640×640px. Photos must show the actual item — no stock images, no watermarks, and no added text or borders. Vinted strongly recommends a clean, neutral background so buyers can judge the item clearly."
                },
                {
                    q: 'How do I take better photos for Vinted?',
                    a: "Natural light, a plain background, and a portrait crop are the three biggest improvements most sellers can make. Lay flat on a white surface for small items, or hang clothing against a plain wall. Then let Mochify handle the 3:4 crop, background clean-up, and resizing so every photo looks consistent and professional."
                },
                {
                    q: 'Does removing the background help sell on Vinted?',
                    a: "Yes — especially for clothing and accessories. A clean white background removes distractions, makes colours appear truer to life, and gives your listing the same polished look as brand product pages. Buyers associate a clean photo with a trustworthy seller."
                },
                {
                    q: 'Can I optimize multiple Vinted photos at once?',
                    a: "Yes. Upload up to 25 photos at once and Mochify processes them all in parallel. You get a ZIP file ready to upload to your listing — useful when you're photographing a whole wardrobe clear-out in one session."
                },
                {
                    q: 'Are my photos private?',
                    a: "Completely. Photos are processed in memory and discarded the moment your download is ready. They are never stored, logged, or seen by anyone."
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
                Start selling more on Vinted.
            </h2>
            <p class="text-white/90 text-lg max-w-xl mx-auto leading-relaxed">
                Get your first 25 optimizations free. No credit card, no setup — just better photos and faster sales.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/auth/register" class="inline-flex items-center justify-center gap-2 bg-white text-[#F06292] font-black px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                    Start optimizing free
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                </a>
                <a href="/" class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg border border-white/20 transition-all duration-200">
                    Try without signing up
                </a>
            </div>
            <p class="text-white/70 text-sm">25 free per month · No credit card · Cancel any time</p>
        </div>
    </section>

    <Footer />
</div>
