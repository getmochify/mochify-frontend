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

	// Built from content-ops `article-originals/vinted-background-removal-rules.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off.
	const metadata = {
		title:
			'Vinted Photo Backgrounds: What the Rules Allow, What Gets Listings Hidden, and a Workflow That Passes',
		seoTitle: 'Vinted Background Rules - What Is Allowed, What Gets Hidden',
		description:
			'Vinted says background removal is allowed if the photo stays accurate and a real photo is there. The rules, what gets listings hidden, and the workflow.',
		category: 'Workflows',
		readTime: '25 min read',
		date: 'October 29, 2026',
		bylineNote:
			"Written from Vinted's published rules and its October 2026 statement, the other marketplaces' own help pages, and a 25-photo batch run on October 28, 2026."
	};

	const keywords =
		'vinted background, vinted background rules, vinted photo rules, background removal vinted, can you use stock photos on vinted, white background for vinted, best background for vinted photos, marketplace photo rules';

	const pageUrl = 'https://mochify.app/guides/vinted-background-removal-rules';

	const toc = [
		{ id: 'short-answer', label: 'The short answer' },
		{ id: 'vinted-rules', label: "What Vinted's rules actually say" },
		{ id: 'why-hidden', label: 'Why photos get hidden, and what sellers do about it' },
		{
			id: 'stock-photos',
			label: "Can you use stock photos on Vinted? (And AI images, and someone else's?)"
		},
		{ id: 'best-background', label: 'The best background for Vinted photos' },
		{ id: 'other-marketplaces', label: 'Other marketplaces: who wants white, who wants real' },
		{ id: 'mochify-workflow', label: 'Mochify workflow: one shoot, two sets of files' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const faqItems = [
		{
			q: 'Is background removal allowed on Vinted?',
			a: `Yes, with conditions Vinted set out in October 2026: "the use of AI as a visual enhancement tool (e.g. background removal) is not prohibited in itself, the photo must remain an accurate representation of the item", and members "are required to upload real photos of their items". So keep a real, unedited photo of the whole item as your first photo, use the cut-out as an additional one, and never let an edit change the item's color, condition or shape.`
		},
		{
			q: 'Can you use white backgrounds on Vinted?',
			a: `Yes, whether it is a real white sheet or wall or a white cut-out. Vinted asks for a "clear neutral background, no distractions" and does not name a color. What sellers report being refused is a photo that reads as a catalog shot rather than a real photo, so put a real photo first and use white behind it. Mid-gray is the better choice for color accuracy anyway.`
		},
		{
			q: 'Why did Vinted hide my listing or refuse my photo?',
			a: `Listings are hidden when the photos are "not good quality" or break the Catalog Rules, and Vinted's checks are automated: usually under a minute, sometimes three or four days. If the photo was an edited cut-out, replace it with the unedited original of the real item within 24 hours and the listing comes back without an appeal. Removed listings (stock photos, for example) can be appealed once, within six months, via the link in the moderation message.`
		},
		{
			q: 'Can you use stock photos on Vinted?',
			a: `No. Both the Catalog Rules and the help pages ban stock photos, photos from adverts, watermarked images and pictures found online, including the brand's own photo of the same item. Listings using them are removed and repeat breaches lead to a ban. A wholly AI-generated image is not a photo of your item either, and Vinted says using AI to misrepresent an item leads to removal or suspension.`
		},
		{
			q: 'Are you allowed to use AI images on Vinted?',
			a: `AI as an enhancement tool, yes; AI that changes the item, no. Vinted's statement names background removal as an allowed enhancement and misrepresenting condition as the breach it acts on. An AI-generated model wearing your garment, or a version of the garment with creases, marks or color corrected, is the kind of image sellers report getting listings pulled for.`
		},
		{
			q: 'What is the best background for Vinted photos?',
			a: `A plain, real, neutral surface in daylight: a wall or door for hanging items, a sheet or a wooden or concrete floor for flat lays. Many high-volume sellers use mid-gray because white and black backgrounds pull the garment's color off; white is fine but washes out pale items. Whatever you pick, use the same one for every listing so your profile reads as one shop.`
		},
		{
			q: 'Does eBay require a white background?',
			a: `No, but it recommends one: eBay's help says white backgrounds "are generally best", suggests darker ones for reflective items, and its listing tool has a Background button that replaces the background with solid white. Amazon's public guidance goes further, with white (RGB 255, 255, 255) "in most cases" and as its default. Those are the marketplaces where the white cut-out goes first.`
		},
		{
			q: 'Should I upload a transparent PNG or a white JPEG to a marketplace?',
			a: `A white JPEG. Etsy documents that transparent areas of a PNG "will appear black", and no other major marketplace documents how it renders transparency, so a flattened JPEG is the only version that looks the same everywhere. Ask Magic Flow to "remove the background and make it white, convert to JPEG" and the flattening is done for you; keep transparent PNG, WebP or AVIF output for your own website.`
		}
	];

	const related = [
		{
			title: 'Vinted Photo Size, Aspect Ratio and Rules',
			href: '/guides/vinted-photos-that-sell',
			desc: 'what the feed actually shows, the 3:4 portrait frame, and the craft list.'
		},
		{
			title: 'Cross-Listing for Resellers: One Set of Photos, Every Marketplace',
			href: '/guides/cross-listing-marketplace-photo-requirements',
			desc: 'sizes, formats and the two-set idea applied to every platform.'
		},
		{
			title: 'Product Image Requirements for Every Major Marketplace',
			href: '/guides/product-image-requirements-marketplace-guide',
			desc: 'the pixel figures, platform by platform.'
		},
		{
			title: 'EXIF Data Risks in Image Compression',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: 'what your phone writes into a photo, and why a bedroom shot carries your address.'
		},
		{
			title: 'How to Remove Objects From a Photo With an AI Assistant',
			href: '/guides/remove-objects-from-photo-ai-assistant',
			desc: 'erase and recolor, with the "never the flaw" rule for listing photos.'
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
		datePublished="2026-10-29"
		article={{
			about: [
				'Vinted',
				'background removal',
				'marketplace listing photos',
				'eBay',
				'Etsy',
				'Depop',
				'Magic Flow'
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
			<AccentTitle title={metadata.title} accent="Vinted Photo Backgrounds" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			If you searched for a Vinted background remover, you have probably also read that "Vinted
			bots" ban sellers for using one. Both halves of that are half right, and Vinted has now
			settled it in its own words. Its Catalog Rules say listing photos "have to represent the item
			as it is - no image editing is allowed." Asked about AI in October 2026, a Vinted spokesperson
			said that "the use of AI as a visual enhancement tool (e.g. background removal) is not
			prohibited in itself, the photo must remain an accurate representation of the item", and that
			"Vinted members are required to upload real photos of their items."
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			Put together, that is a rule you can follow: real photos of the item, enhancement that leaves
			the item exactly as it is, nothing that misrepresents it. This guide quotes what Vinted
			publishes, reads it against what sellers report getting hidden, tables what eBay, Amazon,
			Etsy, Depop, Poshmark, Mercari and Mercado Libre say about backgrounds, and lays out a
			workflow for anyone photographing a wardrobe clear-out or a weekly stock drop: one shoot, two
			sets of files, each one legal where it lands. We ran the batch ourselves on 25 phone photos on
			October 28, 2026, and the timings are below.
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
			<SectionHeading>The short answer</SectionHeading>
			<p class="mb-4">
				Background removal is allowed on Vinted, with two conditions Vinted itself sets: the listing
				must carry real photos of the item, and an edited photo must still show the item exactly as
				it is. The practical shape of that is simple. Make the first photo a real one, taken against
				a plain neutral surface in daylight, with the whole item in frame and nothing edited. Use a
				white cut-out as an additional photo if it helps, never as a substitute for the real one,
				and never let any edit touch the garment: no color correction that flatters it, no smoothing
				of creases, no mark removed, no AI-generated model wearing it. Those are the edits that turn
				"enhancement" into "misrepresentation", which is the line Vinted says it acts on.
			</p>
			<p class="mb-4">
				The same cut-out is the right first photo on eBay and Amazon, which both want white, and a
				legal extra photo on Etsy, which requires one unedited real-background photo and allows
				editing on the rest. Depop built background removal into its own app. So the workflow for a
				cross-lister is one shoot and two sets of output files, and the rest of this guide is the
				evidence for where each set goes.
			</p>
		</section>

		<section id="vinted-rules" class="scroll-mt-24">
			<SectionHeading>What Vinted's rules actually say</SectionHeading>
			<p class="mb-4">
				Vinted publishes six picture requirements, no numeric spec, and, since October 2026, a
				public statement on AI tools. We read the Catalog Rules and the four relevant help pages on
				October 27 and 28, 2026; the quotes below are verbatim, and the rules are identical for
				ordinary members and Vinted Pro sellers.
			</p>
			<p class="mb-4">
				From the <a
					href="https://www.vinted.co.uk/catalog-rules"
					target="_blank"
					rel="noopener noreferrer">Catalog Rules</a
				>, under "The pictures used in your listing shall meet the following requirements":
			</p>
			<ul class="my-4 list-disc space-y-2 pl-6">
				<li>
					"They have to represent the item as it is - no image editing is allowed. We also recommend
					showing any defects, scratches, wear, etc."
				</li>
				<li>"They must be sharp and clear."</li>
				<li>"They have to be taken by you with the purpose of using the photos on Vinted."</li>
				<li>
					"They cannot be replaced with stock photos, photos from ads and watermarked images."
				</li>
				<li>
					"The first photo should clearly represent the whole item. You're free to choose how you
					want to showcase your item in your additional photos. Note: You can upload up to 20 photos
					per listing."
				</li>
			</ul>
			<p class="mb-4">
				From the help page <a
					href="https://www.vinted.co.uk/help/48-what-photos-you-should-upload"
					target="_blank"
					rel="noopener noreferrer">What photos you should upload</a
				>: "Don't use stock or watermarked images, and other pictures you find online. They're
				copyrighted and may not show the current condition of your item."; "don't use flash or
				filters"; "Show the item's defects (if any) in the pics."; and, on privacy, "You may
				consider blurring or cropping any identifiable features if you like. Displaying items on a
				hanger, mannequin, or using a flat lay can also be a great alternative to modeling them
				yourself."
				<a
					href="https://www.vinted.co.uk/help/377-tips-for-great-photos"
					target="_blank"
					rel="noopener noreferrer">Tips for great photos</a
				> adds "Use a clear neutral background, no distractions." and "Take pictures in daylight, without
				flash or filters."
			</p>
			<p class="mb-4">
				Then the statement. In October 2026, answering press questions about AI-generated listings,
				a Vinted spokesperson told the Newsquest newspaper group: "Vinted members are required to
				upload real photos of their items. While the use of AI as a visual enhancement tool (e.g.
				background removal) is not prohibited in itself, the photo must remain an accurate
				representation of the item and comply with our Terms and Conditions and Catalog Rules. Using
				AI to mislead, such as misrepresenting an item's condition in listings or during disputes,
				is not allowed, and we take appropriate action - including the removal of listings or the
				suspension of accounts - when we become aware of it." Vinted gave the Dutch broadcaster NOS
				the same position in August 2026: AI as a tool is not banned, "on condition that the photo
				remains an accurate representation of the item".
			</p>
			<p class="mb-4">
				So "no image editing" in the rules means, in Vinted's own reading, no editing that changes
				what the item looks like. Background removal is named as the example of what is allowed. A
				real photo is required. Misrepresenting condition is what gets listings removed and accounts
				suspended.
			</p>
			<p class="mb-4">
				What happens when a photo falls foul is also written down, on <a
					href="https://www.vinted.co.uk/help/62-listing-was-hidden-or-removed"
					target="_blank"
					rel="noopener noreferrer">Listing was hidden or removed</a
				>. A listing is <strong>hidden</strong> when "The listing photos are not good quality" or
				when it breaks the Catalog Rules; you fix it and it comes back, no appeal needed, and for a
				reported listing the Catalog Rules give you 24 hours to make the changes before it stays
				hidden. A listing is <strong>removed</strong> when "The pictures are taken from another website,
				including stock photos"; a removal can be appealed once, within six months, through the link in
				the moderation message. And Vinted says it will ban an account "temporarily or permanently" for
				repeated breaches of those rules. Bumps and Showcase fees on hidden or removed listings are not
				refunded.
			</p>
			<p class="mb-4">
				The check is automated and Vinted says so: a new listing "may undergo an automated check to
				ensure it complies with our selling guidelines. Usually, it takes up to 1 minute, but may
				also take up to 3 or 4 days in some cases" (<a
					href="https://www.vinted.co.uk/help/375"
					target="_blank"
					rel="noopener noreferrer">Uploading step by step</a
				>). What the check looks for is not published, and we do not pretend to know.
			</p>
		</section>

		<section id="why-hidden" class="scroll-mt-24">
			<SectionHeading>Why photos get hidden, and what sellers do about it</SectionHeading>
			<p class="mb-4">
				Sellers report three different things under one complaint. Plain or white photos refused by
				the automated check; cut-outs that look like catalog shots getting listings hidden; and
				AI-generated model photos getting items pulled and accounts restricted. The rules above sort
				them: the first is the check being over-cautious about photos that look commercial, the
				second is the stock-photo rule doing its job on a photo that no longer looks real, and the
				third is the misrepresentation rule, applied exactly as Vinted says it applies it.
			</p>
			<p class="mb-4">
				The threads are consistent on the symptom and divided on the cause. The top reply Google
				shows from an r/vintedUK thread titled "Background removal" is blunt: "Don't do it - Vinted
				bots are starting to ban accounts doing it as they look too much like stock photos from the
				internet!" On a French seller forum, one member wrote in August 2024 that "Vinted has
				recently rejected several of my photos because the background was plain"; another replied
				that she had the same thing "with every photo, we just added a flower pot in the background
				and it was fine"; a third, five months later, said he photographs on white and has no
				issues, and offered his own reading of the checks: "if there's one thing that works with
				them, it's spotting commercial photos." On the AI side, the seller posts Google surfaces
				from Facebook reseller groups say it plainly: "I've been using AI to model the clothing item
				and I've have multiple items pulled" and "I've tried using AI photos, but Vinted restricted
				my account twice". Buyers in the same groups are the reason: "I just want to see what the
				clothes look like. I'll never buy from a seller..."
			</p>
			<p class="mb-4">Four things to take from that:</p>
			<ol class="my-4 list-decimal space-y-3 pl-6">
				<li>
					<strong
						>White is not banned, plain is not banned, and background removal is not banned.</strong
					>
					Vinted's own tip is a "clear neutral background" and its spokesperson named background removal
					as an allowed enhancement. The problem photo is the one that no longer looks like your photo
					of your item, or that shows the item better than it is.
				</li>
				<li>
					<strong>A real first photo is your insurance.</strong> Vinted requires real photos, and the
					automated check and human buyers both read the first photo. A cut-out as photo two or three,
					behind a real photo of the whole item, passes the "real photos" requirement and the sniff test
					at once.
				</li>
				<li>
					<strong
						>The fix sellers find when a listing is hidden is to make the photo look like a photo
						again.</strong
					>
					A prop, a visible fold in the sheet, a shadow, the real floor. Swap the cut-out for the original
					and the listing comes back within the 24 hours.
				</li>
				<li>
					<strong>AI models are the edit that gets accounts restricted.</strong> A generated person wearing
					a generated rendering of your garment is not a real photo of your item, and the posts about
					pulled listings are about exactly that. Vinted's statement draws the line at "accurate representation",
					and a garment the model invented is not one.
				</li>
			</ol>
			<p class="mb-4">
				If you have already listed with white cut-outs as first photos and nothing has been hidden,
				nothing in the rules obliges you to pull them. But the next batch is the moment to put a
				real photo first, and the workflow below means you lose nothing: the cut-outs go second on
				Vinted and first on eBay.
			</p>
		</section>

		<section id="stock-photos" class="scroll-mt-24">
			<SectionHeading
				>Can you use stock photos on Vinted? (And AI images, and someone else's?)</SectionHeading
			>
			<p class="mb-4">
				No. Vinted bans stock photos, photos from adverts, watermarked images and "other pictures
				you find online" in both its Catalog Rules and its help pages, removes listings that use
				them, and bans accounts that keep doing it. The photo has to be yours, of the actual item,
				taken for Vinted.
			</p>
			<p class="mb-4">That answers the three ways the question gets asked:</p>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>The brand's own product photo of the same item.</strong> Not allowed, even as the last
					photo in the listing. It is a stock photo, it is copyrighted, and it "may not show the current
					condition of your item".
				</li>
				<li>
					<strong
						>An AI-generated image, or an AI-generated background or model behind or on your real
						item.</strong
					>
					Vinted's statement draws the line precisely: AI "as a visual enhancement tool" is fine if the
					photo "must remain an accurate representation of the item"; using AI "to mislead, such as misrepresenting
					an item's condition" is not, and leads to removal or suspension. A cut-out on white keeps the
					item as it was. A generated model wearing it, a de-wrinkled version of it, or a brightened version
					of its color does not, and a wholly generated image is not a photo of your item at all.
				</li>
				<li>
					<strong>Your own photo from another marketplace.</strong> The rule as written says the photos
					must be taken "with the purpose of using the photos on Vinted". In practice the test anyone
					can apply is whether it is your photo of this item as it is now. The white cut-out you made
					for eBay passes that test as an additional photo; the unedited original it came from is the
					one to put first.
				</li>
			</ul>
			<p class="mb-4">
				The one edit Vinted invites is for privacy: blur or crop your face, and anything that
				identifies you or your home. That is not a loophole. It is the platform telling you which
				changes do not count as changing the item.
			</p>
		</section>

		<section id="best-background" class="scroll-mt-24">
			<SectionHeading>The best background for Vinted photos</SectionHeading>
			<p class="mb-4">
				A real, plain, neutral surface in daylight: a wall, a door, a sheet, a wooden or concrete
				floor for flat lays. It satisfies Vinted's tip ("clear neutral background, no
				distractions"), it is the real photo Vinted requires, and it costs nothing. The only
				decision left is the color.
			</p>
			<p class="mb-4">
				Pick a mid-gray if you can. A reseller profiled by The Irish Sun in June 2025, who had made
				over GBP 18,000 on Vinted, hangs everything on a gray wall and put the reason better than
				most photography guides: white and black absorb the colors around them, so a neutral gray
				"is apparently the best for photography" if you want the garment's color to read true.
				Google's own AI Overview for "best background for vinted photos" now repeats the gray point,
				which tells you how far it has spread among sellers. White works too, and plenty of sellers
				use a white sheet without trouble; it just washes out pale clothing and tempts you to edit
				the creases out, which is where the trouble starts.
			</p>
			<p class="mb-4">
				Three habits that keep every photo on the right side of the rule and sell better anyway:
			</p>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>First photo: the whole item, real, nothing else.</strong> Vinted's rule and the
					feed's thumbnail agree. The feed shows portrait thumbnails; our
					<a href="https://mochify.app/guides/vinted-photos-that-sell"
						>Vinted photo size and aspect ratio guide</a
					> has the measurements, and the short version is 3:4 portrait with the item filling the frame.
				</li>
				<li>
					<strong>One unedited angle plus the label.</strong> Even on marketplaces that allow editing,
					Etsy's rule (below) requires at least one unedited photo against a real background. Adopt it
					everywhere: it is the photo that proves the item exists as described.
				</li>
				<li>
					<strong>Show the flaw, do not fix it.</strong> Vinted says "If the item is significantly not
					as described, the buyer might return it for a refund." A visible mark in photo four costs you
					a pound on the price; a hidden one costs you the sale, the postage and, under Vinted's statement,
					possibly the account.
				</li>
			</ul>
			<p class="mb-4">
				When you do not need any of this: a plain-background photo of a plain item, shot in
				daylight, is already the best Vinted photo you can take. Crop it and go.
			</p>
		</section>

		<section id="other-marketplaces" class="scroll-mt-24">
			<SectionHeading>Other marketplaces: who wants white, who wants real</SectionHeading>
			<p class="mb-4">
				Vinted is the only major marketplace we found that writes "no image editing" into its rules,
				and it has now explained that sentence as "no misrepresentation". Two of its competitors
				ship background removal inside their own listing apps, one requires white for most main
				images, one requires a single unedited photo and permits background changes on the rest, and
				one has walked white back. The table is from each platform's own published page, read on
				October 28, 2026.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Marketplace</th>
							<th>What it says about backgrounds</th>
							<th>Editing, stock and AI</th>
							<th>Numbers it publishes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Vinted</strong></td>
							<td>"Use a clear neutral background, no distractions."</td>
							<td
								>Rules: "no image editing is allowed"; no stock, ad or watermarked images.
								Statement, Oct 2026: AI enhancement "(e.g. background removal) is not prohibited in
								itself", photo "must remain an accurate representation"; real photos required;
								misleading edits lead to removal or suspension</td
							>
							<td>20 photos per listing. No size, ratio, format or file-size rule</td>
						</tr>
						<tr>
							<td><strong>eBay</strong></td>
							<td
								>"White backgrounds are generally best, but for shiny or reflective items like a
								piece of jewelry, a darker background may work better." Its listing tool has a
								Background button that replaces the background "with a solid white color", plus
								AI-generated backgrounds in the app</td
							>
							<td
								>Crop, rotate, brightness and contrast in the app; "You can't use a catalog or stock
								photo if you're listing an item as used."; no badges, logos or watermarks</td
							>
							<td
								>Up to 24 photos; 500 px minimum, about 1600 px recommended; 12MB each; 1:1 or 16:9
								"look best"; JPEG, PNG, GIF, TIFF, BMP, WebP, HEIC, AVIF</td
							>
						</tr>
						<tr>
							<td><strong>Amazon</strong></td>
							<td
								>"In most cases, product shots should be taken against a white background (RGB color
								values: 255, 255, 255). This is an industry standard and also a default setting with
								Amazon." (public seller guidance; the full requirements page needs a seller login)</td
							>
							<td>Keep white versions, then add ambient shots</td>
							<td
								>Product fills 85% or more of the frame; 500 to 10,000 px on the longest side;
								larger than 1,000 px preferred for zoom; JPEG, TIFF, PNG, GIF</td
							>
						</tr>
						<tr>
							<td><strong>Etsy</strong></td>
							<td
								>No color rule. "Your listing must include at least one unedited photo of the actual
								item against a real background"</td
							>
							<td
								>Other photos may be edited, "including AI, to adjust lighting or color, crop or
								resize images, or change backgrounds", never to hide flaws; AI edits must be noted
								in the description</td
							>
							<td
								>2000 px recommended, 635 px first-photo floor, files over 1MB may fail; .jpg .gif
								.png .svg .heic; <strong>transparent PNGs render black</strong></td
							>
						</tr>
						<tr>
							<td><strong>Depop</strong></td>
							<td
								>Blog tip: pure-white paper or board, or a bold color used consistently. In-app
								background removal, drop shadows and resizing since June 2025</td
							>
							<td>Original photos only; "your listing will be removed if you use stock images"</td>
							<td>None published</td>
						</tr>
						<tr>
							<td><strong>Poshmark</strong></td>
							<td
								>"Keep backgrounds clean and uncluttered"; the older guide suggests "a white or
								simple background"</td
							>
							<td>In-app filters and crop</td>
							<td>Listing and cover photos display in 3:4 portrait since March 2026</td>
						</tr>
						<tr>
							<td><strong>Mercari (US)</strong></td>
							<td>"Plain backgrounds are the best so there aren't any distractions."</td>
							<td>Photograph and call out flaws</td>
							<td>Up to 12 photos (20 on Mercari Japan)</td>
						</tr>
						<tr>
							<td><strong>Mercado Libre</strong></td>
							<td
								>"Avoid white backgrounds. They are still allowed, but no longer mandatory in most
								categories"; still mandatory in Technology, Beauty, Health and Supermarket</td
							>
							<td>No watermarks, logos or text</td>
							<td>1200 x 1200 recommended, square, product filling 95%</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4 text-sm leading-relaxed text-[#875F42]">
				Sources: <a
					href="https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148"
					target="_blank"
					rel="noopener noreferrer">eBay, Adding pictures to your listings</a
				>;
				<a
					href="https://help.etsy.com/hc/articles/115015663347"
					target="_blank"
					rel="noopener noreferrer">Etsy, Requirements and Best Practices for Images</a
				>;
				<a
					href="https://news.depop.com/depop-partners-with-photoroom-to-bring-ai-powered-photo-editing-to-millions/"
					target="_blank"
					rel="noopener noreferrer">Depop, Photoroom partnership announcement</a
				>;
				<a
					href="https://blog.poshmark.com/2026/03/25/your-guide-to-portrait-photos/"
					target="_blank"
					rel="noopener noreferrer">Poshmark, A New Look for Listing Photos</a
				>; Amazon's public
				<a
					href="https://sell.amazon.com/blog/product-photos"
					target="_blank"
					rel="noopener noreferrer">product photo guidance</a
				>; Mercari and Mercado Libre help pages as quoted; Vinted's statement as reported by
				Newsquest titles, October 2026.
			</p>
			<p class="mb-4">
				Two things in that table matter more than the rest.
				<strong
					>The same cut-out is a first photo on eBay and Amazon and a second photo on Vinted and
					Etsy</strong
				>, so a cross-lister needs two files per angle, not one, and a rule for which goes first.
				And
				<strong>Etsy's black transparency</strong> is the only documented answer to "can I upload a
				transparent PNG?", which is why the workflow below always flattens to a white JPEG rather
				than trusting an app to render transparency. Our
				<a href="https://mochify.app/guides/cross-listing-marketplace-photo-requirements"
					>cross-listing guide</a
				>
				covers the size and format side of the same problem; the
				<a href="https://mochify.app/guides/product-image-requirements-marketplace-guide"
					>marketplace image requirements pillar</a
				> has every platform's pixel figures. If you list on more than one of them, the next section is
				the workflow; if you only list on Vinted, it is shorter than you think.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify workflow: one shoot, two sets of files</SectionHeading>
			<p class="mb-6">
				Shoot every item once, against a real neutral background, in daylight, in portrait where you
				can, with the whole item in the first frame, the label and any flaw in the others. Then run
				the photos through <a href="https://mochify.app/flow">Magic Flow</a> twice with two different
				prompts: a real-photo set that touches nothing about the item, and a white-background set. We
				timed the second prompt on 25 iPhone photos (111 MB) on October 28, 2026: 47.6 seconds from pressing
				send to the last result, every file a 3:4 JPEG on white with its metadata gone, 78% smaller than
				the originals.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>Set 1: the real photos</h3>
						<p>
							These are your Vinted first photo, your Etsy unedited photo, and your proof of
							condition everywhere. Drop the photos on <code>/flow</code> and type what you want in plain
							English:
						</p>
						<p><em>crop to 3:4 portrait, convert to JPEG, strip all metadata</em></p>
						<p>
							Three notes on that prompt. The crop keeps the item: on a landscape 4:3 phone shot it
							keeps the full height, trims about 44% of the width and centers on the garment (we
							checked three landscape frames; a wide item near an edge may need a portrait reshoot).
							"Strip all metadata" removes the GPS position your phone wrote into the file, which
							for a photo taken in your bedroom is your home address; our
							<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
								>EXIF data guide</a
							>
							explains what else is in there. And if your face or a family photo on the wall is in shot,
							ask for "blur every face" as well (in the same prompt, or as a second pass on the files
							that need it): it works on every Magic Flow surface, it is best-effort, and no count is
							shown, so look at the picture before you list. Nothing in Set 1 edits the item, which is
							the point: it is the photo Vinted means by "real".
						</p>
						<p>
							Shooting on an iPhone? Your photos are HEIC files, and Vinted publishes no format
							list. JPEG is on every marketplace's published list (Amazon's public guidance names
							JPEG, TIFF, PNG and GIF and not HEIC), and the prompt above converts it. The
							<a href="https://mochify.app/heic-to-jpeg">HEIC to JPG converter</a> does the conversion
							alone if that is all you need.
						</p>
					</li>
					<li>
						<h3>Set 2: the white-background files</h3>
						<p>
							First photo on eBay and Amazon; an additional photo on Vinted and Etsy. Same
							originals, second prompt:
						</p>
						<p>
							<em
								>remove the background and make it white, crop to 3:4 portrait, convert to JPEG,
								strip metadata</em
							>
						</p>
						<p>
							Magic Flow reads that as one job per image. The card it showed us said: "Removing the
							backgrounds and cropping your images to a 3:4 portrait frame, then saving them as
							JPEGs on a white backdrop with metadata stripped." The cut-out changes nothing about
							the garment, which is what keeps it inside Vinted's "accurate representation" line;
							what you must not add is anything that does (no "brighten", "sharpen", "smooth" or
							"fix" the item in the same prompt for a listing photo). Ask for JPEG, not PNG: a JPEG
							has no transparency to mis-render, which is the Etsy problem solved before it starts.
							(PNG, WebP and AVIF output keep the cut-out transparent, which is what you want for a
							web shop or a banner, not for a listing upload; the
							<a href="https://mochify.app/solutions/remove-background-webp"
								>WebP background remover</a
							>
							exists for that job.) For eBay, change "3:4 portrait" to "square" or use the
							<a href="https://mochify.app/solutions/ebay-image-converter">eBay image resizer</a>,
							which outputs the 1600 px JPEG eBay recommends by default; the
							<a href="https://mochify.app/ebay-seller">eBay seller page</a> has the full eBay rule set.
							For Etsy, note any AI edit in your description.
						</p>
					</li>
					<li>
						<h3>Keep both, and keep the order</h3>
						<p>
							Vinted: Set 1 first, Set 2 after it. Etsy: at least one Set 1 photo in the listing,
							the rest as you like. eBay and Amazon: Set 2 first, Set 1 as the condition photos. If
							you only ever list on Vinted and never want a white photo, you only ever need Set 1.
						</p>
					</li>
					<li>
						<h3>Volume, and what it costs</h3>
						<p>
							Background removal is on every plan, including Free. A free account processes 25
							images a month, three at a time, up to 20MB each; without an account, 3 images a
							month. Seller (300 images a month), Pro (1,200) and Growth (5,000) take 25 at a time
							at up to 75MB, and can save results straight to Google Drive. For a one-off clear-out,
							the Day Pass is $2 (GBP 2 in the UK) for 100 uploads in 24 hours, 25 at a time, with
							no signup; on a free account it replaces your monthly allowance for those 24 hours
							rather than adding to it.
						</p>
					</li>
					<li>
						<h3>If you list hundreds a week, skip the browser</h3>
						<p>
							The same operations run from the command line (<code
								>mochify photo.jpg --remove-bg</code
							>, or
							<code>mochify photo.jpg -p "remove the background and make it white"</code> for the
							prompt route; <code>mochify auth login</code> signs you in), from the REST API (<code
								>POST https://api.mochify.app/v1/squish</code
							>
							with <code>removeBackground=true</code>
							and an <code>Authorization: Bearer &lt;key&gt;</code> header), and from an AI
							assistant through the hosted MCP server at <code>mcp.mochify.app</code>, where you
							describe the batch in plain language and the assistant runs it. One caution for
							assistant users: erase, the object-removal tool on the API and MCP, is for tidying a
							stray sock out of your own flat-lay photo for eBay, never for a mark on the item
							itself on any marketplace; our
							<a href="https://mochify.app/guides/remove-objects-from-photo-ai-assistant"
								>object removal guide</a
							> draws that line in detail.
						</p>
					</li>
					<li>
						<h3>Then look at every file before you list</h3>
						<p>
							A batch tool can return one picture untouched (ours did, once, during testing, before
							a fix on October 28) and a listing goes live with whatever you upload. Thirty seconds
							in the downloaded files beats a hidden listing.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Where your photos go.</strong> Images are streamed into memory at
				<code>api.mochify.app</code>, encoded, and wiped immediately: no disk write, no log
				containing the file, no training on your pictures. That holds for the web app, the CLI, the
				API and both MCP servers; the hosted MCP additionally holds the compressed result behind a
				short-lived URL for up to five minutes so the assistant can collect it. Your listing photos
				are not stored anywhere on our side, which for pictures taken in your home is worth more
				than it sounds.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Question</th><th>Answer</th></tr></thead>
					<tbody>
						<tr>
							<td>Is background removal allowed on Vinted?</td>
							<td
								>Yes, by Vinted's own statement (Oct 2026): AI enhancement "e.g. background removal"
								is "not prohibited in itself" as long as the photo "must remain an accurate
								representation of the item" and the listing has real photos. Put a real photo first</td
							>
						</tr>
						<tr>
							<td>What edits are fine on Vinted?</td>
							<td
								>Crop, straighten, resize, convert the file, strip metadata, blur or crop your face
								(Vinted's own suggestion), and a background cut-out that leaves the item untouched</td
							>
						</tr>
						<tr>
							<td>What edits are not?</td>
							<td
								>Anything that changes how the item looks: color or lighting "fixes", smoothing
								creases, removing marks, AI-generated models or garments, stock, ad or online photos</td
							>
						</tr>
						<tr>
							<td>What gets a listing hidden?</td>
							<td
								>Photos "not good quality" or against the Catalog Rules. Fix within 24 hours and it
								returns, no appeal needed</td
							>
						</tr>
						<tr>
							<td>What gets a listing removed or an account suspended?</td>
							<td
								>Stock, ad or online photos; using AI "to mislead, such as misrepresenting an item's
								condition"; repeated breaches. One appeal within six months</td
							>
						</tr>
						<tr>
							<td>Best Vinted background</td>
							<td
								>A real wall, door, sheet or floor in daylight. Mid-gray keeps colors truest; white
								works but washes out pale items</td
							>
						</tr>
						<tr>
							<td>First photo</td>
							<td>The whole item, real, portrait 3:4, no collage, no cut-out</td>
						</tr>
						<tr>
							<td>Who wants white first</td>
							<td
								>Amazon (main image, most categories), eBay ("generally best", has its own tool).
								Mercado Libre has walked it back</td
							>
						</tr>
						<tr>
							<td>Transparent PNG upload</td>
							<td>No. Etsy renders it black; nobody documents the rest. Flatten to a white JPEG</td>
						</tr>
						<tr>
							<td>Set 1 prompt (real photos)</td>
							<td
								>"crop to 3:4 portrait, convert to JPEG, strip all metadata" (add "blur every face"
								if needed)</td
							>
						</tr>
						<tr>
							<td>Set 2 prompt (white cut-outs)</td>
							<td
								>"remove the background and make it white, crop to 3:4 portrait, convert to JPEG,
								strip metadata" (square for eBay)</td
							>
						</tr>
						<tr>
							<td>Batch limits</td>
							<td
								>Free 25 a month, 3 at a time, 20MB; paid plans 25 at a time, 75MB; Day Pass $2 for
								100 uploads in 24 hours</td
							>
						</tr>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Open Magic Flow">
			Start with the photos already on your phone at <a href="https://mochify.app/flow"
				>mochify.app/flow</a
			>: three a month with no signup, 25 a month with a free account, and the two prompts above.
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
