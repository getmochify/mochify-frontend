<script lang="ts">
	// A mochi that breathes, blinks, watches the pointer and squishes when
	// tapped. Plain SVG + CSS: no animation library, nothing loaded until the
	// page that uses it is. Built for the 404 page, where it is "lost", so it
	// glances around when left alone and now and then wonders aloud ("?").

	let { class: className = '' }: { class?: string } = $props();

	let svgEl: SVGSVGElement | undefined = $state();
	// Eye offset in SVG units, clamped so the pupils stay on the face.
	let look = $state({ x: 0, y: 0 });
	let squishing = $state(false);
	let squishes = $state(0);
	let said = $state('');

	const LINES = [
		'Hey!',
		'That tickles',
		"I'm lost too",
		'Still not the page',
		'Squishier than a JPEG',
		"OK, I'm flat now"
	];

	const MAX_LOOK = 6;

	$effect(() => {
		let idleTimer: ReturnType<typeof setTimeout>;
		let wanderTimer: ReturnType<typeof setInterval> | undefined;

		// Left alone, it looks around: the lost-mochi read, and it keeps the
		// face alive on touch screens, where there is no pointer to follow.
		const wander = () => {
			look = {
				x: (Math.random() * 2 - 1) * MAX_LOOK,
				y: (Math.random() * 2 - 1) * (MAX_LOOK / 2)
			};
		};
		const startWander = () => {
			if (!wanderTimer) wanderTimer = setInterval(wander, 1600);
		};

		const onMove = (e: PointerEvent) => {
			if (!svgEl) return;
			clearInterval(wanderTimer);
			wanderTimer = undefined;
			const r = svgEl.getBoundingClientRect();
			const dx = e.clientX - (r.left + r.width / 2);
			const dy = e.clientY - (r.top + r.height / 2);
			const dist = Math.hypot(dx, dy) || 1;
			// Eases toward the full offset over ~300px, so a pointer resting
			// near the mochi doesn't pin its eyes to the edge.
			const reach = Math.min(dist / 300, 1) * MAX_LOOK;
			look = { x: (dx / dist) * reach, y: (dy / dist) * reach * 0.6 };
			clearTimeout(idleTimer);
			idleTimer = setTimeout(startWander, 2500);
		};

		startWander();
		window.addEventListener('pointermove', onMove);
		return () => {
			window.removeEventListener('pointermove', onMove);
			clearTimeout(idleTimer);
			clearInterval(wanderTimer);
		};
	});

	let squishTimer: ReturnType<typeof setTimeout>;
	let sayTimer: ReturnType<typeof setTimeout>;

	function squish() {
		// Restart the keyframes on a rapid second tap: dropping the class for a
		// frame is what lets the browser replay the animation.
		squishing = false;
		requestAnimationFrame(() => (squishing = true));
		clearTimeout(squishTimer);
		squishTimer = setTimeout(() => (squishing = false), 650);

		said = LINES[squishes % LINES.length];
		squishes += 1;
		clearTimeout(sayTimer);
		sayTimer = setTimeout(() => (said = ''), 1800);
	}
</script>

