<script lang="ts">
	import ExifRemover from '$lib/components/ExifRemover.svelte';
	import FaqAccordion from '$lib/components/FaqAccordion.svelte';
	import { faqSchema, type FaqItem } from '$lib/faq';
	import { SECTIONS, REASONS } from '$lib/exif/sections';

	// The bulk remover of content-ops' build brief 2026-11-18 (EXIF remover and
	// viewer), phase 3. Title and description are the brief's provisional key
	// elements; the sections follow its order (section 8), with dev placeholder
	// copy until content-ops writes the sheet. Copy rules: never "removes all
	// metadata" (the essentials stay), never "removes AI watermarks" (a
	// watermark in the pixels is not metadata), "in your browser" belongs on
	// these two pages only, and the batch ceiling is stated, not "no limits".

	const metaDescription =
		'Free online EXIF remover: strip metadata, GPS location and AI labels from your photos in your browser. Nothing is uploaded or recompressed. No signup.';

	const faqs: FaqItem[] = [
		{
			q: 'Are my photos uploaded?',
			a: 'No. The photos are read and cleaned in your browser, on your device. No part of a file and nothing read from it is sent to Mochify or anywhere else, which is also why there is no signup and no monthly allowance.'
		},
		{
			q: 'Is this EXIF remover safe to use?',
			a: 'Your photos never leave your device. The page reads and cleans them in your browser and sends no part of a file anywhere. The picture itself is not changed, and your original files stay as they are: you download cleaned copies with "-clean" added to the name.'
		},
		{
			q: 'Is the EXIF remover free?',
			a: 'Yes. It is free with no signup, and because nothing is uploaded there is no monthly allowance to use up. You can clean up to 200 photos or 2 GB in one batch and run as many batches as you like.'
		},
		{
			q: 'Should I remove EXIF data before sharing a photo?',
			a: 'Remove it when the photo is going anywhere public, or to someone you would not give your address to. A phone photo usually records where it was taken, when, and on which device. Some apps strip this when you post and some do not, so cleaning the file first is the only way to be sure. Keep the metadata on your own archive copies: dates and locations are what let you search them later.'
		},
		{
			q: 'Does removing EXIF data reduce the quality?',
			a: 'No. Only the metadata is taken out. The picture data is copied byte for byte, so the cleaned photo has the same pixels and the same dimensions. The file is usually a little smaller.'
		},
		{
			q: 'Does it remove all metadata?',
			a: 'It removes everything that identifies you, your camera or your location: GPS, camera and lens details and serial numbers, dates, names and copyright, software and edit history, AI labels and Content Credentials, the embedded thumbnail and comments. Four items are kept because the photo needs them to look right: its orientation, color profile, HDR gain map and pixel density.'
		},
		{
			q: 'Can I remove only the location?',
			a: 'Yes. Tick Location only before you choose Remove. The GPS position, altitude, direction and place names are taken out and everything else stays.'
		},
		{
			q: 'How many photos can I clean at once?',
			a: 'Up to 200 photos or 2 GB per batch, with each photo up to 200 MB. The cleaned photos are held in your browser until you download them, so the limit keeps the ZIP within what a browser can hold. For more, run another batch.'
		},
		{
			q: 'Does it remove AI watermarks?',
			a: 'It removes AI labels stored as metadata: Content Credentials (C2PA), AI-generation fields and the prompt text some generators write into PNG files. A watermark drawn into the picture itself is part of the pixels, not metadata, and is not touched.'
		},
		{
			q: 'Which files can I clean?',
			a: 'JPG, PNG, WebP, AVIF, iPhone HEIC and camera HIF files from Fujifilm, Canon and Sony. A file that is another type or cannot be read is skipped and named, and the rest of the batch carries on.'
		}
	];

	const softwareLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'EXIF Remover',
		description: metaDescription,
		url: 'https://mochify.app/solutions/exif-remover',
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
	<title>EXIF Remover - Photo Metadata Remover, No Upload | Mochify</title>
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
				>Remover</span
			>
		</h1>
		<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-balance text-cocoa-deep">
			This EXIF remover strips the metadata from your photos, one or 200 at a time: the EXIF data,
			GPS location, camera details, dates, names and AI labels. Everything happens in your browser:
			your photos are never uploaded and the picture itself is not recompressed. To see what one
			photo holds first, use the
			<a href="/solutions/exif-viewer" class={linkClass}>EXIF viewer</a>.
		</p>
	</div>

	<div class="mb-4">
		<ExifRemover />
	</div>
	<p class="mb-12 text-center text-sm text-cocoa-milk">
		Want to choose what goes, one photo at a time?
		<a href="/solutions/exif-viewer" class={linkClass}>Open the EXIF viewer</a>.
	</p>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">How to remove EXIF data from photos</h2>
		<ol class="list-decimal space-y-2 pl-6 leading-relaxed text-cocoa-deep">
			<li>Drop your photos on the box above, or tap it to pick them from your phone.</li>
			<li>
				Check the summary of what was found, then choose Remove metadata. Tick Location only if you
				want to keep everything else.
			</li>
			<li>Download each photo, or all of them as one ZIP. Each name ends in "-clean".</li>
		</ol>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">What metadata the EXIF remover takes out</h2>
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
			Picture data stored beside the main image, such as a depth map, is not metadata and is left as
			it is.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">Remove AI metadata and Content Credentials</h2>
		<p class="leading-relaxed text-cocoa-deep">
			Many AI image tools record how a picture was made: Content Credentials (C2PA) manifests,
			AI-generation fields in XMP, and in PNG files the prompt and settings as text. These are
			metadata, so the remover takes them out with the rest. A visible or hidden watermark drawn
			into the picture is part of the pixels and stays, because the picture is never changed.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">
			Remove EXIF data from iPhone HEIC and camera HIF files
		</h2>
		<p class="leading-relaxed text-cocoa-deep">
			iPhone HEIC photos and HIF files from Fujifilm, Canon and Sony cameras are cleaned in place:
			the metadata is blanked where it sits, so the photo stays a HEIC or HIF, opens in the same
			apps, and keeps its rotation and colors. Nothing is converted. If you want a JPG as well, use
			the <a href="/solutions/heif-to-jpg" class={linkClass}>HEIC to JPG converter</a>.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">View a photo's EXIF data first</h2>
		<p class="leading-relaxed text-cocoa-deep">
			The <a href="/solutions/exif-viewer" class={linkClass}>EXIF viewer</a> shows every value in a
			single photo, marks each one by how much it says about you, and lets you remove only the
			sections you choose. It then reads the cleaned file back so you can see what is left. Our
			guide to
			<a href="/guides/remove-metadata-from-photo" class={linkClass}
				>removing metadata from a photo</a
			>
			explains what each kind of metadata can reveal. For a smaller file, try the
			<a href="/solutions/reduce-image-size-in-kb" class={linkClass}>image size reducer</a>.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl">
		<h2 class="mb-4 text-2xl font-bold text-cocoa-ink">Frequently asked questions</h2>
		<FaqAccordion {faqs} />
	</section>
</div>
