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

	// Built from content-ops `article-originals/blur-faces-license-plate-ai-assistant.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off.
	const metadata = {
		title: 'How to Blur Faces or a License Plate in a Photo (Ask Your AI Assistant)',
		seoTitle: 'Blur Faces in a Photo - Redacted by Your AI Assistant',
		description:
			'Ask your AI assistant to hide a license plate, faces or an address: it finds the area, Mochify redacts it and strips the metadata. Why fill beats blur.',
		category: 'AI & Automation',
		readTime: '22 min read',
		date: 'October 16, 2026',
		lastUpdated: 'October 19, 2026',
		bylineNote:
			'Written from two real redaction runs on October 16, 2026: a parked car with two plates, and a fifteen-person group photo where the detector found twelve.'
	};

	const keywords =
		'blur faces in photo, how to blur a face in a picture, blur part of image, redact image, blur license plate in photo, blur text in image, MCP server';

	const pageUrl = 'https://mochify.app/guides/blur-faces-license-plate-ai-assistant';

	const toc = [
		{ id: 'why-blur-fails', label: 'Why blurring is not the same as hiding' },
		{ id: 'five-words', label: 'Five words this guide uses' },
		{ id: 'ask-your-assistant', label: 'The fastest route: ask your assistant' },
		{ id: 'why-not-the-chatbot', label: 'Why not just ask the chatbot to black it out?' },
		{ id: 'faces', label: 'Faces: let the detector find them, then check its count' },
		{ id: 'crop-and-redact', label: 'Crop and redact in one pass' },
		{ id: 'fill-or-blur', label: 'Fill or blur: which one to ask for' },
		{ id: 'what-happens-to-the-file', label: 'What happens to the file' },
		{ id: 'rest-api', label: 'Doing it in bulk: the REST API' },
		{ id: 'when-not-needed', label: 'When you do not need any of this' },
		{ id: 'mochify-workflow', label: 'Mochify workflow: redact a photo from your assistant' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const plateCall = 'redactBoxes: [[0.155, 0.54, 0.205, 0.075], [0, 0.41, 0.045, 0.06]]\ntype: jpg';

	const facesCall = 'redactFaces: true\nredactStyle: blur\nwidth: 1200\ntype: jpg';

	const cropCall =
		'region: [0.02, 0.35, 0.74, 0.46]\nredactBoxes: [[0.155, 0.54, 0.205, 0.075]]\nredactStyle: blur\ntype: webp';

	const redactCode = [
		'# Hide a plate (fill) and a second small area, output JPG',
		'curl -X POST "https://api.mochify.app/v1/squish?type=jpg&redact=0.155,0.54,0.205,0.075;0,0.41,0.045,0.06" \\',
		'  -H "Authorization: Bearer $MOCHIFY_KEY" \\',
		'  -H "Content-Type: image/jpeg" \\',
		'  --data-binary @car.jpg -o car-redacted.jpg -D headers.txt',
		'',
		'# Hide every face, blur style, and crop to a region, output WebP at 1600 wide',
		'curl -X POST "https://api.mochify.app/v1/squish?type=webp&width=1600&region=0.02,0.35,0.74,0.46&redact=faces;0.155,0.54,0.205,0.075&redactStyle=blur" \\',
		'  -H "Authorization: Bearer $MOCHIFY_KEY" \\',
		'  -H "Content-Type: image/jpeg" \\',
		'  --data-binary @group.jpg -o group-redacted.webp -D headers.txt'
	].join('\n');

	const faqItems = [
		{
			q: 'Can an AI assistant blur faces in a photo?',
			a: 'Yes, if it is connected to a tool that edits pixels. With Mochify\'s hosted MCP server connected, you say "blur the faces" or "hide the plate"; the assistant locates the area, sends Mochify coordinates as fractions of the image, and Mochify returns a redacted copy with the metadata stripped. The assistant never edits the pixels itself and never receives the finished image, only a download link that lasts about five minutes.'
		},
		{
			q: 'Is blurring a license plate enough to hide it?',
			a: "Not reliably. Blurred and pixelated text can sometimes be reconstructed, which is why Mochify's default redaction style is a solid fill rather than a blur. Use blur only when you want the look and the plate does not actually need to stay secret."
		},
		{
			q: 'Does redaction remove the EXIF thumbnail too?',
			a: 'Yes. A redacted image always has its metadata stripped, even if you asked to keep it, because the EXIF block can contain a thumbnail of the unredacted picture. Any HDR gain map is removed for the same reason.'
		},
		{
			q: 'How accurate is the automatic face detection?',
			a: "It is best-effort and says so in every response. In our test on a fifteen-person group photo it found twelve faces and missed three that were small or turned side-on. Always compare the reported count with your own head count and add boxes for anyone it missed; the detector's faces and your boxes are hidden together in one call."
		},
		{
			q: 'Can I crop the photo without revealing the hidden area?',
			a: 'Yes. Redaction runs before the crop, and boxes are measured on the whole original image even when a crop region is set, so a crop can never uncover a hidden area. The response reports the pixel rectangle actually cut.'
		},
		{
			q: 'Does the photo leave my computer?',
			a: "Yes. Images are sent to <code>api.mochify.app</code> over HTTPS, processed in memory and wiped immediately; the hosted MCP server keeps the finished file for about five minutes so your download link works. Face detection runs on Mochify's own servers with no third-party service. What you were hiding is known to your assistant, not to Mochify, which receives only coordinates."
		},
		{
			q: 'Why not just ask ChatGPT or Claude to black out the plate?',
			a: 'Because a chatbot edits the copy its upload step made, not your file: in our measurements that copy had lost 80% to 94% of the pixels and all of the metadata before any model ran, and two of the five chatbots we tested return no file at all. With Mochify connected over MCP the assistant only decides where the box goes; Mochify applies it to the original you uploaded, so the result keeps every pixel you did not hide.'
		},
		{
			q: 'Can I redact a video or a PDF this way?',
			a: "No. Redaction is an image operation on <code>/v1/squish</code>. Mochify's video tools run in the browser and do not include redaction, and the PDF endpoint has no redaction operation."
		}
	];

	const related = [
		{
			title: 'How the Mochify MCP Server Works: Hosted vs Local',
			href: '/guides/how-the-mochify-mcp-server-works',
			desc: 'connecting the hosted server to your client, and what each surface returns.'
		},
		{
			title: 'Why We Relaxed Our Zero-Retention Policy for MCP',
			href: '/guides/why-we-relaxed-zero-retention-for-mcp',
			desc: 'the five-minute pickup store behind every hosted MCP download link, and why it exists.'
		},
		{
			title: 'The Risks of EXIF Data in Image Compression',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: "what a photo's metadata reveals, including the thumbnail that redaction always removes."
		},
		{
			title: 'Can ChatGPT Compress a Photo? We Measured What Comes Back',
			href: '/guides/can-chatgpt-compress-images',
			desc: 'the upload-step measurements behind section 4: what a chatbot actually receives when you attach a picture.'
		},
		{
			title: 'Image Compression Inside Claude Code: The Mochify CLI + MCP Guide',
			href: '/guides/image-compression-claude-code-cli-mcp',
			desc: 'the developer route for agents that work from a filesystem.'
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
		datePublished: '2026-10-16',
		dateModified: '2026-10-19',
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
			'image redaction',
			'face blurring',
			'license plates',
			'EXIF metadata',
			'MCP server',
			'Mochify API'
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
		datePublished: '2026-10-16',
		dateModified: '2026-10-19'
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
			<AccentTitle title={metadata.title} accent="Blur Faces" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			The fastest way to blur faces in a photo, or hide a license plate, an address label or a name
			badge, is to ask the AI assistant you already have open: <em>"hide the plate on this car"</em>
			or <em>"blur every face in this photo"</em>. With Mochify connected as an MCP server, the
			assistant looks at the picture, decides where the sensitive part is, and sends Mochify four
			numbers per area. Mochify replaces those pixels with a solid block (or a blur, if you insist),
			strips the metadata that could still show the original, and hands back a clean file. Nothing
			about <em>what</em> was hidden ever reaches us, only where.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			This guide shows the whole route with two real photos, explains why "just blur it" is weaker
			than people think, shows how to check the automatic face count instead of trusting it, and
			covers the API for anyone doing this in bulk.
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

		<section id="why-blur-fails" class="scroll-mt-24">
			<SectionHeading>Why blurring is not the same as hiding</SectionHeading>
			<p class="mb-4">
				A blur or a mosaic makes a face or a number hard for <em>you</em> to read; it does not reliably
				make it hard for software to read, and the file around the pixels can still carry the original.
				Three findings make the case.
			</p>
			<p class="mb-4">
				<strong>Blurred and pixelated faces can be re-identified.</strong> In 2016, researchers at
				Cornell Tech and the University of Texas trained ordinary image-recognition networks on
				obfuscated photos. On a 40-person test set, faces blurred with the same method YouTube uses
				were identified correctly 57.75% of the time on the first guess and 85.75% within five
				guesses, against chance rates of 2.5% and 12.5%. Faces pixelated into 16 x 16 mosaic blocks
				were identified 96.25% of the time (<a
					href="https://arxiv.org/abs/1609.00408"
					target="_blank"
					rel="noopener noreferrer"
					>McPherson, Shokri and Shmatikov, "Defeating Image Obfuscation with Deep Learning", arXiv
					2016</a
				>). The blur was never designed to resist a model that has seen a thousand blurred faces.
			</p>
			<p class="mb-4">
				<strong>Pixelated text can be read back.</strong> Depix, a proof-of-concept released in
				2020, recovers plaintext from pixelated screenshots by matching the mosaic blocks against
				renderings of candidate characters; it works on anything pixelated with a plain box filter,
				which is what most editors use (<a
					href="https://codeberg.org/spipm/Depixelization_poc"
					target="_blank"
					rel="noopener noreferrer">Depix on Codeberg</a
				>). A pixelated password, address or plate is a puzzle, not a wall.
			</p>
			<p class="mb-4">
				<strong>The file can keep the original even when the pixels are gone.</strong> In March 2023
				the "aCropalypse" bug (CVE-2023-21036) showed that Google Pixel's Markup tool had, for five
				years, saved cropped screenshots without truncating the file, so the end of the original
				image stayed inside the "cropped" PNG and could be partly restored (<a
					href="https://www.securityweek.com/google-pixel-vulnerability-allows-the-recovery-of-cropped-screenshots/"
					target="_blank"
					rel="noopener noreferrer">SecurityWeek, March 2023</a
				>). JPEGs have a quieter version of the same problem: the EXIF block usually holds a
				thumbnail of the picture as it was when the camera saved it, and an editor that blurs the
				main image and leaves the thumbnail alone has hidden nothing from anyone who opens the file
				in a metadata viewer.
			</p>
			<p class="mb-4">
				So "hide this" has three parts: replace the pixels with something that carries no
				information, throw away the metadata, and make sure no second copy of the picture is riding
				along inside the file. That is what Mochify's redaction does by default, and it is why the
				default is a solid fill rather than a blur.
			</p>
		</section>

		<section id="five-words" class="scroll-mt-24">
			<SectionHeading>Five words this guide uses</SectionHeading>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Redact</strong>: replace part of an image so the original content of that part
						cannot be read back. The verb lawyers use for black bars on documents, applied to
						pixels.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Fill</strong>: the redaction style that paints the area solid black. The
						default, and the only one that removes the information rather than smearing it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Blur</strong>: the cosmetic style. It looks softer, and blurred faces and text
						can sometimes be partly recovered (section 1), so it is for a look, not for secrecy.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Box</strong>: a rectangle to hide, given as four numbers: left edge, top edge,
						width and height. Mochify takes them as <em>fractions of the picture</em> from 0 to 1,
						measured from the top-left corner, never as pixels. <code>0.5, 0.64, 0.18, 0.06</code> means
						"start halfway across and 64% of the way down; cover 18% of the width and 6% of the height".
						The fractions are measured on the photo as it displays upright, so a phone photo stored sideways
						still gets the box where you see it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Region</strong>: a crop, given in the same four-number form. It runs
						<em>after</em> redaction, so cropping can never bring a hidden area back.
					</p>
				</li>
			</ul>
		</section>

		<section id="ask-your-assistant" class="scroll-mt-24">
			<SectionHeading>The fastest route: ask your assistant</SectionHeading>
			<p class="mb-4">
				Connect Mochify's hosted MCP server to an assistant that can see images (Claude Desktop,
				Cursor, or any client that supports remote MCP servers), attach the photo, and say what you
				want hidden in plain words. The assistant finds the thing; Mochify hides it. The split
				matters: the assistant is the only party that ever understands the picture, and all Mochify
				receives is coordinates. It works on every plan, including Free, because the MCP server is
				on every plan.
			</p>
			<p class="mb-4">
				The same split is why redaction by box lives on the two MCP surfaces and the REST API, and not
				in the <code>mochify</code> command-line tool or on the web app: something has to look at the
				picture and choose the box, and a command line or a text prompt cannot. Faces are the one
				exception. Mochify's own detector finds them without a box, so you can also ask for them in
				plain words on any Magic Flow surface, the web app included: "blur every face" or "black out
				every face". That route shows you no count, so look at the result and count the people
				yourself; for anyone it missed, or for anything that is not a face, you need the assistant
				route in this section. If you run the local MCP server (<code>mochify serve</code>) instead of the hosted one, the same instructions
				apply, with one difference in what comes back: the local server writes the finished file to
				disk and returns its path, with no download link and no pickup store.
			</p>
			<p class="mb-4">
				Here is the first real run, exactly as it happened on October 16, 2026, on a 571 x 640
				street photo of a parked Audi with a second car's plate just visible at the left edge.
			</p>
			<p class="mb-4">
				<strong>You say:</strong>
				<em>"Hide the license plates in this photo. I'm listing the car for sale."</em>
			</p>
			<p class="mb-4">
				<strong>The assistant does:</strong> looks at the image, measures the plate (it sits about
				15% in from the left and 54% down, roughly a fifth of the frame wide and 7% tall), notices
				the sliver of plate on the other car, and calls Mochify's <code>squish</code> tool with two boxes:
			</p>
			<CodeCard filename="squish-call.txt" code={plateCall} />
			<p class="mb-4">
				<strong>Mochify returns:</strong>
				<code>Image processed successfully (image/jpeg, 58.5 KB)</code>, a download link, and the
				line <code>Redacted 2 area(s).</code> Both plates are solid black. The car, the road and the trees
				are untouched, and the metadata is gone.
			</p>
			<p class="mb-4">
				<strong>The link is short-lived.</strong> The hosted MCP server hands back a URL on
				<code>files.mochify.app</code> that expires in about five minutes; the assistant does not receive
				the image bytes, only that URL, so your conversation never fills up with a base64 blob. Click
				it, save the file, done.
			</p>
			<p class="mb-4">
				<strong>If you attached the photo to the chat rather than pointing at a URL:</strong> the
				assistant sees the picture as pixels, not as a file, so it cannot forward your original by
				itself. It will call <code>create_upload</code> and give you a one-time upload link; drop the
				same photo on it and the assistant carries on with the returned upload id. The upload is deleted
				as soon as Mochify reads it, or after fifteen minutes if nothing does.
			</p>
			<p class="mb-4">
				<strong>The one broken case we hit, and its fix.</strong> On the first attempt at a small
				item in a large photo, an assistant judging the box on the whole frame tends to draw it too
				tight and leave a letter showing at the edge, which is not a hidden plate. The fix is in the
				tool's own instructions: cover the whole item with a small margin, and for a small item in a
				big photo, measure on a zoomed-in view. If the first result shows an edge, say
				<em>"the plate's right edge is still showing, widen the box"</em>: the assistant redraws,
				and the second call costs one more image from your allowance, nothing else.
			</p>
		</section>

		<section id="why-not-the-chatbot" class="scroll-mt-24">
			<SectionHeading>Why not just ask the chatbot to black it out?</SectionHeading>
			<p class="mb-4">
				Because the photo a chatbot edits is not the photo you attached. When we measured what five
				AI chatbots actually receive when you attach a picture, between 80% and 94% of the pixels
				were gone before any model ran, removed by the upload step along with the camera data, the
				GPS position, the color profile and the HDR gain map; from a 5712 x 4284 iPhone photo,
				ChatGPT worked on a 2048 x 1536 copy, Claude on 2576 x 1932 and Perplexity on 1440 x 1080,
				and Gemini and DeepSeek returned no file at all (the full test is in our guide to <a
					href="https://mochify.app/guides/can-chatgpt-compress-images"
					>what comes back when you ask ChatGPT to compress a photo</a
				>). We tested compression in that piece, not redaction, so we will not claim what each
				chatbot does when asked to draw a black box. What we can say is that if it draws one, it
				draws it on the shrunken copy, and the shrunken copy is what you get back: a redacted
				listing photo at a fifth of its pixels, or no file at all.
			</p>
			<p class="mb-4">
				The MCP route separates the two jobs so neither one degrades the other. The assistant looks
				at the reduced preview, which is all it needs to decide where the plate is, because the box
				is sent as fractions of the picture rather than pixels: a plate 15% in from the left edge of
				a 5712-pixel original is 15% in from the left edge of a 2048-pixel preview, and the chat
				platforms we measured scale proportionally without cropping, so every fraction stays where
				it was. What the preview does cost is precision on small items, which is why the assistant
				draws with a margin and you check the result. Mochify, meanwhile, works on the original
				bytes: the file at the public URL you pasted, or the original you dropped on the one-time
				upload link. In our first run the 571 x 640 source came back at 571 x 640 with two black
				boxes and nothing else changed; the group photo came back at 1200 wide only because we asked
				for that. The assistant's upload pipeline never touches the file Mochify receives, and that
				holds for any MCP client whose model can see a picture, whatever the model's own upload step
				does to it.
			</p>
			<p class="mb-4">
				It is also usually cheaper. The redaction is one tool call and one line of result text in
				the conversation, not an image generation; the finished file never enters the chat as pixels
				or as a base64 blob, so a batch of twenty listing photos costs twenty short tool calls, not
				twenty images' worth of tokens each way.
			</p>
		</section>

		<section id="faces" class="scroll-mt-24">
			<SectionHeading>Faces: let the detector find them, then check its count</SectionHeading>
			<p class="mb-4">
				For faces you do not need the assistant to draw anything: ask for the faces to be hidden and
				Mochify's own face detector finds them. It is best-effort, so the useful habit is to read
				the count it reports and add boxes for anyone it missed.
			</p>
			<p class="mb-4">
				The second real run used a group photo of fifteen people in front of a statue, at 2496 x
				1664 pixels.
			</p>
			<p class="mb-4">
				<strong>You say:</strong>
				<em>"Blur every face in this photo and resize it to 1200 wide."</em>
			</p>
			<p class="mb-4"><strong>The assistant calls:</strong></p>
			<CodeCard filename="squish-call.txt" code={facesCall} />
			<p class="mb-4">
				<strong>Mochify returns:</strong>
				<code
					>Redacted 12 area(s), 12 of them faces found by the detector (it can miss small or side-on
					faces).</code
				>
			</p>
			<p class="mb-4">
				Twelve of fifteen. The three it missed were the two people at the far left and far right of
				the standing row, both turned part-way from the camera, and one person standing beside the
				statue. The statue's own face was, correctly, not treated as a face. That is a typical
				result for a group photo: strong side profiles and small faces are exactly what the
				detector's own description says it can miss.
			</p>
			<p class="mb-4">
				<strong>The fix is one more sentence:</strong>
				<em>"It missed the man on the far left and the one on the far right. Cover them too."</em>
				The assistant keeps <code>redactFaces</code> on, adds two boxes of its own, and the next
				result reads
				<code>Redacted 14 area(s), 12 of them faces found by the detector</code>. (In our run the
				person beside the statue still showed, because we had not asked for him. Count the people
				yourself before you call it done.)
			</p>
			<p class="mb-4">
				Two things to take from this. First, the count is in the response for a reason: a <code
					>0</code
				>
				is a successful response that hid nobody, so an assistant, or a script, should check it rather
				than assume. Second, boxes and the detector combine in one call, so there is no need for a separate
				pass; the detector's faces and your boxes are all hidden together, with the detector's boxes padded
				for hair, ears and jawline.
			</p>
			<p class="mb-4">
				If faces are all you need hidden, you do not need an assistant at all. Drop the photo on the
				<a href="https://mochify.app/flow">Magic Flow page</a>, or use the prompt on any other Magic
				Flow surface, and ask for every face to be blurred or blacked out. The same detector runs, with
				the same misses, and that route reports no count, so the check is the picture itself. The
				assistant route earns its place the moment the detector misses someone: it can see the photo,
				draw the missing box, and send both in one call.
			</p>
		</section>

		<section id="crop-and-redact" class="scroll-mt-24">
			<SectionHeading>Crop and redact in one pass</SectionHeading>
			<p class="mb-4">
				If you also want the photo cropped, say so in the same request; the crop cannot uncover the
				redaction, because Mochify hides first and crops second.
			</p>
			<p class="mb-4">
				The third run on the Audi photo asked for a tighter picture of the car as a WebP, with the
				plate blurred this time:
			</p>
			<CodeCard filename="squish-call.txt" code={cropCall} />
			<p class="mb-4">
				<strong>Mochify returned</strong> a 423 x 294 pixel WebP of 10.3 KB, with
				<code>Cropped to region x,y,w,h = 11,224,423,294 px of the upright image</code> and
				<code>Redacted 1 area(s)</code>. The plate box was the same four numbers as before, measured
				on the <em>whole</em> photo, and it still landed exactly on the plate inside the crop.
			</p>
			<p class="mb-4">
				That last detail is the rule to remember: <strong
					>boxes are always fractions of the full, upright, original image, even when a region is
					set.</strong
				>
				The assistant does not have to re-measure anything after deciding on a crop, and a box can never
				be invalidated by one. The response also tells you the pixel rectangle actually cut, because fractions
				round and a box that runs past the edge is trimmed to the image.
			</p>
			<p class="mb-4">
				Width and height, smart crop and rotation all apply to the cropped region, so <em
					>"crop to the car, hide the plate, make it 1600 wide, convert to WebP"</em
				> is one call and one image from your allowance.
			</p>
		</section>

		<section id="fill-or-blur" class="scroll-mt-24">
			<SectionHeading>Fill or blur: which one to ask for</SectionHeading>
			<p class="mb-4">
				Ask for a fill when the content must stay secret; ask for a blur only when you want the
				softer look and can live with the chance of recovery. Fill is the default, so if you say
				nothing you get the safe one.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Style</th><th>Fill (default)</th><th>Blur</th></tr></thead>
					<tbody>
						<tr>
							<td>What happens to the pixels</td>
							<td>Replaced with solid black</td>
							<td>Smeared; some structure survives</td>
						</tr>
						<tr>
							<td>Recoverable?</td>
							<td>The information is gone from the pixels</td>
							<td>Sometimes partly, for text and faces (section 1)</td>
						</tr>
						<tr>
							<td>Use it for</td>
							<td
								>Plates, addresses, documents, screens, children's faces, anything you would lose
								sleep over</td
							>
							<td>A casual photo where a black block looks heavy and nobody is at risk</td>
						</tr>
						<tr>
							<td>Metadata and HDR</td>
							<td>Stripped and removed</td>
							<td>Stripped and removed (same rule, both styles)</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				The decision is about the threat, not the taste. A plate on a car you are selling to a
				stranger, a delivery label in a product photo, a screen in an office shot: fill. A crowd at
				a street party where you are being polite rather than protecting anyone: blur is fine. If
				you are not sure, you were not sure for a reason. Fill.
			</p>
		</section>

		<section id="what-happens-to-the-file" class="scroll-mt-24">
			<SectionHeading>What happens to the file</SectionHeading>
			<p class="mb-4">
				A redacted image is processed like every other image Mochify handles, in memory with nothing
				kept, plus two guarantees that exist only because redaction needs them. Here is the whole
				path for the hosted MCP route.
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>The assistant sends the image and the coordinates to <code>api.mochify.app</code
							>.</strong
						>
						The image does travel to our servers over HTTPS; this is not an on-device operation, and no
						honest guide should tell you otherwise. It is streamed into the encoder in RAM, never written
						to disk, and never appears in a log.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Face detection, if requested, runs on Mochify's own servers with Mochify's own
							detector.</strong
						> No third-party vision service sees the photo.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>The redaction is applied first, then any crop, resize, rotation or format change.</strong
						>
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>The output always has its metadata stripped, even if the request asked to keep it.</strong
						>
						EXIF can hold a thumbnail of the unredacted picture, so a redacted file is never allowed to
						carry one. The same rule removes any HDR gain map, because a gain map is a second, lower-resolution
						image of the scene and could show what the main image hides. If you need HDR or metadata preserved,
						that is a different job from redaction; do it on a copy you are not redacting.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The original is wiped as soon as the encode finishes.</strong> On the hosted MCP
						server, the finished file waits in a pickup store under an unguessable name for about
						five minutes so the download link works, then it is evicted whether you fetched it or
						not. On the local MCP server (<code>mochify serve</code>) and the REST API there is no
						pickup store: the bytes come straight back to your machine and nothing is held at all.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				And the part that is easy to miss: the <em>meaning</em> of the redaction never reaches
				Mochify. The assistant knows it was hiding a plate, a face or a signature. Mochify receives
				<code>0.155, 0.54, 0.205, 0.075</code> and a style. We do not know what was there, and we
				could not reconstruct it afterwards even if asked, because by then there is nothing to
				reconstruct from. The same in-memory model is described on our
				<a href="https://mochify.app/architecture">architecture and data handling page</a>, and the
				processor obligations behind it are in the
				<a href="https://mochify.app/dpa">Data Processing Agreement</a>.
			</p>
		</section>

		<section id="rest-api" class="scroll-mt-24">
			<SectionHeading>Doing it in bulk: the REST API</SectionHeading>
			<p class="mb-4">
				If you have your own vision model, or a folder of a thousand listing photos, the same
				redaction is three query parameters on <code>POST /v1/squish</code>: <code>redact</code>,
				<code>redactStyle</code> and <code>region</code>. The API was built for exactly the split
				described above: your code picks the boxes, Mochify receives four numbers.
			</p>
			<CodeCard filename="redact.sh" code={redactCode} />
			<p class="mb-4">Read the response headers, not just the body:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<code>X-Mochify-Redacted</code>: how many areas were hidden, your boxes plus any faces
						found.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<code>X-Mochify-Redacted-Faces</code>: how many faces the detector found. Present only
						when
						<code>redact</code> includes <code>faces</code>; a <code>0</code> is a successful response
						that hid no faces, so a pipeline should treat it as "check this one by hand", not as "done".
					</p>
				</li>
				<li>
					<p class="mb-0">
						<code>X-Mochify-Region</code>: the pixel rectangle actually cut, when
						<code>region</code> was set.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Rules the API enforces: up to 64 areas per request; every value is a fraction from 0 to 1,
				and any value above 1 is rejected with a <code>400</code> rather than silently treated as a
				pixel coordinate; a box that runs past an edge is trimmed; <code>redactStyle</code> requires
				<code>redact</code>. Each request is one image from your plan's allowance, with or without
				redaction. The full parameter table is on the
				<a href="https://mochify.app/docs">API documentation page</a>.
			</p>
			<p class="mb-4">
				For a marketplace seller with a hundred photos and no code, the assistant route in section 3
				handles a batch the same way: <em>"hide the plates in all of these"</em>, one call per
				image, one line of results per image to read through.
			</p>
		</section>

		<section id="when-not-needed" class="scroll-mt-24">
			<SectionHeading>When you do not need any of this</SectionHeading>
			<p class="mb-4">
				You do not need redaction when nothing identifying is in the frame, or when the identifying
				thing is the point of the picture. A product on a white background, a landscape, a
				screenshot of your own code: compress and convert as usual and move on. The
				<a href="https://mochify.app/flow">Magic Flow page</a> does that job in one sentence and never
				touches the pixels you did not mention.
			</p>
			<p class="mb-4">
				You also do not need Mochify for a single casual photo where a quick smudge on your phone is
				good enough and nobody is at risk. The route in this guide earns its keep when the hidden
				thing matters (a plate, a child, an address, a document), when there are many photos, or
				when the redaction has to be reliable enough to defend later, because then the metadata, the
				thumbnail and the recoverability of a blur all start to matter, and a fill from a tool that
				strips everything is the only version you can stand behind.
			</p>
			<p class="mb-4">
				And it does not cover video. Mochify's video tools run in your browser and do not include
				redaction; blurring faces in a video is a different job and this guide does not claim to do
				it.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: redact a photo from your assistant</SectionHeading>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>Connect an MCP server once.</h3>
						<p>
							Add <code>https://mcp.mochify.app</code> as a remote MCP server in your client and
							sign in when the browser window opens; the
							<a href="https://mochify.app/guides/how-the-mochify-mcp-server-works"
								>hosted-versus-local MCP guide</a
							>
							walks through the clients, and through <code>mochify serve</code> if you would rather
							run the local server (<code>mochify auth login</code> once, then a three-line config entry).
							The hosted server returns a short-lived download link rather than image bytes; the local
							server returns a file path.
						</p>
					</li>
					<li>
						<h3>Attach the photo, or paste a public URL to it.</h3>
						<p>
							For an attached photo, expect the assistant to hand you a one-time upload link and ask
							you to drop the same file on it; that is how it forwards your original without ever
							holding the bytes itself.
						</p>
					</li>
					<li>
						<h3>Say what to hide, in the words you would use to a person.</h3>
						<p>
							<em>"Hide the license plate"</em>, <em>"blur all the faces"</em>,
							<em>"black out the address on the parcel"</em>,
							<em>"cover the name badge and crop to the two people on the left"</em>. Say "blur"
							only if you want the cosmetic style; otherwise you get the solid fill.
						</p>
					</li>
					<li>
						<h3>Read the result line.</h3>
						<p>
							<code>Redacted N area(s)</code>, and for faces, how many the detector found. Count the
							people, plates or labels yourself and compare.
						</p>
					</li>
					<li>
						<h3>Fix any miss with a sentence.</h3>
						<p>
							<em>"It missed the person on the far right"</em> or
							<em>"widen the box on the plate"</em>. The next call hides the detector's faces and
							the new boxes together.
						</p>
					</li>
					<li>
						<h3>Save the file from the link within five minutes.</h3>
						<p>
							The link expires, the pickup copy is evicted, and nothing else is kept. The saved file
							has no metadata and no HDR gain map, by design.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				Privacy note for this workflow: the photo travels to <code>api.mochify.app</code> for the redaction
				and the encode, is processed in RAM and wiped immediately, and the finished file sits in the hosted
				MCP pickup store for about five minutes; the assistant only ever receives the download URL. Face
				detection runs on Mochify's servers with no third-party service. What the hidden area contained
				is known to your assistant and to you, never to Mochify.
			</p>
			<p class="mb-4">
				Ready to try it on a real listing? Connect the server, attach the photo, and ask. If you
				would rather start with plain compression and conversion, <a href="https://mochify.app"
					>mochify.app</a
				> does that in the browser with the same in-memory handling.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>You want</th><th>Say to your assistant</th><th>What the tool call carries</th><th
								>Check in the result</th
							></tr
						></thead
					>
					<tbody>
						<tr>
							<td>Hide a plate, label, screen or badge</td>
							<td>"Hide the license plate"</td>
							<td><code>redactBoxes: [[x, y, w, h]]</code> (fractions 0-1, top-left origin)</td>
							<td><code>Redacted 1 area(s)</code> and a black block with a margin</td>
						</tr>
						<tr>
							<td>Hide every face</td>
							<td>"Blur / hide all the faces"</td>
							<td><code>redactFaces: true</code></td>
							<td>The faces-found count against your own head count</td>
						</tr>
						<tr>
							<td>Faces plus something the detector cannot know</td>
							<td>"Hide the faces and the address on the box"</td>
							<td><code>redactFaces: true</code> + <code>redactBoxes</code></td>
							<td>Areas = faces found + your boxes</td>
						</tr>
						<tr>
							<td>A softer look, nothing at stake</td>
							<td>"Blur, not black"</td>
							<td><code>redactStyle: blur</code></td>
							<td>Remember it can be partly undone</td>
						</tr>
						<tr>
							<td>Crop as well</td>
							<td>"Crop to the car, keep the plate hidden"</td>
							<td><code>region: [x, y, w, h]</code> + the same boxes</td>
							<td
								><code>Cropped to region …</code> in pixels; boxes still measured on the full image</td
							>
						</tr>
						<tr>
							<td>Keep metadata or HDR</td>
							<td>Not possible on a redacted file</td>
							<td>Stripped and removed, always</td>
							<td>Do it on an unredacted copy instead</td>
						</tr>
						<tr>
							<td>Bulk or your own vision model</td>
							<td>REST API</td>
							<td><code>redact=faces;x,y,w,h&amp;redactStyle=fill&amp;region=x,y,w,h</code></td>
							<td
								><code>X-Mochify-Redacted</code>, <code>X-Mochify-Redacted-Faces</code>,
								<code>X-Mochify-Region</code></td
							>
						</tr>
						<tr>
							<td>Limits</td>
							<td>n/a</td>
							<td>64 areas per image; values 0-1, above 1 is a 400</td>
							<td>One image of allowance per call</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/guides/how-the-mochify-mcp-server-works" label="Connect the MCP server">
			Ready to hide the plate, the faces or the label in the photo you were about to upload? Connect
			the Mochify MCP server to your assistant and ask for it in plain words:
			<em>"hide the license plate and crop to the car"</em>. The redaction lands on your original
			file, with the metadata stripped and nothing kept.
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

	/* Workflow steps: the handoff authors each step title as an <h3>, so this
	   is a plain list rather than StepList (whose titles are <p>). */
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

</style>
