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
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	const metadata = {
		title: 'How to Reduce Photo File Size on iPhone: The Fast Way and the Built-In Way',
		description:
			"Compress an iPhone photo to 1MB in seconds in Safari, or use Preview's hidden Export slider on iOS 26+. Tested steps, real file sizes, what to avoid.",
		category: 'Image Formats',
		readTime: '21 min read',
		date: 'September 25, 2026'
	};

	const toc = [
		{
			id: 'the-fast-way-tell-mochify-the-size-you-need',
			label: 'The fast way: tell Mochify the size you need'
		},
		{ id: 'mochify-workflow', label: 'Mochify workflow: compress to a set size' },
		{ id: 'mochify-or-preview-side-by-side', label: 'Mochify or Preview: side by side' },
		{ id: 'why-iphone-photos-are-so-big-now', label: 'Why iPhone photos are so big now' },
		{
			id: 'file-size-or-dimensions-which-one-is-your-problem',
			label: 'File size or dimensions: which is your problem?'
		},
		{
			id: 'the-built-in-way-preview-on-ios-26-and-later',
			label: 'The built-in way: Preview on iOS 26 and later'
		},
		{
			id: 'other-built-in-routes-files-shortcuts-and-mail',
			label: 'Other built-in routes: Files, Shortcuts and Mail'
		},
		{
			id: 'what-does-not-work-or-not-the-way-you-think',
			label: 'What does not work (or not the way you think)'
		},
		{ id: 'stop-the-problem-at-capture-camera-settings', label: 'Stop the problem at capture' },
		{
			id: 'getting-under-an-upload-limit-what-to-aim-for',
			label: 'Getting under an upload limit: what to aim for'
		},
		{ id: 'cheat-sheet', label: 'Cheat sheet: which route to use' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Open mochify.app/flow in Safari',
			html: `<p>Open <a href="https://mochify.app/flow">mochify.app/flow</a> in Safari on your iPhone.</p>`
		},
		{
			title: 'Add the photo',
			html: `<p>Add it straight from your Photo Library. HEIC is accepted as it comes off the phone.</p>`
		},
		{
			title: 'Type the size you need',
			html: `<p>For example, "compress to 1MB" or "compress to 2MB".</p>`
		},
		{
			title: 'Download the result',
			html: `<p>Safari asks you to confirm the download and saves the file to the Downloads folder in Files, where any upload form's file picker can find it.</p>`
		}
	];

	const faqItems = [
		{
			q: 'How do I reduce the MB size of a photo on my iPhone?',
			a: 'The quickest way is to open mochify.app/flow in Safari, pick the photo and type "compress to 1MB" (or your limit); our 4.3MB test photo came back at 964KB at full size. Built in, open the photo in Preview, tap the small arrow next to the filename, choose Export, pick JPEG and drag the Size slider left until the Estimate file size figure is under your limit. Preview needs iOS 26 or later.'
		},
		{
			q: 'Can I reduce photo file size on iPhone without an app?',
			a: "Yes. The Preview app is built in on iOS 26 and later and can both resize and compress; the Files app's Convert Image quick action and a Shortcuts shortcut are the other built-in routes. Mochify needs no app either: it runs in Safari, and you can add it to your Home Screen."
		},
		{
			q: 'Why are my iPhone photos so large?',
			a: 'Recent iPhones save 24 MP photos by default on supported models, twice the pixels of the 12 MP photos older models took, and 48 MP or RAW modes go much further. Apple puts a 48 MP ProRAW file at about 75MB. Converting HEIC to JPEG for a website can also make a file bigger, because HEIF compresses better at the same quality.'
		},
		{
			q: 'Does reducing photo file size lose quality?',
			a: 'It depends which lever you pull. Reducing dimensions removes detail you will only miss if you zoom in or print large. Lowering JPEG quality keeps the dimensions but adds blockiness and banding once you go too far. For most uploads, resizing to around 2048 pixels and exporting at high quality keeps the photo looking the same on screen.'
		},
		{
			q: 'How do I make a photo under 2MB on iPhone?',
			a: 'Type "compress to 2MB" into Mochify in Safari and download the result. Built in, open it in Preview, choose Export, pick JPEG and drag the Size slider until the estimate reads under 2MB. On our 24 MP test photo the estimate dropped below 1MB at the third step from the left, so 2MB sits further right than that. If you need to go much lower and the photo starts to look blocky, use Adjust Size to set the long side to 2048 pixels first; our test photo estimated 857KB at that size with the slider at its default.'
		},
		{
			q: 'Does setting the camera to Most Compatible make photos smaller?',
			a: 'No, the opposite. Most Compatible saves new photos as JPEG, and Apple says HEIF (the High Efficiency setting) uses less storage at the same visual quality. To make future photos smaller, lower Photo Mode from 24 MP to 12 MP instead and keep High Efficiency on.'
		},
		{
			q: 'Can I compress several photos at once on iPhone?',
			a: 'Built-in, the practical option is a Shortcuts shortcut that resizes and converts every photo you share to it; Preview works one photo at a time. In Mochify, a free account processes 3 photos per batch and paid plans or a $2 Day Pass handle 25 at a time. For cropping a whole set to square, see our batch cropping guide.'
		},
		{
			q: 'Does Optimize iPhone Storage reduce photo file size?',
			a: 'No. It is an iCloud Photos storage setting: space-saving versions stay on your iPhone while the full-resolution originals live in iCloud. It frees space on the phone, but it does not give you a smaller file to upload or send.'
		}
	];

	const related = [
		{
			title: 'Photo File Too Large to Upload? Why Free Tools Reject Camera Files',
			href: '/guides/photo-file-too-large-to-upload',
			desc: 'The same wall from the camera side, with real file sizes and tool limits.'
		},
		{
			title: 'How to Convert iPhone Photos (HEIC) to PDF',
			href: '/guides/heic-to-pdf-iphone-photos',
			desc: 'When the form wants one document rather than a stack of images.'
		},
		{
			title: 'Can Safari Open HEIC Images on the Web?',
			href: '/guides/can-safari-open-heic-images',
			desc: "Why so many sites still reject your iPhone's default format."
		},
		{
			title: 'How to Batch Crop Photos to Square',
			href: '/guides/batch-crop-photos-to-square',
			desc: 'Including the iPhone copy-and-paste-edits trick most articles miss.'
		},
		{
			title: 'EXIF Data Risks: Strip Image Metadata for Global Privacy',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: 'What your photos reveal before you post them.'
		}
	];
