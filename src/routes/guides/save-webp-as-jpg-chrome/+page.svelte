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
		title: 'How to Save a WebP as JPG in Chrome',
		description:
			'Chrome did not convert your image and renaming the file does nothing. The four routes that actually re-encode a WebP as JPG, one of them built into Chrome.',
		category: 'Image Formats',
		readTime: '19 min read',
		date: 'September 22, 2026'
	};

	const toc = [
		{ id: 'why-chrome-handed-you-a-webp', label: 'Why Chrome handed you a .webp' },
		{ id: 'the-rename-trap', label: 'The rename trap, and why it keeps getting published' },
		{ id: 'route-1-copy-paste-save', label: 'Route 1: copy, paste, save (nothing to install)' },
		{ id: 'route-2-apps-you-already-have', label: 'Route 2: the apps already on your machine' },
		{
			id: 'route-3-right-click-menu',
			label: 'Route 3: adding your own item to the right-click menu'
		},
		{ id: 'mochify-workflow', label: 'The Mochify workflow: right-click any image' },
		{ id: 'see-it-in-action', label: 'See it in action' },
		{ id: 'should-you-convert', label: 'Should you convert to JPG at all?' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Install the extension',
			html: '<p>Get it from the <a href="https://chromewebstore.google.com/detail/pgegchhkcjdcnnppeahkdcalclpaamcj" target="_blank" rel="noopener noreferrer">Chrome Web Store listing</a>. It is also linked from the Mochify home page.</p>'
		},
		{
			title: 'Right-click the image',
			html: '<p>Pick the Mochify item on the image you want, and a small panel opens on top of the page, showing the account you are signed in as and a prompt field.</p>'
		},
		{
			title: 'Say what you want',
			html: '<p>"Convert this to JPG" is all this job needs. One prompt can also chain several operations at once, which is the panel\'s own worked example: <em>Make 1:1 square, remove bg, convert to AVIF</em> crops the image square, cuts out the background and converts the format in a single pass. Everything Magic Flow can do (convert, resize, crop, remove the background, adjust brightness and clarity, strip EXIF, work with HDR) is asked for the same way, because there is no settings panel and no quality slider to hunt for.</p>'
		},
		{
			title: 'Send it to Google Drive, if you would rather',
			html: '<p>Signed-in Seller and Pro accounts get a Save to Drive toggle in the panel, so the converted file goes straight to Drive from the right-click menu instead of landing in your downloads folder.</p>'
		},
		{
			title: 'One image at a time',
			html: '<p>The extension works on the image you right-clicked. It is not a batch tool, and we would rather say that plainly than let you discover it on a folder of forty.</p>'
		},
		{
			title: 'For batches, use the web app',
			html: '<p>Drop the files at <a href="https://mochify.app">mochify.app</a> and prompt once for all of them. Free is 3 images a month with no account at all (a guest allowance by IP address that resets monthly) or 25 a month with a free account, up to 20MB per file and 3 per batch. Seller and Pro raise that to 75MB and 25 per batch. A $2 Day Pass gives you 100 uploads within 24 hours with no account and no subscription, and its allowance sits on top of whatever tier you were already on.</p>'
		}
	];

	const faqItems = [
		{
			q: 'Why are images saving as WebP instead of JPG?',
			a: 'Because the website served the image as WebP. Your browser asks for what it can display, the server picks the format, and Save image as writes exactly what was downloaded. Chrome does not re-encode images on the way to your disk, and the same site will hand a WebP to Firefox and Safari as well.'
		},
		{
			q: 'How do I stop Chrome from saving images as WebP?',
			a: 'You cannot, at least not with a setting. Chrome has no option to convert image formats on download, and the Chromium feature request asking for one has been open since May 2024 with no update. Your options are to convert after saving, to use Copy image instead of Save image as, or to install an extension that adds its own save-as item to the right-click menu. This is not Chrome-specific either: Mozilla has carried the same request open since June 2020, and any browser that advertises WebP support will be served WebP.'
		},
		{
			q: 'Can I change a WebP file to JPEG by renaming it?',
			a: 'No. The extension is only a label; the file still starts with the WebP signature and is still WebP-encoded. Some applications read that signature and open it regardless of the name, which is why the trick occasionally looks like it worked, but nothing has been converted and stricter software will reject the file.'
		},
		{
			q: 'How do I save a WebP as JPG on a Mac?',
			a: 'Open the file in Preview, choose File > Export, and set Format to JPEG. Alternatively, right-click the image in Chrome, choose Copy image, paste into Preview with File > New from Clipboard, and export from there without downloading the WebP at all.'
		},
		{
			q: 'Should I convert WebP to JPG or PNG?',
			a: 'Choose PNG if the image has a transparent background or is a logo, screenshot or line art, because JPEG has no alpha channel and will fill transparency with a solid color. Choose JPEG for photographs where file size matters. If nothing is forcing the change, keeping the WebP is usually the better call.'
		},
		{
			q: 'Does converting WebP to JPG lose quality?',
			a: 'Yes, a little. Both formats are lossy, so converting is a second round of compression on an image that has already been through one. At high quality settings the difference is very hard to see, but it is real, so convert once from the best version you have rather than chaining conversions.'
		},
		{
			q: 'Can I convert a WebP without installing anything or uploading it?',
			a: 'Yes. Right-click the image in Chrome, choose Copy image, and paste it into any editor already on your machine, then save as JPEG. The clipboard carries the decoded picture rather than the WebP file, so the editor never sees a WebP to complain about.'
		},
		{
			q: "Why won't my image save as a JPEG?",
			a: 'Almost always because the source is a WebP or AVIF and something in the chain is validating the real format rather than the filename. Re-encode it properly with any of the routes above and the upload will go through. If an uploader is rejecting a genuine JPEG, check the file size limit rather than the format.'
		}
	];

	const related = [
		{
			title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?',
			href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
			desc: 'picking a format to standardize on rather than converting one file at a time.'
		},
		{
			title: 'The 2026 Guide to Next-Gen Image Formats',
			href: '/guides/2026-guide-next-gen-formats',
			desc: 'why sites moved to WebP and AVIF, and what that means downstream.'
		},
		{
			title: 'AVIF to JPG',
			href: '/guides/avif-to-jpg',
			desc: 'the same right-click problem one format along, with the conversion routes that apply to it.'
		},
		{
			title: 'Privacy and Image Optimization',
			href: '/guides/privacy-image-optimization',
			desc: 'what actually happens to an image when a converter processes it, and which claims to distrust.'
		},
		{
			title: 'EXIF Data Risks in Image Compression',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: 'what a saved web image can still be carrying.'
		}
	];
