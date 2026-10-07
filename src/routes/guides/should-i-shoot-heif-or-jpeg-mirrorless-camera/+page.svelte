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

	// Built from content-ops `article-originals/should-i-shoot-heif-or-jpeg-mirrorless-camera.html`
	// (handoff spec v1). Body copy is verbatim from the handoff; head and schema are
	// generated from its metadata block per the spec's section 2.2 contract.
	const metadata = {
		title: 'Should I Shoot HEIF or JPEG on My Mirrorless Camera?',
		seoTitle: 'HEIF vs JPEG on Mirrorless: Canon, Nikon, Sony, Fujifilm',
		description:
			'HEIF means HDR capture on Canon and Nikon, 10-bit SDR on Sony and Fujifilm. What you gain per brand, which software refuses the file, and when JPEG wins.',
		category: 'Image Formats',
		readTime: '31 min read',
		date: 'April 25, 2026',
		lastUpdated: 'October 7, 2026',
		bylineNote:
			'Expanded from a Quick Answer into a full guide, with per-brand menus, file sizes and the software that refuses the file.'
	};

	const keywords =
		'heif vs jpeg, should i shoot heif or jpeg, hif vs arw, heif vs raw, canon hdr pq, nikon hlg heif, sony heif 4:2:2, fujifilm heif, hif file';

	const pageUrl = 'https://mochify.app/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera';

	const toc = [
		{ id: 'short-answer', label: 'The short answer, by brand' },
		{
			id: 'ten-bit-is-not-hdr',
			label: 'The thing the comparison articles miss: 10-bit is not HDR'
		},
		{ id: 'canon', label: 'Canon: HEIF means HDR PQ, every time' },
		{ id: 'nikon', label: 'Nikon: HEIF means HLG, and the Z9 has neither' },
		{
			id: 'sony',
			label: 'Sony: 10-bit SDR by default, HLG if you ask, and the HIF vs ARW question'
		},
		{ id: 'fujifilm', label: 'Fujifilm: 10-bit SDR only, with two things switched off' },
		{ id: 'what-breaks', label: 'What breaks if you switch to HEIF' },
		{ id: 'file-sizes', label: 'How much smaller are HEIF files, really?' },
		{ id: 'heif-jpeg-or-raw', label: 'HEIF, JPEG or RAW?' },
		{ id: 'workflow', label: 'The workflow that gets you both' },
		{ id: 'mochify-workflow', label: 'Mochify Workflow: HIF to delivery-ready JPEG' },
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Describe the job in plain English.',
			html: `<p>Drop the files on <a href="https://mochify.app/flow">mochify.app/flow</a> and type what you want: "convert these to JPEG, 3000px on the long edge, strip the location data" or "convert to JPEG at full size". Magic Flow parses the prompt with a language model and the C++ engine does the conversion, so there is no quality slider and no format picker to get wrong. The web app strips metadata by default; its Strip EXIF switch keeps the camera data when you want it delivered. The same prompts work from the command line (<code>mochify DSC01234.HIF -p "convert to jpeg, 3000px long edge"</code>), from both MCP servers for an agent-driven pipeline, and from the Chrome extension on a single image.</p>`
		},
		{
			title: 'Or use the fixed-purpose converter.',
			html: `<p>The <a href="https://mochify.app/solutions/hif-to-jpg">HIF to JPG converter</a> does one thing: drop HIF files, get JPEGs. Because it is built for photographers, the Strip EXIF switch that appears after upload starts <strong>off</strong>, so ISO, shutter, lens and GPS are kept on first use; switch it on to remove them, and the page remembers your choice. Three files up to 20 MB each with no account; a free account raises that to 25 images a month, and the Day Pass ($2, 100 uploads in 24 hours, no account) lifts the file limit to 75 MB for a batch of 61-megapixel files.</p>`
		},
		{
			title: 'For your own website, go 10-bit AVIF instead of JPEG.',
			html: `<p>The <a href="https://mochify.app/solutions/hif-to-avif">HIF to AVIF converter</a> writes a 10-bit AVIF from a 10-bit HIF, which keeps the gradation the whole point of HEIF was, in a format Chrome, Safari and Firefox all display. It is standard-range: a Canon PQ or Sony HLG file's HDR is not carried into it.</p>`
		},
		{
			title: 'From a script or an agent, call the API directly.',
			html: `<div class="my-5 overflow-hidden rounded-2xl bg-[#2F2320]"><div class="border-b border-white/10 px-5 py-2"><span class="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-xs text-[#F6EDE8]">convert.sh</span></div><pre class="m-0! overflow-x-auto rounded-none! p-5 text-sm leading-relaxed text-[#F6EDE8]"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;stripExif=false" \\
  -H "Authorization: Bearer mchy_your_api_key" \\
  --data-binary @DSC01234.HIF \\
  --output DSC01234.jpg</code></pre></div>
<p><code>stripExif</code> defaults to stripping; set it to <code>false</code> to keep camera metadata. Full parameters at <a href="https://mochify.app/docs">mochify.app/docs</a>. The CLI and local MCP server (<code>mochify serve</code>) are clients over this same endpoint and authenticate once with <code>mochify auth login</code>.</p>`
		}
	];

	const faqItems = [
		{
			q: 'Is HEIF better than JPEG on a camera?',
			a: `As a file, yes: 10 bits per channel instead of 8, so smooth skies and gradients hold up through edits, and on Sony and Fujifilm bodies the file is also smaller. As a format to live with, not yet: Capture One does not open 10-bit camera HEIF, Windows needs paid codecs and still fails on some 10-bit files, no browser except Safari displays it, and galleries, labs and stock agencies require JPEG. HEIF is better at capture and worse at delivery, which is why the sensible workflow uses it for the first and JPEG for the second.`
		},
		{
			q: 'Does the Nikon Z9 shoot HEIF?',
			a: `No. The Z9's specification lists NEF (RAW) and JPEG for stills, with HLG available only for video, and its Reference Guide has no Tone Mode item. HEIF stills on Nikon are on the Z8, Zf, Z6III, Z5II and Z50II, always as part of the HLG tone mode. The Z9's "High Efficiency" and "High Efficiency★" options are NEF RAW compression settings, not HEIF.`
		},
		{
			q: 'HIF vs ARW on a Sony: which should I shoot?',
			a: `ARW is the 14-bit RAW; HIF is the camera's processed 10-bit HEIF. Sony's own advice: record JPEG or HEIF "if you do not intend to edit the images on your computer", and RAW for processing on a computer. If you edit, shoot ARW, and add HEIF(4:2:2) as the second file if you want a high-quality preview that takes half the space of a JPEG (on the a7R V, about 26 MB against 53 MB, by Sony's card tables). If you deliver from the card, HEIF is only the right choice if everything downstream opens it; otherwise JPEG.`
		},
		{
			q: 'Does converting HEIF to JPEG lose quality?',
			a: `Yes, in two ways, and both are usually invisible. You drop from 10 bits to 8, which only shows if you edit the JPEG hard afterwards, and the JPEG encoder adds its own compression on top of the HEIF's, which a good encoder keeps below visibility at delivery sizes. The one case that needs care is an HDR file (Canon HDR PQ, Nikon or Sony HLG), where the conversion must tone-map the wide range into a normal one; use the maker's software or Lightroom for that step. <a href="https://mochify.app/guides/does-hif-to-jpg-lose-quality">Does converting HIF to JPG reduce quality?</a> goes into the detail.`
		},
		{
			q: "Can Lightroom and Capture One open my camera's HEIF files?",
			a: `Lightroom Classic, Lightroom and Camera Raw open camera HEIF (.HIF) on macOS 10.13 or later and Windows 10 or later, including the 10-bit HDR files from Canon, Nikon and Sony, but they cannot export HEIF. Capture One, as of version 16.8.6 (September 2026), supports "Apple HEIC and 8-bit HEIF images" only and states that "10-bit HEIF/HEIC files that are generated by new cameras are not supported at the moment", which rules out every camera in this guide. Affinity Photo 2 and Photo Mechanic open them; DxO PhotoLab documents iPhone HEIF only.`
		},
		{
			q: 'Why does my HEIF look washed out or too dark on my monitor?',
			a: `Because it is an HDR file being shown on a screen or in an app that does not understand its transfer curve. Canon HEIF is always HDR PQ and Nikon HEIF is always HLG, and both makers warn that the files "may not display correctly on monitors that are not HDR-compatible"; Nikon specifically says highlights "may seem washed out". Sony HEIF only has this problem if HLG Still Image was on, and Fujifilm HEIF never does. The fix is an HDR-capable display and application, or an SDR conversion in DPP, NX Studio, Imaging Edge Desktop or Lightroom.`
		},
		{
			q: 'Are HEIF files smaller than JPEG?',
			a: `On Sony, about half (a7R V: 2,500 HEIF frames on a 64GB card against 1,200 JPEG). On Fujifilm, "up to 30% smaller" by Fujifilm's claim. On Canon, no: the R5 Mark II's table gives 13.0 MB for JPEG Large and 12.5 MB for HEIF Large, because Canon spends the compression on 10-bit HDR range rather than on size. Nikon gives no figure. Any article that quotes one percentage for "HEIF" is averaging across brands that made different choices.`
		},
		{
			q: 'Should I shoot RAW + HEIF or RAW + JPEG?',
			a: `RAW + HEIF if your editor opens HEIF and you want the better preview; RAW + JPEG if anyone downstream will take the second file as-is, or if you are on Capture One or a Windows machine without the HEVC codec. On Canon and Nikon, remember the HEIF copy is HDR and will need converting before an SDR viewer sees it correctly; on Nikon, HLG also changes the ISO floor and noise of the RAW itself, so it is not a free second file.`
		}
	];

	const related = [
		{
			title: 'HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs',
			href: '/guides/hif-to-jpg-canon-sony-fujifilm',
			desc: 'Every conversion method for pro-camera HIF files, by platform and brand.'
		},
		{
			title: 'HEIF to JPG: The Complete Conversion Guide',
			href: '/guides/heif-to-jpg-complete-guide',
			desc: 'The format itself, which cameras write it, and the full method list.'
		},
		{
			title: 'Does Converting HIF to JPG Reduce Quality?',
			href: '/guides/does-hif-to-jpg-lose-quality',
			desc: 'The 10-bit to 8-bit step, and the Canon HDR PQ exception.'
		},
		{
			title: 'Why HDR Photos Look Flat When You Share Them',
			href: '/guides/why-hdr-photos-look-flat-when-shared',
			desc: 'Gain maps, which platforms keep them, and which edits switch HDR off.'
		},
		{
			title: 'How to Open HEIF Files on Windows (or Convert Them to JPG)',
			href: '/guides/open-heif-files-on-windows',
			desc: 'The codec fixes, and why 10-bit camera files are the hard case.'
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
		datePublished: '2026-04-25',
		dateModified: '2026-10-07',
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
			'HEIF',
			'JPEG',
			'HIF files',
			'HDR PQ',
			'HLG',
			'Canon EOS R',
			'Nikon Z',
			'Sony Alpha',
			'Fujifilm X',
			'RAW'
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
		datePublished: '2026-04-25',
		dateModified: '2026-10-07'
	};
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
	{@html `<script type="application/ld+json">${JSON.stringify(articleLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${JSON.stringify(webPageLd)}<\/script>`}
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
			Should I Shoot HEIF or JPEG on My Mirrorless Camera?
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			Shoot HEIF if your camera, your editor and your deliverables all handle it, and shoot JPEG if
			any one of them does not. That is the short answer, and it is less useful than it sounds,
			because "HEIF" is not one setting. Canon's HEIF is always an HDR PQ file. Nikon's HEIF only
			exists inside its HLG tone mode. Sony's is a 10-bit standard-range file by default, with HDR
			as an option. Fujifilm's is 10-bit standard-range only. So the question "HEIF or JPEG?" has
			four different answers depending on which menu you are looking at, and most of what ranks on
			Google for it, including a Samsung phone thread at number one, never says so. This guide gives
			the per-brand answer, the file sizes from each maker's own tables, the software and services
			that still refuse a camera HEIF in 2026, and the one workflow that lets you keep the 10-bit
			capture and still deliver a JPEG that opens everywhere.
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

		<section id="short-answer" class="scroll-mt-24">
			<SectionHeading>The short answer, by brand</SectionHeading>
			<p class="mb-4">
				For most working photographers in 2026 the answer is still JPEG for anything you deliver,
				and HEIF only where you have checked that every link in your chain opens it. The per-brand
				version:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>Canon (EOS R5, R5 Mark II, R6 family, R3, R1, R7, R8, R10, R50, 1D X Mark III):</strong
						> turning on HEIF is turning on HDR PQ capture. Shoot it if you want HDR stills for an HDR
						display and you are happy to convert to JPEG for everything else. File size saving: effectively
						none.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Nikon (Z8, Zf, Z6III, Z5II, Z50II):</strong> HEIF is the file format of the HLG tone
						mode, which also raises your minimum ISO to 400, adds noise, and disables Active D-Lighting.
						Shoot it for HDR delivery; otherwise stay in SDR, which is JPEG. The Z9 does not offer HEIF
						stills at all.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Sony (a7 IV, a7R V, a7C II, a7CR, a1, a1 II, a9 III, a6700, a7S III, a7 V and
							others):</strong
						> HEIF is a 10-bit, standard-range file that is roughly half the size of the equivalent JPEG,
						with HLG HDR as a separate switch. The best case for HEIF capture on any brand, if your software
						opens it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Fujifilm (X-T5, X-H2, X-H2S, X100VI, X-T50, X-E5, X-M5, X-T30 III, GFX100 II, GFX100S
							II):</strong
						> HEIF is a 10-bit, standard-range file up to 30% smaller than JPEG, but it forces sRGB, disables
						Clarity, and the camera itself warns about "limited options for viewing and sharing". Shoot
						it alongside RAW if you want the headroom; shoot JPEG if you deliver straight from camera.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Whatever you pick at capture, deliver JPEG. Client galleries, print labs, stock agencies and
				marketplaces are JPEG-gated, and the conversion is one deliberate step you control rather
				than something a gallery platform does to your files on upload. If your HEIF came from an
				iPhone rather than a camera, that is a <code>.HEIC</code> file and a different workflow: use
				the
				<a href="https://mochify.app/heic-to-jpeg">HEIC to JPG converter</a> and skip the camera menus
				below.
			</p>
		</section>

		<section id="ten-bit-is-not-hdr" class="scroll-mt-24">
			<SectionHeading>The thing the comparison articles miss: 10-bit is not HDR</SectionHeading>
			<p class="mb-4">
				A 10-bit file stores 1,024 brightness steps per color channel instead of JPEG's 256; an HDR
				file additionally uses a transfer curve (PQ or HLG) that maps those steps onto a far wider
				brightness range than a normal screen can show. Every camera HEIF is 10-bit. Only some of
				them are HDR, and which ones depends entirely on the brand.
			</p>
			<p class="mb-4">
				This matters because the two properties fail in different ways. A 10-bit standard-range
				HEIF, which is what Sony and Fujifilm write by default, looks exactly like the JPEG on any
				screen; the extra bits only show up when you push an edit and the sky does not band. Canon's
				own <a
					href="https://en.canon-cna.com/pro/infobank/image-file-types/"
					target="_blank"
					rel="noopener noreferrer">image formats page</a
				> is candid about it, listing "No perceptible difference from good quality JPEG on most monitors"
				as HEIF's main disadvantage. An HDR HEIF, which is what Canon and Nikon write, looks wrong on
				any screen or in any application that does not understand PQ or HLG: flat, washed out, too dark,
				or with highlights that read as clipped. Nikon's own guidance for HLG photos on a non-HDR monitor
				is that "highlights in HLG photos may seem washed out".
			</p>
			<p class="mb-4">
				Four of the seven comparison articles on page 1 of Google say HEIF is "16-bit". That is the
				ceiling of the container specification. Camera HEIF files are 10-bit, and the maker's manual
				says so in each case below. The same articles treat file size as a property of the format
				("40 to 50 percent smaller"). It is a property of the brand's encoder settings, and it
				ranges from nothing (Canon) to about half (Sony). The sections below take each maker's menu
				at its word.
			</p>
		</section>

		<section id="canon" class="scroll-mt-24">
			<SectionHeading>Canon: HEIF means HDR PQ, every time</SectionHeading>
			<p class="mb-4">
				On a Canon body, HEIF is only available when HDR shooting (PQ) is enabled, so choosing HEIF
				is choosing HDR capture, with the camera's screen showing you an SDR approximation of what
				an HDR display would render. The EOS R5 Mark II manual puts it in one line: "HEIF is
				available when [HDR shooting (PQ)] is set to [HDR PQ]", and the specification table marks
				JPEG as the format when HDR PQ is disabled and HEIF when it is on. There is no
				standard-range HEIF on a Canon.
			</p>
			<p class="mb-4">What that means in practice:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The file is BT.2100 / SMPTE ST 2084 (PQ).</strong> Canon's HDR PQ setting "enable[s]
						the camera to produce HDR images conforming to the PQ specification defined in ITU-R BT.2100
						and SMPTE ST.2084". Viewed on a monitor that does not understand PQ, it will not look like
						your JPEG would have.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The camera shows you an assist view, not the file.</strong> On the R5 the menu is
						[HDR PQ settings] → [HDR shooting] → [Enable], with [HDR assist disp: shooting] offering "Exposure
						prior. (mid-tones)" or "Tones prior. (highlights)". On the R6 Mark II, R7, R8, R10 and R50
						it is simply [HDR shooting] → [Enable]; on the R5 Mark II, R1 and R6 Mark III it is [HDR shooting
						(PQ)] → [HDR PQ], with a separate [HDR/C.Log View Assist]. The manual's caution applies to
						all of them: "Some scenes may look different from how they appear on an HDR display device."
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Expanded ISO goes away.</strong> "Expanded ISO speeds (L, H) are not available in
						HDR shooting."
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Burst depth drops a little.</strong> The R5 Mark II's own table lists a maximum burst
						of 760 frames for JPEG Large against 690 (CFexpress) or 640 (SD) for HEIF Large.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>File size is a wash.</strong> On the same table, JPEG Large is 13.0 MB and HEIF Large
						is 12.5 MB; on the original R5 it is 13.5 MB against 13.4 MB. Canon is spending the better
						compression on 10 bits and a wider range, not on a smaller file.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>RAW + HEIF works.</strong> Both files share a number and differ by extension: ".JPG
						for JPEG, .HIF for HEIF and .CR3 for RAW."
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The way back to a normal file is built in. The Playback menu has [HEIF→JPEG conversion],
				which "convert[s] HEIF images captured in HDR shooting and save[s] them as JPEG images",
				with the caveat that "Some scenes may look different after conversion" and that cropped
				images cannot be converted. On a computer, Digital Photo Professional is explicit about what
				you get: "When images displayed in HDR PQ mode are saved as separate JPEG or TIFF images,
				they are saved as SDR images", in sRGB, which "cannot be changed". Canon Europe's advice for
				anyone posting to social media or viewing on a standard screen is the same: convert to JPEG
				or TIFF first.
			</p>
			<p class="mb-4">
				<strong>Canon verdict:</strong> shoot HEIF if you deliver to HDR screens or want the 10-bit
				PQ file as a working master next to your RAW. If your output is galleries, prints and the
				web, HDR PQ buys you a conversion step and no space on the card. For the SDR conversion
				specifically,
				<a href="https://mochify.app/guides/does-hif-to-jpg-lose-quality"
					>what you lose going from Canon HDR PQ to JPEG</a
				> covers the tone-mapping.
			</p>
		</section>

		<section id="nikon" class="scroll-mt-24">
			<SectionHeading>Nikon: HEIF means HLG, and the Z9 has neither</SectionHeading>
			<p class="mb-4">
				Nikon ties the file format to the tone mode: SDR writes JPEG, HLG writes HEIF, and there is
				no way to get one without the other. The Z8 Reference Guide states it directly: "[SDR] ...
				Pictures taken while this option is selected are stored in JPEG format (extension "*.JPG")"
				and "[HLG] This mode supports HDR (high dynamic range). Pictures taken while this option is
				selected are stored in HEIF format (extension "*.HIF")." The same Tone Mode page appears in
				the Z6III and Z50II guides, and the Z f and Z5II spec sheets list HEIF and NEF (RAW)+HEIF.
			</p>
			<p class="mb-4">Two Nikon facts that the comparison articles get wrong:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The Z9 does not shoot HEIF stills.</strong> Its specification lists NEF (RAW) and
						JPEG only, HLG appears solely under video, and its Reference Guide (firmware 5.30) has no
						Tone Mode item. A widely shared 2026 article lists the Z9 among HEIF-capable bodies; Nikon's
						own pages say otherwise.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>"HE★" and "HE" are not HEIF.</strong> They are the High Efficiency compression options
						for NEF RAW files, alongside Lossless compression. The Z9 has them and no HEIF, which is the
						cleanest proof the two are unrelated.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Choosing HLG on a Z8 changes more than the container. From the Tone Mode page: the color
				space "is fixed at "BT.2100""; "ISO 400 is the lowest ISO sensitivity value available"; the
				Hi 0.3 to Hi 2.0 range is off; HLG pictures "exhibit more "noise" (in the form of
				randomly-spaced bright pixels, fog, and lines) than do pictures taken using [SDR]"; "[Active
				D-Lighting], [Multiple exposure], and [HDR overlay] are not available"; and the C15, C30,
				C60 and C120 release modes and Pre-Release Capture are unavailable. The viewfinder and
				monitor "may fail to accurately reproduce highlights and highly-saturated colors",
				SnapBridge "can be used to download but not to view HLG photos", and Nikon's system
				requirements for viewing them properly on a computer run to an HDR10-capable GPU and a
				DisplayHDR 1000 monitor or an Apple XDR display.
			</p>
			<p class="mb-4">
				There is also <strong>no in-camera HEIF to JPEG conversion on Nikon</strong>. The route back
				to a JPEG is RAW processing of the NEF, and the guide warns that JPEGs made from HLG-mode
				RAWs "may exhibit more "noise"" and come out "around 2 EV lower" in exposure than JPEGs from
				SDR-mode RAWs unless you correct them. On a computer, NX Studio's [Export] writes JPEG or
				TIFF copies; on Windows it first asks you to install Nikon's "Imaging Codec 01", which
				requires the camera's serial number. You can also shoot RAW + HEIF: "[RAW + JPEG/HEIF
				fine★]" records an NEF plus a HEIF copy when the tone mode is HLG.
			</p>
			<p class="mb-4">
				<strong>Nikon verdict:</strong> on a Z8, Zf, Z6III, Z5II or Z50II, "HEIF or JPEG" is really "HLG
				or SDR". Pick HLG for HDR delivery or an HDR master beside the NEF, and accept the ISO 400 floor,
				the noise, and a delivery workflow that goes through NX Studio or Lightroom. For everything else,
				stay in SDR and shoot JPEG, or RAW + JPEG.
			</p>
		</section>

		<section id="sony" class="scroll-mt-24">
			<SectionHeading
				>Sony: 10-bit SDR by default, HLG if you ask, and the HIF vs ARW question</SectionHeading
			>
			<p class="mb-4">
				Sony is the brand where HEIF is a straightforward upgrade over JPEG: a 10-bit file,
				standard-range unless you turn on HLG, at about half the size, with the same Creative Look
				applied. The catch is the one Sony prints in its own menu: "HEIF image files recorded with
				this camera cannot be displayed on other cameras that do not support the HEIF file format",
				and from its support site, "You may not be able to view or edit HEIF files depending on the
				computer or software."
			</p>
			<p class="mb-4">
				The menu is [JPEG/HEIF Switch], with three options described in the <a
					href="https://helpguide.sony.net/ilc/2230/v1/en/contents/TP0003027225.html"
					target="_blank"
					rel="noopener noreferrer">a7R V Help Guide</a
				>: JPEG "gives priority to compatibility"; HEIF(4:2:0) "gives priority to image quality and
				compression efficiency"; HEIF(4:2:2) "gives priority to image quality". Both HEIF options
				are 10-bit; 4:2:2 keeps twice the color resolution of 4:2:0, at a larger file. Then the line
				that settles the HDR question: "When recording in the HEIF format with [HLG Still Image] set
				to [Off], the color space is recorded in sRGB. When [HLG Still Image] is set to [On], it is
				recorded in the BT.2100 color space (BT.2020 color gamut)." So a Sony HEIF is a
				normal-looking sRGB file until you choose otherwise. dpreview's a7S III review made the
				comparison with Canon explicit: "unlike Canon, the Sony doesn't assume you're using the move
				to 10-bit to record lifelike HDR images."
			</p>
			<p class="mb-4">
				HLG Still Image, when you do want HDR, "can only be set when shooting in the HEIF format",
				is unavailable with RAW &amp; HEIF, and switches off D-Range Optimizer, Creative Look, DRO
				Bracket and Picture Profile. Converting an HLG file to JPEG in Imaging Edge Desktop "as is"
				means "gradations in highlight areas may be blown out"; Sony's software has a checkbox to
				apply a gamma that keeps the highlight tone. Imaging Edge Desktop is also the only Sony
				route from HEIF to JPEG (the standalone HEIF Converter was folded into it), and it cannot
				save back to HEIF after an edit.
			</p>
			<p class="mb-4">
				<strong>HIF vs ARW.</strong> This is the question Sony shooters actually type, and page 1 of Google
				for it is six forum threads. ARW is Sony's 14-bit RAW; HIF is the camera's processed, 10-bit output.
				Sony's own guidance on its File Format page is the honest version: "If you do not intend to edit
				the images on your computer, we recommend that you record in JPEG or HEIF format." RAW is for
				"process[ing] images on a computer for professional purposes." The numbers from the a7R V's recordable-images
				table, on a 64GB card at full 60M size: JPEG Extra fine 1,200 frames, HEIF Extra fine 2,500, lossless
				compressed RAW 680, uncompressed RAW 420. Divide 64GB by those counts and a HIF comes out around
				26 MB against 53 MB for the JPEG and 94 MB for the lossless RAW. On the a7 IV: 2,300 JPEG, 5,400
				HEIF, 1,200 lossless RAW.
			</p>
			<p class="mb-4">
				Two forum findings worth knowing before you flip the switch. First, a
				computational-photography researcher shooting an a7R V found that HIF's tonal resolution in
				the shadows was poorer than the JPEG's, because the camera's DRO was not re-tuned for the
				HIF contrast curve, and that HEIF in general was "getting used just to provide a higher
				absolute contrast". Second, early Lightroom support for Sony HIF (12.3 in 2023) corrupted
				files until 12.4, and Lightroom still will not treat a HIF as the RAW's sidecar on import
				the way it does a JPEG. Current Lightroom opens them fine; the pairing behavior is a
				workflow nuisance rather than a blocker.
			</p>
			<p class="mb-4">
				<strong>Sony verdict:</strong> HEIF(4:2:2) + RAW is the best-case HEIF workflow on any
				brand: half the JPEG size, 10-bit, standard-range, and a RAW to fall back on. Shoot
				HEIF-only if everything downstream of the card opens it; otherwise JPEG. Body-specific
				conversion steps are in
				<a href="https://mochify.app/guides/sony-hif-to-jpg">how to convert Sony HIF files to JPG</a
				>.
			</p>
		</section>

		<section id="fujifilm" class="scroll-mt-24">
			<SectionHeading>Fujifilm: 10-bit SDR only, with two things switched off</SectionHeading>
			<p class="mb-4">
				Fujifilm's HEIF is a 10-bit 4:2:2 standard-range file, and the camera is unusually frank
				about the trade: the <a
					href="https://fujifilm-dsc.com/en-int/manual/x-t5/menu_shooting/image_quality_setting/index.html"
					target="_blank"
					rel="noopener noreferrer">X-T5 manual</a
				> describes JPEG as "the widely-supported JPEG format" and HEIF as "a format with excellent compression
				but limited options for viewing and sharing." The menu is [IMAGE QUALITY SETTING] → [SELECT JPEG/HEIF],
				and the same page lists what changes when you pick HEIF:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						"Selecting [HEIF] disables [CLARITY] and sets [COLOR SPACE] to [sRGB]." If you shoot
						Adobe RGB JPEGs or lean on Clarity, HEIF takes both away.
					</p>
				</li>
				<li>
					<p class="mb-0">
						"[JPEG] is automatically selected in place of [HEIF] during filter-effect, panorama,
						multiple-exposure, and HDR photography." (On the X100VI, X-T50, X-E5, X-M5 and the GFX
						bodies the list is just multiple exposure.)
					</p>
				</li>
				<li>
					<p class="mb-0">
						"HEIF pictures are stored on the memory card as files with the extension ".HIF". Before
						the pictures can be viewed on a computer, the extension must be changed to ".HEIC". This
						occurs automatically when HEIF pictures are uploaded from the camera to a computer via
						USB." Copy the card with a reader instead and you get <code>.HIF</code> files that some software
						will not recognize until renamed.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				There is no HLG stills mode, so a Fujifilm HEIF is never HDR; dpreview's X-H2S review noted
				there is "no option to combine this mode with an HDR gamma mode", so "you can only shoot
				standard DR images". The specification line is "HEIF compliant (4:2:2, 10-bit)", and
				Fujifilm's product pages claim files "up to 30% smaller than standard JPEGs". RAW + HEIF is
				available ([FINE+RAW] records "both RAW and fine-quality JPEG or HEIF images"), and the
				escape hatch is in the Playback menu: [HEIF TO JPEG/TIFF CONVERSION], with JPEG, 8-bit TIFF
				and 16-bit TIFF as outputs.
			</p>
			<p class="mb-4">
				<strong>Fujifilm verdict:</strong> HEIF + RAW if you want a 10-bit film-simulation render as
				a working file and your editor is Lightroom or Affinity. JPEG if you deliver straight from
				camera, use Clarity or Adobe RGB, or copy cards with a reader into software that has not
				heard of
				<code>.HIF</code>. The Fujifilm-specific conversion routes are in
				<a href="https://mochify.app/guides/fujifilm-hif-to-jpg"
					>Fuji HIF to JPEG: X-T5, X-H2, X100VI</a
				>.
			</p>
		</section>

		<section id="what-breaks" class="scroll-mt-24">
			<SectionHeading>What breaks if you switch to HEIF</SectionHeading>
			<p class="mb-4">
				The camera is the easy part. What refuses a 10-bit camera HEIF in 2026 is a specific,
				checkable list, and it is longer on the delivery side than the editing side. Dates are when
				we read each vendor's page.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr
							><th>Link in the chain</th><th>Opens a camera HEIF (.HIF)?</th><th
								>Detail (vendor's own words)</th
							></tr
						>
					</thead>
					<tbody>
						<tr
							><td>Lightroom Classic, Lightroom, Camera Raw</td><td
								><strong>Yes</strong>, including 10-bit HDR</td
							><td
								>"support HEIF/.heic/HIF ... on macOS High Sierra v10.13 or later" and "on Windows
								10" (2026-04). HDR mode opens "10-bit HEIF (.HIF file extension) files from recent
								Canon, Nikon, and Sony cameras" (<a
									href="https://helpx.adobe.com/camera-raw/using/hdr-output.html"
									target="_blank"
									rel="noopener noreferrer">Adobe, 2026-01</a
								>). Cannot export HEIF.</td
							></tr
						>
						<tr
							><td>Capture One 16.8.6</td><td><strong>No</strong> for any camera HEIF</td><td
								>"Supported files include Apple HEIC and 8-bit HEIF images." / "10-bit HEIF/HEIC
								files that are generated by new cameras are not supported at the moment." (<a
									href="https://support.captureone.com/hc/en-us/articles/360002501237"
									target="_blank"
									rel="noopener noreferrer">Capture One, 2026-04</a
								>). Every camera in this guide writes 10-bit.</td
							></tr
						>
						<tr
							><td>Affinity Photo 2</td><td>Yes (Canon named)</td><td
								>"For Canon EOS models (1 DX MkIII, R5 and R6), HIF files (HDR 10-bit PQ-encoded)
								can be opened." No HEIF export.</td
							></tr
						>
						<tr
							><td>Photo Mechanic</td><td>Yes</td><td
								>Lists "HEIF, HIF"; previews HDR-PQ CR3 files since 2024.10 (Mac) and 2026.1
								(Windows).</td
							></tr
						>
						<tr
							><td>DxO PhotoLab 9</td><td>Not documented</td><td
								>DxO's support is described as iPhone "HEIC/HEIF and ProRAW"; camera <code
									>.HIF</code
								> is not mentioned. Treat as unsupported.</td
							></tr
						>
						<tr
							><td>Windows 11 Photos</td><td>Partly</td><td
								>Needs the free HEIF Image Extension plus the paid HEVC Video Extensions, which
								Microsoft says is required for ".heic, .hif or .heif" files. Owners report 10-bit
								Canon files and Sony 4:2:2 files still failing in Photos while 4:2:0 and phone files
								open.</td
							></tr
						>
						<tr
							><td>macOS Preview and Photos</td><td>Yes, with HDR caveats</td><td
								>HEIF since macOS 10.13. Canon HDR PQ files have been reported rendering dark in
								Preview, and a <code>.HIF</code> extension has tripped Preview errors that renaming
								to
								<code>.HEIC</code> fixed.</td
							></tr
						>
						<tr
							><td>Web browsers</td><td><strong>Safari only</strong></td><td
								>Safari 17+ displays HEIF; Chrome, Firefox, Edge and Opera do not. 14.63% of global
								users (<a href="https://caniuse.com/heif" target="_blank" rel="noopener noreferrer"
									>caniuse</a
								>). Never put a HEIF on a web page.</td
							></tr
						>
						<tr
							><td>Client galleries</td><td><strong>No</strong></td><td
								>ShootProof: "your files need to be JPEG (.jpg) files" (2026-09). Pixieset: JPEG and
								PNG (plus RAW on some plans). Pic-Time: JPG only. SmugMug and Zenfolio accept phone
								HEIC and convert it to JPEG on upload, discarding the original.</td
							></tr
						>
						<tr
							><td>Print labs</td><td><strong>No</strong></td><td
								>WHCC: "high-quality JPEG files with an RGB color profile". Bay Photo: JPG, PNG,
								TIFF, 8-bit. Nations Photo Lab: "This file type cannot be uploaded." Loxley (UK pro
								lab): "JPEG files only", 8-bit.</td
							></tr
						>
						<tr
							><td>Stock agencies</td><td><strong>No</strong></td><td
								>Shutterstock: "JPEG and TIFF formats" (2026-02). Adobe Stock: "JPEG with sRGB color
								profile" (2026-06).</td
							></tr
						>
						<tr
							><td>Marketplaces</td><td><code>.heic</code> yes, <code>.hif</code> unstated</td><td
								>eBay, Etsy and Shopify list <code>.heic</code> among accepted uploads; Amazon lists
								JPEG, TIFF, PNG and GIF only. None names <code>.hif</code> or says what it does with a
								10-bit file.</td
							></tr
						>
						<tr
							><td>Social and sharing</td><td>JPEG</td><td
								>Instagram's publishing API takes JPEG only; Flickr accepts HEIF through its app and
								converts it to JPEG.</td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Three patterns fall out of the table. Editing is mostly solved if you are on Adobe, and
				mostly not if you are on Capture One. Viewing is solved on a Mac and patchy on Windows.
				Delivery is not solved at all: there is no gallery, lab or stock agency in the list that
				takes a camera HEIF and keeps it as one. That is why the capture decision and the delivery
				decision are separate, and why every HEIF shooter ends up with a conversion step.
			</p>
			<p class="mb-4">
				If your HEIF files will not open on a PC at all, <a
					href="https://mochify.app/guides/open-heif-files-on-windows"
					>how to open HEIF files on Windows</a
				> walks through the codec and viewer fixes.
			</p>
		</section>

		<section id="file-sizes" class="scroll-mt-24">
			<SectionHeading>How much smaller are HEIF files, really?</SectionHeading>
			<p class="mb-4">
				It depends on the brand, from almost nothing on Canon to about half on Sony, and the only
				numbers worth repeating are the ones in each maker's manual. Here they are side by side.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr
							><th>Brand, body</th><th>JPEG (best quality, full size)</th><th>HEIF (same)</th><th
								>Saving</th
							><th>Source</th></tr
						>
					</thead>
					<tbody>
						<tr
							><td>Canon EOS R5 Mark II</td><td>13.0 MB</td><td>12.5 MB</td><td>4%</td><td
								>R5 Mark II specification table</td
							></tr
						>
						<tr
							><td>Canon EOS R5</td><td>13.5 MB</td><td>13.4 MB</td><td>1%</td><td
								>R5 specification table</td
							></tr
						>
						<tr
							><td>Sony a7R V (61 MP)</td><td>1,200 frames per 64GB (≈53 MB each)</td><td
								>2,500 frames (≈26 MB)</td
							><td>about half</td><td>a7R V recordable-images table; per-file figures derived</td
							></tr
						>
						<tr
							><td>Sony a7 IV (33 MP)</td><td>2,300 frames per 64GB (≈28 MB)</td><td
								>5,400 frames (≈12 MB)</td
							><td>about half</td><td>a7 IV recordable-images table; derived</td></tr
						>
						<tr
							><td>Fujifilm X-T5, X-H2, X-H2S</td><td>not published</td><td
								>"up to 30% smaller than standard JPEGs"</td
							><td>up to 30%</td><td>Fujifilm product pages</td></tr
						>
						<tr
							><td>Nikon Z8 and others</td><td
								>same nominal ratios (1:4 fine, 1:8 normal, 1:16 basic)</td
							><td>same</td><td>"reducing the amount of file data", no figure</td><td
								>Nikon spec pages and press release</td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Canon's own explanation is that "HEIF files are typically about the same size as JPEGs,
				because HEIF compression is 50% more effective than JPEG": the efficiency is spent on 10
				bits and PQ range rather than on bytes. Sony spends it on bytes: "the HEIF compression
				efficiency is about twice higher than that of JPEG", and its card tables bear that out. A Z8
				owner's informal comparison on dpreview ("the HEIF files are consistently smaller") matches
				Nikon's press-release wording without a number.
			</p>
			<p class="mb-4">
				Either way, a 26 MB Sony HIF or a 13 MB Canon one is still a large upload. Many free
				converters, including Mochify's free tier, cap at 20 MB or less per file, which the
				61-megapixel bodies exceed in JPEG and approach in HEIF; <a
					href="https://mochify.app/guides/photo-file-too-large-to-upload"
					>why camera files get rejected as too large</a
				> has the limits by tool and the fixes.
			</p>
		</section>

		<section id="heif-jpeg-or-raw" class="scroll-mt-24">
			<SectionHeading>HEIF, JPEG or RAW?</SectionHeading>
			<p class="mb-4">
				If you edit on a computer, shoot RAW and treat HEIF or JPEG as the preview file you also
				get; if you deliver straight from the card, HEIF or JPEG is the whole decision, and the
				sections above make it. The three formats are not three points on one scale.
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>RAW</strong> (CR3, NEF, ARW, RAF) is 14-bit sensor data with the white balance, picture
						profile, lens corrections and tone curve left undecided. It is the only format that lets you
						change those decisions later without loss. Sony's description is the useful one: "Select this
						format to process images on a computer for professional purposes."
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>HEIF</strong> is a processed file like a JPEG, with the camera's look baked in, but
						stored at 10 bits per channel and, on Canon and Nikon, with an HDR transfer curve. It survives
						a moderate edit (a stop of exposure, a curve on the sky) better than an 8-bit JPEG because
						there are four times as many tonal steps to spread the edit across. It does not survive a
						white balance change or a profile swap any better than a JPEG does, because those decisions
						were made before the file was written. dpreview's 10-bit explainer makes the point that 10-bit
						SDR files are "not stored in a manner that's designed for editing"; the headroom is real but
						modest.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>JPEG</strong> is the same processed file at 8 bits. It opens everywhere, uploads everywhere,
						prints everywhere.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				So the honest ranking for editability is RAW, then a large gap, then HEIF, then a small gap,
				then JPEG. The forum objection "you're losing valuable IQ if you're shooting HEIF just to
				export those to JPEG" is right about the double compression and wrong about the conclusion:
				if you shoot RAW + HEIF, the HEIF is a better preview and a better emergency file than a
				JPEG would have been, and the RAW is still there. If you shoot HEIF alone and deliver JPEG,
				you have traded universal compatibility for 10-bit headroom you may never use. That trade is
				worth it on a Sony (half the card space, standard-range file) and rarely worth it on a Canon
				(same card space, HDR file that needs converting before anyone can see it properly).
			</p>
		</section>

		<section id="workflow" class="scroll-mt-24">
			<SectionHeading>The workflow that gets you both</SectionHeading>
			<p class="mb-4">
				Shoot the highest-bit-depth file your camera offers, edit on that, and convert to JPEG
				exactly once, at delivery, with an encoder you chose. That is the whole workflow, and it
				keeps the HEIF decision from leaking into your client's inbox.
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>Capture: RAW + HEIF where the camera allows it, or HEIF alone on Sony and Fujifilm if
							card space matters more than a fallback.</strong
						> On Canon and Nikon, remember that the HEIF copy is HDR; shoot it when you want that, and
						shoot RAW + JPEG when you do not.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Cull and edit on the RAW or the HEIF.</strong> Lightroom and Camera Raw open every
						camera HEIF in this guide, including the HDR ones. Capture One users edit the RAW; the HEIF
						is dead weight there until Capture One ships 10-bit support.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Archive the HEIF or RAW.</strong> They are the negatives. A JPEG is a print.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Convert to JPEG at delivery, once.</strong> sRGB, full resolution for print, resized
						and compressed for galleries, the web and marketplaces. For Canon HDR PQ and Nikon or Sony
						HLG files, do the SDR conversion in software that understands the curve (DPP, NX Studio, Imaging
						Edge Desktop or Lightroom) so the highlights are mapped rather than clipped; for standard-range
						Sony and Fujifilm HEIFs, any good converter will do.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Deliver the JPEG, keep the HEIF.</strong> If a client asks for HDR, export a
						JPEG with a gain map or an AVIF from Lightroom;
						<a href="https://mochify.app/guides/why-hdr-photos-look-flat-when-shared"
							>why HDR photos look flat when shared</a
						> explains what survives which platform.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				The step most photographers skip is 4. Letting a gallery platform convert on upload means
				its encoder, its sRGB conversion and its quality setting, and the original is usually
				discarded. Doing it yourself takes a minute and gives you files you have looked at.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: HIF to delivery-ready JPEG</SectionHeading>
			<p class="mb-4">
				Mochify's job in this workflow is step 4: turning a folder of camera HEIFs into standard
				JPEGs (or AVIF and WebP for your own site) in one pass, with the metadata handling you
				choose. It accepts <code>.HIF</code> files from Canon, Sony and Fujifilm bodies along with
				<code>.HEIF</code>
				and <code>.HEIC</code>, detects the format from the file's contents rather than its
				extension (so a Fujifilm file renamed to <code>.HEIC</code> by the USB transfer is fine), and
				encodes JPEG with Google's jpegli encoder.
			</p>
			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>
			<p class="mt-6 mb-4">
				<strong>Two honest limits.</strong> First, the JPEG that comes out is a standard-range JPEG.
				A Canon HDR PQ or Nikon or Sony HLG file's HDR is not carried into it, and the maker's own
				software is the tested route for that SDR conversion, so for HDR files we recommend
				converting there or in Lightroom and using Mochify for the resize, compress and strip step
				on the result. Second, Mochify's HDR path adds an Ultra HDR gain map only to JPEG output,
				and for a file that has no gain map already (every camera HIF) the map is generated,
				"invented, not recovered" at roughly a stop and a half, so it is not a way to recover a
				camera's PQ or HLG range. Where it does help is after a Lightroom HDR export: a JPEG that
				already carries a gain map keeps it through a Mochify resize or crop when you ask for the
				HDR path (<code>--hdr</code> on the CLI, <code>hdr=true</code> on the API).
			</p>
			<p class="mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy note for images.</strong> On every surface, the image travels over HTTPS to
				<code>api.mochify.app</code>, is converted in memory, and is wiped immediately: no disk
				writes, no logs containing file data, and never used to train AI. The CLI and local MCP
				server write the result straight back to your disk with nothing retained; the hosted MCP
				server holds only the converted output behind a <code>files.mochify.app</code> link for about
				five minutes so the agent can fetch it. Images are not processed on your device, so we do not
				describe them as never leaving it; that is true only of Mochify's in-browser video tools.
			</p>
			<p class="mb-0">
				Ready to deliver? Convert a HIF batch now at <a href="https://mochify.app">mochify.app</a>.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr
							><th>Brand</th><th>What "HEIF" is on this camera</th><th>Menu</th><th
								>Switch it on when</th
							><th>Stay on JPEG when</th><th>Back to JPEG</th></tr
						>
					</thead>
					<tbody>
						<tr
							><td><strong>Canon</strong></td><td>10-bit <strong>HDR PQ</strong>, always</td><td
								>[HDR shooting (PQ)] → [HDR PQ] (R5 II, R1, R6 III); [HDR shooting] → [Enable]
								(others)</td
							><td>You want HDR stills; you have an HDR display and Lightroom, DPP or Affinity</td
							><td
								>Output is galleries, print, web; you use expanded ISO; you want smaller files (you
								will not get them)</td
							><td>In camera: [HEIF→JPEG conversion]; DPP saves SDR sRGB</td></tr
						>
						<tr
							><td><strong>Nikon</strong> (Z8, Zf, Z6III, Z5II, Z50II; not Z9)</td><td
								>10-bit <strong>HLG HDR</strong>, always (HLG tone mode)</td
							><td>[Tone mode] → [HLG]</td><td>HDR delivery or an HDR master beside the NEF</td><td
								>Base ISO matters (HLG floor is 400), Active D-Lighting, fast C-modes, SDR delivery</td
							><td>No in-camera HEIF→JPEG; RAW processing of the NEF, or NX Studio Export</td></tr
						>
						<tr
							><td><strong>Sony</strong></td><td
								>10-bit <strong>SDR</strong> (sRGB) by default; HLG optional</td
							><td>[JPEG/HEIF Switch] → HEIF(4:2:0) or HEIF(4:2:2); [HLG Still Image] separately</td
							><td>You want half the file size and 10-bit headroom; editor is Lightroom</td><td
								>Capture One; HEIF-only with no RAW; clients receive straight from card</td
							><td
								>Imaging Edge Desktop (JPEG 8-bit or TIFF 16-bit; HLG needs the highlight-gamma
								option)</td
							></tr
						>
						<tr
							><td><strong>Fujifilm</strong></td><td>10-bit 4:2:2 <strong>SDR</strong> only</td><td
								>[IMAGE QUALITY SETTING] → [SELECT JPEG/HEIF]</td
							><td>10-bit film-sim master beside RAW; up to 30% smaller</td><td
								>You use Clarity or Adobe RGB; you copy cards with a reader; Capture One</td
							><td>In camera: [HEIF TO JPEG/TIFF CONVERSION]</td></tr
						>
						<tr
							><td><strong>All brands</strong></td><td
								>Deliver <strong>JPEG</strong>, sRGB, converted once at delivery</td
							><td>n/a</td><td>n/a</td><td>n/a</td><td
								>Mochify: Magic Flow prompt, HIF to JPG converter, CLI, MCP or API</td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/" label="Try it free">
			Deliver JPEGs your gallery and lab will take: drop a batch of HIF files on Mochify and prompt <em
				>"convert these to JPEG, 3000px on the long edge, strip the location data"</em
			>. A standard-range JPEG, encoded with jpegli, processed in memory and wiped immediately after
			encoding.
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
