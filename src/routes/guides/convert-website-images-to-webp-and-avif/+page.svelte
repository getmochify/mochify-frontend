<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
	import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';

	// Built from content-ops `article-originals/convert-website-images-to-webp-and-avif.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract.
	const metadata = {
		title: "Convert a Website's Images to WebP and AVIF, and Keep Them That Way",
		seoTitle: 'Convert Website Images to WebP and AVIF (and Automate It)',
		description:
			'Convert every image on your site to WebP and AVIF, then keep new ones converted: one command for the batch, a script for new files, serving, and WordPress.',
		category: 'Web Performance',
		readTime: '34 min read',
		date: 'October 14, 2026',
		lastUpdated: 'October 15, 2026',
		bylineNote:
			'Written for the site whose image step rotted: the one-off conversion, the twelve-line script that keeps it converted, and the markup that serves it, with tool status dated October 2026.'
	};

	const keywords =
		'convert images to webp, convert images to avif, convert images to webp in bulk, jpg to webp bulk, convert images to webp wordpress, convert images to webp mac, convert images to webp windows, convert images to webp without losing quality, automate image conversion to webp, squoosh cli, webp to avif';

	const pageUrl = 'https://mochify.app/guides/convert-website-images-to-webp-and-avif';

	const toc = [
		{ id: 'six-words', label: 'Six words this guide uses' },
		{ id: 'why-it-broke', label: 'Why your last image pipeline broke' },
		{
			id: 'three-places',
			label: 'The three places conversion can live, and when you need none of them'
		},
		{
			id: 'convert-once',
			label: 'Convert images to AVIF and WebP in bulk, once: the native toolkit and its five traps'
		},
		{
			id: 'mochify-workflow',
			label:
				'Mochify Workflow: convert a whole site to WebP and AVIF in one command, on any machine'
		},
		{
			id: 'keep-converted',
			label: 'Keep them converted: automate it with a script that only converts new images'
		},
		{ id: 'serve', label: 'Serve them: the picture tag, or a CDN that negotiates for you' },
		{ id: 'wordpress', label: 'WordPress, in one honest paragraph' },
		{ id: 'quality', label: 'Quality, size and metadata: what the defaults do' },
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const convertOneCode = 'cwebp -q 80 lobby.jpg -o lobby.webp\navifenc -q 75 lobby.jpg lobby.avif';

	const tutorialLoopCode = 'for f in *.jpg; do\n  cwebp -q 80 "$f" -o "${f%.jpg}.webp"\ndone';

	const convertWebpCode =
		'find ./images -type f \\( -iname \'*.jpg\' -o -iname \'*.jpeg\' \\) | while read -r src; do\n  [ -f "${src%.*}.webp" ] || cwebp -q 80 "$src" -o "${src%.*}.webp"\ndone';

	const convertSiteCode =
		"brew install mochify              # Windows: add the Scoop bucket, then scoop install mochify\nmochify auth login                # opens your browser once; credentials are saved locally\nfind ./images -type f \\( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \\) | mochify -t avif\nfind ./images -type f \\( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \\) | mochify -t webp";

	const deployStepCode =
		'curl -X POST "https://api.mochify.app/v1/squish?type=avif" \\\n  -H "Content-Type: image/jpeg" \\\n  -H "Authorization: Bearer mchy_your_api_key" \\\n  --data-binary @images/2025/lobby.jpg --output images/2025/lobby.avif';

	const convertNewCode =
		'#!/bin/bash\n# convert-new.sh: make an AVIF and a WebP beside every JPEG or PNG that does not have them yet\nset -e\nlist=$(mktemp)\nfor fmt in avif webp; do\n  find ./images -type f \\( -iname \'*.jpg\' -o -iname \'*.jpeg\' -o -iname \'*.png\' \\) \\\n    | while read -r src; do [ -f "${src%.*}.$fmt" ] || echo "$src"; done > "$list"\n  if [ -s "$list" ]; then\n    echo "$(wc -l < "$list") file(s) need a .$fmt"\n    cat "$list" | mochify -t "$fmt"\n  else\n    echo "nothing new for .$fmt"\n  fi\ndone\nrm -f "$list"';

	const outputCode = '3 file(s) need a .avif\n3 file(s) need a .webp';

	const lobbyCode =
		'<picture>\n  <source srcset="images/2025/lobby.avif" type="image/avif">\n  <source srcset="images/2025/lobby.webp" type="image/webp">\n  <img src="images/2025/lobby.jpg" alt="The studio\'s lobby at dusk"\n       width="1600" height="1067" loading="lazy" decoding="async">\n</picture>';

	const faqItems = [
		{
			q: 'What about images I upload after converting everything?',
			a: 'They arrive as JPEG or PNG and undo the fix unless something converts them, so the conversion has to live somewhere that runs again: a script that converts only unconverted files (the <code>convert-new.sh</code> in this guide), an upload hook in your CMS, or a CDN that converts on the way out. Run the script before each deploy and every new image gets its WebP and AVIF twins; run it with nothing new and it sends nothing.'
		},
		{
			q: 'Can I convert only the new images instead of the whole folder every time?',
			a: 'Yes. Test for the output file before converting: <code>[ -f "${src%.*}.avif" ] || echo "$src"</code> lists only the sources with no AVIF beside them, and piping that list into <code>mochify -t avif</code> converts just those. For sources that get edited in place, test <code>-nt</code> (newer than) instead, so a changed JPEG is reconverted and an unchanged one is skipped.'
		},
		{
			q: 'Why did my imagemin or Squoosh CLI step stop working?',
			a: 'Because both depend on native code or on a package that is no longer maintained. The <code>@squoosh/cli</code> package carries "Project no longer maintained" on npm and was last published on January 3, 2023; imagemin\'s format plugins compile or download native encoders for each machine, which is where "install the libjpeg development package" errors come from. A pipeline that holds uses a converter with no compile step and a script short enough to read.'
		},
		{
			q: 'Do I still need to keep the JPEG or PNG?',
			a: "Yes. In caniuse's September 2026 data about 3 in 100 visitors use a browser that opens neither WebP nor AVIF, and Google asks for a fallback <code>&lt;img src&gt;</code> because some crawlers do not understand <code>&lt;picture&gt;</code>. The JPEG is the file you already had; keeping it beside its twins costs nothing. For images with transparency, the fallback is the PNG."
		},
		{
			q: 'Does this work on Windows?',
			a: 'Yes. The <code>mochify</code> command installs on Windows through Scoop (add the <code>mochify</code> bucket from the README, then <code>scoop install mochify</code>) and the single-file commands are the same. The <code>find</code> loop and the <code>convert-new.sh</code> script are Bash, so on Windows run them in WSL or Git Bash; or skip the script and use the web app at mochify.app/flow, which needs nothing installed.'
		},
		{
			q: 'Is there a WordPress way to do this without a plugin?',
			a: 'Not for uploads: WordPress core stores and serves uploads in the format they arrived in, and the "WebP by default" change was reverted before 6.1 shipped. The WordPress project\'s own Modern Image Formats plugin converts new uploads to AVIF (or WebP where the server cannot make AVIF). Theme and template images are files in a folder, and the script in this guide handles those the same way as on any other site.'
		},
		{
			q: 'Can it convert SVG files to WebP and AVIF?',
			a: 'Yes. Mochify accepts SVG as input on every surface and draws it at the size you ask for before encoding, so an SVG logo gets a WebP and an AVIF twin like any other image, transparency included. The command-line WebP encoder cannot read SVG, which is the usual reason the SVGs get left out of a batch.'
		},
		{
			q: 'What is the Lighthouse "next-gen formats" audit called now?',
			a: '"Serve images in modern formats". Since Lighthouse 13 it sits inside the "Improve image delivery" insight rather than as a separate line, it names AVIF and WebP, and it tells you to keep a PNG or JPEG fallback for older browsers. Older tutorials and some tools still say "next-gen formats"; it is the same check.'
		}
	];

	// Figures from the quality section's own October 14, 2026 run; the chart
	// restates them, it does not add any.
	const sizeRuns = [
		{
			name: 'Photograph',
			detail: '512 × 512',
			sourceType: 'JPEG q85',
			source: 53962,
			webp: 22398,
			avif: 22267
		},
		{
			name: 'Photograph',
			detail: '600 × 400',
			sourceType: 'JPEG',
			source: 56809,
			webp: 25988,
			avif: 26915
		},
		{
			name: 'UI screenshot',
			detail: '1440 × 900',
			sourceType: 'PNG',
			source: 70348,
			webp: 45430,
			avif: 29956
		}
	];

	// Validated with the dataviz palette checks (CVD, chroma, contrast on white).
	/** @type {{ key: 'source' | 'webp' | 'avif', label: string, color: string }[]} */
	const sizeSeries = [
		{ key: 'source', label: 'Original (JPEG or PNG)', color: '#C08A2E' },
		{ key: 'webp', label: 'WebP', color: '#3F7FD6' },
		{ key: 'avif', label: 'AVIF', color: '#D81B60' }
	];

	const sizeMax = Math.max(...sizeRuns.map((r) => r.source));

	/** @param {number} n */
	const fmt = (n) => n.toLocaleString('en-US');

	const related = [
		{
			title:
				'The HTML `<picture>` Tag (Picture Element): Format Fallbacks, Art Direction and the 2026 Source Order',
			href: '/guides/html-picture-tag',
			desc: 'the markup that serves the files this guide makes, the four rules that make it render, and how to see which file loaded.'
		},
		{
			title: 'Image Compression Inside Claude Code: The Mochify CLI + MCP Guide',
			href: '/guides/image-compression-claude-code-cli-mcp',
			desc: 'the same CLI and local MCP server set up inside a coding agent.'
		},
		{
			title: 'Fix "Next-Gen Formats" in WordPress (No Plugins)',
			href: '/guides/next-gen-image-formats-wordpress',
			desc: 'the WordPress route in full.'
		},
		{
			title: 'What Automatic Image Optimization Actually Does (and When to Take Control)',
			href: '/guides/what-automatic-image-optimization-actually-does',
			desc: "what a platform's built-in optimizer does to your images, and when to take over."
		},
		{
			title: 'Lossless Image Formats: Which One to Use, and When Lossless Is the Wrong Choice',
			href: '/guides/lossless-image-formats',
			desc: 'the lossy-or-lossless decision for logos, screenshots and diagrams.'
		}
	];

	const organization = { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' };

	const articleLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: metadata.title,
		description: metadata.description,
		url: pageUrl,
		mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
		datePublished: '2026-10-14',
		dateModified: '2026-10-15',
		inLanguage: 'en',
		author: {
			'@type': 'Organization',
			name: 'Mochify Engineering Team',
			url: 'https://mochify.app'
		},
		publisher: {
			...organization,
			logo: { '@type': 'ImageObject', url: 'https://mochify.app/logo.png' },
			sameAs: ['https://github.com/getmochify']
		},
		isPartOf: { '@type': 'WebSite', name: 'Mochify', url: 'https://mochify.app' },
		about: [
			'WebP',
			'AVIF',
			'image conversion',
			'build pipelines',
			'Mochify CLI',
			'Lighthouse',
			'WordPress',
			'picture element'
		].map((name) => ({ '@type': 'Thing', name })),
		keywords,
		speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.article-intro', 'h1'] }
	};

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app/' },
			{ '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://mochify.app/guides' },
			{ '@type': 'ListItem', position: 3, name: metadata.title, item: pageUrl }
		]
	};

	const webPageLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: metadata.title,
		url: pageUrl,
		description: metadata.description,
		isPartOf: { '@type': 'WebSite', name: 'Mochify', url: 'https://mochify.app' },
		datePublished: '2026-10-14',
		dateModified: '2026-10-15'
	};

	/** @param {object} data */
	const ld = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
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

	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(articleLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(breadcrumbLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(webPageLd)}<\/script>`}
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
			<AccentTitle title={metadata.title} accent="WebP and AVIF" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			To convert images to WebP and AVIF for a whole website you need two things, and almost every
			tool, tutorial and plugin gives you only the first: a way to convert the images you have, and
			a way to convert the images that arrive next week without anyone remembering to. This guide
			gives you both. The first is one command that runs the same on a Mac, a Windows PC and a Linux
			server, with nothing to compile. The second is a twelve-line script that converts only the
			files that do not have a <code>.webp</code> and <code>.avif</code> beside them yet, so it can run
			every day, in a build, or from an AI coding agent, and cost nothing when there is nothing new.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			If you are here because a speed test said "Serve images in modern formats" (Lighthouse and
			PageSpeed Insights; older reports said "next-gen formats"), you have met the symptom. If you
			are here because the thing that used to fix it stopped working, you have met the real problem.
			The usual story goes like this: an <code>npm install</code> that used to work now ends with
			"Please install the libjpeg development package before building"; a build step prints "Images
			Optimized" and the output folder is empty; the Squoosh command-line tool you installed in 2022
			now answers <code>RuntimeError: abort(Error: ENOENT</code> and, it turns out, has carried "Project
			no longer maintained" on its npm page since January 2023; or a WordPress plugin with half a million
			installs converted everything and now "Images cannot be displayed after conversion", even after
			disabling it. Every one of those is a real thread from the last two years. The platform defaults
			did not help because there are no defaults: WordPress core stores and serves uploads in the format
			they arrived in, static-site hosts serve whatever is in the folder, and a CDN negotiates formats
			only if you pay for the feature and switch it on. Images are one of the few parts of page speed
			you can take control of yourself, and this particular piece of control is not a chore once the conversion
			lives somewhere that does not rot.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			This guide is for the person who owns the site, whether or not they write code: a front-end
			developer, a designer who maintains a portfolio, a small agency, a shop owner on a static
			builder. It opens with why pipelines like the one above break, so that the one you build next
			does not. Then it gives you the one-off conversion, the script that keeps it converted, the
			one line of markup that serves the new files, and one honest paragraph on WordPress. If you
			have never opened a terminal, start with the six words below and read the worked examples; the
			commands are short, and each one is explained.
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

		<section id="six-words" class="scroll-mt-24">
			<SectionHeading>Six words this guide uses</SectionHeading>
			<p class="mb-4">Everything below assumes only these terms:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Format</strong>: the kind of file an image is saved as. JPEG and PNG are the old
						universal ones. WebP (2010) and AVIF (2019) store the same picture in a much smaller
						file, which is why speed tests ask for them. In caniuse's September 2026 data, 97.18% of
						people browse with something that opens WebP and 96.35% with something that opens AVIF (<a
							href="https://caniuse.com/webp"
							target="_blank"
							rel="noopener noreferrer">caniuse.com/webp</a
						>,
						<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer"
							>caniuse.com/avif</a
						>).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Convert</strong>: make a WebP or AVIF file from a JPEG or PNG. The original
						stays where it is; the new file sits beside it. Converting is also compressing: a 54 KB
						<code>lobby.jpg</code>
						becomes a <code>lobby.avif</code> of about 22 KB with nothing else changed (the figures
						are from our own run in the <a href="#quality">quality section</a>).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Lossy and lossless</strong>: a lossy encode throws away detail the eye does not
						notice to make the file small; a lossless encode keeps every pixel exactly and makes a
						bigger file. Photographs want lossy. Logos, diagrams and screenshots sometimes want
						lossless.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Fallback</strong>: the file a browser gets when it cannot open the new format.
						For a site that is the JPEG or PNG you already have, which is why you keep it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The terminal</strong>: the text window where you type commands (Terminal on a
						Mac, PowerShell or Windows Terminal on Windows, any shell on Linux). Three of the
						examples in this guide are typed there. None is longer than one line, and each is
						explained.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Pipeline</strong>: whatever makes the conversion happen without you doing it by
						hand: a step in a build, a script that runs on a schedule, a plugin that watches
						uploads, a CDN that converts on the way out. The pipeline is the second half of the
						problem, and the half nothing on page one of Google answers.
					</p>
				</li>
			</ul>
		</section>
		<section id="why-it-broke" class="scroll-mt-24">
			<SectionHeading>Why your last image pipeline broke</SectionHeading>
			<p class="mb-4">
				Most image pipelines break for one of four reasons, and usually two at once: they depended
				on native code compiled on one particular machine, they depended on a package nobody
				maintains anymore, only one person understood them, and they converted the library once with
				no idea what to do about the next upload. Knowing which of those hit you is what tells you
				what to build instead.
			</p>
			<p class="mb-4">
				Here is the version we hear most often, told as one site. A studio builds a portfolio site
				in 2023: 400 JPEGs in <code>/images</code>, a static generator, and a build step that runs
				<code>imagemin</code>
				with the WebP plugin so every JPEG gets a <code>.webp</code> twin. It works. Eighteen months
				later a developer gets a new laptop, runs <code>npm install</code>, and the install fails
				inside the WebP plugin with a message about a missing libjpeg development package, because
				that plugin downloads or compiles a native encoder for the machine it is on. The build is
				red. The quickest fix is to comment the step out "for now". The site still deploys, the old
				<code>.webp</code> files are still there, and nobody notices that the 60 photographs added since
				then ship as 2 MB JPEGs, until a client runs PageSpeed Insights before a pitch and the modern-formats
				warning is back. By then the person who set the step up has left, the plugin's issue tracker has
				an open "Console shows 'Images Optimized', but there are no images in output folder" that nobody
				has answered, and the obvious replacement, Squoosh's command-line tool, turns out to have been
				abandoned.
			</p>
			<p class="mb-4">
				That last point deserves its own line, because "squoosh cli" is still what people search
				for. The <code>@squoosh/cli</code> package on npm opens with "Project no longer maintained";
				its last release, 0.7.3, was published on January 3, 2023 (<a
					href="https://www.npmjs.com/package/@squoosh/cli"
					target="_blank"
					rel="noopener noreferrer">npmjs.com/package/@squoosh/cli</a
				>). The web app at squoosh.app is still supported, but it converts one image at a time in a
				browser tab, which is no use for 400 of them. <code>imagemin</code> itself is still
				published (9.0.1, March 2025), but the format plugins that do the work are separate packages
				with their own native dependencies, and that is where the install failures live.
				<code>sharp</code>, the Node library most build tools use underneath, is well maintained
				(0.35.5 shipped on September 27, 2026) and says that "most modern macOS, Windows and Linux
				systems do not require any additional install or runtime dependencies" (<a
					href="https://sharp.pixelplumbing.com/"
					target="_blank"
					rel="noopener noreferrer">sharp.pixelplumbing.com</a
				>). It is also honest about the rest of the sentence: its install page is a list of the ways
				a native binary can fail, from Node version floors to lockfiles shared across operating
				systems to a C++ toolchain for source builds. None of that is sharp's fault. It is what
				native code costs.
			</p>
			<p class="mb-4">
				The WordPress version of the story is shorter. A converter plugin rewrites every upload and
				adds rules to the web server so that a request for <code>photo.jpg</code> quietly receives
				<code>photo.jpg.webp</code>. It works until the site moves host, the rewrite rules do not
				come along, and every converted image is now a broken image. That is the "cannot be
				displayed after conversion" thread, and it is why this guide treats "where does the
				conversion live" as the first design decision rather than the last.
			</p>
			<p class="mb-4">
				The common thread is not that these tools were bad. It is that the conversion was welded to
				one machine, one package or one host, and when any of those changed, the pipeline died
				silently while the site kept publishing. A pipeline that holds has three properties: it has
				no native dependency to compile, it can tell the difference between a converted image and an
				unconverted one, and it is short enough that the next person can read it in a minute. The
				rest of this guide builds that.
			</p>
		</section>
		<section id="three-places" class="scroll-mt-24">
			<SectionHeading
				>The three places conversion can live, and when you need none of them</SectionHeading
			>
			<p class="mb-4">
				Conversion can happen in a build step, at upload time, or on the way out through a CDN; each
				has one way of failing, and if your framework or CDN already does it for you, you can skip
				this guide's scripts and only check that the output is right.
			</p>
			<figure class="mb-6">
				<picture>
					<source
						srcset="/guides/convert-website-images-to-webp-and-avif/three-places.avif"
						type="image/avif"
					/>
					<source
						srcset="/guides/convert-website-images-to-webp-and-avif/three-places.webp"
						type="image/webp"
					/>
					<img
						src="/guides/convert-website-images-to-webp-and-avif/three-places.jpg"
						alt="Diagram of the path from a JPEG source file to the browser, with three places conversion can happen. A build step converts when the site is built, and fails when the install on the build machine breaks and the step gets commented out. An upload hook converts at upload time, and belongs to the platform, so it travels badly between hosts. A CDN converts on every request at the edge, and costs money, while the markup still says .jpg, so leaving the CDN loses the formats. Next.js, Astro and Eleventy already do it for the files they handle."
						width="1600"
						height="800"
						loading="lazy"
						decoding="async"
						class="h-auto w-full rounded-2xl border border-pink-100"
					/>
				</picture>
			</figure>
			<p class="mb-4">
				<strong>A build step.</strong> Images are converted when the site is built or deployed. This is
				the right place for a static site and for most hand-authored HTML, because the converted files
				end up in the same folder as the originals and get deployed with them. Its failure mode is the
				one above: the step depends on something installed on the build machine. The fix is a converter
				that is a plain binary with no compile step, and a script that only converts what is new, so a
				build never spends ten minutes reconverting 400 files it already did.
			</p>
			<p class="mb-4">
				<strong>An upload hook.</strong> Images are converted the moment they enter the CMS. This is
				how WordPress plugins and most hosted builders do it, and it is the right place when
				non-technical people add images through an admin screen. Its failure mode is that the hook
				belongs to the platform: it converts new uploads only, it runs with whatever image library
				the host installed, and it travels badly between hosts. The
				<a href="#wordpress">WordPress paragraph</a> covers what core does and does not do here.
			</p>
			<p class="mb-4">
				<strong>A CDN that negotiates.</strong> The originals stay as JPEG and the CDN converts each
				request on the way out, choosing the format from the browser's <code>Accept</code> header,
				which is the line every browser sends saying which formats it can open. Cloudflare Polish
				does this for WebP only, "served only when the <code>Accept</code> header from the browser
				includes WebP", and it is not available on Cloudflare's free plan; Cloudflare Images
				<code>format=auto</code>
				and Fastly Image Optimizer <code>auto=avif</code> do it for AVIF as well (<a
					href="https://developers.cloudflare.com/images/polish/compression/"
					target="_blank"
					rel="noopener noreferrer">Cloudflare Polish docs</a
				>). This is the right place for a large site with many editors, because nothing about the
				repository or the CMS changes. Its failure modes are cost, a free-tier line you may be on
				the wrong side of, and the fact that your markup still says <code>.jpg</code>, so the moment
				the site leaves that CDN the modern formats leave with it.
			</p>
			<p class="mb-4">
				<strong>When you need none of this.</strong> If your site is built with Next.js and uses its
				<code>&lt;Image&gt;</code>
				component, the framework already negotiates by <code>Accept</code> header; its default
				<code>formats</code>
				is <code>['image/webp']</code>, and setting it to <code>['image/avif', 'image/webp']</code>
				turns AVIF on, with WebP as the fallback (<a
					href="https://nextjs.org/docs/app/api-reference/components/image"
					target="_blank"
					rel="noopener noreferrer">Next.js image docs</a
				>). Astro's <code>&lt;Picture /&gt;</code> and Eleventy's image plugin generate the
				converted files and the markup for you, with sharp underneath, and let you name AVIF and
				WebP as the formats. If you are on one of those, the ongoing problem is solved for every
				image the framework handles, and the only thing to check is the
				<a href="#serve">serving section</a>. If your whole site has twenty images, you also need
				none of this: convert them once in the <a href="#mochify-workflow">web app</a>, paste the
				markup, and come back when you add the twenty-first.
			</p>
			<p class="mb-4">
				Everyone else, which is most hand-built sites, most static builders, and every site where
				"the pipeline" is a person, continues.
			</p>
		</section>
		<section id="convert-once" class="scroll-mt-24">
			<SectionHeading
				>Convert images to AVIF and WebP in bulk, once: the native toolkit and its five traps</SectionHeading
			>
			<p class="mb-4">
				You can convert a folder of images to WebP and AVIF with free command-line encoders in one
				loop each; the loops people copy from tutorials have five specific bugs, and you should know
				them even if you then use the one-command route in the next section, because the ongoing
				script inherits the same shape.
			</p>
			<p class="mb-4">
				The encoders are <code>cwebp</code>, which "compresses an image using the WebP format" and
				is used as <code>cwebp [options] input_file -o output_file.webp</code> (<a
					href="https://developers.google.com/speed/webp/docs/cwebp"
					target="_blank"
					rel="noopener noreferrer">Google's cwebp reference</a
				>), and <code>avifenc</code> from libavif, used as
				<code>avifenc -q 75 input.jpg output.avif</code>. ImageMagick reads and writes both formats
				once the WebP delegate library is installed. For Node people,
				<code>sharp("lobby.jpg").avif().toFile("lobby.avif")</code>
				and <code>.webp()</code> do the same in two lines, with the install caveats above.
			</p>
			<p class="mb-4">
				Here is the simplest version, for one file, which is where to start if you have never typed
				a command. Put <code>lobby.jpg</code> in a folder, open a terminal in that folder, and type:
			</p>
			<CodeCard filename="convert-one.sh" code={convertOneCode} />
			<p class="mb-4">
				You now have three files called <code>lobby</code>. The JPEG is unchanged. The
				<code>-q</code>
				number is the quality on each tool's own scale; <code>cwebp</code> defaults to 75 if you leave
				it out.
			</p>
			<p class="mb-4">
				Here is the folder version, as it appears in a tutorial that ranks for "bulk convert images
				to webp", slightly tidied:
			</p>
			<CodeCard filename="tutorial-loop.sh" code={tutorialLoopCode} />
			<p class="mb-4">
				Run on the studio's 400 images it looks like it worked, and it has five problems:
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>It misses <code>.JPG</code>, <code>.jpeg</code> and every subfolder.</strong>
						<code>*.jpg</code>
						matches lowercase <code>.jpg</code> in the current folder only. Cameras write
						<code>.JPG</code>, exports write <code>.jpeg</code>, and the images are in
						<code>/images/2024/</code>, <code>/images/2025/</code> and so on. The 60 files you most wanted
						are the ones it skipped.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>It applies a lossy quality to PNGs the moment someone widens the pattern.</strong
						>
						Extend the loop to <code>*.png</code> and the logo and the diagrams come back as lossy
						WebP with faint noise around every edge. <code>cwebp</code> has a <code>-lossless</code> switch;
						the loops never set it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It overwrites silently.</strong> If <code>lobby.webp</code> already exists, from an
						earlier run or from a different source, it is replaced with no message.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It redoes everything, every time.</strong> There is no check for "does the
						<code>.webp</code> already exist", so a build that runs this spends the same ten minutes on
						400 files whether 0 or 60 of them are new. That is the four-minute build people eventually
						comment out.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>It has a variable that is never set.</strong> The version of this loop in a 2023
						blog post that still ranks for the bulk query reads a <code>path</code> and then loops
						over <code>$dir_path</code>, a different name, so it runs over nothing. Copying scripts
						is fine; reading them first is better.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				The fixed version of the same loop uses <code>find</code>, which walks subfolders, with
				<code>-iname</code>, which ignores case, and skips any image that already has its twin:
			</p>
			<CodeCard filename="convert-webp.sh" code={convertWebpCode} />
			<p class="mb-4">
				Read it as: find every file under <code>images</code> whose name ends in <code>.jpg</code>
				or <code>.jpeg</code> in any case; for each one, if a file with the same name and
				<code>.webp</code>
				does not already exist, make it. That is the whole idea of the ongoing script in the
				<a href="#keep-converted">keep-converted section</a>, and it is worth understanding here,
				where the only moving part is <code>cwebp</code>.
			</p>
			<p class="mb-4">
				What this toolkit cannot fix is the install. <code>cwebp</code> and <code>avifenc</code> are two
				separate packages that have to be present on every machine that runs the loop, in versions that
				agree with each other, and ImageMagick's WebP and AVIF support depends on which delegate libraries
				the person who installed it included. On your own laptop that is a one-time job. On a colleague's
				laptop, a CI runner, or a server, it is the job that gets skipped and the pipeline that silently
				stops. If you want the loop without the install, that is the next section.
			</p>
		</section>
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading
				>Mochify Workflow: convert a whole site to WebP and AVIF in one command, on any machine</SectionHeading
			>
			<p class="mb-4">
				The fastest way to convert a site's images to WebP and AVIF is to describe the result rather
				than configure it, and to use a converter that is one binary with nothing to compile:
				Mochify's Magic Flow in the browser for a handful of files, the <code>mochify</code> command line
				for a whole folder tree, the Chrome extension for the one image you are looking at, and the REST
				API when the conversion belongs inside a deploy script. All four are clients of the same engine,
				so the files they produce are the same.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>In the browser, for a few dozen images</h3>
						<p class="mb-4">
							Open <a href="https://mochify.app/flow">Magic Flow</a>, drop the JPEGs (3 per batch
							with a free account, 25 on a paid plan) and type <code>convert to avif</code>.
							Download the results. Drop the same files again and type <code>convert to webp</code>.
							If the images are going into a slot 1200 pixels wide, say so,
							<code>convert to avif, 1200px wide</code>, and they come back resized as well, which
							on a camera JPEG is usually a bigger saving than the format change. For a logo or
							diagram with transparency, <code>convert to webp, lossless</code> keeps every pixel,
							and you keep the PNG as the fallback; AVIF has no lossless path. The
							<a href="https://mochify.app/guides/webp-avif-transparency">transparency guide</a> covers
							what survives where.
						</p>
					</li>
					<li>
						<h3>From the terminal, for the whole site</h3>
						<p class="mb-4">
							The <code>mochify</code> command is a client over the same API. It installs as one
							binary (<code>brew install mochify</code> on a Mac, <code>scoop install mochify</code>
							on Windows, a downloaded binary on Linux, or <code>cargo install mochify</code>),
							signs in once through your browser, and reads a list of file paths from
							<code>find</code>, which is the part that fixes traps 1 and 4 above:
						</p>
						<CodeCard filename="convert-site.sh" code={convertSiteCode} />
						<p class="mb-4">
							Follow <code>images/2025/lobby.jpg</code> through the third line. <code>find</code>
							prints its path; <code>mochify</code> reads the path, sends the file to
							<code>api.mochify.app</code>, receives the AVIF, and writes it beside the original as
							<code>images/2025/lobby.avif</code>. Because the format changed, no
							<code>_mochified</code>
							suffix is added, so the new file has exactly the name the markup in the
							<a href="#serve">serving section</a>
							expects. <code>-t</code> is the output type (<code>jpg</code>, <code>png</code>,
							<code>webp</code>, <code>avif</code> or <code>jxl</code>); <code>-o ./out</code> sends
							the results to a separate folder instead if you want them apart; <code>-w 1200</code>
							resizes on the way; <code>-q 70</code> fixes the quality instead of leaving it on
							automatic; <code>--lossless</code> is for WebP, PNG and JPEG XL output only; and
							<code>-p "convert to avif, 1200px wide"</code>
							is the Magic Flow form if you would rather describe it. The CLI works four files at a time
							by default (<code>-j</code> changes that). The complete list is in the
							<a
								href="https://github.com/getmochify/mochify-cli"
								target="_blank"
								rel="noopener noreferrer">CLI README</a
							>. One thing it does not have is a watch mode or a "skip existing" switch, which is
							why the script in the next section exists.
						</p>
						<p class="mb-4">
							A 400-image site converted to both formats is 800 output files, and each output file
							counts as one image against your plan's monthly allowance. Check that number before
							you start: it is more than a Seller month (300) and fits inside a Pro month (1,200) or
							a Growth month (5,000); a free account has 25 a month, 3 without an account; and a Day
							Pass ($2) covers 100 uploads in 24 hours with no account for a site in between.
						</p>
					</li>
					<li>
						<h3>In Chrome, for one image</h3>
						<p class="mb-4">
							Right-click any image on a page, choose Mochify, then "Convert to" and WebP or AVIF.
							It is a direct conversion with no prompt and no settings, one image at a time, and the
							file lands in your Downloads folder. The <a
								href="https://mochify.app/chrome-extension">Mochify for Chrome page</a
							> has the install link. Useful for the one hero image you are fixing today; not a batch
							tool.
						</p>
					</li>
					<li>
						<h3>From a deploy script, through the API</h3>
						<p class="mb-4">
							The same conversion is one <code>POST</code> per file to <code>/v1/squish</code>, with
							the output type in the query string and the key as a Bearer token, which is the form
							to use in a build or deploy step that cannot open a browser:
						</p>
						<CodeCard filename="deploy-step.sh" code={deployStepCode} />
						<p class="mb-4">
							<code>type=webp</code> for the other twin; <code>quality</code>, <code>width</code>,
							<code>lossless</code>
							and <code>stripExif</code> are the other parameters you are likely to want, and the
							<a href="https://mochify.app/docs">API docs</a>
							have the same call in JavaScript and Python. The CLI accepts the same key through its
							<code>-k</code>
							flag or a <code>MOCHIFY_API_KEY</code> environment variable for a machine with no
							browser to sign in from; on your own computer, <code>mochify auth login</code> is the normal
							path.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, for this workflow.</strong> Images travel to <code>api.mochify.app</code>
				over HTTPS, are streamed into the encoder in memory, and are wiped the moment the encode finishes:
				no disk writes, no logs containing file data, never used to train AI. That is the same on the
				web app, the CLI, the extension and the API; the CLI writes the result to your disk and nothing
				stays on the server. (The hosted MCP server, used by AI agents, is the one surface that keeps
				the compressed output for up to five minutes behind a short-lived URL so the agent can fetch it,
				and the <a href="#keep-converted">agent section below</a> says when that matters. Video is Mochify's
				one format that is processed in your browser and never leaves your device; images are not, and
				we do not claim otherwise.)
			</p>
		</section>
		<section id="keep-converted" class="scroll-mt-24">
			<SectionHeading
				>Keep them converted: automate it with a script that only converts new images</SectionHeading
			>
			<p class="mb-4">
				The script that keeps a site converted is the fixed loop from the toolkit section with <code
					>mochify</code
				>
				in place of <code>cwebp</code>: it finds every JPEG and PNG that does not yet have a
				<code>.avif</code>
				beside it, sends only those, then does the same for <code>.webp</code>. Run with nothing
				new, it sends nothing and costs nothing. That is the whole of "keep them converted", and it
				is twelve lines.
			</p>
			<p class="mb-4">
				Save this as <code>convert-new.sh</code> in the folder above <code>images</code>:
			</p>
			<CodeCard filename="convert-new.sh" code={convertNewCode} />
			<p class="mb-4">
				Make it runnable once with <code>chmod +x convert-new.sh</code>, then run it with
				<code>./convert-new.sh</code>.
			</p>
			<p class="mb-4">
				Here is a worked run. On Monday the studio adds three photographs: <code
					>images/2026/atrium.jpg</code
				>, <code>images/2026/Reception.JPG</code> and <code>images/2026/floor-plan.png</code>.
				Everything else already has its twins from the one-off conversion. The script runs and
				prints:
			</p>
			<CodeCard filename="output.txt" code={outputCode} />
			<p class="mb-4">
				and the folder now holds <code>atrium.avif</code>, <code>atrium.webp</code>,
				<code>Reception.avif</code>, <code>Reception.webp</code>, <code>floor-plan.avif</code> and
				<code>floor-plan.webp</code>, in the same subfolder as their sources, with the same base
				names, including the capital R. Six files were sent and six were charged; the other 400
				sources were skipped on each pass. Run it again on Tuesday with no new images and it prints
				<code>nothing new for .avif</code>
				and <code>nothing new for .webp</code>, sends nothing, and finishes in under a second.
			</p>
			<p class="mb-4">
				Here is the realistic broken case. Wednesday, a colleague replaces <code>atrium.jpg</code>
				with a re-edited version, same name. The script sees that <code>atrium.avif</code> exists
				and skips it, so the site serves the new JPEG to the 3% of visitors on old browsers and the
				old AVIF to everyone else. The script is doing exactly what it was told: "has a twin" is not
				"has a current twin". The fix is one of two habits: delete the twins when you replace a
				source (<code>rm images/2026/atrium.avif images/2026/atrium.webp</code>, then run the
				script), or, if replacements are common, change the test on line 7 to
				<code>[ "$&#123;src%.*&#125;.$fmt" -nt "$src" ]</code>, which reads "is the twin newer than
				the source", so an edited JPEG is reconverted automatically. The second form is the one to
				use in a build.
			</p>
			<figure class="mb-6">
				<picture>
					<source
						srcset="/guides/convert-website-images-to-webp-and-avif/convert-new.avif"
						type="image/avif"
					/>
					<source
						srcset="/guides/convert-website-images-to-webp-and-avif/convert-new.webp"
						type="image/webp"
					/>
					<img
						src="/guides/convert-website-images-to-webp-and-avif/convert-new.jpg"
						alt="Diagram of convert-new.sh on Monday: in a folder tree, the 400 existing sources already have their .avif and .webp twins and are skipped, while atrium.jpg, Reception.JPG and floor-plan.png in images/2026 have no .avif and are sent, so 6 files are sent and charged across both passes. On Wednesday atrium.jpg is re-edited with the same name: the -f test sees the old atrium.avif and skips it, while the -nt test sees the twin is older than the source and reconverts it. On Tuesday, with nothing new, nothing is sent."
						width="1600"
						height="800"
						loading="lazy"
						decoding="async"
						class="h-auto w-full rounded-2xl border border-pink-100"
					/>
				</picture>
			</figure>
			<p class="mb-4">
				<strong>Where to run it.</strong> On your own machine, run it before you deploy, or put it
				in the script that deploys. In a build or on a server, it runs the same way; the one
				difference is that there is no browser to sign in with, so the runner gets a key from your
				dashboard through the <code>MOCHIFY_API_KEY</code> environment variable (the CLI README
				documents it as an override; <code>mochify auth login</code> remains the normal path on a
				computer with a browser). In a Git hook, it runs before each commit, so a <code>.jpg</code> never
				lands in the repository without its twins. In every case the script is the same twelve lines,
				there is nothing to compile, and the person who inherits it can read it in a minute, which was
				the third property of a pipeline that holds.
			</p>
			<p class="mb-4">
				<strong>From an AI coding agent.</strong> If a coding agent maintains the site, the agent
				can run <code>convert-new.sh</code> like any other command, or call Mochify directly through
				its MCP server: the local server (<code>mochify serve</code>, the same binary, started once
				and wired into the agent's config) converts a file and returns the file path and metadata,
				so no image bytes ever enter the agent's context; the hosted server at
				<code>mcp.mochify.app</code>
				needs no install, is authorized with OAuth, and returns a short-lived download URL on
				<code>files.mochify.app</code>
				that expires after about five minutes. Our guide to
				<a href="https://mochify.app/guides/how-the-mochify-mcp-server-works"
					>how the two MCP servers work</a
				>
				covers the choice, and the
				<a href="https://mochify.app/guides/image-compression-claude-code-cli-mcp"
					>Claude Code guide</a
				>
				covers setting the local server up inside Claude Code specifically. If the images are themselves
				generated by an AI tool, the
				<a href="https://mochify.app/guides/compress-optimize-ai-generated-images"
					>AI-generated images guide</a
				> covers what those inputs need before this script sees them.
			</p>
			<p class="mb-4">
				<strong>When this script is not needed.</strong> If images only ever reach the site through a
				CMS upload screen, the upload hook (a plugin, or your framework's image component) is the right
				owner and this script would be a second, competing pipeline. Pick one. If the site is a static
				builder that converts on upload for you, the same applies. The script is for the site whose images
				arrive as files in a folder.
			</p>
		</section>
		<section id="serve" class="scroll-mt-24">
			<SectionHeading>Serve them: the picture tag, or a CDN that negotiates for you</SectionHeading>
			<p class="mb-4">
				Converted files do nothing until the page offers them, and there are two ways to do that:
				the <code>&lt;picture&gt;</code> element, which lists the AVIF, the WebP and the JPEG so the
				browser picks the first one it can open, or a CDN that reads the browser's
				<code>Accept</code>
				header and converts on the way out. The markup is the subject of our guide to
				<a href="https://mochify.app/guides/html-picture-tag">the HTML picture tag</a>; this section
				gives you the one snippet and the check.
			</p>
			<p class="mb-4">
				For <code>lobby.jpg</code> with its two twins beside it, replace
				<code>&lt;img src="images/2025/lobby.jpg" ...&gt;</code> with:
			</p>
			<CodeCard filename="lobby.html" code={lobbyCode} />
			<p class="mb-4">
				The browser reads top to bottom and downloads one file: the AVIF if it can open AVIF, else
				the WebP, else the JPEG. A visitor on a 2026 phone gets the 22 KB AVIF; a visitor on an old
				office PC gets the JPEG exactly as before; a search crawler reads the <code
					>&lt;img src&gt;</code
				>, which is where Google Search Central tells you to put a fallback URL because "some
				browsers and crawlers don't understand these attributes" (<a
					href="https://developers.google.com/search/docs/appearance/google-images"
					target="_blank"
					rel="noopener noreferrer">Google Images best practices</a
				>). Everything that was on the old <code>&lt;img&gt;</code> (the <code>alt</code>, the
				<code>width</code>
				and <code>height</code>, <code>class</code>, <code>loading</code>) stays on the
				<code>&lt;img&gt;</code>; the <code>&lt;picture&gt;</code> is only a wrapper. The order matters:
				AVIF above WebP, or every modern browser takes the WebP and the AVIF files are never served to
				anyone.
			</p>
			<p class="mb-4">
				<strong>Check it, click by click.</strong> Open the page in Chrome, Edge or Firefox,
				right-click, choose <strong>Inspect</strong>, open the <strong>Network</strong> tab, click
				the <strong>Img</strong> filter, and reload. You should see <code>lobby.avif</code> in the
				list and no request for <code>lobby.webp</code> or <code>lobby.jpg</code>. If you see the
				JPEG in a current browser, the <code>type</code> values or the file names are wrong: compare
				them letter for letter with the files on disk, including case. If you see a broken image,
				the <code>.avif</code> file is not where the markup says it is; the script writes it beside
				the source, so the path is the JPEG's path with the extension changed. To see whether a page
				uses <code>&lt;picture&gt;</code> at all, right-click, <strong>View Page Source</strong>,
				and search (Ctrl+F or Cmd+F) for <code>&lt;picture</code>.
			</p>
			<p class="mb-4">
				<strong>The CDN alternative.</strong> If you would rather leave the markup saying
				<code>.jpg</code>, a CDN that negotiates formats converts each request to the best format
				the browser lists in its <code>Accept</code> header, as the
				<a href="#three-places">three places section</a>
				describes. Polish on Cloudflare covers WebP only and is not on the free plan; Cloudflare Images
				<code>format=auto</code>
				and Fastly's <code>auto=avif</code> cover AVIF. It works, it costs money, and nothing
				changes in your repository, which is also its weakness: leave the CDN and the modern formats
				leave with you. Sites that have the files in the folder and the
				<code>&lt;picture&gt;</code> in the page are portable.
			</p>
			<p class="mb-4">
				<strong>The audit's current name.</strong> Lighthouse calls it "Serve images in modern
				formats", and since Lighthouse 13 it lives inside the "Improve image delivery" insight; it
				names AVIF and WebP and says "You'll need to serve a fallback PNG or JPEG image for older
				browser support" (<a
					href="https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images"
					target="_blank"
					rel="noopener noreferrer">Chrome for Developers</a
				>). The snippet above is that fallback. Images in CSS backgrounds are a separate case,
				because <code>&lt;picture&gt;</code> cannot reach them and Google does not index CSS images at
				all; the picture-tag guide has the one-paragraph answer.
			</p>
		</section>
		<section id="wordpress" class="scroll-mt-24">
			<SectionHeading>WordPress, in one honest paragraph</SectionHeading>
			<p class="mb-4">
				WordPress core does not convert your JPEG and PNG uploads to WebP or AVIF by default; the
				way to get it done without betting the site on a third-party plugin is the WordPress
				project's own Modern Image Formats plugin, which converts new uploads only. The details,
				briefly: WordPress 6.5 added AVIF support for uploads in February 2024, with the note that
				"AVIF in WordPress depends on support in your web server's image processing library" (<a
					href="https://make.wordpress.org/core/2024/02/23/wordpress-6-5-adds-avif-support/"
					target="_blank"
					rel="noopener noreferrer">make.wordpress.org</a
				>); converting uploads to WebP by default was merged for 6.1 and reverted in September 2022,
				and has not returned. The canonical plugin, Modern Image Formats (<code>webp-uploads</code>,
				2.7.1, tested up to 7.1, 100,000+ installs), generates AVIF "if supported on the hosting
				server, otherwise WebP", keeps the original, and converts "only for new uploads"; existing
				images are converted only if you regenerate them, and its <code>&lt;picture&gt;</code>
				output is a setting in the plugin, not something core emits. Third-party converter plugins add
				bulk conversion of the existing library, and some serve the converted files through web-server
				rewrite rules; that rewrite layer is the part that moves separately from the site, so check it
				after any host change. Our guide to
				<a href="https://mochify.app/guides/next-gen-image-formats-wordpress"
					>fixing the modern-formats warning in WordPress without plugins</a
				>
				walks the core and plugin routes, and the Quick Answer on
				<a href="https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin"
					>whether WordPress 7.1 optimizes images without a plugin</a
				> has the short version. Everything else in this guide applies to a WordPress site's theme images,
				which are files in a folder like any other site's.
			</p>
		</section>
		<section id="quality" class="scroll-mt-24">
			<SectionHeading>Quality, size and metadata: what the defaults do</SectionHeading>
			<p class="mb-4">
				With default settings, converting a JPEG to WebP or AVIF roughly halves the file at the same
				visual quality. In our own run on October 14, 2026, through the API with the quality left on
				automatic and nothing resized, a 512 by 512 photograph saved as a JPEG at quality 85 (53,962
				bytes) came back as a 22,398-byte WebP and a 22,267-byte AVIF, 58% and 59% smaller; a 600 by
				400 photograph (56,809 bytes) came back as a 25,988-byte WebP and a 26,915-byte AVIF, 54%
				and 53% smaller; and a 1440 by 900 PNG screenshot of a user interface (70,348 bytes) came
				back as a 45,430-byte WebP and a 29,956-byte AVIF, 35% and 57% smaller. At these sizes the
				two formats land within a few kilobytes of each other on photographs, and the screenshot is
				where AVIF pulls ahead; resizing a 4000-pixel camera JPEG to the 1600 pixels the page
				actually shows saves more than either format change, which is why "convert to avif, 1600px
				wide" is the prompt we would type first.
			</p>
			<figure class="size-chart mb-6" aria-labelledby="size-chart-title">
				<figcaption id="size-chart-title" class="size-chart-title">
					File size after conversion, in bytes
				</figcaption>
				<ul class="size-legend" aria-hidden="true">
					{#each sizeSeries as series (series.key)}
						<li><span class="swatch" style:background={series.color}></span>{series.label}</li>
					{/each}
				</ul>
				<div class="size-groups">
					{#each sizeRuns as run (run.detail)}
						<div class="size-group">
							<p class="size-name">{run.name} <span>{run.detail}</span></p>
							{#each sizeSeries as series (series.key)}
								{@const bytes = run[series.key]}
								{@const pct = Math.round((1 - bytes / run.source) * 100)}
								<div class="size-row">
									<span class="size-label"
										>{series.key === 'source' ? run.sourceType : series.label}</span
									>
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
									<div
										class="size-track"
										tabindex="0"
										role="img"
										aria-label="{run.name} {run.detail}, {series.key === 'source'
											? run.sourceType
											: series.label}: {fmt(bytes)} bytes{series.key === 'source'
											? ''
											: `, ${pct}% smaller`}"
									>
										<span
											class="size-bar"
											style:width="calc((100% - 4.5rem) * {bytes / sizeMax})"
											style:background={series.color}
										></span>
										<span class="size-value"
											>{fmt(bytes)}{#if series.key !== 'source'}<em>{pct}% smaller</em>{/if}</span
										>
										<span class="size-tip" aria-hidden="true"
											>{fmt(bytes)} bytes{series.key === 'source'
												? ` (${run.sourceType})`
												: `, ${pct}% smaller than the ${run.sourceType}`}</span
										>
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				<p class="size-note">
					Our run, October 14, 2026: through the API, quality on automatic, nothing resized.
				</p>
				<details class="size-table">
					<summary>Show as a table</summary>
					<GuideTable class="my-4">
						<table>
							<thead><tr><th>Image</th><th>Source</th><th>WebP</th><th>AVIF</th></tr></thead>
							<tbody>
								{#each sizeRuns as run (run.detail)}
									<tr
										><td>{run.name}, {run.detail}</td><td>{fmt(run.source)} ({run.sourceType})</td
										><td>{fmt(run.webp)}</td><td>{fmt(run.avif)}</td></tr
									>
								{/each}
							</tbody>
						</table>
					</GuideTable>
				</details>
			</figure>
			<p class="mb-4">
				A few defaults are worth knowing before you convert a whole site, because they are the ones
				people search for afterwards:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The default encode is lossy, at high quality.</strong> "Without losing quality"
						means without losing quality you can see; a lossy WebP or AVIF is not the same bytes as
						the JPEG, and a JPEG was already lossy. If you have a pixel-exact requirement (a
						screenshot, a logo, a diagram with thin lines), ask for lossless and check the size:
						<code>--lossless</code>
						on the CLI and <code>lossless=1</code> on the API apply to WebP, PNG and JPEG XL output,
						AVIF has no lossless path, and the CLI's own README notes that a lossless output "is
						usually larger than the input: lossless preserves pixels, not file size". Our guide to
						<a href="https://mochify.app/guides/lossless-image-formats">lossless image formats</a> is
						the decision in full.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Transparency survives.</strong> A PNG with a transparent background comes back
						as a WebP or AVIF with the transparency kept; it is JPEG that flattens to white. Keep
						the PNG as the fallback in the <code>&lt;picture&gt;</code> for those images, not a JPEG.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Metadata is stripped by default.</strong> The CLI strips EXIF unless you pass
						<code>--keep-metadata</code>; the API strips it unless you send
						<code>stripExif=false</code>. For a website that is what you want: the camera's GPS
						position should not ship with the lobby photograph. Our guide on
						<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
							>EXIF data and the risks of leaving it in</a
						> covers the cases where you would keep it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>A WebP source makes a lossy AVIF twice over.</strong> "webp to avif" is a common search,
						and it works, but the WebP was already a lossy encode, so the AVIF is a re-encode of a re-encode.
						If the original JPEG or PNG still exists, convert from that.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>SVG goes in, WebP comes out.</strong> The classic command-line complaint is that
						the WebP encoder "can't decode .svg files". Mochify accepts SVG on every surface and
						rasterizes it at the size you ask for, so a logo in SVG can have a WebP and an AVIF twin
						like everything else; the
						<a href="https://mochify.app/solutions/svg-to-webp">SVG to WebP converter</a> is the drop-a-file
						version.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong><code>--optimize-for-web</code></strong> on the CLI (<code
							>optimizeForWeb=1</code
						>
						on the API) asks for progressive encoding and 4:2:0 chroma subsampling, which the README describes
						as the "smallest file to serve". For photographs on a web page it is a reasonable default
						to add to the script's two <code>mochify</code> lines; for a screenshot with colored text,
						leave it off and compare.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>JPEG XL</strong> is the newest format and <code>-t jxl</code> makes it, but
						Chrome only began opening it by default with version 155 on October 6, 2026, and
						caniuse's September figure is 16.95%. Our guide to
						<a href="https://mochify.app/guides/jpeg-xl-chrome-support"
							>JPEG XL's arrival in Chrome</a
						> says when a third twin is worth making; for now, two is the answer.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				If what you want is the decision between WebP and AVIF rather than both, the Quick Answer on <a
					href="https://mochify.app/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl"
					>WebP, AVIF or JPEG XL in 2026</a
				> is the short version; this guide's position is that making both costs one extra line and lets
				the browser decide.
			</p>
		</section>
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6"
				><table>
					<thead><tr><th>Task</th><th>Answer</th></tr></thead><tbody
						><tr
							><td>Convert a folder tree, once</td><td
								><code
									>find ./images -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) |
									mochify -t avif</code
								>, then the same with <code>-t webp</code></td
							></tr
						><tr
							><td>Convert a few dozen in the browser</td><td
								><a href="https://mochify.app/flow">mochify.app/flow</a>: drop, type
								<code>convert to avif</code>, repeat with <code>convert to webp</code></td
							></tr
						><tr
							><td>Convert one image on a page</td><td
								>Chrome: right-click, Mochify, "Convert to", pick the format</td
							></tr
						><tr
							><td>Keep them converted</td><td
								><code>convert-new.sh</code> above: find sources with no <code>.avif</code> /
								<code>.webp</code>
								twin, pipe only those into <code>mochify</code></td
							></tr
						><tr
							><td>Reconvert an edited source</td><td
								>Delete its twins and rerun, or test <code>-nt</code> (twin newer than source)
								instead of <code>-f</code></td
							></tr
						><tr
							><td>Match <code>.JPG</code> and subfolders</td><td
								><code>find</code> with <code>-iname</code>, never <code>*.jpg</code></td
							></tr
						><tr
							><td>Resize on the way</td><td
								><code>-w 1200</code> (CLI), <code>width=1200</code> (API), "1200px wide" (Magic Flow)</td
							></tr
						><tr
							><td>Lossless</td><td
								><code>--lossless</code> / <code>lossless=1</code>: WebP, PNG, JPEG XL only; AVIF
								has none; output is often larger</td
							></tr
						><tr
							><td>Keep EXIF</td><td
								><code>--keep-metadata</code> (CLI), <code>stripExif=false</code> (API); stripped by default</td
							></tr
						><tr
							><td>Serve the files</td><td
								><code>&lt;picture&gt;</code> with AVIF, then WebP <code>&lt;source&gt;</code>s and
								the JPEG or PNG <code>&lt;img&gt;</code>; or a CDN with <code>format=auto</code> /
								<code>auto=avif</code></td
							></tr
						><tr
							><td>Check what loaded</td><td
								>Inspect, Network tab, Img filter, reload: one request, <code>.avif</code> in a current
								browser</td
							></tr
						><tr
							><td>Build or CI without a browser</td><td
								><code>MOCHIFY_API_KEY</code> environment variable, or the API with
								<code>Authorization: Bearer</code></td
							></tr
						><tr
							><td>WordPress</td><td
								>Core does not convert uploads; Modern Image Formats plugin converts new uploads,
								AVIF if the server can</td
							></tr
						><tr
							><td>Support (caniuse, Sep 2026)</td><td
								>WebP 97.18%, AVIF 96.35%, JPEG XL 16.95%; keep the JPEG or PNG fallback</td
							></tr
						><tr
							><td>Allowance</td><td
								>One per output file: 400 images in two formats is 800; 25 a month free with an
								account, 3 without; Day Pass $2 for 100 in 24 hours</td
							></tr
						></tbody
					>
				</table></GuideTable
			>
		</section>
		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Try Magic Flow">
			Convert your first folder now at <a href="https://mochify.app/flow">mochify.app/flow</a>, or
			install the CLI from
			<a href="https://github.com/getmochify/mochify-cli" target="_blank" rel="noopener noreferrer"
				>the repository</a
			>. The prompt to start with is <em>"convert to avif, 1200px wide"</em>, then
			<em>"convert to webp"</em>.
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

	/* Workflow steps: the handoff authors each step title as an <h3> and steps
	   2 and 4 carry code figures, so this is a plain list rather than StepList
	   (whose titles are <p> and whose bodies are an {@html} string). */
	.workflow-steps {
		list-style: none;
		counter-reset: step;
		margin: 0;
		padding: 0;
	}

	.workflow-steps > li {
		counter-increment: step;
		position: relative;
		padding-left: 3.25rem;
		padding-bottom: 2rem;
	}

	.workflow-steps > li:last-child {
		padding-bottom: 0;
	}

	.workflow-steps > li::before {
		content: counter(step);
		position: absolute;
		left: 0;
		top: 0;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 0.95rem;
		color: #fff;
		background: linear-gradient(135deg, #f06292 0%, #ffb3c6 100%);
		box-shadow: 0 4px 12px rgba(240, 98, 146, 0.25);
	}

	.workflow-steps h3 {
		margin: 0.2rem 0 0.75rem;
	}

	.workflow-steps p {
		margin: 0 0 0.75rem;
	}

	.workflow-steps p:last-child {
		margin-bottom: 0;
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

	/* Size chart: one shared byte scale, thin rounded bars, values in text ink
	   beside each bar. Hover and keyboard focus show a tooltip via CSS only,
	   since guides ship without client-side JS. */
	.size-chart {
		margin-top: 1.5rem;
		padding: 1.5rem 1.5rem 1.25rem;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.75);
		border: 1px solid #f3dde1;
		box-shadow: 0 8px 24px rgba(240, 98, 146, 0.06);
	}

	.size-chart-title {
		margin: 0;
		font-weight: 700;
		font-size: 1.05rem;
		color: #4a2c2c;
	}

	.size-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin: 0.6rem 0 1.25rem;
		padding: 0;
		list-style: none;
		font-size: 0.875rem;
		color: #6c3f31;
	}

	.size-legend li {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
	}

	.swatch {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 3px;
	}

	.size-groups {
		display: grid;
		gap: 1.25rem;
	}

	.size-name {
		margin: 0 0 0.4rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: #4a2c2c;
	}

	.size-name span {
		font-weight: 500;
		color: #875f42;
	}

	.size-row {
		display: grid;
		grid-template-columns: 6.5rem 1fr;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 2px;
	}

	.size-label {
		font-size: 0.8rem;
		color: #875f42;
		text-align: right;
	}

	.size-track {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 1.5rem;
		border-radius: 4px;
		outline: none;
		cursor: default;
	}

	.size-track:focus-visible {
		box-shadow: 0 0 0 2px #f06292;
	}

	.size-bar {
		display: block;
		height: 0.875rem;
		flex-shrink: 0;
		border-radius: 0 4px 4px 0;
		transition: filter 0.15s ease;
	}

	.size-track:hover .size-bar,
	.size-track:focus-visible .size-bar {
		filter: brightness(0.9);
	}

	.size-value {
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		color: #4a2c2c;
		white-space: nowrap;
	}

	.size-value em {
		margin-left: 0.4rem;
		font-style: normal;
		color: #875f42;
	}

	.size-tip {
		position: absolute;
		left: 0;
		bottom: calc(100% + 6px);
		z-index: 2;
		padding: 0.35rem 0.6rem;
		border-radius: 0.5rem;
		background: #4a2c2c;
		color: #fff;
		font-size: 0.8rem;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transform: translateY(2px);
		transition:
			opacity 0.12s ease,
			transform 0.12s ease;
	}

	.size-track:hover .size-tip,
	.size-track:focus-visible .size-tip {
		opacity: 1;
		transform: none;
	}

	.size-note {
		margin: 1rem 0 0;
		font-size: 0.8rem;
		color: #9b7a72;
	}

	.size-table summary {
		margin-top: 0.75rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: #d81b60;
		cursor: pointer;
	}

	@media (max-width: 640px) {
		.size-chart {
			padding: 1.25rem 1rem 1rem;
		}

		.size-row {
			grid-template-columns: 4.75rem 1fr;
			gap: 0.5rem;
		}

		.size-value em {
			display: none;
		}
	}
</style>
