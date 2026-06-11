<script lang="ts">
    import { onMount } from 'svelte';

    let { class: className = 'my-6', children } = $props();

    let scroller: HTMLDivElement;
    let canScroll = $state(false);
    let atEnd = $state(false);
    let scrolled = $state(false);

    function measure() {
        if (!scroller) return;
        const max = scroller.scrollWidth - scroller.clientWidth;
        canScroll = max > 2;
        atEnd = scroller.scrollLeft >= max - 2;
        scrolled = scroller.scrollLeft > 4;
    }

    onMount(() => {
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(scroller);
        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    });
</script>

<div class="relative {className}">
    <div
        bind:this={scroller}
        onscroll={measure}
        class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm"
    >
        {@render children()}
    </div>

    <!-- Right-edge fade: implies more content to the right, hidden once scrolled to the end -->
    <div
        class="pointer-events-none absolute inset-y-px right-px w-14 rounded-r-xl bg-gradient-to-l from-black/10 to-transparent transition-opacity duration-200"
        class:opacity-0={!canScroll || atEnd}
        aria-hidden="true"
    ></div>

    <!-- Swipe nudge: shown until the user begins scrolling -->
    <div
        class="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-[#4A2C2C]/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm transition-opacity duration-200"
        class:opacity-0={!canScroll || scrolled}
        aria-hidden="true"
    >
        Swipe
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </div>
</div>
