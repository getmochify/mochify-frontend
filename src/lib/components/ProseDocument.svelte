<script lang="ts">
    import type { Snippet } from 'svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';

    interface Props {
        title: string;
        eyebrow?: string;
        updated?: string;
        /** Optional block rendered between the header and the prose article,
            outside `.prose-doc` styling (e.g. a CTA card). */
        lead?: Snippet;
        children: Snippet;
    }

    let { title, eyebrow, updated, lead, children }: Props = $props();
</script>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col">
    <Navigation />

    <main class="relative z-10 flex-grow w-full max-w-3xl mx-auto px-5 sm:px-6 py-12 md:py-16">
        <header class="mb-10 md:mb-14">
            {#if eyebrow}
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F06292] mb-3">{eyebrow}</p>
            {/if}
            <h1 class="text-3xl md:text-[2.75rem] font-black text-[#4A2C2C] tracking-tight leading-[1.1]">
                {title}
            </h1>
            <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
            {#if updated}
                <p class="mt-5 text-sm text-[#875F42]/70">Last updated {updated}</p>
            {/if}
        </header>

        {#if lead}
            <div class="mb-10 md:mb-12">
                {@render lead()}
            </div>
        {/if}

        <article class="prose-doc prose max-w-none">
            {@render children()}
        </article>
    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>

<style>
    /* Modern, guide-aligned typography for long-form text pages (about + legal).
       Scoped to .prose-doc so it never leaks into other .prose content. */

    :global(.prose-doc) {
        color: #4a2c2c;
        line-height: 1.8;
    }

    /* No stray top margin on the very first block under the header. */
    :global(.prose-doc > :first-child) {
        margin-top: 0;
    }

    /* Lead paragraph — the first bare <p> in the document reads a touch larger. */
    :global(.prose-doc > p:first-of-type) {
        font-size: 1.2rem;
        line-height: 1.7;
        color: #4a2c2c;
    }

    :global(.prose-doc p),
    :global(.prose-doc li) {
        color: #6c3f31 !important;
    }

    :global(.prose-doc p) {
        margin-bottom: 1.15rem;
    }

    :global(.prose-doc h2) {
        font-size: 1.9rem;
        font-weight: 800;
        color: #4a2c2c !important;
        margin-top: 3.5rem;
        margin-bottom: 1.25rem;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    @media (max-width: 767px) {
        :global(.prose-doc h2) {
            font-size: 1.55rem;
        }
    }

    /* Section headings — soft pink underline keeps a long document scannable. */
    :global(.prose-doc h3) {
        font-size: 1.5rem;
        font-weight: 800;
        color: #4a2c2c !important;
        margin-top: 3.25rem;
        margin-bottom: 1.1rem;
        padding-bottom: 0.6rem;
        line-height: 1.3;
        letter-spacing: -0.01em;
        border-bottom: 1px solid #ffe5ec;
    }

    :global(.prose-doc h4) {
        font-size: 1.2rem;
        font-weight: 700;
        color: #6c3f31 !important;
        margin-top: 2.25rem;
        margin-bottom: 0.75rem;
        line-height: 1.3;
    }

    :global(.prose-doc strong) {
        color: #4a2c2c !important;
        font-weight: 800;
    }

    :global(.prose-doc em) {
        font-style: italic;
    }

    /* Lists — honour the authored numbering (type="a" → letters, type="1" → digits)
       and keep browser `start` offsets working. Pink markers as a brand touch. */
    :global(.prose-doc ol) {
        list-style-type: decimal;
    }
    :global(.prose-doc ol[type='a']) {
        list-style-type: lower-alpha;
    }
    :global(.prose-doc ol[type='1']) {
        list-style-type: decimal;
    }
    :global(.prose-doc ul) {
        list-style-type: disc;
    }
    :global(.prose-doc li) {
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
        padding-left: 0.35rem;
    }
    :global(.prose-doc ol > li::marker) {
        color: #f06292;
        font-weight: 800;
    }
    :global(.prose-doc ul > li::marker) {
        color: #f06292;
    }

    /* Definitions table (Terms of Service). */
    :global(.prose-doc table) {
        width: 100%;
        border-collapse: collapse;
        margin: 2.25rem 0;
        font-size: 0.95rem;
        border: 1px solid #ffe5ec;
        border-radius: 0.75rem;
        overflow: hidden;
    }
    :global(.prose-doc thead) {
        background: linear-gradient(135deg, #fff5f7, #fff0f3);
    }
    :global(.prose-doc th) {
        text-align: left;
        padding: 0.85rem 1rem;
        color: #4a2c2c !important;
        font-weight: 800;
        border-bottom: 1px solid #ffe5ec;
    }
    :global(.prose-doc td) {
        padding: 0.85rem 1rem;
        vertical-align: top;
        color: #6c3f31 !important;
        border-bottom: 1px solid #fbeaef;
    }
    :global(.prose-doc tbody tr:last-child td) {
        border-bottom: none;
    }
    @media (max-width: 640px) {
        :global(.prose-doc table) {
            display: block;
            overflow-x: auto;
        }
    }

    /* Intro blockquote (Terms & Conditions). */
    :global(.prose-doc blockquote) {
        border-left: 4px solid #ff8fa3;
        padding: 1.25rem 1.5rem;
        margin: 2rem 0;
        color: #5d5454;
        background: linear-gradient(
            135deg,
            rgba(255, 240, 243, 0.6) 0%,
            rgba(255, 245, 247, 0.4) 100%
        );
        border-radius: 0 0.75rem 0.75rem 0;
        box-shadow: 0 2px 8px rgba(255, 179, 198, 0.1);
    }
    :global(.prose-doc blockquote p:last-child) {
        margin-bottom: 0;
    }

    /* Links — brand pink with a soft underline and a strawberry hover pill. */
    :global(.prose-doc a) {
        color: #f06292 !important;
        font-weight: 700 !important;
        text-decoration: underline !important;
        text-decoration-color: #ffb3c6 !important;
        text-decoration-thickness: 2px !important;
        text-underline-offset: 4px !important;
    }
    :global(.prose-doc a:hover) {
        color: #ec407a !important;
        text-decoration-color: #f06292 !important;
        background-color: #fff0f3 !important;
        border-radius: 4px;
    }

    :global(.prose-doc hr) {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, #ffe5ec, transparent);
        margin: 3rem 0;
    }
</style>
