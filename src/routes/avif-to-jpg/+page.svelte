<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert AVIF to JPG Online - Free, Fast & Universal | Mochify</title>
    <meta name="description" content="Convert AVIF to JPG for maximum compatibility. While AVIF is small, JPG works everywhere—from social media to old photo editors. Free, private, and instant.">
    <meta property="og:title" content="AVIF to JPG Converter - Soft & Squishy Image Tools">
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">
        
        <div class="text-center mb-12 space-y-6">
            
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 18h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Works on iPhone, Android, Mac & Windows
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert 
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    AVIF
                </span> 
                to 
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
            </h1>
            
            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn modern AVIF files into high-quality JPEGs that work with every app and device on the planet.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="jpg" types=".AVIF" showTypes={false} />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-center">
            
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert to JPG?</h2>
                <p class="leading-relaxed text-[#6C3F31]">
                    AVIF is great for file size, but it still struggles with <strong class="text-[#7E685E]">compatibility</strong>. Many older browsers, email clients, and professional design tools (like older versions of Photoshop) won't open them.
                </p>
                <p class="leading-relaxed text-[#6C3F31]">
                    Converting to JPG ensures your images are <strong class="text-[#7E685E]">universally readable</strong>. Whether you're uploading to a website, sending an attachment, or printing a photo, JPG is the format that never lets you down.
                </p>
            </div>

            <div class="space-y-4">
                
                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] select-none list-none">
                        <span>Will my photos lose quality?</span>
                        <span class="transition-transform duration-300 group-open:rotate-180 text-[#7E685E]">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="px-6 pb-6 text-[#6C3F31] leading-relaxed">
                        We use high-quality encoding presets. While JPG is a lossy format, at our 90%+ quality setting, the visual difference is virtually impossible to spot with the human eye.
                    </div>
                </details>

                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] select-none list-none">
                        <span>Is there a file size limit?</span>
                        <span class="transition-transform duration-300 group-open:rotate-180 text-[#7E685E]">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="px-6 pb-6 text-[#6C3F31] leading-relaxed">
                        Mochify is built for speed. You can upload large AVIF files and convert them instantly. No annoying "pro" limits or hidden subscriptions here.
                    </div>
                </details>

                <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                    <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] select-none list-none">
                        <span>Is my data private?</span>
                        <span class="transition-transform duration-300 group-open:rotate-180 text-[#7E685E]">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="px-6 pb-6 text-[#6C3F31] leading-relaxed">
                        Completely. Your images are processed in your browser or temporary RAM and deleted immediately after conversion. We never store, view, or sell your images.
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