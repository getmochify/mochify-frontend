// The pricing page's copy, so /pricing and /fr/pricing can be one component
// instead of two pages that drift (see PricingPage.svelte, and CLAUDE.md on why
// PromptFormApp was un-forked).
//
// Feature bullets and two table labels carry <strong> mid-sentence, so they are
// authored HTML rendered with {@html} — the same footing as StepList's step
// bodies and FaqAccordion's answers: copy we write, never user input.
//
// Tier names (Free, Seller, Pro, Growth, Day Pass) and format names are product
// nouns and are NOT in here: they read the same in every locale.

export type PricingStrings = {
	eyebrow: string;
	h1Before: string;
	h1Accent: string;
	h1After: string;
	heroSub: string;
	surfaces: string;
	billingMonthly: string;
	billingYearly: string;
	save: string;
	upTo: string;
	mostPopular: string;
	perMonth: string;
	perYear: string;
	perForever: string;
	oneTime: string;
	or: string;
	perYearInline: (price: string) => string;
	billedAnnually: (monthly: string) => string;
	saveParenthetical: (pct: number) => string;
	percentOff: (pct: number) => string;
	vsMonthly: string;
	everythingInSeller: string;
	everythingInPro: string;
	sellerFeatures: string[];
	proFeatures: string[];
	growthFeatures: string[];
	freeFeatures: string[];
	dayPassFeatures: string[];
	ctaSeller: string;
	ctaPro: string;
	ctaGrowth: string;
	ctaFree: string;
	ctaDayPass: (price: string) => string;
	noSignupLink: string;
	flowHref: string;
	privacyLead: string;
	privacyBody: string;
	privacyHref: string;
	learnMore: string;
	orNoSubscription: string;
	fullComparison: string;
	tblFeature: string;
	tblMonthlyImages: string;
	tblMaxFileSize: string;
	tblHeicUpload: string;
	tblResizeRotateCrop: string;
	tblBackgroundRemoval: string;
	tblAiBackgrounds: string;
	tblMcpApi: string;
	tblBatchUpload: string;
	tblQueue: string;
	tblPdfTools: string;
	tblOwnStorage: string;
	tblPerMonth: (n: number) => string;
	tblFiles: (n: number) => string;
	tblQueueStandard: string;
	tblQueuePriority: string;
	tblQueueTop: string;
	tblSoon: string;
	/** The 'not on this plan' cell. */
	tblNotIncluded: string;
	tblPdfFree: string;
	tblPdfUnlimited: string;
	faqHeading: string;
	faqSub: string;
	faqs: (dayPassPrice: string) => { q: string; a: string }[];
	ctaHeading: string;
	ctaBody: string;
	ctaCreateAccount: string;
	ctaTryFree: string;
	ctaContactBefore: string;
	ctaContactAfter: string;
	/** Head of the route that renders this page. */
	metaTitle: string;
	metaDescription: string;
};

