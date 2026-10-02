<script lang="ts">
    import { page } from '$app/state';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import LocaleBanner from '$lib/components/LocaleBanner.svelte';

    const { children } = $props();

    const slugNames: Record<string, string> = {
        'remove-background-avif': 'AVIF Background Remover',
        'remove-background-webp': 'WebP Background Remover',
        'hif-to-avif': 'HIF to AVIF',
        'hif-to-jpg': 'HIF to JPG',
        'heif-to-jpg': 'HEIF to JPG',
        'heif-to-pdf': 'HEIC and HEIF to PDF',
        'jxl-to-pdf': 'JXL to PDF',
        'webp-to-pdf': 'WebP to PDF',
        'png-to-jxl': 'PNG to JXL',
        'svg-to-avif': 'SVG to AVIF',
        'svg-to-webp': 'SVG to WebP',
        'svg-to-jxl': 'SVG to JXL',
        'svg-to-png': 'SVG to PNG',
        'svg-to-jpg': 'SVG to JPG',
        'mp4-to-webm': 'MP4 to WebM',
        'webm-to-mp4': 'WebM to MP4',
        'ebay-image-converter': 'eBay Image Resizer and Converter',
        'bulk-ai-square-cropper': 'Bulk Square Cropper',
        'sdr-to-hdr': 'SDR to HDR',
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

    // The hub gets a two-item trail of its own; only the visible Breadcrumb
    // below is child-page-only.
    const breadcrumbLd = $derived(
        JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app' },
                { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://mochify.app/solutions' },
                ...(isChildPage
                    ? [{ '@type': 'ListItem', position: 3, name: pageName, item: `https://mochify.app${page.url.pathname}` }]
                    : []),
            ],
        })
    );
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${breadcrumbLd}<\/script>`}
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
    <Navigation />
    <LocaleBanner
        offers={[
            { href: '/fr/flow', label: 'Voir cette page en français', lang: 'fr', when: 'fr' },
            { href: '/es/flow', label: 'Ver esta página en español', lang: 'es', when: 'es' },
            { href: '/ja/flow', label: 'このページを日本語で見る', lang: 'ja', when: 'ja' },
            { href: '/pt-br/flow', label: 'Ver esta página em português', lang: 'pt-BR', when: 'pt' }
        ]}
    />
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
