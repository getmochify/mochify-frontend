<script lang="ts">
    import SectionHeading from './SectionHeading.svelte';

    // `html` opts a page into rendering answers as authored markup (an inline
    // link, <code>). Off by default: most callers' answers are plain text.
    const { items, id = 'faq', heading = 'FAQ', html = false }: {
        items: { q: string; a: string }[];
        id?: string;
        heading?: string;
        html?: boolean;
    } = $props();
</script>

<section {id} class="scroll-mt-24">
    <SectionHeading>{heading}</SectionHeading>
    <div>
        {#each items as item}
            <div class="faq-item">
                <h3>{item.q}</h3>
                {#if html}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    <p>{@html item.a}</p>
                {:else}
                    <p>{item.a}</p>
                {/if}
            </div>
        {/each}
    </div>
</section>
