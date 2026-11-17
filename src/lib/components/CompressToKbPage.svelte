<script lang="ts">
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import FaqAccordion from '$lib/components/FaqAccordion.svelte';
	import KbSizeLinks from '$lib/components/KbSizeLinks.svelte';
	import { faqSchema, type FaqItem } from '$lib/faq';
	import type { KbSize } from '$lib/data/compressToKb';

	// One template for every "Compress Image to N KB" page. The pages differ
	// only by `size` (src/lib/data/compressToKb.ts); the copy is content-ops'
	// 50 KB page (handoff 2026-11-17-compress-to-kb-tool-pages-framework,
	// section 6) with the per-size values swapped in, and its product
	// statements are ledger-checked, so reword them only through content-ops.
	let { size }: { size: KbSize } = $props();

	const n = $derived(`${size.kb}KB`);
	const bytes = $derived(size.kb * 1000);
	const url = $derived(`https://mochify.app/solutions/${size.slug}`);

	const metaDescription = $derived(
		`Compress or resize an image to ${n} or less online. Drop in a JPG, JPEG, PNG or HEIC photo and get a JPG that fits your form's limit. Free, no signup.`
	);

	const cannotReachEnd = $derived(
		size.kb === 200
			? 'Every photo and document we tested at this size fitted, most at around half their original width and height.'
			: 'Every photo and document we tested at this size fitted.'
	);

	const textReadable = $derived(
		size.kb === 20
			? 'In our test a phone photo of a printed page came back at about 680 x 900. The text could be read but was rough. Crop the photo to the part of the page you need before you compress it, or use a larger limit if the form allows one.'
			: `In our test a phone photo of a printed page came back at about ${size.printed} with its small print ${size.printedReads}. If the text matters, crop the photo to the page before you compress it.`
	);

	const faqs: FaqItem[] = $derived([
		{
			q: `How do I compress or resize an image to ${n}?`,
			a: `Drop it on the box at the top of this page. It comes back as a JPG of ${n} or less, with the final size and dimensions shown.`
		},
		{
			q: `Will compressing to ${n} change the width and height?`,
			a: `Usually. The quality is lowered first and the picture is scaled down only if it still does not fit. A phone photo came back at ${size.scale} of its width and height in our tests, and the page shows the final dimensions.`
		},
		{
			q: `What if my image cannot reach ${n}?`,
			a: `The page tells you. Quality is never taken below a fixed floor and a picture is never scaled below a tenth of its width and height. If ${n} is still out of reach, you get the smallest version possible and a message saying the limit was not met. ${cannotReachEnd}`
		},
		{
			q: `How do I get a photo between ${size.rangeLow}KB and ${n}?`,
			a: `Use this page. The result lands just under ${n}, between ${size.resultLow} and ${size.resultHigh}KB in our tests. A picture that is already under ${size.rangeLow}KB cannot be made larger here.`
		},
		{
			q: `Will text stay readable at ${n}?`,
			a: textReadable
		},
		{
			q: `Can I compress a JPEG, PNG or iPhone photo to ${n}?`,
			a: 'Yes. JPG, JPEG, PNG, WebP, AVIF and iPhone HEIC files go in as they are and a JPG comes out.'
		},
		{
			q: `Is ${n} the same as ${size.mb}?`,
			a: `Yes. This page counts 1,000 bytes to the KB, so ${n} means ${bytes.toLocaleString('en-US')} bytes or less. A form that counts 1,024 bytes to the KB will accept it too.`
		},
		{
			q: `Is the ${n} image compressor free?`,
			a: 'Yes, for 3 images a month with no signup, or 25 a month with a free account. A $2 Day Pass covers 100 images in 24 hours with no signup.'
		},
		{
			q: 'What happens to my photo?',
			a: 'It travels over HTTPS to api.mochify.app, is compressed in memory and is discarded once your download is ready. Nothing is written to disk, no logs contain your file, and it is never used to train AI.'
		}
	]);

	const softwareLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: `Compress Image to ${n}`,
		description: metaDescription,
		url,
		applicationCategory: 'MultimediaApplication',
		operatingSystem: 'Web',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
		provider: { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' }
	});

	const faqLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqSchema(faqs)
	});

	const linkClass = 'font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors';
	const cellClass = 'px-4 py-3 text-cocoa-deep';
</script>

