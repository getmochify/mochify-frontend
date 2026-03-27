<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert HIF to JPG Online (Fuji/Canon) - Free & Fast | Mochify</title>
    <meta name="description" content="Convert Fuji, Canon & Sony HIF photos to JPEG instantly. Perfect for photographers using X-T5, R5, or Sony Alpha. Free, secure, and runs in-memory.">
    <meta property="og:title" content="Convert HIF to JPG (Fuji/Canon) - Soft & Squishy Image Tools">

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify HIF to JPG Converter",
            "operatingSystem": "Any",
            "applicationCategory": "MultimediaApplication",
            "url": "https://mochify.app/solutions/hif-to-jpg",
            "description": "Instantly turn 10-bit Fuji, Canon & Sony HIF photos into universally compatible JPEGs using advanced Google Jpegli encoding.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            "featureList": [
                "Preserves 10-bit dynamic range via Jpegli psychovisual quantization",
                "Converts professional HDR containers to standard 8-bit JPEGs",
                "Browser-side privacy (no file uploads to server)",
                "Supports 10-bit HEIF/HIF formats from Fuji X-T5, Sony A7 IV, Canon R5"
            ],
            "applicationSubCategory": "Image Converter",
            "softwareRequirements": "Modern Web Browser"
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col">
    <Navigation />
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9InJnYmEoMjQwLCA5OCwgMTQ2LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] pointer-events-none"></div>

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">
        
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
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
            </h1>
            
            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn 10-bit Fuji, Canon & Sony HIF photos into universally compatible JPEGs instantly.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload types=".HEIF, .HIF" quality={90} output="jpg" showQuality={true} showTypes={false} compact queryParams="photography=1" showExifOption={true} />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
            
            <div class="space-y-8">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert HIF to JPG?</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        HIF is a modern container used by professional cameras to store <strong class="text-[#7E685E]">10-bit HDR photos</strong>. While they offer better color depth, they often fail to open on web browsers or older editing software.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Mochify converts these into standard 8-bit JPEGs using the advanced <strong class="text-[#7E685E]">Google Jpegli encoder</strong>. This ensures that while the file becomes 8-bit, the 10-bit dynamic range is visually preserved through advanced psychovisual quantization.
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

            <div class="space-y-4">                
                {#each [
                    { q: "Do you see my photos?", a: "Never. Your images are processed in RAM and deleted the instant you download them." },
                    { q: "What is the difference?", a: "HIF stores 10-bit color data in a tiny file. JPG is the 8-bit global standard. Shoots in HIF, share in JPG." },
                    { q: "Does this keep Fuji film sims?", a: "Yes, Mochify preserves Fuji film simulations (Velvia, Classic Chrome, etc.) so your intended look stays intact." },
                    { q: "What about EXIF metadata?", a: "By default, we preserve all camera metadata (ISO, Shutter, GPS). If you want to remove it for privacy, simply check the 'Strip Metadata' option before converting."}
                ] as faq}
                    <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none">
                            <span>{faq.q}</span>
                            <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </summary>
                        <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed">
                            {faq.a}
                        </div>
                    </details>
                {/each}
            </div>
        </div>
        </section>
    </div>
    
    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>