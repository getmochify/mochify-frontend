<script lang="ts">
    import { onMount } from 'svelte';
    import PromptForm from '$lib/components/PromptForm.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import { getPlan } from '$lib/user';

    let showVideoModal: boolean = $state(false);
    let showUpgradeCTA: boolean = $state(false);
    let upgradeCTADismissed: boolean = $state(false);

    let installPrompt: BeforeInstallPromptEvent | null = $state(null);
    let installDismissed: boolean = $state(false);
    let isIosInstall: boolean = $state(false);
    let showIosTooltip: boolean = $state(false);

    async function handleSuccess() {
        if (!upgradeCTADismissed) {
            const plan = await getPlan();
            if (plan === 'free') showUpgradeCTA = true;
        }
    }

    onMount(() => {
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

        const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true);
        if (isIos && !isStandalone) isIosInstall = true;

        return () => {
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
    <meta property="og:url" content="https://mochify.app/" />
    <meta property="og:title" content="Mochify | Intelligent Image Workflows & Next-Gen Compression" />
    <meta property="og:description" content="Bulk process images with natural language. Smart square-crop for Shopify, next-gen AVIF/JXL compression, and a native MCP server for AI agents. Fast, private, and zero-retention." />
    <meta property="og:image" content="https://mochify.app/screenshot_v3_mochified.webp" />
    <meta property="og:image:alt" content="Mochify image compressor interface" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Mochify | Intelligent Image Workflows & Next-Gen Compression" />
    <meta name="twitter:description" content="Bulk process images with natural language. Smart square-crop for Shopify, next-gen AVIF/JXL compression, and a native MCP server for AI agents. Fast, private, and zero-retention." />
    <meta name="twitter:image" content="https://mochify.app/screenshot_v3_mochified.webp" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": "Mochify",
                "url": "https://mochify.app",
                "description": "Bulk image compressor for WebP, HEIC, JXL & AVIF. Try 3 images free without signing up. Free account unlocks 25 images per month. Native C++ engine — files never touch disk.",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "featureList": [
                    "AVIF, WebP, JXL, Jpegli compression",
                    "Batch processing up to 25 files (Seller & Pro) or 3 files free",
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
                            "text": "Yes. Try 3 images free without an account. Create a free account (no credit card) for 25 images per month — up to 20 MB each — with all next-generation formats included. Seller ($7.99/month) unlocks 300 images per month and a dedicated API key. Pro ($24.99/month) unlocks 1,200 images per month, CLI access, and MCP server support for AI agents."
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
                            "text": "Input formats: JPEG, PNG, WebP, AVIF, HEIC/HEIF, and JPEG XL. Output formats: JPEG (via Jpegli), PNG, WebP, AVIF, and JPEG XL. Free users can process 3 files per batch; Seller and Pro unlock batches up to 25 files. For even larger volumes, use the REST API or CLI."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does Mochify have an API?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. The REST API is available at api.mochify.app. Without an API key, 3 images per month are available (IP-based). Create a free account for 25 images per month. Seller provides 300 and Pro provides 1,200 — both include a Bearer-token key for higher-volume automation."
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

<div class="min-h-screen flex flex-col relative">
    
    <Navigation />
    
    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <header class="text-center mb-10">
            <h1 class="text-5xl md:text-7xl font-black text-[#4A2C2C] leading-tight tracking-tight mb-3">
                Mochify
            </h1>
            <h2 class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70 mb-4">PROMPT-DRIVEN IMAGE CONVERTER & SMART CROP PIPELINE</h2>
            <p class="text-[#6C3F31] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Compress, convert and reformat images in bulk - just type what you need. Mochify's AI reads your instructions and its fast native engine does the rest.
            </p>
            <p class="text-xs text-[#9A7050] mt-2">3 files free per batch · 25 with <a href="/pricing" class="hover:text-[#F06292] transition-colors">Seller or Pro</a></p>

            {#if (installPrompt && !installDismissed) || isIosInstall}
                <button
                    onclick={installPrompt ? triggerInstall : () => (showIosTooltip = true)}
                    class="md:hidden inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-[#F06292]/25 bg-gradient-to-r from-[#F06292]/8 to-[#875F42]/6 hover:from-[#F06292]/15 hover:to-[#875F42]/12 hover:border-[#F06292]/40 shadow-sm hover:shadow-[0_2px_12px_rgba(240,98,146,0.15)] transition-all duration-200 group"
                >
                    <svg class="w-3.5 h-3.5 text-[#F06292]/70 group-hover:text-[#F06292] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>
                    <span class="text-xs font-semibold text-[#6C3F31]/70 group-hover:text-[#6C3F31] transition-colors">Add to Home Screen</span>
                </button>
            {/if}

            {#if showIosTooltip}
                <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                <div role="presentation" class="fixed inset-0 z-50 flex items-end justify-center pb-6 px-4" onclick={() => (showIosTooltip = false)}>
                    <div role="dialog" aria-modal="true" aria-labelledby="ios-tooltip-title" tabindex="-1" class="w-full max-w-sm bg-[#FDFBF7] border border-[#F06292]/20 rounded-2xl shadow-xl p-5" onclick={(e) => e.stopPropagation()}>
                        <div class="flex items-start justify-between mb-3">
                            <p id="ios-tooltip-title" class="text-sm font-semibold text-[#4A2C2C]">Add Mochify to your Home Screen</p>
                            <button onclick={() => (showIosTooltip = false)} aria-label="Close" class="text-[#875F42]/50 hover:text-[#875F42] transition-colors ml-3 shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <ol class="space-y-2.5">
                            <li class="flex items-center gap-3 text-xs text-[#6C3F31]">
                                <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#F06292]/15 text-[#F06292] font-bold shrink-0">1</span>
                                <span>Tap the <strong>Share</strong> button in Safari</span>
                                <svg class="w-4 h-4 text-[#F06292]/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M12 3v12m0-12l-3 3m3-3l3 3"/>
                                </svg>
                            </li>
                            <li class="flex items-center gap-3 text-xs text-[#6C3F31]">
                                <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#F06292]/15 text-[#F06292] font-bold shrink-0">2</span>
                                <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
                            </li>
                            <li class="flex items-center gap-3 text-xs text-[#6C3F31]">
                                <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#F06292]/15 text-[#F06292] font-bold shrink-0">3</span>
                                <span>Tap <strong>Add</strong> to confirm</span>
                            </li>
                        </ol>
                    </div>
                </div>
            {/if}
        </header>

        <div class="w-full flex flex-col items-center relative mt-10 mb-16">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[250px] bg-gradient-to-r from-pink-200/0 via-pink-200/20 to-pink-200/0 blur-3xl rounded-full pointer-events-none -z-10"></div>
            <div class="w-full flex justify-center items-start relative z-10">
                <div class="w-full max-w-3xl drop-shadow-[0_12px_30px_rgba(240,98,146,0.08)]">
                    <PromptForm onSuccess={handleSuccess} />
                </div>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-4 mt-4">
                <a
                    href="https://github.com/getmochify/mochify-cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs text-[#875F42]/50 hover:text-[#F06292] transition-colors duration-200 group"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/></svg>
                    Automate with CLI or MCP
                    <svg class="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                </a>
                <span class="text-[#875F42]/20 text-xs">·</span>
                <a
                    href="https://chromewebstore.google.com/detail/pgegchhkcjdcnnppeahkdcalclpaamcj"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs text-[#875F42]/50 hover:text-[#F06292] transition-colors duration-200 group"
                >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2.5a7.5 7.5 0 0 1 6.547 3.836L12 8.5a3.5 3.5 0 0 0-3.432 2.793L5.12 5.868A7.474 7.474 0 0 1 12 4.5zm-7.37 2.855 4.028 6.976A3.496 3.496 0 0 0 8.5 12a3.5 3.5 0 0 0 .04.5H4.543A7.47 7.47 0 0 1 4.5 12c0-1.705.57-3.277 1.53-4.545zM12 19.5a7.47 7.47 0 0 1-5.99-3.004l3.24-5.613A3.494 3.494 0 0 0 12 15.5a3.494 3.494 0 0 0 3.158-2.006l2.318 4.016A7.467 7.467 0 0 1 12 19.5zm5.84-3.432-3.226-5.587c.248-.447.386-.96.386-1.481a3.5 3.5 0 0 0-3.5-3.5H12l3.453-3.453A7.5 7.5 0 0 1 19.5 12a7.47 7.47 0 0 1-1.66 4.068z"/></svg>
                    Chrome Extension
                    <svg class="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                </a>
                <span class="text-[#875F42]/20 text-xs">·</span>
                <button
                    onclick={() => (showVideoModal = true)}
                    class="inline-flex items-center gap-1.5 text-xs text-[#875F42]/50 hover:text-[#F06292] transition-colors duration-200 group cursor-pointer"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
                    See it in action
                </button>
            </div>
        </div>

        {#if showUpgradeCTA}
        <div class="max-w-3xl mx-auto px-1 -mt-6 mb-4 animate-slide-up">
            <div class="relative rounded-2xl overflow-hidden glass-card-pink shadow-sm">
                <button
                    onclick={() => { showUpgradeCTA = false; upgradeCTADismissed = true; }}
                    class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#875F42]/40 hover:text-[#7A5A3A] transition-all cursor-pointer"
                    aria-label="Dismiss"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <div class="px-5 pt-4 pb-1">
                    <p class="text-xs font-extrabold tracking-widest uppercase text-[#F06292]/60 mb-0.5">You're on the free plan</p>
                    <h3 class="text-base font-black text-[#4A2C2C] leading-snug">Running a lot of images? Get more headroom.</h3>
                    <p class="text-xs text-[#7A5A3A] mt-1">Free account gives you 25 ops/month. Upgrade for priority processing, larger files, and more volume.</p>
                </div>
                <div class="grid grid-cols-2 gap-2 px-5 py-3">
                    <a
                        href="/pricing"
                        class="group relative rounded-xl border border-[#875F42]/12 bg-white/60 hover:bg-white hover:border-[#875F42]/20 hover:shadow-sm transition-all duration-200 px-4 py-3 flex flex-col gap-0.5"
                    >
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-lg font-black text-[#4A2C2C]">$7.99</span>
                            <span class="text-xs font-semibold text-[#875F42]/50">/mo</span>
                            <span class="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#875F42]/40 bg-[#F5E6E8]/60 rounded-full px-2 py-0.5">Seller</span>
                        </div>
                        <p class="text-xs font-semibold text-[#6C3F31]">300 images · 75MB files</p>
                        <p class="text-[11px] text-[#875F42]/60 mt-0.5">10× more volume · priority queue</p>
                    </a>
                    <a
                        href="/pricing"
                        class="group relative rounded-xl border border-[#F06292]/20 bg-gradient-to-br from-[#FFF0F3]/80 to-white/60 hover:from-[#FFF0F3] hover:to-white hover:border-[#F06292]/35 hover:shadow-sm transition-all duration-200 px-4 py-3 flex flex-col gap-0.5"
                    >
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-lg font-black text-[#4A2C2C]">$24.99</span>
                            <span class="text-xs font-semibold text-[#875F42]/50">/mo</span>
                            <span class="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#F06292]/70 bg-[#FFF0F3] rounded-full px-2 py-0.5">Pro</span>
                        </div>
                        <p class="text-xs font-semibold text-[#6C3F31]">1,200 images · 75MB</p>
                        <p class="text-[11px] text-[#875F42]/60 mt-0.5">40× volume · top priority</p>
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

        <section class="mt-24 max-w-4xl mx-auto reveal">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">

                <div class="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">Bulk Prompt Processing</h3>
                    <p class="text-[#7A5A3A] text-sm leading-relaxed">Zero lag. Process dozens of high-res images in milliseconds under a single prompt without slowing down your browser.</p>
                </div>

                <div class="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">WebP & AVIF Web Optimization</h3>
                    <p class="text-[#7A5A3A] text-sm leading-relaxed">Get files up to 35% smaller than standard compression without losing a single pixel of clarity or product detail.</p>
                </div>

                <div class="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">Zero Retention</h3>
                    <p class="text-[#7A5A3A] text-sm leading-relaxed">Streamed into server RAM, compressed, and wiped immediately. No cloud storage, no logs, no trace — not even on free plans.</p>
                </div>

                <div class="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300 group">
                    <div class="w-9 h-9 rounded-xl bg-[#FFF0F3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                        </svg>
                    </div>
                    <h3 class="font-bold text-[#4A2C2C] text-sm mb-1">Next-gen Free</h3>
                    <p class="text-[#7A5A3A] text-sm leading-relaxed">AVIF, JPEG XL, WebP, and Jpegli on every plan — free included. No codec paywalls, no format upsells.</p>
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
                </a>
            </div>

        </section>

        <section class="mt-16 max-w-4xl mx-auto reveal">
            <h2 class="text-center text-2xl font-black text-[#4A2C2C] mb-2">A new way to work with images</h2>
            <p class="text-center text-sm text-[#7A5A3A] mb-8">Stop clicking through tools. Just describe what you need.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div class="rounded-2xl border border-[#E8D5C4]/50 bg-white/25 px-6 py-7 md:px-8 md:py-8">
                    <p class="text-xs font-bold tracking-widest uppercase text-cocoa-milk/60 mb-5">The old way</p>
                    <ol class="space-y-3">
                        {#each [
                            'Open a browser tab, find a tool',
                            'Upload each file individually',
                            'Manually set format & quality sliders',
                            'Wait for upload and processing',
                            'Download, rename, organise files',
                            'Repeat for every format you need',
                        ] as step, i}
                        <li class="flex items-start gap-2.5">
                            <span class="shrink-0 w-5 h-5 rounded-full bg-[#F5E6E8]/50 text-cocoa-milk/55 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                            <span class="text-sm text-[#7A5A3A] leading-snug">{step}</span>
                        </li>
                        {/each}
                    </ol>
                </div>

                <div class="rounded-2xl bg-linear-to-br from-[#FFF0F3]/80 to-white/60 border border-mochi-pink/20 px-6 py-7 md:px-8 md:py-8 shadow-[0_4px_24px_rgba(240,98,146,0.08)] flex flex-col justify-between gap-5">
                    <div>
                        <p class="text-xs font-bold tracking-widest uppercase text-[#F06292]/70 mb-5">The Mochify way</p>
                        <div class="rounded-xl border border-mochi-pink/15 bg-white/70 px-4 py-3.5 mb-4">
                            <p class="text-[10px] font-semibold text-mochi-pink/60 uppercase tracking-wider mb-1.5">✦ Magic Flow</p>
                            <p class="text-sm text-[#4A2C2C] font-medium leading-relaxed">"Convert to WebP, strip EXIF, max 1600px wide"</p>
                        </div>
                        <div class="flex items-center gap-3 mb-4 px-1">
                            <div class="flex-1 h-px bg-mochi-pink/12"></div>
                            <span class="text-[11px] text-mochi-pink/50 font-semibold whitespace-nowrap">done in 1.2s</span>
                            <div class="flex-1 h-px bg-mochi-pink/12"></div>
                        </div>
                        <div class="rounded-xl border border-mochi-pink/10 bg-white/40 px-4 py-3">
                            <div class="flex items-center gap-2 mb-1">
                                <svg class="w-3.5 h-3.5 text-[#F06292] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <p class="text-xs font-bold text-[#4A2C2C]">6 files processed</p>
                            </div>
                            <p class="text-xs text-[#7A5A3A]">EXIF stripped · 1600px max · Smart-crop: subject centred · avg 68% smaller</p>
                        </div>
                    </div>
                    <p class="text-xs text-cocoa-milk/50 leading-relaxed">Drop your files, type what you want, get them back. No format pickers, no quality sliders, no repeat.</p>
                </div>

            </div>
        </section>

        <section class="mt-6 max-w-4xl mx-auto reveal">
            <div class="rounded-2xl border border-cocoa-milk/10 bg-white/20 px-6 py-6 md:px-8 md:py-7">
                <div class="flex flex-col md:flex-row md:items-center gap-6">
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold tracking-widest uppercase text-cocoa-milk/45 mb-1.5">For developers &amp; AI workflows</p>
                        <h3 class="text-base font-black text-[#4A2C2C] mb-1.5">Works where you work</h3>
                        <p class="text-sm text-cocoa-deep leading-relaxed">Same engine, no browser required. Compress images from your terminal, build scripts, or directly inside Claude.</p>
                    </div>
                    <div class="flex flex-row md:flex-col gap-2.5 shrink-0">
                        <a
                            href="https://github.com/getmochify/mochify-cli"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/50 border border-cocoa-milk/12 hover:bg-white/80 hover:border-cocoa-milk/22 transition-all duration-200 group"
                        >
                            <svg class="w-3.5 h-3.5 text-cocoa-milk/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
                            </svg>
                            <div>
                                <p class="text-xs font-bold text-[#4A2C2C] leading-none mb-0.5">CLI</p>
                                <p class="text-[10px] text-cocoa-milk/55">Terminal &amp; scripts</p>
                            </div>
                        </a>
                        <a
                            href="https://github.com/getmochify/mochify-cli"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/50 border border-cocoa-milk/12 hover:bg-white/80 hover:border-cocoa-milk/22 transition-all duration-200 group"
                        >
                            <svg class="w-3.5 h-3.5 text-cocoa-milk/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                            </svg>
                            <div>
                                <p class="text-xs font-bold text-[#4A2C2C] leading-none mb-0.5">MCP Server</p>
                                <p class="text-[10px] text-cocoa-milk/55">Claude Desktop &amp; Claude Code</p>
                            </div>
                        </a>
                        <a
                            href="https://chromewebstore.google.com/detail/pgegchhkcjdcnnppeahkdcalclpaamcj"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/50 border border-cocoa-milk/12 hover:bg-white/80 hover:border-cocoa-milk/22 transition-all duration-200 group"
                        >
                            <svg class="w-3.5 h-3.5 text-cocoa-milk/60 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2.5a7.5 7.5 0 0 1 6.547 3.836L12 8.5a3.5 3.5 0 0 0-3.432 2.793L5.12 5.868A7.474 7.474 0 0 1 12 4.5zm-7.37 2.855 4.028 6.976A3.496 3.496 0 0 0 8.5 12a3.5 3.5 0 0 0 .04.5H4.543A7.47 7.47 0 0 1 4.5 12c0-1.705.57-3.277 1.53-4.545zM12 19.5a7.47 7.47 0 0 1-5.99-3.004l3.24-5.613A3.494 3.494 0 0 0 12 15.5a3.494 3.494 0 0 0 3.158-2.006l2.318 4.016A7.467 7.467 0 0 1 12 19.5zm5.84-3.432-3.226-5.587c.248-.447.386-.96.386-1.481a3.5 3.5 0 0 0-3.5-3.5H12l3.453-3.453A7.5 7.5 0 0 1 19.5 12a7.47 7.47 0 0 1-1.66 4.068z"/>
                            </svg>
                            <div>
                                <p class="text-xs font-bold text-[#4A2C2C] leading-none mb-0.5">Chrome Extension</p>
                                <p class="text-[10px] text-cocoa-milk/55">Compress from any page</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section class="mt-16 max-w-4xl mx-auto reveal">
            <div class="glass-card rounded-2xl shadow-sm overflow-hidden">
                <div class="px-6 py-8 md:px-10 md:py-10">
                    <p class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70 mb-2">Shopify &amp; Ecommerce</p>
                    <h2 class="text-2xl font-black text-[#4A2C2C] mb-3">Better Core Web Vitals start with smaller product images</h2>
                    <p class="text-sm text-[#6C3F31] leading-relaxed max-w-2xl mb-8">
                        Largest Contentful Paint (LCP) is Google's primary page speed signal — and product images are almost always the bottleneck. Converting your catalogue to AVIF or WebP can cut file sizes by up to 50% with no visible quality loss, directly improving your store's search ranking and conversion rate.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="glass-card rounded-xl px-4 py-4">
                            <p class="text-xs font-bold text-[#F06292] uppercase tracking-wider mb-1">Up to 50% smaller</p>
                            <p class="text-sm font-bold text-[#4A2C2C] mb-1">AVIF for product images</p>
                            <p class="text-xs text-[#7A5A3A] leading-relaxed">AVIF cuts file size roughly in half versus JPEG at equivalent quality — the fastest format Shopify supports.</p>
                        </div>
                        <div class="glass-card rounded-xl px-4 py-4">
                            <p class="text-xs font-bold text-[#F06292] uppercase tracking-wider mb-1">Bulk processing</p>
                            <p class="text-sm font-bold text-[#4A2C2C] mb-1">Process your whole catalogue</p>
                            <p class="text-xs text-[#7A5A3A] leading-relaxed">Drop up to 25 product images at once. Describe what you need — "convert to WebP, max 1600px wide" — and Mochify handles the rest.</p>
                        </div>
                        <div class="glass-card rounded-xl px-4 py-4">
                            <p class="text-xs font-bold text-[#F06292] uppercase tracking-wider mb-1">Zero retention</p>
                            <p class="text-sm font-bold text-[#4A2C2C] mb-1">Product images stay private</p>
                            <p class="text-xs text-[#7A5A3A] leading-relaxed">Images are never stored or logged. Safe for unreleased products, private SKUs, and anything not yet live on your store.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="mt-16 max-w-4xl mx-auto reveal">
            <h2 class="text-center text-2xl font-black text-[#4A2C2C] mb-2">Frequently asked questions</h2>
            <p class="text-center text-sm text-[#7A5A3A] mb-8">Everything you need to know before compressing your first batch.</p>
            <div class="space-y-2">

                <details class="group glass-card rounded-2xl shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Is Mochify free to use?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed">
                        Yes. Try 3 images free without an account — no sign-up needed. Create a free account (no credit card) for 25 images per month, up to 20 MB each, with all next-generation formats included at no cost. Seller ($7.99/month) unlocks 300 images per month and a dedicated API key. Pro ($24.99/month) unlocks 1,200 images per month, CLI access, and MCP server support for AI agents.
                    </p>
                </details>

                <details class="group glass-card rounded-2xl shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Are my images stored or shared?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed">
                        No. Mochify streams each file directly into server RAM, compresses it with a native C++ engine, and returns the result. Files are never written to disk and are wiped from memory immediately after processing. There is no cloud storage, no third-party access, and no logs containing your image data.
                    </p>
                </details>

                <details class="group glass-card rounded-2xl shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        How much smaller will my images be?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed">
                        Results depend on format and source content. Jpegli typically produces files 35% smaller than standard JPEG at equivalent visual quality. AVIF averages 50% smaller than JPEG and 20% smaller than WebP. WebP averages 26% smaller than JPEG. Smart Compress mode automatically targets the best quality-to-size balance for each individual image, so you never have to guess a quality setting.
                    </p>
                </details>

                <details class="group glass-card rounded-2xl shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        What image formats does Mochify support?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed">
                        Input formats: JPEG, PNG, WebP, AVIF, HEIC/HEIF, and JPEG XL. Output formats: JPEG (via Jpegli), PNG, WebP, AVIF, and JPEG XL. Free users can process up to 3 files per batch with no account required; Seller and Pro plans unlock batches up to 25 files. For even larger volumes, use the REST API or CLI — both support scripted bulk processing with no per-file overhead.
                    </p>
                </details>

                <details class="group glass-card rounded-2xl shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        Does Mochify have an API?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed">
                        Yes. The REST API is available at <code class="font-mono text-xs text-[#F06292]">api.mochify.app</code>. Without an API key, 3 images per month are available (IP-based) — just send a raw image body to <code class="font-mono text-xs text-[#F06292]">POST /v1/squish</code> with a <code class="font-mono text-xs">?type=</code> parameter. Create a free account for 25 images/month. Seller provides 300 and Pro provides 1,200 — both include a Bearer-token key for higher-volume automation. See the <a href="/docs" class="text-[#F06292] font-semibold hover:underline">API documentation</a> for examples in cURL, JavaScript, and Python.
                    </p>
                </details>

                <details class="group glass-card rounded-2xl shadow-sm open:shadow-md transition-all duration-200">
                    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                        What is Magic Flow?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed">
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

{#if showVideoModal}
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    onclick={() => (showVideoModal = false)}
>
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <!-- Modal -->
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
        class="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
        style="background: rgba(253,251,247,0.15); backdrop-filter: blur(24px) saturate(1.6);"
        onclick={(e) => e.stopPropagation()}
    >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/15">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#F06292]/70"></div>
                <span class="text-sm font-semibold text-white/90" style="font-family: 'Outfit', sans-serif;">Mochify in action</span>
            </div>
            <button
                onclick={() => (showVideoModal = false)}
                class="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        <!-- Video -->
        <div class="aspect-[16/10] bg-black/20">
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
                class="w-full h-full object-cover"
                autoplay
                loop
                muted
                playsinline
                preload="none"
            >
                <source src="https://assets.mochify.xyz/mochi.webm" type="video/webm" />
                <source src="https://assets.mochify.xyz/mochi.mp4" type="video/mp4" />
            </video>
        </div>
    </div>
</div>
{/if}

<style>
    .glass-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.12) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 4px 24px rgba(240, 98, 146, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }
    .glass-card-pink {
        background: linear-gradient(135deg, rgba(255, 240, 243, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(240, 98, 146, 0.18);
        box-shadow: 0 4px 24px rgba(240, 98, 146, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }
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