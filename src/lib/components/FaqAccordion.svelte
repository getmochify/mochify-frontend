<script lang="ts">
    import { faqParts, type FaqItem } from '$lib/faq';

    // The question is an <h3> inside the <summary> so the accordion contributes
    // to the page's heading outline instead of being a flat run of <span>s
    // (design-specs/mochify-guides-html-spec.md 4.5). Answers render inside the
    // <details>, so they are in the served HTML rather than injected on click.
    // `class` replaces the default stack entirely, so a page that wants the
    // two-column grid layout can pass its own container classes.
    let { faqs, class: className = 'space-y-4' }: { faqs: FaqItem[]; class?: string } = $props();
</script>

<div class={className}>
    {#each faqs as faq}
        <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
            <summary class="flex items-center justify-between p-6 cursor-pointer list-none select-none gap-4">
                <h3 class="m-0 text-base font-bold text-[#4A2C2C]">{faq.q}</h3>
                <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180 shrink-0">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
            </summary>
            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed">
                {#each faqParts(faq.a) as part}{#if typeof part === 'string'}{part}{:else}<a href={part.href} class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">{part.label}</a>{/if}{/each}
            </div>
        </details>
    {/each}
</div>

<style>
    summary::-webkit-details-marker {
        display: none;
    }
</style>