<svelte:head>
	<title>Compress Image to {n} Online - {size.titleTail} | Mochify</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:description" content={metaDescription} />
	<meta name="twitter:description" content={metaDescription} />

	{@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative mx-auto w-full max-w-5xl flex-grow px-4 pt-7 pb-12 sm:px-6 lg:px-8">
	<div class="mb-12 space-y-6 text-center">
		<h1 class="text-4xl font-black tracking-tight text-cocoa-ink sm:text-5xl">
			Compress Image to
			<span
				class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent"
				>{n}</span
			>
		</h1>

		<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-balance text-cocoa-deep">
			Compress an image to {n} or less online: drop in a photo and get back a JPG that fits a form or
			an upload limit. JPG, JPEG, PNG, WebP, AVIF and iPhone HEIC files all go in as they are. The page
			shows the final size in KB and the final width and height, so you know what you are uploading.
		</p>
	</div>

	<div class="mb-12">
		<ImageUpload output="jpg" showTypes={true} showExifOption={false} targetBytes={bytes} compact />
	</div>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">How to compress an image to {n}</h2>
		<ol class="list-decimal space-y-2 pl-6 leading-relaxed text-cocoa-deep">
			<li>Drop your photo on the box above, or tap it to pick one from your phone.</li>
			<li>
				Wait a few seconds. The picture is compressed, and scaled down if that is what it takes,
				until it is {n} or less.
			</li>
			<li>Check the size and the dimensions shown with the result, then download the JPG.</li>
		</ol>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">{n} photo size: what the picture looks like</h2>
		<p class="leading-relaxed text-cocoa-deep">
			These are our own results from this page's engine. Yours will differ a little: a detailed
			picture comes out smaller than a plain one.
		</p>
		<div class="overflow-x-auto rounded-2xl border border-pink-50 bg-white shadow-sm">
			<table class="w-full text-left text-sm">
				<thead class="bg-mochi-blush text-cocoa-ink">
					<tr>
						<th scope="col" class="px-4 py-3 font-bold">What went in</th>
						<th scope="col" class="px-4 py-3 font-bold">What came back at {n}</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-pink-50">
					<tr
						><td class={cellClass}>A 12 megapixel iPhone photo (4032 x 3024)</td><td
							class={cellClass}>about {size.photo12}</td
						></tr
					>
					<tr
						><td class={cellClass}>A 24 megapixel iPhone photo (5712 x 4284)</td><td
							class={cellClass}>about {size.photo24}</td
						></tr
					>
					<tr
						><td class={cellClass}>A phone photo of a printed page</td><td class={cellClass}
							>about {size.printed}, {size.printedNote}</td
						></tr
					>
				</tbody>
			</table>
		</div>
		<p class="leading-relaxed text-cocoa-deep">{size.look}</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">
			Resizing an image to {n}: will the width and height change?
		</h2>
		<p class="leading-relaxed text-cocoa-deep">
			Usually, yes. The quality is lowered first, and if the file is still over {n} the picture is scaled
			down, keeping its shape. In our tests a phone photo ended up at {size.scale} of its original width
			and height at this size. The page shows the final dimensions before you download, so if your form
			also asks for an exact pixel size you can check it there.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">
			If the form wants a range, such as {size.rangeLow}KB to {n}
		</h2>
		<p class="leading-relaxed text-cocoa-deep">
			The result lands just under the upper limit: between {size.resultLow} and {size.resultHigh}KB
			in our tests. A picture that is already smaller than the lower limit cannot be made larger
			here.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">Why a {n} file can still be rejected</h2>
		<p class="leading-relaxed text-cocoa-deep">
			There are three common reasons. The form counts kilobytes differently: this page treats {n} as {bytes.toLocaleString(
				'en-US'
			)} bytes, the stricter of the two ways of counting, so the file passes either way. The form wants
			a different format: the download here is always a JPG. Or the form also checks the pixel size or
			the shape of the picture, which is a separate rule from file size.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">From an iPhone, a screenshot or a WebP</h2>
		<p class="leading-relaxed text-cocoa-deep">
			HEIC photos from an iPhone, PNG screenshots, WebP and AVIF images go in without converting
			them first. What comes back is a JPG, the format most upload forms ask for. Hidden camera
			data, including location, is removed; our guide to
			<a href="/guides/remove-metadata-from-photo" class={linkClass}
				>removing metadata from a photo</a
			>
			explains what that covers. Starting from an iPhone? See
			<a href="/guides/reduce-photo-file-size-iphone" class={linkClass}
				>how to reduce photo file size on iPhone</a
			>.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">Other sizes</h2>
		<KbSizeLinks current={size.kb} />
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">Limits and automation</h2>
		<p class="leading-relaxed text-cocoa-deep">
			Free: 3 images a month with no signup, or 25 a month with a free account, at up to 20MB per
			file. A $2 <a href="/pricing#day-pass" class={linkClass}>Day Pass</a> covers 100 images in 24
			hours, 25 at a time, with no signup, and Seller, Pro and Growth plans take 25 per batch at up
			to 75MB each. For a whole folder, the <a href="/docs" class={linkClass}>API</a> takes the same target:
		</p>
		<pre
			class="overflow-x-auto rounded-2xl bg-[#2F2320] p-5 text-sm leading-relaxed text-[#F6EDE8]"><code
				>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;targetBytes={bytes}" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.heic \
  -o photo-{size.kb}kb.jpg</code
			></pre>
	</section>

	<section class="mx-auto mt-16 max-w-4xl">
		<h2 class="mb-4 text-2xl font-bold text-cocoa-ink">Frequently asked questions</h2>
		<FaqAccordion {faqs} />
	</section>
</div>
