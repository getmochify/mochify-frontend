<script lang="ts">
    import { onMount } from 'svelte';
    import ImageUploadClassic from '$lib/components/ImageUploadClassic.svelte';
    import PromptForm from '$lib/components/PromptForm.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';

    let fileCount = $state(25);
    let fileSizeMB = $state(20);
    
    let activeTab: 'prompt' | 'classic' = $state('prompt');

    function animateCount(from: number, to: number, duration: number, setter: (v: number) => void) {
        const start = performance.now();
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setter(Math.round(from + (to - from) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    onMount(() => {
        const t = setTimeout(() => {
            animateCount(15, 25, 1100, v => (fileCount = v));
            animateCount(12, 20, 900,  v => (fileSizeMB = v));
        }, 400);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        return () => {
            clearTimeout(t);
            observer.disconnect();
        };
    });
</script>

<svelte:head>
    <title>Mochify | Free Bulk 500MB Image Compressor (Jpegli, AVIF, WebP)</title>
    <meta name="description" content="Free bulk image compressor for WebP, HEIC, JXL & AVIF. Mochify handles 25 files at once up to 20MB each with no quality loss. Fast, private, and Shopify ready.">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": "Mochify",
                "url": "https://mochify.xyz",
                "description": "Free bulk image compressor for WebP, HEIC, JXL & AVIF. Processes 25 files at once up to 20MB each with a native C++ engine. Zero retention — files never touch disk.",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "featureList": [
                    "AVIF, WebP, JXL, Jpegli compression",
                    "Batch processing up to 25 files",
                    "Zero data retention",
                    "EXIF stripping",
                    "NLP-driven Magic Flow"
                ],
                "isAccessibleForFree": true,
                "inLanguage": "en"
            },
            {
                "@type": "SoftwareApplication",
                "name": "Mochify CLI",
                "description": "Rust-based CLI and MCP server for high-performance image compression compatible with Claude CLI.",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "Windows, macOS, Linux",
                "downloadUrl": "https://github.com/getmochify/mochify-cli/releases",
                "softwareVersion": "0.2.2"
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Is Mochify free to use?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. The free tier lets you compress up to 100 images per month — up to 20 MB each — with no account required. Next-generation formats including AVIF, WebP, and JPEG XL are all included at no cost. A Pro plan ($10/month) unlocks 1,000 API operations per month, a dedicated API key, CLI access, and MCP server support for AI agents."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are my images stored or shared?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. Mochify streams each file directly into server RAM, compresses it with a native C++ engine, and returns the result. Files are never written to disk and are wiped from memory immediately after processing. There is no cloud storage, no third-party access, and no logs containing your image data."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much smaller will my images be?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Results depend on format and source content. Jpegli typically produces files 35% smaller than standard JPEG at equivalent visual quality. AVIF averages 50% smaller than JPEG and 20% smaller than WebP. WebP averages 26% smaller than JPEG. Smart Compress mode automatically targets the best quality-to-size balance for each individual image."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What image formats does Mochify support?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Input formats: JPEG, PNG, WebP, AVIF, HEIC/HEIF, and JPEG XL. Output formats: JPEG (via Jpegli), PNG, WebP, AVIF, and JPEG XL. You can process up to 25 files simultaneously in a single drag-and-drop session. For larger batches, use the REST API or CLI — both support scripted bulk processing."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does Mochify have an API?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. The REST API is available at api.mochify.xyz. The free tier allows 25 operations per day with no API key required. A Pro subscription provides 1,000 operations per month and a Bearer-token key for higher-volume automation."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is Magic Flow?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Magic Flow is Mochify's NLP-driven upload interface. Instead of selecting a format and quality setting manually, you describe what you want in plain language — for example, 'convert to AVIF and strip location data' — and Mochify interprets the intent and applies the right parameters to each file automatically."
                        }
                    }
                ]
            }
        ]
    }
    </script>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">
    
    <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="animate-float absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-pink-200/20 blur-[80px]"></div>
        <div class="animate-float-slow absolute -bottom-56 -left-40 w-[600px] h-[600px] rounded-full bg-rose-100/15 blur-[100px]"></div>
        <div class="animate-float absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-pink-50/20 blur-[70px]"></div>
    </div>

    <Navigation />
    
    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <header class="text-center mb-10">
            <h1 class="text-5xl md:text-7xl font-black text-[#4A2C2C] leading-tight tracking-tight mb-3">
                Mochify
            </h1>
            <p class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70 mb-4">Zero-Retention Image Optimization</p>
            <p class="text-[#6C3F31] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Compress up to <strong><span class="text-[#F06292]" aria-label="{fileCount} images">{fileCount}</span> images ({fileSizeMB}MB each)</strong> at once with our native C++ engine. Describe what you need, drop your files, and you're done.
            </p>
            <a
                href="https://github.com/getmochify/mochify-cli"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden md:inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full border border-[#875F42]/12 bg-white/50 hover:bg-white/80 hover:border-[#875F42]/20 transition-all duration-200 group"
            >
                <svg class="w-3.5 h-3.5 text-[#875F42]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
                </svg>
                <span class="text-xs font-semibold text-[#875F42]/60 group-hover:text-[#6C3F31] transition-colors">Also available as a CLI</span>
                <svg class="w-3 h-3 text-[#875F42]/40 group-hover:text-[#875F42]/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                </svg>
            </a>
        </header>

        <div class="w-full flex flex-col items-center relative mt-10 mb-16">
            
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[250px] bg-gradient-to-r from-pink-200/0 via-pink-200/20 to-pink-200/0 blur-3xl rounded-full pointer-events-none -z-10 transition-opacity duration-500 {activeTab === 'prompt' ? 'opacity-100' : 'opacity-0'}"></div>

            <div class="w-full flex justify-center items-start relative z-10">
                {#if activeTab === 'prompt'}
                    <div id="tab-panel-prompt" role="tabpanel" aria-labelledby="tab-prompt" class="animate-fade-in w-full max-w-3xl drop-shadow-[0_12px_30px_rgba(240,98,146,0.08)]">
                        <PromptForm />
                    </div>
                {:else}
                    <div id="tab-panel-classic" role="tabpanel" aria-labelledby="tab-classic" class="animate-fade-in w-full max-w-3xl">
                        <ImageUploadClassic showSmartMode={true} />
                    </div>
                {/if}
            </div>

            <div class="mt-7 relative z-20 flex justify-center w-full">
                <div role="tablist" aria-label="Upload mode" class="p-1 rounded-full border border-[#875F42]/10 flex items-center gap-1">
                    <button
                        role="tab"
                        aria-selected={activeTab === 'prompt'}
                        aria-controls="tab-panel-prompt"
                        onclick={() => activeTab = 'prompt'}
                        class="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 {activeTab === 'prompt' ? 'bg-[#F06292] text-white shadow-sm' : 'text-[#875F42]/60 hover:text-[#F06292] hover:bg-white'}"
                    >
                        Magic Flow
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'classic'}
                        aria-controls="tab-panel-classic"
                        onclick={() => activeTab = 'classic'}
                        class="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 {activeTab === 'classic' ? 'bg-[#F06292] text-white shadow-sm' : 'text-[#875F42]/60 hover:text-[#F06292] hover:bg-white'}"
                    >
                        Manual Settings
                    </button>
                </div>
            </div>
            
        </div>

        <section class="mt-12 max-w-4xl mx-auto reveal">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">

                <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">C++20 Engine</h3>
                    <p class="text-[#875F42]/80 text-xs leading-relaxed">Processes files in milliseconds, not seconds. No interpreted scripts.</p>
                </div>

                <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">Jpegli</h3>
                    <p class="text-[#875F42]/80 text-xs leading-relaxed">Up to 35% smaller than standard JPEG at the same visual quality.</p>
                </div>

                <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">Zero Retention</h3>
                    <p class="text-[#875F42]/80 text-xs leading-relaxed">Streamed into RAM, compressed, wiped. Your images never touch a disk.</p>
                </div>

                <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">Next-gen Free</h3>
                    <p class="text-[#875F42]/80 text-xs leading-relaxed">AVIF, JXL, and WebP included. No Pro account, no paywalls.</p>
                </div>

            </div>


        </section>

        <section class="mt-16 max-w-4xl mx-auto reveal">
            <h2 class="text-center text-2xl font-black text-[#4A2C2C] mb-2">How Mochify compares</h2>
            <p class="text-center text-sm text-[#875F42]/70 mb-8">No cloud storage. No per-credit paywalls. No compromises.</p>
            <div class="rounded-2xl border border-white/80 shadow-sm overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-white/80">
                            <th class="text-left px-3 py-3 md:px-5 md:py-3.5 font-bold text-[#875F42]/60 text-xs uppercase tracking-wider w-[38%] md:w-[34%]">Feature</th>
                            <th class="px-3 py-3 md:px-5 md:py-3.5 font-bold text-[#875F42]/60 text-xs uppercase tracking-wider text-center">TinyPNG</th>
                            <th class="hidden md:table-cell px-5 py-3.5 font-bold text-[#875F42]/60 text-xs uppercase tracking-wider text-center">Cloudinary / Imgix</th>
                            <th class="px-3 py-3 md:px-5 md:py-3.5 font-bold text-[#F06292] text-xs uppercase tracking-wider text-center bg-[#FFF0F3]">Mochify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { feature: 'Jpegli / JPEG XL', tinypng: 'No', cloudinary: 'Extra credits / Complex', mochify: 'Native (built-in)' },
                            { feature: 'Speed', tinypng: 'Interpreted scripts', cloudinary: 'Cloud latency', mochify: 'C++20 native' },
                            { feature: 'Privacy', tinypng: 'Uploads required', cloudinary: 'Stored in cloud', mochify: 'Zero retention' },
                            { feature: 'AI Agent support', tinypng: 'None', cloudinary: 'Limited API', mochify: 'MCP server (native)' },
                            { feature: 'Free tier', tinypng: '3 / session', cloudinary: 'Trial only', mochify: 'Unlimited (rate-limited)' },
                            { feature: 'Paid plan', tinypng: '$39/yr · web', cloudinary: '$75–$99/mo', mochify: '$10/mo · API, CLI & NLP' },
                        ] as row, i}
                        <tr class="{i % 2 === 0 ? 'bg-white/40' : 'bg-white/20'} border-t border-[#F5E6E8]/60">
                            <td class="px-3 py-3 md:px-5 md:py-3.5 font-semibold text-[#4A2C2C] text-xs md:text-sm">{row.feature}</td>
                            <td class="px-3 py-3 md:px-5 md:py-3.5 text-center text-[#875F42]/70 text-xs md:text-sm">{row.tinypng}</td>
                            <td class="hidden md:table-cell px-5 py-3.5 text-center text-[#875F42]/70">{row.cloudinary}</td>
                            <td class="px-3 py-3 md:px-5 md:py-3.5 text-center font-bold text-[#F06292] bg-[#FFF0F3]/50 text-xs md:text-sm">{row.mochify}</td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mt-16 max-w-4xl mx-auto reveal">
            <h2 class="text-center text-2xl font-black text-[#4A2C2C] mb-2">Frequently asked questions</h2>
            <p class="text-center text-sm text-[#875F42]/70 mb-8">Everything you need to know before compressing your first batch.</p>
            <div class="space-y-2">

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Is Mochify free to use?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        Yes. The free tier lets you compress up to 100 images per month — up to 20 MB each — with no account required. Next-generation formats including AVIF, WebP, and JPEG XL are all included at no cost. A Pro plan ($10/month) unlocks 1,000 API operations per month, a dedicated API key, CLI access, and MCP server support for AI agents.
                    </p>
                </details>

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Are my images stored or shared?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        No. Mochify streams each file directly into server RAM, compresses it with a native C++ engine, and returns the result. Files are never written to disk and are wiped from memory immediately after processing. There is no cloud storage, no third-party access, and no logs containing your image data.
                    </p>
                </details>

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        How much smaller will my images be?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        Results depend on format and source content. Jpegli typically produces files 35% smaller than standard JPEG at equivalent visual quality. AVIF averages 50% smaller than JPEG and 20% smaller than WebP. WebP averages 26% smaller than JPEG. Smart Compress mode automatically targets the best quality-to-size balance for each individual image, so you never have to guess a quality setting.
                    </p>
                </details>

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        What image formats does Mochify support?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        Input formats: JPEG, PNG, WebP, AVIF, HEIC/HEIF, and JPEG XL. Output formats: JPEG (via Jpegli), PNG, WebP, AVIF, and JPEG XL. You can process up to 25 files simultaneously in a single drag-and-drop session. For batches larger than 25 files, use the REST API or CLI — both support scripted bulk processing with no per-file overhead.
                    </p>
                </details>

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Does Mochify have an API?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        Yes. The REST API is available at <code class="font-mono text-xs text-[#F06292]">api.mochify.xyz</code>. The free tier allows 25 operations per day with no API key required — just send a raw image body to <code class="font-mono text-xs text-[#F06292]">POST /v1/squish</code> with a <code class="font-mono text-xs">?type=</code> parameter. A Pro subscription provides 1,000 operations per month and a Bearer-token key for higher-volume automation. See the <a href="/docs" class="text-[#F06292] font-semibold hover:underline">API documentation</a> for examples in cURL, JavaScript, and Python.
                    </p>
                </details>

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        What is Magic Flow?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        Magic Flow is Mochify's NLP-driven upload interface. Instead of selecting a format and quality setting manually, you describe what you want in plain language — for example, <em>"convert to AVIF and strip location data"</em> or <em>"make these web-ready, max 1600px wide"</em> — and Mochify interprets the intent and applies the right parameters to each file automatically. It uses a two-step pipeline: a language model parses the prompt, then the C++ engine executes the compression.
                    </p>
                </details>

            </div>
        </section>
    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>

</div>

<style>
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
</style>