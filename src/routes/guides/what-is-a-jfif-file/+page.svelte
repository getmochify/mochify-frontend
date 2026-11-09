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

	// Built from content-ops `article-originals/what-is-a-jfif-file.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Section ids
	// are kept exactly as handed off (the LinkedIn post may deep-link them).
	const metadata = {
		title: 'What Is a JFIF File? Why Windows Saves .jfif, and How to Get a JPG or PNG Back',
		seoTitle: 'What Is a JFIF File? Why Windows Saves .jfif and the Fix',
		description:
			'A JFIF is a JPEG with another name. Why Windows and your browser save .jfif, what renaming loses (nothing), the registry fix, and the Mac and phone routes.',
		category: 'Image Formats',
		readTime: '24 min read',
		date: 'November 9, 2026',
		bylineNote:
			'Measured on November 7, 2026: one .jfif renamed, re-encoded with jpegli, and converted to PNG, with the Windows registry cause read from the Chromium source.'
	};

	const keywords =
		'what is a jfif file, jfif file, jfif vs jpeg, why is my jpeg saving as a jfif, how to change jfif to jpg, how to stop windows saving as jfif, jfif to png, jfif to pdf, open jfif file on iphone';

	const pageUrl = 'https://mochify.app/guides/what-is-a-jfif-file';

	const toc = [
		{
			id: 'jfif-is-a-jpeg',
			label: 'The short answer: a JFIF is a JPEG'
		},
		{
			id: 'five-words',
			label: 'Five words this guide uses'
		},
		{
			id: 'why-windows-saves-jfif',
			label: 'Why Windows and your browser save images as .jfif'
		},
		{
			id: 'rename-jfif-to-jpg',
			label: 'Does renaming .jfif to .jpg lose anything?'
		},
		{
			id: 'jfif-vs-exif',
			label: 'JFIF vs Exif: the two JPEG file layouts'
		},
		{
			id: 'fix-jfif-by-platform',
			label: 'How to open or fix a .jfif on Windows, Mac, iPhone and Android'
		},
		{
			id: 'stop-windows-saving-jfif',
			label: 'How to stop Windows saving images as .jfif'
		},
		{
			id: 'jfif-to-png-pdf',
			label: 'JFIF to PNG, JFIF to PDF, and when a re-encode beats a rename'
		},
		{
			id: 'cheat-sheet',
			label: 'Cheat sheet'
		},
		{
			id: 'mochify-workflow',
			label: 'Mochify Workflow: fix a folder of .jfif files'
		},
		{
			id: 'faq',
			label: 'FAQ'
		}
	];

	const faqItems = [
		{
			q: 'Is a JFIF file the same as a JPG?',
			a: 'Yes. JFIF is the file layout most JPEG images use, so a <code>.jfif</code> and a <code>.jpg</code> hold the same kind of picture, compressed the same way, and open in the same programs. Only the extension differs, and the extension is a label. Renaming <code>.jfif</code> to <code>.jpg</code> changes nothing inside the file.'
		},
		{
			q: 'Why are my JPEGs turning into JFIF?',
			a: "Because of one Windows registry value. When a browser saves an image whose web address has no extension, it asks Windows which extension goes with the MIME type <code>image/jpeg</code>, and on many Windows 10 and 11 machines the answer stored at <code>HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</code> is <code>.jfif</code>. Chrome, Edge and Firefox all consult it. The picture is a normal JPEG; the name is Windows' choice."
		},
		{
			q: 'How do I change a JFIF to a JPG?',
			a: 'Rename it: on Windows, show file name extensions (View &gt; Show &gt; File name extensions), right-click the file, Rename, and change <code>.jfif</code> to <code>.jpg</code>; on a Mac, select it in Finder and edit the name; on an iPhone, touch and hold it in Files and tap Rename. For several files, or when you cannot rename, drop them on the JFIF to JPG converter and download the JPGs. Renaming keeps the original bytes; the converter writes a fresh jpegli JPEG with the metadata stripped.'
		},
		{
			q: 'How do I stop Windows saving images as .jfif?',
			a: 'Open Registry Editor, go to <code>HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</code>, double-click <code>Extension</code>, change <code>.jfif</code> to <code>.jpg</code>, and restart your browser. Back up the registry first, and leave it alone on a work machine you do not administer. New downloads then save as <code>.jpg</code>; files already saved stay <code>.jfif</code> until you rename or convert them.'
		},
		{
			q: 'What is the difference between JFIF and JPEG?',
			a: 'JPEG is the compression method; JFIF is one of the two file layouts that carry it. The other is Exif, which cameras and phones write because it has room for camera settings and GPS. A JFIF-layout file starts with an APP0 segment labeled <code>JFIF</code>; an Exif-layout file starts with an APP1 segment labeled <code>Exif</code>. Both decode identically, both usually carry a <code>.jpg</code> extension, and most programs write and read both.'
		},
		{
			q: 'Can I convert a JFIF to PNG, and will it be transparent?',
			a: 'Yes, and no. A JFIF to PNG conversion gives you a PNG with the JFIF\'s pixels exactly, so it opens wherever PNG is required, but it is several times larger (3.9x in our test) and it has no transparency, because the JPEG had none. If you want the background removed, open the Mochify web app and type "remove the background and convert to PNG"; background removal is on every plan, including Free.'
		},
		{
			q: 'Can I open a JFIF file on an iPhone or Android phone?',
			a: "Yes. The picture opens in the Files app on iPhone and in a file manager on Android, and in any browser. Apps that insist on <code>.jpg</code> are the ones that need the file renamed (touch and hold, Rename) or converted; the JFIF to JPG converter works from the phone's browser when renaming is not offered."
		},
		{
			q: 'Does converting a JFIF to JPG lose quality?',
			a: "A rename loses nothing. A conversion is a fresh JPEG encode, and Mochify's runs jpegli at quality 85, which keeps the picture looking the same on screen; a JFIF saved at high quality usually comes back smaller (18.6% smaller in our test), and one that was already heavily compressed can come back a little larger. If the exact original bytes matter, rename instead of converting."
		}
	];

	const related = [
		{
			title: 'What Is a WebP File? (And How to Open One)',
			href: '/guides/what-is-a-webp-file',
			desc: 'the other extension web saves hand you, and how to open it by platform.'
		},
		{
			title: 'Save Image as Type Is Gone: How to Replace It Safely',
			href: '/guides/save-image-as-type-alternative',
			desc: 'choosing the format at save time, and the rename trap in the other direction.'
		},
		{
			title: 'Jpegli vs MozJPEG: Which JPEG Encoder to Use in 2026',
			href: '/guides/jpeg-in-2026-jpegli',
			desc: 'the encoder behind the JFIF to JPG page, measured against MozJPEG.'
		},
		{
			title: 'The Risks of EXIF Data in Image Compression (2026)',
			href: '/guides/exif-data-risks-image-compression-2026',
			desc: 'what lives in an Exif-layout JPEG and why a re-encode strips it.'
		},
		{
			title: 'Lossless Image Formats: Which One to Use, and When Lossless Is the Wrong Choice',
			href: '/guides/lossless-image-formats',
			desc: 'the PNG side of the JFIF to PNG decision.'
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
		datePublished="2026-11-09"
		article={{
			about: ['JFIF', 'JPEG', 'Exif', 'Windows registry', 'image file formats', 'Mochify'],
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
			<AccentTitle title={metadata.title} accent="JFIF File" />
		</h1>
		<div
			class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-mochi-pink to-mochi-pink-soft"
		></div>
		<p class="mt-5 mb-0 text-sm font-bold text-cocoa-milk">
			{metadata.readTime} · Published {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-cocoa-deep opacity-90">
			You saved a photo from a web page, went to upload it to a form, a marketplace listing or a
			work system, and the site refused it. The file was called <code>photo.jfif</code>. You did not
			ask for that. Windows, or whichever browser you used, picked the name, and the "Save as type"
			box offered nothing else. Now you have a folder of pictures you cannot use, a search box open,
			and a lot of pages telling you to download a converter.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-cocoa-deep">
			Here is the straight answer the forums keep circling: a JFIF file <em>is</em> a JPEG. Not a
			cousin, not an older version, not a subtype. The bytes inside <code>photo.jfif</code> are the
			same bytes a <code>.jpg</code> would hold, and renaming it changes nothing except the label.
			This guide explains why the label appears (one registry value on your Windows machine that
			your browser consults), how to get a <code>.jpg</code> or a <code>.png</code> back on Windows, Mac,
			iPhone and Android, how to stop it happening again, and the one technical fact behind all of it:
			JPEG has two common file layouts, JFIF and Exif, and nearly every program reads both.
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

		<section id="jfif-is-a-jpeg" class="scroll-mt-24">
			<SectionHeading>The short answer: a JFIF is a JPEG</SectionHeading>
			<p class="mb-4">
				JFIF stands for JPEG File Interchange Format. It is the file layout most JPEG images have
				used since 1992, so a file called <code>.jfif</code> holds exactly the same kind of picture
				as one called <code>.jpg</code>, and every image viewer, editor and browser opens it. The
				extension is the only difference, and it only matters to software that checks the name
				instead of the contents.
			</p>
			<p class="mb-4">
				The original JPEG standard defined how to compress a picture but not how to store the result
				as a file: nothing said where the resolution or the color space went, or what the first few
				bytes should be. In 1992 a short specification filled that hole. It called itself "a minimal
				file format which enables JPEG bitstreams to be exchanged" (<a
					href="https://www.w3.org/Graphics/JPEG/jfif3.pdf"
					target="_blank"
					rel="noopener noreferrer">JFIF 1.02, September 1992</a
				>), and it did one job: it put a small header at the front of the file, then the JPEG data.
				That layout became so universal that nobody names it. Open a <code>.jpg</code> saved from
				one website and a <code>.jfif</code> saved from another in a hex viewer and both begin
				<code>FF D8 FF E0</code>, with the letters <code>JFIF</code> a few bytes in. The UK National
				Archives' format registry lists <code>jpg</code>, <code>jpe</code>, <code>jpeg</code>,
				<code>jif</code>, <code>jfif</code> and <code>jfi</code> as extensions for one and the same
				format (<a
					href="https://pronom.nationalarchives.gov.uk/fmt/44"
					target="_blank"
					rel="noopener noreferrer">PRONOM fmt/44</a
				>).
			</p>
			<p class="mb-4">
				So the question "what is a JFIF file" has a one-line answer, and the real questions are the
				ones under it: why did your computer choose that name, what happens if you rename it, and
				what to do with the files you already have. Those take the rest of the guide.
			</p>
		</section>
		<section id="five-words" class="scroll-mt-24">
			<SectionHeading>Five words this guide uses</SectionHeading>
			<p class="mb-4">The rest of the guide assumes only these.</p>
			<ul class="my-4 list-disc space-y-3 pl-6">
				<li>
					<strong>JPEG</strong> is the compression method: the math that turns a picture into a small
					file by discarding detail your eye does not miss. It is also the everyday name for the file.
				</li>
				<li>
					<strong>JFIF</strong> is a file layout for JPEG data: a short header, then the compressed picture.
					Most JPEGs on the web use it.
				</li>
				<li>
					<strong>Exif</strong> is the other common layout. Cameras and phones write it, because it has
					room for the camera settings, the date, and the GPS position. A photo from your phone is usually
					an Exif-layout JPEG.
				</li>
				<li>
					<strong>Extension</strong> is the part of the file name after the dot: <code>.jpg</code>,
					<code>.jfif</code>, <code>.png</code>. It is a label. It does not change the bytes.
				</li>
				<li>
					<strong>MIME type</strong> is how programs describe a file's kind without a name:
					<code>image/jpeg</code>
					for any JPEG, <code>image/png</code> for a PNG. When a browser downloads a picture it knows
					the MIME type first and has to work out an extension from it, which is where the trouble starts.
				</li>
			</ul>
		</section>
		<section id="why-windows-saves-jfif" class="scroll-mt-24">
			<SectionHeading>Why Windows and your browser save images as .jfif</SectionHeading>
			<p class="mb-4">
				Windows keeps a table that maps each MIME type to a preferred file extension, and on many
				Windows 10 and Windows 11 machines the entry for <code>image/jpeg</code> reads
				<code>.jfif</code>. When a browser downloads an image whose web address does not end in a
				usable extension, it asks Windows which extension goes with <code>image/jpeg</code>, and
				Windows answers from that one entry. The picture is a normal JPEG; the name is Windows'
				choice.
			</p>
			<p class="mb-4">
				That table lives in the registry at <code
					>HKEY_CLASSES_ROOT\MIME\Database\Content Type\image/jpeg</code
				>, in a value called <code>Extension</code>. This is not folklore: the Chromium source code
				that Chrome and Microsoft Edge share opens exactly that key and reads exactly that value
				when it needs the preferred extension for a MIME type (<a
					href="https://github.com/chromium/chromium/blob/main/net/base/platform_mime_util_win.cc"
					target="_blank"
					rel="noopener noreferrer"><code>platform_mime_util_win.cc</code></a
				>, function <code>GetPlatformPreferredExtensionForMimeType</code>). Microsoft's own
				documentation describes the table as the thing that "associates a MIME content type with a
				file name extension" (<a
					href="https://learn.microsoft.com/en-us/windows/win32/msi/mime-table"
					target="_blank"
					rel="noopener noreferrer">MIME Table, Windows Installer</a
				>), and the same key is the answer given on Microsoft's Q&amp;A site every time the question
				comes up, including by a Microsoft Community Support Specialist in
				<a
					href="https://learn.microsoft.com/en-us/answers/a/6812413"
					target="_blank"
					rel="noopener noreferrer">January 2023</a
				>. Firefox has had the same reports on Windows since
				<a
					href="https://support.mozilla.org/en-US/questions/1274755"
					target="_blank"
					rel="noopener noreferrer">December 2019</a
				>, so this is not a Chrome quirk.
			</p>
			<h3>A worked example</h3>
			<p class="mb-4">
				Walk a download through it. You right-click a product photo on a shop page and choose "Save
				image as". The image's address is something like <code
					>https://cdn.example.com/img/8f3a2c91?w=1600</code
				>: no <code>.jpg</code> anywhere, because the shop's image service serves pictures by ID.
				The browser already received the file with the header <code>Content-Type: image/jpeg</code>,
				so it knows what it has. To fill in the save dialog it needs a name, and the address gives
				it none, so it asks Windows for the extension that belongs to <code>image/jpeg</code>. On a
				machine where that registry value says <code>.jfif</code>, the dialog offers
				<code>8f3a2c91.jfif</code>
				and a "Save as type" list with nothing better in it. Save the same image from a page whose address
				ends in <code>/hero.jpg</code> and you get <code>hero.jpg</code>, because the browser takes
				the extension from the address and never asks.
			</p>
			<p class="mb-4">
				That is why the symptom looks random. Some sites give you <code>.jpg</code>, some give you
				<code>.jfif</code>, and the difference is whether the address carried an extension, not
				anything about the picture.
			</p>
			<h3>Why it comes and goes</h3>
			<p class="mb-4">
				Because the mapping is one value on one machine, it is a machine state, not a Windows
				feature you can look up. Users on Microsoft's forums have reported the value changing back
				after some Windows updates and have blamed third-party software for setting it; a 2020
				thread that names the key ends with the poster asking "why is it getting changed after an
				update" and getting no answer (<a
					href="https://learn.microsoft.com/en-us/answers/a/5339313"
					target="_blank"
					rel="noopener noreferrer">Microsoft Q&amp;A, March 2020</a
				>). We could not find any Microsoft document stating what a fresh install ships in that
				value, so we will not tell you it is "the default". What we can say is that the reports run
				from Windows 10 in 2019 to Windows 11 in 2026, the browser code has not changed, and the fix
				in section 7 is the same throughout.
			</p>
		</section>
		<section id="rename-jfif-to-jpg" class="scroll-mt-24">
			<SectionHeading>Does renaming .jfif to .jpg lose anything?</SectionHeading>
			<p class="mb-4">
				No. Renaming changes the label and not one byte of the file. We checked it the literal way:
				we took a 1600 x 1200 JPEG saved as <code>photo.jfif</code> (1,186,845 bytes), copied it to
				<code>photo.jpg</code>, and hashed both. The SHA-256 of the two files is identical,
				<code>54a59b68...e09ac4cb</code> in both cases. There is nothing to lose because nothing was converted.
			</p>
			<p class="mb-4">
				The reason renaming works is that almost no program trusts the extension. Image libraries
				read the first bytes of the file (the <code>FF D8</code> that opens every JPEG) and decode
				from there; the name is for humans and for file managers. That is why the forum answer "just
				rename it" is correct, and why it frustrates people anyway: the places that refuse a
				<code>.jfif</code> are the places that check the name and never look inside. Web upload forms
				with an accepted-extensions list, some marketplace listing tools, older desktop software, and
				a few phone apps do this. For those, the label is the whole problem, and changing it is the whole
				fix.
			</p>
			<h3>When the rename is not enough</h3>
			<p class="mb-4">Three cases call for more than a rename.</p>
			<ol class="my-4 list-decimal space-y-3 pl-6">
				<li>
					<strong>You cannot see or change the extension.</strong> Windows hides extensions by
					default, so a file that shows as <code>photo</code> may be <code>photo.jfif</code>
					underneath, and typing <code>.jpg</code> on the end of a hidden extension gives you
					<code>photo.jpg.jfif</code>. Section 6 shows how to reveal extensions first. On a phone,
					or a work machine you do not administer, renaming may not be offered at all.
				</li>
				<li>
					<strong>You have a folder of them.</strong> Renaming forty files by hand is the kind of job
					that makes people download converters, and a batch converter is the right tool for it.
				</li>
				<li>
					<strong>You want the file changed as well as renamed.</strong> The photo may carry metadata
					you would rather not upload, or it may be larger than the form allows. A rename keeps every
					byte, including the ones you wanted gone. A re-encode is the better move here, and section 8
					covers what it costs you and what it saves.
				</li>
			</ol>
			<p class="mb-4">
				The rule of thumb: one file, extension visible, nothing else wrong with it, rename it.
				Anything else, convert it. The <a href="https://mochify.app/solutions/jfif-to-jpg"
					>JFIF to JPG converter</a
				>
				takes <code>.jfif</code> files directly, three at a time with no signup, and hands back
				standard <code>.jpg</code> files.
			</p>
		</section>
		<section id="jfif-vs-exif" class="scroll-mt-24">
			<SectionHeading>JFIF vs Exif: the two JPEG file layouts</SectionHeading>
			<p class="mb-4">
				"JFIF vs JPEG" is a comparison between a container and its contents, so it has no winner.
				The comparison that does exist is JFIF vs Exif: the two layouts a JPEG file can use, and the
				reason a photo from your phone and a picture from a website are both JPEGs yet start with
				different bytes.
			</p>
			<p class="mb-4">
				Every JPEG file begins with a two-byte start-of-image marker, <code>FF D8</code>, and ends
				with an end-of-image marker, <code>FF D9</code>. Between them sit numbered "application
				segments" that carry everything the compressed picture itself does not: resolution, color
				space, and metadata. The JFIF specification requires its segment, APP0, to come straight
				after the start marker; it is identified by the text <code>JFIF</code> and carries the
				version, the pixel density and an optional thumbnail (<a
					href="https://www.w3.org/Graphics/JPEG/jfif3.pdf"
					target="_blank"
					rel="noopener noreferrer">JFIF 1.02</a
				>, standardized as
				<a href="https://www.itu.int/rec/T-REC-T.871" target="_blank" rel="noopener noreferrer"
					>ITU-T T.871</a
				>). The Exif specification, written by the camera industry, requires <em>its</em> segment,
				APP1, to come straight after the start marker too; it is identified by the text
				<code>Exif</code>
				and carries the camera make and model, exposure settings, date, orientation, and, if the device
				had one, the GPS position (<a
					href="https://www.digicamsoft.com/exif22/exif22/html/exif22_17.htm"
					target="_blank"
					rel="noopener noreferrer">Exif 2.2, compressed file structure</a
				>). Both standards claim the first slot, which is a formal incompatibility, and in practice
				it does not matter: many programs and cameras write both segments one after the other, and
				the Exif standard tells readers to skip any segment they do not recognize, so a JFIF-only
				reader ignores the Exif block and an Exif reader ignores the JFIF block.
			</p>
			<GuideTable class="my-6"
				><table>
					<thead><tr><th>Feature</th><th>JFIF layout</th><th>Exif layout</th></tr></thead><tbody
						><tr
							><td>Who writes it</td><td>Web images, editors, most software libraries</td><td
								>Cameras, phones, photo apps</td
							></tr
						><tr
							><td>First bytes after <code>FF D8</code></td><td
								><code>FF E0</code> (APP0), then <code>JFIF</code></td
							><td><code>FF E1</code> (APP1), then <code>Exif</code></td></tr
						><tr
							><td>What the header carries</td><td>Version, pixel density, optional thumbnail</td
							><td>Camera settings, date, orientation, GPS, thumbnail</td></tr
						><tr
							><td>Usual extension</td><td
								><code>.jpg</code>, <code>.jpeg</code>, or <code>.jfif</code> when Windows names it</td
							><td><code>.jpg</code>, <code>.jpeg</code></td></tr
						><tr><td>Opens in</td><td>Everything</td><td>Everything</td></tr></tbody
					>
				</table></GuideTable
			>
			<p class="mb-4">
				Two consequences for the files on your disk. First, the <code>.jfif</code> Windows gave you
				is almost always a JFIF-layout file, because web images are, and it carries no camera
				metadata to worry about. Second, a phone photo renamed to <code>.jfif</code> would still be
				an Exif-layout file, GPS and all, and would still open everywhere. The extension says
				nothing about which layout is inside, and neither layout needs a particular extension. If
				you want the metadata gone, that is a re-encode with the metadata stripped, which the
				Mochify tool pages and API do by default; our guide to
				<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
					>the risks in EXIF data</a
				> covers what is in there and who reads it.
			</p>
		</section>
		<section id="fix-jfif-by-platform" class="scroll-mt-24">
			<SectionHeading>How to open or fix a .jfif on Windows, Mac, iPhone and Android</SectionHeading
			>
			<p class="mb-4">
				Any browser opens a <code>.jfif</code> (drag it into a tab), and so do Photos on Windows, Preview
				on a Mac, and every image editor. The fix is only needed when something checks the name. Here
				is the click-by-click route on each platform, rename first and convert second.
			</p>
			<h3>Windows 10 and 11</h3>
			<p class="mb-4">
				Show extensions first, or you will rename a hidden one. In File Explorer open the <strong
					>View</strong
				>
				menu, then <strong>Show</strong>, and tick <strong>File name extensions</strong> (Microsoft
				documents the same steps on its
				<a
					href="https://support.microsoft.com/en-us/windows/common-file-name-extensions-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01"
					target="_blank"
					rel="noopener noreferrer">file extensions page</a
				>; on Windows 10 it is the View tab, then the File name extensions checkbox). Now
				right-click the file, choose <strong>Rename</strong>, change <code>.jfif</code> to
				<code>.jpg</code>, press Enter, and click <strong>Yes</strong> when Windows warns that the file
				might become unusable. It will not; that warning is generic.
			</p>
			<p class="mb-4">
				For a converted copy rather than a rename, open the file in <strong>Paint</strong>, choose
				<strong>File &gt; Save as &gt; JPEG picture</strong>
				(or <strong>PNG picture</strong>), and save. Paint decodes the picture and writes a fresh
				file, so this is a re-encode: the result is a new JPEG at Paint's quality setting, not the
				original bytes.
			</p>
			<h3>Mac</h3>
			<p class="mb-4">
				Select the file in Finder, press Return, and edit the name from <code>.jfif</code> to
				<code>.jpg</code>; confirm <strong>Use .jpg</strong> in the dialog. For a converted copy,
				open it in <strong>Preview</strong>, choose <strong>File &gt; Export</strong>, pick
				<strong>JPEG</strong>
				or <strong>PNG</strong> from the Format menu (Apple's guide lists HEIC, JPEG, JPEG-2000,
				OpenEXR, PDF, PNG and TIFF, and notes "If you choose JPEG or JPEG-2000, you can adjust the
				image's quality"), then <strong>Save</strong> (<a
					href="https://support.apple.com/guide/preview/prvw1012/mac"
					target="_blank"
					rel="noopener noreferrer">Preview User Guide</a
				>). Export is a re-encode, like Paint's Save as.
			</p>
			<h3>iPhone and iPad</h3>
			<p class="mb-4">
				If the file arrived by email, message or download, it is in the <strong>Files</strong> app.
				Touch and hold it, tap <strong>Rename</strong>, change <code>.jfif</code> to
				<code>.jpg</code>, and tap Done. The picture opens from Files either way; it is the apps
				that insist on <code>.jpg</code> that needed the rename. If you cannot find a rename option,
				or you have several files, open the
				<a href="https://mochify.app/solutions/jfif-to-jpg">JFIF to JPG converter</a>
				in Safari, tap the drop zone to pick the files, and save the JPGs that come back to Files or Photos.
				We make no promises about how Photos treats a <code>.jfif</code> by that name, because Apple does
				not document it; the converter route avoids the question.
			</p>
			<h3>Android</h3>
			<p class="mb-4">
				Open your file manager (Files by Google, or the maker's own), find the download, use the
				menu to <strong>Rename</strong>, and change the extension. For several files, or when the
				gallery app will not show them, open the converter page in Chrome and upload from there.
				Gallery and sharing apps differ by maker, so we have not listed per-app steps.
			</p>
			<h3>Any platform: a folder of them</h3>
			<p class="mb-4">
				Drop the lot on the <a href="https://mochify.app/solutions/jfif-to-jpg"
					>JFIF to JPG converter</a
				> (three per batch with no signup; 25 per batch on a Day Pass or any paid plan), or open the Mochify
				web app, drop the files, and type what you want. The Mochify Workflow section below walks through
				it.
			</p>
		</section>
		<section id="stop-windows-saving-jfif" class="scroll-mt-24">
			<SectionHeading>How to stop Windows saving images as .jfif</SectionHeading>
			<p class="mb-4">
				Change the one registry value the browser reads, and every browser on the machine saves <code
					>.jpg</code
				>
				from then on. The value is <code>Extension</code> under
				<code>HKEY_CLASSES_ROOT\MIME\Database\Content Type\image/jpeg</code>, and the fix is to set
				it from <code>.jfif</code> to <code>.jpg</code>. It is the same answer a Microsoft Community
				Support Specialist gave on Microsoft Q&amp;A in
				<a
					href="https://learn.microsoft.com/en-us/answers/a/6812413"
					target="_blank"
					rel="noopener noreferrer">January 2023</a
				>.
			</p>
			<p class="mb-4">
				You do not need this if you only hit a <code>.jfif</code> now and then: rename the file and move
				on. Do it if you save web images often, or if a form you use every day rejects them. Do not do
				it on a work machine you do not administer; ask IT, who may have a policy that sets it.
			</p>
			<h3>The steps</h3>
			<ol class="my-4 list-decimal space-y-3 pl-6">
				<li>
					Back up the registry first: in Registry Editor, <strong>File &gt; Export</strong>, save
					the file somewhere you will find it. Registry edits have no undo.
				</li>
				<li>
					Press <strong>Windows + R</strong>, type <code>regedit</code>, press Enter, and click
					<strong>Yes</strong> on the permission prompt.
				</li>
				<li>
					Paste this into the address bar at the top and press Enter: <code
						>HKEY_CLASSES_ROOT\MIME\Database\Content Type\image/jpeg</code
					>
				</li>
				<li>
					In the right-hand pane, double-click <strong>Extension</strong>. The Value data box reads
					<code>.jfif</code>.
				</li>
				<li>Change it to <code>.jpg</code> and click <strong>OK</strong>.</li>
				<li>
					Close Registry Editor and restart your browser. Microsoft's answer suggests a restart of
					the computer; in our reading of the browser code the value is looked up at download time,
					so a browser restart is usually enough, and a reboot settles it either way.
				</li>
			</ol>
			<h3>Check it worked</h3>
			<p class="mb-4">
				Go back to a page that gave you a <code>.jfif</code> (one whose image address has no
				extension) and save the image again. The dialog should now offer <code>.jpg</code>. Files
				you saved earlier stay <code>.jfif</code>: the fix changes what happens next, not what
				already happened, so rename or convert those.
			</p>
			<h3>If it comes back</h3>
			<p class="mb-4">
				Users have reported the value reverting after some Windows updates, and one Microsoft thread
				blamed a third-party program for resetting it. If <code>.jfif</code> returns, repeat the steps;
				it takes a minute. Keep the exported backup, and if you find a program that keeps resetting it,
				that program's support is the place to report it.
			</p>
		</section>
		<section id="jfif-to-png-pdf" class="scroll-mt-24">
			<SectionHeading>JFIF to PNG, JFIF to PDF, and when a re-encode beats a rename</SectionHeading>
			<p class="mb-4">
				A rename gives you the original bytes under a new name. A conversion gives you a new file,
				and that is the right choice when the target format is not JPEG, when you want the metadata
				gone, or when you want the file smaller. We ran one <code>.jfif</code> through both of Mochify's
				paths to put numbers on it.
			</p>
			<p class="mb-4">
				The test file is a 1600 x 1200 photo-like test image (gradient, fine noise and texture,
				encoded the way a camera JPEG is), 1,186,845 bytes as a JFIF-layout JPEG. Measured on
				November 7, 2026 against <code>api.mochify.app</code>:
			</p>
			<GuideTable class="my-6"
				><table>
					<thead><tr><th>Route</th><th>Result</th><th>Size</th><th>Change</th></tr></thead><tbody
						><tr
							><td>Rename <code>.jfif</code> to <code>.jpg</code></td><td
								>Same bytes, SHA-256 identical</td
							><td>1,186,845 bytes</td><td>0</td></tr
						><tr
							><td
								><a href="https://mochify.app/solutions/jfif-to-jpg">JFIF to JPG</a> (jpegli, quality
								85, metadata stripped)</td
							><td>New JPEG</td><td>965,522 bytes</td><td>18.6% smaller</td></tr
						><tr
							><td
								><a href="https://mochify.app/solutions/jfif-to-png">JFIF to PNG</a> (pixel-exact, metadata
								stripped)</td
							><td>New PNG</td><td>4,630,004 bytes</td><td>3.9x larger</td></tr
						></tbody
					>
				</table></GuideTable
			>
			<p class="mb-4">
				<strong>JFIF to JPG</strong> is a fresh JPEG encode with Google's jpegli encoder at quality
				85, which keeps photos looking the same on screen while usually taking bytes off a file that
				was saved at a high quality setting. A file that was already compressed hard can come back a
				little larger; if you need the exact original bytes, rename instead. The output opens
				everywhere a JPEG does, and the metadata is stripped by default, with a Strip EXIF switch
				after upload if you want it kept. Our guide on
				<a href="https://mochify.app/guides/jpeg-in-2026-jpegli"
					>why jpegli changes the JPEG picture</a
				> has the encoder comparison.
			</p>
			<p class="mb-4">
				<strong>JFIF to PNG</strong> is for the form, template or app that asks for PNG
				specifically, or for a picture you will edit and re-save several times (each JPEG save adds
				a little compression; a PNG adds none). The PNG holds the JFIF's decoded pixels exactly, so
				it looks the same, no better and no worse: the detail JPEG compression already removed does
				not come back, and the file is several times larger because PNG stores every pixel. Graphics
				with flat color grow far less than photos. Two things a PNG does not give you from a JFIF:
				transparency, because a JPEG has none to carry over (if you want the background cut out,
				open the Mochify web app and type "remove the background and convert to PNG"; background
				removal is on every plan, including Free), and a smaller file, which is the JPG's job. Our
				guide to
				<a href="https://mochify.app/guides/lossless-image-formats">lossless image formats</a> covers
				when lossless is the right call and when it is the wrong one.
			</p>
			<p class="mb-4">
				<strong>JFIF to PDF</strong> is the next thing people search for, usually because a form,
				portal or print shop wants one PDF and turns a <code>.jfif</code> away. The
				<a href="https://mochify.app/solutions/jfif-to-pdf">JFIF to PDF converter</a>
				takes the <code>.jfif</code> files directly, with JPG, PNG, WebP, AVIF, HEIC or JXL mixed in
				if you have them, and builds one PDF with a page per image in the order you add them: three
				images per PDF without an account or on a free account, 20 on any paid plan or a Day Pass.
				Each image is re-encoded with jpegli as a baseline JPEG, the kind every PDF reader can show,
				so the pages look the same and print cleanly but are a fresh encode rather than the original
				bytes; pages come out upright, the page fits the image by default with A4 or Letter as
				options for paper, and the PDF carries no metadata. Renaming to <code>.pdf</code> does not
				work, for the same reason renaming to <code>.png</code> does not: the extension is a label, and
				a PDF reader expects PDF bytes.
			</p>
			<p class="mb-4">
				The one you do not need: <strong>JFIF to JPEG</strong>. <code>.jpg</code> and
				<code>.jpeg</code>
				are two spellings of the same extension, and a <code>.jfif</code> is already the same format as
				both. Rename it, or convert it if you want it smaller or cleaner, and ignore any tool that charges
				for the difference.
			</p>
		</section>
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat sheet</SectionHeading>
			<GuideTable class="my-6"
				><table>
					<thead
						><tr><th>You have</th><th>You want</th><th>Do this</th><th>What changes</th></tr></thead
					><tbody
						><tr
							><td>One <code>.jfif</code>, extension visible</td><td>A <code>.jpg</code></td><td
								>Rename it (Windows: View &gt; Show &gt; File name extensions first)</td
							><td>Nothing inside; 0 bytes</td></tr
						><tr
							><td>A <code>.jfif</code> on a phone or locked-down PC</td><td>A <code>.jpg</code></td
							><td
								>Files app &gt; Rename on iPhone; file manager &gt; Rename on Android; or the JFIF
								to JPG converter from the browser</td
							><td>Nothing (rename) or a fresh jpegli JPEG (converter)</td></tr
						><tr
							><td>A folder of <code>.jfif</code> files</td><td><code>.jpg</code> files</td><td
								>Drop them on <a href="https://mochify.app/solutions/jfif-to-jpg">JFIF to JPG</a>,
								or the web app with "convert these to JPG"</td
							><td>Fresh JPEGs at quality 85, metadata stripped by default</td></tr
						><tr
							><td>A <code>.jfif</code> and a form that wants PNG</td><td>A <code>.png</code></td
							><td
								><a href="https://mochify.app/solutions/jfif-to-png">JFIF to PNG</a>, or Paint /
								Preview Save as PNG</td
							><td>Pixel-exact PNG, several times larger, no transparency</td></tr
						><tr
							><td>A <code>.jfif</code> and a form that wants PDF</td><td>A <code>.pdf</code></td
							><td
								><a href="https://mochify.app/solutions/jfif-to-pdf">JFIF to PDF</a>: drop the
								files, one PDF back</td
							><td>One PDF page per image, 3 per PDF free, 20 paid or Day Pass</td></tr
						><tr
							><td>Every download arriving as <code>.jfif</code></td><td>It to stop</td><td
								>Registry: <code>HKEY_CLASSES_ROOT\MIME\Database\Content Type\image/jpeg</code>,
								<code>Extension</code>
								= <code>.jpg</code></td
							><td>New downloads save as <code>.jpg</code>; old files unchanged</td></tr
						><tr
							><td>A <code>.jfif</code> with location data in it</td><td>It gone</td><td
								>Convert (the JFIF tool pages strip metadata by default); a rename keeps it</td
							><td>New file, no EXIF or GPS</td></tr
						></tbody
					>
				</table></GuideTable
			>
			<p class="mb-4">
				The thirty-second version: a JFIF is a JPEG; the name came from one Windows registry value
				your browser consulted; renaming loses nothing; convert when you have many, want them
				smaller, or want the metadata gone.
			</p>
		</section>
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: fix a folder of .jfif files</SectionHeading>
			<GlassPanel
				><ol class="workflow-steps">
					<li>
						<h3>Say what you want</h3>
						<p>
							Open the <a href="https://mochify.app/flow">Mochify web app</a>, drop your
							<code>.jfif</code>
							files on it (the uploader accepts the <code>.jfif</code> extension), and type the
							result in plain English: <code>convert these to JPG and remove the metadata</code>, or
							<code>convert to PNG</code>
							for the form that insists on PNG, or
							<code>JPG, 1600px wide, strip the location data</code> if you want them resized on the way.
							Magic Flow reads the sentence with a language model, then the C++ engine does the work.
						</p>
					</li>
					<li>
						<h3>Or use the one-job page</h3>
						<p>
							For a straight conversion, the <a href="https://mochify.app/solutions/jfif-to-jpg"
								>JFIF to JPG converter</a
							>
							and the <a href="https://mochify.app/solutions/jfif-to-png">JFIF to PNG converter</a>
							are drop-and-download: <code>.jfif</code> in, a jpegli JPG at quality 85 or a pixel-exact
							PNG out, three files per batch with no signup, 25 per batch on a Day Pass or any paid plan.
							A Strip EXIF switch appears after upload, on by default, if you want the metadata kept.
						</p>
					</li>
					<li>
						<h3>From the terminal or an agent</h3>
						<p>
							The same conversion runs from the Mochify CLI (<code
								>mochify *.jfif -p "convert to jpg"</code
							>), from an AI assistant through the hosted MCP server or the local MCP server (<code
								>mochify serve</code
							>), and from the REST API with <code>POST /v1/squish?type=jpg</code> on
							<code>api.mochify.app</code>, authenticated with
							<code>Authorization: Bearer &lt;key&gt;</code>. All four are clients over the same
							API.
						</p>
					</li>
					<li>
						<h3>Saving images from websites often?</h3>
						<p>
							The Mochify Chrome extension's right-click menu has a <strong>Convert to</strong> JPG
							option that saves the image straight to Downloads as a JPG, one image at a time, so
							the <code>.jfif</code> never appears.
						</p>
					</li>
					<li>
						<h3>What happens to your files</h3>
						<p>
							Images travel over HTTPS to <code>api.mochify.app</code>, are converted in memory, and
							are discarded as soon as your download is ready: nothing is written to disk, no logs
							contain your image data, and your images are never used to train AI. That holds for
							the web app, the tool pages, the CLI, both MCP servers and the API (the hosted MCP
							server keeps the converted file behind a short-lived link for about five minutes so
							your assistant can fetch it; the original is still discarded at once).
						</p>
					</li>
				</ol></GlassPanel
			>
			<p class="mt-6 mb-4 text-base leading-relaxed text-cocoa-milk">
				Got one file and a visible extension? Rename it and skip all of this. The workflow is for
				the folder, the phone, the locked-down machine, and the form that wants something a rename
				cannot give.
			</p>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA
			href="/flow"
			label="Open the web app"
			secondaryHref="/solutions/jfif-to-jpg"
			secondaryLabel="JFIF to JPG converter"
		>
			Got a folder of .jfif files? Open the Mochify web app, drop them in and type <em
				>convert these to JPG and remove the metadata</em
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
