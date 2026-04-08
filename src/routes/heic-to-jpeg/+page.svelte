<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert HEIC to JPEG Online - Free & Fast | Mochify</title>
    <meta name="description" content="Convert iPhone HEIC photos to JPEG instantly. Free, secure, and runs in-memory. No software installation required.">
    <meta property="og:title" content="Convert HEIC to JPEG - Soft & Squishy Image Tools">
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify HEIC to JPEG Converter",
            "operatingSystem": "Any",
            "applicationCategory": "MultimediaApplication",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
                },
            "featureList": "Privacy-focused, browser-side conversion, no file uploads to server"
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">
        
        <div class="text-center mb-12 space-y-6">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 18h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Works on iPhone, Mac & Windows
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert 
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    HEIC
                </span> 
                to 
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPEG
                </span>
            </h1>
            
            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn sticky iPhone photos into universally compatible JPEGs instantly.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload types=".HEIC, .HEIF, .HIF" showQuality={false} showTypes={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-center">
            
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert?</h2>
                <p class="leading-relaxed text-[#6C3F31]">
                    High Efficiency Image Container (HEIC) is standard on iPhones, but it can be a pain to open on Windows, Android, or web browsers. 
                </p>
                <p class="leading-relaxed text-[#6C3F31]">
                    Mochify converts these files to standard JPEGs so you can share them anywhere. We use <strong class="text-[#7E685E]">AVX-512 accelerated C++</strong> to ensure the conversion happens instantly.
                </p>
            </div>

            <div class="space-y-4">
                
                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] select-none list-none">
                        <span>Is this converter free?</span>
                        <span class="transition-transform duration-300 group-open:rotate-180 text-[#7E685E]">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="px-6 pb-6 text-[#6C3F31] leading-relaxed">
                        Yes, 100% free. No watermarks, no limits.
                    </div>
                </details>

                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] select-none list-none">
                        <span>Do you see my photos?</span>
                        <span class="transition-transform duration-300 group-open:rotate-180 text-[#7E685E]">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="px-6 pb-6 text-[#6C3F31] leading-relaxed">
                        Never. Your images are processed in the server's RAM (Random Access Memory) and are wiped the instant the conversion finishes.
                    </div>
                </details>
            </div>
        </div>
        </section>
    </div>
    
    
    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>