export const EN_PRICING: PricingStrings = {
	eyebrow: 'The image toolkit that works where you work',
	h1Before: 'Simple,',
	h1Accent: 'honest',
	h1After: 'pricing',
	heroSub: 'No subscriptions required to get started. Jump in free, upgrade when you need more.',
	surfaces: 'Web · CLI · Chrome extension · MCP · API',
	billingMonthly: 'Monthly',
	billingYearly: 'Yearly',
	save: 'Save',
	upTo: 'up to ',
	mostPopular: 'Most popular',
	perMonth: '/ month',
	perYear: '/ year',
	perForever: '/ forever',
	oneTime: 'one-time',
	or: 'Or',
	perYearInline: (price) => `${price} / year`,
	billedAnnually: (monthly) => `${monthly} / mo, billed annually`,
	saveParenthetical: (pct) => `(save ${pct}%)`,
	percentOff: (pct) => `${pct}% off`,
	vsMonthly: 'vs monthly',
	everythingInSeller: 'Everything in Seller, plus:',
	everythingInPro: 'Everything in Pro, plus:',
	sellerFeatures: [
		'<strong>300 images</strong> per month',
		'<strong>75MB</strong> max file size',
		'<strong>25 files</strong> per batch',
		'Full <strong>PDF tools</strong>',
		'Save to <strong>Google Drive</strong> or your own bucket',
		'<strong>Priority</strong> processing'
	],
	proFeatures: [
		'<strong>1,200 images</strong> per month',
		'<strong>4x the images</strong> for 3x the price',
		'<strong>Top priority</strong> queue',
		'Priority email support'
	],
	growthFeatures: [
		'<strong>5,000 images</strong> per month',
		'<strong>Unlimited PDF pages</strong> <span class="text-[#6C3F31]/50">(others cap at 10)</span>',
		'Build PDFs from <strong>200 images</strong>'
	],
	freeFeatures: [
		'<strong>25 images</strong> per month',
		'<strong>20MB</strong> max file size',
		'Up to <strong>3 files</strong> per batch',
		'Background removal',
		'Standard queue'
	],
	dayPassFeatures: [
		'<strong>100 uploads</strong> within 24 hours',
		'<strong>75MB</strong> per file &amp; larger batches',
		'No subscription, no account needed',
		'Activated instantly by magic link'
	],
	ctaSeller: 'Get Seller',
	ctaPro: 'Get Pro',
	ctaGrowth: 'Get Growth',
	ctaFree: 'Start for free',
	ctaDayPass: (price) => `Get Day Pass — ${price}`,
	noSignupLink: '3 images, no sign-up',
	flowHref: '/flow',
	privacyLead: 'Private by design.',
	privacyBody: 'Your images are processed in memory and never stored, or used to train AI.',
	privacyHref: '/privacy',
	learnMore: 'Learn more →',
	orNoSubscription: 'Or, no subscription',
	fullComparison: 'Full comparison',
	tblFeature: 'Feature',
	tblMonthlyImages: 'Monthly images',
	tblMaxFileSize: 'Max file size',
	tblHeicUpload: 'HEIC upload',
	tblResizeRotateCrop: 'Resize, rotate & crop',
	tblBackgroundRemoval: 'Background removal',
	tblAiBackgrounds: 'AI backgrounds & shadows',
	tblMcpApi: 'MCP & API access',
	tblBatchUpload: 'Batch upload',
	tblQueue: 'Processing queue',
	tblPdfTools:
		'PDF tools <span class="text-[#6C3F31]/50 text-xs">(rasterize, split, images→PDF)</span>',
	tblOwnStorage:
		'Save to your own storage <span class="text-[#6C3F31]/50 text-xs">(Google Drive, or S3 / R2 / S3-compatible)</span>',
	tblPerMonth: (n) => `${n.toLocaleString('en-US')} / month`,
	tblFiles: (n) => `${n} files`,
	tblQueueStandard: 'Standard',
	tblQueuePriority: 'Priority',
	tblQueueTop: 'Top priority',
	tblSoon: 'Soon',
	// An em dash, which is what this page has always rendered here. content-ops
	// proposed swapping it for 'n/a' (handoff spec Appendix B-4) so a whole-page
	// em-dash scan means something, and nobody objected, but it was never
	// applied. Left as it is rather than changed unasked; the French set carries
	// a word instead, so the new page ships clean either way.
	tblNotIncluded: '—',
	tblPdfFree: 'images→PDF, 3 pages',
	tblPdfUnlimited: '✓ unlimited pages',
	faqHeading: 'Common questions',
	faqSub: 'Limits, billing, and what changes when you upgrade.',
	faqs: (dayPassPrice) => [
		{
			q: 'What counts as one image?',
			a: 'Each image we hand back uses one from your monthly allowance. Compressing, converting, resizing, or any combination of those on a single file is one image. Asking for several formats or sizes of the same file returns several images, so each one counts: WebP and AVIF at two widths is four. Batch uploads count one per file.'
		},
		{
			q: 'Do unused images roll over?',
			a: 'No. Free resets on a rolling 30-day cycle from when you start using it; Seller and Pro reset on your billing date. Unused images do not roll over.'
		},
		{
			q: 'Is Pro worth it over Seller?',
			a: 'It depends on volume. Pro gives you four times the images for a little over three times the price, so each image works out around 22% cheaper: about 2.1¢ on Pro versus 2.7¢ on Seller, or 1.7¢ versus 2.2¢ on annual billing. Pro also puts you at the front of the processing queue and gets priority email support. If you are comfortably inside 300 images a month, Seller is the better buy.'
		},
		{
			q: 'Can I use the API on the free tier?',
			a: 'Yes — all tiers have full MCP and API access. The same monthly limit applies.'
		},
		{
			q: 'How does the Day Pass work?',
			a: `Pay ${dayPassPrice} and we email you a magic link — click it to unlock 100 image uploads within 24 hours, 75MB files and larger batches for 24 hours. No account or subscription needed.`
		},
		{
			q: 'Can I cancel anytime?',
			a: 'Yes. Cancel any time and you keep access until the end of your billing period.'
		}
	],
	ctaHeading: 'Start free, upgrade when you outgrow it',
	ctaBody:
		'25 images a month on the free plan, no card needed. MCP, CLI and API access on every tier, free included.',
	ctaCreateAccount: 'Create a free account →',
	ctaTryFree: 'Try 3 images, no sign-up',
	ctaContactBefore: 'Still not sure which plan fits? Email',
	ctaContactAfter: '.',
	metaTitle: 'Pricing — Mochify',
	metaDescription:
		'Simple, transparent pricing. Try 3 images free without signing up, or create a free account for 25 images/month. Upgrade to Seller for 300, Pro for 1,200 or Growth for 5,000 images a month. Or grab a $2 Day Pass — upload up to 100 images in 24 hours, no subscription.'
};
