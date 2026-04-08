<script>
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import BackToTop from '$lib/components/BackToTop.svelte';
</script>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col relative">

    <Navigation />
    <main class="relative z-10 flex-grow w-full max-w-4xl mx-auto px-0 md:px-4 md:py-12">
        <slot />
    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>

    <BackToTop />
</div>

<style>
    /* Guide-specific typography styles */
    :global(.guide-content) {
        color: var(--cocoa-deep); /* #6C3F31 */
        line-height: 1.8;
    }
    
    :global(.guide-content h1) {
        font-size: 2.5rem;
        font-weight: 900;
        color: #111827;
        margin-bottom: 2rem;
        margin-top: 0;
        line-height: 1.15;
        letter-spacing: -0.025em;
        background: linear-gradient(135deg, #FFB3C6 0%, #E0ACD5 50%, #C5A3E0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    @media (min-width: 768px) {
        :global(.guide-content h1) {
            font-size: 3.5rem;
        }
    }
    
    :global(.guide-content h2) {
        font-size: 2rem;
        font-weight: 800;
        color: #4A2C2C;
        margin-top: 3.5rem;
        margin-bottom: 1.25rem;
        line-height: 1.3;
        letter-spacing: -0.02em;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #FFE5EC;
    }
    
    :global(.guide-content h2::before) {
        content: '';
        display: inline-block;
        width: 4px; /* Slightly thicker for a "squishier" look */
        height: 1.5rem;
        background: linear-gradient(to bottom, #FFB3C6, #F06292); 
        margin-right: 0.75rem;
        vertical-align: middle;
        border-radius: 4px; /* More rounded for "Mochi" points */
    }
    
    :global(.guide-content h3) {
        font-size: 1.5rem;
        font-weight: 700;
        color: #4A2C2C;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    :global(.guide-content h4) {
        font-size: 1.25rem;
        font-weight: 600;
        color: #6C3F31;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
    }
    
    :global(.guide-content p) {
        margin-bottom: 1.5rem;
        font-size: 1.0625rem;
        line-height: 1.8;
        color: var(--cocoa-milk); /* #875F42 */
    }
    
    :global(.guide-content ul),
    :global(.guide-content ol) {
        margin-bottom: 2rem;
        margin-left: 0;
        padding-left: 1.75rem;
    }
    
    :global(.guide-content ul li),
    :global(.guide-content ol li) {
        margin-bottom: 0.75rem;
        padding-left: 0.5rem;
    }
    
    :global(.guide-content ul) {
        list-style-type: none;
    }
    
    :global(.guide-content ul li) {
        position: relative;
    }
    
    :global(.guide-content ul li::before) {
        content: '→';
        position: absolute;
        left: -1.75rem;
        color: #FF8FA3;
        font-weight: 600;
    }
    
    :global(.guide-content ol) {
        list-style-type: decimal;
        list-style-position: outside;
    }
    
    :global(.guide-content ol li) {
        padding-left: 0.25rem;
    }
    
    :global(.guide-content ol li::marker) {
        color: #FF8FA3;
        font-weight: 700;
    }
    
    :global(.guide-content li) {
        font-size: 1.0625rem;
        line-height: 1.75;
        color: var(--cocoa-milk); /* #875F42 */
    }
    
    :global(.guide-content a) {
        color: #F06292;
        font-weight: 700;
        text-decoration-color: #FFE5EC;
        text-underline-offset: 4px;
        text-decoration: underline 2px;
    }
    
    :global(.guide-content a:hover) {
        color: #FFB3C6;
        background-size: 100% 2px;
    }
    
    /* Remove underlines from buttons and special links */
    :global(.guide-content a.no-underline),
    :global(.guide-content a[class*="inline-flex"]),
    :global(.guide-content a[class*="px-"]) {
        text-decoration: none;
    }
    
    :global(.guide-content strong) {
        color: #4A2C2C; /* Deep Cocoa instead of Black */
        font-weight: 800;
    }
    
    :global(.guide-content em) {
        font-style: italic;
    }
    
    :global(.guide-content code) {
        background: linear-gradient(135deg, #FFFDF5 0%, #FFF5F7 100%);
        color: #BE185D;
        padding: 0.2rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.9375rem;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', monospace;
        border: 1px solid #FFE5EC;
        font-weight: 500;
    }
    
    :global(.guide-content pre) {
        background: linear-gradient(135deg, #1e1b4b 0%, #1f2937 100%);
        color: #e5e7eb;
        padding: 1.5rem;
        border-radius: 0.75rem;
        overflow-x: auto;
        margin-top: 2rem;
        margin-bottom: 2rem;
        font-size: 0.9375rem;
        line-height: 1.7;
        border: 1px solid #312e81;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15);
    }
    
    :global(.guide-content pre code) {
        background: transparent;
        color: #e5e7eb;
        padding: 0;
        border: none;
        font-weight: 400;
    }
    
    :global(.guide-content blockquote) {
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
    
    :global(.guide-content blockquote p) {
        margin-bottom: 0;
    }
    
    :global(.guide-content img) {
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        margin-top: 2.5rem;
        margin-bottom: 2.5rem;
        max-width: 100%;
        height: auto;
        border: 1px solid rgba(168, 85, 247, 0.1);
    }
    
    :global(.guide-content hr) {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, #FFE5EC, transparent);
        margin: 3rem 0;
    }
    
    :global(.guide-content table) {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-top: 2rem;
        margin-bottom: 2rem;
        overflow: hidden;
        border-radius: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    :global(.guide-content th) {
        background: linear-gradient(135deg, #FFF5F7 0%, #FFFDF5 100%);
        color: #4A2C2C;
        font-weight: 700;
        padding: 1rem 1.25rem;
        text-align: left;
        border: 1px solid #FFE5EC;
        font-size: 0.9375rem;
        letter-spacing: 0.025em;
        text-transform: uppercase;
    }
    
    :global(.guide-content td) {
        padding: 1rem 1.25rem;
        border: 1px solid #FFF0F3;
        background-color: white;
        color: #5D5454;
        line-height: 1.6;
    }
    
    :global(.guide-content tbody tr) {
        transition: background-color 0.2s ease;
    }
    
    :global(.guide-content tbody tr:hover) {
        background-color: rgba(255, 245, 247, 0.4);
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
    :global(.guide-content > p:first-of-type) {
        font-size: 1.25rem;
        line-height: 1.7;
        color: #1f2937;
        font-weight: 400;
    }
    
    /* Meta information styling */
    :global(.guide-content .text-sm.text-purple-600) {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #FF8FA3 !important;
    }
    
    :global(.guide-content .text-lg.text-gray-600) {
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
</style>
