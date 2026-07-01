<script lang="ts">
    import { page } from '$app/state';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import BackToTop from '$lib/components/BackToTop.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    const { children } = $props();

    function formatSlug(slug: string): string {
        return slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    const segments = $derived(page.url.pathname.split('/').filter(Boolean));
    const breadcrumbItems = $derived([
        { name: 'Home', href: '/' },
        segments.length > 1
            ? { name: 'Guides', href: '/guides' }
            : { name: 'Guides' },
        ...(segments[1] ? [{ name: formatSlug(segments[1]) }] : []),
    ]);
</script>

<div class="min-h-screen flex flex-col relative">

    <Navigation />
    <main class="relative z-10 flex-grow w-full max-w-4xl mx-auto px-0 md:px-4 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        {@render children()}
    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>

    <BackToTop />
</div>

<style>
    /* Guide-specific typography styles */
    :global(article) {
        color: var(--cocoa-deep); /* #6C3F31 */
        line-height: 1.8;
    }
    
    :global(article h2) {
        font-size: 1.75rem;
        font-weight: 800;
        color: #4A2C2C;
        margin-top: 3.5rem;
        margin-bottom: 1.25rem;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    @media (max-width: 767px) {
        :global(article h2) {
            font-size: 1.45rem;
        }
    }

    :global(article h3) {
        font-size: 1.5rem;
        font-weight: 700;
        color: #4A2C2C;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.25;
        letter-spacing: 0.01em;
    }

    :global(article h4) {
        font-size: 1.25rem;
        font-weight: 600;
        color: #6C3F31;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        line-height: 1.25;
        letter-spacing: 0.01em;
    }
    
    
    :global(article p) {
        color: #4A2C2C;
        letter-spacing: 0;
    }

    /* FAQ rhythm */
    :global(article .faq-item) {
        margin-bottom: 2.5rem;
    }
    :global(article .faq-item:last-child) {
        margin-bottom: 0;
    }
    :global(article .faq-item:not(:last-child)) {
        position: relative;
        padding-bottom: 2.5rem;
    }
    :global(article .faq-item:not(:last-child)::after) {
        content: '';
        position: absolute;
        bottom: 0;
        left: 1.5rem;
        width: 96px;
        height: 2px;
        border-radius: 99px;
        background: linear-gradient(90deg, #D6CEC5, #E2DAD1, rgba(226, 218, 209, 0));
    }
    :global(article .faq-item h3) {
        font-size: 1.35rem;
        font-weight: 700;
        color: #4A2C2C;
        margin-top: 0;
        margin-bottom: 0.75rem;
        line-height: 1.3;
        letter-spacing: -0.01em;
    }
    :global(article .faq-item p) {
        font-size: 1.05rem;
        line-height: 1.6;
        color: #6C3F31;
        margin-top: 0;
        margin-bottom: 0;
    }

    :global(article a:not([class])) {
        color: #F06292;
        font-weight: 700;
        text-decoration-color: #FFB3C6;
        text-underline-offset: 4px;
        text-decoration: underline 2px;
    }

    :global(article a:not([class]):hover) {
        color: #ec407a;
        text-decoration-color: #F06292;
        background-color: #FFF0F3;
        border-radius: 4px;
    }
    
    :global(article strong) {
        color: #4A2C2C; /* Deep Cocoa instead of Black */
        font-weight: 800;
    }
    
    :global(article em) {
        font-style: italic;
    }
    
    :global(article code) {
        background: linear-gradient(135deg, #FFFDF5 0%, #FFF5F7 100%);
        color: #BE185D;
        padding: 0.2rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.9375rem;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', monospace;
        border: 1px solid #FFE5EC;
        font-weight: 500;
    }
    
    :global(article pre) {
        color: #e5e7eb;
        padding: 1.5rem;
        border-radius: 0.75rem;
        overflow-x: auto;
        font-size: 0.9375rem;
        line-height: 1.7;
        margin-top: 1.75rem;
        margin-bottom: 1.75rem;
    }
    
    :global(article pre code) {
        background: transparent;
        color: #e5e7eb;
        padding: 0;
        border: none;
        font-weight: 400;
    }
    
    :global(article blockquote) {
        border-left: 4px solid #FF8FA3;
        padding: 1.25rem 1.5rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
        font-style: italic;
        color: #5D5454;
        background: linear-gradient(135deg, rgba(255, 240, 243, 0.6) 0%, rgba(255, 245, 247, 0.4) 100%);
        border-radius: 0 0.75rem 0.75rem 0;
        box-shadow: 0 2px 8px rgba(255, 179, 198, 0.1);
        font-size: 1.0625rem;
        line-height: 1.7;
    }
    
    :global(article blockquote p) {
        margin-bottom: 0;
    }
    
    :global(article img) {
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        margin-top: 2.5rem;
        margin-bottom: 2.5rem;
        max-width: 100%;
        height: auto;
        border: 1px solid rgba(168, 85, 247, 0.1);
    }
    
    :global(article hr) {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, #FFE5EC, transparent);
        margin: 3rem 0;
    }
    
    
    /* Callout boxes */
    :global(.guide-callout) {
        background-color: white;
        border-left: 4px solid;
        border-radius: 0 0.75rem 0.75rem 0;
        padding: 1.5rem 1.75rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    :global(.guide-callout:hover) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    
    :global(.guide-callout.info) {
        border-color: #60a5fa;
        background: linear-gradient(135deg, rgba(239, 246, 255, 0.7) 0%, rgba(239, 246, 255, 0.4) 100%);
    }
    
    :global(.guide-callout.warning) {
        border-color: #fbbf24;
        background: linear-gradient(135deg, rgba(254, 252, 232, 0.7) 0%, rgba(254, 252, 232, 0.4) 100%);
    }
    
    :global(.guide-callout.success) {
        border-color: #34d399;
        background: linear-gradient(135deg, rgba(236, 253, 245, 0.7) 0%, rgba(236, 253, 245, 0.4) 100%);
    }
    
    :global(.guide-callout.tip) {
        border-color: #FF8FA3;
        background: linear-gradient(135deg, rgba(255, 240, 243, 0.7) 0%, rgba(255, 245, 247, 0.4) 100%);
    }
    
    /* Lead paragraph styling */
    :global(article > p:first-of-type) {
        font-size: 1.25rem;
        line-height: 1.7;
        color: #1f2937;
        font-weight: 400;
    }
    
    /* Meta information styling */
    :global(article .text-sm.text-purple-600) {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #FF8FA3 !important;
    }
    
    :global(article .text-lg.text-gray-600) {
        font-size: 1.25rem;
        line-height: 1.7;
        color: #4b5563;
        font-weight: 400;
    }
    
    /* Reading progress indicator */
    :global(.reading-progress) {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, #FFB3C6, #F06292);
        z-index: 100;
        transition: width 0.1s ease;
    }

    /* TOC card rows: graceful wrapping for long titles.
       Number badge and chevron never shrink; title text sits tight when it wraps. */
    :global(article nav ul li a > span > span:first-of-type) {
        flex-shrink: 0;
    }

    :global(article nav ul li a > span > span:last-of-type) {
        line-height: 1.25;
    }

    :global(article nav ul li a > svg) {
        flex-shrink: 0;
    }
</style>
