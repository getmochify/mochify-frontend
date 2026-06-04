// Moves a node to document.body (or a chosen target) so overlays escape any
// ancestor stacking context or transformed/`backdrop-filter` parent that would
// otherwise clip a `position: fixed` element or pin it below the nav.
// Usage: <div use:portal class="fixed inset-0 z-50 …">…</div>
export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
	const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
	if (targetEl) targetEl.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) node.parentNode.removeChild(node);
		}
	};
}
