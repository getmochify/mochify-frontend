<script lang="ts">
	import ExifViewer from '$lib/components/ExifViewer.svelte';
	import FaqAccordion from '$lib/components/FaqAccordion.svelte';
	import { faqSchema, type FaqItem } from '$lib/faq';
	import { SECTIONS, REASONS } from '$lib/exif/sections';

	// Phase 1 of content-ops' build brief 2026-11-18 (EXIF remover and viewer):
	// the viewer, read-only. Its title and copy promise viewing only, so it is
	// indexed as it stands; "Remove selected" and the after view come next, with
	// the brief's own title. The copy is the dev placeholder the brief allows;
	// content-ops writes the real sheet.

	const metaDescription =
		'See the EXIF data hidden in a photo: location, camera, dates, AI labels and more. Read in your browser, so the photo is never uploaded. Free, no signup.';

	const faqs: FaqItem[] = [
		{
			q: 'Is my photo uploaded?',
			a: 'No. The photo is read in your browser, on your device. No part of the file and nothing read from it is sent to Mochify or anywhere else.'
		},
		{
			q: 'Which files can I check?',
			a: 'JPG, PNG, WebP, AVIF, iPhone HEIC and camera HIF files from Fujifilm, Canon and Sony, one photo at a time, up to 200 MB.'
		},
		{
			q: 'Why is some metadata marked "Essential, kept"?',
			a: 'A few items are needed for the picture to look right: its orientation, its color profile, an HDR gain map and its pixel density. None of them says anything about you or where the photo was taken.'
		},
		{
			q: 'What do red, amber and green mean in the EXIF viewer?',
			a: 'Red marks values that identify you or your location on their own, such as GPS coordinates, a camera serial number or your name. Amber marks values that could help identify you in combination, such as the date and your phone model, and anything the viewer cannot read. Green marks technical values that are not personal on their own, such as exposure settings.'
		},
		{
			q: 'What is the embedded thumbnail?',
			a: 'A small preview the camera or an app stored inside the file. Editors do not always update it, so it can still show the photo as it was before a crop or an edit.'
		}
	];

	const softwareLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'EXIF Viewer',
		description: metaDescription,
		url: 'https://mochify.app/solutions/exif-viewer',
		applicationCategory: 'MultimediaApplication',
		operatingSystem: 'Web',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
		provider: { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' }
	};

	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqSchema(faqs)
	};

	const essentials = [
		{ label: 'Orientation', reason: REASONS.orientation },
		{ label: 'Color profile', reason: REASONS.color },
		{ label: 'HDR gain map', reason: REASONS.gainMap },
		{ label: 'Pixel density', reason: REASONS.density }
	];

	const linkClass = 'font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors';
</script>

<svelte:head>
	<title>EXIF Viewer - View Photo Metadata Online | Mochify</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:description" content={metaDescription} />
	<meta name="twitter:description" content={metaDescription} />

	{@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative mx-auto w-full max-w-5xl flex-grow px-4 pt-7 pb-12 sm:px-6 lg:px-8">
	<div class="mb-12 space-y-6 text-center">
		<h1 class="text-4xl font-black tracking-tight text-cocoa-ink sm:text-5xl">
			EXIF
			<span
				class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent"
				>Viewer</span
			>
		</h1>
		<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-balance text-cocoa-deep">
			See the metadata hidden in a photo: where it was taken, the camera and its settings, the
			dates, who made it and any AI labels, grouped in plain sections. The photo is read in your
			browser and never uploaded.
		</p>
	</div>

	<div class="mb-12">
		<ExifViewer />
	</div>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">How to read a photo's metadata</h2>
		<ol class="list-decimal space-y-2 pl-6 leading-relaxed text-cocoa-deep">
			<li>Drop a photo on the box above, or tap it to pick one from your phone.</li>
			<li>Read the summary line: it lists each kind of metadata the photo holds.</li>
			<li>
				Open a section to see its values in plain words, and the essentials the photo needs to look
				right.
			</li>
		</ol>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">What each section means</h2>
		<dl class="space-y-3">
			{#each SECTIONS as s (s.id)}
				<div>
					<dt class="font-bold text-cocoa-ink">{s.title}</dt>
					<dd class="leading-relaxed text-cocoa-deep">{s.blurb}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">What the colors mean</h2>
		<p class="leading-relaxed text-cocoa-deep">
			Each value is marked by how much it says about you. Red identifies you or your location on its
			own: GPS coordinates, a camera serial number, your name, or an embedded preview that can show
			what you cropped out. Amber could help identify you when combined with something else, such as
			the date, your phone model or an editing history, and it also marks anything this viewer
			cannot read. Green is technical detail that is not personal on its own, such as shutter speed
			or image size. The colors describe each value. They are not a verdict on whether the photo is
			safe to share: what is in the picture matters too.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">What is kept and why</h2>
		<dl class="space-y-3">
			{#each essentials as e (e.label)}
				<div>
					<dt class="font-bold text-cocoa-ink">{e.label}</dt>
					<dd class="leading-relaxed text-cocoa-deep">{e.reason}</dd>
				</div>
			{/each}
		</dl>
		<p class="leading-relaxed text-cocoa-deep">
			Our guide to <a href="/guides/remove-metadata-from-photo" class={linkClass}
				>removing metadata from a photo</a
			>
			explains what each kind of metadata can reveal. For a smaller file or a different format, try the
			<a href="/solutions/reduce-image-size-in-kb" class={linkClass}>image size reducer</a> or the
			<a href="/solutions/heif-to-jpg" class={linkClass}>HEIC to JPG converter</a>.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl">
		<h2 class="mb-4 text-2xl font-bold text-cocoa-ink">Frequently asked questions</h2>
		<FaqAccordion {faqs} />
	</section>
</div>
