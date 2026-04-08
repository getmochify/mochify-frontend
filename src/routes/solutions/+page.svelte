<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    const tools = [
        {
            name: "eBay Image Converter",
            slug: "solutions/ebay-image-converter",
            desc: "Fix 'file not supported' errors and stay under the 12MB limit.",
            iconPaths: ["M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"],
            tag: "Marketplace"
        },
        {
            name: "HEIC to JPEG",
            slug: "heic-to-jpeg",
            desc: "Instant iPhone photo conversion for universal compatibility.",
            iconPaths: ["M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75"],
            tag: "Mobile"
        },
        {
            name: "JPEG XL Optimizer",
            slug: "jpg-to-jpegxl",
            desc: "The future of the web. Best-in-class compression for 2026.",
            iconPaths: ["M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"],
            tag: "Experimental"
        },
        {
            name: "AVIF to JXL Converter",
            slug: "avif-to-jpegxl",
            desc: "Transcode AVIF files to JPEG XL for superior compression and HDR support.",
            iconPaths: ["M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"],
            tag: "Next-Gen"
        },
        {
            name: "HIF to JPG Converter",
            slug: "solutions/hif-to-jpg",
            desc: "Convert Fuji, Canon & Sony HIF photos to universally compatible JPEGs.",
            iconPaths: [
                "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z",
                "M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            ],
            tag: "Photography"
        },
        {
            name: "AVIF to JPG Converter",
            slug: "avif-to-jpg",
            desc: "Turn modern AVIF files into high-quality JPEGs that work with every app and device.",
            iconPaths: ["M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"],
            tag: "Web"
        },
        {
            name: "HIF to AVIF Converter",
            slug: "solutions/hif-to-avif",
            desc: "Convert Fuji, Canon & Sony HIF photos to AVIF while preserving 10-bit quality.",
            iconPaths: [
                "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z",
                "M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            ],
            tag: "Photography"
        }
    ];
</script>

<svelte:head>
    <title>Mochify Solutions | Compare & Choose the Best Image Optimizer</title>
    <meta name="description" content="Compare specialized image tools for eBay, iPhone (HEIC), and next-gen web formats. Find the perfect balance between file size and quality for your specific platform.">
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
            "name": "HEIC to JPEG Converter",
            "url": "https://mochify.app/heic-to-jpeg"
            },
            {
            "@type": "ListItem",
            "position": 3,
            "name": "AVIF to JXL Converter",
            "url": "https://mochify.app/avif-to-jpegxl"
            },
            {
            "@type": "ListItem",
            "position": 4,
            "name": "JPEG XL Optimizer",
            "url": "https://mochify.app/jpg-to-jpegxl"
            },
            {
            "@type": "ListItem",
            "position": 5,
            "name": "HIF to JPG Converter",
            "url": "https://mochify.app/solutions/hif-to-jpg"
            }
        ]
        }
    </script>
</svelte:head>
<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col relative">
    <Navigation />


<div class="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-16 space-y-4">
            <h1 class="text-5xl md:text-6xl font-black text-[#4A2C2C] tracking-tight">
                Specialized <span class="text-[#F06292]">Solutions</span>
            </h1>
            <p class="text-xl text-[#875F42] font-medium max-w-2xl mx-auto leading-relaxed">
                Tailored workflows for your specific platform needs.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {#each tools as tool}
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
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFF5F7] text-[#F06292] font-black hover:bg-pink-50 transition-all active:scale-95 border border-pink-100 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Back to Optimizer
            </a>
        </div>
    </div>
    <div class="mt-16 md:mt-24">
        <Footer />
    </div>
</div>
