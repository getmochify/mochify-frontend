<script lang="ts">
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import FaqAccordion from '$lib/components/FaqAccordion.svelte';
	import KbSizeLinks from '$lib/components/KbSizeLinks.svelte';
	import { faqSchema, type FaqItem } from '$lib/faq';
	import { kbSizes } from '$lib/data/compressToKb';

	// The general page of the compress-to-KB family: a number box with a
	// KB / MB choice in place of the size pages' preset, and one table of
	// every tested size in place of their per-size sections. Copy follows the
	// 50 KB page (CompressToKbPage.svelte) with "the size you enter" for "50KB".

	const metaDescription =
		'Reduce image size in KB or MB online: enter the limit, drop in a JPG, PNG or HEIC photo, and get a JPG that fits. Free photo resizer, no signup.';

	const faqs: FaqItem[] = [
		{
			q: 'How do I reduce or resize an image in KB?',
			a: 'Enter the limit in KB or MB, then drop the image on the box at the top of this page. It comes back as a JPG of that size or less, with the final size and dimensions shown.'
		},
		{
			q: 'What size should I choose?',
			a: 'Use the limit your form or site states. If it gives a range, enter the upper number.'
		},
		{
			q: 'Will reducing the size in KB change the width and height?',
			a: 'Usually. The quality is lowered first and the picture is scaled down only if it still does not fit. At 50KB a phone photo came back at 20 to 27% of its width and height in our tests, and the page shows the final dimensions.'
		},
		{
			q: 'What if my image cannot reach the size I enter?',
			a: 'The page tells you. Quality is never taken below a fixed floor and a picture is never scaled below a tenth of its width and height. If the size is still out of reach, you get the smallest version possible and a message saying the limit was not met. Every photo and document we tested at 20, 50, 100 and 200KB fitted.'
		},
		{
			q: 'How do I get a photo between two sizes, such as 20KB and 50KB?',
			a: 'Enter the upper number. The result lands just under it: between 45 and 48KB for a 50KB limit in our tests. A picture that is already under the lower number cannot be made larger here.'
		},
		{
			q: 'Can I reduce the size of a PNG or an iPhone photo?',
			a: 'Yes. PNG, WebP, AVIF and iPhone HEIC files go in as they are and a JPG comes out.'
		},
		{
			q: 'How many bytes is a KB here?',
			a: 'This page counts 1,000 bytes to the KB and 1,000,000 to the MB, so 50KB means 50,000 bytes or less. A form that counts 1,024 bytes to the KB will accept it too.'
		},
		{
			q: 'Is it free?',
			a: 'Yes, for 3 images a month with no signup, or 25 a month with a free account. A $2 Day Pass covers 100 images in 24 hours with no signup.'
		},
		{
			q: 'What happens to my photo?',
			a: 'It travels over HTTPS to api.mochify.app, is compressed in memory and is discarded once your download is ready. Nothing is written to disk, no logs contain your file, and it is never used to train AI.'
		}
	];

	const softwareLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Image Size Reducer in KB',
		description: metaDescription,
		url: 'https://mochify.app/solutions/reduce-image-size-in-kb',
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

	const linkClass = 'font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors';
	const cellClass = 'px-4 py-3 text-cocoa-deep';
</script>

