<script lang="ts">
    import { imageTools, videoTools } from '$lib/data/solutions';
</script>

<svelte:head>
    <title>Mochify Solutions | Compare & Choose the Best Image Optimizer</title>
    <meta name="description" content="Specialized image tools for eBay, iPhone (HEIC), and next-gen web formats, plus free in-browser video conversion. Find the perfect balance between file size and quality for your platform.">
    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Mochify Image Optimization Tools",
        "description": "A collection of specialized image converters and optimizers for eBay, mobile, and web performance.",
        "itemListElement": [
            {
            "@type": "ListItem",
            "position": 1,
            "name": "eBay Image Converter",
            "url": "https://mochify.app/solutions/ebay-image-converter"
            },
            {
            "@type": "ListItem",
            "position": 2,
            "name": "HEIC to JPG Converter",
            "url": "https://mochify.app/heic-to-jpeg"
            },
            {
            "@type": "ListItem",
            "position": 3,
            "name": "AVIF to JXL",
            "url": "https://mochify.app/avif-to-jpegxl"
            },
            {
            "@type": "ListItem",
            "position": 4,
            "name": "JPG to JXL",
            "url": "https://mochify.app/jpg-to-jpegxl"
            },
            {
            "@type": "ListItem",
            "position": 5,
            "name": "HIF to JPG Converter",
            "url": "https://mochify.app/solutions/hif-to-jpg"
            },
            {
            "@type": "ListItem",
            "position": 6,
            "name": "PNG to JXL",
            "url": "https://mochify.app/solutions/png-to-jxl"
            },
            {
            "@type": "ListItem",
            "position": 7,
            "name": "HEIF to JPG Converter",
            "url": "https://mochify.app/solutions/heif-to-jpg"
            },
            {
            "@type": "ListItem",
            "position": 8,
            "name": "SDR to HDR Converter",
            "url": "https://mochify.app/solutions/sdr-to-hdr"
            }
        ]
        }
    </script>
</svelte:head>
<div class="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-16 space-y-4">
            <h1 class="text-5xl md:text-6xl font-black text-[#4A2C2C] tracking-tight">
                Specialized <span class="text-[#F06292]">Solutions</span>
            </h1>
            <p class="text-xl text-[#875F42] font-medium max-w-2xl mx-auto leading-relaxed">
                Tailored workflows for your specific platform needs.
            </p>
        </div>

        {#snippet toolCard(tool: { name: string; slug: string; desc: string; iconPaths: string[]; tag: string })}
            <a
                href="/{tool.slug}"
                class="group bg-white p-8 rounded-2xl border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
                <div class="flex justify-between items-start mb-6">
                    <div class="w-10 h-10 rounded-xl bg-[#FFF0F3] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-5 h-5 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            {#each tool.iconPaths as d}
                                <path stroke-linecap="round" stroke-linejoin="round" {d} />
                            {/each}
                        </svg>
                    </div>
                    <span class="px-3 py-1 rounded-xl bg-[#F1F8E9] text-[#33691E] text-[10px] font-black uppercase tracking-widest border border-[#DCEDC8]">
                        {tool.tag}
                    </span>
                </div>

                <h2 class="text-xl font-black text-[#4A2C2C] mb-3 group-hover:text-[#F06292] transition-colors">
                    {tool.name}
                </h2>
                <p class="text-sm text-[#6C3F31] leading-relaxed mb-6 opacity-90">
                    {tool.desc}
                </p>

                <div class="mt-auto flex items-center gap-2 text-xs font-black text-[#F06292] uppercase tracking-wider">
                    Open Tool
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </div>
            </a>
        {/snippet}

        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Image Tools</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {#each imageTools as tool}
                {@render toolCard(tool)}
            {/each}
        </div>

        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Video Tools</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {#each videoTools as tool}
                {@render toolCard(tool)}
            {/each}
        </div>

        <div class="mt-16 space-y-12">
            <div class="text-center space-y-4">
                <h2 class="text-3xl font-black text-[#4A2C2C]">
                    Why Image Speed is your <span class="text-[#F06292]">Secret Weapon</span>
                </h2>
                <div class="w-16 h-1 bg-pink-100 mx-auto rounded-full"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-[#4A2C2C] mb-3">The 2.5s Benchmark</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed opacity-80">
                        Google uses <strong class="text-[#875F42]">LCP</strong> to measure speed. Optimizing your "Hero" image is the fastest way to hit the 2.5s target.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <div class="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mb-6">
                        <svg class="w-5 h-5 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-[#4A2C2C] mb-3">Stop the Bounce</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed opacity-80">
                        Even a 1-second delay can drop conversions by 7%. Keep your customers happy with instant loads.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-[#4A2C2C] mb-3">Mobile-First Reality</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed opacity-80">
                        Lightweight <strong class="text-[#875F42]">AVIF</strong> and <strong class="text-[#875F42]">WebP</strong> ensure your site stays fast even on slow cellular networks.
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-16 text-center">
            <a href="/flow" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFF5F7] text-[#F06292] font-black hover:bg-pink-50 transition-all active:scale-95 border border-pink-100 shadow-sm">
                Open Magic Flow
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
        </div>
    </div>