<div class="mochi relative inline-block select-none {className}">
	{#if said}
		{#key squishes}
			<span class="bubble" role="status">{said}</span>
		{/key}
	{/if}

	<button
		type="button"
		onclick={squish}
		aria-label="Squish the mochi"
		class="block cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F06292]"
	>
		<!-- overflow visible: the squish spreads the body to 130% of its width,
		     past the viewBox edges, and an SVG clips to its viewport by default. -->
		<svg
			bind:this={svgEl}
			viewBox="0 0 200 180"
			overflow="visible"
			class="block h-auto w-full overflow-visible"
			aria-hidden="true"
		>
			<defs>
				<radialGradient id="mochi-body" cx="42%" cy="30%" r="78%">
					<stop offset="0%" stop-color="#FFFFFF" />
					<stop offset="55%" stop-color="#FFF5F8" />
					<stop offset="86%" stop-color="#FCDCE6" />
					<stop offset="100%" stop-color="#F7C9D8" />
				</radialGradient>
				<clipPath id="mochi-clip"><path d="M12 142 C8 104 40 46 100 46 C160 46 192 104 188 142 C186 162 160 166 100 166 C40 166 14 162 12 142 Z" /></clipPath>
				<!-- Blur does the softening: no hard edge anywhere on the body. -->
				<filter id="mochi-blur-1" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="1.2" />
				</filter>
				<filter id="mochi-blur-3" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="3" />
				</filter>
				<filter id="mochi-blur-5" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="5" />
				</filter>
				<filter id="mochi-blur-9" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="9" />
				</filter>
			</defs>

			<!-- Shadow squashes with the body, so the two read as one object. -->
			<ellipse
				class="shadow"
				class:squish={squishing}
				cx="100"
				cy="167"
				rx="78"
				ry="8"
				fill="#C9849B"
				opacity="0.25"
				filter="url(#mochi-blur-5)"
			/>

			<text
				class="huh"
				x="150"
				y="40"
				font-size="26"
				font-weight="900"
				font-family="'Outfit Variable', Outfit, sans-serif"
				fill="#F06292">?</text
			>

			<g class="body" class:squish={squishing}>
				<!-- A slumped daifuku rather than a dome: the base bulges past the
				     shoulders, which is most of what makes it read as soft. -->
				<path d="M12 142 C8 104 40 46 100 46 C160 46 192 104 188 142 C186 162 160 166 100 166 C40 166 14 162 12 142 Z" fill="url(#mochi-body)" />
				<!-- Shading inside the body instead of an outline: a blurred blush
				     pooled at the base and a soft inner rim, both clipped to the
				     silhouette so they fade into the edge rather than draw one. -->
				<g clip-path="url(#mochi-clip)">
					<ellipse
						cx="100"
						cy="176"
						rx="96"
						ry="30"
						fill="#F4B3C8"
						opacity="0.45"
						filter="url(#mochi-blur-9)"
					/>
					<path
						d="M12 142 C8 104 40 46 100 46 C160 46 192 104 188 142 C186 162 160 166 100 166 C40 166 14 162 12 142 Z"
						fill="none"
						stroke="#F0AEC4"
						stroke-width="5"
						opacity="0.6"
						filter="url(#mochi-blur-3)"
					/>
				</g>
				<!-- Sheen and a dusting of starch, the two things that make it mochi
				     rather than a pink blob. -->
				<ellipse
					cx="68"
					cy="72"
					rx="26"
					ry="11"
					fill="#FFFFFF"
					opacity="0.95"
					transform="rotate(-22 68 72)"
					filter="url(#mochi-blur-3)"
				/>
				<ellipse
					cx="60"
					cy="74"
					rx="7"
					ry="3.5"
					fill="#FFFFFF"
					transform="rotate(-22 60 74)"
					filter="url(#mochi-blur-1)"
				/>
				<circle cx="134" cy="66" r="1.5" fill="#FFFFFF" />
				<circle cx="146" cy="78" r="1.1" fill="#FFFFFF" />
				<circle cx="54" cy="100" r="1.1" fill="#FFFFFF" />

				<ellipse
					cx="60"
					cy="126"
					rx="15"
					ry="9"
					fill="#F7A1BE"
					opacity="0.55"
					filter="url(#mochi-blur-3)"
				/>
				<ellipse
					cx="140"
					cy="126"
					rx="15"
					ry="9"
					fill="#F7A1BE"
					opacity="0.55"
					filter="url(#mochi-blur-3)"
				/>

				{#if squishing}
					<!-- >< eyes while squished -->
					<g stroke="#4A2C2C" stroke-width="4" stroke-linecap="round" fill="none">
						<path d="M70 102 L80 109 L70 116" />
						<path d="M130 102 L120 109 L130 116" />
					</g>
					<ellipse cx="100" cy="128" rx="6" ry="7" fill="#4A2C2C" />
				{:else}
					<g class="eyes" style="transform: translate({look.x}px, {look.y}px)">
						<g class="blink">
							<ellipse cx="76" cy="108" rx="7" ry="9" fill="#4A2C2C" />
							<ellipse cx="124" cy="108" rx="7" ry="9" fill="#4A2C2C" />
							<circle cx="78.5" cy="104.5" r="2.4" fill="#FFFFFF" />
							<circle cx="126.5" cy="104.5" r="2.4" fill="#FFFFFF" />
						</g>
					</g>
					<path
						d="M93 125 Q100 131 107 125"
						stroke="#4A2C2C"
						stroke-width="3.2"
						stroke-linecap="round"
						fill="none"
					/>
				{/if}
			</g>
		</svg>
	</button>
</div>

<style>
	.body {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: breathe 3.2s ease-in-out infinite;
	}
	.body.squish {
		animation: squish 0.65s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.shadow {
		transform-box: fill-box;
		transform-origin: 50% 50%;
		animation: shadow 3.2s ease-in-out infinite;
	}
	.shadow.squish {
		animation: shadow-squish 0.65s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.eyes {
		transition: transform 0.35s cubic-bezier(0.3, 1.3, 0.5, 1);
	}
	.blink {
		transform-box: fill-box;
		transform-origin: 50% 50%;
		animation: blink 4.6s infinite;
	}
	.huh {
		opacity: 0;
		animation: huh 7s ease-out infinite;
		animation-delay: 2s;
	}

	.bubble {
		position: absolute;
		bottom: 100%;
		left: 50%;
		margin-bottom: 0.25rem;
		transform: translateX(-50%);
		white-space: nowrap;
		border-radius: 1rem;
		border: 1px solid #fce4ec;
		background: #fff;
		padding: 0.35rem 0.8rem;
		font-size: 0.8rem;
		font-weight: 800;
		color: #be185d;
		box-shadow: 0 4px 14px rgba(240, 98, 146, 0.15);
		animation: pop 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
	}

	@keyframes breathe {
		0%,
		100% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1.03, 0.97);
		}
	}
	@keyframes shadow {
		0%,
		100% {
			transform: scaleX(1);
		}
		50% {
			transform: scaleX(1.04);
		}
	}
	/* Tracks the body's squish keyframes horizontally. */
	@keyframes shadow-squish {
		0%,
		100% {
			transform: scaleX(1);
		}
		25% {
			transform: scaleX(1.3);
		}
		55% {
			transform: scaleX(0.9);
		}
		80% {
			transform: scaleX(1.04);
		}
	}
	@keyframes squish {
		0% {
			transform: scale(1, 1);
		}
		25% {
			transform: scale(1.3, 0.65);
		}
		55% {
			transform: scale(0.9, 1.12);
		}
		80% {
			transform: scale(1.04, 0.96);
		}
		100% {
			transform: scale(1, 1);
		}
	}
	@keyframes blink {
		0%,
		92%,
		100% {
			transform: scaleY(1);
		}
		95% {
			transform: scaleY(0.1);
		}
	}
	@keyframes huh {
		0%,
		70% {
			opacity: 0;
			transform: translateY(6px);
		}
		76%,
		90% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	@keyframes pop {
		from {
			transform: translateX(-50%) scale(0.6);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) scale(1);
			opacity: 1;
		}
	}

	/* Still: no breathing, blinking or squash. A tap still changes the face and
	   the bubble still speaks, so the interaction isn't lost. */
	@media (prefers-reduced-motion: reduce) {
		.body,
		.body.squish,
		.shadow,
		.shadow.squish,
		.blink,
		.huh,
		.bubble {
			animation: none;
		}
		.eyes {
			transition: none;
		}
	}
</style>
