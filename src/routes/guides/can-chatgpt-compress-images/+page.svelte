<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
	import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
	import GuideSchema from '$lib/components/GuideSchema.svelte';

	// Built from content-ops `article-originals/can-chatgpt-compress-images.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off: the body cross-links them with #anchors.
	const metadata = {
		title: 'Can ChatGPT Compress a Photo? We Measured What Comes Back',
		seoTitle: 'Can ChatGPT Compress Images? - What Comes Back, Measured',
		description:
			'One 24 MP iPhone photo, five AI chatbots, every returned file measured. The compression happened at upload, before any model saw it. What comes back.',
		category: 'AI & Automation',
		readTime: '29 min read',
		date: 'October 16, 2026',
		bylineNote:
			"Every figure comes from one iPhone 15 photo attached to each platform on October 15, 2026 and measured by script; the chatbots' statements are quoted from that test, not from their documentation."
	};

	const keywords =
		'can chatgpt compress images, does chatgpt compress images, chatgpt reduce image quality, chatgpt image upload limit, compress a photo with ai, ask chatgpt to compress a photo, chatgpt resize image, exif stripped on upload';

	const pageUrl = 'https://mochify.app/guides/can-chatgpt-compress-images';

	const toc = [
		{
			id: 'short-answer',
			label: 'Can ChatGPT compress images? The short answer, platform by platform'
		},
		{ id: 'five-words', label: 'Five words this guide uses' },
		{ id: 'how-we-tested', label: 'How we tested' },
		{ id: 'the-upload', label: 'Step one happens before the model: the upload' },
		{ id: 'the-compression', label: "Step two: what the chatbot's compression actually did" },
		{ id: 'what-went-missing', label: 'What went missing that nobody mentioned' },
		{
			id: 'wrong-number',
			label: 'Why the chatbot told you the wrong number (and how to check)'
		},
		{ id: 'when-fine', label: 'When the chat route is fine, and when it is not' },
		{ id: 'mochify-workflow', label: 'Mochify workflow: compress the photo you actually have' },
		{ id: 'surface-split', label: 'Three routes that give an assistant the real file' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const faqItems = [
		{
			q: 'Can ChatGPT compress a photo?',
			a: 'Yes. Attach a JPG or PNG and ask for a smaller file, and ChatGPT will re-encode it in its code sandbox and offer a download. In our October 2026 test a 10 MB iPhone photo came back as an 898 KB JPEG. But the photo was resized to 2048 x 1536 at upload, before ChatGPT saw it, so the result has 13% of the original pixels and the "45% saving" ChatGPT reported was measured against that reduced copy.'
		},
		{
			q: 'Does ChatGPT reduce image quality when you upload a photo?',
			a: 'Yes, for uploaded photos: OpenAI\'s help center states that images are "resized before analysis, affecting their original dimensions", and our 5712 x 4284 photo arrived as 2048 x 1536. This is separate from complaints about the quality of images ChatGPT <em>generates</em>, which is a different limit. The resize affects every image you attach, whether or not you ask for compression.'
		},
		{
			q: 'Does ChatGPT strip EXIF and GPS data from photos?',
			a: 'In our test the file ChatGPT received had no EXIF at all, and OpenAI documents that the model "doesn\'t process original file names or metadata". So the camera, date and GPS were not in the file we got back. ChatGPT, asked directly, reported that it had stripped nothing, which was true of its own step. Treat metadata removal as likely but undocumented, and do not rely on it either way.'
		},
		{
			q: 'Why is my photo blurry or smaller after ChatGPT compressed it?',
			a: 'Because two reductions happened, not one. The upload step cut the dimensions (to 2048 pixels on the long edge in our test), and the compression step then encoded the smaller picture at a lower JPEG quality. At phone size it looks fine; at 1:1 or in print the missing pixels show. Ask ChatGPT for the exact dimensions of the file it received and you will see the first reduction.'
		},
		{
			q: 'Which AI chatbot compresses photos best?',
			a: 'On October 15, 2026, Claude kept the most pixels (2576 x 1932), ChatGPT kept 2048 x 1536, and Perplexity kept 1440 x 1080; Gemini and DeepSeek returned no file and recommended other tools. Every one of the three returned files is standard dynamic range, untagged sRGB, with no metadata. None kept the photo you attached as an image (ChatGPT did when it arrived inside a .zip), so "best" here means "least reduced", and the honest answer is that a dedicated compressor that receives the original file is in a different category.'
		},
		{
			q: 'How do I compress a photo without losing quality or resolution?',
			a: 'Use a tool that receives the whole file and lets you decide the trade. In Mochify, drop the photo at mochify.app/flow and type "compress this photo, keep it as a JPG": our test file came back at the full 5712 x 4284 and 4.4 MB (56% smaller). Add "keep the HDR profile" to carry the gain map through, or name a target like "under 1 MB" and check the result at 1:1, since a hard target on a detailed photo is met by reducing dimensions.'
		},
		{
			q: 'Can ChatGPT compress a PDF or a video?',
			a: "We tested photos only, so we cannot say what the upload step does to a PDF or a video on any chat platform. On Mochify, PDF compression (recompressing the images inside a PDF while the text stays searchable) is available on the paid plans and the Day Pass, and each PDF compressed counts as one image against the plan's monthly allowance, however many images are inside it. Video compression is a web app feature that runs entirely in your browser, so the video never leaves your device."
		},
		{
			q: 'Does the ".zip trick" keep the full resolution in ChatGPT?',
			a: 'Yes, on the day we tested it (October 15, 2026). Attaching the same 24 MP photo inside a .zip archive bypassed the image pipeline: ChatGPT\'s sandbox received the original 10 MB and returned a 5712 x 4284 JPEG at 5.6 MB, 44% smaller, with the Display P3 profile kept, the EXIF removed by ChatGPT\'s own script (it said so), and the HDR gain map dropped. We tried it once, on ChatGPT only; it is an undocumented side door, so run the "what exactly did you receive" check each time rather than assuming it still works.'
		}
	];

	const related = [
		{
			title: 'LLM Image Token Costs: How Many Tokens Does an Image Use?',
			href: '/guides/llm-image-token-costs',
			desc: 'The per-provider resize tiers and token formulas behind the ceilings measured here.'
		},
		{
			title: 'How to Reduce Photo File Size on iPhone: The Fast Way and the Built-In Way',
			href: '/guides/reduce-photo-file-size-iphone',
			desc: "Mochify's size target against Preview, Files, Shortcuts and Mail, with the file-size-or-dimensions question answered."
		},
		{
			title: 'The Risks of EXIF Data in Image Compression',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: "What a photo's metadata reveals and how to control it deliberately rather than by accident."
		},
		{
			title: 'Why HDR Photos Look Flat When You Share Them (and How Gain Maps Fix It)',
			href: '/guides/why-hdr-photos-look-flat-when-shared',
			desc: 'The gain map every chat route dropped, explained.'
		},
		{
			title: 'Image Compression Inside Claude Code: The Mochify CLI + MCP Guide',
			href: '/guides/image-compression-claude-code-cli-mcp',
			desc: 'The agent-with-a-filesystem route that never puts the photo in the conversation.'
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
		datePublished="2026-10-16"
		article={{
			about: ['ChatGPT', 'Claude', 'Perplexity', 'Gemini', 'DeepSeek', 'image compression', 'image upload pipelines', 'EXIF metadata', 'Display P3', 'Ultra HDR gain maps', 'Magic Flow'],
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
			<AccentTitle title={metadata.title} accent="ChatGPT" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			Can ChatGPT compress a photo? Yes: attach a JPG, ask for a smaller file, and ChatGPT, Claude
			and Perplexity will each hand you one back (Gemini and DeepSeek will not; they point you to
			another tool). But the compression you asked for is not the compression you get. We attached
			one 24-megapixel iPhone photo to five AI chatbots on the same afternoon, asked each to
			compress it, and measured every returned file with a script. Between 80% and 94% of the pixels
			were gone before any model, prompt or line of code ran, removed by the upload step, and so
			were the camera data, the GPS position, the Display P3 color profile and the HDR gain map.
			Every chatbot then compressed what was left, reported a saving of "45%" or "60%" against that
			already-reduced copy, and, when asked, told us in good faith that nothing had been stripped.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			This guide shows the numbers, explains why the chatbots got their own numbers wrong, tests the
			one chat workaround that keeps the pixels, says when the chat route is perfectly fine anyway,
			and shows how to compress the actual file when the pixels matter.
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
			<SectionHeading
				>Can ChatGPT compress images? The short answer, platform by platform</SectionHeading
			>
			<p class="mb-4">
				Three of the five chatbots we tested can return a compressed JPG; two cannot return a file
				at all; and none of the three that can ever saw the photo you attached. Here is what each
				one did with a 10,044,627-byte, 5712 x 4284 iPhone 15 photo on October 15, 2026.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>Chatbot (as tested)</th><th>Returns a file?</th><th>What it actually received</th
							><th>What it gave back</th><th>What it told us</th></tr
						></thead
					>
					<tbody>
						<tr
							><td>ChatGPT (Free, default model)</td><td>Yes</td><td
								>2048 x 1536, 1.64 MB (13% of the pixels)</td
							><td>2048 x 1536, 898 KB</td><td>"1.64 MB to 898 KB, 45%"</td></tr
						>
						<tr
							><td>Claude (claude.ai, Sonnet 5.5)</td><td>Yes</td><td
								>2576 x 1932, 1.78 MB (20% of the pixels)</td
							><td>2576 x 1932, 961 KB</td><td>"1.78 MB to about 0.96 MB, roughly 46%"</td></tr
						>
						<tr
							><td>Perplexity (Pro)</td><td>Yes</td><td>1440 x 1080, 1.37 MB (6% of the pixels)</td
							><td>1440 x 1080, 553 KB</td><td>"1.37 MB to 553 KB, approximately 60% smaller"</td
							></tr
						>
						<tr
							><td>Gemini (3.6 Flash; 3.8 Flash on Oct 16)</td><td>No</td><td>not reported</td><td
								>nothing; recommended Preview, Paint, TinyJPG, Squoosh</td
							><td>n/a</td></tr
						>
						<tr
							><td>DeepSeek (free)</td><td>No</td><td>not reported</td><td
								>nothing; recommended Squoosh, TinyPNG, iLoveIMG, Preview, ImageMagick, Pillow</td
							><td>n/a</td></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				We re-checked Gemini on 3.8 Flash, the current Flash model, on October 16, 2026, with a
				different image (a PNG graphic rather than the iPhone photo): the same result, no file
				returned, and a list of other tools instead (Squoosh, TinyJPG, TinyPNG, Paint, Preview and a
				Python script using Pillow).
			</p>
			<p class="mb-4">
				The returned files are 90% to 95% smaller than the photo on disk, which sounds like a
				triumph until you notice how: by discarding resolution you did not ask to lose, before the
				model got involved. The chatbot's own compression step removed 29% to 60% of what remained.
				If you wanted "the same photo, smaller file", none of the three delivered it. If you wanted
				"small enough to email", all three did, and that is a legitimate use we come back to in
				<a href="#when-fine">section 8</a>.
			</p>
			<p class="mb-4">
				The pattern is the same whichever assistant you ask, so the rest of this guide treats
				"ChatGPT" as the lead example and names the others where they differ.
			</p>
		</section>

		<section id="five-words" class="scroll-mt-24">
			<SectionHeading>Five words this guide uses</SectionHeading>
			<p class="mb-4">
				The whole story turns on the difference between a photo's size in pixels and its size in
				bytes, so it is worth pinning down five terms before the numbers.
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Pixel dimensions</strong> are the width and height of the picture, for example 5712
						x 4284. Multiply them and you get megapixels (24.5 MP here). Dimensions decide how large a
						photo can be printed or zoomed before it looks soft.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>File size</strong> is how many bytes the photo takes up on disk, for example 10
						MB. File size depends on dimensions <em>and</em> on how aggressively the JPEG encoder squeezed
						the pixels. Two photos with identical dimensions can differ in file size by ten times.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Resampling</strong> (resizing) throws pixels away or invents them. Going from 5712
						to 2048 wide keeps about one pixel in eight. It is the cheapest way to make a file smaller
						and the one that cannot be undone.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>EXIF</strong> is the metadata block a camera writes into the file: make and
						model, date, exposure, and often the GPS position. Our EXIF guide covers
						<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
							>what a photo's metadata gives away</a
						>.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Color profile and gain map</strong> are two further blocks of data riding inside
						an iPhone JPEG. The profile (Display P3 on recent iPhones) tells software how to
						interpret the colors. The gain map is what lets the photo show brighter-than-white
						highlights on an HDR screen; we explain it in
						<a href="https://mochify.app/guides/why-hdr-photos-look-flat-when-shared"
							>why HDR photos look flat when shared</a
						>.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Hold on to the first two. "Compress" in everyday speech means "make the file smaller". To a
				chatbot's upload pipeline it means "make the picture smaller", and nobody tells you which
				one you got.
			</p>
		</section>

		<section id="how-we-tested" class="scroll-mt-24">
			<SectionHeading>How we tested</SectionHeading>
			<p class="mb-4">
				One file, one day, one script. We used a single photo so that every platform started from
				the same bytes, and we measured every returned file the same way rather than trusting any
				chatbot's description of it.
			</p>
			<p class="mb-4">
				<strong>The photo.</strong> <code>IMG_4522.JPG</code>, taken on an iPhone 15 on October 15,
				2026: 10,044,627 bytes, 5712 x 4284 pixels (24.47 MP), Display P3 color profile, Apple's HDR
				gain map stored as a second frame inside the file, and a full EXIF block with camera model,
				timestamp and GPS. A completely ordinary modern phone photo, in other words, and at 10 MB
				inside the documented upload limit of every platform tested (ChatGPT's image upload limit is
				20 MB per image, Perplexity's 40 MB per file, Gemini's 100 MB; Anthropic's two documents
				give 10 MB and 500 MB for claude.ai, and the photo was accepted).
			</p>
			<p class="mb-4">
				<strong>The prompts.</strong> Each one was pasted verbatim into a fresh chat in the platform's
				desktop web app, between 15:47 and 16:10 UK time:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Prompt A:</strong>
						<em
							>Compress this photo so the file is smaller. Keep it as a JPG and give me the file
							back to download.</em
						>
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Prompt B</strong> (same chat, after A):
						<em
							>Before you did anything to it, what exactly did you receive: the file size in bytes,
							the pixel dimensions, and whether it still had EXIF metadata (camera model, date,
							GPS)? Then give the same three for the file you returned. Report the actual values,
							not estimates.</em
						>
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Prompt C</strong> (fresh chat):
						<em>Compress this photo to under 1 MB and give me the file back to download.</em>
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Prompt Z</strong> (ChatGPT only, fresh chat, 21:18 UK): Prompt A again, with the photo
						attached inside a .zip archive instead of as an image. This is the ".zip trick" that forum
						posts and Google's AI Overview recommend for keeping full resolution; we tested it after the
						main runs.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				<strong>The measurement.</strong> Every file that came back was read by one Python script (Pillow,
				NumPy, scikit-image): bytes, pixel dimensions, EXIF presence and tag count, ICC profile, XMP,
				progressive flag, chroma subsampling, an estimate of the JPEG quality setting inverted from the
				quantization tables, and an MD5 hash. The "what did you receive" figures in the tables are each
				platform's own answer to Prompt B. For Claude we could also check that answer independently: the
				same photo attached to a Claude session arrived as 1,779,417 bytes at 2576 x 1932 with no EXIF,
				which is exactly what Claude reported.
			</p>
			<p class="mb-4">
				<strong>What we did not test.</strong> The mobile apps, batches, PNG or HEIC input, and the .zip
				route on any platform other than ChatGPT. We say so again where it matters. Everything below is
				"measured on one file on October 15, 2026", not a statement about how any platform always behaves.
			</p>
		</section>

		<section id="the-upload" class="scroll-mt-24">
			<SectionHeading>Step one happens before the model: the upload</SectionHeading>
			<p class="mb-4">
				The compression you asked for had already happened, and then some, before the chatbot read
				your message. All three platforms that could inspect the file reported receiving a much
				smaller picture than the one we attached, and none received the metadata.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>Chatbot</th><th>Bytes received</th><th>Share of original bytes</th><th
								>Pixels received</th
							><th>Share of original pixels</th><th>EXIF on arrival</th></tr
						></thead
					>
					<tbody>
						<tr
							><td>Claude</td><td>1,779,417</td><td>17.7%</td><td>2576 x 1932 (4.98 MP)</td><td
								>20.3%</td
							><td>none</td></tr
						>
						<tr
							><td>ChatGPT</td><td>1,638,841</td><td>16.3%</td><td>2048 x 1536 (3.15 MP)</td><td
								>12.9%</td
							><td>none</td></tr
						>
						<tr
							><td>Perplexity</td><td>1,371,355</td><td>13.7%</td><td>1440 x 1080 (1.56 MP)</td><td
								>6.4%</td
							><td>none</td></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				So does ChatGPT compress images when you upload them? Yes, in the sense that matters: the
				picture is made smaller before the conversation starts. This is not a bug and it is not
				hidden, exactly; it is simply not mentioned in the chat. OpenAI's own help center says that
				for image inputs "images are resized before analysis, affecting their original dimensions"
				and that "the model doesn't process original file names or metadata" (<a
					href="https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq"
					target="_blank"
					rel="noopener noreferrer">ChatGPT Image Inputs FAQ</a
				>). Anthropic's platform documentation goes further and publishes the ceiling: on its
				high-resolution tier the maximum long edge is 2576 pixels, and "images larger than either
				limit are downscaled before processing" (<a
					href="https://platform.claude.com/docs/en/build-with-claude/vision"
					target="_blank"
					rel="noopener noreferrer">Claude vision docs</a
				>). Our photo arrived at Claude at 2576 x 1932, which matches that figure to the pixel.
				Perplexity's help center documents a 40 MB file limit and says nothing about resizing (<a
					href="https://www.perplexity.ai/help-center/en/articles/10354807-file-uploads"
					target="_blank"
					rel="noopener noreferrer">Perplexity file uploads</a
				>); the 1440-pixel ceiling we measured is observed, not documented.
			</p>
			<p class="mb-4">
				The reason is cost. A vision model is billed and budgeted in tokens, and a 24 MP photo would
				cost far more to look at than a 3 MP one without telling the model anything extra about what
				is in the picture, so every provider shrinks images to a working size on the way in. Our
				guide to
				<a href="https://mochify.app/guides/llm-image-token-costs">LLM image token costs</a> walks through
				the per-provider formulas; for this guide the point is simpler. The resize is for the model's
				benefit, it happens on every image you attach whether you ask for compression or not, and the
				model itself has no way to know it happened.
			</p>
			<p class="mb-4">
				People notice. A post in a beginners' photography group on Facebook, which ranks on page one
				for this question with over 130 comments, puts it in the plain words: "it lowered my 8mp
				2123x 3900 to 3mp 1024x1536. While I like the outcome..." The surprise is always the same
				shape: the result looks fine on a phone screen, and the pixels are gone.
			</p>
		</section>

		<section id="the-compression" class="scroll-mt-24">
			<SectionHeading>Step two: what the chatbot's compression actually did</SectionHeading>
			<p class="mb-4">
				Once the model had the reduced copy, it did what you asked: it wrote a Python snippet,
				re-encoded the JPEG at a lower quality setting, and handed back a file. Measured against the
				photo on disk, every returned file was 90% to 95% smaller. Measured against what the model
				actually had to work with, the saving was 29% to 60%, and in two cases the "compression" did
				almost nothing at all.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>File</th><th>Bytes</th><th>Share of original</th><th
								>Share of what the model received</th
							><th>Pixels</th><th>Estimated JPEG quality</th><th>Progressive</th><th>EXIF</th><th
								>Color profile</th
							><th>Gain map</th></tr
						></thead
					>
					<tbody>
						<tr
							><td>ChatGPT, Prompt A</td><td>897,881</td><td>8.9%</td><td>54.8%</td><td
								>2048 x 1536</td
							><td>~75</td><td>yes</td><td>none</td><td>none</td><td>none</td></tr
						>
						<tr
							><td>ChatGPT, Prompt C ("under 1 MB")</td><td>973,393</td><td>9.7%</td><td>59.4%</td
							><td>2048 x 1536</td><td>~80</td><td>yes</td><td>none</td><td>none</td><td>none</td
							></tr
						>
						<tr
							><td>Claude, Prompt A</td><td>961,137</td><td>9.6%</td><td>54.0%</td><td
								>2576 x 1932</td
							><td>~60</td><td>yes</td><td>none</td><td>none</td><td>none</td></tr
						>
						<tr
							><td>Claude, Prompt C ("under 1 MB")</td><td>961,137 (byte-identical to A)</td><td
								>9.6%</td
							><td>54.0%</td><td>2576 x 1932</td><td>~60</td><td>yes</td><td>none</td><td>none</td
							><td>none</td></tr
						>
						<tr
							><td>Perplexity, Prompt A</td><td>552,720</td><td>5.5%</td><td>40.3%</td><td
								>1440 x 1080</td
							><td>~80</td><td>yes</td><td>none</td><td>none</td><td>none</td></tr
						>
						<tr
							><td>Perplexity, Prompt C ("under 1 MB")</td><td>977,621</td><td>9.7%</td><td
								>71.3%</td
							><td>1440 x 1080</td><td>~94</td><td>no</td><td>none</td><td>none</td><td>none</td
							></tr
						>
						<tr
							><td>ChatGPT, Prompt Z (photo inside a .zip)</td><td>5,582,118</td><td>55.6%</td><td
								>55.6% (it received the original)</td
							><td>5712 x 4284</td><td>~78</td><td>yes</td><td
								>none (removed by ChatGPT's own step)</td
							><td>Display P3 kept</td><td>none</td></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">Three things in that table are worth a second look.</p>
			<p class="mb-4">
				<strong>"Under 1 MB" is a trivial target once the upload has done the work.</strong> A
				1.5-megapixel image at JPEG quality 94 is under 1 MB without trying, which is why
				Perplexity's "under 1 MB" file is <em>larger</em> than its plain-compress file: with a generous
				budget it simply used a higher quality setting. Claude returned the byte-identical file for both
				prompts (same MD5), because its first attempt already landed at 961 KB. ChatGPT's two files differ
				by one quality step. The target you typed was met, but the work of getting a 10 MB photo under
				1 MB was done by the resize at upload, not by the prompt.
			</p>
			<p class="mb-4">
				<strong>Every chatbot chose a quality setting you would not have chosen.</strong> Claude's file
				is encoded at roughly libjpeg quality 60, which is visible on fine detail at 1:1; ChatGPT's at
				about 75 to 80; Perplexity's at 80 and 94. None asked. All three used 4:2:0 chroma subsampling
				(color detail stored at half resolution) and all but one wrote a progressive JPEG. These are defensible
				web defaults. They are also decisions made on your behalf, on a copy of your photo, by a script
				you did not see.
			</p>
			<p class="mb-4">
				<strong>The savings each platform reported were true and meaningless.</strong> "45%", "46%" and
				"60%" are accurate descriptions of the step the model performed on the file it had. They just
				describe the wrong baseline.
			</p>
			<p class="mb-4">
				A fair comparison of visual quality across the three directly attached files needs a
				side-by-side crop at a common display size, and we have not published one here, because each
				platform's resize used its own resampler and a single similarity score mixes the two effects
				together. What we can say without a caveat is in the next section, after one more test.
			</p>
			<p class="mb-4">
				<strong>The .zip trick, tested.</strong> The AI Overview for this question says that "users often
				upload high-resolution images inside a .zip archive so Code Interpreter can process them losslessly",
				citing a two-year-old blog post. We tried it once, on ChatGPT, with the same photo and Prompt
				A. It worked: the archive bypasses the image pipeline, the code sandbox unpacked the original
				10,044,627 bytes, and the returned JPEG is 5712 x 4284, every pixel intact, at 5,582,118 bytes,
				44% smaller, encoded at roughly quality 78. Because the file never went through the resize, the
				Display P3 profile survived too. ChatGPT's report this time was accurate: "approximately 44% smaller
				than the original 10.04 MB image. The image dimensions are unchanged, and the camera metadata
				has been removed to help reduce the file size." That last clause is the one honest metadata statement
				in the whole test, and note what it means: the metadata was removed by ChatGPT's own script, deliberately,
				and you were told. The gain map was still dropped (Pillow, the library the sandbox used, does
				not write one). Measured against the original at full size, luma SSIM was 0.986 at 37.4 dB, a
				true like-for-like figure because no resampling is involved. One run, one platform, one day; we
				have not tried the archive route on Claude or Perplexity, and a feature that works because an
				archive slips past a pipeline is not one anyone has promised to keep.
			</p>
			<p class="mb-4">
				So the model can compress your photo properly. The problem was never the model; it is the
				door the photo comes in through.
			</p>
		</section>

		<section id="what-went-missing" class="scroll-mt-24">
			<SectionHeading>What went missing that nobody mentioned</SectionHeading>
			<p class="mb-4">
				Three blocks of data were removed from every returned file, and no chatbot mentioned any of
				them unprompted: the EXIF metadata, the Display P3 color profile, and the HDR gain map. One
				of those removals is arguably a favor, one is harmless on most screens, and one quietly
				turns an HDR photo into an SDR one.
			</p>
			<p class="mb-4">
				<strong>EXIF and GPS: gone, and the chatbots said otherwise.</strong> Asked directly (Prompt B),
				all three platforms reported that the file they received had no EXIF data, and each concluded
				that its compression therefore "did not remove" any metadata. That is literally true and practically
				wrong: the camera model, timestamp and GPS coordinates were in the file we attached and are not
				in the file we got back; they were removed by the upload pipeline, which the model cannot see.
				Claude came closest to saying so: the upload "was probably already stripped before it reached
				me, though I can't tell where that happened". For a photo you are about to post publicly, losing
				the GPS position is a good outcome. The problem is that you cannot rely on it, because nobody
				promised it, and you cannot keep the metadata when you want to (a photographer's copyright field,
				a client's shoot date), because nobody offers a switch.
			</p>
			<p class="mb-4">
				<strong>Color profile: converted correctly, then dropped.</strong> The source photo was tagged
				Display P3, a wider color space than the sRGB most screens assume. Every file returned from a
				direct attachment was untagged (the .zip route, which skipped the image pipeline, kept the tag),
				so we tested what the pixels actually contained rather than assuming the worst: we compared each
				file against the original's raw values and against the original converted from P3 to sRGB, on
				the 1% most saturated pixels. Every platform matched the converted version (mean error 0.8 to
				3.4 on a 0-255 scale) and none matched the raw values. In plain terms, the colors were translated
				properly and the untagged file renders correctly on an ordinary screen. What is lost is the wide-gamut
				headroom: colors outside sRGB are clipped. On this photo that difference averaged 3 on a 0-255
				scale across the frame, small enough that you would not see it on most displays. This is not a
				defect on any platform, ours included; it is a limit of the chat route that nobody states.
			</p>
			<p class="mb-4">
				<strong>HDR gain map: gone everywhere, by default.</strong> Recent iPhones store a gain map
				alongside the normal picture so that highlights can exceed white on an HDR display. Not one
				returned file from any chatbot carried it; the picture that comes back is standard dynamic
				range, full stop. If you have ever wondered
				<a href="https://mochify.app/guides/why-hdr-photos-look-flat-when-shared"
					>why HDR photos look flat when you share them</a
				>, this is one of the ways it happens. We should be clear that a plain "compress this"
				produces the same result on Mochify: our standard path drops an existing gain map too. The
				difference is that Mochify has a path that keeps it, which we come to in the
				<a href="#mochify-workflow">workflow section</a>.
			</p>
			<p class="mb-4">
				If any of these three matters to you, the chat route is the wrong tool, however good the
				result looks on your phone.
				<a href="https://mochify.app/flow"
					>Compress the photo you actually have at mochify.app/flow</a
				> instead.
			</p>
		</section>

		<section id="wrong-number" class="scroll-mt-24">
			<SectionHeading>Why the chatbot told you the wrong number (and how to check)</SectionHeading>
			<p class="mb-4">
				The chatbots were not lying. The model's only knowledge of your photo is the copy that
				arrives after the upload step, so when it reports "1.64 MB to 898 KB" it is reporting what
				it saw, and when it says "no metadata was stripped" it is reporting that the copy it
				received had none to strip. ChatGPT went as far as calling 2048 x 1536 "the original
				dimensions". From inside the conversation, it was. The .zip run proves the point from the
				other side: given the real file, the same ChatGPT reported the real size (10.04 MB), the
				real saving (44%) and what it had removed. The arithmetic was always fine; the input was
				not.
			</p>
			<p class="mb-4">
				This is the single most useful thing to understand about asking an assistant to process a
				file. The assistant and the file are not in the same place. The file goes through a pipeline
				(size checks, resizing, metadata removal, format normalization) that exists for the model's
				benefit, and then the model is handed the result with no record of what changed. Anything
				the model then tells you about "the original" is a description of the copy.
			</p>
			<p class="mb-4">
				You can check this yourself in under a minute, on any platform, with the photo you care
				about.
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Note the real figures first.</strong> On a Mac, select the photo in Finder and press
						Command-I: Size (in bytes, in brackets) and Dimensions are in the More Info section. On Windows,
						right-click, Properties, Details tab: Dimensions and Size. On an iPhone, open the photo, tap
						the "i" button: the dimensions and megabytes are under the camera line.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Attach the photo and ask the question before you ask for anything else.</strong>
						Paste Prompt B from <a href="#how-we-tested">section 3</a> as your first message, or
						shorter:
						<em
							>What are the exact pixel dimensions and byte size of the file you received, and does
							it contain EXIF data?</em
						>
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Compare.</strong> If the dimensions the assistant reports are smaller than Finder's,
						the resize has already happened and every later figure in the chat is relative to the smaller
						copy. If it reports no EXIF and your photo had GPS on, the metadata is already gone.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Download the result and check it the same way.</strong> Finder's Get Info or Windows
						Properties will show you the true dimensions of what came back. If you want to see the color
						profile and metadata too, Preview on a Mac (Tools, Show Inspector) and most photo tools will
						list them; an empty EXIF panel on a phone photo is the tell.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				If the figures match, you are on a route that preserves the file and the chat's numbers can
				be trusted. In our test, on October 15, 2026, no chat route did.
			</p>
		</section>

		<section id="when-fine" class="scroll-mt-24">
			<SectionHeading>When the chat route is fine, and when it is not</SectionHeading>
			<p class="mb-4">
				If "smaller" is the whole requirement and the photo will be viewed on a phone or in an
				email, asking a chatbot is a perfectly good way to get a sub-1 MB JPG, and you do not need
				this guide to use it. The problem cases are the ones where the pixels, the metadata or the
				HDR carry value you cannot get back.
			</p>
			<p class="mb-4"><strong>Fine:</strong></p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						A photo attachment for an email or a messaging app with a size cap. A 2048-pixel, 900 KB
						JPEG looks correct in any inbox.
					</p>
				</li>
				<li>
					<p class="mb-0">
						A quick image for a web form, a support ticket or a chat message, where the recipient
						will look once on a screen.
					</p>
				</li>
				<li>
					<p class="mb-0">
						A one-off, where you have the original safely elsewhere and only the small copy needs to
						travel.
					</p>
				</li>
				<li>
					<p class="mb-0">
						Gemini's and DeepSeek's answer, which was to decline and name other tools, is also fine.
						It is the honest version of the same limit.
					</p>
				</li>
			</ul>
			<p class="mb-4"><strong>Not fine, or not without checking:</strong></p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Anything you might print or crop later.</strong> A 3 MP file prints acceptably at
						roughly 4 x 6 inches; the 24 MP original prints at poster size. The pixels do not come back.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Marketplace and product listings.</strong> Platforms zoom and recrop. A 1440 x
						1080 upload is below the point where that works well, and the published recommendations
						sit well above it (Etsy recommends 2000 px, Amazon 1600 px on the longest side). Our
						guide to
						<a href="https://mochify.app/guides/photo-file-too-large-to-upload"
							>why free tools reject camera files</a
						> covers the related failure in the other direction.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Anything where the metadata matters either way.</strong> You cannot keep a copyright
						field or a capture date through the chat route, and you cannot be sure the GPS is gone either,
						because nobody documents it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>HDR photos you want to stay HDR.</strong> The gain map does not survive.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Batches.</strong> The free tiers of the chat platforms cap uploads per day and per
						message, and each photo is a conversation turn.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>"Compress but keep the quality."</strong> The chat route cannot do this, because the
						quality decision was made at upload before you spoke.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				<strong>The middle case:</strong> attaching the photo inside a .zip, which on ChatGPT gave us
				the full 5712 x 4284 at 5.6 MB. It keeps the pixels and (on this run) the color profile; it still
				drops the HDR gain map, removes the metadata without offering to keep it, costs a sandbox step
				and a sign-in per photo, and depends on an archive slipping past a pipeline that nobody has promised
				will keep letting it through. Workable for one photo today; not a workflow.
			</p>
			<p class="mb-4">
				A quick test for which side you are on: if someone will ever look at the result at more than
				phone size, or do anything to it other than look, keep the pixels.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: compress the photo you actually have</SectionHeading>
			<p class="mb-4">
				Mochify receives the file you attach, all of it, and compresses that. On the same 24 MP
				photo, the same day, a plain compress returned every pixel (5712 x 4284) at 4,377,466 bytes,
				56% smaller than the original; the HDR-preserving run returned every pixel plus the gain map
				at 4,288,854 bytes, 57% smaller; and "under 1 MB" returned 945,244 bytes at 3361 x 2521,
				which is 2.7 times the pixels ChatGPT's file holds and 5.4 times Perplexity's. The engine
				received the original bytes in every run, so the savings are against the real file, not a
				copy.
			</p>
			<p class="mb-4">
				The interface is the same as the chat route, which is the point: you drop the file and say
				what you want in plain English. Magic Flow reads the instruction with a language model, then
				hands the work to our C++ engine; nothing about the photo is reduced on the way in.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>Open mochify.app/flow</h3>
						<p class="mb-4">
							Open <a href="https://mochify.app/flow">mochify.app/flow</a> (or the prompt box on the home
							page) and drop the photo in. A 10 MB iPhone JPEG is inside the Free tier's 20 MB limit;
							without an account you get 3 images a month, a free account gets 25.
						</p>
					</li>
					<li>
						<h3>Type what you want</h3>
						<p class="mb-4">
							Magic Flow takes the same plain-English instruction you would give a chatbot. The
							three prompts we used:
						</p>
						<ul class="step-prompts">
							<li>
								<em>Compress this photo so the file is smaller. Keep it as a JPG.</em> On our test file
								the engine's automatic quality returned a 4.4 MB JPEG at the full 5712 x 4284, encoded
								with jpegli (a standard JPEG that opens anywhere, with fewer wasted bytes at high quality).
								Luma similarity to the original at full size: SSIM 0.967, 33.3 dB.
							</li>
							<li>
								<em
									>Compress this photo so the file is smaller. Keep it as a JPG. Keep the HDR
									profile.</em
								>
								Full dimensions, 4.3 MB, and the Apple gain map carried through as the file's second frame
								at its source size. The same path is <code>hdr=true</code> on the API and
								<code>--hdr</code>
								on the CLI, and the
								<a href="https://mochify.app/solutions/sdr-to-hdr">SDR to HDR converter</a> preserves
								an existing map on drop. We have not yet checked the returned file on an HDR display,
								so "carried through" is the exact claim.
							</li>
							<li>
								<em>Compress this photo to under 1 MB.</em> The target was met at 945 KB. To get there
								on this particular photo (dense foliage, which is hard to compress) the engine reduced
								the dimensions to 3361 x 2521 and encoded coarsely; on a smoother 24 MP photo in an earlier
								test it reached 964 KB at full dimensions. A size target is a trade, and you should look
								at the result at 1:1 before deciding it is the right one.
							</li>
						</ul>
					</li>
					<li>
						<h3>Download</h3>
						<p class="mb-4">
							Nothing else to set. If you want the camera metadata kept, the web app has a Strip
							EXIF switch (on by default, so GPS is removed unless you turn it off); the API
							equivalent is
							<code>stripExif=false</code>. Either way the choice is yours and it is stated.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, stated per surface rather than in one sentence.</strong> Your photo travels
				to
				<code>api.mochify.app</code> over HTTPS, is encoded in memory and wiped immediately: no disk
				writes, no logs containing file data, and never used to train AI. That holds for the web
				app, the CLI, the REST API and both MCP servers. The hosted MCP server additionally holds
				the <em>compressed output</em>
				behind a short-lived URL on <code>files.mochify.app</code> for up to five minutes so the
				agent can fetch it; the original is still discarded at once. The local CLI and local MCP
				server (<code>mochify serve</code>) have no pickup store: the compressed bytes come straight
				back to your machine. Video is the one format that never leaves your browser, because the
				video engine runs client-side; images and PDFs do travel to the API, and we would rather say
				so than borrow the chat platforms' silence.
			</p>
		</section>

		<section id="surface-split" class="scroll-mt-24">
			<SectionHeading>Three routes that give an assistant the real file</SectionHeading>
			<p class="mb-4">
				The lesson of this test is not "do not use AI"; it is that an attachment in a chat window is
				lossy by construction, so give the assistant a route to the original bytes instead. (The same split is what lets an assistant <a href="/guides/blur-faces-license-plate-ai-assistant">hide a license plate or every face in a photo</a> without shrinking it: the assistant picks the box on its preview, Mochify redacts the original.) Three
				exist today, and none of them puts the photo through an upload pipeline:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>An agent with a filesystem</strong> (Claude Code, Claude Desktop or any MCP
						client on your machine) can call the local MCP server or the <code>mochify</code> CLI,
						which read the file from disk and return a path, so the photo never enters the
						conversation at all. Setup is in
						<a href="https://mochify.app/guides/image-compression-claude-code-cli-mcp"
							>image compression inside Claude Code</a
						>.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>An agent with a URL</strong> can pass it to the hosted MCP server at
						<code>mcp.mochify.app</code>, which fetches the original and returns a download link.
						<a href="https://mochify.app/guides/how-the-mochify-mcp-server-works"
							>How the Mochify MCP server works</a
						> compares the two.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>A developer</strong> can <code>POST /v1/squish</code> directly with
						<code>Authorization: Bearer &lt;key&gt;</code>; the request body is the file, so the
						engine sees every byte. Docs at <a href="https://mochify.app/docs">mochify.app/docs</a>.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Whichever route you pick, the "what exactly did you receive" check from
				<a href="#wrong-number">section 7</a> will return your real dimensions. That is the test of a
				tool that compresses your photo rather than a copy of it.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>
			<p class="mb-4">
				One 24.5 MP iPhone 15 photo (10,044,627 bytes, 5712 x 4284, Display P3, HDR gain map, EXIF
				with GPS), October 15, 2026.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>n/a</th><th>ChatGPT (Free)</th><th>Claude (Sonnet 5.5)</th><th
								>Perplexity (Pro)</th
							><th>Gemini (3.6 and 3.8 Flash)</th><th>DeepSeek (free)</th><th>Mochify</th></tr
						></thead
					>
					<tbody>
						<tr
							><td>Returns a compressed file</td><td>yes</td><td>yes</td><td>yes</td><td>no</td><td
								>no</td
							><td>yes</td></tr
						>
						<tr
							><td>Pixels the engine received</td><td>13% (2048 x 1536)</td><td
								>20% (2576 x 1932)</td
							><td>6% (1440 x 1080)</td><td>n/a</td><td>n/a</td><td>100% (5712 x 4284)</td></tr
						>
						<tr
							><td>Photo attached inside a .zip</td><td
								>100%, 5.6 MB back, metadata removed, P3 kept, gain map dropped</td
							><td>not tested</td><td>not tested</td><td>n/a</td><td>n/a</td><td>not needed</td></tr
						>
						<tr
							><td>Plain "compress", bytes back</td><td>898 KB</td><td>961 KB</td><td>553 KB</td><td
								>none</td
							><td>none</td><td>4.4 MB at full size</td></tr
						>
						<tr
							><td>"Under 1 MB", bytes back</td><td>973 KB at 2048 x 1536</td><td
								>961 KB at 2576 x 1932</td
							><td>978 KB at 1440 x 1080</td><td>none</td><td>none</td><td>945 KB at 3361 x 2521</td
							></tr
						>
						<tr
							><td>EXIF / GPS in the result</td><td>removed at upload, unreported</td><td
								>removed at upload, unreported</td
							><td>removed at upload, unreported</td><td>n/a</td><td>n/a</td><td
								>removed by default; switch to keep</td
							></tr
						>
						<tr
							><td>Color profile</td><td>converted to sRGB, tag dropped</td><td>same</td><td
								>same</td
							><td>n/a</td><td>n/a</td><td
								>converted to sRGB, tag dropped (sRGB tag on the HDR path)</td
							></tr
						>
						<tr
							><td>HDR gain map</td><td>dropped</td><td>dropped</td><td>dropped</td><td>n/a</td><td
								>n/a</td
							><td>dropped on plain compress; kept on request</td></tr
						>
						<tr
							><td>Resize ceiling documented by the vendor?</td><td
								>"resized before analysis", no figure</td
							><td>2576 px long edge (matches)</td><td>not documented</td><td>n/a</td><td>n/a</td
							><td>no resize unless asked</td></tr
						>
						<tr
							><td>Good for</td><td>email, forms, quick shares</td><td>same</td><td>same</td><td
								>the honest "use a tool" answer</td
							><td>same</td><td>printing, listings, archives, HDR, batches, keeping the pixels</td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Rule of thumb: the chat route changes the picture; a compression tool changes the file. Ask
				"what exactly did you receive?" before you trust any saving a chatbot reports.
			</p>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Try Magic Flow">
			Drop the photo you were about to attach into <a href="https://mochify.app/flow"
				>mochify.app/flow</a
			>
			and type <em>"compress this photo, keep it as a JPG"</em>: the file that comes back has every
			pixel you started with, and the check in section 7 will prove it.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>

<style>


	/* Workflow steps: the handoff authors each step title as an <h3> and step
	   2 carries a nested list of prompts, so this is a plain list rather than
	   StepList (whose titles are <p> and whose bodies are an {@html} string). */
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

	.step-prompts {
		list-style: disc;
		margin: 0;
		padding-left: 1.25rem;
		display: grid;
		gap: 0.75rem;
	}

</style>
