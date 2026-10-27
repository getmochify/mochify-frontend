<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
	import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
	import GuideSchema from '$lib/components/GuideSchema.svelte';

	// Built from content-ops `article-originals/what-is-a-webp-file.html`
	// (handoff spec v1, profile quick-answer). Body copy is verbatim from the
	// handoff; head and schema are generated from its metadata block per the
	// spec's section 2.2 contract. Quick answer: no TOC, no FAQ, no FAQPage.
	const metadata = {
		title: 'What Is a WebP File? (And How to Open One)',
		seoTitle: 'What Is a WebP File? (And How to Open One) | Mochify',
		description:
			"A WebP file is Google's smaller web image format. Why your download saved as .webp, how to open it on Windows, Mac and phone, and when to convert it.",
		category: 'Quick Guides',
		readTime: '3 min read',
		date: 'October 27, 2026',
		bylineNote:
			"Based on Google's WebP documentation, Apple, Microsoft and Adobe support pages, MDN and caniuse.com data current to October 2026."
	};

	const keywords =
		'webp file, what is a webp file, how to open webp file, open webp file, why are my images saving as webp, webp to jpg, webp to png, webp format';

	const pageUrl = 'https://mochify.app/guides/what-is-a-webp-file';

	const related = [
		{
			title: 'How to Save a WebP as JPG in Chrome: Every Route That Actually Works',
			href: '/guides/save-webp-as-jpg-chrome',
			desc: 'Stop the problem at the download.'
		},
		{
			title:
				'Do WebP and AVIF Support Transparency? Why Cut-Outs Come Back Black or White (and How to Fix It)',
			href: '/guides/webp-avif-transparency',
			desc: 'Why cut-outs come back black or white.'
		},
		{
			title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?',
			href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
			desc: 'The format decision for your own site.'
		}
	];
</script>

<ReadProgress />

