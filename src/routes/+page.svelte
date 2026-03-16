<script lang="ts">
    import { onMount } from 'svelte';
    import PromptForm from '$lib/components/PromptForm.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';

    let fileCount = $state(25);
    let fileSizeMB = $state(20);
    
    let showUpgradeCTA: boolean = $state(false);
    let upgradeCTADismissed: boolean = $state(false);
    let showBgRemovalCTA: boolean = $state(false);

    let installPrompt: BeforeInstallPromptEvent | null = $state(null);
    let installDismissed: boolean = $state(false);

    function handleSuccess() {
        showBgRemovalCTA = false;
        if (!upgradeCTADismissed) showUpgradeCTA = true;
    }

    function handleBgRemovalUpsell() {
        showUpgradeCTA = false;
        showBgRemovalCTA = true;
    }

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

        const onBeforeInstall = (e: Event) => {
            e.preventDefault();
            installPrompt = e as BeforeInstallPromptEvent;
        };
        window.addEventListener('beforeinstallprompt', onBeforeInstall);

        return () => {
            clearTimeout(t);
            observer.disconnect();
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        };
    });

    async function triggerInstall() {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            installPrompt = null;
            installDismissed = true;
        }
    }
</script>

<svelte:head>
    <title>Mochify | Intelligent Image Workflows & Next-Gen Compression</title>
    <meta name="description" content="Bulk process images with natural language. Smart square-crop for Shopify, next-gen AVIF/JXL compression, and a native MCP server for AI agents. Fast & private.">

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mochify.xyz/" />
    <meta property="og:title" content="Mochify | Intelligent Image Workflows & Next-Gen Compression" />
    <meta property="og:description" content="Bulk process images with natural language. Smart square-crop for Shopify, next-gen AVIF/JXL compression, and a native MCP server for AI agents. Fast, private, and zero-retention." />
    <meta property="og:image" content="https://mochify.xyz/screenshot_v3_mochified.webp" />
    <meta property="og:image:alt" content="Mochify image compressor interface" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Mochify | Intelligent Image Workflows & Next-Gen Compression" />
    <meta name="twitter:description" content="Bulk process images with natural language. Smart square-crop for Shopify, next-gen AVIF/JXL compression, and a native MCP server for AI agents. Fast, private, and zero-retention." />
    <meta name="twitter:image" content="https://mochify.xyz/screenshot_v3_mochified.webp" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": "Mochify",
                "url": "https://mochify.xyz",
                "description": "Bulk image compressor for WebP, HEIC, JXL & AVIF. Try 3 images free without signing up. Free account unlocks 30 images per month. Native C++ engine — files never touch disk.",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "featureList": [
                    "AVIF, WebP, JXL, Jpegli compression",
                    "Batch processing up to 25 files (Lite & Pro) or 3 files free",
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
                            "text": "Yes. Try 3 images free without an account. Create a free account (no credit card) for 30 images per month — up to 20 MB each — with all next-generation formats included. Lite ($5/month) unlocks 300 images per month and a dedicated API key. Pro ($12/month) unlocks 1,200 images per month, CLI access, and MCP server support for AI agents."
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
                            "text": "Input formats: JPEG, PNG, WebP, AVIF, HEIC/HEIF, and JPEG XL. Output formats: JPEG (via Jpegli), PNG, WebP, AVIF, and JPEG XL. Free users can process 3 files per batch; Lite and Pro unlock batches up to 25 files. For even larger volumes, use the REST API or CLI."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does Mochify have an API?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. The REST API is available at api.mochify.xyz. Without an API key, 3 images per month are available (IP-based). Create a free account for 30 images per month. Lite provides 300 and Pro provides 1,200 — both include a Bearer-token key for higher-volume automation."
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
            <h2 class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70 mb-4">AI-POWERED IMAGE WORKFLOWS</h2>
            <p class="text-[#6C3F31] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Bulk process images using natural language. Crop to subjects, convert to next-gen formats, and strip metadata in seconds with our high-performance C++ engine.
            </p>
            <p class="text-xs text-[#875F42]/50 mt-2">3 files free per batch · 25 with <a href="/pricing" class="hover:text-[#F06292] transition-colors">Lite or Pro</a></p>
            <a
                href="https://github.com/getmochify/mochify-cli"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden md:inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-[#F06292]/25 bg-gradient-to-r from-[#F06292]/8 to-[#875F42]/6 hover:from-[#F06292]/15 hover:to-[#875F42]/12 hover:border-[#F06292]/40 shadow-sm hover:shadow-[0_2px_12px_rgba(240,98,146,0.15)] transition-all duration-200 group"
            >
                <svg class="w-3.5 h-3.5 text-[#F06292]/70 group-hover:text-[#F06292] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
                </svg>
                <span class="text-xs font-semibold text-[#6C3F31]/70 group-hover:text-[#6C3F31] transition-colors">Automate with CLI or MCP</span>
                <svg class="w-3 h-3 text-[#F06292]/50 group-hover:text-[#F06292]/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                </svg>
            </a>

            {#if installPrompt && !installDismissed}
                <button
                    onclick={triggerInstall}
                    class="md:hidden inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-[#F06292]/25 bg-gradient-to-r from-[#F06292]/8 to-[#875F42]/6 hover:from-[#F06292]/15 hover:to-[#875F42]/12 hover:border-[#F06292]/40 shadow-sm hover:shadow-[0_2px_12px_rgba(240,98,146,0.15)] transition-all duration-200 group"
                >
                    <svg class="w-3.5 h-3.5 text-[#F06292]/70 group-hover:text-[#F06292] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>
                    <span class="text-xs font-semibold text-[#6C3F31]/70 group-hover:text-[#6C3F31] transition-colors">Add to Home Screen</span>
                </button>
            {/if}
        </header>

        <div class="w-full flex flex-col items-center relative mt-10 mb-16">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[250px] bg-gradient-to-r from-pink-200/0 via-pink-200/20 to-pink-200/0 blur-3xl rounded-full pointer-events-none -z-10"></div>
            <div class="w-full flex justify-center items-start relative z-10">
                <div class="w-full max-w-3xl drop-shadow-[0_12px_30px_rgba(240,98,146,0.08)]">
                    <PromptForm onSuccess={handleSuccess} onBgRemovalUpsell={handleBgRemovalUpsell} />
                </div>
            </div>
        </div>

        {#if showUpgradeCTA}
        <div class="max-w-3xl mx-auto px-1 -mt-6 mb-4 animate-slide-up">
            <div class="relative rounded-2xl border border-[#F06292]/15 bg-gradient-to-br from-white/70 to-[#FFF0F3]/50 backdrop-blur-sm shadow-sm overflow-hidden">
                <button
                    onclick={() => { showUpgradeCTA = false; upgradeCTADismissed = true; }}
                    class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#875F42]/40 hover:text-[#875F42]/70 transition-all cursor-pointer"
                    aria-label="Dismiss"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <div class="px-5 pt-4 pb-1">
                    <p class="text-xs font-extrabold tracking-widest uppercase text-[#F06292]/60 mb-0.5">You're on the free plan</p>
                    <h3 class="text-base font-black text-[#4A2C2C] leading-snug">Running a lot of images? Get more headroom.</h3>
                    <p class="text-xs text-[#875F42]/70 mt-1">Free account gives you 30 ops/month. Upgrade for priority processing, larger files, and more volume.</p>
                </div>
                <div class="grid grid-cols-2 gap-2 px-5 py-3">
                    <a
                        href="/pricing"
                        class="group relative rounded-xl border border-[#875F42]/12 bg-white/60 hover:bg-white hover:border-[#875F42]/20 hover:shadow-sm transition-all duration-200 px-4 py-3 flex flex-col gap-0.5"
                    >
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-lg font-black text-[#4A2C2C]">$5</span>
                            <span class="text-xs font-semibold text-[#875F42]/50">/mo</span>
                            <span class="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#875F42]/40 bg-[#F5E6E8]/60 rounded-full px-2 py-0.5">Lite</span>
                        </div>
                        <p class="text-xs font-semibold text-[#6C3F31]">300 images · 75MB files</p>
                        <p class="text-[11px] text-[#875F42]/60 mt-0.5">10× more volume · priority queue</p>
                    </a>
                    <a
                        href="/pricing"
                        class="group relative rounded-xl border border-[#F06292]/20 bg-gradient-to-br from-[#FFF0F3]/80 to-white/60 hover:from-[#FFF0F3] hover:to-white hover:border-[#F06292]/35 hover:shadow-sm transition-all duration-200 px-4 py-3 flex flex-col gap-0.5"
                    >
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-lg font-black text-[#4A2C2C]">$12</span>
                            <span class="text-xs font-semibold text-[#875F42]/50">/mo</span>
                            <span class="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#F06292]/70 bg-[#FFF0F3] rounded-full px-2 py-0.5">Pro</span>
                        </div>
                        <p class="text-xs font-semibold text-[#6C3F31]">1,200 images · 75MB · BG removal</p>
                        <p class="text-[11px] text-[#875F42]/60 mt-0.5">40× volume · top priority · BG removal</p>
                    </a>
                </div>
                <div class="px-5 pb-4">
                    <a
                        href="/pricing"
                        class="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#FF9EBB] to-[#F06292] text-white text-sm font-bold shadow-[0_4px_14px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_20px_rgba(240,98,146,0.5)] hover:-translate-y-px transition-all duration-200"
                    >
                        See all plans &amp; pricing →
                    </a>
                </div>
            </div>
        </div>
        {/if}

        {#if showBgRemovalCTA}
        <div class="max-w-3xl mx-auto px-1 -mt-6 mb-4 animate-slide-up">
            <div class="relative rounded-2xl border border-[#A5D6A7]/30 bg-gradient-to-br from-white/70 to-[#F4FBF2]/60 backdrop-blur-sm shadow-sm overflow-hidden">
                <button
                    onclick={() => { showBgRemovalCTA = false; }}
                    class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#875F42]/40 hover:text-[#875F42]/70 transition-all cursor-pointer"
                    aria-label="Dismiss"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <div class="px-5 pt-4 pb-1 flex items-start gap-3">
                    <div class="mt-0.5 w-8 h-8 rounded-xl bg-[#A5D6A7]/30 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-[#3A6B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-xs font-extrabold tracking-widest uppercase text-[#3A6B3C]/70 mb-0.5">Your images are ready</p>
                        <h3 class="text-base font-black text-[#4A2C2C] leading-snug">Background removal is a Lite &amp; Pro feature</h3>
                        <p class="text-xs text-[#875F42]/70 mt-1">We processed your images without it. Upgrade to automatically cut out backgrounds — starting at $5/mo.</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 px-5 py-3">
                    <a
                        href="/pricing"
                        class="group relative rounded-xl border border-[#875F42]/12 bg-white/60 hover:bg-white hover:border-[#875F42]/20 hover:shadow-sm transition-all duration-200 px-4 py-3 flex flex-col gap-0.5"
                    >
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-lg font-black text-[#4A2C2C]">$5</span>
                            <span class="text-xs font-semibold text-[#875F42]/50">/mo</span>
                            <span class="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#875F42]/40 bg-[#F5E6E8]/60 rounded-full px-2 py-0.5">Lite</span>
                        </div>
                        <p class="text-xs font-semibold text-[#6C3F31]">300 images · background removal</p>
                        <p class="text-[11px] text-[#875F42]/60 mt-0.5">Priority queue · 75MB files</p>
                    </a>
                    <a
                        href="/pricing"
                        class="group relative rounded-xl border border-[#F06292]/20 bg-gradient-to-br from-[#FFF0F3]/80 to-white/60 hover:from-[#FFF0F3] hover:to-white hover:border-[#F06292]/35 hover:shadow-sm transition-all duration-200 px-4 py-3 flex flex-col gap-0.5"
                    >
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-lg font-black text-[#4A2C2C]">$12</span>
                            <span class="text-xs font-semibold text-[#875F42]/50">/mo</span>
                            <span class="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#F06292]/70 bg-[#FFF0F3] rounded-full px-2 py-0.5">Pro</span>
                        </div>
                        <p class="text-xs font-semibold text-[#6C3F31]">1,200 images · background removal</p>
                        <p class="text-[11px] text-[#875F42]/60 mt-0.5">Top priority · 75MB files</p>
                    </a>
                </div>
                <div class="px-5 pb-4">
                    <a
                        href="/pricing"
                        class="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] text-white text-sm font-bold shadow-[0_4px_14px_rgba(165,214,167,0.4)] hover:shadow-[0_6px_20px_rgba(165,214,167,0.55)] hover:-translate-y-px transition-all duration-200"
                    >
                        Unlock background removal →
                    </a>
                </div>
            </div>
        </div>
        {/if}

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

            <!-- Comparison tool nudge -->
            <div class="mt-6 text-center">
                <a
                    href="/comparison"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#875F42]/12 bg-white/50 hover:bg-white/80 hover:border-[#F06292]/25 transition-all duration-200 group"
                >
                    <svg class="w-3.5 h-3.5 text-[#F06292]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3"/>
                    </svg>
                    <span class="text-xs font-semibold text-[#875F42]/60 group-hover:text-[#6C3F31] transition-colors">See before &amp; after with the comparison tool</span>
                    <svg class="w-3 h-3 text-[#875F42]/40 group-hover:text-[#875F42]/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                </a>
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
                            { feature: 'Free tier', tinypng: '3 / session', cloudinary: 'Trial only', mochify: '3 free (no signup) · 30/mo free account' },
                            { feature: 'Paid plan', tinypng: '$39/yr · web', cloudinary: '$75–$99/mo', mochify: 'from $5/mo · API, CLI & MCP' },
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
            <div class="rounded-2xl border border-white/80 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
                <div class="px-6 py-8 md:px-10 md:py-10">
                    <p class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70 mb-2">Shopify &amp; Ecommerce</p>
                    <h2 class="text-2xl font-black text-[#4A2C2C] mb-3">Better Core Web Vitals start with smaller product images</h2>
                    <p class="text-sm text-[#6C3F31]/80 leading-relaxed max-w-2xl mb-8">
                        Largest Contentful Paint (LCP) is Google's primary page speed signal — and product images are almost always the bottleneck. Converting your catalogue to AVIF or WebP can cut file sizes by up to 50% with no visible quality loss, directly improving your store's search ranking and conversion rate.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="rounded-xl bg-white/60 border border-white/80 px-4 py-4">
                            <p class="text-xs font-bold text-[#F06292] uppercase tracking-wider mb-1">Up to 50% smaller</p>
                            <p class="text-sm font-bold text-[#4A2C2C] mb-1">AVIF for product images</p>
                            <p class="text-xs text-[#875F42]/70 leading-relaxed">AVIF cuts file size roughly in half versus JPEG at equivalent quality — the fastest format Shopify supports.</p>
                        </div>
                        <div class="rounded-xl bg-white/60 border border-white/80 px-4 py-4">
                            <p class="text-xs font-bold text-[#F06292] uppercase tracking-wider mb-1">Bulk processing</p>
                            <p class="text-sm font-bold text-[#4A2C2C] mb-1">Process your whole catalogue</p>
                            <p class="text-xs text-[#875F42]/70 leading-relaxed">Drop up to 25 product images at once. Describe what you need — "convert to WebP, max 1600px wide" — and Mochify handles the rest.</p>
                        </div>
                        <div class="rounded-xl bg-white/60 border border-white/80 px-4 py-4">
                            <p class="text-xs font-bold text-[#F06292] uppercase tracking-wider mb-1">Zero retention</p>
                            <p class="text-sm font-bold text-[#4A2C2C] mb-1">Product images stay private</p>
                            <p class="text-xs text-[#875F42]/70 leading-relaxed">Images are never stored or logged. Safe for unreleased products, private SKUs, and anything not yet live on your store.</p>
                        </div>
                    </div>
                </div>
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
                        Yes. Try 3 images free without an account — no sign-up needed. Create a free account (no credit card) for 30 images per month, up to 20 MB each, with all next-generation formats included at no cost. Lite ($5/month) unlocks 300 images per month and a dedicated API key. Pro ($12/month) unlocks 1,200 images per month, CLI access, and MCP server support for AI agents.
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
                        Input formats: JPEG, PNG, WebP, AVIF, HEIC/HEIF, and JPEG XL. Output formats: JPEG (via Jpegli), PNG, WebP, AVIF, and JPEG XL. Free users can process up to 3 files per batch with no account required; Lite and Pro plans unlock batches up to 25 files. For even larger volumes, use the REST API or CLI — both support scripted bulk processing with no per-file overhead.
                    </p>
                </details>

                <details class="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Does Mochify have an API?
                        <svg class="w-4 h-4 text-[#F06292] flex-shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31]/80 leading-relaxed">
                        Yes. The REST API is available at <code class="font-mono text-xs text-[#F06292]">api.mochify.xyz</code>. Without an API key, 3 images per month are available (IP-based) — just send a raw image body to <code class="font-mono text-xs text-[#F06292]">POST /v1/squish</code> with a <code class="font-mono text-xs">?type=</code> parameter. Create a free account for 30 images/month. Lite provides 300 and Pro provides 1,200 — both include a Bearer-token key for higher-volume automation. See the <a href="/docs" class="text-[#F06292] font-semibold hover:underline">API documentation</a> for examples in cURL, JavaScript, and Python.
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
    @keyframes slide-up {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up {
        animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
</style>