</script>

<ReadProgress />

<svelte:head>
	<title>Reduce Photo File Size on iPhone - Fast Way vs Built-In | Mochify</title>
	<meta name="description" content={metadata.description} />
	<meta
		name="keywords"
		content="how to reduce photo file size on iphone, reduce photo size on iphone, compress photos on iphone, make a picture smaller on iphone, resize a photo on iphone, compress photo to 1MB iphone"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content="https://mochify.app/guides/reduce-photo-file-size-iphone" />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "How to Reduce Photo File Size on iPhone: The Fast Way and the Built-In Way",
			"description": "Compress an iPhone photo to 1MB in seconds in Safari, or use Preview's hidden Export slider on iOS 26+. Tested steps, real file sizes, what to avoid.",
			"url": "https://mochify.app/guides/reduce-photo-file-size-iphone",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://mochify.app/guides/reduce-photo-file-size-iphone"
			},
			"datePublished": "2026-09-25",
			"dateModified": "2026-09-25",
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
				{ "@type": "Thing", "name": "iPhone photos" },
				{ "@type": "Thing", "name": "HEIC" },
				{ "@type": "Thing", "name": "Apple Preview app" },
				{ "@type": "Thing", "name": "JPEG compression" },
				{ "@type": "Thing", "name": "Magic Flow" },
				{ "@type": "Thing", "name": "EXIF metadata" },
				{ "@type": "Thing", "name": "ProRAW" }
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
			How to Reduce Photo File Size on iPhone: The Fast Way and the Built-In Way
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			There are two ways to reduce photo file size on iPhone, and one is a lot quicker than the
			other. <strong>The fast way:</strong> open
			<a href="https://mochify.app/flow">mochify.app/flow</a>
			in Safari, pick the photo, type the size you need ("compress to 1MB") and download the result. Our
			4.3MB, 24 MP test photo came back at
			<strong>964KB with its full 4284 x 5712 dimensions and its location data stripped</strong>, in
			a fraction of the time the built-in route took. <strong>The built-in way:</strong> on iOS 26 and
			later, Apple's Preview app can export a smaller JPEG with a Size slider and a live size estimate.
			It is free and keeps everything on your phone, but its controls are spread across two apps and hidden
			behind menus most people never open. The first time through, it took us several minutes just to
			find them.
		</p>
		<p class="mt-5 mb-0">
			This guide walks through both, step by step and tested on a real iPhone on iOS 26.7 and iOS
			27, then covers why iPhone photos got so big, the difference between shrinking megabytes and
			shrinking pixels, the tips that do not work, and the camera settings that stop the problem at
			the source.
		</p>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<!-- 01 -->
		<section id="the-fast-way-tell-mochify-the-size-you-need" class="scroll-mt-24">
			<SectionHeading>The fast way: tell Mochify the size you need</SectionHeading>
			<p class="mb-4">
				The quickest way to get an iPhone photo under a size limit is to say the limit out loud, so
				to speak. Mochify's Magic Flow takes a plain-English instruction such as "compress to 1MB",
				works out how to get there, and hands back the file. A language model reads your
				instruction, then our C++ engine does the encoding, so there is no slider to fiddle with and
				no estimate to watch.
			</p>
			<p class="mb-4">
				On our test photo (a 4.3MB, 24 MP JPEG straight from the camera), "compress to 1MB" came
				back with the reply "Compressing your image to come in under 1MB while preserving its full
				dimensions", and the download was <strong>964KB at the original 4284 x 5712</strong>. The
				same job in Preview took ten-odd taps across Photos and Preview, and on iOS 26 a hunt for a
				menu arrow that was nearly invisible in dark mode.
			</p>
			<p class="mb-4">
				<strong>Make it one tap next time.</strong> In Safari, open mochify.app/flow, tap Share,
				then
				<strong>Add to Home Screen</strong>. It sits on your Home Screen like an app, so shrinking a
				photo becomes: tap the icon, pick the photo, type the size.
			</p>
			<p class="mb-4">
				<strong>It does more than shrink.</strong> The same box takes any instruction Magic Flow understands,
				for example:
			</p>
			<ul class="mb-4 ml-6 list-disc space-y-2">
				<li>"resize to 2048 pixels on the long side and convert to JPG"</li>
				<li>"convert to JPG and crop to a square"</li>
				<li>"remove the background and put it on a white background"</li>
			</ul>
			<p class="mb-4">
				JPEG output goes through Google's jpegli encoder, so you get a standard JPG that opens
				everywhere with fewer wasted bytes at the same quality. If all you need is a straight
				HEIC-to-JPG conversion with nothing to set, the
				<a href="https://mochify.app/heic-to-jpeg">HEIC to JPG converter</a> does exactly that, though
				conversion alone often does not make a photo smaller.
			</p>
			<p class="mb-4">
				<strong>Location data is stripped by default.</strong> Our 964KB download carried no EXIF
				data at all, so no GPS coordinates and no camera details. Preview does the opposite: its
				export keeps the lot, including where the photo was taken.
				<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
					>Our guide to EXIF risks</a
				> explains what a photo gives away.
			</p>
			<p class="mb-4">
				<strong>Limits worth knowing.</strong> Without an account you get 3 images a month; a free
				account gets 25 a month, up to 20MB per file and 3 photos per batch. For a one-off pile of
				photos, a Day Pass is $2 for 100 uploads within 24 hours, up to 75MB each and 25 at a time,
				with no subscription. Camera RAW files, including iPhone ProRAW <code>.DNG</code>, are not
				accepted; edit or share a RAW shot as a JPG first. Plans and limits are on the
				<a href="https://mochify.app/pricing">pricing page</a>.
			</p>
			<p class="mb-4">
				<a href="https://mochify.app/flow">Compress your iPhone photo now</a>.
			</p>
		</section>

		<!-- 02 -->
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: compress an iPhone photo to a set size</SectionHeading>

			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>

			<GlassInfoBox type="note" title="Privacy">
				Your photos travel over HTTPS to our API at <code>api.mochify.app</code>, are processed in
				memory, and are wiped as soon as the result is ready: nothing is written to disk, nothing is
				kept, and images are never used to train AI.
			</GlassInfoBox>
		</section>

		<!-- 03 -->
		<section id="mochify-or-preview-side-by-side" class="scroll-mt-24">
			<SectionHeading>Mochify or Preview: side by side</SectionHeading>
			<p class="mb-4">
				Both routes get a photo under a limit; they differ in effort, control and where the photo
				goes. We ran the same 4.3MB, 24 MP photo through each, on iOS 26.7 and again on iOS 27.
			</p>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th></th>
							<th>Mochify in Safari</th>
							<th>Preview (built in)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Steps</td>
							<td>Open, pick, type the size, download</td>
							<td>
								Share, More, Preview, filename arrow, Export, JPEG, slider, tick, choose folder,
								Save
							</td>
						</tr>
						<tr>
							<td>Set a target size</td>
							<td>Type it ("compress to 1MB")</td>
							<td>Drag a slider until the estimate is under it</td>
						</tr>
						<tr>
							<td>Our result</td>
							<td>964KB, full dimensions</td>
							<td>993KB, full dimensions</td>
						</tr>
						<tr>
							<td>Location data</td>
							<td>Stripped by default</td>
							<td>Kept</td>
						</tr>
						<tr>
							<td>Where the photo is processed</td>
							<td>Our API, in memory, then wiped</td>
							<td>On your iPhone</td>
						</tr>
						<tr>
							<td>Cost</td>
							<td>3 a month without an account, 25 with a free one</td>
							<td>Free, unlimited</td>
						</tr>
						<tr>
							<td>Needs</td>
							<td>Any iPhone with Safari</td>
							<td>iOS 26 or later</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				<strong>When the built-in way is the better choice:</strong> you would rather the photo never
				leaves your phone, you need to keep its location data, or you are shrinking more photos a month
				than the free allowance covers and do not want a plan. For everything else, the fast way is faster.
			</p>
		</section>

		<!-- 04 -->
		<section id="why-iphone-photos-are-so-big-now" class="scroll-mt-24">
			<SectionHeading>Why iPhone photos are so big now</SectionHeading>
			<p class="mb-4">
				iPhone photos are big because recent iPhones shoot more pixels by default, and some shooting
				modes multiply the file size on top of that. On supported models the Main camera saves
				<strong>24 MP</strong> photos by default, and Resolution Control or ProRAW can push that to
				48 MP,
				<a
					href="https://support.apple.com/guide/iphone/iphb362b394e/ios"
					target="_blank"
					rel="noopener noreferrer">according to Apple's camera settings guide</a
				>.
			</p>
			<p class="mb-4">
				A 24 MP frame is 5712 x 4284 pixels, just over 24.4 million of them. That is twice the pixel
				count of the 12 MP photos iPhones took for years. The HEIC format keeps those files
				reasonably small on the phone, but the moment a website, a form or a Windows PC wants
				something else, you are dealing with a lot of image.
			</p>
			<p class="mb-4">
				RAW is the extreme case.
				<a href="https://support.apple.com/en-us/119916" target="_blank" rel="noopener noreferrer"
					>Apple's ProRAW documentation</a
				>
				puts a ProRAW file at <strong>about 25MB at 12 MP and about 75MB at 48 MP</strong>, and says
				ProRAW files are <strong>10 to 12 times larger than HEIF or JPEG</strong>. If you turned RAW
				on for one shot and forgot about it, that alone explains an upload form's complaint.
			</p>
			<p class="mb-4">Three things usually push a photo over a limit:</p>
			<ul class="mb-4 ml-6 list-disc space-y-2">
				<li>
					<strong>Resolution.</strong> 24 MP or 48 MP where the destination would be perfectly happy with
					a fraction of that.
				</li>
				<li>
					<strong>Format.</strong> The form wants JPEG, and a straight HEIC-to-JPEG conversion often
					comes out <em>larger</em> than the HEIC, because HEIF compresses better at the same visual
					quality (<a
						href="https://support.apple.com/en-us/116944"
						target="_blank"
						rel="noopener noreferrer">Apple's HEIF and HEVC notes</a
					>).
				</li>
				<li>
					<strong>Shooting mode.</strong> RAW, and the 48 MP modes, produce files several times the size
					of a standard shot.
				</li>
			</ul>
		</section>

		<!-- 05 -->
		<section id="file-size-or-dimensions-which-one-is-your-problem" class="scroll-mt-24">
			<SectionHeading>File size or dimensions: which one is your problem?</SectionHeading>
			<p class="mb-4">
				Check what the upload form is actually asking for before you shrink anything, because "too
				large" means two different things. <strong>File size</strong> is the megabytes on disk
				("must be under 2MB"). <strong>Dimensions</strong> are the pixel width and height ("at least 600
				x 600", "no larger than 2000 pixels"). Many forms state both.
			</p>
			<p class="mb-4">
				They are connected but not the same. Cutting the dimensions in half removes three quarters
				of the pixels, which usually brings the file size down sharply. Lowering JPEG quality
				reduces the megabytes without touching the dimensions at all. Cropping does both, but only
				by throwing away part of the picture.
			</p>
			<p class="mb-4">A quick rule for choosing:</p>
			<ul class="mb-4 ml-6 list-disc space-y-2">
				<li>
					<strong>The form names a megabyte limit and nothing else:</strong> lower the export quality
					first. If you have to drag the slider a long way and the photo starts to look smeary, reduce
					the dimensions instead.
				</li>
				<li>
					<strong>The form names a maximum pixel size:</strong> resize to that size. The file size will
					usually follow.
				</li>
				<li>
					<strong>The form rejects the file with no clear reason:</strong> it may be the format, not
					the size. Many sites still do not accept HEIC (our
					<a href="https://mochify.app/guides/can-safari-open-heic-images"
						>guide to Safari and HEIC on the web</a
					> covers why), so export as JPEG either way.
				</li>
			</ul>
			<p class="mb-4">
				To see where you stand, open the photo in Preview and tap the small arrow beside the
				filename at the top of the screen: the menu shows the file's format and size.
			</p>
		</section>

		<!-- 06 -->
		<section id="the-built-in-way-preview-on-ios-26-and-later" class="scroll-mt-24">
			<SectionHeading>The built-in way: Preview on iOS 26 and later</SectionHeading>
			<p class="mb-4">
				Preview is the built-in answer to the old complaint that the iPhone has no native way to
				resize or compress a photo. Apple brought its Preview app to iPhone with iOS 26, and it does
				both: <strong>Export</strong> re-saves an image as HEIC or JPEG with a Size slider and a
				live file-size estimate, and <strong>Adjust Size</strong> changes the pixel dimensions. Most of
				the pages ranking for this question were written before it existed, and the few that mention it
				leave out the estimate, which is the part that makes it useful.
			</p>
			<p class="mb-4">
				We tested every step below on an iPhone running iOS 26.7, then again after updating to iOS
				27, with a 24 MP photo straight from the camera: 4284 x 5712 pixels, 4.3MB. The results were
				identical on both.
			</p>

			<h3>Step 1: get the photo into Preview</h3>
			<p class="mb-4">
				Preview opens files from the Files app's locations (Recents, Shared and Browse), not
				straight from your Photos library. Two ways in:
			</p>
			<ul class="mb-4 ml-6 list-disc space-y-2">
				<li>
					<strong>From Photos:</strong> open the photo and tap Share. Preview was not in the row of
					apps on our phone: scroll the row to the end, tap <strong>More</strong>, and you will find
					Preview near the bottom of the list. Tap <strong>Edit</strong> on that screen to add it to the
					row for next time.
				</li>
				<li>
					<strong>Via Files:</strong> in Photos, tap Share, then Save to Files and pick a folder. Open
					Preview, tap Browse, and open the saved copy.
				</li>
			</ul>
			<p class="mb-4">
				Sharing a photo to Preview saves a copy into a Preview folder in the Files app straight
				away. Your original stays in the Photos library untouched.
			</p>

			<h3>Step 2: export as JPEG and watch the estimate</h3>
			<p class="mb-4">
				This is the step that sets the file size. Following
				<a
					href="https://support.apple.com/guide/iphone/iph61c20afe1/ios"
					target="_blank"
					rel="noopener noreferrer">Apple's Preview export instructions</a
				>:
			</p>
			<ol class="mb-4 ml-6 list-decimal space-y-3">
				<li>
					Tap the <strong>small arrow to the right of the filename</strong> at the top of the
					screen. On iOS 26 it is easy to miss, because in dark mode the filename is close to
					invisible and the arrow is tiny; iOS 27 shows the filename clearly. The menu shows the
					file's format and current size, then Duplicate, Move, Rename, <strong>Export</strong> and Print.
				</li>
				<li>
					Tap <strong>Export</strong> and choose <strong>JPEG</strong> under Format. On iOS 27 it starts
					on HEIC, which is smaller but rejected by plenty of forms.
				</li>
				<li>
					Drag the <strong>Size</strong> slider in the Options box. It moves in steps (about ten),
					and the <strong>Estimate file size</strong> figure under Format updates at each one. Stop when
					it is under your limit.
				</li>
				<li>
					Tap the <strong>tick</strong> at the top right, choose where to save (it offers the Preview
					folder by default), and save.
				</li>
			</ol>
			<p class="mb-4">
				What that looked like on our 4.3MB test photo, with the dimensions left at 4284 x 5712:
			</p>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Size slider position</th>
							<th>Estimated JPEG size</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Full right (highest quality)</td>
							<td>9.7MB</td>
						</tr>
						<tr>
							<td>Default (one step left of full right)</td>
							<td>4.9MB</td>
						</tr>
						<tr>
							<td>Third step from the left</td>
							<td>993KB</td>
						</tr>
						<tr>
							<td>Full left (lowest quality)</td>
							<td>669KB</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				Two things stand out. The default setting produces a file <em>larger</em> than the original, because
				the slider starts near maximum quality, so exporting without touching the slider can make things
				worse. And the slider alone took a full-resolution 24 MP photo from 4.3MB to 993KB, 77% smaller,
				without resizing at all. The exported file came out at exactly the estimated 993KB.
			</p>

			<h3>Step 3 (if it looks rough): reduce the dimensions with Adjust Size</h3>
			<p class="mb-4">
				If you have to drag the slider a long way and the photo starts to show blocky edges or
				banding in the sky, cut the dimensions instead. Tap the <strong>three-dot menu</strong> at
				the top right, then <strong>Adjust Size</strong>
				(<a
					href="https://support.apple.com/guide/iphone/iphf1900dea2/ios"
					target="_blank"
					rel="noopener noreferrer">Apple: edit an image in Preview on iPhone</a
				>):
			</p>
			<ul class="mb-4 ml-6 list-disc space-y-2">
				<li>
					Switch the width and height units to <strong>pixels</strong> (our phone defaulted to inches;
					percent, centimeters and millimeters are also offered).
				</li>
				<li>
					Leave <strong>Scale Proportionally</strong> and <strong>Resample Image</strong> on (both are
					on by default). With Resample Image off, the proportions setting is grayed out.
				</li>
				<li>
					Enter <strong>2048</strong> for the long side. The other side follows: our portrait photo became
					2048 x 1536.
				</li>
			</ul>
			<p class="mb-4">
				Preview saves the resized image as a new file alongside the copy you shared, so nothing is
				overwritten. Then export it as in Step 2. Resized to 2048 x 1536, our test photo estimated
				<strong>857KB</strong> at the default slider position, <strong>1.9MB</strong> at full
				quality and <strong>160KB</strong> at the lowest. At that size you can keep the quality high and
				still land under most limits.
			</p>

			<h3>What Preview keeps: location included</h3>
			<p class="mb-4">
				<strong>Preview's export keeps the photo's metadata, including where it was taken.</strong> On
				our 993KB export, Preview's Info panel (the "i" button at the bottom right, beside Share) listed
				the latitude and longitude along with full Exif, GPS, IPTC and TIFF data. If you are posting the
				photo publicly, that matters.
			</p>
			<p class="mb-4">
				You can save the exported file back into Photos (share it to Photos from Files; Preview asks
				once for permission). In our test the copy in Photos showed no camera details, offered to
				add a location, was labeled "Saved from Preview" and got a new IMG number. Do not treat that
				as a privacy step: the file in Files still carried its location, and what a website receives
				depends on which copy you upload. Mochify strips location by default, as covered above.
			</p>
		</section>

		<!-- 07 -->
		<section id="other-built-in-routes-files-shortcuts-and-mail" class="scroll-mt-24">
			<SectionHeading>Other built-in routes: Files, Shortcuts and Mail</SectionHeading>
			<p class="mb-4">
				Preview gives you the most control, but the Files app and Shortcuts can shrink a photo too,
				each with a catch. Mail, which older articles recommend, did not offer a smaller size in our
				test.
			</p>

			<h3>The Files app: Convert Image</h3>
			<p class="mb-4">
				The Files app converts an image to a preset size in a few taps. Long-press the image in
				Files, choose <strong>Quick Actions</strong>, then <strong>Convert Image</strong>, and pick
				a file format (JPEG, PNG or HEIF) and an image size:
				<strong>Small, Medium, Large or Original</strong>. We confirmed those options on iOS 26.7
				and iOS 27. Files writes a new file next to the original.
			</p>
			<p class="mb-4">
				It is quicker than Preview when a preset is good enough, but there is no live estimate, no
				way to set an exact width, and Apple does not publish the pixel sizes behind each preset.
			</p>

			<h3>Shortcuts: resize a batch</h3>
			<p class="mb-4">
				Shortcuts is the built-in route for more than one photo at a time. In Apple's Shortcuts app,
				a shortcut with a <strong>Resize Image</strong> action followed by
				<strong>Convert Image</strong> (set to JPEG) takes whatever photos you share to it, scales each
				one to the width you set, and hands back JPEGs. Convert Image has a quality setting and an option
				to leave out metadata such as location. We confirmed both actions in the Shortcuts app on iOS
				26.7.
			</p>
			<p class="mb-4">
				Building it takes five minutes once. After that it sits in the Share sheet and handles
				twenty photos as easily as one, which none of the other built-in routes do.
			</p>

			<h3>Mail: do not count on it</h3>
			<p class="mb-4">
				The most-upvoted answer on the top-ranking Apple Community thread, from 2018, says to email
				the photo to yourself and pick a smaller size when Mail asks.
				<strong
					>In our tests on iOS 26.7 and iOS 27, sharing a photo to Mail offered no size choice at
					all</strong
				>, so we do not recommend it as a route. Mail does still shrink one kind of photo for you:
				Apple says that when you add a ProRAW photo to a message, "the Mail app converts the ProRAW
				file to a smaller JPG file automatically" (<a
					href="https://support.apple.com/en-us/119916"
					target="_blank"
					rel="noopener noreferrer">Apple ProRAW support</a
				>).
			</p>
		</section>

		<!-- 08 -->
		<section id="what-does-not-work-or-not-the-way-you-think" class="scroll-mt-24">
			<SectionHeading>What does not work (or not the way you think)</SectionHeading>
			<p class="mb-4">
				Several popular tips either do not reduce the file you send, or do it by damaging the photo.
				Four to skip:
			</p>
			<ul class="mb-4 ml-6 list-disc space-y-3">
				<li>
					<strong>Switching the camera to Most Compatible.</strong> This makes new photos JPEG
					instead of HEIF, and Apple is explicit that HEIF uses less storage "while preserving the
					same visual quality." Most Compatible makes photos <em>more</em> compatible and
					<em>larger</em>. At least one ranking article recommends it for smaller files; it has it
					backwards.
				</li>
				<li>
					<strong>Turning on Optimize iPhone Storage.</strong> This is a storage setting for iCloud Photos:
					it keeps space-saving versions on the phone while the full-resolution originals live in iCloud.
					It frees space on your phone. It does not give you a smaller copy to send, so it is the wrong
					tool for an upload limit.
				</li>
				<li>
					<strong>Taking a screenshot of the photo.</strong> It does produce a smaller file, but at whatever
					resolution your screen happens to be, with any on-screen clutter cropped out by hand. You lose
					detail you cannot get back and have no control over the result. Preview's Adjust Size does the
					same job properly.
				</li>
				<li>
					<strong>Cropping as a compression method.</strong> Cropping reduces the file because it discards
					part of the picture. If you want the whole picture, resize instead.
				</li>
			</ul>
		</section>

		<!-- 09 -->
		<section id="stop-the-problem-at-capture-camera-settings" class="scroll-mt-24">
			<SectionHeading>Stop the problem at capture: camera settings</SectionHeading>
			<p class="mb-4">
				If you regularly send photos to forms or listings, change how the camera saves them rather
				than shrinking every file afterwards. Three settings matter, all under
				<strong>Settings &gt; Camera &gt; Formats</strong>.
			</p>
			<ul class="mb-4 ml-6 list-disc space-y-3">
				<li>
					<strong>Photo Mode: 12 MP or 24 MP.</strong> On supported models you can drop the default
					from 24 MP to 12 MP under Settings &gt; Camera &gt; Formats &gt; Photo Mode (<a
						href="https://support.apple.com/guide/iphone/iphb362b394e/ios"
						target="_blank"
						rel="noopener noreferrer">Apple</a
					>). A 12 MP photo has half the pixels of a 24 MP one: 12.2 million against 24.5 million.
					You give up cropping headroom; for listing photos and forms, you will rarely miss it.
				</li>
				<li>
					<strong>Resolution Control and ProRAW.</strong> Leave these off unless you need 48 MP or RAW
					for editing. If you do shoot RAW, remember that each file runs to tens of megabytes.
				</li>
				<li>
					<strong>High Efficiency, not Most Compatible.</strong> HEIF keeps files smaller on the phone.
					Convert to JPEG at the moment you need a JPEG, not at capture.
				</li>
			</ul>
			<p class="mb-4">
				Changing Photo Mode only affects new photos. Everything already in your library stays the
				size it is.
			</p>
		</section>

		<!-- 10 -->
		<section id="getting-under-an-upload-limit-what-to-aim-for" class="scroll-mt-24">
			<SectionHeading>Getting under an upload limit: what to aim for</SectionHeading>
			<p class="mb-4">
				Aim for the destination's stated limit with some headroom, and compress before you resize,
				because compression keeps every pixel. Upload forms, job portals and government sites
				usually state a maximum in megabytes, and occasionally a pixel range. Where they do not, a
				JPEG around 2048 pixels on the long side is a safe default: sharp on any screen, and a
				fraction of the original's pixels.
			</p>
			<p class="mb-4">A practical order of operations:</p>
			<ol class="mb-4 ml-6 list-decimal space-y-3">
				<li>
					<strong>Set the size.</strong> Tell Mochify "compress to 2MB" (or whatever the limit is), or
					export as JPEG from Preview and drag the Size slider until the estimate is under the limit,
					with some headroom.
				</li>
				<li><strong>Look at the result.</strong> If it is sharp, you are done.</li>
				<li>
					<strong>If it looks rough,</strong> bring the long side down to 2048 pixels (or what the destination
					asks for) and compress again: "resize to 2048 pixels on the long side" in Mochify, or Adjust
					Size in Preview.
				</li>
				<li>
					<strong>If it is still over,</strong> resize again (to 1600 or 1200 pixels) rather than crushing
					the quality.
				</li>
			</ol>
			<p class="mb-4">
				This matters because the two levers do different damage. Lower dimensions make a photo
				smaller everywhere. Lower quality leaves it the same size on screen with blocky edges and
				banding in skies, which is what people actually notice. Our guide to
				<a href="https://mochify.app/guides/photo-file-too-large-to-upload"
					>why free tools reject large camera files</a
				>
				covers the same problem from the camera side, and
				<a href="https://mochify.app/guides/should-i-optimize-images-before-upload"
					>should you optimize images before uploading</a
				> explains why shrinking before upload beats letting the site do it.
			</p>
			<p class="mb-4">
				If you are sending the photos as a document rather than as images,
				<a href="https://mochify.app/guides/heic-to-pdf-iphone-photos"
					>converting iPhone photos to PDF</a
				> is often what the form really wants.
			</p>
		</section>

		<!-- 11 -->
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet: which route to use</SectionHeading>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>You need to...</th>
							<th>Best route</th>
							<th>What it gives you</th>
							<th>The catch</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Hit a size limit fast</td>
							<td>Mochify in Safari: "compress to 1MB"</td>
							<td>Target size, full dimensions, location stripped</td>
							<td>Uploads to our API; 3 a month without an account</td>
						</tr>
						<tr>
							<td>Get under a limit without uploading</td>
							<td>Preview: Export as JPEG, Size slider</td>
							<td>Live file-size estimate as you slide</td>
							<td>One photo at a time; keeps location; iOS 26 or later</td>
						</tr>
						<tr>
							<td>Hit a maximum pixel width</td>
							<td>Preview: Adjust Size, then Export</td>
							<td>Exact dimensions</td>
							<td>Two steps</td>
						</tr>
						<tr>
							<td>Convert quickly at a preset size</td>
							<td>Files: Quick Actions &gt; Convert Image</td>
							<td>JPEG, PNG or HEIF; Small to Original</td>
							<td>Presets only, sizes unpublished</td>
						</tr>
						<tr>
							<td>Resize many photos, repeatedly</td>
							<td>A Shortcuts shortcut</td>
							<td>Batch resize + JPEG from the Share sheet</td>
							<td>Five minutes to build</td>
						</tr>
						<tr>
							<td>Stop future photos being huge</td>
							<td>Settings &gt; Camera &gt; Formats</td>
							<td>12 MP Photo Mode, RAW off</td>
							<td>Only affects new photos</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				<strong>Rule of thumb:</strong> name the size you need and compress first; if the photo looks
				rough at that size, resize to 2048 pixels on the long side and compress again.
			</p>
		</section>

		<!-- 12 FAQ -->
		<GlassFAQs items={faqItems} />

		<GlassCTA
			heading="Got an iPhone photo that is too big for the form you are filling in?"
			href="https://mochify.app/flow"
			label="Open Mochify in Safari →"
		>
			Open <a href="https://mochify.app/flow">Mochify in Safari</a>, pick the photo and type
			<em>"compress to 1MB"</em> (or whatever your limit is). Location data is stripped by default.
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
