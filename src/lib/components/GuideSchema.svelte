<script>
	// The JSON-LD every guide emits, in the shape of the handoff spec v1 (§2.2):
	// Article (when `article` is passed), BreadcrumbList (Home -> Guides -> page)
	// and WebPage. Legacy guides whose Article is hand-written (TechArticle,
	// HowTo steps) omit `article` and keep their own block, which must not
	// carry `breadcrumb` - schema.org defines it on WebPage only.
	// `dateModified` falls back to `datePublished`, so a guide that has never
	// been updated still emits both dates.
	// Content-ops handoff: dev-handoffs/2026-10-21-guides-structured-data.md.

	/**
	 * @type {{
	 *   name: string,
	 *   url: string,
	 *   description: string,
	 *   datePublished: string,
	 *   dateModified?: string | null,
	 *   article?: { about: string[], keywords: string }
	 * }}
	 */
	let { name, url, description, datePublished, dateModified = null, article } = $props();

	const modified = $derived(dateModified ?? datePublished);
	const website = { '@type': 'WebSite', name: 'Mochify', url: 'https://mochify.app' };

	const articleLd = $derived(
		article && {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: name,
			description,
			url,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			datePublished,
			dateModified: modified,
			inLanguage: 'en',
			author: {
				'@type': 'Organization',
				name: 'Mochify Engineering Team',
				url: 'https://mochify.app'
			},
			publisher: {
				'@type': 'Organization',
				name: 'Mochify',
				url: 'https://mochify.app',
				logo: { '@type': 'ImageObject', url: 'https://mochify.app/logo.png' },
				sameAs: ['https://github.com/getmochify']
			},
			isPartOf: website,
			about: article.about.map((thing) => ({ '@type': 'Thing', name: thing })),
			keywords: article.keywords,
			speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.article-intro', 'h1'] }
		}
	);

	const breadcrumbLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app/' },
			{ '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://mochify.app/guides' },
			{ '@type': 'ListItem', position: 3, name, item: url }
		]
	});

	const webPageLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name,
		url,
		description,
		isPartOf: website,
		datePublished,
		dateModified: modified
	});

	/** @param {object} data */
	const ld = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
</script>

<svelte:head>
	{#if articleLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
		{@html `<script type="application/ld+json">${ld(articleLd)}<\/script>`}
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(breadcrumbLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(webPageLd)}<\/script>`}
</svelte:head>