<svelte:head>
	<title>Reduce Image Size in KB - Photo Resizer Online | Mochify</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:description" content={metaDescription} />
	<meta name="twitter:description" content={metaDescription} />

	{@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative mx-auto w-full max-w-5xl flex-grow px-4 pt-7 pb-12 sm:px-6 lg:px-8">
	<div class="mb-12 space-y-6 text-center">
		<h1 class="text-4xl font-black tracking-tight text-cocoa-ink sm:text-5xl">
			Reduce Image Size
			<span
				class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent"
				>in KB</span
			>
		</h1>

		<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-balance text-cocoa-deep">
			Reduce an image's size in KB: enter the limit in KB or MB, drop in a photo, and it is
			compressed and resized into a JPG of that size or less, ready for a form or an upload limit.
			JPG, PNG, WebP, AVIF and iPhone HEIC photos all go in as they are. The page shows the final
			size in KB and the final width and height, so you know what you are uploading.
		</p>
	</div>

	<div class="mb-12">
		<ImageUpload output="jpg" showTypes={true} showExifOption={false} showTargetInput compact />
	</div>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">How to reduce an image size in KB</h2>
		<ol class="list-decimal space-y-2 pl-6 leading-relaxed text-cocoa-deep">
			<li>Enter the size limit your form or site states, in KB or MB.</li>
			<li>
				Drop your photo on the box above, or tap it to pick one from your phone. The picture is
				compressed, and scaled down if that is what it takes, until it is the size you entered or
				less.
			</li>
			<li>Check the size and the dimensions shown with the result, then download the JPG.</li>
		</ol>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">What to expect at each size</h2>
		<p class="leading-relaxed text-cocoa-deep">
			These are our own results from this page's engine. Yours will differ a little: a detailed
			picture comes out smaller than a plain one.
		</p>
		<div class="overflow-x-auto rounded-2xl border border-pink-50 bg-white shadow-sm">
			<table class="w-full min-w-[40rem] text-left text-sm">
				<thead class="bg-mochi-blush text-cocoa-ink">
					<tr>
						<th scope="col" class="px-4 py-3 font-bold">Size</th>
						<th scope="col" class="px-4 py-3 font-bold">12 megapixel iPhone photo</th>
						<th scope="col" class="px-4 py-3 font-bold">Phone photo of a printed page</th>
						<th scope="col" class="px-4 py-3 font-bold">Width and height kept</th>
						<th scope="col" class="px-4 py-3 font-bold">How a photo looks</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-pink-50">
					{#each kbSizes as s (s.kb)}
						<tr>
							<th scope="row" class="px-4 py-3 font-bold"
								><a href="/solutions/{s.slug}" class={linkClass}>{s.kb}KB</a></th
							>
							<td class={cellClass}>about {s.photo12}</td>
							<td class={cellClass}>about {s.printed}, {s.printedNote}</td>
							<td class={cellClass}>{s.scale}</td>
							<td class={cellClass}>{s.lookShort}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="leading-relaxed text-cocoa-deep">
			Results landed just under the limit: between {kbSizes[1].resultLow} and {kbSizes[1]
				.resultHigh}KB for a 50KB limit, and between {kbSizes[3].resultLow} and {kbSizes[3]
				.resultHigh}KB for 200KB. A picture that is already smaller than a form's lower limit cannot
			be made larger here.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">Will the width and height change?</h2>
		<p class="leading-relaxed text-cocoa-deep">
			Usually, yes. The quality is lowered first, and if the file is still over the size you entered
			the picture is scaled down, keeping its shape. In our tests a phone photo ended up at {kbSizes[0]
				.scale} of its original width and height at 20KB, and {kbSizes[3].scale} at 200KB. The page shows
			the final dimensions before you download, so if your form also asks for an exact pixel size you
			can check it there.
		</p>
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">
			Why a file under the limit can still be rejected
		</h2>
		<p class="leading-relaxed text-cocoa-deep">
			There are three common reasons. The form counts kilobytes differently: this page treats 50KB
			as 50,000 bytes, the stricter of the two ways of counting, so the file passes either way. The
			form wants a different format: the download here is always a JPG. Or the form also checks the
			pixel size or the shape of the picture, which is a separate rule from file size.
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
		<KbSizeLinks />
	</section>

	<section class="mx-auto mt-16 max-w-4xl space-y-4">
		<h2 class="text-2xl font-bold text-cocoa-ink">Limits and automation</h2>
		<p class="leading-relaxed text-cocoa-deep">
			Free: 3 images a month with no signup, or 25 a month with a free account, at up to 20MB per
			file. A $2 <a href="/pricing#day-pass" class={linkClass}>Day Pass</a> covers 100 images in 24
			hours, 25 at a time, with no signup, and Seller, Pro and Growth plans take 25 per batch at up
			to 75MB each. For a whole folder, the <a href="/docs" class={linkClass}>API</a> takes the same target
			in bytes:
		</p>
		<pre
			class="overflow-x-auto rounded-2xl bg-[#2F2320] p-5 text-sm leading-relaxed text-[#F6EDE8]"><code
				>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;targetBytes=100000" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.heic \
  -o photo-100kb.jpg</code
			></pre>
	</section>

	<section class="mx-auto mt-16 max-w-4xl">
		<h2 class="mb-4 text-2xl font-bold text-cocoa-ink">Frequently asked questions</h2>
		<FaqAccordion {faqs} />
	</section>
</div>
