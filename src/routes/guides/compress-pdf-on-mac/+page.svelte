<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import StepList from '$lib/components/guide-demo/StepList.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
	import GuideSchema from '$lib/components/GuideSchema.svelte';

	// Built from content-ops `article-originals/compress-pdf-on-mac.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract.
	const metadata = {
		title: 'How to Compress a PDF on Mac Without Losing Quality',
		seoTitle: 'How to Compress a PDF on Mac - Without Losing Quality',
		description:
			"What Preview's Reduce File Size really does (JPEG 0.7, 144 dpi on macOS 27), a custom filter for print, the iOS 27 route, and a one-prompt alternative.",
		category: 'Workflows',
		readTime: '20 min read',
		date: 'October 12, 2026',
		bylineNote:
			"The built-in filter's settings were read from the file itself on macOS 27.0, the iPhone steps were checked on iOS 27.0, and the Mochify figures come from our own test on the same photo, all on October 9, 2026."
	};

	const keywords =
		'how to compress a pdf on mac, compress pdf mac, reduce pdf file size mac, mac reduce pdf size, compress pdf without losing quality, pdf too large to email, compress pdf iphone';

	const pageUrl = 'https://mochify.app/guides/compress-pdf-on-mac';

	const toc = [
		{ id: 'the-30-second-version', label: 'The 30-second version' },
		{ id: 'compress-a-pdf-in-preview-on-mac', label: 'Compress a PDF in Preview on Mac' },
		{
			id: 'what-reduce-file-size-actually-does-to-your-images',
			label: 'What "Reduce File Size" actually does to your images'
		},
		{
			id: 'keep-the-pictures-sharp-a-custom-quartz-filter',
			label: 'Keep the pictures sharp: a custom Quartz filter'
		},
		{ id: 'why-your-pdf-is-so-big', label: 'Why your PDF is so big' },
		{ id: 'compress-a-pdf-on-iphone', label: 'Compress a PDF on iPhone' },
		{
			id: 'pdf-too-big-to-email-the-limits-and-the-way-around-them',
			label: 'PDF too big to email: the limits and the way around them'
		},
		{ id: 'mochify-workflow', label: 'Mochify workflow: compress a PDF in one prompt' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Open mochify.app/flow',
			html: `<p>Open <a href="https://mochify.app/flow">mochify.app/flow</a> and sign in, or pick up a Day Pass ($2 / £2, 100 uploads in 24 hours, no account needed) if you have a one-off batch.</p>`
		},
		{
			title: 'Add the PDF',
			html: `<p>Add the PDF (or several).</p>`
		},
		{
			title: 'Type what you need',
			html: `<p>Type what you need, such as "compress this PDF", and add a target if you have one: "for email" or "for screen" sets a 96 dpi target, saying nothing sets 150, and "for print" or "keep the quality" sets 300. Mochify measures each image's resolution against how large it is drawn on the page and downsamples only what is oversized for that target.</p>`
		},
		{
			title: 'Download the result',
			html: `<p>Seller, Pro and the Day Pass handle PDFs of up to 10 pages per file; Growth has no page cap within a 200-page ceiling, and a PDF over your plan's cap is refused outright, with an error naming the page count and the cap, rather than returned half-done. Each PDF you compress counts as one image against your plan's monthly allowance, however many images are inside it (100 on a Day Pass, 300 a month on Seller, 1,200 on Pro, 5,000 on Growth). A PDF with no images, or whose images are already smaller than the target, comes back unchanged, never larger.</p>`
		}
	];

	const faqItems = [
		{
			q: 'Does compressing a PDF reduce quality?',
			a: `It reduces the quality of the images inside it and nothing else. Text, fonts and vector graphics are untouched by every method on this page, so the type stays sharp and the document stays searchable. How much the images lose depends on the setting: Preview's built-in filter uses one fixed setting (JPEG quality 0.7 at 144 dpi on macOS 27), a custom Quartz filter or Mochify lets you choose, and a 150 dpi target is invisible on screen for a document that will not be printed.`
		},
		{
			q: "Why won't my PDF file size reduce?",
			a: `Because its weight is not images. A text-only PDF carries fonts, and a PDF that has been saved many times carries stacked incremental updates; image compression finds nothing to shrink. Re-export the file from the application that made it, which subsets the fonts and discards the history. If the file is a scan and barely shrinks, the filter's maximum image size is already above the scan's resolution; lower it, carefully, and check legibility.`
		},
		{
			q: 'Is it better to zip a PDF or reduce it?',
			a: `Reduce it. A PDF's images are already compressed, so zipping typically saves a few percent and the recipient has to unzip it. The Files app's "Compress" on iPhone and the Finder's "Compress" on Mac both make a zip; neither makes the PDF itself smaller.`
		},
		{
			q: 'Can I compress a PDF without any software?',
			a: `On a Mac, yes: Preview and ColorSync Utility are part of macOS. On an iPhone with iOS 27, yes: the Preview app's export sheet has the toggles. On iOS 26, not as a PDF; use a browser-based tool such as Mochify's Magic Flow instead.`
		},
		{
			q: 'How do I make a PDF file smaller so I can upload it?',
			a: `The same way you would for email: compress the images with any method above, then check the form's limit. Most upload limits sit between 5 and 25 MB, and a document whose weight is photos will usually land well under them at a screen-resolution setting. If the form wants a specific size, Mochify's prompt can name it.`
		},
		{
			q: 'Can ChatGPT compress a PDF?',
			a: `Not by itself. A chat assistant can tell you how, and an agent can call a tool that does it; Mochify's hosted MCP server exposes PDF optimize to agents that support MCP, and the API does the same for scripts. The compression is always done by an engine, not by the language model.`
		},
		{
			q: 'Why is Reduce File Size not working, or making my PDF bigger?',
			a: `Because the filter only recompresses images, and your PDF either has none worth shrinking or has images that were already smaller than the filter's output. A text-only PDF, a file whose fonts are the weight, or a scan already stored at low resolution gives the filter nothing to do; a PDF whose images were already small, well-compressed JPEGs can come out larger, because re-encoding them at the filter's fixed quality adds data rather than removing it. In the first case re-export from the source application; in the second keep the original, or use a tool that lets you set a resolution target so it only touches images that are actually oversized.`
		},
		{
			q: 'How do I compress a PDF on iPhone?',
			a: `On iOS 27: Preview &gt; More &gt; Export &gt; PDF, turn on Optimize Images for Screen and Save Images as JPEG, then Save. On iOS 26: open mochify.app/flow in Safari, add the PDF and type what you need; Preview on iOS 26 can only export a smaller image of a page, not a smaller PDF.`
		}
	];

	const related = [
		{
			title: 'How to Convert iPhone Photos (HEIC) to PDF',
			href: '/guides/heic-to-pdf-iphone-photos',
			desc: 'Building a PDF from photos, the other direction of the same job.'
		},
		{
			title: 'Working with PDFs in AI Agent Workflows: Extract, Split, and Convert Pages',
			href: '/guides/extract-images-from-pdf-agent-workflows',
			desc: 'Pulling the images back out of a PDF, and splitting it, from an agent.'
		},
		{
			title: 'How to Reduce Photo File Size on iPhone: The Fast Way and the Built-In Way',
			href: '/guides/reduce-photo-file-size-iphone',
			desc: 'The same Preview export sheet, used for photos instead of PDFs.'
		},
		{
			title: 'Photo File Too Large to Upload? Why Free Tools Reject Camera Files',
			href: '/guides/photo-file-too-large-to-upload',
			desc: 'Upload limits from the image side, with real file sizes.'
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
	<meta property="og:title" content={metadata.seoTitle} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.seoTitle} />
	<meta name="twitter:description" content={metadata.description} />

	<GuideSchema
		name={metadata.title}
		url={pageUrl}
		description={metadata.description}
		datePublished="2026-10-12"
		article={{
			about: ['PDF compression', 'Apple Preview', 'Quartz filters', 'ColorSync Utility', 'macOS 27', 'iOS 27', 'Magic Flow', 'JPEG'],
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
			How to <span class="bg-gradient-to-r from-[#F06292] to-[#EC407A] bg-clip-text text-transparent">Compress a PDF on Mac</span> Without Losing Quality
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			To compress a PDF on a Mac (or shrink it, condense it, reduce its file size: the searches
			differ, the job is the same), open it in Preview, choose <strong>File &gt; Export</strong>,
			pick <strong>Reduce File Size</strong> from the <strong>Quartz Filter</strong> menu and click Save.
			That is the whole answer every search result gives, and it is correct as far as it goes. What none
			of them tell you is what that filter actually does (on a current Mac it is a moderate screen-resolution
			setting: JPEG at quality 0.7, images capped at 2,400 pixels and 144 dpi, read from the filter itself
			on macOS 27 rather than from a forum), why the result sometimes looks soft or even comes out larger,
			how to keep photos sharp when it matters, what to do on an iPhone, and when the honest answer is
			that the PDF should not be compressed at all.
		</p>

		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			This guide covers all of that: the built-in Mac route and its settings, a custom filter that
			keeps images readable, the iPhone route on iOS 26 and iOS 27, why PDFs get big in the first
			place, the real email limits, and a one-prompt alternative that recompresses only the pictures
			and leaves the text, fonts and layout untouched.
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
		<section>
			<GuideTOC items={toc} />
		</section>

		<section id="the-30-second-version" class="scroll-mt-24">
			<SectionHeading>The 30-second version</SectionHeading>
			<p class="mb-4">
				The size of almost every large PDF is its pictures, so compressing a PDF means recompressing
				its pictures, and every method on this page does exactly that and nothing else. On a Mac,
				Preview's Reduce File Size filter does it with one fixed setting (JPEG quality 0.7, 2,400
				pixels, 144 dpi on macOS 27: fine for screen, too low for print or scans); a custom filter
				in ColorSync Utility lets you choose the setting; on an iPhone running iOS 27, Preview's
				export sheet has two toggles for it; and Mochify does it from a plain-English prompt, with
				the text, fonts and layout guaranteed untouched. Pick by how much quality you need to keep
				and how many PDFs you have.
			</p>
			<p class="mb-4">
				If the PDF is text only and still huge, no image method will help, and the <a
					href="#why-your-pdf-is-so-big">Why your PDF is so big</a
				> section explains what to do instead.
			</p>
		</section>

		<section id="compress-a-pdf-in-preview-on-mac" class="scroll-mt-24">
			<SectionHeading>Compress a PDF in Preview on Mac</SectionHeading>
			<p class="mb-4">
				Preview can reduce a PDF's file size on any Mac or MacBook without extra software, and for a
				document you will read on a screen the built-in filter is usually enough. Here are the
				steps, with the menu names exactly as they appear in <a
					href="https://support.apple.com/guide/preview/reduce-the-size-of-a-pdf-prvw1509/mac"
					target="_blank"
					rel="noopener noreferrer">Apple's Preview guide</a
				>:
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li><p class="mb-0">Open the PDF in <strong>Preview</strong>.</p></li>
				<li>
					<p class="mb-0">
						Choose <strong>File &gt; Export</strong>. (Not "Export as PDF", which has no filter
						menu.)
					</p>
				</li>
				<li>
					<p class="mb-0">Make sure <strong>Format</strong> is set to <strong>PDF</strong>.</p>
				</li>
				<li>
					<p class="mb-0">
						In the <strong>Quartz Filter</strong> pop-up menu, choose
						<strong>Reduce File Size</strong>.
					</p>
				</li>
				<li>
					<p class="mb-0">
						Click <strong>Save</strong>. Give it a new name so you keep the original.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				Apple's own note on this is one sentence: "When compressed, the PDF may be of lower quality
				than the original." The same export sheet also offers three checkboxes that nobody on the
				first page of search results mentions: <strong>Optimize images for screen</strong>,
				<strong>Save images as JPEG</strong>
				and <strong>Create Linearized PDF</strong>. The first two are a gentler route than the
				filter: they lower image resolution to what a screen can show and convert images to JPEG,
				without the filter's fixed quality setting. Linearized PDF only affects how fast the file
				starts displaying in a browser; it does not change the size much.
			</p>
			<p class="mb-4">
				<strong>Check before you send.</strong> Open the exported file and zoom to 100% on a photo and
				on the smallest text. The text will be as crisp as before, for a reason the next section explains;
				the photo is what you are judging.
			</p>
		</section>

		<section id="what-reduce-file-size-actually-does-to-your-images" class="scroll-mt-24">
			<SectionHeading>What "Reduce File Size" actually does to your images</SectionHeading>
			<p class="mb-4">
				A Quartz filter only ever touches the images inside a PDF. Text, fonts, vector drawings,
				links and page layout pass through unchanged, which is why a compressed PDF stays searchable
				and the type stays sharp whatever filter you pick, and why a text-only PDF does not get any
				smaller this way. Apple documents the components a filter can have in its <a
					href="https://support.apple.com/guide/colorsync-utility/add-or-modify-quartz-filters-csync006/mac"
					target="_blank"
					rel="noopener noreferrer">ColorSync Utility guide</a
				>: image effects (size, bit depth, interpolation and compression), color management, and PDF
				retouch for monochrome data. There is no component that rewrites text.
			</p>
			<p class="mb-4">
				So "losing quality" means one thing: the pictures are downsampled to a maximum size and
				resolution and re-encoded as JPEG at a fixed quality. We read the filter's settings from the
				file itself on macOS 27.0 (October 9, 2026): <strong
					>JPEG compression at quality 0.7, a maximum image size of 2,400 pixels on the long edge,
					and images resampled to 144 dpi</strong
				>, with interpolation on. In plain terms, that is a screen-resolution setting. A photo on an
				A4 page comes out at roughly twice the pixels a laptop screen can show it at, and quality
				0.7 is the range most photo apps call "high". For a document that will be read on a screen,
				the built-in filter is a reasonable choice, and the Mochify test later on this page lands on
				a similar resolution for the same reason.
			</p>
			<p class="mb-4">
				The filter's reputation comes from an older version of it. In 2012 <a
					href="https://www.macworld.com/article/218979/shrink-preview-files-without-ruining-image-quality.html"
					target="_blank"
					rel="noopener noreferrer">Macworld reported its settings</a
				>
				as JPEG quality 0.0 and a maximum image size of 512 pixels, which turned photographs to mush
				and made small scanned text unreadable, and those are the numbers still being passed around
				in forum threads today. If your Mac is on an older system, check in under a minute: open
				<strong>ColorSync Utility</strong>, click <strong>Filters</strong> in the toolbar, and
				expand <strong>Reduce File Size</strong>. The filter is locked, but its settings are visible
				under Image Effects: compression quality, maximum image size and resolution. (In Terminal,
				<code>plutil -p "/System/Library/Filters/Reduce File Size.qfilter"</code> prints the same values.)
				If they read 0.0 and 512, build the custom filter in the next section before you compress anything
				you care about. If they read 0.7, 2,400 and 144, the blur complaints you have read are about older
				systems, about scans, or about a file that has been through the filter twice.
			</p>
			<p class="mb-4">Two side effects follow from "re-encode every image at a fixed quality":</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Scans suffer most.</strong> A scanned page is one big picture, so downsampling it
						is downsampling the text itself. A 300 dpi scan resampled to the filter's 144 dpi keeps fewer
						than a quarter of its pixels, and small type is the first thing to go. That is the "hardly
						readable" result people describe. Scans want a higher resolution and maximum size than brochures
						do.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It can come out bigger.</strong> If a PDF's images were already small, well-compressed
						JPEGs, re-encoding them at the filter's quality can produce a larger file. Forum reports of
						a 5 MB file growing to 5.5 MB are this effect, not a bug in your copy. The same happens when
						you "print to PDF" a file that was already compressed.
					</p>
				</li>
			</ul>
		</section>

		<section id="keep-the-pictures-sharp-a-custom-quartz-filter" class="scroll-mt-24">
			<SectionHeading>Keep the pictures sharp: a custom Quartz filter</SectionHeading>
			<p class="mb-4">
				The built-in filter is a screen setting. If the PDF will be printed, or it is a scan, or you
				want the photographs kept at more than 144 dpi, the fix is a copy of the filter with your
				own settings, made in ColorSync Utility, which Apple ships with every Mac. Preview then
				lists your filter in the same Quartz Filter menu.
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						Open <strong>ColorSync Utility</strong> (it is in Applications &gt; Utilities, or search for
						it with Spotlight).
					</p>
				</li>
				<li><p class="mb-0">Click <strong>Filters</strong> in the toolbar.</p></li>
				<li>
					<p class="mb-0">
						Select <strong>Reduce File Size</strong>. It is locked, so click the
						<strong>Duplicate</strong> button to the left of the lock and work on the copy. Give the copy
						a name you will recognize in Preview, such as "Reduce File Size (sharp)".
					</p>
				</li>
				<li>
					<p class="mb-0">
						Click the arrow next to the copy, then the arrow next to its <strong
							>Image Effects</strong
						> (image sampling and compression) component, and set:
					</p>
					<ul class="mt-3 list-disc space-y-2 pl-6">
						<li>
							<strong>Compression</strong> to JPEG, quality 0.7 to 0.8. The built-in filter already uses
							0.7; raising it much further adds file size faster than it adds visible quality.
						</li>
						<li>
							<strong>Resolution</strong> is the setting that does the work: the built-in filter's 144
							dpi suits screen and email; use 200 for general use and 300 for print or scans. A long-standing
							rule of thumb from the Macworld piece puts an A4 page at 842, 1,684 and 3,508 pixels tall
							at 72, 144 and 300 dpi.
						</li>
						<li>
							<strong>Maximum image size</strong> to match: the built-in 2,400 pixels covers screen use;
							raise it to about 3,500 for a 300 dpi A4 page, or leave it high and let the resolution setting
							decide.
						</li>
					</ul>
				</li>
				<li>
					<p class="mb-0">
						Go back to Preview, <strong>File &gt; Export</strong>, and choose your new filter from
						the Quartz Filter menu.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				Two notes. If you want a one-click version, Apple's Automator app has an "Apply Quartz
				Filter to PDF Documents" action that can wrap your filter as a Quick Action; the ColorSync
				route above is enough for most people. And if the result still looks soft on a scan, raise
				the maximum image size before you touch the quality: on a scanned page it is the pixel
				count, not the JPEG quality, that decides whether the letters stay legible.
			</p>
			<p class="mb-4">
				<strong>Compressing more than one PDF?</strong> The custom filter is a per-file, per-export
				job. For a folder of brochures or a month of scans, the
				<a href="#mochify-workflow">Mochify workflow</a> below takes the whole batch from one prompt.
			</p>
		</section>

		<section id="why-your-pdf-is-so-big" class="scroll-mt-24">
			<SectionHeading>Why your PDF is so big</SectionHeading>
			<p class="mb-4">
				A PDF is big because of its images, almost always, and the fix depends on which kind of
				image it is. The quick diagnosis:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>It came from InDesign, Pages, Keynote, PowerPoint or Word, and it has photos.</strong
						> The photos were placed at print resolution. A 4,000-pixel photo sitting in a two-inch box
						on the page is carrying roughly ten times the pixels anyone will ever see on screen. This
						is the common case and the one every method on this page fixes well. Our own 8-page InDesign
						brochure went from 4.93 MB to 1.47 MB, 70% smaller, with the photos downsampled, the text
						byte-identical and all nine fonts untouched.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It is a scan.</strong> Every page is one picture, usually at 300 dpi or more, and
						there is no text underneath unless OCR has been run. These shrink well too, but they are the
						files where an aggressive filter destroys legibility, so use the custom filter or a tool that
						lets you set the resolution. Running OCR (iOS 27's Preview can do this on export, see below)
						does not shrink the file but makes it searchable.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It is text only and still huge.</strong> Then the weight is fonts, usually full fonts
						embedded by a program that should have subset them, or an application that stored a background
						image once per page, or a file that has been saved many times with incremental updates stacked
						inside it. No image filter helps. Re-export it from the original application, or in Preview
						export it with the filter anyway: the pass-through often discards the accumulated junk even
						when it finds no images to shrink.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It is a "print to PDF" of a presentation.</strong> A 2 MB deck can print to a 100
						MB PDF because the printing path rasterizes effects and backgrounds. Export from the application
						instead of printing, then compress.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The numbers to aim for: for screen and email reading, images at 96 to 150 dpi relative to
				their printed size are indistinguishable from the original on a laptop or phone; 300 dpi is
				the convention for press printing. Mochify's PDF optimize measures resolution against how
				large each image is actually drawn on the page rather than how many pixels it stores, which
				is the right question: it is why a 150 dpi target is not a quality downgrade for a document
				nobody will print.
			</p>
		</section>

		<section id="compress-a-pdf-on-iphone" class="scroll-mt-24">
			<SectionHeading>Compress a PDF on iPhone</SectionHeading>
			<p class="mb-4">
				On an iPhone running iOS 27, the Preview app can compress a PDF on its own; on iOS 26 it
				cannot do it as a PDF, and the Files app's "Compress" command only makes a zip. The steps
				below follow Apple's <a
					href="https://support.apple.com/guide/iphone/export-or-compress-pdfs-and-images-iph61c20afe1/ios"
					target="_blank"
					rel="noopener noreferrer">iPhone User Guide</a
				> for iOS 27 and were checked on an iPhone running iOS 27.0 on October 9, 2026:
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li><p class="mb-0">Open the PDF in <strong>Preview</strong> on your iPhone.</p></li>
				<li>
					<p class="mb-0">
						Tap the <strong>More</strong> button next to the filename, then tap
						<strong>Export</strong>.
					</p>
				</li>
				<li>
					<p class="mb-0">
						Select <strong>PDF</strong> as the format. The options underneath change to a
						<strong>Resolution</strong> setting and five switches, all off by default: Create PDF/A, Create
						Linearized PDF, Embed Text, Optimize Images for Screen and Save Images as JPEG.
					</p>
				</li>
				<li>
					<p class="mb-0">
						Turn on <strong>Optimize Images for Screen</strong> (Apple's note: "reduce image
						resolution for screen viewing. This creates a smaller file.") and
						<strong>Save Images as JPEG</strong>. Leave <strong>Resolution</strong> alone for a
						screen copy, or raise it if the PDF will be printed; it is the same lever as the Mac
						filter's dpi setting. <strong>Embed Text</strong> runs OCR on scanned pages so the PDF becomes
						searchable; it is worth turning on for scans and does not affect size much. PDF/A is an archival
						format and Linearized only changes how fast the file starts displaying in a browser; neither
						makes the file smaller.
					</p>
				</li>
				<li><p class="mb-0">Tap <strong>Save</strong> and choose a location.</p></li>
			</ol>
			<p class="mb-4">
				On iOS 26 the same export sheet offers only a size slider, and only for image formats, so a
				PDF can be exported as a smaller JPEG or HEIC of each page but not as a smaller PDF. The
				Files app's long-press <strong>Compress</strong> command makes a .zip archive, which for a
				PDF is the same size or slightly larger, because a PDF's images are already compressed. If
				you are on iOS 26 and need a smaller PDF that stays a PDF, open
				<a href="https://mochify.app/flow">mochify.app/flow</a>
				in Safari and use the <a href="#mochify-workflow">workflow below</a>; it works the same on a
				phone as on a Mac. For photos rather than documents, see
				<a href="https://mochify.app/guides/reduce-photo-file-size-iphone"
					>how to reduce photo file size on iPhone</a
				>.
			</p>
		</section>

		<section id="pdf-too-big-to-email-the-limits-and-the-way-around-them" class="scroll-mt-24">
			<SectionHeading>PDF too big to email: the limits and the way around them</SectionHeading>
			<p class="mb-4">
				The limits are lower than people think, and they include the message itself. <a
					href="https://support.google.com/mail/answer/6584"
					target="_blank"
					rel="noopener noreferrer">Gmail's own help page</a
				>
				puts the limit for personal accounts at 25 MB, after which it replaces the attachment with a
				Google Drive link.
				<a
					href="https://support.microsoft.com/en-us/outlook/reduce-attachment-size-to-send-large-files-with-outlook"
					target="_blank"
					rel="noopener noreferrer">Microsoft's Outlook page</a
				>
				states 20 MB for Outlook.com and other internet accounts, and a default of 10 MB for
				Exchange business accounts, "both the size of the attachment and the size of the email."
				Apple Mail offers
				<a href="https://support.apple.com/en-us/HT203093" target="_blank" rel="noopener noreferrer"
					>Mail Drop</a
				> when an attachment is over your provider's limit: up to 5 GB per attachment, available for 30
				days.
			</p>
			<p class="mb-4">
				So a PDF that is "too big to email" needs to get under 20 MB to be safe everywhere, and
				under 10 MB if it is going to a company address. That is well within reach of any method on
				this page for a document whose weight is photos. Three cases where compressing is the wrong
				move:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The recipient needs it at full quality</strong> (a print file, a signed contract scan
						that must stay legible, a portfolio). Send a link instead: Mail Drop, Google Drive, OneDrive
						or Dropbox. The file arrives intact and the email stays small.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It is already as small as its pictures allow.</strong> Zipping will not help; a PDF's
						images are compressed data and a zip of compressed data saves next to nothing. Split it into
						parts or send a link.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It is dozens of pages of scans.</strong> Split by chapter, or compress with a filter
						that keeps the resolution high enough to read, then check a page at 100% before sending.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				For the image-upload version of this problem, where a photo rather than a document is over a
				form's limit, see <a href="https://mochify.app/guides/photo-file-too-large-to-upload"
					>photo file too large to upload</a
				>.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: compress a PDF in one prompt</SectionHeading>
			<p class="mb-4">
				Mochify's PDF optimize recompresses only the images inside a PDF and returns a smaller PDF
				with the text, fonts, vector art, links and layout untouched, so the document stays
				searchable and the type stays exactly as sharp as it was. It works from a plain-English
				prompt, handles a batch as easily as one file, and needs no filter to build. In our own test
				(2026-10-09), a 7.2 MB JPEG exported to PDF from Preview (7.4 MB) came out at 498 KB on
				Mochify's defaults, 93% smaller, with the photo stored at 1,653 px wide: 150 dpi at the size
				it occupies on the A4 page. Pages' Best export placed the same photo at 598 ppi, so the
				default brought it to 1,004 px; ask for 300 dpi when the PDF is going to print. PDF
				compression is available on the paid plans (Seller, Pro and Growth) and on the Day Pass; it
				is not on the Free plan.
			</p>
			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>
			<p class="mt-6 mb-4">
				<strong>Same thing from the API.</strong> <code>POST /v1/pdf?op=optimize</code> on
				<code>api.mochify.app</code>
				with the PDF as the request body and <code>Authorization: Bearer &lt;key&gt;</code>;
				<code>quality</code>
				(default 75) sets the jpegli re-encode quality and <code>maxDpi</code> (default 150) the
				resolution target measured against the placed size, with 96 for screen and email and 300 to
				keep print quality; <code>maxDimension</code> (default 2000) caps the long edge of any image
				whatever its placed size. From the command line,
				<code>mochify report.pdf --op optimize --dpi 150</code>
				does the same (or <code>mochify report.pdf -p "compress this pdf"</code>, which goes through
				the same prompt parser as the web app), and the hosted MCP server at
				<code>mcp.mochify.app</code>
				exposes the operation to an AI agent. Full parameters are in the
				<a href="https://mochify.app/docs">API docs</a>.
			</p>
			<p class="mb-4">
				<strong>Building the PDF rather than shrinking one?</strong> The converters for
				<a href="https://mochify.app/solutions/heif-to-pdf">HEIC and HEIF to PDF</a>,
				<a href="https://mochify.app/solutions/webp-to-pdf">WebP to PDF</a>
				and <a href="https://mochify.app/solutions/jxl-to-pdf">JPEG XL to PDF</a> assemble images
				into a PDF in one step, free up to 3 images per file and 20 on the paid plans and the Day
				Pass. And if you need the pictures out of a PDF rather than smaller inside it, see
				<a href="https://mochify.app/guides/extract-images-from-pdf-agent-workflows"
					>extracting images from PDFs</a
				>.
			</p>
			<p class="mb-0 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, stated precisely.</strong> Your PDF travels to <code>api.mochify.app</code> over
				HTTPS, is processed in memory and wiped immediately after the result is returned: no disk writes,
				no logs containing file data. It is not processed on your Mac, and it is not kept. The same holds
				whether you use the web app or the API.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Situation</th><th>Best route</th><th>Setting to use</th></tr></thead>
					<tbody>
						<tr
							><td>One PDF, read on screen, Mac</td><td
								>Preview &gt; File &gt; Export &gt; Quartz Filter &gt; Reduce File Size</td
							><td
								>The default (JPEG 0.7, 2,400 px, 144 dpi on macOS 27); check a photo at 100%
								afterwards</td
							></tr
						>
						<tr
							><td>For print, or photos kept sharp, Mac</td><td
								>ColorSync Utility custom filter (duplicate of Reduce File Size)</td
							><td>JPEG quality 0.7 to 0.8; 200 to 300 dpi; max image about 3,500 px</td></tr
						>
						<tr
							><td>Scanned pages</td><td
								>Custom filter at 300 dpi, or Mochify with a print target</td
							><td>Raise resolution and max image size before lowering quality</td></tr
						>
						<tr
							><td>iPhone, iOS 27</td><td>Preview &gt; Export &gt; PDF</td><td
								>Optimize Images for Screen + Save Images as JPEG (both off by default)</td
							></tr
						>
						<tr
							><td>iPhone, iOS 26</td><td>mochify.app/flow in Safari</td><td
								>One prompt; Preview cannot export a smaller PDF on iOS 26</td
							></tr
						>
						<tr
							><td>A batch of PDFs, any device</td><td>Mochify Magic Flow</td><td
								>Paid plan or Day Pass; images recompressed, text untouched</td
							></tr
						>
						<tr
							><td>Text-only PDF that is still huge</td><td>Re-export from the source app</td><td
								>Fonts, not images, are the weight; no image filter helps</td
							></tr
						>
						<tr
							><td>Reduce File Size made it bigger</td><td>Keep the original</td><td
								>Its images were already small; a fixed-quality re-encode adds data</td
							></tr
						>
						<tr
							><td>Must stay at full quality</td><td>Do not compress</td><td
								>Mail Drop (5 GB), Drive, OneDrive, Dropbox link</td
							></tr
						>
						<tr
							><td>Email limits</td><td>Gmail 25 MB · Outlook.com 20 MB · Exchange 10 MB default</td
							><td>Aim under 20 MB, under 10 MB for business addresses</td></tr
						>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/" label="Try it free">
			Try it on your largest PDF at <a href="https://mochify.app/flow">mochify.app/flow</a>.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>
