// Shared shape for the tool-page FAQ accordions.
//
// An answer is either a plain string or a list of parts, so a link can sit
// mid-sentence without the page hand-rolling its own markup. The same array
// feeds both the visible accordion and the FAQPage JSON-LD: `faqPlainText`
// flattens the parts back to the text the schema must carry, which is what
// keeps the two from drifting apart (the reason the pre-2026-09 pages shipped
// questions to crawlers with answers that no longer matched).
export type FaqLink = { href: string; label: string };
export type FaqPart = string | FaqLink;
export type FaqItem = { q: string; a: string | FaqPart[] };

export const faqParts = (a: FaqItem['a']): FaqPart[] => (typeof a === 'string' ? [a] : a);

export const faqPlainText = (a: FaqItem['a']): string =>
	faqParts(a)
		.map((part) => (typeof part === 'string' ? part : part.label))
		.join('');

/** FAQPage `mainEntity` built from the same array the page renders. */
export const faqSchema = (faqs: FaqItem[]) =>
	faqs.map((faq) => ({
		'@type': 'Question',
		name: faq.q,
		acceptedAnswer: { '@type': 'Answer', text: faqPlainText(faq.a) }
	}));