<svelte:head>
	<title>{metadata.seoTitle}</title>
	<meta name="description" content={metadata.description} />
	<meta name="keywords" content={keywords} />
	<meta
		name="robots"
		content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content={metadata.description} />

	<GuideSchema
		name={metadata.title}
		url={pageUrl}
		description={metadata.description}
		datePublished="2026-10-27"
		article={{
			about: ['WebP', 'WebP file format', 'image formats', 'browser support', 'image conversion'],
			keywords
		}}
	/>
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

	<header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category} · Guide
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="WebP File" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			A WebP file is an ordinary picture, like a JPG or PNG, saved in a newer format that Google
			released in 2010 so that web pages load faster. The name ends in <code>.webp</code>, and you
			usually get one by saving an image from a website. To open it, drag it into any browser tab;
			Windows 10 and 11, macOS Big Sur (2020) and later, iOS 14 and Android 4.0 and later can open
			it in their own apps too. The file is not broken and it is not a virus: it is a normal photo
			in a format some older apps have not caught up with.
		</p>

		<div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
			<p class="m-0 text-base leading-relaxed text-[#6C3F31]">
				<strong class="text-[#4A2C2C]"
					>Published {metadata.date} by the Mochify Engineering Team.</strong
				>
				{metadata.bylineNote}
			</p>
		</div>
	</header>

	<div class="space-y-12">
		<section id="why-your-download-is-a-webp-and-not-a-jpg" class="scroll-mt-24">
			<SectionHeading>Why your download is a .webp and not a .jpg</SectionHeading>
			<p class="mb-4">
				Saved a product photo and got <code>shoes.webp</code> instead of <code>shoes.jpg</code>? The
				website chose that, because WebP makes the same picture a smaller file, and a smaller file
				means a faster page. Every image format shrinks a picture one of two ways: <em>lossy</em>
				throws away fine detail your eye will not miss, which is what JPG does, and
				<em>lossless</em>
				keeps every pixel, which is what PNG does. WebP can do either, and does both more
				efficiently: 25 to 34% smaller than a JPEG that looks the same, about 26% smaller than a PNG
				(<a
					href="https://developers.google.com/speed/webp"
					target="_blank"
					rel="noopener noreferrer">Google Developers</a
				>).
			</p>
			<p class="mb-4">
				Your browser helps the site along. When it asks for an image it says which formats it can
				display, and Chrome, Edge, Firefox and Safari all include <code>image/webp</code> in that
				request (<a
					href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation/List_of_default_Accept_values"
					target="_blank"
					rel="noopener noreferrer">MDN</a
				>), so the server sends the WebP even when the address ends in <code>.jpg</code>.
				Right-click, Save image as, and you keep the file that arrived. That is fine for browsers,
				where 97% of traffic can show WebP as of September 2026 (<a
					href="https://caniuse.com/webp"
					target="_blank"
					rel="noopener noreferrer">caniuse.com</a
				>); the trouble starts afterwards, with an older editor, a print service or an upload form
				that insists on "JPG or PNG".
			</p>
		</section>

		<section id="how-to-open-a-webp-file-by-platform" class="scroll-mt-24">
			<SectionHeading>How to open a WebP file, by platform</SectionHeading>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Any browser:</strong> drag the file into a tab, or right-click it, choose Open with,
						and pick your browser.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Windows 10 and 11:</strong> Photos and File Explorer open <code>.webp</code>
						when Microsoft's free
						<a
							href="https://apps.microsoft.com/detail/9pg2dk419drg"
							target="_blank"
							rel="noopener noreferrer">WebP Image Extension</a
						> is present, which on most current machines it already is; if a double-click fails, install
						it from the Microsoft Store.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Mac:</strong> Apple added WebP with Safari 14 in macOS Big Sur (<a
							href="https://developer.apple.com/documentation/safari-release-notes/safari-14-release-notes"
							target="_blank"
							rel="noopener noreferrer">Safari 14 release notes</a
						>); in practice Preview and Quick Look open it on Big Sur and later.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>iPhone and Android:</strong> iOS 14 and Android 4.0 and later can read WebP, so it
						opens in the browser and in most gallery apps.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Photoshop:</strong> native since version 23.2 (February 2022); 23.1 and earlier
						need Google's free WebPShop plug-in (<a
							href="https://helpx.adobe.com/photoshop/kb/support-webp-image-format.html"
							target="_blank"
							rel="noopener noreferrer">Adobe</a
						>).
					</p>
				</li>
			</ul>
		</section>

		<section id="opening-it-is-not-converting-it" class="scroll-mt-24">
			<SectionHeading>Opening it is not converting it</SectionHeading>
			<p class="mb-4">
				Opening lets you look at the picture. If the form, printer or app you need still refuses it,
				convert it to a format it accepts, and pick that format by what the image is. A photo goes
				to JPG: Mochify's <a href="https://mochify.app/solutions/webp-to-jpg"
					>WebP to JPG converter</a
				>
				takes up to 3 files at a time with no signup, 20MB each, and gives back JPGs that look the
				same on screen. A logo, sticker or cut-out with a see-through background goes to PNG,
				because JPG cannot hold transparency and fills it with white: the
				<a href="https://mochify.app/solutions/webp-to-png">WebP to PNG converter</a> keeps the
				transparent background pixel for pixel. On both pages a switch appears after upload that
				removes the hidden camera data (EXIF), on by default, and an animated WebP comes back as a
				still of its first frame. Files travel over HTTPS to <code>api.mochify.app</code>, are
				converted in memory and discarded as soon as your download is ready; nothing is written to
				disk.
			</p>
			<p class="mb-4">
				Worked example: <code>shoes.webp</code> opens fine in Photos on Windows 11, but the
				marketplace listing form rejects it. Drop it on WebP to JPG, download
				<code>shoes.jpg</code>, and check the extension in your browser's download bar before you
				upload. Doing this often? Our guide to
				<a href="https://mochify.app/guides/save-webp-as-jpg-chrome"
					>saving a WebP as JPG in Chrome</a
				> covers every route.
			</p>
		</section>

		<GlassCTA href="/solutions/webp-to-jpg" label="Try it free">
			Got a folder of them? Drop the lot on the <a href="https://mochify.app/solutions/webp-to-jpg"
				>WebP to JPG converter</a
			>, or open the Mochify web app and type
			<em>convert these to JPG and remove the metadata</em>; Magic Flow does the rest.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>
