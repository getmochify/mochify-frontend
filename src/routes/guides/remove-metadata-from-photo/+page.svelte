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

	// Built from content-ops `article-originals/remove-metadata-from-photo.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off (the LinkedIn post deep-links them).
	const metadata = {
		title: 'How to Remove Metadata (EXIF and GPS) From a Photo on Windows, Mac, iPhone and Android',
		seoTitle: 'Remove Metadata From a Photo: Windows, Mac, iPhone, Android',
		description:
			'Strip EXIF and GPS from a photo on Windows, Mac, iPhone and Android: what each built-in tool leaves behind, what a re-encode removes, how to check.',
		category: 'Data Privacy',
		readTime: '28 min read',
		date: 'November 17, 2026',
		lastUpdated: 'November 19, 2026',
		bylineNote:
			'Figures come from six live API calls and an exiftool 12.76 run on November 9, 2026: what each built-in route leaves behind, and what a re-encode removes.'
	};

	const keywords =
		'remove metadata from photo, remove metadata from image, photo metadata remover, strip exif data, remove exif data, how to remove exif data from photo, remove location from photo, remove gps data from photo, what metadata does a photo contain, remove ai metadata from photo, remove content credentials from image';

	const pageUrl = 'https://mochify.app/guides/remove-metadata-from-photo';

	const exiftoolAll = 'exiftool -all= photo.jpg';
	const exiftoolKeepColor =
		'exiftool -all= --icc_profile:all -tagsfromfile @ -colorspacetags photo.jpg';
	const exiftoolFolder =
		'exiftool -r -ext jpg -all= --icc_profile:all -tagsfromfile @ -colorspacetags -P -overwrite_original ~/Pictures/to-share';

	const toc = [
		{ id: 'what-metadata-a-photo-contains', label: 'What metadata a photo actually contains' },
		{ id: 'five-words', label: 'Five words this guide uses' },
		{ id: 'see-photo-metadata', label: 'How to see the metadata on your own device' },
		{ id: 'windows', label: 'Windows 11: Remove Properties and Personal Information' },
		{ id: 'mac', label: 'Mac: Photos, Preview, and the terminal' },
		{ id: 'iphone', label: 'iPhone and iPad: No Location, and the share sheet Options' },
		{ id: 'android', label: 'Android: Google Photos, and the one thing it cannot remove' },
		{
			id: 'remove-everything',
			label: 'Remove everything at once: a re-encode, exiftool, or a converter'
		},
		{
			id: 'ai-metadata',
			label: 'AI metadata and Content Credentials: what comes off and what does not'
		},
		{ id: 'sharing-apps', label: 'Which sharing apps already strip it (and which do not)' },
		{ id: 'cheat-sheet', label: 'Cheat sheet' },
		{
			id: 'mochify-workflow',
			label: 'Mochify Workflow: strip the metadata from a batch of photos'
		},
		{ id: 'faq', label: 'FAQ' }
	];

	const faqItems = [
		{
			q: 'How do I remove metadata from a photo on Windows 11?',
			a: 'Right-click the photo in File Explorer, choose Properties, open the Details tab, click "Remove Properties and Personal Information", keep "Create a copy with all possible properties removed" selected and click OK. Windows writes a copy with " - Copy" in the name and the GPS and camera fields cleared. It removes most of the metadata, not all of it: the embedded thumbnail, editing-software blocks and Content Credentials can survive, so re-encode the file or run <code>exiftool -all=</code> when it has to be clean.'
		},
		{
			q: 'How do I remove the location from a photo on my iPhone?',
			a: 'Open the photo in Photos, tap the More button, then Adjust Info, Adjust Location and No Location (Apple\'s steps as of September 2026). To share without the location but keep it in your library, tap Share, tap Options at the top of the share sheet, and turn off Location; "Location Not Included" appears before you choose where to send it. Both remove the GPS tags only; the camera and date information stays in the file.'
		},
		{
			q: 'Can Google Photos remove the location from a photo on Android?',
			a: "Only if Google Photos added it. Google's help page states that a location added automatically by the camera cannot be updated or removed in Google Photos; the Edit &gt; Remove location control works on estimated or manually added locations. To stop future photos carrying a location, turn Save location off in your camera app's settings. To remove it from an existing photo, re-encode a copy with a converter or a dedicated app."
		},
		{
			q: 'Does removing metadata reduce image quality?',
			a: 'exiftool does not touch the pixels, so quality is identical; it removes the headers and leaves the compressed image data as it was. A converter re-encodes, which is a new compression pass: at the same dimensions and a sensible quality the difference is invisible, and if you are resizing for the web anyway the re-encode is the step you wanted. The one quality point to watch with exiftool is color: use the FAQ 32 form that keeps the ICC profile.'
		},
		{
			q: 'Do Instagram, WhatsApp and Facebook remove metadata automatically?',
			a: "For public posts, yes in practice: the platforms re-encode every upload and the EXIF, GPS included, does not survive on the public copy, according to published tests. The exceptions are the channels that send the original file: WhatsApp's document mode, Telegram's file mode, email attachments, AirDrop and iMessage keep everything, and WhatsApp's HD or best-quality mode kept the GPS in about a quarter of tests. Strip before sending on those."
		},
		{
			q: 'How do I remove AI metadata or Content Credentials from an image?',
			a: "Content Credentials (C2PA) are a signed metadata block in its own segment. Re-encoding the image removes it, and so does <code>exiftool -jumbf:all= photo.jpg</code>; a location-only removal does not. In our test, every Mochify output dropped the manifest, including the keep-metadata setting. What no metadata tool removes is a watermark embedded in the pixels, such as Google's SynthID, which is built to survive cropping, filters and compression."
		},
		{
			q: 'What metadata does a photo contain?',
			a: 'A phone or camera JPEG carries an EXIF block with the camera make and model, exposure settings, dates and times, an orientation flag, a vendor maker note and, if location was on, GPS latitude, longitude, altitude, heading and the precision of the fix; plus an embedded thumbnail, a color profile and, on recent phones, an HDR gain map. Edited images add XMP and IPTC blocks (edit history, keywords, copyright) and often Content Credentials. On the iPhone 15 photo we measured, that came to 61 EXIF tags in 22,017 bytes, 13 of them GPS.'
		},
		{
			q: 'How can I check that the metadata is really gone?',
			a: 'On a computer, run <code>exiftool photo.jpg</code> and look for an empty list under EXIF, GPS, XMP and JUMBF; on Windows, Properties &gt; Details should show no GPS or camera fields; on a phone, swipe up on the photo and look for a missing map and camera line. Check the file you are about to send, not the one in your library: Hide Location on a Mac and Options on an iPhone change the copy that leaves, not the original.'
		}
	];

	const related = [
		{
			title: 'The Risks of EXIF Data in Image Compression (2026)',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: 'why the GPS fix and the maker note matter, and what happens to them in a compression pipeline.'
		},
		{
			title: 'Privacy & Image Optimization: A Comprehensive Guide (2026)',
			href: '/guides/privacy-image-optimization',
			desc: "the policy side for teams that handle other people's photos."
		},
		{
			title: 'Does Stripping EXIF Data Improve WordPress Image SEO?',
			href: '/guides/does-stripping-exif-data-improve-wordpress-image-seo',
			desc: 'the short answer for site owners who were told it would.'
		},
		{
			title: 'How to Blur Faces or a License Plate in a Photo (Ask Your AI Assistant)',
			href: '/guides/blur-faces-license-plate-ai-assistant',
			desc: 'the other half of a clean share, with the metadata stripped on the way.'
		},
		{
			title: 'Why HDR Photos Look Flat When You Share Them (and How Gain Maps Fix It)',
			href: '/guides/why-hdr-photos-look-flat-when-shared',
			desc: 'the gain map a re-encode drops unless you ask to keep it.'
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
		datePublished="2026-11-17"
		dateModified="2026-11-19"
		article={{
			about: [
				'EXIF',
				'GPS metadata',
				'Content Credentials (C2PA)',
				'exiftool',
				'Windows',
				'macOS',
				'iOS',
				'Android',
				'Mochify'
			],
			keywords
		}}
	/>
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-cocoa-deep sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

	<header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-mochi-pink uppercase">
			{metadata.category} · Guide
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-cocoa-ink md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="Remove Metadata" />
		</h1>
		<div
			class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-mochi-pink to-mochi-pink-soft"
		></div>
		<p class="mt-5 mb-0 text-sm font-bold text-cocoa-milk">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering
			Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-cocoa-deep opacity-90">
			You are about to post a photo, send it to a buyer, attach it to a listing or hand it to a
			client, and you want the hidden part gone: where you were standing, when, on which phone. You
			searched "remove metadata from photo" and got a wall of upload-here tools, a Reddit thread
			asking whether the Windows button is enough, and an AI answer that gives four sets of steps
			and no idea whether any of them finished the job.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-cocoa-deep">
			Here is the shape of the answer before the detail. Every photo from a phone or camera carries
			a block of metadata called EXIF; a real iPhone 15 photo we opened for this guide carries 61
			EXIF tags, 13 of them GPS, inside 22,017 bytes of header, plus a maker note, a color profile,
			an embedded thumbnail and an HDR gain map. The built-in routes on iPhone, Android and the Mac
			remove the <strong>location</strong> and leave the rest. The Windows button removes
			<strong>most</strong> fields and leaves some. The only route that removes everything, including
			the newer Content Credentials that tag AI edits, is to write a fresh file: a re-encode, with exiftool,
			or with a converter that does it for you. This guide walks each platform click by click, says what
			each one leaves behind, and shows you how to check.
		</p>

		<div class="mt-8 rounded-2xl border border-pink-100 bg-mochi-blush/70 p-6">
			<p class="m-0 text-base leading-relaxed text-cocoa-deep">
				<strong class="text-cocoa-ink"
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

		<section id="what-metadata-a-photo-contains" class="scroll-mt-24">
			<SectionHeading>What metadata a photo actually contains</SectionHeading>
			<p class="mb-4">
				A photo straight from a phone or camera carries far more than the picture: camera make and
				model, the exact second it was taken, exposure settings, a GPS fix with altitude and compass
				heading, a vendor "maker note", a small embedded thumbnail, a color profile, and, on recent
				phones, an HDR gain map. Here is what one real file holds.
			</p>
			<p class="mb-4">
				We dumped the headers of an iPhone 15 photo taken on October 27, 2026 (3,867,434 bytes, 5712
				x 4284 pixels). Before the picture data starts, the file carries:
			</p>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>An EXIF block of 22,017 bytes</strong> with 12 tags in the main directory (Make
					<code>Apple</code>, Model <code>iPhone 15</code>, Software <code>27.0</code>, the date and
					time, an Orientation flag of 6 because the phone was held upright), 36 tags in the Exif
					sub-directory (shutter speed, aperture, ISO, lens model, white balance, the original
					timestamp to the sub-second, plus a MakerNote that only Apple software reads) and
					<strong>13 GPS tags</strong>: latitude and longitude to the hundredth of a second of arc,
					altitude (98 meters), the direction the camera faced (244 degrees), the GPS timestamp, and
					<code>GPSHPositioningError</code> (8.2 meters, which is how precise the fix was).
				</li>
				<li>
					<strong>An embedded thumbnail</strong>, a second small JPEG inside the first, which is why
					"remove the face from the photo" is not the same as "remove the face from the file".
				</li>
				<li>
					<strong>An ICC color profile</strong> (Display P3 on iPhones) and a
					<strong>MPF segment</strong> that points to a third image inside the file, the HDR gain map.
				</li>
				<li>
					<strong>An Apple-specific segment</strong> of 1,086 bytes that no public viewer explains.
				</li>
			</ul>
			<p class="mb-4">
				None of this is visible in the picture, all of it travels with the file when you attach it
				as a file, and most of it is useful. The lens and exposure data is why your photo library
				can search by camera; the GPS fix is why it can show a map. The question this guide answers
				is how to take it off a copy you are about to share, and how to be sure it is gone. For why
				it matters, <a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
					>the risks of EXIF data in image compression</a
				> covers the privacy and compliance side; this guide is the how.
			</p>
		</section>

		<section id="five-words" class="scroll-mt-24">
			<SectionHeading>Five words this guide uses</SectionHeading>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>EXIF.</strong> The block of camera data (make, model, exposure, dates, GPS) that cameras
					and phones write into JPEG, HEIC, TIFF and some PNG and WebP files. When someone says "photo
					metadata" they usually mean this.
				</li>
				<li>
					<strong>GPS tags.</strong> The part of EXIF that holds the location. Removing only these is
					what "remove location" does on every phone.
				</li>
				<li>
					<strong>XMP and IPTC.</strong> Two other metadata blocks, written by editing software and by
					photographers' tools: edit history, keywords, captions, copyright. A phone photo may not have
					them; a Lightroom or Photoshop export almost always does.
				</li>
				<li>
					<strong>Content Credentials (C2PA).</strong> A newer, signed metadata block that records who
					made or edited an image and with what, including whether generative AI was used. Stored in its
					own segment, not in EXIF, so EXIF-only tools miss it.
				</li>
				<li>
					<strong>Re-encode.</strong> Decoding the picture and writing a brand-new file from the pixels.
					A re-encode carries across only what the encoder is told to carry, which is why it is the clean
					way to remove metadata, and also why it changes the file (a new JPEG is a new compression pass).
				</li>
			</ul>
		</section>

		<section id="see-photo-metadata" class="scroll-mt-24">
			<SectionHeading>How to see the metadata on your own device</SectionHeading>
			<p class="mb-4">
				Every platform can show you the location and the basics; only a dedicated reader shows you
				everything. Check before and after, or you are guessing.
			</p>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>Windows 11:</strong> right-click the file, <strong>Properties</strong>,
					<strong>Details</strong> tab. You see camera, dates and (if present) GPS latitude and longitude
					under "GPS". Windows shows the fields it understands, not the raw blocks.
				</li>
				<li>
					<strong>Mac:</strong> in <strong>Photos</strong>, select the photo and click the
					<strong>Info</strong> button; photos with a location also appear in the Places album. In
					<strong>Preview</strong>, open the photo and choose
					<strong>Tools &gt; Show Location Info</strong>; if it is grayed out the image has no
					location (per Apple's Preview guide, read November 9, 2026). Preview's Inspector (<strong
						>Tools &gt; Show Inspector</strong
					>) shows the image's metadata fields.
				</li>
				<li>
					<strong>iPhone and iPad:</strong> open the photo in Photos and <strong>swipe up</strong>,
					or tap the Info button. You see the camera, the lens, the file size and a map if there is
					a location. Apple's
					<a
						href="https://support.apple.com/guide/personal-safety/ips0d7a5df82/web"
						target="_blank"
						rel="noopener noreferrer">Personal Safety User Guide</a
					> (published September 2026) is the current reference for these screens.
				</li>
				<li>
					<strong>Android (Google Photos):</strong> open the photo, <strong>swipe up</strong> or tap
					the Info button. Google Photos also shows an <em>estimated</em> location for photos that have
					none, worked out from landmarks and your other photos; the info panel labels it as estimated.
				</li>
				<li>
					<strong>Everything, in a browser:</strong> the Mochify
					<a href="/solutions/exif-viewer">EXIF viewer</a> lists every block a photo holds, grouped in
					plain sections, and reads the file on your device without uploading it.
				</li>
				<li>
					<strong>Everything, on any computer:</strong>
					<a href="https://exiftool.org/" target="_blank" rel="noopener noreferrer">exiftool</a> is
					the reference reader. <code>exiftool -a -G1 -s photo.jpg</code> lists every tag with the
					block it lives in (<code>[IFD0]</code>, <code>[ExifIFD]</code>, <code>[GPS]</code>,
					<code>[XMP]</code>, <code>[ICC_Profile]</code>, <code>[JUMBF]</code> for Content Credentials).
					It is the tool we used for the numbers in this guide, and it is how you prove a method worked:
					run it on the output and look for an empty list.
				</li>
			</ul>
		</section>

		<section id="windows" class="scroll-mt-24">
			<SectionHeading>Windows 11: Remove Properties and Personal Information</SectionHeading>
			<p class="mb-4">
				Windows has a built-in button that removes most of a photo's metadata and writes a copy. It
				is quick, it needs nothing installed, and it is not complete, so use it for "good enough"
				and a re-encode for "gone".
			</p>
			<h3>The steps</h3>
			<ol class="my-4 list-decimal space-y-3 pl-6">
				<li>
					In File Explorer, right-click the photo and choose <strong>Properties</strong> (or select
					it and press <strong>Alt+Enter</strong>). On Windows 11, if <strong>Properties</strong> is
					not in the short right-click menu, choose <strong>Show more options</strong> first.
				</li>
				<li>
					Open the <strong>Details</strong> tab. Scroll to see Camera, Advanced photo and GPS sections.
				</li>
				<li>
					Click <strong>Remove Properties and Personal Information</strong> at the bottom of the dialog.
				</li>
				<li>
					Leave <strong>Create a copy with all possible properties removed</strong> selected and
					click
					<strong>OK</strong>. Windows writes a second file next to the original (named with
					<code> - Copy</code> added) and leaves the original alone. The other option,
					<strong>Remove the following properties from this file</strong>, lets you tick individual
					fields and changes the original in place.
				</li>
				<li>
					Right-click the copy, <strong>Properties</strong>, <strong>Details</strong>: the GPS
					section should be empty and the camera fields blank.
				</li>
			</ol>
			<h3>What it leaves behind</h3>
			<p class="mb-4">
				The wording in the Microsoft Community thread that Google ranks for this question is the
				honest one: it "creates a copy with most metadata removed" (<a
					href="https://techcommunity.microsoft.com/discussions/windows11/how-can-i-remove-metadata-from-images/4408376"
					target="_blank"
					rel="noopener noreferrer">Microsoft Community Hub</a
				>, asked April 27, 2025, community answers through June 2026). Microsoft publishes no
				support page for the feature that we could find, so "most" is the strongest statement
				available. In practice the button clears the fields Windows itself displays. Data Windows
				does not display is a different matter: the embedded thumbnail, maker notes, XMP and IPTC
				blocks written by editing software, JPEG comments, and Content Credentials are not fields in
				that dialog, and a third-party audit of the feature on Windows 11 reports exactly those
				surviving (the audit's author sells a rival tool, so treat it as a claim to check, not a
				finding). Check with exiftool if the photo matters. If what you need is "the GPS and the
				camera model gone before I post this on a marketplace", the Windows button does that. If
				what you need is "nothing in this file but pixels", read on.
			</p>
			<h3>A worked example</h3>
			<p class="mb-4">
				Sam is selling a camera bag on a local listings site and photographed it on the kitchen
				table. Right-click, Properties, Details, Remove Properties, Create a copy, OK:
				<code>IMG_2031 - Copy.jpg</code> appears. Its Details tab shows no GPS and no camera. The listing
				goes up with the copy. What survived in the copy is the embedded thumbnail (a tiny version of
				the same kitchen table, harmless here) and the Apple segment nobody reads. Fine for a bag. Not
				fine if the original had been edited to hide something and the thumbnail had not.
			</p>
		</section>

		<section id="mac" class="scroll-mt-24">
			<SectionHeading>Mac: Photos, Preview, and the terminal</SectionHeading>
			<p class="mb-4">
				On a Mac the built-in routes remove the location; a full strip needs the terminal or a
				converter. Here is the order to try.
			</p>
			<h3>Photos: hide the location</h3>
			<p class="mb-4">
				Apple's current instruction is in the Personal Safety User Guide (September 2026): in
				Photos, select the photo or photos, then choose <strong
					>Image &gt; Location &gt; Hide Location</strong
				>.
				<strong>Image &gt; Location &gt; Revert to Original Location</strong> puts it back, which
				tells you Photos keeps the original data inside your library, so export a copy and check
				that copy before you share it. Export with
				<strong>File &gt; Export &gt; Export [N] Photos</strong>
				to get a new JPEG, HEIC, TIFF or PNG (the export dialog in the macOS Tahoe 26 Photos guide offers
				Photo Kind, JPEG Quality, Color Profile and Size).
				<strong>File &gt; Export &gt; Export Unmodified Original</strong> does the opposite: it hands
				you the original bytes with everything in them, so do not use it for a copy you mean to share
				clean.
			</p>
			<h3>Preview: look, and know its limits</h3>
			<p class="mb-4">
				Preview shows you the location (<strong>Tools &gt; Show Location Info</strong>) and the EXIF
				fields in its Inspector. Older guides describe a Remove Location Info button in the
				Inspector's GPS pane and an "Include location information" checkbox in File &gt; Export;
				Apple's current Preview guide documents viewing only, so if your version shows those
				controls they remove the location and nothing else. Treat Preview as the viewer and do the
				removal elsewhere.
			</p>
			<h3>Terminal: exiftool</h3>
			<p class="mb-4">
				Install exiftool (<code>brew install exiftool</code> with Homebrew, or the package from exiftool.org),
				then in Terminal:
			</p>
			<CodeCard filename="Terminal" code={exiftoolAll} />
			<p class="mb-4">
				That writes a copy of the file with no metadata and renames your original to
				<code>photo.jpg_original</code>, so nothing is lost. The exiftool FAQ adds a caution and a
				safer form for JPEGs: "the metadata may contain color space information which should be
				maintained to preserve the color rendition", so to keep the color profile and copy the
				color-space tags back:
			</p>
			<CodeCard filename="Terminal" code={exiftoolKeepColor} />
			<p class="mb-4">
				(<a href="https://exiftool.org/faq.html" target="_blank" rel="noopener noreferrer"
					>ExifTool FAQ 32</a
				>, read November 9, 2026.) For a whole folder of JPEGs, keeping the file dates and skipping
				the backups because you have your own:
			</p>
			<CodeCard filename="Terminal" code={exiftoolFolder} />
			<p class="mb-4">
				To remove only the location and keep the camera data, <code
					>exiftool -gps:all= photo.jpg</code
				>
				deletes the GPS block as a unit (we checked on exiftool 12.76: Make and Model stayed, both coordinates
				went). The same commands work on Windows and Linux; the Mac section is just where the terminal
				usually enters the conversation.
			</p>
			<h3>Check it</h3>
			<p class="mb-4">
				<code>exiftool photo.jpg</code> after <code>-all=</code> should list only file-system facts
				(name, size, dates, dimensions) and nothing under EXIF, GPS, XMP or JUMBF. If a
				<code>[JUMBF]</code>
				line is still there, the file had Content Credentials and your version of exiftool left them;
				see <a href="#ai-metadata">the AI metadata section</a>.
			</p>
		</section>

		<section id="iphone" class="scroll-mt-24">
			<SectionHeading>iPhone and iPad: No Location, and the share sheet Options</SectionHeading>
			<p class="mb-4">
				iOS removes the location from a photo, or from a share, with two taps; it does not remove
				the rest of the EXIF. For a full strip you need an app or a converter.
			</p>
			<h3>Remove the location from a photo</h3>
			<p class="mb-4">
				Apple's steps (Personal Safety User Guide, September 2026): open <strong>Photos</strong>,
				open the photo, tap the <strong>More</strong> button (the three dots), then
				<strong>Adjust Info &gt; Adjust Location &gt; No Location</strong>. The photo keeps its
				camera and date information; only the place goes. On older iOS versions the same control was
				reached by swiping up and tapping <strong>Adjust</strong> next to the map.
			</p>
			<h3>Share without the location</h3>
			<p class="mb-4">
				The better habit, because it leaves your library intact: select the photos, tap the
				<strong>Share</strong> button, tap <strong>Options</strong> at the top of the share sheet,
				and turn off <strong>Location</strong>. "Location Not Included" appears above Options, and
				whatever you choose next in the sheet (Messages, Mail, a third-party app) gets copies
				without the GPS tags. This is per share, so you decide each time.
			</p>
			<h3>Stop collecting it</h3>
			<p class="mb-4">
				<strong
					>Settings &gt; Privacy &amp; Security &gt; Location Services &gt; Camera &gt; Never.</strong
				>
				New photos then have no location at all. You lose the map in Photos; some people consider that
				a fair trade.
			</p>
			<h3>What iOS does not do</h3>
			<p class="mb-4">
				There is no built-in "remove all metadata" on iPhone. A photo shared with Location off still
				carries the camera model, the exposure data, the timestamps and the maker note; a Reddit
				r/privacy thread that ranks for "remove photo metadata iphone" reaches the same conclusion
				("nothing native"). The App Store has viewers and strippers (Apple's own listing for one,
				Exif Metadata, says it can "view, edit, and remove metadata, including GPS location"); or
				send the photo through any converter that re-encodes, including the Mochify web app from
				Safari, which writes a fresh file with no metadata by default. If the photo is a HEIC and
				the destination wants a JPEG anyway, <a href="https://mochify.app/heic-to-jpeg"
					>the HEIC to JPG converter</a
				> does both jobs in one drop.
			</p>
		</section>

		<section id="android" class="scroll-mt-24">
			<SectionHeading>Android: Google Photos, and the one thing it cannot remove</SectionHeading>
			<p class="mb-4">
				Google Photos removes a location it added or estimated, and does not remove a location the
				camera wrote. That sentence is in Google's own help and is missing from most of the pages
				(and the AI answer) telling you to "tap the pencil and Remove Location".
			</p>
			<h3>What Google Photos can do</h3>
			<p class="mb-4">
				Open the photo in Google Photos, tap <strong>More</strong> (three dots), then
				<strong>Edit</strong> next to the location. If the location was <em>estimated</em> by Google
				Photos or added by hand, <strong>Remove location</strong> removes it. For several photos,
				select them, tap <strong>More &gt; Edit location &gt; Remove location</strong>. Shared
				albums have a
				<strong>Share &gt; Options &gt; Share photo locations</strong> switch, and locations are off by
				default in new conversations.
			</p>
			<h3>What it cannot do</h3>
			<p class="mb-4">
				From Google's help page for Android (<a
					href="https://support.google.com/photos/answer/6153599"
					target="_blank"
					rel="noopener noreferrer">Understand, find and edit your photos' locations</a
				>, read November 9, 2026): "If a location was automatically added by your camera, you can't
				update or remove the location in Google Photos." That is the common case: your phone's
				camera geotagged the photo, and the Google Photos pencil is not the way out. Samsung's
				Gallery and other makers' gallery apps have their own controls (several offer a
				remove-location switch when sharing); check yours, then check the output.
			</p>
			<h3>The routes that work on Android</h3>
			<ol class="my-4 list-decimal space-y-3 pl-6">
				<li>
					<strong>Stop the camera saving it.</strong> Open the camera app's settings and turn
					<strong>Save location</strong> off (Google's wording for Pixel and most Android cameras). Future
					photos have no GPS tags.
				</li>
				<li>
					<strong>Re-encode the copy you share.</strong> Any converter that writes a new file
					removes the whole EXIF block, GPS included. The Mochify web app in Chrome does this from
					the phone: drop the photos, type <code>strip the metadata</code>, download. The Play Store
					also lists dedicated strippers (the one that ranks first on Google, Photo Metadata
					Remover, says it removes EXIF and optionally IPTC).
				</li>
				<li>
					<strong>Rely on the app you are posting to.</strong> Instagram, Facebook, X and most
					public platforms re-encode uploads and the EXIF goes with it (see
					<a href="#sharing-apps">the sharing section</a>), which is why "my photo has no metadata
					after I posted it" is normal and not a sign anything was removed on your phone.
				</li>
			</ol>
		</section>

		<section id="remove-everything" class="scroll-mt-24">
			<SectionHeading
				>Remove everything at once: a re-encode, exiftool, or a converter</SectionHeading
			>
			<p class="mb-4">
				Writing a new file from the pixels is the one method that removes every block at once: EXIF,
				GPS, maker note, thumbnail, XMP, IPTC, comments and Content Credentials. exiftool does it
				without touching the pixels, and so does the Mochify
				<a href="/solutions/exif-remover">EXIF remover</a>, which runs in your browser, uploads
				nothing and keeps only what the photo needs to display correctly; a converter does it while
				compressing or resizing. Here is what happens, measured.
			</p>
			<h3>What a re-encode removes</h3>
			<p class="mb-4">
				We sent the iPhone 15 photo from the first section through Mochify's API on November 9, 2026
				with one instruction, convert to JPEG at 1600 pixels wide. The output was 159,975 bytes,
				1600 x 2133, upright, and contained <strong>no metadata segment at all</strong>: no EXIF, no
				GPS, no maker note, no ICC profile, no Apple segment, no thumbnail, no gain map. Nothing to
				read. The PNG output in the same test carried none either, and the AVIF and WebP outputs we
				checked in October carried no EXIF. That is the default on the API and on every Mochify tool
				page except the two pro-camera HIF pages, which keep metadata until you switch Strip EXIF
				on; it is not a setting you have to find.
			</p>
			<h3>What a re-encode changes</h3>
			<p class="mb-4">
				A fresh encode is a new compression pass, so the file is not byte-identical to the original
				even at the same size. Three things to know:
			</p>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>Orientation is baked in.</strong> Phones store the pixels sideways and set an EXIF
					Orientation flag; a re-encode rotates the pixels upright and writes Orientation 1 (or
					none). This is why a stripped photo never comes out sideways from a proper converter, and
					why
					<code>exiftool -all=</code> on an un-rotated camera file <em>can</em> make it appear
					sideways: the pixels were never turned, and you just deleted the flag that said to turn
					them. Rotate first, or use the exiftool color-space form above and add
					<code>-orientation</code> to the tags copied back.
				</li>
				<li>
					<strong>Colors are converted to sRGB.</strong> Mochify converts a Display P3 or Adobe RGB
					source to sRGB during the encode, so the output needs no embedded profile and looks right
					in every browser; what you lose is the wide-gamut headroom (measured on a P3 iPhone photo,
					a mean difference of about 3 of 255 across the frame). exiftool's <code>-all=</code> removes
					the profile without converting the pixels, which is the case the FAQ's warning is about.
				</li>
				<li>
					<strong>HDR is a choice.</strong> The gain map that makes an HDR photo glow on an HDR
					screen is a second image inside the file; a plain re-encode drops it, and you keep it only
					if you ask (in Mochify, <code>hdr=true</code> or "keep the HDR" in the prompt).
					<a href="https://mochify.app/guides/why-hdr-photos-look-flat-when-shared"
						>Why HDR photos look flat when shared</a
					> explains what you are deciding.
				</li>
			</ul>
			<h3>When you want to keep the camera data</h3>
			<p class="mb-4">
				Photographers often want the opposite: strip nothing, or strip only the GPS.
				<code>exiftool -gps:all=</code> is the surgical tool. On Mochify, the photography pages keep
				metadata when you ask: on
				<a href="https://mochify.app/solutions/hif-to-jpg">the HIF to JPG converter</a>, built for
				Canon, Sony and Fujifilm <code>.HIF</code> files, the Strip EXIF switch starts
				<strong>off</strong>, so your ISO, shutter and lens data survive the conversion by default
				and you switch it on to remove them. On the API, <code>stripExif=false</code> keeps the EXIF block:
				in our test it carried every camera tag, the maker note and all 13 GPS tags across, rewrote Orientation
				to 1 to match the upright pixels, and did not carry the thumbnail, the profile or the gain map.
				"Keep metadata" means the EXIF block, not the whole header.
			</p>
			<h3>When you do not need any of this</h3>
			<p class="mb-4">
				If the photo was taken with location services off, has already been through a social
				network, or is a screenshot (screenshots carry no camera EXIF), there is nothing to remove.
				Check with the steps in <a href="#see-photo-metadata">section 3</a> and move on.
			</p>
		</section>

		<section id="ai-metadata" class="scroll-mt-24">
			<SectionHeading
				>AI metadata and Content Credentials: what comes off and what does not</SectionHeading
			>
			<p class="mb-4">
				Content Credentials are metadata and come off with a re-encode or
				<code>exiftool -jumbf:all=</code>; an AI watermark embedded in the pixels is not metadata
				and does not. Searches for "remove AI metadata from photo" have grown twenty-five-fold in a
				year, so this deserves its own section.
			</p>
			<h3>What Content Credentials are</h3>
			<p class="mb-4">
				Content Credentials are the C2PA standard's signed record of an image's history: which tool
				made it, what edits were applied, whether generative AI was involved. Adobe apps, some
				cameras and some image generators write them. In a JPEG they live in their own segment
				(APP11, in a container format called JUMBF), alongside EXIF rather than inside it, which is
				why a tool that only knows EXIF fields, like the Windows dialog, does not touch them. The
				C2PA specification (version 2.2, May 2025) is explicit that a manifest can be removed, and
				describes "soft bindings", fingerprints and watermarks that let a removed manifest be
				matched again from a provenance store if the publisher kept one.
			</p>
			<p class="mb-4">
				In the sample file we tested, the Content Credentials manifest was 45,882 bytes of a
				132,518-byte JPEG, 35% of the file.
			</p>
			<h3>What removes them</h3>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>A re-encode.</strong> We ran that sample through Mochify as JPEG, WebP and PNG, and
					also as JPEG with "keep metadata" switched on. The manifest was gone in all four outputs, including
					the keep-metadata one: the encoder carries the EXIF block when asked and never carries a manifest.
					So any Mochify conversion removes Content Credentials, whichever setting you use.
				</li>
				<li>
					<strong>exiftool.</strong> <code>exiftool -jumbf:all= photo.jpg</code> removed the
					manifest from the same file on exiftool 12.76 (132,518 bytes to 86,634), and so did
					<code>-all=</code>. Note that <code>-gps:all=</code> leaves it; location-only removal leaves
					Content Credentials intact.
				</li>
				<li>
					<strong>The copy-into-a-new-document trick</strong> that Photoshop users trade on forums (select
					all, copy, paste into a new file, export) works for the same reason: the new file has no history.
				</li>
			</ul>
			<h3>What does not come off</h3>
			<p class="mb-4">
				A watermark embedded in the picture itself survives all of this. Google's SynthID, used on
				images from Gemini and checked by Gemini, Search and Chrome, is "designed to stand up to
				modifications like cropping, adding filters ... or lossy compression" (<a
					href="https://deepmind.google/science/synthid/"
					target="_blank"
					rel="noopener noreferrer">Google DeepMind</a
				>, read November 9, 2026). A metadata strip does not touch pixels, so it does not touch
				SynthID, and platforms that classify images by content rather than by header will still see
				what they see. If your goal is to pass a generated image off as a photograph, no metadata
				tool does that, and this guide is not going to help you try. If your goal is to stop a photo
				you edited in Photoshop from carrying your name, your software list and your edit history to
				a stranger, the strip is exactly the right tool.
			</p>
		</section>

		<section id="sharing-apps" class="scroll-mt-24">
			<SectionHeading>Which sharing apps already strip it (and which do not)</SectionHeading>
			<p class="mb-4">
				Most public platforms re-encode what you upload and the metadata goes with it; the private
				channels that send the original file do not. Where you send the photo matters as much as
				what you did to it.
			</p>
			<p class="mb-4">
				Published tests (a 2026 round-up by fast.io, updated April 28, 2026, drawing on MetaClean,
				SammaPix and PrivacyStrip test sets) line up with what engineers expect from re-encoding
				pipelines:
			</p>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Channel</th><th>Typical result</th><th>Why</th></tr></thead>
					<tbody>
						<tr>
							<td>Instagram, Facebook, X, LinkedIn, TikTok, Reddit (i.redd.it) posts</td>
							<td>GPS, camera and timestamps gone from the public copy</td>
							<td>The platform re-encodes every upload</td>
						</tr>
						<tr>
							<td>Signal</td>
							<td>All EXIF removed before sending</td>
							<td>Strips by design</td>
						</tr>
						<tr>
							<td>WhatsApp, Telegram in standard photo mode</td>
							<td
								>Usually stripped (WhatsApp standard mode removed GPS from about 89% of test photos)</td
							>
							<td>Re-encoded for size</td>
						</tr>
						<tr>
							<td
								><strong
									>WhatsApp "document", Telegram "file", email attachments, AirDrop, cloud links</strong
								></td
							>
							<td><strong>Everything kept</strong></td>
							<td>The original bytes are sent</td>
						</tr>
						<tr>
							<td><strong>iMessage</strong></td>
							<td><strong>Everything kept, GPS included</strong></td>
							<td>Sends the original</td>
						</tr>
						<tr>
							<td>WhatsApp "best quality" / HD</td>
							<td>Unreliable (GPS survived in about 23% of tests)</td>
							<td>Lighter re-encode</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Two consequences. First, "my photo has no metadata after I posted it" is normal, not
				evidence that something on your device removed it; the platform did, on its copy, and the
				original on your phone still has everything. Second, the channels people reach for when they
				want to send a
				<em>good</em> copy (document mode, HD, AirDrop, email) are precisely the ones that keep the location.
				Strip first, then send, whenever the recipient is not someone you would hand your address to.
				And a stripped public copy says nothing about what the platform kept on its own servers.
			</p>
			<p class="mb-4">
				Mochify tip for sellers: marketplace uploaders behave like the first row, so a stripped copy
				is belt and braces there, but a buyer who asks for "more photos" by email or WhatsApp
				document gets your originals. <a
					href="https://mochify.app/guides/privacy-image-optimization"
					>Privacy and image optimization</a
				> covers the policy side for teams who handle other people's photos.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Platform</th>
							<th>Built-in route</th>
							<th>Removes</th>
							<th>Leaves</th>
							<th>For a full strip</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Windows 11</td>
							<td
								>Right-click &gt; Properties &gt; Details &gt; Remove Properties and Personal
								Information &gt; Create a copy</td
							>
							<td>Most EXIF fields incl. GPS, camera, dates</td>
							<td
								>Thumbnail, maker notes, XMP / IPTC, comments, Content Credentials (unverified by
								Microsoft; check with exiftool)</td
							>
							<td>exiftool or a converter</td>
						</tr>
						<tr>
							<td>Mac</td>
							<td>Photos: Image &gt; Location &gt; Hide Location; export a copy</td>
							<td>Location in the exported copy</td>
							<td>Camera data, everything else</td>
							<td
								><code>exiftool -all= --icc_profile:all -tagsfromfile @ -colorspacetags</code> or a converter</td
							>
						</tr>
						<tr>
							<td>iPhone / iPad</td>
							<td
								>Photos: More &gt; Adjust Info &gt; Adjust Location &gt; No Location; or Share &gt;
								Options &gt; Location off</td
							>
							<td>Location only</td>
							<td>Camera, exposure, dates, maker note</td>
							<td>An App Store stripper, or a converter in Safari</td>
						</tr>
						<tr>
							<td>Android</td>
							<td
								>Camera settings &gt; Save location off (future photos); Google Photos removes only
								estimated / manual locations</td
							>
							<td>Future GPS; estimated locations</td>
							<td>Camera-written GPS and all EXIF on existing photos</td>
							<td>A converter in Chrome, or a Play Store stripper</td>
						</tr>
						<tr>
							<td>Any computer</td>
							<td><code>exiftool -all= photo.jpg</code></td>
							<td>Everything (EXIF, GPS, XMP, IPTC, thumbnail, Content Credentials)</td>
							<td>A <code>photo.jpg_original</code> backup</td>
							<td>Add <code>-jumbf:all=</code> only if your version leaves JUMBF</td>
						</tr>
						<tr>
							<td>Any device, browser</td>
							<td
								>Drop on a Mochify tool page or <a href="https://mochify.app/flow">the web app</a
								></td
							>
							<td
								>Everything, by default, while converting or compressing (the two HIF pages keep
								metadata until you switch Strip EXIF on)</td
							>
							<td>Nothing (pixels only; colors converted to sRGB)</td>
							<td>That is the full strip</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				The thirty-second version: phones remove the location, Windows removes most fields, a
				re-encode removes everything; check with exiftool; and strip <em>before</em> you send by document,
				HD, email or iMessage, because those keep the original.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: strip the metadata from a batch of photos</SectionHeading>
			<GlassPanel
				><ol class="workflow-steps">
					<li>
						<h3>Say what you want</h3>
						<p>
							Open the <a href="https://mochify.app/flow">Mochify web app</a>, drop the photos (up
							to 3 per batch with no signup, 25 on a Day Pass or any paid plan), and type the result
							in plain English: <code>strip the metadata</code>, or
							<code>remove the location data and keep them as JPG</code>, or
							<code>JPG, 1600px wide, strip EXIF</code> if they are going to a listing. Magic Flow
							reads the sentence with a language model, then the C++ engine writes fresh files, so
							nothing from the original header comes across unless you asked for it. Want faces
							hidden too?
							<code>blur every face and strip the metadata</code> does both in one pass; the web app
							shows no face count, so check each picture (<a
								href="https://mochify.app/guides/blur-faces-license-plate-ai-assistant"
								>how to blur faces or a license plate</a
							> has the detail).
						</p>
					</li>
					<li>
						<h3>Or use the one-job page</h3>
						<p>
							If the photos are JPEGs and you want them to stay JPEGs,
							<a href="https://mochify.app/solutions/jpegli-compressor"
								>the jpegli JPEG compressor</a
							>
							is the one drop: <code>.JPG</code> in, a smaller standard JPEG out, metadata stripped
							by default (a Strip EXIF switch appears after upload if you want it kept). Every
							conversion page works the same way, GPS included; the photography pages such as
							<a href="https://mochify.app/solutions/hif-to-jpg">HIF to JPG</a> start with metadata kept
							because their users want it, and the switch is right there after upload.
						</p>
					</li>
					<li>
						<h3>From the terminal or an agent</h3>
						<p>
							The same engine runs from the Mochify CLI, from an AI assistant through the hosted MCP
							server or the local MCP server (<code>mochify serve</code>), and from the REST API:
							<code>POST /v1/squish?type=jpg</code> on <code>api.mochify.app</code>, authenticated
							with
							<code>Authorization: Bearer &lt;key&gt;</code>, strips metadata by default; add
							<code>stripExif=false</code> to keep the EXIF block (camera, dates, GPS, maker note).
							All of them are clients over the same API.
							<a href="https://mochify.app/guides/agent-built-website-image-optimization"
								>Your AI agent built your website</a
							> shows an agent stripping the GPS from a whole folder of site images this way.
						</p>
					</li>
					<li>
						<h3>What happens to your files</h3>
						<p>
							Your photos travel over HTTPS to <code>api.mochify.app</code>, are processed in memory
							and discarded as soon as your download is ready: nothing is written to disk, no logs
							contain your image data, and your images are never used to train AI. That holds for
							the web app, the tool pages, the CLI, both MCP servers and the API (the hosted MCP
							server keeps the finished file behind a short-lived link for about five minutes so
							your assistant can fetch it; the original is still discarded at once). The
							<a href="https://mochify.app/architecture">architecture and data handling</a> page has the
							full description.
						</p>
					</li>
				</ol></GlassPanel
			>
			<p class="mt-6 mb-4 text-base leading-relaxed text-cocoa-milk">
				One photo, one location to hide, a phone in your hand? Use the two-tap route in the platform
				section above. The workflow is for the batch, the full strip, and the file that is going
				somewhere that will keep whatever you leave in it.
			</p>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Open the web app">
			Got photos to share? Open the Mochify web app, drop them in and type <em
				>strip the metadata</em
			>; Magic Flow does the rest, and your images are processed in memory and never stored.
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
