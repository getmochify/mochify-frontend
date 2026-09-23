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
		title: 'Save Image as Type Is Gone: How to Replace It Safely',
		description:
			'Save Image as Type was removed as malware. How to check your browser, vet a replacement, and save any image as JPG, PNG, AVIF, JPEG XL or PDF.',
		category: 'Image Formats',
		readTime: '18 min read',
		date: 'September 23, 2026'
	};

	const toc = [
		{ id: 'what-happened', label: 'What happened to Save Image as Type' },
		{ id: 'check-your-machine', label: "Check whether it's still on your machine" },
		{ id: 'the-name-problem', label: 'Why the name no longer tells you anything' },
		{ id: 'five-checks', label: 'Five checks before you install a replacement' },
		{ id: 'why-three-formats', label: 'Why so many replacements stop at JPG, PNG and WebP' },
		{ id: 'mochify-workflow', label: 'The Mochify workflow: Convert to, or describe it' },
		{ id: 'which-format', label: 'Which format to pick' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Install the extension',
			html: `<p>Get it from the <a href="https://chromewebstore.google.com/detail/pgegchhkcjdcnnppeahkdcalclpaamcj" target="_blank" rel="noopener noreferrer">Chrome Web Store listing</a>.</p>`
		},
		{
			title: 'Right-click any image',
			html: `<p>Hover over the Mochify item and you'll see both options: <strong>Convert to</strong> and <strong>Send to Mochify...</strong></p>`
		},
		{
			title: 'For a straight format change, choose Convert to',
			html: `<p>Pick JPG, WebP, AVIF, JPEG XL, PNG or PDF (PDF gives you a one-page PDF of that image), and the file goes straight to your Downloads folder. Convert to is a direct call to our API with no language model in the loop, so it's the fast path when you know the format you want. JPG comes out of the jpegli encoder, which we explain in our <a href="/guides/jpeg-in-2026-jpegli">guide to JPEG in 2026</a>.</p>`
		},
		{
			title: 'For anything more, choose Send to Mochify',
			html: `<p>A small panel opens over the page, showing where the image came from and a prompt field.</p>`
		},
		{
			title: 'Say what you want in plain language',
			html: `<p>"Make it square, remove the background, convert to AVIF" is one request. So is "resize to 1200px wide, JPG". Asking for "avif, webp, jpg" returns all three files in a zip.</p>`
		},
		{
			title: 'Use anything Magic Flow can do',
			html: `<p>Convert, resize, crop, rotate, remove the background, make the background white, adjust brightness and clarity, strip metadata, and work with HDR all work here. There's no settings panel and no quality slider, because the prompt replaces both. Under the hood, a language model (currently Mistral Small 4) reads your request and our C++ engine carries it out. It's the same Magic Flow as the <a href="/flow">Magic Flow web tool</a>, and our <a href="/guides/ai-image-compression-natural-language-2026">guide to natural-language image compression</a> covers how it interprets prompts.</p>`
		},
		{
			title: "Send results to Google Drive, if you'd rather",
			html: `<p>On Seller, Pro and Growth plans, the Save to Drive toggle sends results to Drive instead of your Downloads folder, for Convert to and prompts alike.</p>`
		},
		{
			title: 'Work one image at a time',
			html: `<p>The extension works on the image you right-clicked. For a folder of files, drop them into the web app at <a href="https://mochify.app">mochify.app</a> and describe the result once.</p>`
		},
		{
			title: 'Know what it costs',
			html: `<p>You get 3 images without an account, then 25 a month with a free account and no card. Every file you get back counts as one image, so the three-format zip above uses three. A $2 Day Pass (100 images within 24 hours) works in the extension too, and the <a href="/pricing">pricing page</a> has the monthly plans.</p>`
		}
	];

	const faqItems = [
		{
			q: 'Is Save Image as Type safe to use now?',
			a: 'The original was removed by Google in March 2026 after it was sold and turned into affiliate-fraud malware, and Chrome disabled installed copies. Extensions now listed under the same name come from different developers, so the name tells you nothing about safety. Judge each one on who publishes it, recent reviews and the access it asks for.'
		},
		{
			q: 'What did the Save Image as Type malware actually do?',
			a: "According to published reports, it inserted hidden frames into pages you visited to route your shopping through affiliate links, taking commissions from more than a thousand merchants. It waited until you had saved at least 10 images before activating. The reports we read don't describe password or cookie theft."
		},
		{
			q: 'Can Chrome save images as PNG or JPG without an extension?',
			a: 'Not with a setting. Chrome saves whatever format the website sent. The no-install workaround is to right-click the image, choose Copy image, paste it into any image editor and save it in the format you want.'
		},
		{
			q: "Why can't most extensions save images as AVIF?",
			a: 'Many convert inside the browser with the canvas element, which is only required to produce PNG, and commonly JPEG and WebP. Encoding AVIF or JPEG XL needs a dedicated encoder, either bundled into the extension or on a server.'
		},
		{
			q: 'Does the Mochify extension convert images on my computer?',
			a: "No. Images travel to Mochify's API to be converted, where they're processed in memory and wiped immediately, with nothing written to disk and no file data logged. That's zero retention rather than local processing."
		},
		{
			q: 'Is the Mochify extension free?',
			a: 'You get 3 images without an account and 25 a month with a free account, no card needed. A $2 Day Pass gives you 100 images within 24 hours, and paid plans raise the monthly allowance. Each file you get back counts as one image.'
		},
		{
			q: 'Is the Mochify Chrome extension open source?',
			a: "Yes. The source is published under the MIT license at github.com/getmochify/mochify-chrome, including the manifest that lists every permission it asks for. It's a Manifest V3 extension with no build step, so what you read in the repository is the code itself."
		},
		{
			q: 'Can I convert every image on a page at once?',
			a: 'Not with the Mochify extension, which works on one image at a time. For a batch, drop the files into the Mochify web app and describe the result once for all of them.'
		}
	];

	const related = [
		{
			title: 'How to Save a WebP as JPG in Chrome: Every Route That Actually Works',
			href: '/guides/save-webp-as-jpg-chrome',
			desc: 'Why the site, not Chrome, picked the format, and every route out of it.'
		},
		{
			title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?',
			href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
			desc: 'Choosing a format to standardize on rather than firefighting one file.'
		},
		{
			title:
				'Do WebP and AVIF Support Transparency? Why Cut-Outs Come Back Black or White (and How to Fix It)',
			href: '/guides/webp-avif-transparency',
			desc: 'What happens to transparent backgrounds when you convert.'
		},
		{
			title: 'How to Convert AVIF to JPG on Windows 11, Mac, or Any Device',
			href: '/guides/avif-to-jpg',
			desc: 'The AVIF version of the same right-click problem.'
		},
		{
			title: 'Privacy & Image Optimization: A Comprehensive Guide (2026)',
			href: '/guides/privacy-image-optimization',
			desc: "What zero retention does and doesn't mean."
		}
	];
