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
            "featureList": [
                "Converts iPhone HEIC photos to universally compatible JPEG",
                "Files streamed into memory on the encoder, never written to disk",
                "Metadata including GPS stripped by default",
                "No software install or Microsoft Store codec purchase required"
            ]
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
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

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/heif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to PDF →</p>
                        <p class="text-xs text-[#875F42]">Bundle iPhone photos into one document</p>
                    </div>
                </a>
                <a href="/solutions/heif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                        <svg class="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">Any .heif, .heic or .hif file</p>
                    </div>
                </a>
                <a href="/solutions/hif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F1F8E9] flex items-center justify-center shrink-0 border border-[#DCEDC8]">
                        <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">Fuji, Canon and Sony bodies</p>
                    </div>
                </a>
            </div>
        </section>
    </div>
    
    
    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>