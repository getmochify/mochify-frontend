<script lang="ts">
    import SectionHeading from './SectionHeading.svelte';

    const { items, id = 'faq', heading = 'FAQ' }: {
        items: { q: string; a: string }[];
        id?: string;
        heading?: string;
    } = $props();
</script>

<section {id} class="scroll-mt-24">
    <SectionHeading>{heading}</SectionHeading>
    <div>
        {#each items as item}
            <div class="faq-item">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
            </div>
        {/each}
    </div>
</section>
