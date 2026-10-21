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

	// Built from content-ops `article-originals/remove-objects-from-photo-ai-assistant.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off.
	const metadata = {
		title: 'How to Remove Objects From a Photo With an AI Assistant (and Recolor Them)',
		seoTitle: 'Remove Objects From a Photo - Ask Your AI Assistant',
		description:
			'Ask the AI assistant you already have open to erase a bin, a cable or a stranger from your own photo, or recolor an object and keep its shading. Real runs.',
		category: 'AI & Automation',
		readTime: '28 min read',
		date: 'October 20, 2026',
		bylineNote:
			'Written from five real erase and recolor runs on October 19, 2026: a traffic cone and a car on an empty road, and a red leather bench that became blue.'
	};

	const keywords =
		'remove object from photo, remove objects from photo ai assistant, erase object from photo, change color of object in photo, recolor object in photo, object remover, MCP server';

	const pageUrl = 'https://mochify.app/guides/remove-objects-from-photo-ai-assistant';

	const toc = [
		{ id: 'what-erase-does', label: 'What erase actually does' },
		{ id: 'why-not-the-chatbot', label: 'Why not let the assistant do the whole thing?' },
		{ id: 'four-words', label: 'Four words this guide uses' },
		{ id: 'ask-your-assistant', label: 'The fastest route: ask your assistant' },
		{ id: 'what-goes-wrong', label: 'What goes wrong, and what to say next' },
		{ id: 'listing-photos', label: 'Listing photos: erase the clutter, never the flaw' },
		{ id: 'recolor', label: 'Recolor an object and keep its shading' },
		{ id: 'erase-or-redact', label: 'Erase or redact: which one you need' },
		{ id: 'what-happens-to-the-file', label: 'What happens to the file' },
		{ id: 'rest-api', label: 'Doing it in bulk: the REST API' },
		{ id: 'when-not-needed', label: 'When you do not need any of this' },
		{ id: 'mochify-workflow', label: 'Mochify workflow: erase and recolor from your assistant' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const eraseCall = 'eraseBoxes: [[0.775, 0.57, 0.07, 0.15]]\ntype: jpg';

	const recolorCall = 'recolorBoxes: [{ box: [0.29, 0.37, 0.67, 0.47], color: "#1e3a8a" }]\ntype: jpg';

	const eraseCode = [
		'# Erase one object (box as fractions x,y,w,h), output JPG',
		'curl -X POST "https://api.mochify.app/v1/squish?type=jpg&erase=0.775,0.57,0.07,0.15" \\',
		'  -H "Authorization: Bearer $MOCHIFY_KEY" \\',
		'  -H "Content-Type: image/jpeg" \\',
		'  --data-binary @road.jpg -o road-clean.jpg -D headers.txt',
		'',
		'# Erase a garden light and recolor the cushion navy in one call, output WebP',
		'curl -X POST "https://api.mochify.app/v1/squish?type=webp&erase=0.785,0.26,0.09,0.15&recolor=0.29,0.37,0.67,0.5:%231e3a8a" \\',
		'  -H "Authorization: Bearer $MOCHIFY_KEY" \\',
		'  -H "Content-Type: image/jpeg" \\',
		'  --data-binary @bench.jpg -o bench-navy.webp -D headers.txt'
	].join('\n');

	const faqItems = [
		{
			q: 'Can an AI assistant remove an object from a photo?',
			a: `Yes, if it is connected to a tool that edits pixels. With Mochify's hosted MCP server connected, you say "remove the bin on the left"; the assistant finds it, sends Mochify a box as fractions of the image, and Mochify paints the object out, fills the gap with matching background and returns the edited file. The assistant never edits the pixels itself and never receives the finished image, only a download link that lasts about five minutes. The operation needs a paid plan, including the Day Pass (over the MCP servers, a Day Pass is used on a free account you are signed in with).`
		},
		{
			q: 'Can ChatGPT or Claude remove an object from a photo on their own?',
			a: `A chatbot editing on its own works on the copy its upload step made, not on your file, and whatever it hands back comes out of its own image model rather than out of your pixels. In our earlier measurements of what chatbots do to an attached photo, that copy had lost 80% to 94% of the pixels and all of the metadata before any model ran, and two of the five returned no file at all. Connected to Mochify over MCP, the assistant only decides where the box goes; Mochify edits the original you uploaded, at its full size, and touches nothing outside the outline.`
		},
		{
			q: 'Why does the removed object leave a soft patch?',
			a: `Because the fill is invented, and the inpainting model paints at a fixed 512 by 512. A small object on texture or a plain background comes out clean; a large object, or one in front of a busy structured background, comes out softer, as the car in <a href="#what-goes-wrong">What goes wrong, and what to say next</a> did. A bigger box does not fix this; cropping the object out, or accepting the patch at the size the photo will be seen, does.`
		},
		{
			q: 'Is it safe to use erase to hide a license plate or a face?',
			a: `No. Erase invents what was behind the object, which makes it a cosmetic tool, not a privacy one. For a plate, a face, an address or a document, use redaction, which replaces the area with a solid block that carries no information. Both take the same kind of box, and both can be in one call.`
		},
		{
			q: 'Does recolor change anything outside the object, and why did the color come out brighter than I asked for?',
			a: `It changes only the object inside the outline Mochify finds within your box, never the rectangle itself, and it generates nothing: existing pixels change color while their shading stays. The box still matters, because everything inside the outline takes the color; box the jacket, not the person, and include all of the part so no edge is left in the old color. A brighter result than you asked for is the same preservation at work: the object's lightness is kept so that its shading survives, which is why a bright red cushion asked to become dark navy came out as a strong royal blue in our run. Ask for "darker" or "more muted" and let the assistant adjust the target and call again.`
		},
		{
			q: 'Does the photo leave my computer?',
			a: `Yes. Images are sent to <code>api.mochify.app</code> over HTTPS, processed in memory and wiped immediately; the hosted MCP server keeps the finished file for about five minutes so your download link works. The inpainting and outline models run on Mochify's own servers with no third-party service. The edited file always comes back with its metadata stripped and any HDR gain map removed, because either could still show the object you erased.`
		},
		{
			q: 'I would rather not use AI on this photo. What are my options?',
			a: `A crop, if the object is near an edge; a clone or patch tool in a desktop editor, which copies real pixels from elsewhere in the same photo rather than predicting new ones; or leaving it. Erase is an AI operation and this guide does not pretend otherwise. For a photo that matters to you as a record, a crop is the only one of the three that invents nothing.`
		},
		{
			q: 'Can I erase an object with a Magic Flow prompt, or from the command line?',
			a: `No. Erase and recolor need something that can see the picture to place the box, so they live on the two MCP servers and the REST API, not in the web app's prompt box, the Chrome extension or the <code>mochify</code> command-line tool. Face redaction is the exception that proves the rule: it needs no box, so a plain prompt asking for faces to be hidden works on every Magic Flow surface.`
		}
	];

	const related = [
		{
			title: 'How to Blur Faces or a License Plate in a Photo (Ask Your AI Assistant)',
			href: '/guides/blur-faces-license-plate-ai-assistant',
			desc: 'the "hide it" half of this pair: redaction by box and by face detector, and why a blur is not the same as hiding.'
		},
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
			title: 'How to Take Vinted Photos That Sell',
			href: '/guides/vinted-photos-that-sell',
			desc: 'the listing-photo rules erase has to respect, and what actually moves a sale.'
		},
		{
			title: 'Can ChatGPT Compress a Photo? We Measured What Comes Back',
			href: '/guides/can-chatgpt-compress-images',
			desc: 'what a chatbot actually receives when you attach a picture, and why that matters for any edit it makes alone.'
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
		datePublished="2026-10-20"
		article={{
			about: ['object removal', 'inpainting', 'recolor', 'EXIF metadata', 'MCP server', 'Mochify API', 'marketplace listing photos'],
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
			<AccentTitle title={metadata.title} accent="Remove Objects" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			The quickest way to remove a small object from a photo you took, the bin behind the bike you
			are selling, a cable across a wall, a stranger at the edge of a vacation photo, is to ask the
			AI assistant you already have open: <em>"remove the cone on the curb and fill in the background"</em>.
			With Mochify connected as an MCP server, the assistant looks at the picture, draws a box around
			the thing, and sends Mochify four numbers. Mochify finds the object's outline inside that box,
			paints it out, fills the gap with background that matches its surroundings, and hands back a
			file. The same route changes an object's color while keeping every fold and highlight:
			<em>"make the cushion navy and keep the shading"</em>.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			Why not just ask the chatbot to do the whole job? Because the photo a chatbot edits is not the
			photo you attached: its upload step has already thrown away most of the pixels and all of the
			metadata, and whatever comes back comes out of its own image model. The MCP route splits the
			work so that the assistant only decides <em>where</em>, and Mochify edits your original, at
			full size, inside the box and nowhere else. The measurements are in
			<a href="#why-not-the-chatbot">Why not let the assistant do the whole thing?</a>.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			This guide shows erase and recolor with real runs made on October 19, 2026, including the two
			that did not come out clean, because the honest version of object removal is more useful than
			the demo version. It covers what erase is for and what it must never be used for, how to brief
			your assistant so the box is right first time, what happens to the file, and the REST API for
			anyone doing this in bulk.
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

		<section id="what-erase-does" class="scroll-mt-24">
			<SectionHeading>What erase actually does</SectionHeading>
			<p class="mb-4">
				Erase is inpainting: Mochify removes the pixels of the object you boxed and paints new pixels
				in their place, predicted from the surroundings. The result is a guess about what was behind
				the object, and a good guess on the right kind of object looks like nothing was ever there.
				Three things follow from that, and the rest of this guide keeps coming back to them.
			</p>
			<p class="mb-4">
				<strong>It invents content.</strong> Tool pages like to say the AI replaces the object "with
				what is behind it". It cannot, because nothing behind the object was ever photographed. The
				grass behind the erased cone in <a href="#ask-your-assistant">the first run below</a> is not
				grass that was photographed; it is grass the model believed should be there. That makes erase
				a cosmetic tool for tidying your own photos. It is never a way to hide something sensitive,
				because an invented patch can be read, compared and questioned in a way that a solid black
				block cannot. For a license plate, a face, an address or a document, use
				<a href="https://mochify.app/guides/blur-faces-license-plate-ai-assistant">redaction</a>
				instead; <a href="#erase-or-redact">Erase or redact: which one you need</a> draws the line.
			</p>
			<p class="mb-4">
				<strong>Small and textured is easy; large and structured is hard.</strong> Mochify's inpainting
				model paints at a fixed 512 by 512, so a small distraction against pavement, grass, sky or a
				plain wall comes out clean, and a large removal, or one in front of a busy structured
				background, comes out softer. This is not a Mochify quirk. The research behind modern
				inpainting describes the same wall: these systems "often struggle with large missing areas,
				complex geometric structures, and high-resolution images" (<a
					href="https://arxiv.org/abs/2109.07161"
					target="_blank"
					rel="noopener noreferrer"
					>Suvorov et al., "Resolution-robust Large Mask Inpainting with Fourier Convolutions", 2021</a
				>). <a href="#what-goes-wrong">What goes wrong, and what to say next</a> shows what "softer"
				looks like on a real car.
			</p>
			<p class="mb-4">
				<strong>Something has to choose the box.</strong> Erase works on the REST API and on both of
				Mochify's MCP servers, where your assistant (or your own code) looks at the image and picks the
				rectangle. It is not in the <code>mochify</code> command-line tool, not a control in the web app,
				not a Magic Flow prompt, and not on any of the tool pages, for the same reason redaction is not:
				a text prompt cannot see the picture to place a box. Erase and recolor are on the paid plans,
				including the Day Pass (used from an assistant, on a free account you are signed in with); the
				Free plan's 25 images a month cover the image tools, redaction included, but not these two.
			</p>
		</section>

		<section id="why-not-the-chatbot" class="scroll-mt-24">
			<SectionHeading>Why not let the assistant do the whole thing?</SectionHeading>
			<p class="mb-4">
				Because the photo a chatbot edits is not the photo you attached. When we measured what five AI
				chatbots actually receive when you attach a picture, between 80% and 94% of the pixels were gone
				before any model ran, removed by the upload step along with the camera data, the GPS position,
				the color profile and the HDR gain map; from a 5712 x 4284 iPhone photo, ChatGPT worked on a
				2048 x 1536 copy, Claude on 2576 x 1932 and Perplexity on 1440 x 1080, and Gemini and DeepSeek
				returned no file at all (the full test is in our guide to <a
					href="https://mochify.app/guides/can-chatgpt-compress-images"
					>what comes back when you ask ChatGPT to compress a photo</a
				>). We tested compression in that piece, not object removal, so we will not claim what each
				chatbot does when asked to take a bin out of a picture. What we can say is that if it edits,
				it edits the shrunken copy, and what you get back comes out of its image model at the image
				model's size: a tidied listing photo at a fifth of its pixels, with no record of what else
				changed, or no file at all.
			</p>
			<p class="mb-4">
				The MCP route separates the two jobs so neither one degrades the other. The assistant looks at
				the reduced preview, which is all it needs to decide where the object is, because the box is
				sent as fractions of the picture rather than pixels: a cone 78% of the way across a 1280-pixel
				original is 78% of the way across any preview of it, and the chat platforms we measured scale
				proportionally without cropping, so every fraction stays where it was. What the preview does
				cost is precision on small items, which is why the assistant draws with a margin and you check
				the result. Mochify, meanwhile, works on the original bytes: the file at the public URL you
				pasted, or the original you dropped on the one-time upload link. In the first run below the
				1280 x 853 source came back at 1280 x 853 with one cone gone and nothing else changed; the
				bench photo came back at its full 1280 x 956 with a blue cushion and the same pebbles, floor
				and legs. The assistant's upload pipeline never touches the file Mochify receives, and that
				holds for any MCP client whose model can see a picture, whatever the model's own upload step
				does to it.
			</p>
			<p class="mb-4">
				Three more things the split gives you that a one-step chatbot edit does not. The change is
				confined: only the pixels inside the outline Mochify finds are repainted or recolored, so the
				rest of the photo is your photo, not a regenerated likeness of it. The result tells you what
				happened: a count of what was erased or recolored, with the instruction to look at the spot,
				and on the REST API a header for how much of the frame was repainted. And the file is handled
				deliberately: the metadata and any HDR gain map are removed on purpose, because either could
				still carry the object, rather than lost as a side effect of an upload.
			</p>
			<p class="mb-4">
				It is also usually cheaper. The edit is one tool call and one line of result text in the
				conversation, not an image generation; the finished file never enters the chat as pixels or as
				a base64 blob, so a batch of twenty listing photos costs twenty short tool calls, not twenty
				images' worth of tokens each way.
			</p>
		</section>

		<section id="four-words" class="scroll-mt-24">
			<SectionHeading>Four words this guide uses</SectionHeading>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Box</strong>: a rectangle around the object, given as four numbers: left edge, top
						edge, width and height. Mochify takes them as <em>fractions of the picture</em> from 0 to 1,
						measured from the top-left corner of the photo as it displays upright, never as pixels.
						<code>0.775, 0.57, 0.07, 0.15</code> means "start 77.5% of the way across and 57% of the way
						down; cover 7% of the width and 15% of the height". Up to eight erase boxes, and up to eight
						recolor boxes, in one call. A box for erase should go around the <em>whole</em> object with
						a clear margin, shadow included; a snug box is the failure case, because anything left outside
						it can grow back.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Erase</strong>: paint the boxed object out and fill the area with plausible
						background. Mochify finds the object's outline inside the box and repaints only the outline
						plus a margin, so as little of the scene as possible is invented; if no clear outline is
						found, the whole box is repainted.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Recolor</strong>: change the color of the object inside the box and keep its
						shading. The outline is found the same way; the hue moves to the color you asked for and the
						lightness and saturation shift toward it, while every fold, highlight and texture stays where
						it was. Nothing is generated.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Redact</strong>: replace an area with a solid block (or a blur) so its content
						cannot be read back. The privacy operation; a different tool with a different guide.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Order matters when you combine them: Mochify erases first, then recolors, then redacts, then
				crops to any <code>region</code> you set. So you can erase the garden light and recolor the bench
				in one call, and a crop can never bring an erased object back.
			</p>
		</section>

		<section id="ask-your-assistant" class="scroll-mt-24">
			<SectionHeading>The fastest route: ask your assistant</SectionHeading>
			<p class="mb-4">
				Connect Mochify's hosted MCP server to an assistant that can see images (Claude Desktop,
				Cursor, or any client that supports remote MCP servers), attach the photo or paste a public
				link to it, and say what should go. The assistant finds the thing and measures the box; Mochify
				does the pixel work. The <a href="https://mochify.app/mcp#erase">MCP server page</a> has the
				one-time setup and the prompt for every capability; the
				<a href="https://mochify.app/guides/how-the-mochify-mcp-server-works">hosted-versus-local guide</a>
				goes deeper on the clients. If you run the local server (<code>mochify serve</code>) instead,
				the same instructions apply, with one difference in what comes back: the local server writes
				the finished file to disk and returns its path, with no download link and no pickup store.
			</p>
			<p class="mb-4">
				Here is the first real run, exactly as it happened on October 19, 2026, on a 1280 x 853 street
				photo: an empty tree-lined road, a line of traffic cones along the curb, and one cone standing
				on its own where the grass verge meets the tarmac.
			</p>
			<p class="mb-4">
				<strong>You say:</strong>
				<em>"Remove the cone on the curb nearest the camera, the one on its own, and fill in the background."</em>
			</p>
			<p class="mb-4">
				<strong>The assistant does:</strong> looks at the image, measures the cone (about 78% of the
				way across and 57% down, a little under a tenth of the frame tall), adds a margin for its base
				and shadow, and calls Mochify's <code>squish</code> tool with one box:
			</p>
			<CodeCard filename="squish-call.txt" code={eraseCall} />
			<p class="mb-4">
				<strong>Mochify returns:</strong>
				<code>Image processed successfully (image/jpeg, 226.5 KB)</code>, a download link, and the
				line
				<code
					>Erased 1 area(s). Look at the result before calling it done: if part of an object, or its
					shadow, is still visible or has partly grown back, call again with a larger box around it.</code
				>
				The cone is gone. The curb line and the edge of the grass run through the spot unbroken, the road
				markings beyond are untouched, and at normal viewing size there is no seam to find. The file came
				back at its original 1280 x 853.
			</p>
			<p class="mb-4">
				<strong>The result line is advice, not a formality.</strong> Mochify can count the boxes it
				painted; it cannot judge whether the patch looks right in your eyes. Open the link and look at
				the spot before you move on. <a href="#what-goes-wrong">What goes wrong, and what to say next</a>
				is about what you will sometimes see.
			</p>
			<p class="mb-4">
				<strong>The link is short-lived.</strong> The hosted MCP server hands back a URL on
				<code>files.mochify.app</code> that expires in about five minutes; the assistant does not receive
				the image bytes, only that URL, so your conversation never fills up with a base64 blob. Click it,
				save the file, done.
			</p>
			<p class="mb-4">
				<strong>If you attached the photo to the chat rather than pointing at a URL:</strong> the
				assistant sees the picture as pixels, not as a file, so it cannot forward your original by
				itself. It will call <code>create_upload</code> and give you a one-time upload link; drop the
				same photo on it and the assistant carries on with the returned upload id. The upload is deleted
				as soon as Mochify reads it, or after fifteen minutes if nothing does.
			</p>
			<p class="mb-4">
				Ready to try it on one of your own? <a href="https://mochify.app/mcp#setup">Connect the server</a>,
				attach the photo, and name the thing you want gone.
			</p>
		</section>

		<section id="what-goes-wrong" class="scroll-mt-24">
			<SectionHeading>What goes wrong, and what to say next</SectionHeading>
			<p class="mb-4">
				Every object-removal tool's marketing page shows the clean case. These are the three unclean
				cases from the same session, with the sentence that fixes each one.
			</p>
			<p class="mb-4">
				<strong>1. The large object comes out soft.</strong> In the second run the assistant boxed
				three things in one call: the lone cone again, two distant pedestrians by a lamp post, and a
				car on the road about 8% of the frame wide
				(<code>[[0.8, 0.42, 0.085, 0.105], [0.88, 0.42, 0.04, 0.09], [0.775, 0.57, 0.07, 0.15]]</code>).
				Mochify returned <code>Erased 3 area(s)</code>. The cone and the pedestrians were clean. Where
				the car had been, the tarmac carried a soft gray patch, the right color and roughly the right
				brightness, but visibly smoother than the road around it. That is the documented limit: the
				model paints at 512 by 512, and a mid-size object in front of a textured surface is where the
				invention starts to show. There is no sentence that fixes this one. If the object is large, the
				honest options are to crop it out instead (<em>"crop to the left two-thirds and keep the cones"</em>),
				to accept a soft patch that will pass at thumbnail size, or to leave it. Do not expect a second
				call with a bigger box to help; the box was not the problem.
			</p>
			<p class="mb-4">
				<strong>2. Part of the object grows back.</strong> The box was too tight, and the model treated
				the piece outside it as scenery worth preserving. The result line tells you what to do:
				<em>"the top of the cone is still showing, make the box bigger"</em>. The assistant redraws with
				more margin and calls again; the second call costs one more image from your allowance, nothing
				else. Shadows are the usual culprit. A person on a sunny pavement casts one that runs well outside
				their outline, and a removed person with their shadow left behind looks wrong in a way the eye
				catches instantly. Say <em>"include the shadow"</em> up front.
			</p>
			<p class="mb-4">
				<strong>3. The model finds an object you did not mean.</strong> Erase and recolor both work by
				finding an outline inside the box. On a plain background that works as described; on a strongly
				textured one, the model can find "an object" where you see none.
				<a href="#recolor">Recolor an object and keep its shading</a> has the run where a recolor box
				drawn deliberately over bare pebbles, to see whether it would be skipped, was not skipped: the
				model picked a cluster of stones and recolored them. The lesson transfers to erase: keep boxes as
				tight as the margin rule allows, and look at the result rather than trusting the count.
			</p>
			<p class="mb-4">
				Across the five calls in this session, the allowance went from 249 to 244: one image per call,
				whether it carried one box or three, erase, recolor or both.
			</p>
		</section>

		<section id="listing-photos" class="scroll-mt-24">
			<SectionHeading>Listing photos: erase the clutter, never the flaw</SectionHeading>
			<p class="mb-4">
				Marketplace sellers are the people who will use erase most, because a clean photo sells and the
				background of a spare bedroom rarely cooperates. The rule for using it well is one sentence:
				erase things that are not the item, never anything that is.
			</p>
			<p class="mb-4">
				The platforms draw the same line. eBay's picture policy prohibits "photos that don't accurately
				represent the item" alongside added borders, text and watermarks, and requires at least one
				photo 500 pixels on its longest side (<a
					href="https://www.ebay.com/help/policies/listing-policies/picture-policy?id=4370"
					target="_blank"
					rel="noopener noreferrer">eBay picture policy</a
				>). Vinted tells sellers they "must provide clear, accurate photos showing the actual item as it
				is" and may not use any image "that doesn't depict the actual item being sold" (<a
					href="https://www.vinted.co.uk/help/1120"
					target="_blank"
					rel="noopener noreferrer">Vinted, commercial selling</a
				>). Neither bans editing; both ban editing that changes what the buyer thinks they are getting.
			</p>
			<p class="mb-4">
				So the bin, the cable, the cat's tail, the second pair of shoes that crept into the frame, the
				garden light behind the bench: fair game, and exactly what erase is built for. The scratch on
				the item, the stain, the missing button, the scuff on the sole: not. A buyer who receives a flaw
				that was painted out of the photo has a case, and the platform's own words are on their side. If
				a flaw is the problem, photograph it clearly and describe it; sellers who do that get fewer
				returns, which is the subject of the
				<a href="https://mochify.app/guides/vinted-photos-that-sell">Vinted photos guide</a> and the
				<a href="https://mochify.app/guides/product-image-requirements-marketplace-guide"
					>marketplace photo requirements guide</a
				>.
			</p>
			<p class="mb-4">
				Two practical notes for the same audience. First, erase is for your own photos: the ones you
				took of the things you are selling. Second, "remove" means two opposite things in this corner of
				the internet, and the search results mix them up: <em>remove the object</em> (erase it from the
				scene, this guide) and <em>remove the background from the object</em> (cut the item out to use
				on white or elsewhere). If what you want is the whole background gone, that is background
				removal, which is on every plan including Free and is a plain Magic Flow prompt
				(<em>"remove the background and make it white"</em>); erase is for a few objects in a background
				you are keeping.
			</p>
		</section>

		<section id="recolor" class="scroll-mt-24">
			<SectionHeading>Recolor an object and keep its shading</SectionHeading>
			<p class="mb-4">
				Recolor answers the listing question "do you have it in blue?" without a second photo shoot,
				and the design question "what would the chairs look like in green?" without a mock-up. The
				assistant boxes the exact part to recolor, you name the color, and Mochify changes only the
				object inside the outline: the hue becomes the color you asked for, lightness and saturation
				shift toward it, and every fold, button, highlight and texture keeps its place. It is not
				generative. No pixel is invented; existing pixels change color.
			</p>
			<p class="mb-4">
				The run, on a 1280 x 956 photo of a red leather bench on steel legs, standing on a wood floor in
				front of a bed of white pebbles:
			</p>
			<p class="mb-4">
				<strong>You say:</strong>
				<em>"Make the bench cushion navy and keep the shading. Leave the legs and the floor alone."</em>
			</p>
			<p class="mb-4">
				<strong>The assistant does:</strong> boxes the cushion, not the whole bench, and converts "navy"
				to a hex value:
			</p>
			<CodeCard filename="squish-call.txt" code={recolorCall} />
			<p class="mb-4">
				<strong>Mochify returns:</strong>
				<code>Image processed successfully (image/jpeg, 167.5 KB)</code> and
				<code>Recolored 1 area(s).</code> The cushion is blue with every tufted button and every crease
				intact; the steel legs, the wood grain and the pebbles are untouched, and the color stops at the
				leather's edge rather than at the rectangle's. Two things to know from that result:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The color lands near your target, not on it.</strong> The leather's own lightness
						carried over, so a dark navy came out as a strong royal blue. That is what "shift toward"
						means in practice: a bright object asked to become a dark color keeps some of its brightness,
						because the shading is being preserved. If the exact shade matters, say <em>"darker"</em> or
						<em>"more muted"</em> and let the assistant adjust the hex and call again.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>A box that stops short leaves a sliver.</strong> The first box ended a fraction
						above the cushion's lower front edge, and a thin red line stayed there.
						<em>"There's a red edge at the bottom front, box a little taller"</em> fixed it: the second
						call, with the box's height at <code>0.5</code> instead of <code>0.47</code>, had no sliver.
						Box all of the part, with a small margin, and remember that a hem, a strap or a sleeve often
						runs further than you think.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The combined call in that second attempt also erased a garden light standing on the pebbles
				behind the bench (<code>eraseBoxes: [[0.785, 0.26, 0.09, 0.15]]</code>), and both result lines
				came back together: <code>Erased 1 area(s). … Recolored 1 area(s).</code> Erase ran first,
				recolor second, in one image from the allowance.
			</p>
			<p class="mb-4">
				What to box, and what not to: recolor takes everything inside the outline it finds, so boxing a
				whole person to change their jacket also tints their face, their glasses and whatever they are
				holding. Box the jacket. For <em>"make his suit navy"</em>, box the jacket and the trousers as
				two boxes, not the person. Sheer or skin-toned fabric right against bare skin can tint the skin
				beside it; if the result shows that, say so and the assistant will tighten the box.
			</p>
			<p class="mb-4">
				And the skip. A box with no clear object in it is meant to be left unchanged and reported rather
				than painted as a rectangle, and the REST API has a header for exactly that. In this session, a
				box drawn deliberately over bare pebbles was not skipped: the model found a cluster of stones and
				recolored an oval of them green. On a textured background the skip is best-effort, which is one
				more reason the result is something you look at, not something you assume.
			</p>
		</section>

		<section id="erase-or-redact" class="scroll-mt-24">
			<SectionHeading>Erase or redact: which one you need</SectionHeading>
			<p class="mb-4">
				Both take a box. They answer different questions, and choosing the wrong one is the one mistake
				in this guide that can actually hurt someone.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>You want</th><th>Use</th><th>Why</th></tr></thead>
					<tbody>
						<tr>
							<td>The picture to look as if the thing was never there</td>
							<td><strong>Erase</strong></td>
							<td>It fills the gap with invented background; the result is cosmetic</td>
						</tr>
						<tr>
							<td>Nobody to be able to read or recover what was there</td>
							<td><strong>Redact</strong> (fill)</td>
							<td>It replaces the area with a solid block that carries no information</td>
						</tr>
						<tr>
							<td>A plate, a face, an address, a name badge, a screen, a document</td>
							<td><strong>Redact</strong></td>
							<td>Sensitive content needs a method that cannot be second-guessed</td>
						</tr>
						<tr>
							<td>A bin, a cable, a cone, a stranger in the distance, a sensor spot</td>
							<td><strong>Erase</strong></td>
							<td>Nothing about the content matters; only the look does</td>
						</tr>
						<tr>
							<td>Every face hidden, no assistant involved</td>
							<td><strong>Redact faces by prompt</strong></td>
							<td
								>Face redaction works from a plain prompt on any Magic Flow surface, including the web
								app; no count is shown, so check the picture</td
							>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				The reason is not that erase is weak. It is that an inpainted patch <em>claims</em> something
				about the scene: that there was grass there, that the wall was blank, that the pavement was
				empty. For a photo you are tidying, that claim is harmless. For a photo someone might rely on, it
				is a fabrication, and a solid black block is the version you can stand behind because it claims
				nothing. Mochify's own tool instructions put it bluntly: erase invents what was behind the object,
				so never use it to hide anything sensitive; use redaction for plates, addresses and documents.
			</p>
			<p class="mb-4">
				The two can share a call. <em>"Hide the plate and remove the bin"</em> becomes one
				<code>redactBoxes</code> box and one <code>eraseBoxes</code> box; erase runs first, redaction
				second, and the redaction is applied to the already-cleaned image. The
				<a href="https://mochify.app/guides/blur-faces-license-plate-ai-assistant">face and plate guide</a>
				covers the redaction side, including why a blur is not the same as hiding.
			</p>
		</section>

		<section id="what-happens-to-the-file" class="scroll-mt-24">
			<SectionHeading>What happens to the file</SectionHeading>
			<p class="mb-4">
				An erased or recolored image is processed like every other image Mochify handles, in memory with
				nothing kept, plus two rules that exist because these operations need them. Here is the whole
				path for the hosted MCP route.
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>The assistant sends the image and the boxes to <code>api.mochify.app</code>.</strong
						>
						The image does travel to our servers over HTTPS; this is not an on-device operation, and no
						honest guide should tell you otherwise. It is streamed into the encoder in RAM, never written
						to disk, and never appears in a log.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The inpainting and outline models run on Mochify's own servers.</strong> No
						third-party vision or image-generation service sees the photo, which is also why erase and
						recolor are not affected by the Dashboard's third-party AI setting.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Erase is applied first, then recolor, then any redaction, then any crop, resize,
							rotation or format change.</strong
						>
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>The output always has its metadata stripped and any HDR gain map removed, even if the
							request asked to keep them.</strong
						>
						EXIF usually holds a thumbnail of the picture as the camera saved it, and an Ultra HDR file
						carries a gain map that is a second, lower-resolution image of the scene; either would still
						show the object you erased. If you need HDR or metadata on a file, do that job on a copy you
						are not erasing.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The original is wiped as soon as the encode finishes.</strong> On the hosted MCP
						server, the finished file waits in a pickup store under an unguessable name for about five
						minutes so the download link works, then it is evicted whether you fetched it or not. On the
						local MCP server (<code>mochify serve</code>) and the REST API there is no pickup store: the
						bytes come straight back to your machine and nothing is held at all.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				And as with redaction, the <em>meaning</em> of the edit never reaches Mochify. The assistant
				knows it was removing a bin or recoloring a jacket. Mochify receives
				<code>0.775, 0.57, 0.07, 0.15</code> and, for recolor, a hex code. The same in-memory model is
				described on our <a href="https://mochify.app/architecture">architecture and data handling page</a>,
				and the processor obligations behind it are in the
				<a href="https://mochify.app/dpa">Data Processing Agreement</a>.
			</p>
		</section>

		<section id="rest-api" class="scroll-mt-24">
			<SectionHeading>Doing it in bulk: the REST API</SectionHeading>
			<p class="mb-4">
				If you have your own vision model, or a folder of listing photos and a script, erase and recolor
				are two query parameters on <code>POST /v1/squish</code>, in the same fraction convention as
				<code>redact</code> and <code>region</code>. Your code picks the boxes; Mochify receives numbers.
			</p>
			<CodeCard filename="erase.sh" code={eraseCode} />
			<p class="mb-4">
				Several boxes are separated with <code>;</code>. The <code>#</code> in a hex color is URL-encoded
				as <code>%23</code>. Read the response headers, not just the body; they are the detail the MCP
				result line summarizes:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0"><code>X-Mochify-Erased</code>: how many boxes were painted out.</p>
				</li>
				<li>
					<p class="mb-0">
						<code>X-Mochify-Erase-Outlined</code>: of those, how many were repainted along a found
						outline rather than as the whole box. A <code>0</code> means every box was repainted whole,
						which is your cue to look closely at the result.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<code>X-Mochify-Erase-Coverage</code>: the share of the frame that was repainted, from 0 to
						1. A pipeline can use it as a threshold: above a few percent, route the image to a human.
					</p>
				</li>
				<li>
					<p class="mb-0"><code>X-Mochify-Recolored</code>: how many boxes were recolored.</p>
				</li>
				<li>
					<p class="mb-0">
						<code>X-Mochify-Recolor-Skipped</code>: how many were skipped because no clear object was
						found inside them. Redraw those tighter and call again.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Rules the API enforces: up to 8 boxes each for <code>erase</code> and <code>recolor</code>;
				every value is a fraction from 0 to 1; the operations need a paid plan (a <code>403</code>
				otherwise), and recolor returns a <code>503</code> if the outline model is unavailable, so retry
				rather than treat it as a bad request. Each request is one image from your plan's allowance. The
				full parameter table is on the <a href="https://mochify.app/docs">API documentation page</a>.
			</p>
			<p class="mb-4">
				For a seller with fifty photos and no code, the assistant route handles the batch the same way:
				<em>"remove the bin from all of these"</em>, one call per image, one result line per image to
				read through.
			</p>
		</section>

		<section id="when-not-needed" class="scroll-mt-24">
			<SectionHeading>When you do not need any of this</SectionHeading>
			<p class="mb-4">
				You do not need erase when the object is the point, when the background is going anyway
				(background removal is the tool for that), or when a crop solves it: if the stranger is at the
				edge of the frame, <em>"crop them out"</em> is a cheaper and more honest edit than painting over
				them.
			</p>
			<p class="mb-4">
				You do not need Mochify for a single casual photo on a recent phone. Apple's Clean Up does
				object removal inside the Photos app on iPhone 16 models, iPhone 15 Pro and Pro Max, iPads with
				an A17 Pro or M1 chip and later, and Macs with M1 and later, running iOS 18.1, iPadOS 18.1 or
				macOS Sequoia 15.1 and later (<a
					href="https://support.apple.com/121429"
					target="_blank"
					rel="noopener noreferrer">Apple, Requirements to use Clean Up in Photos</a
				>); Google Photos has Magic Eraser; Photoshop has had a remove tool for years. If one of those
				is in your pocket and the photo is for you, use it. (If your iPhone is a 14 or earlier, Clean Up
				is not on it, whatever a tutorial says; the most common thread in Apple's own support community
				on this subject is someone looking for a button their phone does not have.) The route in this
				guide earns its keep when the photos are part of a job (listings, a property set, a client's
				gallery), when there are many of them, when you want the edit done from the same conversation
				that is already writing the listing, or when you need to know exactly what happened to the file
				afterwards.
			</p>
			<p class="mb-4">
				And it does not cover video. Mochify's video tools run in your browser and do not include erase
				or recolor; removing an object from a video is a different job and this guide does not claim to
				do it.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: erase and recolor from your assistant</SectionHeading>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>Connect an MCP server once.</h3>
						<p>
							Add <code>https://mcp.mochify.app</code> as a remote MCP server in your client and sign in
							when the browser window opens; the <a href="https://mochify.app/mcp#setup">MCP server page</a>
							has the config for the hosted and the local server (<code>mochify auth login</code> once,
							then a short config entry). The hosted server returns a short-lived download link rather
							than image bytes; the local server returns a file path. Erase and recolor need a paid plan,
							including the Day Pass; because both servers need that sign-in, a Day Pass used from your
							assistant is one bought on a free account you are signed in with.
						</p>
					</li>
					<li>
						<h3>Attach the photo, or paste a public URL to it.</h3>
						<p>
							For an attached photo, expect the assistant to hand you a one-time upload link and ask you
							to drop the same file on it; that is how it forwards your original without ever holding the
							bytes itself.
						</p>
					</li>
					<li>
						<h3>Name the thing, and say what kind of thing it is.</h3>
						<p>
							<em>"Remove the bin on the left, including its shadow"</em>,
							<em>"take out the two people in the distance"</em>,
							<em>"make the jacket forest green, just the jacket"</em>. Naming the shadow and the exact
							part is what gets the box right first time.
						</p>
					</li>
					<li>
						<h3>Read the result line, then look at the spot.</h3>
						<p>
							<code>Erased N area(s)</code> and <code>Recolored N area(s)</code> tell you what was attempted;
							only the picture tells you whether it worked.
						</p>
					</li>
					<li>
						<h3>Fix a miss with a sentence.</h3>
						<p>
							<em>"The top is still showing, make the box bigger"</em>,
							<em>"there's a red edge at the bottom, box it taller"</em>, <em>"too bright, go darker"</em>.
							Each new call is one more image from the allowance.
						</p>
					</li>
					<li>
						<h3>Save the file from the link within five minutes.</h3>
						<p>
							The link expires, the pickup copy is evicted, and nothing else is kept. The saved file has
							no metadata and no HDR gain map, by design.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				Privacy note for this workflow: the photo travels to <code>api.mochify.app</code> for the edit and
				the encode, is processed in RAM and wiped immediately, and the finished file sits in the hosted MCP
				pickup store for about five minutes; the assistant only ever receives the download URL. The
				inpainting and outline models run on Mochify's own servers with no third-party service. What the
				box contained is known to your assistant and to you, never to Mochify.
			</p>
			<p class="mb-4">
				Want to see the other things the same connection can do? The
				<a href="https://mochify.app/mcp">MCP server page</a> lists every capability with the prompt that
				triggers it, and plain compression and conversion work in the browser at
				<a href="https://mochify.app">mochify.app</a> with the same in-memory handling.
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
							<td>A small object gone</td>
							<td>"Remove the cone on the curb and fill in the background"</td>
							<td
								><code>eraseBoxes: [[x, y, w, h]]</code> (fractions 0-1, top-left origin, margin and shadow
								included)</td
							>
							<td><code>Erased 1 area(s)</code>, then look at the spot</td>
						</tr>
						<tr>
							<td>Several objects gone</td>
							<td>"Remove the bin, the cable and the person at the back"</td>
							<td>Up to 8 boxes in one <code>eraseBoxes</code> list</td>
							<td>The count matches, and no shadows left behind</td>
						</tr>
						<tr>
							<td>Something grew back</td>
							<td>"The top is still showing, make the box bigger"</td>
							<td>A larger box, one more call</td>
							<td>Clean on the second look</td>
						</tr>
						<tr>
							<td>A large object gone</td>
							<td>Expect it softer; prefer "crop it out"</td>
							<td><code>region</code> instead of <code>eraseBoxes</code></td>
							<td>A crop never invents anything</td>
						</tr>
						<tr>
							<td>An object a different color</td>
							<td>"Make the cushion navy and keep the shading"</td>
							<td><code>{'recolorBoxes: [{ box: [x, y, w, h], color: "#rrggbb" }]'}</code></td>
							<td><code>Recolored 1 area(s)</code>; the color lands near the target, not on it</td>
						</tr>
						<tr>
							<td>Only part of it recolored</td>
							<td>"There's a red edge at the bottom, box it taller"</td>
							<td>A box that covers all of the part</td>
							<td>No sliver</td>
						</tr>
						<tr>
							<td>Something hidden, not tidied</td>
							<td>"Hide the plate"</td>
							<td><code>redactBoxes</code>, not <code>eraseBoxes</code></td>
							<td>A solid block; see the redaction guide</td>
						</tr>
						<tr>
							<td>Erase and recolor together</td>
							<td>"Remove the light behind it and make the bench navy"</td>
							<td>Both lists in one call; erase runs first</td>
							<td>Both result lines</td>
						</tr>
						<tr>
							<td>Keep metadata or HDR</td>
							<td>Not possible on an erased or recolored file</td>
							<td>Stripped and removed, always</td>
							<td>Do it on an untouched copy</td>
						</tr>
						<tr>
							<td>Bulk or your own vision model</td>
							<td>REST API</td>
							<td><code>erase=x,y,w,h;…&amp;recolor=x,y,w,h:%23rrggbb</code></td>
							<td
								><code>X-Mochify-Erased</code>, <code>-Erase-Outlined</code>, <code>-Erase-Coverage</code>,
								<code>X-Mochify-Recolored</code>, <code>-Recolor-Skipped</code></td
							>
						</tr>
						<tr>
							<td>Plans and limits</td>
							<td>n/a</td>
							<td>Paid plans incl. the Day Pass; 8 boxes per operation; values 0-1</td>
							<td>One image of allowance per call</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/mcp#setup" label="Connect the MCP server">
			Ready to tidy the photo you were about to list? Connect the Mochify MCP server to your assistant
			and say it in plain words: <em>"remove the bin behind the bike and fill in the background"</em>.
			The edit lands on your original file, inside the box and nowhere else, with the metadata stripped
			and nothing kept.
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
