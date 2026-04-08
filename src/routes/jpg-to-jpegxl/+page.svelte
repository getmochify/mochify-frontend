<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert JPG to JPEG XL Online - Free & Fast | Mochify</title>
    <meta name="description" content="Convert JPG photos to JPEG XL instantly. Free, secure, and runs in-memory. No software installation required.">
    <meta property="og:title" content="Convert JPG to JPEG XL - Soft & Squishy Image Tools">
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Is JPEG XL better than WebP or AVIF?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. JPEG XL provides better generation loss characteristics and faster encoding/decoding speeds than AVIF, making it the superior choice for high-end photography."
            }
        }, {
            "@type": "Question",
            "name": "Is it safe to convert personal photos?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Mochify processes files in RAM and deletes them immediately after conversion. We never store your photos on a hard drive."
            }
        }]
    }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <div class="text-center mb-12 space-y-6">
            
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 18h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Works on iPhone, Mac & Windows
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert 
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    JPG
                </span> 
                to 
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPEG XL
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Future-proof your library with next-gen JPEG XL compression.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="jxl" types=".JPG, .JPEG" showTypes={false} />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="mt-8 grid md:grid-cols-2 gap-12 text-gray-700">
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert to JPEG XL?</h2>
                <p class="leading-relaxed text-[#6C3F31]">
                    JPEG XL (JXL) offers significantly better compression than standard JPEGs while supporting 
                    <strong>16-bit color</strong> and <strong>HDR</strong>. 
                </p>
                <p class="leading-relaxed text-[#6C3F31]">
                    Mochify uses the high-performance <strong class="text-[#7E685E]">libjxl</strong> C++ library to ensure your 
                    conversions are bit-perfect and processed in-memory for maximum privacy.
                </p>
            </div>

            <div class="space-y-4">
                <details class="group bg-white/60 p-6 rounded-3xl border border-white shadow-sm [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex items-center justify-between cursor-pointer font-semibold text-[#4A2C2C]">
                        Is this converter free?
                        <svg class="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p class="mt-4 leading-relaxed text-[#5D5454]">
                        Yes, 100% free. No watermarks, no limits.
                    </p>
                </details>

                <details class="group bg-white/60 p-6 rounded-3xl border border-white shadow-sm [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex items-center justify-between cursor-pointer font-semibold text-[#4A2C2C]">
                        Do you see my photos?
                        <svg class="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p class="mt-4 leading-relaxed text-[#6C3F31]">
                        Never. Your images are processed in the server's RAM (Random Access Memory) and are deleted the instant the conversion is finished. Nothing touches our hard drive.
                    </p>
                </details>
            </div>
        </div>
        </section>

    </div>
    
    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
