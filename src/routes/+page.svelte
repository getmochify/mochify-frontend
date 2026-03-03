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
                "softwareVersion": "0.1.0-alpha"
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