</script>

<ReadProgress />

<svelte:head>
	<title>How to Save WebP as JPG in Chrome - Every Route That Works | Mochify</title>
	<meta name="description" content={metadata.description} />
	<meta
		name="robots"
		content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content="https://mochify.app/guides/save-webp-as-jpg-chrome" />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "How to Save a WebP as JPG in Chrome: Every Route That Actually Works",
			"description": "Chrome did not convert your image and renaming the file does nothing. The four routes that actually re-encode a WebP as JPG, one of them built into Chrome.",
			"url": "https://mochify.app/guides/save-webp-as-jpg-chrome",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://mochify.app/guides/save-webp-as-jpg-chrome"
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
				{ "@type": "Thing", "name": "WebP" },
				{ "@type": "Thing", "name": "JPEG" },
				{ "@type": "Thing", "name": "Google Chrome" },
				{ "@type": "Thing", "name": "Image conversion" },
				{ "@type": "Thing", "name": "Content negotiation" }
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
			How to Save a WebP as JPG in Chrome: Every Route That Actually Works
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			You right-clicked an image, chose Save image as, and got a <code>.webp</code> file that half
			your software refuses to open. Here is the short version: Chrome did not do this to you, there
			is no Chrome setting that fixes it, and renaming the file to <code>.jpg</code> does not convert
			anything. To save a WebP as JPG you have to actually re-encode the picture, and there are four ways
			to do that, one of which is already built into the browser you are reading this in.
		</p>
		<p class="mt-5 mb-0">
			We spend a lot of time inside image pipelines, and this particular question has the worst
			signal-to-noise ratio of anything in our lane. The highest-ranking editorial answer on Google
			today tells you to rename the file extension. That advice has been wrong since WebP shipped.
			Let's fix it properly.
		</p>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<!-- 01 -->
		<section id="why-chrome-handed-you-a-webp" class="scroll-mt-24">
			<SectionHeading>Why Chrome handed you a .webp</SectionHeading>
			<p class="mb-4">
				Chrome did not convert your image. The website's server chose to send WebP, Chrome
				downloaded those bytes, and Save image as wrote those same bytes to your disk. The browser
				is a courier here, not a converter.
			</p>
			<p class="mb-4">
				The mechanism is server-driven content negotiation. Your browser announces what it can
				display in the HTTP <code>Accept</code> header, and the server picks the best match it has.
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation"
					target="_blank"
					rel="noopener noreferrer">MDN's content negotiation reference</a
				>
				puts it plainly: the browser sends headers describing its preferences, and "the server uses them
				as hints and an internal algorithm chooses the best content to serve to the client." Sites can
				also make the choice in markup, with <code>&lt;picture&gt;</code> and <code>srcset</code>
				offering a WebP source ahead of a JPEG fallback. Either way, the decision was made on the server
				before Chrome ever saw the file.
			</p>
			<p class="mb-4">
				This is why the common explanation is backwards. You will read that Google "made the
				transition" to WebP and that Chrome now saves images in its own format. That is the wrong
				end of the pipe. A site that serves JPEG will hand you a JPEG in Chrome, and a site that
				serves WebP will hand you a WebP in Firefox and Safari too.
			</p>
			<p class="mb-4">
				It is also very common now.
				<a
					href="https://www.w3techs.com/technologies/details/im-webp"
					target="_blank"
					rel="noopener noreferrer">W3Techs</a
				>
				measures WebP on <strong>22.0% of all websites</strong> as of September 2026, with AVIF at
				<strong>1.7%</strong>
				and climbing. On the support side,
				<a href="https://caniuse.com/webp" target="_blank" rel="noopener noreferrer">caniuse</a>
				puts WebP at <strong>96.82% of global browser traffic</strong>. Site owners serve it because
				it works nearly everywhere and, per
				<a
					href="https://web.dev/articles/serve-images-webp"
					target="_blank"
					rel="noopener noreferrer">web.dev's long-standing figure</a
				>, WebP files typically come in <strong>25 to 35% smaller</strong> than the equivalent JPEG or
				PNG. That page carries a 2018 date and is still the canonical web.dev reference, so treat the
				range as a rule of thumb rather than a fresh benchmark, but the direction has not changed.
			</p>
			<p class="mb-4">
				<strong>There is no Chrome setting for this.</strong> Google's own
				<a
					href="https://support.google.com/chrome/answer/95759"
					target="_blank"
					rel="noopener noreferrer">download settings documentation</a
				>
				covers download location, prompting, automatic downloads and PDF handling, and nothing that converts
				image formats. The definitive confirmation is in Chromium's own tracker, where Unsplash filed
				<a
					href="https://issues.chromium.org/issues/340303232"
					target="_blank"
					rel="noopener noreferrer"
					>Provide a way for users to download JPG/PNG from AVIF/WebP source files</a
				>
				in May 2024. It is still open, still marked Feature Request with no status update, and a Microsoft
				engineer's reply on the thread states the behavior in one line: "Chrome will download whatever
				the URL of the image returns." Mozilla has had
				<a
					href="https://bugzilla.mozilla.org/show_bug.cgi?id=1644950"
					target="_blank"
					rel="noopener noreferrer">an equivalent request</a
				> open since June 2020. Browsers have been asked for this for over six years and none of them
				has shipped it.
			</p>
			<p class="mb-4">
				There is a genuine grain of truth in the "Chrome changed something" theory, though, and it
				is worth knowing because it explains the timing. The same thread pins it down: a change that
				landed in December 2021 made Chrome start sending the <code>Accept</code> header when you choose
				Save image as. Before that, the save request did not advertise WebP support, so plenty of servers
				answered it with a JPEG even though the page itself had displayed a WebP. After it, the save request
				looks like any other image request and gets the same modern format back. Chrome did not start
				converting your images. It started asking the same question twice, and getting the same answer
				both times.
			</p>
			<p class="mb-4">
				That distinction also tells you where the fix has to live. Since the format is chosen by the
				server before the bytes exist, nothing on your side can change what arrives. You can only
				re-encode what you were given.
			</p>
		</section>

		<!-- 02 -->
		<section id="the-rename-trap" class="scroll-mt-24">
			<SectionHeading>The rename trap, and why it keeps getting published</SectionHeading>
			<p class="mb-4">
				Renaming <code>photo.webp</code> to <code>photo.jpg</code> does not convert the file. It changes
				the label on the box, not what is in it, and every byte of WebP encoding stays exactly where it
				was.
			</p>
			<p class="mb-4">
				A file's extension carries no information about how the data inside is encoded. WebP files
				identify themselves with a signature at the very start of the file: the
				<a
					href="https://developers.google.com/speed/webp/docs/riff_container"
					target="_blank"
					rel="noopener noreferrer">WebP Container Specification</a
				>
				requires that "a WebP file MUST begin with a RIFF header with the FourCC 'WEBP'", which on disk
				is the bytes <code>52 49 46 46</code> (RIFF), a four-byte length, then
				<code>57 45 42 50</code> (WEBP). Any program that reads those first twelve bytes knows what it
				is holding regardless of what you called it.
			</p>
			<p class="mb-4">That leaves you with three possible outcomes, all bad:</p>
			<ul class="mb-4 list-disc space-y-2 pl-6">
				<li>
					<strong>The app sniffs the header and opens it anyway.</strong> Looks like a win. You now
					have a WebP file named <code>.jpg</code> sitting in a folder, and the problem resurfaces the
					next time you hand it to something stricter.
				</li>
				<li>
					<strong>The app trusts the extension and chokes.</strong> You get "this file is damaged" or
					"unsupported format" on a file that is neither.
				</li>
				<li>
					<strong>An upload form validates properly and rejects it.</strong> Marketplace and CMS uploaders
					are the usual culprits, and their error messages rarely explain why.
				</li>
			</ul>
			<p class="mb-4">
				The reason this advice persists is that outcome one happens often enough to look like
				success. It is the single most repeated piece of bad guidance on this topic, and at time of
				writing it appears in the top editorial result Google serves for the question. If someone
				tells you to rename the file, they have not converted anything.
			</p>
		</section>

		<!-- 03 -->
		<section id="route-1-copy-paste-save" class="scroll-mt-24">
			<SectionHeading>Route 1: copy, paste, save (nothing to install)</SectionHeading>
			<p class="mb-4">
				The fastest route needs no extension, no upload and no software you do not already have:
				right-click the image and choose <strong>Copy image</strong> instead of Save image as, then paste
				it into any image editor or document and save from there as JPEG.
			</p>
			<p class="mb-4">
				The difference matters. Save image as writes the downloaded file. Copy image puts the
				<strong>decoded picture</strong>
				on your clipboard, which is to say the actual pixels rather than the WebP container.
				<a
					href="https://web.dev/patterns/clipboard/copy-images/"
					target="_blank"
					rel="noopener noreferrer">web.dev's clipboard guidance</a
				> notes that modern browsers support copying images to the clipboard as PNG and SVG, so what lands
				in your editor is a normal raster image with no WebP anywhere in it. Paste into Paint, Preview,
				Photoshop, GIMP, Figma, Google Docs or Word, then save or export as JPEG.
			</p>
			<p class="mb-4">Two things worth knowing before you rely on it:</p>
			<ul class="mb-4 list-disc space-y-2 pl-6">
				<li>
					<strong>Metadata does not survive.</strong> The clipboard carries pixels, so EXIF, GPS
					coordinates and copyright fields are gone. For a picture you are about to publish that is
					usually a feature rather than a loss, and it is worth understanding
					<a href="/guides/exif-data-risks-image-compression-2026"
						>what image metadata actually exposes</a
					> before you reattach any of it.
				</li>
				<li>
					<strong>You get the image as the page loaded it.</strong> If the page is displaying a small
					preview that links to a larger file, copy the preview and you get the preview. Open the full
					image in its own tab first when resolution matters.
				</li>
			</ul>
			<p class="mb-4">
				For one image, this is a ten-second job and it is almost always the right answer. The reason
				nobody mentions it is a mystery to us: we read the page-one results for this question on
				September 21, 2026, and not one of them brings it up.
			</p>
		</section>

		<!-- 04 -->
		<section id="route-2-apps-you-already-have" class="scroll-mt-24">
			<SectionHeading>Route 2: the apps already on your machine</SectionHeading>
			<p class="mb-4">
				Every current desktop operating system can open a WebP and save a JPEG without installing
				anything, which makes this the reliable fallback when the clipboard route is not practical.
			</p>
			<ul class="mb-4 list-disc space-y-2 pl-6">
				<li>
					<strong>Windows 11 and 10:</strong> open the file in Paint, then File > Save as > JPEG picture.
					Photos will also do it via Save as copy. Right-click the file in Explorer and choose Edit to
					jump straight into the editor.
				</li>
				<li>
					<strong>macOS:</strong> open in Preview, then File > Export, and set Format to JPEG. The quality
					slider in that dialog is a real re-encode control, so leave it high unless you are deliberately
					shrinking the file.
				</li>
				<li>
					<strong>Linux:</strong> GIMP handles it through File > Export As, and if you have
					ImageMagick installed, <code>magick input.webp output.jpg</code> is a one-liner.
				</li>
			</ul>
			<p class="mb-4">
				The honest caveat is volume. These tools are built around one file at a time, and the
				frustration shows up wherever people discuss this. In a
				<a
					href="https://techcommunity.microsoft.com/discussions/windowsinsiderprogram/how-do-you-convert-webp-to-jpg-on-mac-or-windows-11/4399430"
					target="_blank"
					rel="noopener noreferrer">Microsoft Tech Community thread</a
				> on this exact question, the user's complaint is not that Preview cannot do it: "I tried to export
				them one by one using Preview, but it was too troublesome to do so many times." The replies send
				them to Automator, PowerShell and IrfanView, and a later comment lands the real objection to all
				three, that "not everyone is comfy using the terminal."
			</p>
			<p class="mb-4">
				If you have one image, use Route 1 or Route 2 and stop reading. If you have forty, keep
				going.
			</p>
		</section>

		<!-- 05 -->
		<section id="route-3-right-click-menu" class="scroll-mt-24">
			<SectionHeading>Route 3: adding your own item to the right-click menu</SectionHeading>
			<p class="mb-4">
				A Chrome extension cannot change what Chrome's built-in Save image as does. It can only add
				its own entry alongside it, and every extension in this category works the same way.
			</p>
			<p class="mb-4">
				This is a platform constraint, not a design choice. The
				<a
					href="https://developer.chrome.com/docs/extensions/reference/api/contextMenus"
					target="_blank"
					rel="noopener noreferrer"><code>chrome.contextMenus</code> API</a
				> lets an extension add items to the right-click menu, and reading the image bytes requires host
				permissions for the sites you use it on. Chrome's native menu items are not extensible. One of
				the extensions currently ranking on page one for this question says so in its own store description:
				"it's not possible to modify the behavior of chrome's native 'Save image as...' context menu option."
			</p>
			<p class="mb-4">
				So the question is not whether to use an extension, it is which one, and there are four
				things worth checking before you grant any extension permission to read the pages you visit:
			</p>
			<ol class="mb-4 list-decimal space-y-2 pl-6">
				<li>
					<strong>The last-updated date.</strong> Image handling in Chrome changes. An extension that
					has not shipped in a year is a maintenance risk.
				</li>
				<li>
					<strong>The rating, and the number of ratings.</strong> A high average from six people tells
					you nothing.
				</li>
				<li>
					<strong>The permissions.</strong> Host permissions let an extension read page content on the
					sites they cover, which is what makes fetching the image possible and is also a lot of access.
					Prefer one scoped to the site you are on over one that asks for every site you visit.
				</li>
				<li>
					<strong>The privacy disclosure.</strong> Chrome Web Store requires every listing to post a
					privacy policy, state a single purpose and complete its data-handling disclosures.
					Google's
					<a
						href="https://developer.chrome.com/docs/webstore/program-policies/user-data-faq"
						target="_blank"
						rel="noopener noreferrer">user data policy</a
					> is explicit that "any discrepancies between the developer dashboard disclosures, your privacy
					policy, and the behavior of your item would be a violation." Read the Privacy practices tab,
					not just the description.
				</li>
			</ol>
			<p class="mb-4">
				Those criteria are not academic. We captured the store listing for the WebP extension Google
				ranks on page one for this query on September 21, 2026:
				<strong
					>4,000 users, an average of 1.8 out of 5 from 18 ratings, version 1.2, last updated on
					July 11, 2024.</strong
				> Google is surfacing an app-store listing on an editorial question because the intent genuinely
				includes "something in my right-click menu", and the best thing it has to offer has been rated
				1.8 and untouched for fourteen months.
			</p>
			<p class="mb-4">
				We will be straight with you about our own: the Mochify extension is new. Version 1.3.1
				shipped on September 20, 2026, and its install base is small enough that it has no ratings
				yet. Judge it on the criteria above like anything else.
			</p>
		</section>

		<!-- 06 -->
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>The Mochify workflow: right-click any image</SectionHeading>
			<p class="mb-4">
				The Mochify Chrome extension is a Magic Flow surface. You right-click an image on any page
				and describe the result you want in plain language, rather than hunting for the setting that
				produces it.
			</p>

			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>

			<p class="mt-6 mb-4">
				Under the hood Magic Flow is a two-step pipeline: a language model (currently Mistral Small
				4) parses what you asked for, then our C++ image engine executes it. It is the same Magic
				Flow that runs in the web app, in the CLI with <code>-p</code>, and on both MCP servers, so
				the phrasing you learn in one place works in the others. There is more on how the
				natural-language layer works in our guide to
				<a href="/guides/ai-image-compression-natural-language-2026"
					>natural-language image compression</a
				>.
			</p>

			<GlassInfoBox type="note" title="On privacy, precisely">
				Your image travels to <code>api.mochify.app</code> to be encoded. It is streamed into the
				encoder in memory, wiped immediately afterwards, never written to disk as a source file, and
				never logged with file data in it. That is zero retention, and it is a real guarantee. It is
				also not the same thing as local processing, and you should be suspicious of any browser
				image converter that claims your files never leave your machine while handing you a
				re-encoded result. Video is the one thing we run entirely in your browser, where the bytes
				genuinely never leave the device, and video is web-app only. If the distinction matters to
				your work, we go through it properly in our
				<a href="/guides/privacy-image-optimization">privacy and image optimization guide</a>.
			</GlassInfoBox>
		</section>

		<!-- 07 -->
		<section id="see-it-in-action" class="scroll-mt-24">
			<SectionHeading>See it in action</SectionHeading>
			<p class="mb-4">
				The whole loop takes one right-click and one sentence, which is easier to watch than to read
				about. The recording below runs the job this guide is about: find a WebP on a live page,
				right-click it, ask for a JPG, get the file.
			</p>

			<!-- Silent screen recording, so the text description below the figure
			     carries the content for anyone who cannot watch it. Guides ship
			     csr = false, so this is plain HTML: controls (no autoplay), a
			     poster so nothing loads until the reader asks, and an explicit
			     aspect-ratio box so the page does not shift when it does. -->
			<figure class="my-6">
				<div class="video-frame">
					<video
						class="h-full w-full"
						src="/videos/chrome-extension-webp-to-jpg.mp4"
						poster="/videos/chrome-extension-webp-to-jpg-poster.jpg"
						controls
						muted
						playsinline
						preload="none"
						width="1108"
						height="720"
						aria-label="Screen recording: converting a WebP to JPG from Chrome's right-click menu with the Mochify extension"
					></video>
				</div>
				<figcaption class="mt-3 text-base leading-relaxed text-[#875F42]">
					<strong class="text-[#4A2C2C]">What the recording shows.</strong> A BBC News article with
					a photograph served as WebP. Right-clicking the image opens Chrome's usual menu, with
					<em>Save Image As...</em> near the top and a Mochify entry added below it. Choosing the
					Mochify entry opens a small panel over the page showing the source domain and a prompt
					field. The prompt typed is <em>to jpg maintain high quality</em>. The panel reports
					packing the prompt, then processing, Chrome asks where to save the file, and the panel
					confirms the download. The converted JPG then opens in Preview as an ordinary image.
				</figcaption>
			</figure>

			<p class="mb-4">Measured on that same run:</p>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Source image</th>
							<th>Original (WebP)</th>
							<th>Converted (JPG)</th>
							<th>Size change</th>
							<th>Time to result</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>News photograph, 976 × 549</td>
							<td>64.6 KB</td>
							<td>102.1 KB</td>
							<td>58% larger</td>
							<td>About 10 seconds</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				Two honest notes on that table. Size change between WebP and JPEG depends heavily on what
				the picture is, so a photograph and a flat graphic will not behave the same way, and the row
				above names which one was measured; it also depends on what you ask for, and this run asked
				for high quality, which is most of why the JPEG came back larger than the WebP it replaced.
				That is the normal direction of travel and the reason the next section argues for keeping
				the WebP when you can. And the time is the round trip you actually experience, from
				right-click to file in hand, including typing the prompt and confirming Chrome's save
				dialog, not encoder time.
			</p>
		</section>

		<!-- 08 -->
		<section id="should-you-convert" class="scroll-mt-24">
			<SectionHeading>Should you convert to JPG at all?</SectionHeading>

			<GlassPanel label="The short answer">
				<p>
					Often, no. If whatever you are feeding the image to accepts WebP, keep the WebP: it is the
					smaller file for the same visual quality, and converting costs you that advantage for
					nothing.
				</p>
			</GlassPanel>

			<p class="mt-6 mb-4">
				Convert when the destination forces your hand. The usual list is older desktop software,
				print workflows and prepress, a few marketplace and CMS uploaders that validate on
				extension, and colleagues on machines you do not control. Those are real constraints and
				JPEG is the correct answer to all of them.
			</p>
			<p class="mb-4">Two things to get right when you do convert:</p>
			<ul class="mb-4 list-disc space-y-2 pl-6">
				<li>
					<strong>Convert once, from the best source you have.</strong> Web images are almost always lossy
					WebP, and JPEG is lossy too, so converting runs the picture through a second round of compression
					on top of the first. It is usually invisible at sensible quality settings, but chaining conversions
					is how images end up looking soft and blocky. If you can get the original from the source rather
					than from the page, do that instead.
				</li>
				<li>
					<strong>If the image has transparency, JPEG is the wrong target.</strong> JPEG has no alpha
					channel, so a transparent background becomes solid, typically black or white. Convert to PNG
					instead, or keep the WebP.
				</li>
			</ul>
			<p class="mb-4">
				AVIF is the same story one format along, at 1.7% of sites today and rising, and it lands in
				the same place: you will right-click something, get an <code>.avif</code>, and find fewer
				apps that open it. We cover that case in
				<a href="/guides/avif-to-jpg">what to do when a site hands you an AVIF</a>, and our
				<a href="/avif-to-jpg">free AVIF converter</a>
				handles the file itself. If you are choosing what to standardize on rather than firefighting a
				single file, start with
				<a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl"
					>what to use in 2026: WebP, AVIF or JPEG XL</a
				>
				and our <a href="/guides/2026-guide-next-gen-formats">guide to next-gen formats</a>.
			</p>
		</section>

		<!-- 09 -->
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Route</th>
							<th>What to do</th>
							<th>Best for</th>
							<th>Watch out for</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Copy image</strong></td>
							<td>Right-click > Copy image, paste into any editor, save as JPEG</td>
							<td>One image, zero setup</td>
							<td>Metadata is stripped; you get the image as the page loaded it</td>
						</tr>
						<tr>
							<td><strong>Windows</strong></td>
							<td>Open in Paint > File > Save as > JPEG picture</td>
							<td>One or two files on Windows</td>
							<td>Per-file only</td>
						</tr>
						<tr>
							<td><strong>macOS</strong></td>
							<td>Open in Preview > File > Export > Format: JPEG</td>
							<td>One or two files on Mac</td>
							<td>Per-file only</td>
						</tr>
						<tr>
							<td><strong>Linux / CLI</strong></td>
							<td>GIMP Export As, or <code>magick input.webp output.jpg</code></td>
							<td>Scripted or repeat jobs</td>
							<td>Needs ImageMagick installed</td>
						</tr>
						<tr>
							<td><strong>Chrome extension</strong></td>
							<td>Adds its own item next to Save image as</td>
							<td>Regular right-click conversion</td>
							<td>Check update date, rating, permissions, privacy tab</td>
						</tr>
						<tr>
							<td><strong>Web app</strong></td>
							<td>Drop the files, describe the result</td>
							<td>Batches, resizing, background removal</td>
							<td>Images are encoded on our servers, then wiped</td>
						</tr>
						<tr>
							<td><strong>Renaming .webp to .jpg</strong></td>
							<td>Does not work</td>
							<td>Nothing</td>
							<td>It is still a WebP file with a misleading name</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				<strong>The 30-second version:</strong> the site sent WebP, not Chrome. Renaming does nothing.
				Copy image and paste is the fastest fix for one file. For a folder, use a converter. Keep the
				WebP if the destination accepts it.
			</p>
		</section>

		<!-- 10 FAQ -->
		<GlassFAQs items={faqItems} />

		<GlassCTA
			heading="Working through a folder rather than a single file?"
			href="https://mochify.app"
			label="Open Mochify →"
		>
			Drop them all at <a href="https://mochify.app">mochify.app</a> and say what you need in plain
			English, for example <em>"convert these to JPG at web quality"</em>. Images and PDFs are
			encoded in memory and wiped immediately, with nothing retained.
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

	/* Reserves the recording's 1108x720 box before the poster paints, so the
	   figure does not shift the page as it loads. */
	.video-frame {
		aspect-ratio: 1108 / 720;
		overflow: hidden;
		border-radius: 1.25rem;
		border: 1px solid rgba(240, 98, 146, 0.18);
		background: #f3ece9;
		box-shadow: 0 1px 2px rgba(108, 63, 49, 0.06);
	}

	.video-frame video {
		display: block;
		object-fit: contain;
		background: #f3ece9;
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
