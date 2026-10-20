<script lang="ts">
    // Spacing comes from the caller. Pages used to restyle the breadcrumb
    // with :global rules, which leaked across client-side navigations
    // (a page's CSS stays in the document after you leave it).
    let {
        items,
        class: className = 'px-4 md:px-0 mb-3 md:mb-4'
    }: { items: { name: string; href?: string }[]; class?: string } = $props();
</script>

<nav aria-label="Breadcrumb" class={className}>
    <ol class="flex items-center flex-wrap gap-x-1.5 gap-y-1">
        {#each items as item, i}
            <li class="flex items-center gap-1.5 min-w-0">
                {#if item.href}
                    <a
                        href={item.href}
                        class="text-xs font-semibold text-[#875F42] hover:text-[#F06292] transition-colors whitespace-nowrap no-underline"
                    >{item.name}</a>
                {:else}
                    <span
                        class="text-xs font-semibold text-[#4A2C2C] truncate max-w-[200px] sm:max-w-lg"
                        aria-current="page"
                        title={item.name}
                    >{item.name}</span>
                {/if}
                {#if i < items.length - 1}
                    <span class="text-pink-200 text-xs select-none" aria-hidden="true">›</span>
                {/if}
            </li>
        {/each}
    </ol>
</nav>
