<script lang="ts">
    import { page } from '$app/state';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    const { children } = $props();

    const slugNames: Record<string, string> = {
        'remove-background-avif': 'Remove Background to AVIF',
        'remove-background-webp': 'Remove Background to WebP',
        'hif-to-avif': 'HIF to AVIF',
        'hif-to-jpg': 'HIF to JPG',
        'heif-to-pdf': 'HEIF to PDF',
        'jxl-to-pdf': 'JXL to PDF',
        'webp-to-pdf': 'WebP to PDF',
        'png-to-jxl': 'PNG to JXL',
        'svg-to-avif': 'SVG to AVIF',
        'svg-to-webp': 'SVG to WebP',
        'svg-to-jxl': 'SVG to JXL',
        'mp4-to-webm': 'MP4 to WebM',
        'ebay-image-converter': 'eBay Image Converter',
        'bulk-ai-square-cropper': 'Bulk AI Square Cropper',
    };

    function formatSlug(slug: string): string {
        return slugNames[slug] ?? slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    const segments = $derived(page.url.pathname.split('/').filter(Boolean));
    const isChildPage = $derived(segments.length > 1);
    const pageName = $derived(isChildPage ? formatSlug(segments[1]) : '');

    const breadcrumbItems = $derived(
        isChildPage
            ? [
                  { name: 'Home', href: '/' },
                  { name: 'Solutions', href: '/solutions' },
                  { name: pageName },
              ]
            : []
    );

    const breadcrumbLd = $derived(
        isChildPage
            ? JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app' },
                      { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://mochify.app/solutions' },
                      { '@type': 'ListItem', position: 3, name: pageName, item: `https://mochify.app${page.url.pathname}` },
                  ],
              })
            : ''
    );
</script>

<svelte:head>
    {#if isChildPage}
        {@html `<script type="application/ld+json">${breadcrumbLd}<\/script>`}
    {/if}
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
    <Navigation />
    {#if isChildPage}
        <div class="max-w-5xl mx-auto w-full pt-6">
            <Breadcrumb items={breadcrumbItems} />
        </div>
    {/if}
    {@render children()}
    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