</script>

<ReadProgress />

<svelte:head>
	<title>Save Image as Type Alternative - Safe Right-Click Converter | Mochify</title>
	<meta name="description" content={metadata.description} />
	<meta
		name="keywords"
		content="save image as type, save image as type alternative, save image as type malware, save image as type extension, save image as png, chrome extension save image as jpg, right-click image converter"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content="https://mochify.app/guides/save-image-as-type-alternative" />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "Save Image as Type Is Gone: How to Replace It Safely",
			"description": "Save Image as Type was removed as malware. How to check your browser, vet a replacement, and save any image as JPG, PNG, AVIF, JPEG XL or PDF.",
			"url": "https://mochify.app/guides/save-image-as-type-alternative",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://mochify.app/guides/save-image-as-type-alternative"
			},
			"datePublished": "2026-09-23",
			"dateModified": "2026-09-23",
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
				{ "@type": "Thing", "name": "Google Chrome" },
				{ "@type": "Thing", "name": "Browser extensions" },
				{ "@type": "Thing", "name": "Chrome Web Store" },
				{ "@type": "Thing", "name": "Image conversion" },
				{ "@type": "Thing", "name": "Malware" },
				{ "@type": "Thing", "name": "AVIF" },
				{ "@type": "Thing", "name": "JPEG XL" }
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
			Save Image as Type Is Gone: How to Replace It Safely
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			Save Image as Type was the extension a million people used to save a web image as JPG or PNG
			instead of whatever the site served. In March 2026 Google removed it from the Chrome Web Store
			and disabled it in people's browsers, because it had been sold and turned into affiliate-fraud
			malware. If you're looking for a replacement, the name you remember is now a poor guide.
			Several unrelated extensions have taken it, and the right choice depends on who publishes the
			extension and what it asks to access, not what it's called.
		</p>
		<p class="mt-5 mb-0">
			This guide covers what actually happened, how to check whether you're still affected, the
			checks that separate a safe replacement from the next hijack, and why so many right-click
			converters stop at JPG, PNG and WebP. It finishes with the one we built. Our last guide
			explained <a href="/guides/save-webp-as-jpg-chrome"
				>why Chrome hands you a WebP in the first place</a
			>. This is the follow-up for people who do this often enough to want it in the right-click
			menu.
		</p>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<!-- 01 -->
		<section id="what-happened" class="scroll-mt-24">
			<SectionHeading>What happened to Save Image as Type</SectionHeading>
			<p class="mb-4">
				Save Image as Type was a small, useful extension that was sold, had malicious code added,
				and was removed by Google in March 2026. When it came down it had
				<a
					href="https://www.ghacks.net/2026/03/19/chrome-extension-save-image-as-type-was-hijacked-putting-over-1-million-users-at-risk/"
					target="_blank"
					rel="noopener noreferrer">over a million users</a
				>, and for most of them it had done exactly what it said for years: add "Save as PNG", "Save
				as JPG" and "Save as WebP" to the right-click menu on images.
			</p>
			<p class="mb-4">
				The problem was never the image conversion. After the change of ownership, the extension
				started quietly earning money from its users' shopping.
				<a
					href="https://cybernews.com/security/popular-chrome-extension-stealing-affiliate-commissions/"
					target="_blank"
					rel="noopener noreferrer">Cybernews' analysis</a
				> found it inserting hidden frames into pages for 8.5 seconds at a time, routing visits through
				nearly 600 affiliate redirect URLs and taking commissions from more than a thousand merchants.
				It was built not to get caught: it stayed dormant until someone had saved at least 10 images,
				and it avoided running on developer-oriented pages where someone might notice.
			</p>
			<p class="mb-4">
				The buyer wasn't a one-off. Security researcher Wladimir Palant had already documented the
				group involved, which reporting identifies as Karma, and gHacks summarizes the model in one
				line: "Karma often buys existing, trusted extensions from the original developers and then
				adds malicious code after purchase." The listing now reads "this item is not available", and
				Chrome disabled installed copies with a malware warning.
			</p>
			<p class="mb-4">
				Two honest limits on what we know. The reports we read describe affiliate hijacking, and
				none of them describe stolen passwords or cookies, so we won't claim either. They also
				disagree on when the sale happened, so we're not going to give you a date.
			</p>
			<p class="mb-4">
				The lesson is uncomfortable, and it's the reason for this guide:
				<strong>the extension did nothing wrong for years, then changed hands.</strong> A good track record
				didn't protect anyone, because what changed was who owned it.
			</p>
		</section>

		<!-- 02 -->
		<section id="check-your-machine" class="scroll-mt-24">
			<SectionHeading>Check whether it's still on your machine</SectionHeading>
			<p class="mb-4">
				Open <code>chrome://extensions</code> and look for it. If Chrome has already disabled it, it will
				be flagged there with a malware warning, and the right move is still to remove it rather than
				leave a disabled copy sitting in your profile.
			</p>
			<p class="mb-4">
				To remove it, click <strong>Remove</strong> on its card and confirm.
				<a
					href="https://support.google.com/chrome_webstore/answer/2664769"
					target="_blank"
					rel="noopener noreferrer">Google's help page</a
				>
				also documents the shortcut: right-click the extension's icon next to the address bar and choose
				<strong>Remove from Chrome</strong>. If you use Chrome on more than one computer, check each
				of them.
			</p>
			<p class="mb-4">
				While you're on that page, it's worth looking at everything else you have installed. The
				Save Image as Type story is a good prompt to remove the extensions you installed once and
				forgot about.
			</p>
		</section>

		<!-- 03 -->
		<section id="the-name-problem" class="scroll-mt-24">
			<SectionHeading>Why the name no longer tells you anything</SectionHeading>
			<p class="mb-4">
				Search for "save image as type" today and the name leads you to several different
				extensions. When we captured the results on September 23, 2026, the day we published this
				guide, the top three Google results were three separate Chrome Web Store listings using the
				same name. Each had its own description, and one was updated as recently as September 11.
				Below them were a standalone website with that name, two Firefox add-ons and a GitHub fork.
				Google's AI Overview on the same page still recommends "the Save image as Type browser
				extension" as if there were exactly one.
			</p>
			<p class="mb-4">
				We haven't audited those listings and we're not going to name a winner among them. Some may
				be well-built replacements from honest developers. The point is simpler: a familiar name is
				exactly what someone buying extensions to exploit would want to trade on, so the name
				carries no trust at all. Judge every one of them, ours included, on the checks below.
			</p>
		</section>

		<!-- 04 -->
		<section id="five-checks" class="scroll-mt-24">
			<SectionHeading>Five checks before you install a replacement</SectionHeading>
			<p class="mb-4">
				A right-click image converter needs a lot of access to do its job, so be deliberate about
				which one you trust. In our previous guide we listed four checks for
				<a href="/guides/save-webp-as-jpg-chrome#route-3-right-click-menu"
					>choosing any right-click image extension</a
				>: the last-updated date, the rating and how many people gave it, the permissions, and the
				privacy disclosure. They all still apply. Save Image as Type adds two more, and puts a
				different one first.
			</p>
			<ol class="mb-4 ml-6 list-decimal space-y-3">
				<li>
					<strong>Who publishes it, and can you read the code?</strong> Look at the developer name and
					website on the listing, and whether the source is published. An extension that is part of a
					company's product, with a support address and a business behind it, is a very different thing
					from a hobby project with a Gmail contact. A hobby project isn't dishonest, but it can be sold,
					and the buyer inherits every user's trust overnight. Public source code doesn't prove the build
					in the store matches it, but it puts the code in front of anyone who wants to check, which is
					where an injected script gets noticed.
				</li>
				<li>
					<strong>The last-updated date.</strong> Out-of-date extensions are a maintenance risk, and a
					sudden update to an extension that had been quiet for years deserves a second look.
				</li>
				<li>
					<strong>The ratings, read recently.</strong> Sort reviews by newest. Users often notice odd
					behavior before the store does.
				</li>
				<li>
					<strong>The permissions and the privacy disclosure.</strong> Read the Privacy practices
					tab as well as the description. Chrome's own description of the broadest one is blunt:
					access to your data on all websites lets an extension
					<a
						href="https://support.google.com/chrome_webstore/answer/186213"
						target="_blank"
						rel="noopener noreferrer">"read, request or modify data from every page you visit"</a
					>. A right-click image tool needs to fetch images from the pages you use it on, so it will
					usually ask for broad access. That makes the next step worth doing.
				</li>
				<li>
					<strong>Limit where it runs.</strong> Chrome lets you narrow what an installed extension
					can reach: open its <strong>Details</strong>, find "Allow this extension to read and
					change all your data on websites you visit", and choose
					<strong>When you select the extension</strong>. Some extensions break with this setting,
					so try it before relying on it. Where it works, the extension only touches the pages you
					ask it to.
				</li>
			</ol>
			<p class="mb-4">
				None of these checks would have caught Save Image as Type on the day it was bought. Together
				they reduce how much any extension can do if it goes bad, and they're how you'd notice
				sooner.
			</p>
		</section>

		<!-- 05 -->
		<section id="why-three-formats" class="scroll-mt-24">
			<SectionHeading>Why so many replacements stop at JPG, PNG and WebP</SectionHeading>
			<p class="mb-4">
				Many right-click converters work inside your browser using the canvas element, and the
				formats a canvas can produce are limited.
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob"
					target="_blank"
					rel="noopener noreferrer">MDN's reference for <code>canvas.toBlob()</code></a
				>
				is precise about it: "Browsers are required to support <code>image/png</code>; many will
				support additional formats including <code>image/jpeg</code> and
				<code>image/webp</code>." That's why so many listings read "save it as JPEG, PNG, or WebP":
				it's the list the browser hands them.
			</p>
			<p class="mb-4">
				There's a trap hidden in the same page. If you ask for a format the browser can't encode,
				you don't get an error: "The default type is <code>image/png</code>; that type is also used
				if the given type isn't supported." An extension that offers more formats than the canvas
				can produce either includes its own encoder or quietly gives you a PNG with the wrong file
				extension. That's the
				<a href="/guides/save-webp-as-jpg-chrome#the-rename-trap">rename trap from our last guide</a
				>, done automatically.
			</p>
			<p class="mb-4">
				Local conversion has a real advantage: the image never leaves your machine. It also has a
				ceiling. For AVIF, JPEG XL or PDF output, and for anything beyond a straight format change
				such as resizing, cropping, rotating or background removal, you need an actual encoder and
				image engine. You either install one or send the image to one.
			</p>
			<p class="mb-4">
				We send it to one, and we're precise about what that means below. That's the trade: a much
				wider set of outputs, and one round trip to our API, in exchange for local-only processing.
			</p>
		</section>

		<!-- 06 -->
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>The Mochify workflow: Convert to, or describe it</SectionHeading>
			<p class="mb-4">
				The Mochify extension puts two things in the right-click menu on every image:
				<strong>Convert to</strong>, for a one-click format change, and
				<strong>Send to Mochify...</strong>, for anything you'd rather describe than click through.
				Both run through the same engine as our web app, CLI, API and MCP server.
			</p>

			<GlassInfoBox type="note" title="Our answers to the five checks">
				The extension is new, with a handful of users and no ratings yet, so put it through the five
				checks above like anything else. It's published by the company that runs mochify.app, and
				the support address on the listing is ours. <strong>The source is public</strong> under the
				MIT license at
				<a
					href="https://github.com/getmochify/mochify-chrome"
					target="_blank"
					rel="noopener noreferrer">github.com/getmochify/mochify-chrome</a
				>, including the manifest that declares its permissions. It asks for access to all sites,
				because fetching the image you right-clicked has to work on any page, plus our own API (<code
					>api.mochify.app</code
				>) and account service (<code>id.mochify.app</code>, which reads your prompt and checks your
				usage). You don't have to take our word for what it does with that access. You can read it.
			</GlassInfoBox>

			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>

			<GlassInfoBox type="note" title="On privacy, precisely">
				Your image travels to <code>api.mochify.app</code> to be converted. It's streamed into the
				encoder in memory, wiped as soon as it's done, never written to disk as a source file and
				never logged with file data in it. That's zero retention, and it's a real guarantee. It
				isn't local processing, and any converter that offers AVIF or background removal while
				claiming the image never leaves your machine is worth a second look. (Video is the one
				format we process entirely in your browser, in the web app, where the bytes genuinely never
				leave the device.) Our
				<a href="/guides/privacy-image-optimization">privacy and image optimization guide</a> goes deeper.
			</GlassInfoBox>
		</section>

		<!-- 07 -->
		<section id="which-format" class="scroll-mt-24">
			<SectionHeading>Which format to pick</SectionHeading>
			<p class="mb-4">
				Pick for where the image is going next, not for which format is newest. The short version is
				JPG for compatibility, PNG for editing or transparency, and WebP or AVIF for putting it back
				on the web.
			</p>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Format</th>
							<th>Pick it when</th>
							<th>Watch out for</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>JPG</strong></td>
							<td>
								The destination is older software, a document, print, or an uploader that only takes
								JPEG
							</td>
							<td>No transparency: a transparent background turns solid</td>
						</tr>
						<tr>
							<td><strong>PNG</strong></td>
							<td>You'll edit the image further, or it has transparency, text or sharp edges</td>
							<td>Large files for photographs</td>
						</tr>
						<tr>
							<td><strong>WebP</strong></td>
							<td>You're putting it back on a website</td>
							<td>Some desktop apps still won't open it</td>
						</tr>
						<tr>
							<td><strong>AVIF</strong></td>
							<td>
								You want the smallest file for the web;
								<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer"
									>caniuse</a
								> puts support at 95.36% of global browser traffic
							</td>
							<td>Slower to encode, and some editors still can't open it</td>
						</tr>
						<tr>
							<td><strong>JPEG XL</strong></td>
							<td>
								You're testing or archiving, and want transparency support in a modern format
							</td>
							<td>
								<a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer"
									>caniuse</a
								> shows 0% full default support and 14.63% partial (Safari), so it's not a web format
								yet
							</td>
						</tr>
						<tr>
							<td><strong>PDF</strong></td>
							<td>
								The image is going into a document workflow, a form or an email to someone who asked
								for PDF
							</td>
							<td>One image per PDF from the extension</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				Two habits worth keeping. First, <strong>convert once, from the best source</strong>: a web
				image is usually already lossy, and converting it to another lossy format compresses it a
				second time, so if you'll edit it, go to PNG. Second,
				<strong>match the transparency</strong>: if the image has a transparent background, choose
				PNG, WebP, AVIF or JPEG XL, never JPG. Our
				<a href="/guides/webp-avif-transparency">WebP and AVIF transparency guide</a> explains why,
				and
				<a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl">WebP vs AVIF vs JPEG XL</a> covers
				choosing one to standardize on.
			</p>
			<p class="mb-4">
				If what you already have is a downloaded AVIF that won't open, our
				<a href="/avif-to-jpg">free AVIF to JPG converter</a> handles the file directly.
			</p>
		</section>

		<!-- 08 -->
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>You want to...</th>
							<th>Do this</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Check if Save Image as Type is still installed</td>
							<td><code>chrome://extensions</code>, find it, Remove</td>
						</tr>
						<tr>
							<td>Vet any replacement</td>
							<td>
								Publisher, update date, newest reviews, permissions, then set site access to "When
								you select the extension"
							</td>
						</tr>
						<tr>
							<td>Save one image as JPG, PNG or WebP with nothing installed</td>
							<td>
								Right-click &gt; Copy image, paste into an editor, save (<a
									href="/guides/save-webp-as-jpg-chrome#route-1-copy-paste-save">how</a
								>)
							</td>
						</tr>
						<tr>
							<td>Save as AVIF, JPEG XL or PDF from the right-click menu</td>
							<td>Mochify &gt; Convert to &gt; pick the format</td>
						</tr>
						<tr>
							<td>Crop, resize, remove the background and convert in one go</td>
							<td>Mochify &gt; Send to Mochify... &gt; describe it</td>
						</tr>
						<tr>
							<td>Get several formats at once</td>
							<td>Prompt "avif, webp, jpg" and you get a zip, one image per file</td>
						</tr>
						<tr>
							<td>Convert a whole folder</td>
							<td>Drop the files at mochify.app and prompt once</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				<strong>The 30-second version:</strong> Save Image as Type was sold and became malware; remove
				it. The name now belongs to several unrelated extensions, so judge replacements by who publishes
				them and what they can access. Canvas-based converters top out at JPG, PNG and WebP. For more
				formats or real edits, you need an encoder, and ours runs in memory with zero retention.
			</p>
		</section>

		<!-- 09 FAQ -->
		<GlassFAQs items={faqItems} />

		<GlassCTA
			heading="Got an image in the wrong format right now?"
			href="https://mochify.app"
			label="Open Mochify →"
		>
			Right-click it, choose Mochify, then Convert to. For a whole folder, drop the files at
			<a href="https://mochify.app">mochify.app</a> and say what you need, for example
			<em>"convert these to JPG and make the background white"</em>. Images are processed in memory
			and wiped immediately, with nothing retained.
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
