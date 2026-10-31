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
	import GuideSchema from '$lib/components/GuideSchema.svelte';

	// Built from content-ops `article-originals/agent-built-website-image-optimization.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off (the LinkedIn post deep-links #image-audit-prompt).
	const metadata = {
		title:
			'Your AI Agent Built Your Website. Here Is How to Make Its Images Fast (and Strip the GPS)',
		seoTitle: 'Optimize AI-Built Website Images: 6 Prompts, Strip the GPS',
		description:
			'Your AI agent shipped the photos as they arrived. Six prompts (Lovable, Cursor, Claude Code) that shrink, convert and clean every image and strip the GPS.',
		category: 'AI & Automation',
		readTime: '33 min read',
		date: 'October 31, 2026',
		bylineNote:
			'Written as six prompts for the person whose site an agent built, with every number from our own six-photo run on October 29, 2026.'
	};

	const keywords =
		'ai-built website images, nextjs image optimization, lovable seo, lovable site slow, claude code optimize images, optimize images for website, strip gps from photos, agents.md, claude.md';

	const pageUrl = 'https://mochify.app/guides/agent-built-website-image-optimization';

	const toc = [
		{ id: 'six-words-this-guide-uses', label: 'Six words this guide uses' },
		{
			id: 'why-agent-built-sites-ship-heavy-images',
			label: 'Why an AI-built website ships heavy images, and why the platform does not fix it'
		},
		{
			id: 'image-audit-prompt',
			label: 'Prompt 1: the audit (find every image and what it costs)'
		},
		{
			id: 'plain-img-next-image-or-builder',
			label: 'Prompt 2: which case are you in? Plain img, framework component, or builder'
		},
		{
			id: 'six-iphone-photos-96-percent-smaller-no-gps',
			label: 'What the fix is worth: our six-photo run, 96% smaller, zero GPS'
		},
		{
			id: 'prompts-for-each-agent-seat',
			label: 'Prompt 3: have the agent do it, from whichever seat you sit in'
		},
		{
			id: 'picture-element-markup-prompt',
			label: 'Prompt 4: the markup the agent should write back'
		},
		{
			id: 'agents-md-claude-md-rules-file',
			label: 'Prompt 5: keep it fixed with one line in the rules file'
		},
		{
			id: 'check-usage-allowance-prompt',
			label: 'Prompt 6: count the images against an allowance before you start'
		},
		{ id: 'agencies-per-client', label: 'For agencies: the same six prompts per client' },
		{
			id: 'mochify-workflow',
			label: "Mochify Workflow: optimize an agent-built site's images"
		},
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const auditPrompt =
		"Audit every image on this site. For each image file in the repo (public/, assets/, src/, and anything referenced from HTML, JSX, CSS or Markdown), list: file path, pixel width x height, file size in KB, format, every place it is referenced, the largest width it is ever displayed at (read the CSS, the layout and any max-width), and whether the reference is a plain <img>, a CSS background-image, or a framework image component (next/image, Astro <Image>, or similar). Then tell me: the total image bytes, the ten largest files, every image displayed at less than half its pixel width, every image over 300 KB, and which image is likely the largest element on the home page's first screen. Do not change anything yet.";

	const metadataCheckPrompt =
		'For every JPEG and HEIC in the repo, report whether it carries EXIF metadata and specifically whether it has GPS coordinates. Use exiftool if it is installed (exiftool -gps:all -n <file>), otherwise read the EXIF with any library you have. List every file with a GPSLatitude value.';

	const chatPrompt =
		'Here is the hero photo for the home page. Make three versions at 1,600 pixels wide for the web: AVIF, WebP and JPEG, metadata stripped. Name them hero-1600.avif, hero-1600.webp and hero-1600.jpg and give me the download links.';

	const claudeCodePrompt =
		'Using the Mochify squish tool, process every image in the audit that is a photo or a raster graphic. For each one: resize to the largest width it is displayed at, rounded up to the next of 640, 1024, 1600 or 2048 pixels, never larger than the original; write an AVIF, a WebP and a JPEG into the same folder as the original, named <name>-<width>.<ext>; strip the metadata. Do not touch SVGs or files under 30 KB. When all of them are done, report the before and after sizes per file and the totals, and list every original you processed so I can decide what to delete.';

	const sweepCode = `mochify ./public/photos/*.jpg -t avif -w 1600 -o ./public/photos/web
mochify ./public/photos/*.jpg -t webp -w 1600 -o ./public/photos/web`;

	const squishCode = `curl -X POST "https://api.mochify.app/v1/squish?type=avif&width=1600&optimizeForWeb=1" \\
  -H "Content-Type: image/jpeg" \\
  -H "Authorization: Bearer $KEY" \\
  --data-binary @IMG_4601.JPG --output IMG_4601-1600.avif`;

	const markupPrompt =
		'For every image you processed, replace the plain <img> with a <picture> element: an AVIF <source>, a WebP <source>, and the JPEG as the <img> fallback, keeping the existing alt text. Set width and height on the <img> to the new file\'s pixel size. Add loading="lazy" and decoding="async" to every image except the one that is the largest element on the home page\'s first screen; give that one fetchpriority="high" and no lazy loading. Where an image is a CSS background-image, use image-set() with the AVIF and WebP and the JPEG as the fallback. Then delete the originals you listed, unless I kept any for the metadata, and make sure nothing still references them.';

	const heroCode = `<picture>
  <source srcset="/photos/web/hero-1600.avif" type="image/avif">
  <source srcset="/photos/web/hero-1600.webp" type="image/webp">
  <img src="/photos/web/hero-1600.jpg" alt="The workshop at dawn"
       width="1600" height="1200" fetchpriority="high">
</picture>`;

	const agentsMdCode = `## Images
Every raster image that enters this repo goes through the Mochify squish tool
before it is committed: resized to its largest displayed width (640, 1024,
1600 or 2048, never upscaled), saved as AVIF + WebP + JPEG named <name>-<width>,
metadata stripped. Reference them with <picture>, width and
height set, loading="lazy" on everything except the first-screen image.
Never commit an original photo or a file over 300 KB.`;

	const allowancePrompt =
		'Before processing anything, call check_usage (or GET https://api.mochify.app/v1/checkTokens with my key) and tell me how many operations are left on this account this month. From the audit, count the images we will process and multiply by the number of formats. If the total is more than what is left, stop and tell me which plan would cover it; do not start a partial run.';

	const faqItems = [
		{
			q: 'Does Lovable optimize images automatically?',
			a: `Nothing in Lovable's documentation says uploaded images are resized or re-encoded on publish; its advice is to "Compress images and use efficient formats like WebP or SVG" yourself, images you upload to the connected repo go in the <code>public</code> folder as they are, and its SEO review no longer reports page speed, so Lovable SEO advice that stops at meta tags, sitemaps and rendering misses the weight of the page. Treat a Lovable site as a plain-<code>&lt;img&gt;</code> site: process the files with the prompts above and have Lovable's chat replace the references. Then confirm by opening a published image in its own tab and comparing its pixel size with what you uploaded.`
		},
		{
			q: 'My Lovable site is slow. Is it the images?',
			a: `"Lovable is slow" means two different things, and the forums mix them: the editor and preview being slow to respond, which is on Lovable's side and shows up on its status page, and the published site loading slowly for visitors, which is almost always weight, and the heaviest weight on a new site is images. Run PageSpeed Insights on the published URL; if "Improve image delivery" is the top finding, the images are the reason, and Prompt 1 will tell you how much.`
		},
		{
			q: 'I use next/image. Does Next.js image optimization mean I can skip this?',
			a: `For the serving side, no: <code>next/image</code> resizes and converts on request and writes the markup. For the files, yes. It does not change the originals in your repo, so every deploy carries them, anyone can download one at its original path with its metadata intact, and on Vercel every size it generates from a large source is a transformation against your quota. Shrink and clean the originals with Prompt 3, then check that <code>sizes</code> is set on images that are not full width and that the first-screen image has <code>preload</code> (or <code>priority</code> before Next.js 16).`
		},
		{
			q: 'Will stripping the metadata rotate my phone photos sideways?',
			a: `Not through Mochify. A phone stores a portrait photo as landscape pixels plus an orientation flag in the metadata; a careless tool that discards the metadata leaves the picture on its side. Mochify applies the orientation during the resize and then writes the output upright with no metadata, which is what our six-photo run showed: 5,712 x 4,284 in, 1,600 x 2,133 out, the right way up.`
		},
		{
			q: 'How do I get Claude Code or Cursor to optimize the images in my repo?',
			a: `Install the <code>mochify</code> binary, run <code>mochify auth login</code> once, and register <code>mochify serve</code> as a local MCP server (in Claude Code, <code>claude mcp add --transport stdio mochify -- mochify serve</code>; in Cursor, the same command in its MCP settings). Then paste Prompt 3: the agent calls the <code>squish</code> tool with each file path and gets a path back, so no image bytes enter the session. To keep the metadata on a particular photo, say so in the prompt; the API option behind it is <code>stripExif=false</code>. Add the Images section from Prompt 5 to <code>CLAUDE.md</code> or <code>AGENTS.md</code> so the next photo is handled the same way without being asked.`
		},
		{
			q: 'How many operations will a whole site take, and which plan covers it?',
			a: `Count the images you will process and multiply by the formats you want: 40 photos in AVIF, WebP and JPEG is 120 operations. A free account has 25 a month; a Day Pass is 100 in 24 hours for $2 with no signup; Seller is 300 a month, Pro 1,200, Growth 5,000, and all three include the MCP servers and the API. Prompt 6 has the agent read the remaining allowance with <code>check_usage</code> before it starts, so a sweep never stops halfway.`
		},
		{
			q: 'Does the agent see my photos, and does Mochify keep them?',
			a: `With the local MCP server the agent sees a file path and a result path, never the image bytes, and Mochify encodes the image in memory and wipes it, with the result written straight back to your disk. With the hosted server the agent sees a download link, the original is wiped the same way, and the finished file waits in a pickup store for up to five minutes so the link works. Neither route stores your photos, and nothing is used to train anything. The photo does travel to Mochify's servers for the encoding; it is not processed on your machine.`
		},
		{
			q: 'Can the rules-file line replace a build step?',
			a: `It replaces the forgetting, not the enforcement. The line makes the agent process images by default in every session that reads it, and Claude Code and Cursor both read <code>AGENTS.md</code> or their own file at startup; Claude Code's documentation is clear that such files are "context, not enforced configuration". Keep the line, and add a pre-commit hook or a deploy-time script (the only-new-files version in our whole-site conversion guide) for the case where a human or a hurried agent skips it.`
		}
	];

	const related = [
		{
			title: 'Image Compression Inside Claude Code: The Mochify CLI + MCP Guide',
			href: '/guides/image-compression-claude-code-cli-mcp',
			desc: 'the install and registration steps for the local MCP server, and the pre-commit and CI patterns.'
		},
		{
			title: "Convert a Website's Images to WebP and AVIF, and Keep Them That Way",
			href: '/guides/convert-website-images-to-webp-and-avif',
			desc: 'the one-command sweep for a whole site and the script that only converts new files.'
		},
		{
			title: 'The HTML picture Tag: Format Fallbacks, Art Direction and the 2026 Source Order',
			href: '/guides/html-picture-tag',
			desc: 'the markup Prompt 4 asks for, explained rule by rule.'
		},
		{
			title: 'The Risks of EXIF Data in Image Compression',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: "what else lives in a photo's metadata and who reads it."
		},
		{
			title: 'How the Mochify MCP Server Works: Hosted vs Local',
			href: '/guides/how-the-mochify-mcp-server-works',
			desc: 'the two servers in depth, token costs and the pickup-store decision.'
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
		datePublished="2026-10-31"
		article={{
			about: [
				'AI coding agents',
				'Lovable',
				'Claude Code',
				'Cursor',
				'next/image',
				'Model Context Protocol',
				'image optimization',
				'EXIF metadata',
				'GPS metadata',
				'AVIF',
				'WebP',
				'picture element',
				'AGENTS.md'
			],
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
			<AccentTitle title={metadata.title} accent="Make Its Images Fast" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			If an AI agent built your website, there is a good chance nobody has looked at the images. Not
			you, because you asked for a site and got one. Not the agent, because you did not ask it to.
			The photos went into the repo at whatever size they arrived, the agent wrote <code
				>&lt;img src="/hero.jpg"&gt;</code
			>
			around each one, and the deploy shipped the lot.
			<a
				href="https://news.ycombinator.com/item?id=44598101"
				target="_blank"
				rel="noopener noreferrer">Simon Willison found this</a
			> on a conference-schedule app he had built in an afternoon with an agent: "it turns out those speaker
			avatar images are 1MB+ PNGs! And there are 170 of them." He fixed it the same way he built it, by
			asking the agent.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			That is the whole shape of this guide. An agent-built site has heavy images because image work
			was never on the list, and the same agent will do that work well if you know what to ask for.
			The difference from a site builder is that your agent controls the markup, so it can do more
			than squeeze the files: it can write the <code>&lt;picture&gt;</code> element, set the width and
			height, decide what loads first, and keep doing all of it on every image you add later, because
			you can write the rule into the file it reads at the start of every session.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			Two things make the job urgent rather than nice-to-have. The first is speed. Images are the
			biggest thing on most pages (<a
				href="https://almanac.httparchive.org/en/2024/page-weight"
				target="_blank"
				rel="noopener noreferrer">the median home page sends about a megabyte of them</a
			>) and
			<a
				href="https://almanac.httparchive.org/en/2024/performance"
				target="_blank"
				rel="noopener noreferrer">the largest element on 73% of mobile pages is an image</a
			>, so the hero your agent dropped in at 4,000 pixels is usually the single reason the page
			feels slow. The second is one you may not have thought about. We ran six photos from an iPhone
			through the workflow below as a test. Every one of the 23 photos in that folder carried the
			latitude and longitude of where it was taken. A site that publishes supplied photos as they
			arrived publishes where they were taken, and anyone can read it.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			The guide is written as prompts. You paste them into the agent you already use, in whichever
			seat you sit in: a chat assistant with the hosted Mochify MCP server, Claude Code or Cursor
			with the local one, or a script that calls the API. If you have never opened a terminal, start
			with the six words below and use the chat seat; the rest of the guide assumes only those six
			words.
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

		<section id="six-words-this-guide-uses" class="scroll-mt-24">
			<SectionHeading>Six words this guide uses</SectionHeading>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>Agent</strong>: the AI that wrote your site and can still change it. Lovable,
					Bolt, v0 and Replit Agent build and host the site for you; Claude Code, Cursor and Codex
					work in a folder of code on your computer. All of them read and write files and can call
					tools.
				</li>
				<li>
					<strong>Repo</strong>: the folder of files that is your website, usually kept on GitHub.
					The images your agent used live in it, often in a folder called <code>public</code> or
					<code>assets</code>. The deploy copies that folder to the server, so whatever is in the
					repo is what visitors download.
				</li>
				<li>
					<strong>Original</strong>: the image file as it arrived: the 6 MB phone photo, the
					4,000-pixel stock download, the PNG export from a design tool. An original is almost
					always far bigger than any screen will show it at.
				</li>
				<li>
					<strong>Format</strong>: the kind of image file. JPEG and PNG are the old universal ones.
					WebP and AVIF store the same picture in a much smaller file and now work for
					<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer"
						>over 96% of visitors</a
					>, which is why speed tests ask for them.
				</li>
				<li>
					<strong>Metadata (EXIF)</strong>: text stored inside a photo that is not the picture:
					camera model, lens, date, and on phone photos usually the GPS coordinates of where you
					stood. It travels with the file unless something removes it.
				</li>
				<li>
					<strong>MCP</strong>: the Model Context Protocol, the standard way an agent calls an
					outside tool. Mochify is an MCP server, so once it is connected your agent can compress,
					resize and convert images as a tool call, the same way it edits a file. There are two
					Mochify servers: the hosted MCP server, which you connect from a chat app with nothing
					installed, and the local MCP server, a small program on your machine for coding agents.
				</li>
			</ul>
		</section>

		<section id="why-agent-built-sites-ship-heavy-images" class="scroll-mt-24">
			<SectionHeading
				>Why an AI-built website ships heavy images, and why the platform does not fix it</SectionHeading
			>
			<p class="mb-4">
				An agent writes the simplest code that makes the picture appear, and the simplest code is
				<code>&lt;img src="/photo.jpg"&gt;</code> pointing at the file you gave it. Nothing in that line
				resizes the file, converts it or removes its metadata, and nothing in a typical deploy does either.
				The slowness people notice on "vibe-coded" sites is mostly this. A web designer who audits them
				put it as "4K hero images served at 80% quality with no responsive variants"; an analysis of 100
				sites built with Lovable, v0 and Bolt found "large hero images and uncompressed assets were particularly
				common issues".
			</p>
			<p class="mb-4">
				The platforms are clear that this is your job, when they say anything. <a
					href="https://docs.lovable.dev/features/seo"
					target="_blank"
					rel="noopener noreferrer">Lovable's documentation</a
				>
				tells you to "Compress images and use efficient formats like WebP or SVG", says files you upload
				to the connected repo go in the <code>public</code> folder and are referenced by path, and
				notes that its own SEO review "no longer runs Lighthouse audits, so it no longer reports
				page speed scores": you are sent to PageSpeed Insights to find out.
				<a
					href="https://support.bolt.new/troubleshooting/publish-issues"
					target="_blank"
					rel="noopener noreferrer">Bolt's publish troubleshooting page</a
				>
				says projects must stay under 100 MB and that "most commonly, projects hit this limit because
				they have large media files", with the remedy being to delete media or move it to a CDN.
				<a
					href="https://vercel.com/docs/image-optimization"
					target="_blank"
					rel="noopener noreferrer">Vercel</a
				>, which hosts a great many agent-built Next.js and v0 sites, states the rule for the plain
				tag exactly: "If you use a standard HTML <code>img</code> element, the browser will be instructed
				to bypass optimization and serve the image directly from its source."
			</p>
			<p class="mb-4">
				Compare a hosted site builder, which resizes what you upload (imperfectly, with no say over
				the format or what loads first). An agent-built site does nothing unless asked, and then can
				do it better, because the agent owns the markup. The gap is the whole opportunity, and
				closing it takes six prompts.
			</p>
			<p class="mb-4">
				What a speed test will tell you, if you run one before you start: in PageSpeed Insights and <a
					href="https://developer.chrome.com/blog/lighthouse-13-0"
					target="_blank"
					rel="noopener noreferrer">Lighthouse 13</a
				>
				the image findings are now gathered under one insight called "<a
					href="https://developer.chrome.com/docs/performance/insights/image-delivery"
					target="_blank"
					rel="noopener noreferrer">Improve image delivery</a
				>", which flags images with "unnecessarily large download sizes" (older reports split the
				same problem into "Serve images in next-gen formats", "Properly size images" and
				"Efficiently encode images"). If that insight is at the top of your report with a large
				number next to it, this guide is the fix.
			</p>
		</section>

		<section id="image-audit-prompt" class="scroll-mt-24">
			<SectionHeading>Prompt 1: the audit (find every image and what it costs)</SectionHeading>
			<p class="mb-4">
				Start by making the agent look at its own output. You want a table, not a fix, because the
				table tells you which case you are in (next section) and how many images you are dealing
				with (which decides the allowance you need, later). Paste this into the agent that has
				access to the repo:
			</p>
			<CodeCard filename="audit-prompt.txt" code={auditPrompt} wrap />
			<p class="mb-4">
				Three things to read in the result. The <strong>total image bytes</strong> are your before
				number; write it down. The <strong>displayed-at-less-than-half-width</strong> list is where
				resizing alone will do most of the work: a 5,712-pixel phone photo shown in a 1,200-pixel
				column is sending visitors twenty times the pixels they can see. The
				<strong>largest element on the first screen</strong> is your LCP image, the one Google's Core
				Web Vitals score is measured on; it is the first file to fix and the one to treat with care (no
				lazy loading on it, which Prompt 4 covers).
			</p>
			<p class="mb-4">
				If the agent is a chat assistant without access to the repo (you build in Lovable or Bolt
				and talk to it in the browser), ask the same question in the platform's chat; it can read
				its own project. If it cannot give you dimensions, the published site can: open the page,
				right-click an image, choose "Open image in new tab", and Chrome's tab title shows the pixel
				size next to the file name.
			</p>
			<p class="mb-4">
				A metadata check belongs in the audit too, because the agent can do it in one line where you
				have a shell:
			</p>
			<CodeCard filename="metadata-check-prompt.txt" code={metadataCheckPrompt} wrap />
			<p class="mb-4">
				On a site built from your own phone photos, expect that list to be most of them.
			</p>
		</section>

		<section id="plain-img-next-image-or-builder" class="scroll-mt-24">
			<SectionHeading
				>Prompt 2: which case are you in? Plain img, framework component, or builder</SectionHeading
			>
			<p class="mb-4">
				The honest premise of this guide is only half true, and the half that is false matters: some
				agent-built sites already have an image pipeline, because the framework the agent chose has
				one built in. You need to know which case you are in before you fix anything, and the audit
				table tells you.
			</p>
			<p class="mb-4">
				<strong
					>Case A: plain <code>&lt;img&gt;</code> tags (and CSS backgrounds) pointing at files in
					<code>public/</code>.</strong
				>
				This is most Lovable, Bolt and Replit sites, most static sites, and any Next.js or Astro site
				where the agent used the ordinary tag instead of the framework component. Nothing touches the
				file between the repo and the visitor.
				<a
					href="https://docs.astro.build/en/guides/images/"
					target="_blank"
					rel="noopener noreferrer">Astro's documentation</a
				>
				says it plainly: "Files in the <code>public/</code> directory are always served or copied into
				the build folder as-is, with no processing." The whole job is yours, and it has two halves: shrink
				the files, and write the markup (Prompts 3 and 4).
			</p>
			<p class="mb-4">
				<strong>Case B: a framework image component.</strong> If the audit shows
				<code>next/image</code> (Next.js, which is typically what a v0 project is) or Astro's
				<code>&lt;Image /&gt;</code>, the serving side is handled: the component resizes the image
				to the sizes it needs, converts it to WebP or AVIF for browsers that can take it, and sets
				the width and height. What it does not do is change the file in your repo.
				<a
					href="https://nextjs.org/docs/app/api-reference/components/image"
					target="_blank"
					rel="noopener noreferrer">Next.js optimizes on request</a
				>, through an endpoint on your own site, and caches the results on disk; the original stays
				exactly where it was and is still downloadable at its original path. Three consequences
				follow. The repo and every deploy still carry the 6 MB file. Anyone who wants the original,
				metadata included, can fetch it. And on Vercel, every size and format the optimizer makes
				from it is a transformation that counts against a quota (<a
					href="https://vercel.com/docs/image-optimization/limits-and-pricing"
					target="_blank"
					rel="noopener noreferrer">the Hobby plan includes 5,000 a month</a
				>; past the limit "new images will fail to optimize and instead return a runtime error
				response with 402 status code" and visitors see the alt text). A smaller, cleaner source
				means a smaller cache, cheaper transformations and nothing embarrassing at the original URL.
				So in Case B you still run Prompt 3 to shrink the originals and strip the metadata; you skip
				most of Prompt 4 because the component writes the markup for you, and you check two settings
				instead: that <code>sizes</code> is set on any image that is not full width (Next.js assumes
				full width without it, "which can cause unnecessarily large images to be downloaded"), and
				that the first-screen image has <code>preload</code> (or <code>priority</code> on versions before
				Next.js 16).
			</p>
			<p class="mb-4">
				<strong>Case C: a hosted builder with its own image handling.</strong> We looked for a statement
				from Lovable, Bolt, v0 or Replit that uploaded images are resized or re-encoded on publish and
				found none; their documentation tells you to compress your own. Treat a builder site as Case A
				unless you can prove otherwise, and the proof is one minute's work: open the published site, open
				an image in its own tab, and compare the pixel size and file size with the original you uploaded.
				Same numbers, same file.
			</p>
			<p class="mb-4">
				The test that settles any case, and the one to show a client: download an image from the
				live site and read its metadata. On a Mac, open it in Preview, then Tools &gt; Show
				Inspector and look for a GPS tab. In a shell, <code>exiftool -gps:all photo.jpg</code>. If
				coordinates come back, the live site is serving the original.
			</p>
			<p class="mb-4">
				When you do not need this guide: a site whose images are all SVG logos and icons, or
				screenshots already exported at the size they display, or a Case B site whose originals are
				already small and clean. Run the audit anyway; it is one prompt and it tells you.
			</p>
		</section>

		<section id="six-iphone-photos-96-percent-smaller-no-gps" class="scroll-mt-24">
			<SectionHeading
				>What the fix is worth: our six-photo run, 96% smaller, zero GPS</SectionHeading
			>
			<p class="mb-4">
				We tested the workflow on six photographs straight from an iPhone 15, the kind of file a
				client sends over WhatsApp for the "About us" page: 5,712 x 4,284 pixels, 3.6 to 6.3 MB
				each, 26.2 MB for the six. Each went through Mochify once per output format, resized to
				1,600 pixels wide (a sensible ceiling for a full-width photo on a laptop screen) with the
				web-delivery setting on and everything else at automatic quality.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Output (1,600 px wide)</th>
							<th>Six files in</th>
							<th>Six files out</th>
							<th>Smaller by</th>
							<th>Per-file range</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>AVIF</td>
							<td>26.2 MB</td>
							<td>1.04 MB</td>
							<td>96.1%</td>
							<td>95 to 380 KB</td>
						</tr>
						<tr>
							<td>WebP</td>
							<td>26.2 MB</td>
							<td>0.92 MB</td>
							<td>96.5%</td>
							<td>77 to 415 KB</td>
						</tr>
						<tr>
							<td>JPEG (jpegli)</td>
							<td>26.2 MB</td>
							<td>1.08 MB</td>
							<td>95.9%</td>
							<td>129 to 368 KB</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Each call took about a second from a laptop; the engine itself reported 217 to 792
				milliseconds. Three things in the result are worth more than the headline number.
			</p>
			<p class="mb-4">
				<strong>The resize did most of the work.</strong> At 1,600 pixels wide, all three formats
				landed within a few percent of each other. On a 24-megapixel phone photo, choosing the right
				pixel size is the big lever and the format is the last few percent, which is why Prompt 1
				asks for the displayed width. (At automatic quality WebP came out smaller than AVIF on five
				of the six, an observation about these photos at these settings, not a format ranking; AVIF
				still wins on most detailed images, and the <code>&lt;picture&gt;</code> element lets you ship
				both.)
			</p>
			<p class="mb-4">
				<strong>Every output came back with no metadata at all.</strong> We did not ask for that; it is
				the default. Every one of the source photos carried the full iPhone block, including the GPS coordinates
				of a real location. The outputs carried none, and they still came back the right way up: the resize
				applies the orientation stored in the metadata before discarding it, so a portrait phone photo
				stays portrait.
			</p>
			<p class="mb-4">
				<strong>The same engine answers every door.</strong> We ran one of the files twice, once through
				the hosted MCP server from a chat and once through the REST API from a script, with the same settings.
				The two outputs were byte for byte identical. Whichever seat you use below, you get the same file.
			</p>
		</section>

		<section id="prompts-for-each-agent-seat" class="scroll-mt-24">
			<SectionHeading>Prompt 3: have the agent do it, from whichever seat you sit in</SectionHeading
			>
			<p class="mb-4">
				The agent does the work by calling Mochify as a tool: it decides the width, format and name
				from your words, Mochify does the pixel work on its servers, and the file comes back. Which
				seat you are in decides how the file travels, so the prompt changes slightly. Mochify's
				servers hold nothing: an image is streamed into memory, encoded, and wiped, with no copy
				written to disk and no log that contains it (the privacy notes under each seat say exactly
				what differs).
			</p>

			<h3>Seat 1: a chat assistant with the hosted MCP server (no install)</h3>
			<p class="mb-4">
				This is the seat for the person who builds in a browser and does not want to install
				anything, and for the content person on a team who is given a folder of photos and asked to
				"make these web-ready". Connect the hosted server once from the chat app's connectors or
				integrations screen (the steps for the common chat apps and editors are on the <a
					href="https://mochify.app/mcp#setup">MCP server page</a
				>; you sign in to a Mochify account, free or paid). Then, in a chat, attach the photo and
				say what you want:
			</p>
			<CodeCard filename="chat-prompt.txt" code={chatPrompt} wrap />
			<p class="mb-4">
				What happens: the assistant cannot read the bytes of an attached image, so it asks Mochify
				for a one-time upload link and shows it to you; you drop the original onto that page; the
				assistant then calls the <code>squish</code> tool once per output format and comes back with three
				download links. The links live for about five minutes, so save the files straight away, then hand
				them to whoever commits them (or drop them into the builder's chat with "replace the hero with
				these three"). If the photo is already on a public HTTPS address, give the assistant the URL instead
				and skip the upload step; the address must be HTTPS, and Mochify's own pages are not accepted
				as a source.
			</p>
			<p class="mb-4">
				Two limits to know. The hosted server takes one image per call, so this seat is for the
				hero, the team photos and the dozen product shots, not a hundred-image sweep; for that, use
				the web app's batch (up to 25 at a time on paid plans, 3 on Free) or Seat 3. And the privacy
				model here has one extra step: the original is wiped as soon as it is processed, and the
				finished file waits in a pickup store for up to five minutes so your link works, then is
				deleted whether or not you fetched it.
			</p>

			<h3>Seat 2: Claude Code or Cursor with the local MCP server (files in, files out)</h3>
			<p class="mb-4">
				This is the seat for anyone working in the repo. The local server is the <code>mochify</code
				>
				command run as <code>mochify serve</code>; the agent calls its <code>squish</code> tool with
				a file path and gets a file path back, so no image bytes ever enter the conversation and
				nothing is uploaded by hand. Install and register it once (a few commands; our
				<a href="https://mochify.app/guides/image-compression-claude-code-cli-mcp"
					>Claude Code image compression guide</a
				>
				walks through <code>brew install mochify</code>, <code>mochify auth login</code> and
				<code>claude mcp add</code>; Cursor and other MCP clients register the same
				<code>mochify serve</code> command in their MCP settings), then give the agent the audit table
				and this:
			</p>
			<CodeCard filename="claude-code-prompt.txt" code={claudeCodePrompt} wrap />
			<p class="mb-4">
				The agent calls the tool once per output file; each call returns a path and the new size,
				which is why it can write the report without you opening anything. Mochify never upscales
				(an image displayed wider than its pixels comes back at its own size), and the local tool
				never overwrites: a name that already exists gets a numeric suffix, so the originals are
				safe until you delete them in the next step.
			</p>
			<p class="mb-4">
				Privacy on this seat: the bytes travel from your disk to <code>api.mochify.app</code> over HTTPS,
				are encoded in memory and wiped, and the result is written straight back to your disk. There is
				no pickup store and nothing is held, which is as close to zero retention as a cloud encoder gets.
				The file does leave your machine for the encoding; we do not claim otherwise.
			</p>
			<p class="mb-4">
				If you are in Claude Code but cannot install the binary (a locked-down machine, a cloud
				sandbox), the hosted server still works from a shell: the agent asks for an upload link,
				uploads with <code>curl -T</code>, calls <code>squish</code>, and fetches the result link
				with <code>curl</code>. It is four steps per image instead of one, and the allowance cost is
				the same, so install the local server where you can.
			</p>

			<h3>Seat 3: the bulk sweep, from the CLI or the API in a script</h3>
			<p class="mb-4">
				For a site with hundreds of images, or a deploy step that should run without an agent in the
				loop, the same engine is one command or one HTTP call per image. The <code>mochify</code> command
				takes a glob and an output folder:
			</p>
			<CodeCard filename="sweep.sh" code={sweepCode} />
			<p class="mb-4">
				The REST API is the same thing from any language. Our test script was a loop around a single
				call:
			</p>
			<CodeCard filename="squish.sh" code={squishCode} />
			<p class="mb-4">
				On the API, metadata is stripped unless the call says <code>stripExif=false</code>, which is
				the one setting a photographer's portfolio might want and a company site never does. The key
				(<code>$KEY</code> above) comes from your Mochify dashboard; an agent can write this loop
				for you ("write a script that runs this call for every JPEG in public/photos, for avif and
				webp, and prints a size table"), and our guide to
				<a href="https://mochify.app/guides/convert-website-images-to-webp-and-avif"
					>converting a whole site's images to WebP and AVIF</a
				>
				has the version that only converts files that do not have a <code>.webp</code> and
				<code>.avif</code> beside them yet, so it can run on every deploy for nothing.
			</p>
		</section>

		<section id="picture-element-markup-prompt" class="scroll-mt-24">
			<SectionHeading>Prompt 4: the markup the agent should write back</SectionHeading>
			<p class="mb-4">
				New files do nothing until the page points at them, and this is where an agent-built site
				can end up better than a builder's: the agent can write the markup a builder will not let
				you touch. In Case B the framework component does this for you and you skip to the two
				settings named earlier. In Case A, give the agent this:
			</p>
			<CodeCard filename="markup-prompt.txt" code={markupPrompt} wrap />
			<p class="mb-4">The result for one image looks like this:</p>
			<CodeCard filename="hero.html" code={heroCode} />
			<p class="mb-4">
				Why each part is there, briefly: the browser takes the first <code>&lt;source&gt;</code> it
				can decode and downloads only that one, so an AVIF-capable visitor never fetches the JPEG;
				the <code>width</code> and <code>height</code> let the page reserve the space before the
				file arrives, which is what stops the layout jumping; <code>loading="lazy"</code> holds back
				images below the fold until they are needed, and must not go on the first-screen image
				because it would delay the thing the page is judged on. The order of the sources, the
				art-direction tricks and the four rules that make the element render are in our
				<a href="https://mochify.app/guides/html-picture-tag">picture tag guide</a>, and the CSS
				half is in the
				<a href="https://mochify.app/guides/css-background-image-webp-fallback"
					>background-image fallback answer</a
				>; point the agent at either if it gets a detail wrong.
			</p>
			<p class="mb-4">
				Verify it the way a visitor's browser would: open the live page, right-click, Inspect, open
				the Network tab, filter to Img, reload. Each picture should show one request, with an
				<code>.avif</code> name in Chrome, Firefox or Safari 16 or later. Then run PageSpeed Insights
				again and read the "Improve image delivery" line.
			</p>
		</section>

		<section id="agents-md-claude-md-rules-file" class="scroll-mt-24">
			<SectionHeading>Prompt 5: keep it fixed with one line in the rules file</SectionHeading>
			<p class="mb-4">
				A one-off clean-up lasts until the next photo. The durable fix is to make image processing
				the agent's default, and every coding agent now reads a plain-text file of standing
				instructions at the start of a session: <code>CLAUDE.md</code> for Claude Code,
				<a href="https://agents.md/" target="_blank" rel="noopener noreferrer"
					><code>AGENTS.md</code></a
				>
				for Codex, Cursor, Copilot's coding agent, Gemini CLI, Windsurf and most of the rest (an open
				format now stewarded under the Linux Foundation and "used by over 60k open-source projects"),
				and <code>.cursor/rules/*.mdc</code> for
				<a href="https://cursor.com/docs/context/rules" target="_blank" rel="noopener noreferrer"
					>Cursor's own rule files</a
				>. Claude Code reads <code>AGENTS.md</code> in place of <code>CLAUDE.md</code> if that is
				what the repo has, and Cursor reads <code>AGENTS.md</code> too, so one file usually covers everyone.
				Add this to it:
			</p>
			<CodeCard filename="AGENTS.md" code={agentsMdCode} />
			<p class="mb-4">
				Ask the agent to add it and to confirm it applies to the right scope: "Add this Images
				section to the project's CLAUDE.md (or AGENTS.md), and tell me which file you read on
				startup." In Cursor, the equivalent is a rule with <code>alwaysApply: true</code>.
			</p>
			<p class="mb-4">
				Be honest with yourself about what a rules file is. <a
					href="https://code.claude.com/docs/en/memory"
					target="_blank"
					rel="noopener noreferrer">Claude Code's own documentation</a
				>
				says it treats these files as "context, not enforced configuration": the line makes processing
				the default, and a determined prompt or a distracted session can still skip it. For enforcement,
				add the same check as a pre-commit hook that rejects any image over your size limit or with a
				GPS tag, and have the agent write it ("add a pre-commit hook that fails if any staged image is
				over 300 KB or carries GPSLatitude"). The rule makes it happen by default; the hook makes it impossible
				to forget.
			</p>
		</section>

		<section id="check-usage-allowance-prompt" class="scroll-mt-24">
			<SectionHeading
				>Prompt 6: count the images against an allowance before you start</SectionHeading
			>
			<p class="mb-4">
				Every output file is one operation against a Mochify allowance, so three formats for 100
				images is 300 operations, and the agent can count that for you before it spends anything.
				The hosted MCP server exposes a <code>check_usage</code> tool, and the API has the same read
				at <code>GET /v1/checkTokens</code>, which a coding agent can call with the key from your
				dashboard:
			</p>
			<CodeCard filename="allowance-prompt.txt" code={allowancePrompt} wrap />
			<p class="mb-4">
				The tiers, by what they allow rather than what they cost: a free account gets 25 operations
				a month with a batch of 3 and a 20 MB file limit, enough to test on the hero and a handful
				of photos. Seller gives 300 a month, Pro 1,200 and Growth 5,000, all with 75 MB files and
				batches of 25, and all three include the MCP servers and the API; Seller is the right size
				for one site that gets new photos every week. A Day Pass is $2 for 100 operations in 24
				hours with no signup, which covers a one-off pass over a small site from the web app; used
				from an assistant it needs a free account you are signed in with, and for those 24 hours it
				replaces the account's monthly 25 rather than adding to it. The agent reports the number; a
				person decides and pays. Current limits are on the <a href="https://mochify.app/pricing"
					>pricing page</a
				>.
			</p>
		</section>

		<section id="agencies-per-client" class="scroll-mt-24">
			<SectionHeading>For agencies: the same six prompts per client</SectionHeading>
			<p class="mb-4">
				If you build sites for clients with an agent, this is a repeatable service rather than a
				one-time fix, and it maps onto how a team already splits the work. The content person works
				in the chat seat: they receive the client's photos, run them through the hosted MCP server,
				and hand over clean, sized files with the location data already gone, which matters when the
				client is a clinic, a school or anyone whose photos were taken at a home address. The
				developer works in the local seat: the rules file is in the project template, so every new
				client repo starts with the image policy in place, and the pre-commit hook catches the one
				time someone pastes a photo straight in. The allowance question becomes a per-client line
				item: run Prompt 6 against the audit at kickoff, and put the operations count in the
				proposal next to the page count.
			</p>
			<p class="mb-4">
				The handoff between the two seats is the part teams skip. Make it a file: the audit table
				from Prompt 1, with a column for "processed by" and "committed in", lives in the repo next
				to the images. It is the before-and-after the client sees, and the record of who stripped
				what from which photo. (For an agency, that record is also the answer to a data-protection
				question; Mochify's <a href="https://mochify.app/dpa">data processing agreement</a> and the
				<a href="https://mochify.app/architecture">architecture page</a> describe the in-memory model
				if a client asks where the photos went.)
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: optimize an agent-built site's images</SectionHeading>
			<p class="mb-6">
				The same job, step by step, whichever seat you are in. The natural-language layer runs
				through all of them: in the web app and on the command line you describe the result and
				Magic Flow turns the words into settings; in an agent, your words go to the agent, which
				picks the settings and calls the tool.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>Run the audit (Prompt 1)</h3>
						<p>Write down the total image bytes and the largest first-screen image.</p>
					</li>
					<li>
						<h3>Decide the case (Prompt 2)</h3>
						<p>
							Plain <code>&lt;img&gt;</code> means you do files and markup; a framework component
							means files only plus the <code>sizes</code> and preload checks.
						</p>
					</li>
					<li>
						<h3>Try it on one image first</h3>
						<p>
							Drop the hero on <a href="https://mochify.app/flow">mochify.app/flow</a> and type
							"convert to AVIF, 1,600 pixels wide, for the web"; or on the command line,
							<code>mochify hero.jpg -p "convert to avif, 1600px wide"</code>. Open the result,
							check it is upright and looks right, and read the size. That is the number you will
							get for every image.
						</p>
					</li>
					<li>
						<h3>Process the set (Prompt 3)</h3>
						<p>
							From the chat seat for a handful, the local server for a repo, or the CLI/API for
							hundreds. Mochify never upscales and the local tool never overwrites.
						</p>
					</li>
					<li>
						<h3>Write the markup (Prompt 4)</h3>
						<p>
							The <code>&lt;picture&gt;</code> element, width and height, lazy loading below the fold,
							priority on the first-screen image. Delete the originals the audit listed.
						</p>
					</li>
					<li>
						<h3>Add the rules-file line and the hook (Prompt 5)</h3>
						<p>So the next photo is handled the same way without being asked.</p>
					</li>
					<li>
						<h3>Verify</h3>
						<p>
							The Network tab filtered to Img shows one small request per picture; a downloaded
							image from the live site has no GPS tab; PageSpeed Insights' "Improve image delivery"
							line is gone or small.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				Privacy, stated for each surface because they differ: on the local server, the CLI and the
				API, the image is streamed into memory at <code>api.mochify.app</code>, encoded, wiped, and
				the result comes straight back to your disk with nothing held; on the hosted server the
				original is wiped the same way and the finished file waits in a five-minute pickup store so
				your link resolves, then is deleted. Images and PDFs are never used to train anything. They
				do travel to the API for the encoding; the one Mochify surface that never leaves the device
				is video, in the web app, which is not part of this workflow.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr><th>You want to</th><th>Seat</th><th>Prompt or command</th></tr>
					</thead>
					<tbody>
						<tr>
							<td>Know how bad it is</td>
							<td>Any agent with the repo</td>
							<td>Prompt 1 (audit table: path, pixels, KB, displayed width, reference type, GPS)</td
							>
						</tr>
						<tr>
							<td>Know whether anything already optimizes</td>
							<td>Audit result</td>
							<td
								>Plain <code>&lt;img&gt;</code> in <code>public/</code> = Case A, do files and
								markup;
								<code>next/image</code> or Astro <code>&lt;Image&gt;</code> = Case B, do files,
								check
								<code>sizes</code> and preload</td
							>
						</tr>
						<tr>
							<td>Fix a few images with nothing installed</td>
							<td>Chat + hosted MCP server</td>
							<td
								>Attach photo: "three versions at 1,600 wide, AVIF, WebP, JPEG, metadata stripped";
								one image per call, links last ~5 min</td
							>
						</tr>
						<tr>
							<td>Fix a repo's images</td>
							<td>Claude Code / Cursor + local MCP server</td>
							<td
								>Prompt 3: largest displayed width from 640/1024/1600/2048, three formats,
								<code>&lt;name&gt;-&lt;width&gt;</code>, report sizes</td
							>
						</tr>
						<tr>
							<td>Fix hundreds</td>
							<td>CLI or API</td>
							<td
								><code>mochify ./public/photos/*.jpg -t avif -w 1600 -o ./public/photos/web</code>
								or
								<code>POST /v1/squish?type=avif&amp;width=1600&amp;optimizeForWeb=1</code></td
							>
						</tr>
						<tr>
							<td>Keep metadata on purpose</td>
							<td>API, or an assistant on the hosted MCP server</td>
							<td><code>stripExif=false</code> (the default strips, GPS included)</td>
						</tr>
						<tr>
							<td>Point the page at the new files</td>
							<td>Agent with the repo</td>
							<td
								>Prompt 4: <code>&lt;picture&gt;</code> with AVIF, WebP, JPEG; width and height;
								lazy below the fold; <code>fetchpriority="high"</code> on the first-screen image</td
							>
						</tr>
						<tr>
							<td>Make it the default forever</td>
							<td>Rules file</td>
							<td
								>The Images section in <code>CLAUDE.md</code> / <code>AGENTS.md</code> /
								<code>.cursor/rules</code>, plus a pre-commit hook on size and GPS</td
							>
						</tr>
						<tr>
							<td>Know what it will cost in operations</td>
							<td>Any agent</td>
							<td
								>Prompt 6: <code>check_usage</code> (hosted MCP server) or
								<code>GET /v1/checkTokens</code> (API); images x formats</td
							>
						</tr>
						<tr>
							<td>Prove it worked</td>
							<td>Browser</td>
							<td
								>Network tab, Img filter, one <code>.avif</code> per picture; downloaded image has no
								GPS; "Improve image delivery" gone</td
							>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				What our run measured: six iPhone photos, 26.2 MB, to 1.04 MB AVIF, 0.92 MB WebP, 1.08 MB
				JPEG at 1,600 wide (about 96% smaller each way); every output free of metadata; 23 of 23
				source photos had carried GPS coordinates; hosted MCP and API outputs byte-identical.
			</p>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA
			href="/mcp#setup"
			label="Connect the MCP server"
			secondaryHref="/flow"
			secondaryLabel="Try one photo"
		>
			Connect the hosted server from the <a href="https://mochify.app/mcp">MCP server page</a> and
			run Prompt 1 on your own site, or try a single photo at
			<a href="https://mochify.app/flow">mochify.app/flow</a> with the prompt
			<em>"convert to AVIF, 1,600 pixels wide, for the web"</em>. Twenty-five images a month are
			free with an account.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>

<style>
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
