<!--
    Back-to-top control - reimplemented as a plain anchor jump so it works
    with zero client JS (guide pages ship csr = false). Scrolling is handled
    by the browser (`href="#top"` + `scroll-behavior: smooth` on the guides
    layout, see guides/+layout.svelte).

    The show-after-scrolling behaviour is reproduced with a CSS scroll-driven
    animation (`animation-timeline: scroll(root)`) that fades/reveals the
    button once the reader has scrolled past ~400px. Browsers without support
    for scroll-driven animations simply show the button at all times - always
    visible degrades better here than always hidden, since the control stays
    reachable and unobtrusive either way.
-->
<a
	href="#top"
	aria-label="Back to top"
	class="back-to-top group fixed right-8 bottom-8 z-[9999] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-pink-100 bg-white/90 no-underline shadow-lg shadow-pink-100/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-pink-200 active:scale-95"
>
	<div
		class="absolute inset-0 rounded-full bg-[#FFF0F3] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		aria-hidden="true"
	></div>

	<svg
		class="relative z-10 h-6 w-6 text-[#8B5E51] transition-colors duration-300 group-hover:text-[#D81B60]"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		stroke-width="3"
		aria-hidden="true"
	>
		<path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</a>

<style>
	.back-to-top {
		opacity: 1;
		visibility: visible;
	}

	@supports (animation-timeline: scroll()) {
		.back-to-top {
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			animation: back-to-top-reveal linear both;
			animation-timeline: scroll(root block);
			animation-range: 320px 480px;
		}
	}

	@keyframes back-to-top-reveal {
		from {
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
		}
		to {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}
	}
</style>
