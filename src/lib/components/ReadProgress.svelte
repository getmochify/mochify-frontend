<!--
    Reading progress bar - reimplemented as a pure CSS scroll-driven animation
    so it works with zero client JS (guide pages ship csr = false).

    The bar's width is tied directly to document scroll position via
    `animation-timeline: scroll(root)`. In browsers that don't support
    scroll-driven animations yet, the container is hidden entirely
    (progressive enhancement - no JS polyfill).
-->
<div class="read-progress-container" aria-hidden="true">
	<div class="read-progress-bar"></div>
</div>

<style>
	.read-progress-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: rgba(255, 240, 243, 0.3);
		z-index: 9999;
		pointer-events: none;
	}

	.read-progress-bar {
		height: 100%;
		width: 100%;
		transform: scaleX(0);
		transform-origin: 0 50%;
		background: linear-gradient(90deg, #ffb3c6 0%, #f06292 50%, #e0acd5 100%);
		box-shadow: 0 0 10px rgba(240, 98, 146, 0.3);
		will-change: transform;
	}

	@supports (animation-timeline: scroll()) {
		.read-progress-bar {
			animation: read-progress-grow auto linear;
			animation-timeline: scroll(root block);
			animation-fill-mode: both;
		}
	}

	/* No scroll-timeline support: there is no reliable JS-free way to track
       scroll position, so hide the bar rather than show a static/misleading
       one. */
	@supports not (animation-timeline: scroll()) {
		.read-progress-container {
			display: none;
		}
	}

	@keyframes read-progress-grow {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
</style>
