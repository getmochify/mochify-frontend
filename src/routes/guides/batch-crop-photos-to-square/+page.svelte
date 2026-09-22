<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import StepList from '$lib/components/guide-demo/StepList.svelte';
	import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	const metadata = {
		title: 'How to Batch Crop Photos to Square',
		description:
			'Every batch crop tool applies one rectangle to every photo. How batch cropping to square actually works on Windows, Mac, iPhone and the command line.',
		category: 'Workflows',
		readTime: '24 min read',
		date: 'September 22, 2026'
	};

	const toc = [
		{
			id: 'why-batch-crop-usually-means-one-rectangle-for-everything',
			label: 'Why "batch crop" usually means one rectangle for everything'
		},
		{ id: 'batch-cropping-on-windows', label: 'Batch cropping on Windows' },
		{ id: 'batch-cropping-on-a-mac', label: 'Batch cropping on a Mac' },
		{ id: 'batch-cropping-on-an-iphone', label: 'Batch cropping on an iPhone' },
		{ id: 'batch-cropping-from-the-command-line', label: 'Batch cropping from the command line' },
		{
			id: 'what-photoshop-and-lightroom-actually-do',
			label: 'What Photoshop and Lightroom actually do'
		},
		{
			id: 'which-square-size-each-marketplace-wants',
			label: 'Which square size each marketplace wants'
		},
		{ id: 'mochify-workflow', label: 'Mochify workflow: cropping a folder to square' },
		{ id: 'cheat-sheet', label: 'Cheat sheet: which route does what' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Describe it in plain English.',
			html: '<p>Mochify\'s primary interface is natural language. Drop your files on <a href="https://mochify.app/flow">the Magic Flow page</a> and type what you want:</p><p>Square crop these to 1000px</p><p>Square crop and optimize for eBay</p><p>Crop to 1200px square and convert to WebP</p><p>A language model parses the instruction, then the C++ engine executes it. There are no format pickers and no quality sliders to configure, which is the point. Magic Flow is available in the web app, in the CLI with the <code>-p</code> flag, and through both MCP server surfaces.</p>'
		},
		{
			title: 'Use the dedicated tool page for a straight square crop.',
			html: '<p><a href="https://mochify.app/solutions/bulk-ai-square-cropper">The bulk square cropper</a> is a fixed-purpose converter: pick a size from 500 to 2000 px above the uploader, drop your images, and download the squares. After upload a format row appears so you can take the batch out as JPEG (the default), PNG, WebP, AVIF or JPEG XL. It accepts JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF and JPEG XL in the same batch. There is no prompt on that page and nothing to configure beyond the size and the output format, by design.</p>'
		},
		{
			title: 'Run it over a folder from the terminal.',
			html: '<p>Install the <code>mochify</code> CLI, sign in once with <code>mochify auth login</code>, and you can push a whole directory through the same crop with a plain-English prompt. Credentials are stored locally and both the CLI and the local MCP server pick them up automatically.</p>'
		},
		{
			title: 'Call the API for anything automated.',
			html: '<p>The square crop is <code>smartCrop</code> with matching width and height. Full parameter reference is in <a href="https://mochify.app/docs">the API documentation</a>.</p>'
		}
	];

	const faqItems = [
		{
			q: 'Is there a way to batch crop images without buying software?',
			a: 'Yes, on every platform. Windows has PowerToys Image Resizer in Fill mode, which crops a whole selection to a square from the right-click menu. macOS has an Automator Crop Images action you can save as a Finder Quick Action. On any platform, ImageMagick will crop a folder in a single command. All of them apply the same crop geometry to every file, so they suit batches that were shot alike.'
		},
		{
			q: 'How do I crop multiple images at once in Windows 10 or 11?',
			a: "Install Microsoft PowerToys, open Image Resizer settings and add a custom size with equal width and height, set the fit mode to Fill, then select your images in File Explorer, right-click and choose Resize with Image Resizer. Fill is the mode that crops; Fit and Stretch will letterbox or distort instead. IrfanView's batch conversion is the alternative when you need a specific region rather than a centered one."
		},
		{
			q: 'Can I batch crop photos on an iPhone?',
			a: 'Yes, despite what most articles say. Crop your first photo to Square and, while still in the editor, use the three-dot menu to tap Copy Edits. Then select any number of photos in your library and use Paste Edits on the whole selection. The catch is that the pasted crop is always centered, so it ignores where you positioned the original, and Apple does not document the behavior, so verify it after an iOS update.'
		},
		{
			q: 'Can I batch crop a PDF?',
			a: "Not as a PDF, but you can turn the pages into images and crop those. Mochify's PDF utility extracts pages as PNG, JPEG or WebP files, which then go through an image crop like any other picture. Full PDF tooling is on the Seller and Pro tiers; the Free tier covers images into a PDF up to 3 pages."
		},
		{
			q: 'Does cropping a batch reduce image quality?',
			a: 'Cropping itself only discards pixels outside the frame, so the pixels that remain are untouched. Quality loss comes from the re-encode afterwards, which is why the encoder matters: JPEG output through jpegli gets you a standard JPG that opens everywhere with fewer wasted bytes. The other thing to watch is upscaling, which genuinely does degrade an image, so never ask for a square larger than your source.'
		},
		{
			q: 'How do I resize 100 images at once as well as crop them?',
			a: "Do both in one pass rather than two, because each re-encode costs a little quality. ImageMagick's -resize 1000x1000^ -gravity center -extent 1000x1000 crops and resizes in one command. PowerToys Fill mode does both at once by design. Mochify's crop takes a target size directly, so the square you pick is the output size."
		},
		{
			q: 'Why do my photos still look wrong after a batch crop?',
			a: 'Almost always because the tool applied one rectangle to images that were framed differently, so the crop that centered the first subject missed the rest. Check whether your tool captured its crop from a reference image, which most do. The fix is either reshooting to a consistent frame or using a crop that evaluates each image separately.'
		}
	];

	const related = [
		{
			title: 'Do Marketplace Product Images Need to Be Square?',
			href: '/guides/do-marketplace-product-images-need-to-be-square',
			desc: 'When 1:1 is a requirement and when it is just how the thumbnail renders.'
		},
		{
			title: 'Product Image Requirements for Every Marketplace',
			href: '/guides/product-image-requirements-marketplace-guide',
			desc: 'Sizes, ratios and formats per platform in one table.'
		},
		{
			title: 'Resize and Convert Product Photos in One Pass',
			href: '/guides/ecommerce-product-photo-workflow-resize-convert',
			desc: 'The workflow from phone camera roll to finished listing.'
		},
		{
			title: 'Cross-Listing Photo Requirements',
			href: '/guides/cross-listing-marketplace-photo-requirements',
			desc: 'One photo set across platforms that disagree about shape.'
		},
		{
			title: 'Etsy Listing Photo Size',
			href: '/guides/etsy-listing-photo-size-guide',
			desc: 'What Etsy does to your first photo, in detail.'
		}
	];

	const imagemagickCode = `magick mogrify -resize 1000x1000^ -gravity center -extent 1000x1000 *.jpg`;

	const apiCode = `curl -X POST "https://api.mochify.app/v1/squish?smartCrop=true&width=1000&height=1000&type=jpg" \\
  -H "Authorization: Bearer $MOCHIFY_KEY" \\
  --data-binary @product-01.heic \\
  -o product-01.jpg`;
