<script lang="ts">
    import { guides as allGuides } from '$lib/data/guides';

    const metadata = {
        title: "Image Optimization Guides | Mochify",
        description: "Learn about modern image formats, compression techniques, and optimization strategies with our in-depth guides."
    };

    const guides = [...allGuides].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const featuredGuides = guides.filter(g => g.featured);

    const categories = ['All', ...Array.from(new Set(guides.map(g => g.category)))];
    let selectedCategory = $state('All');
    const filteredGuides = $derived(
        selectedCategory === 'All' ? guides : guides.filter(g => g.category === selectedCategory)
    );

    const toIsoDate = (d: string) => new Date(d).toISOString().split('T')[0];

    const allDates = guides.flatMap(g => [g.date, g.lastUpdated].filter(Boolean) as string[]);
    const dateModified = toIsoDate(allDates.reduce((a, b) => new Date(a) > new Date(b) ? a : b));
    const datePublished = toIsoDate(guides[guides.length - 1].date);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Image Optimization Guides | Mochify",
        "url": "https://mochify.app/guides",
        "description": "A curated library of in-depth guides on privacy-first image optimization, EXIF data risks, next-gen formats, WordPress performance, Jpegli compression, and Fujifilm HIF to JPEG workflows.",
        "inLanguage": "en",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "mainEntity": guides.map(g => ({
            "@type": "Article",
            "name": g.title,
            "url": `https://mochify.app${g.url}`
        })),
        "datePublished": datePublished,
        "dateModified": dateModified
    };
</script>

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="px-4 pt-2 pb-12 sm:px-6 lg:px-8">

<header class="text-center mb-12">
    <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFB3C6] via-[#E0ACD5] to-[#9B7EC8] bg-clip-text text-transparent leading-tight pb-2 mb-6">
        Image Optimization Guides
    </h1>
    <p class="text-xl text-[#875F42] font-medium max-w-2xl mx-auto">
        In-depth articles about modern image formats, compression techniques, and best practices for web performance.
    </p>
</header>

{#if featuredGuides.length > 0}
<section class="mb-14" aria-label="Featured guides">
    <div class="mb-7">
        <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mb-3">Featured</h2>
        <div class="featured-heading-bar"></div>
    </div>

    <!-- Primary featured guide -->
    <a href={featuredGuides[0].url} class="group block relative overflow-hidden bg-gradient-to-br from-[#3D2020] via-[#5C2E2E] to-[#7A3F3F] rounded-3xl p-8 md:p-10 border border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 no-underline mb-5">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjQwLDk4LDE0NiwwLjA4KSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        <div class="absolute top-0 right-0 w-72 h-72 bg-[#F06292]/10 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-[#F06292]/15 transition-colors duration-500"></div>
        <div class="relative z-10">
            <div class="flex flex-wrap items-center gap-2 mb-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F06292]/20 text-[#F06292] text-xs font-black uppercase tracking-wider border border-[#F06292]/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#F06292] animate-pulse"></span>
                    Featured
                </span>
                <span class="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-bold uppercase tracking-wider">
                    {featuredGuides[0].category}
                </span>
                <span class="text-white/40 text-xs font-semibold">{featuredGuides[0].readTime}</span>
            </div>
            <h3 class="text-2xl md:text-4xl font-black text-white group-hover:text-[#F06292] transition-colors duration-200 mb-4 leading-tight max-w-3xl">
                {featuredGuides[0].title}
            </h3>
            <p class="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                {featuredGuides[0].description}
            </p>
            <div class="flex items-center justify-between">
                <span class="text-white/30 text-xs font-bold">{featuredGuides[0].date}</span>
                <span class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F06292] hover:bg-[#E91E63] text-white text-sm font-black rounded-xl shadow-lg shadow-[#F06292]/30 group-hover:translate-x-1 transition-all duration-200">
                    Read Guide
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </span>
            </div>
        </div>
    </a>

    <!-- Secondary featured guides -->
    {#if featuredGuides.length > 1}
    <div class="grid md:grid-cols-2 gap-5">
        {#each featuredGuides.slice(1) as guide}
        <a href={guide.url} class="group block bg-gradient-to-br from-[#FFF5F7] to-white rounded-3xl p-6 border border-pink-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline">
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-[#F06292]/10 text-[#F06292] text-[10px] font-black uppercase tracking-wider border border-[#F06292]/20">
                    Featured
                </span>
                <span class="text-[10px] font-bold text-[#875F42] uppercase tracking-wider">{guide.category}</span>
            </div>
            <h3 class="text-lg md:text-xl font-black text-[#4A2C2C] group-hover:text-[#F06292] transition-colors mb-3 leading-snug">
                {guide.title}
            </h3>
            <p class="text-[#875F42] text-sm leading-relaxed mb-4 opacity-80 line-clamp-3">
                {guide.description}
            </p>
            <div class="flex items-center justify-between text-xs font-bold text-[#875F42]/60 pt-4 border-t border-pink-50">
                <span>{guide.date} · {guide.readTime}</span>
                <span class="text-[#F06292] group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </a>
        {/each}
    </div>
    {/if}
</section>
{/if}

<div class="flex flex-wrap gap-2 justify-center mb-10">
    {#each categories as cat}
        <button
            onclick={() => selectedCategory = cat}
            class="cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 {selectedCategory === cat ? 'bg-mochi-pink text-white shadow-md' : 'bg-pink-50 text-pink-400 hover:bg-pink-100'}"
        >
            {cat}
        </button>
    {/each}
</div>

<div class="grid gap-8 mb-24">
    {#each filteredGuides as guide}
        <a href={guide.url} class="group block bg-white rounded-3xl p-8 border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline">
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider">
                    {guide.category}
                </span>
                {#if guide.featured}
                <span class="inline-block px-2.5 py-1 rounded-full bg-[#F06292]/10 text-[#F06292] text-xs font-black uppercase tracking-wider border border-[#F06292]/20">
                    Featured
                </span>
                {/if}
            </div>

            <h2 class="text-2xl md:text-3xl font-black text-[#4A2C2C] group-hover:text-[#F06292] transition-colors mb-3">
                {guide.title}
            </h2>

            <p class="text-[#875F42] leading-relaxed mb-6 opacity-80">
                {guide.description}
            </p>

            <div class="flex items-center justify-between text-xs font-bold text-[#875F42]/60 pt-6 border-t border-pink-50">
                <span>{guide.date}{guide.lastUpdated ? ` · Updated ${guide.lastUpdated}` : ''} · {guide.readTime}</span>
                <span class="text-[#F06292] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Guide →
                </span>
            </div>
        </a>
    {/each}
</div>

<div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
    <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

    <div class="relative z-10 mb-6">
        <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
            Free Tool
        </span>
    </div>

    <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">
        Ready to squish some images?
    </h3>

    <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
        Try our native C++ engine for instant Jpegli, AVIF, and WebP compression.
    </p>

    <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
        <span>Start Optimizing Now</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </a>
</div>

</div>

<style>
    .featured-heading-bar {
        height: 5px;
        width: 60px;
        border-radius: 99px;
        background: linear-gradient(90deg, #F06292, #E0ACD5);
    }
</style>