</script>

<ReadProgress />

<svelte:head>
	<title>How to Batch Crop Images - Windows, Mac, iPhone, CLI | Mochify</title>
	<meta name="description" content={metadata.description} />
	<meta
		name="keywords"
		content="batch crop images, crop multiple images at once, batch crop photos, crop photos to square, bulk crop images, batch crop iphone, batch crop windows, imagemagick crop square"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta
		property="og:url"
		content="https://mochify.app/guides/batch-crop-photos-to-square"
	/>
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "How to Batch Crop Photos to Square on Windows, Mac, iPhone and the Command Line",
			"description": "Every batch crop tool applies one rectangle to every photo. How batch cropping to square actually works on Windows, Mac, iPhone and the command line.",
			"url": "https://mochify.app/guides/batch-crop-photos-to-square",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://mochify.app/guides/batch-crop-photos-to-square"
			},
			"datePublished": "2026-09-22",
			"dateModified": "2026-09-22",
			"inLanguage": "en",
			"author": {
				"@type": "Organization",
				"name": "Mochify Engineering Team",
				"url": "https://mochify.app"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Mochify",
				"url": "https://mochify.app",
				"logo": {
					"@type": "ImageObject",
					"url": "https://mochify.app/logo.png"
				}
			},
			"isPartOf": {
				"@type": "CollectionPage",
				"name": "Image Optimization Guides",
				"url": "https://mochify.app/guides"
			},
			"about": [
				{ "@type": "Thing", "name": "Image cropping" },
				{ "@type": "Thing", "name": "Batch processing" },
				{ "@type": "Thing", "name": "Aspect ratio" },
				{ "@type": "Thing", "name": "Product photography" },
				{ "@type": "Thing", "name": "ImageMagick" },
				{ "@type": "Thing", "name": "PowerToys" }
			]
		}
	</script>
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
			How to Batch Crop Photos to Square on Windows, Mac, iPhone and the Command Line
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			If you want to batch crop images to square, every route built into Windows, macOS, iOS and the
			usual command-line tools will do it, and almost all of them will do it the same way: by taking
			one rectangle and stamping it onto every file in the folder. That works when your photos are
			already framed alike. It quietly ruins the batch when they are not, because a crop that
			centers the subject in photo one lands on a shoulder in photo two and an empty corner in photo
			three.
		</p>
		<p class="mt-5 mb-0">
			This guide covers every practical way to crop multiple images at once on each platform, says
			plainly which ones apply a fixed rectangle and which adapt, and shows what to do when your
			photos were not shot to a template. We have checked each route against the vendor's own
			documentation, and where the documentation does not exist, we say so rather than guessing on
			your behalf.
		</p>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<!-- 01 -->
		<section id="why-batch-crop-usually-means-one-rectangle-for-everything" class="scroll-mt-24">
			<SectionHeading>Why "batch crop" usually means one rectangle for everything</SectionHeading>
			<p class="mb-4">
				Almost every batch cropping tool asks you to define a crop area once and then applies those
				same coordinates to every image in the set. The tools are generally honest about it if you
				read closely: the well-known browser-based bulk croppers describe setting "the same crop
				dimensions, aspect ratio, or shape for all your images," and one of the most popular labels
				its crop area as being "based on first image."
			</p>
			<p class="mb-4">
				That design is not laziness. Deciding where to cut a photo is the hard part, and a fixed
				rectangle is the only thing a simple tool can offer without making a judgment about content.
				If you shot 200 products on a tripod against the same backdrop, a fixed rectangle is exactly
				right and anything cleverer is wasted effort.
			</p>
			<p class="mb-4">
				The trouble starts with mixed batches. A catalog assembled over six months, a client shoot
				with portrait and landscape frames mixed together, a phone camera roll of inventory shot at
				arm's length: these have the subject in a different place in every file. Crop them all to
				the same 1:1 box and you are not cropping, you are rolling dice 200 times.
			</p>
			<p class="mb-4">
				There are only three honest answers to that. Shoot to a template so the fixed rectangle
				works. Crop them one at a time. Or use something that decides per image where the subject
				is. This guide covers all three, and the platform sections below tell you which category
				each tool falls into.
			</p>
		</section>

		<!-- 02 -->
		<section id="batch-cropping-on-windows" class="scroll-mt-24">
			<SectionHeading>Batch cropping on Windows</SectionHeading>
			<p class="mb-4">
				Windows has no built-in multi-image cropper, but it does have a built-in multi-image
				<strong>aspect-fill</strong> tool, which is the part most articles get wrong. The Photos app
				crops one image at a time; PowerToys crops a whole folder in Fill mode; IrfanView crops a folder
				to fixed pixel coordinates.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">The Photos app: one at a time</h3>
			<p class="mb-4">
				Microsoft documents the Windows Photos editor as a single-image tool, offering to "crop,
				flip, or rotate photos to trim out the unwanted parts manually or use preset aspect ratios."
				There is no multi-select crop. Select twenty photos and you still get twenty editing
				sessions.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				PowerToys Image Resizer: yes, it crops
			</h3>
			<p class="mb-4">
				This is the correction worth carrying away from this section. PowerToys Image Resizer is
				widely described as resize-only, and
				<a
					href="https://learn.microsoft.com/en-us/windows/powertoys/image-resizer"
					target="_blank"
					rel="noopener noreferrer">Microsoft's own documentation</a
				> says otherwise. It has three fit modes, and one of them crops:
			</p>
			<ul class="mb-4 ml-6 list-disc space-y-2">
				<li>
					<strong>Fill</strong> "fills the entire specified size with the image," scales
					proportionally, and "crops the image as needed."
				</li>
				<li>
					<strong>Fit</strong> fits the whole image inside the target size and "doesn't crop the image,"
					which leaves you with a non-square result or letterboxing.
				</li>
				<li>
					<strong>Stretch</strong> fills the target size and "stretches the image disproportionally as
					needed," which distorts your product.
				</li>
			</ul>
			<p class="mb-4">
				So the Windows answer to "crop multiple images at once" is: install PowerToys, add a custom
				size of 1000 x 1000 (or whatever square you need), set the mode to <strong>Fill</strong>,
				then right-click your selection in File Explorer and choose Resize with Image Resizer. Every
				file comes back a true square.
			</p>
			<p class="mb-4">
				The catch is the one this guide keeps returning to. Fill performs a centered aspect-fill: it
				scales until the short edge matches, then trims the overflow from both ends of the long
				edge. Your subject had better be near the middle.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				IrfanView: fixed coordinates, applied to all
			</h3>
			<p class="mb-4">
				IrfanView's batch conversion can crop, and the setting is buried. You open a representative
				image, drag a selection box over the area you want, then go to File > Batch
				Conversion/Rename, enable <strong>Use advanced options</strong>, open
				<strong>Advanced</strong>, and click <strong>Get current sel.</strong> to capture that
				selection's pixel coordinates into the crop fields.
			</p>
			<p class="mb-4">
				That last step is the tell: IrfanView captures literal pixel coordinates from one reference
				image and applies those same coordinates to every file in the batch. If your images are not
				all the same dimensions, the crop lands somewhere different on each one. (IrfanView's own
				documentation does not cover this path; the workflow above is the one the IrfanView
				community has documented, and it matches how the batch dialog behaves.)
			</p>
		</section>

		<!-- 03 -->
		<section id="batch-cropping-on-a-mac" class="scroll-mt-24">
			<SectionHeading>Batch cropping on a Mac</SectionHeading>
			<p class="mb-4">
				macOS will batch <strong>resize</strong> out of the box and will not batch
				<strong>crop</strong> out of the box, which is a distinction Apple's own documentation makes
				clearly if you look for it. Automator will crop a batch, with one uniform rectangle.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				Preview: batch resize yes, batch crop no
			</h3>
			<p class="mb-4">
				<a
					href="https://support.apple.com/guide/preview/crop-resize-or-rotate-an-image-prvw2015/mac"
					target="_blank"
					rel="noopener noreferrer">Apple's Preview guide</a
				> carries an explicit multi-image tip for resizing: display the images in the same window, select
				them in that window's sidebar, then choose Tools > Adjust Size. Every image is resized at once.
			</p>
			<p class="mb-4">
				The crop instructions on the same page are written for a single image, and there is no
				equivalent multi-select note. Preview crops one photo at a time. If you have been selecting
				a folder in Preview and hunting for a crop equivalent of Adjust Size, it is not hidden, it
				is absent.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				Automator: a real batch crop, one rectangle
			</h3>
			<p class="mb-4">
				Automator ships with a <strong>Crop Images</strong> action that works on a selection of files
				and can be saved as a Quick Action so it appears in Finder's right-click menu. Build a workflow
				with "Get Selected Finder Items" followed by "Crop Images," set your dimensions, and you have
				a folder-level square crop.
			</p>
			<p class="mb-4">
				It applies one crop specification to every file. Mac users who have gone looking for a way
				to make that action choose a different region per image have consistently been told there is
				no automation for it, and we found no documented way either. Treat Automator as the Mac
				equivalent of PowerToys Fill: fast, free, built in, and blind to what is in the picture.
			</p>
			<p class="mb-4">
				A word on the <strong>Crop Images</strong> action's exact fields: Apple does not publish a reference
				page for it, so check what your version exposes rather than trusting a walkthrough written against
				an older macOS.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">Shortcuts</h3>
			<p class="mb-4">
				The Shortcuts app has a Crop Image action, and Apple documents only its category, describing
				transform actions as ones that "edit content (such as cropping an image)." The specific
				parameters are not documented publicly, and at least one developer report describes a
				crop-to-square shortcut stretching screenshots rather than cropping them. If you build a
				Shortcuts crop pipeline, test it on two or three throwaway files before pointing it at work
				you care about.
			</p>
		</section>

		<!-- 04 -->
		<section id="batch-cropping-on-an-iphone" class="scroll-mt-24">
			<SectionHeading>Batch cropping on an iPhone</SectionHeading>
			<p class="mb-4">
				Your iPhone can batch crop to square, with no app and no computer. The route is
				undocumented, it hangs on a menu that disappears if you tap the wrong thing first, and it
				center-crops every photo rather than reproducing your framing. We tested it on iOS 26.62 in
				September 2026 rather than repeating what gets published about it, because what gets
				published about it is mostly wrong.
			</p>
			<p class="mb-4">
				This is the worst-served question in the whole subject. Search it and Google returns an
				Apple discussion thread from 2012 at the top, some YouTube tutorials, and several articles
				that carefully explain how to crop one photo. One of the highest-ranking results states
				flatly that the Photos app does not support cropping multiple photos at once. It does.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">The route that works</h3>
			<ol class="mb-4 ml-6 list-decimal space-y-2">
				<li>
					Open your first photo, tap <strong>Edit</strong>, tap <strong>Crop</strong>, choose the
					<strong>Square</strong> aspect ratio, and position the crop.
				</li>
				<li>
					<strong>Before you tap Done</strong>, open the three-dot menu at the top right and tap
					<strong>Copy Edits</strong>.
				</li>
				<li>
					Go back to your library and select the photos you want cropped. This works on a
					multi-photo selection.
				</li>
				<li>Three-dot menu, <strong>Paste Edits</strong>.</li>
			</ol>
			<p class="mb-4">
				Every selected photo comes back square. We ran it across a four-photo selection and all four
				were cropped in one action.
			</p>
			<p class="mb-4">
				<strong>Step 2 is the whole trick.</strong> Copy Edits only appears in that menu while you are
				still inside the editor. Tap Done and the option vanishes, which is why so many write-ups describe
				reopening the photo afterwards and hunting for a menu item that is not there.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">What it does not do</h3>
			<p class="mb-4">
				It does not carry your framing. We positioned the first crop deliberately off-center, and
				every pasted photo came back cropped dead center anyway. What travels is the 1:1 ratio, not
				the region you chose.
			</p>
			<p class="mb-4">
				So iOS does give you a real batch square crop, with precisely the limitation this guide
				keeps running into: one rectangle, taken from the middle, applied to everything. If your
				subjects are already centered, this is the fastest free option on any platform in this guide
				and you should stop reading here. If they are not, a center crop across a camera roll will
				cut the tops off items and slice people out of frame, and you are back to the same choice as
				everywhere else.
			</p>
			<p class="mb-4">
				Two footnotes. Apple's own
				<a
					href="https://support.apple.com/guide/iphone/edit-photos-and-videos-iphb08064d57/ios"
					target="_blank"
					rel="noopener noreferrer">iPhone guide</a
				> lists "copy and paste edits" among the editing tools but documents editing per-photo and does
				not describe the multi-select paste or state what a copied edit includes, so treat the behavior
				above as tested on iOS 26.62 rather than promised, and re-check it after a major iOS update.
				The Shortcuts app also has a Crop Image action, which is scriptable but undocumented in its parameters,
				with at least one developer report of it stretching screenshots instead of cropping them.
			</p>
			<p class="mb-4">
				<strong>If your photos are .HEIC and you also need them converted,</strong> that is a
				separate job from cropping. iPhone photos are HEIC files, and the
				<a href="https://mochify.app/heic-to-jpeg">HEIC to JPG converter</a> handles that conversion
				on its own. (Pro camera bodies from Canon, Sony and Fujifilm write <code>.HIF</code> files, which
				look similar and belong to a different workflow entirely.)
			</p>
		</section>

		<!-- 05 -->
		<section id="batch-cropping-from-the-command-line" class="scroll-mt-24">
			<SectionHeading>Batch cropping from the command line</SectionHeading>
			<p class="mb-4">
				The command line is where batch cropping stops being fiddly and starts being trivial, and it
				is also where the fixed-rectangle limit is clearest, because you are the one typing the
				coordinates. ImageMagick will crop a folder in one line. Neither ImageMagick nor any of the
				standard image libraries does subject detection, though two of them get closer than you
				might expect.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				ImageMagick: use <code>-extent</code>, not <code>-crop</code>
			</h3>
			<p class="mb-4">
				The idiomatic way to crop to a centered square and resize in one pass is a fill-resize
				followed by an extent, which is
				<a href="https://usage.imagemagick.org/resize/" target="_blank" rel="noopener noreferrer"
					>ImageMagick's own documented approach</a
				>:
			</p>

			<CodeCard filename="crop-square.sh" code={imagemagickCode} />

			<p class="mt-6 mb-4">
				The <code>^</code> makes the resize fill the 1000 x 1000 box rather than fit inside it,
				letting the long edge overflow; <code>-gravity center -extent</code> then trims that
				overflow equally from both ends. <code>mogrify</code> applies it across the whole glob, in place,
				so work on a copy of the folder.
			</p>
			<p class="mb-4">
				If you reach for <code>-crop</code> instead, add <code>+repage</code>. ImageMagick's
				documentation is blunt about it: "Always use +repage after any 'crop' like operation. Unless
				you actually need to preserve that info." Without it, the crop leaves virtual-canvas offset
				metadata behind and downstream tools render your image in odd positions.
			</p>
			<p class="mb-4">
				On ImageMagick 7,
				<a href="https://imagemagick.org/porting/" target="_blank" rel="noopener noreferrer"
					>the porting guide</a
				>
				is clear that the utilities are now subcommands: use <code>magick mogrify</code>, and do not
				use <code>magick convert</code>. Version 6 syntax (<code>mogrify ...</code> on its own) still
				works on most installs.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				libvips and sharp: the closest thing to a smart crop in open source
			</h3>
			<p class="mb-4">
				Two widely used libraries do try to decide where to cut. libvips exposes
				<code>vips_smartcrop()</code>, documented as cropping an image "down to a specified width and
				height by removing boring parts," with an <code>interesting</code> parameter that defaults to
				an attention-based mode.
			</p>
			<p class="mb-4">
				<a href="https://sharp.pixelplumbing.com/api-resize/" target="_blank" rel="noopener noreferrer"
					>sharp</a
				>, which is built on libvips and is what a great many Node image pipelines use, documents two
				strategies. Its entropy strategy focuses on the region with the highest Shannon entropy. Its
				attention strategy focuses on the region with the highest luminance frequency, color
				saturation and presence of skin tones. The mechanism is described as resizing so one
				dimension hits the target, then repeatedly ranking edge regions and discarding the
				lowest-scoring edge. Both apply only when the fit is set to <code>cover</code>.
			</p>
			<p class="mb-4">
				That is genuinely useful and worth knowing about, and it is worth being precise about what
				it is not. Ranking edges by brightness variance, saturation and skin tone is a heuristic, not
				object recognition. It will often find a face because faces are saturated and skin-toned; it
				will also happily find a bright reflection on a countertop. The distinction between a
				heuristic that trims boring edges and a model that identifies the subject is the whole
				subject of the next section.
			</p>
		</section>

		<!-- 06 -->
		<section id="what-photoshop-and-lightroom-actually-do" class="scroll-mt-24">
			<SectionHeading>What Photoshop and Lightroom actually do</SectionHeading>
			<p class="mb-4">
				Photoshop and Lightroom both batch crop, and they do it in two meaningfully different ways:
				Photoshop records your crop as a repeatable step, while Lightroom syncs a crop
				proportionally across a selection.
			</p>
			<p class="mb-4">
				<strong>Photoshop: Actions plus Batch.</strong> Record an action that crops and resizes one image,
				then run File > Automate > Batch over a folder with that action selected. It is the standard
				route and it is well worn, which is why it turns up as the accepted answer in the Adobe community
				threads that rank for these searches. Because the action replays recorded steps, expect it to
				reproduce your crop the same way on every file rather than adapt to each one.
			</p>
			<p class="mb-4">
				<strong>Lightroom Classic: crop is a syncable setting, and it syncs proportionally.</strong>
				Crop one photo to a 1:1 aspect, select the rest, and use Sync Settings with Crop ticked. What
				is interesting is how Lightroom stores that crop. Lightroom community experts, including plugin
				developers who work with the catalog format directly, describe crop data as being held in relative
				coordinates on a 0 to 1 scale rather than absolute pixels, precisely so that a crop synced from
				a 20-megapixel file still makes sense on a 48-megapixel one. On that model, syncing a crop gives
				every photo the same proportional region rather than the same literal pixel box, which is a genuinely
				better behavior than most batch tools offer.
			</p>
			<p class="mb-4">
				We should flag that this mechanism is described by Lightroom's user community rather than in
				Adobe's published help pages, which we could not retrieve on this point. The practical advice
				holds either way: sync the crop, then spot-check a handful of frames, because the same
				proportional region is still the same framing decision applied to photos that may not deserve
				it.
			</p>
		</section>

		<!-- 07 -->
		<section id="which-square-size-each-marketplace-wants" class="scroll-mt-24">
			<SectionHeading>Which square size each marketplace wants</SectionHeading>
			<p class="mb-4">
				Pick the size from whichever platform has the strictest requirement in your set, then use
				that one square everywhere, because a single master square uploads cleanly to all of them.
				The figures below come from each platform's own documentation.
			</p>
			<p class="mb-4">
				<strong>Amazon</strong> publishes the clearest numbers.
				<a
					href="https://m.media-amazon.com/images/G/35/sp-marketing-toolkit/Sellerfacingguides/Amazon_Listings_Product_Detail_Page_Guide.pdf"
					target="_blank"
					rel="noopener noreferrer">Its seller guide</a
				> states that "the optimal zoom experience for detail pages requires files to be 1600px or larger
				on the longest side," and that "the smallest your file can be for zoom is 1000px, and the smallest
				your file can be for the site is 500px," with a 10,000px ceiling. Amazon documents those pixel
				thresholds; it does not, in the materials we could reach, state that the main image must be square,
				so treat 1:1 there as a convention rather than a rule.
			</p>
			<p class="mb-4">
				<strong>Etsy</strong> recommends listing images of at least 2000px on width and height, and
				sets a practical floor by warning that a first photo under 635px risks "showing up lower in
				searches." Etsy is also the one platform that
				<a
					href="https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop"
					target="_blank"
					rel="noopener noreferrer">documents its own cropping behavior</a
				>: it displays your first photo in several placements with different thumbnail crops, and
				advises a horizontal or square first photo so that "the center focal point of the image
				appears in the cropped thumbnail views." If you want one citation for why pre-cropping
				matters, that is it.
			</p>
			<p class="mb-4">
				<strong>Shopify</strong> states that "for square product images, a size of 2048 x 2048 px usually
				displays best," with a 5000 x 5000 or 25-megapixel ceiling, and recommends a consistent aspect
				ratio across your main images so collection grids display evenly.
			</p>
			<p class="mb-4">
				<strong>eBay</strong> asks for a minimum of 500 x 500, recommends "images that are about 1600
				x 1600," and says outright that "photos in a 1:1 or 16:9 aspect ratio look best in listings, search
				results, and other placements."
			</p>
			<p class="mb-4">
				<strong>Instagram</strong> processes uploads "at the best quality resolution possible (up to
				1080x1080 pixels)," and Meta's publishing documentation notes that carousel images are cropped
				to match the first image in the carousel, defaulting to 1:1.
			</p>
			<p class="mb-4">
				<strong>Vinted and Depop publish no image dimensions at all.</strong> This is worth stating plainly
				because so much content asserts otherwise. Vinted's help documentation covers how many photos
				you can add and what makes a good one, with no size, no dimensions and no aspect ratio anywhere
				across its help center, its catalog rules or its locale sites. Depop's help documents photo counts
				only, and its Selling API specifies a minimum of one image and a maximum of eight without stating
				a single required dimension.
			</p>
			<p class="mb-4">
				The one number either company publishes anywhere is buried in
				<a href="https://pro-docs.svc.vinted.com/" target="_blank" rel="noopener noreferrer"
					>Vinted's Pro integrations API</a
				>, which caps a photo at 5MB. That is a file-size limit, not a shape. Every specific ratio
				you have read for those two platforms is observed app behavior, not a published requirement,
				and it can change without anyone announcing it. We treat it the same way:
				<a href="https://mochify.app/guides/vinted-photos-that-sell">our Vinted photo guide</a>
				recommends a portrait crop of about 3:4 because that is what Vinted's image pipeline visibly
				rewards, and it says plainly that Vinted sets no official spec. Both platforms display
				portrait rather than square, so a square master is the wrong shape for them regardless;
				<a href="https://mochify.app/guides/cross-listing-marketplace-photo-requirements"
					>the cross-listing photo requirements guide</a
				> covers running one photo set across platforms that disagree about shape.
			</p>
			<p class="mb-4">
				One more caution on the received wisdom. The claim that platforms center-crop your image and
				therefore pre-cropping protects your subject is a reasonable inference from how web image
				display generally works, and only Etsy, Meta and Shopify document anything about their own
				cropping. For eBay, Amazon, Depop and Vinted, nobody outside those companies knows the
				algorithm. Pre-cropping is still the right move, because it removes the question rather than
				answering it.
			</p>
			<p class="mb-4">
				For the per-platform detail,
				<a href="https://mochify.app/guides/product-image-requirements-marketplace-guide"
					>the marketplace image requirements guide</a
				>
				has the full table, and
				<a href="https://mochify.app/guides/do-marketplace-product-images-need-to-be-square"
					>our answer to whether marketplace product images need to be square</a
				> covers when 1:1 is actually required versus merely how the thumbnail renders.
			</p>
		</section>

		<!-- 08 -->
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: cropping a folder to square, subject kept</SectionHeading>
			<p class="mb-4">
				If your photos are not framed alike, the fix is a crop that is decided per image rather than
				once for the set. That is what Mochify's saliency crop does, and there are four ways to
				reach it depending on how many files you have and how much you want to type.
			</p>

			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>

			<CodeCard filename="square-crop.sh" code={apiCode} />

			<p class="mt-6 mb-4">
				<strong>What the crop actually does, and what it does not.</strong> A saliency model looks at
				each image on its own and centers the square on the region a viewer's eye goes to first, typically
				a face, a product or the focal subject, rather than on the geometric center. If the subject sits
				near an edge, the crop window slides toward it as far as the frame allows. It is best effort,
				not a guarantee: on an obvious subject against a clean background it lands where you would have
				put it by hand, and on a busy scene with no clear focal point it returns the model's best estimate,
				so review those. There is no upscaling, so the output never exceeds the source's pixel dimensions;
				pick a square size your originals can actually support.
			</p>

			<GlassInfoBox type="note" title="On privacy, precisely">
				Images travel over HTTPS to <code>api.mochify.app</code>, are processed in memory, and are
				wiped immediately, with no disk writes and no logs containing file data. That is true of the
				web app, the CLI, the API and both MCP surfaces alike, because all of them are clients over
				the same engine. We say it that way rather than claiming your images never leave your
				machine, because for image work that would not be true. If you also need metadata stripped,
				EXIF including GPS is removed by default through the API unless you explicitly opt out;
				<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
					>our guide to EXIF risks in image compression</a
				> covers what is in those fields and why it matters for public listings.
			</GlassInfoBox>

			<p class="mt-6 mb-4">
				<strong>Allowances.</strong> Three images a month with no account at all, 25 a month with a free
				account, 3 files per batch, 20MB per file. Seller and Pro raise that to 25 files per batch at
				75MB each. A Day Pass is $2 for 100 uploads within 24 hours with no account, which is the honest
				answer for a one-off catalog. Current numbers are on
				<a href="https://mochify.app/pricing">the pricing page</a>.
			</p>
			<p class="mb-4">
				Need a transparent cutout as well as a square?
				<a href="https://mochify.app/solutions/remove-background-webp">The background remover</a> pairs
				with the crop, and background removal is included on every tier including Free.
			</p>
		</section>

		<!-- 09 -->
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet: which route does what</SectionHeading>
			<p class="mb-4">
				The one question that decides whether a batch crop will work for you is whether the tool
				applies one rectangle or decides per image. Here is every route in this guide, answered.
			</p>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Route</th>
							<th>Platform</th>
							<th>Batches?</th>
							<th>How it chooses the crop</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Photos app</td>
							<td>Windows 11</td>
							<td>No</td>
							<td>One image at a time</td>
						</tr>
						<tr>
							<td>PowerToys Image Resizer (Fill)</td>
							<td>Windows</td>
							<td>Yes</td>
							<td>Centered aspect-fill, same for all</td>
						</tr>
						<tr>
							<td>IrfanView batch conversion</td>
							<td>Windows</td>
							<td>Yes</td>
							<td>Fixed pixel coordinates from one reference image</td>
						</tr>
						<tr>
							<td>Preview</td>
							<td>macOS</td>
							<td>Resize only</td>
							<td>Crop is single-image only</td>
						</tr>
						<tr>
							<td>Automator "Crop Images"</td>
							<td>macOS</td>
							<td>Yes</td>
							<td>One crop specification for all</td>
						</tr>
						<tr>
							<td>Shortcuts "Crop Image"</td>
							<td>macOS, iOS</td>
							<td>Scriptable</td>
							<td>Parameters undocumented; test first</td>
						</tr>
						<tr>
							<td>Photos app + Copy Edits</td>
							<td>iOS</td>
							<td>Yes</td>
							<td>Square crop carries, but always centered; your framing does not</td>
						</tr>
						<tr>
							<td>ImageMagick <code>-extent</code></td>
							<td>Any</td>
							<td>Yes</td>
							<td>Centered, identical geometry for all</td>
						</tr>
						<tr>
							<td>sharp / libvips attention</td>
							<td>Any (code)</td>
							<td>Yes</td>
							<td>Heuristic: brightness, saturation, skin tone</td>
						</tr>
						<tr>
							<td>Photoshop Actions + Batch</td>
							<td>Desktop</td>
							<td>Yes</td>
							<td>Replays the recorded crop</td>
						</tr>
						<tr>
							<td>Lightroom Classic Sync</td>
							<td>Desktop</td>
							<td>Yes</td>
							<td>Same proportional region, scaled per file</td>
						</tr>
						<tr>
							<td>Mochify saliency crop</td>
							<td>Web, CLI, API, MCP</td>
							<td>Yes</td>
							<td>Per-image subject detection, best effort</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				<strong>Rule of thumb:</strong> if every photo in the folder was shot the same way, use the free
				built-in tool for your platform and stop reading. If they were not, no fixed rectangle will save
				you, and the choice is per-image cropping by hand or per-image cropping by model.
			</p>
			<p class="mb-4">
				<a href="https://mochify.app/solutions/bulk-ai-square-cropper"
					>Crop your batch to square now</a
				>.
			</p>
		</section>

		<!-- 10 FAQ -->
		<GlassFAQs items={faqItems} />

		<GlassCTA
			heading="Got a folder of mismatched product shots to square up?"
			href="https://mochify.app"
			label="Open Mochify →"
		>
			Drop them into Mochify and prompt <em>"square crop these to 1000px"</em> to get every file
			cropped around its own subject in one pass, instead of stamping the same rectangle on all of
			them.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>

<style>
	/* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. */
	:global(nav[aria-label='Breadcrumb']) {
		max-width: 48rem;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1.25rem;
	}

	/* Match the article's mobile gutter (px-5 vs the breadcrumb's px-4). */
	@media (max-width: 767px) {
		:global(nav[aria-label='Breadcrumb']) {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}

	.hero-wash {
		position: absolute;
		top: -20rem;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		height: 1450px;
		z-index: -1;
		pointer-events: none;
		background:
			radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.4) 0%, transparent 70%),
			radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.32) 0%, transparent 70%),
			radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.25) 0%, transparent 70%);
		mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
	}

	@media (max-width: 768px) {
		.hero-wash {
			height: 1000px;
			background:
				radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.22) 0%, transparent 70%),
				radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.16) 0%, transparent 70%),
				radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.12) 0%, transparent 70%);
		}
	}
</style>
