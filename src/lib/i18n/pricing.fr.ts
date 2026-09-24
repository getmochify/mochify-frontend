// French pricing copy.
//
// PROVENANCE. The French localisation plan says the devs never write French, and
// this page has no copy sheet: content-ops has written `article-originals/fr/flow.md`
// and nothing for /pricing. This file was drafted dev-side on the operator's
// instruction (2026-09-23) so a French visitor clicking "Tarifs" does not land on
// an English page. It is NOT native-reviewed and NOT through the section 4.1
// claim check. It is nonetheless indexed as of the 2026-09-24 post-launch handoff:
// the operator took the call that a French page findable in French is worth more
// than the review it has not had yet.
//
// Every figure here is the same nominal number as the English page, which is
// correct and not a coincidence: EUR prices sit at nominal parity with USD
// (operator, 2026-09-23).
//
// The Pro-vs-Seller answer used to quote centimes per image, derived from the EUR
// prices. Those were wrong on a GBP render (21,99 £ / 1 200 = 1,8 p, not 2,1
// centimes), so handoff 2026-09-24 Change 5 dropped them. What is left is the
// ratio, which holds in every currency. Do not put per-image figures back unless
// they are computed from the rendered price.
//
// House rules from the pilot plan section 4, applied throughout: no-break space
// before : ; ? !, narrow no-break space as the thousands separator, comma
// decimals, Mo/Ko/Go rather than MB/KB/GB, "25 %" spaced, format and tier names
// left alone, and zero em dashes in any encoding.

import type { PricingStrings } from '$lib/i18n/pricing';

export const FR_PRICING: PricingStrings = {
	eyebrow: 'La boîte à outils image qui vous suit partout',
	h1Before: 'Des tarifs',
	h1Accent: 'simples',
	h1After: 'et honnêtes',
	heroSub:
		'Aucun abonnement pour commencer. Lancez-vous gratuitement, changez de forfait quand vous en avez besoin.',
	surfaces: 'Web · CLI · Extension Chrome · MCP · API',
	billingMonthly: 'Mensuel',
	billingYearly: 'Annuel',
	saveExact: (pct) => `Économisez ${pct} %`,
	saveUpTo: (pct) => `Économisez jusqu'à ${pct} %`,
	mostPopular: 'Le plus choisi',
	perMonth: '/ mois',
	perYear: '/ an',
	perForever: '/ pour toujours',
	oneTime: 'paiement unique',
	or: 'Ou',
	perYearInline: (price) => `${price} / an`,
	billedAnnually: (monthly) => `${monthly} / mois, facturé annuellement`,
	saveParenthetical: (pct) => `(économie de ${pct} %)`,
	percentOff: (pct) => `${pct} % de remise`,
	vsMonthly: 'par rapport au mensuel',
	everythingInSeller: 'Tout Seller, plus :',
	everythingInPro: 'Tout Pro, plus :',
	sellerFeatures: [
		'<strong>300 images</strong> par mois',
		'<strong>75 Mo</strong> par fichier',
		'<strong>25 fichiers</strong> par lot',
		'Outils <strong>PDF</strong> complets',
		'Enregistrement sur <strong>Google Drive</strong> ou votre propre bucket',
		'Traitement <strong>prioritaire</strong>'
	],
	proFeatures: [
		'<strong>1 200 images</strong> par mois',
		"<strong>4 fois plus d'images</strong> pour 3 fois le prix",
		"File d'attente <strong>prioritaire absolue</strong>",
		'Assistance par e-mail prioritaire'
	],
	growthFeatures: [
		'<strong>5 000 images</strong> par mois',
		'<strong>Pages PDF illimitées</strong> <span class="text-[#6C3F31]/50">(10 au maximum ailleurs)</span>',
		'PDF à partir de <strong>200 images</strong>'
	],
	freeFeatures: [
		'<strong>25 images</strong> par mois',
		'<strong>20 Mo</strong> par fichier',
		"Jusqu'à <strong>3 fichiers</strong> par lot",
		'Détourage du fond',
		"File d'attente standard"
	],
	dayPassFeatures: [
		'<strong>100 envois</strong> en 24 heures',
		'<strong>75 Mo</strong> par fichier et des lots plus grands',
		'Sans abonnement, sans compte',
		'Activation immédiate par lien magique'
	],
	ctaSeller: 'Choisir Seller',
	ctaPro: 'Choisir Pro',
	ctaGrowth: 'Choisir Growth',
	ctaFree: 'Commencer gratuitement',
	ctaDayPass: (price) => `Obtenir le Day Pass à ${price}`,
	noSignupLink: '3 images, sans inscription',
	flowHref: '/fr/flow',
	privacyLead: 'Confidentiel par conception.',
	privacyBody:
		'Vos images sont traitées en mémoire, jamais conservées, jamais utilisées pour entraîner une IA.',
	privacyHref: '/privacy',
	learnMore: 'En savoir plus →',
	orNoSubscription: 'Ou, sans abonnement',
	fullComparison: 'Comparatif complet',
	tblFeature: 'Fonctionnalité',
	tblMonthlyImages: 'Images par mois',
	tblMaxFileSize: 'Taille maximale par fichier',
	tblSizeFree: '20 Mo',
	tblSizePaid: '75 Mo',
	tblHeicUpload: 'Envoi de fichiers HEIC',
	tblResizeRotateCrop: 'Redimensionner, pivoter et recadrer',
	tblBackgroundRemoval: 'Détourage du fond',
	tblAiBackgrounds: 'Fonds et ombres par IA',
	tblMcpApi: 'Accès MCP et API',
	tblBatchUpload: 'Envoi par lot',
	tblQueue: "File d'attente",
	tblPdfTools:
		'Outils PDF <span class="text-[#6C3F31]/50 text-xs">(rastérisation, découpage, images→PDF)</span>',
	tblOwnStorage:
		'Enregistrement sur votre propre stockage <span class="text-[#6C3F31]/50 text-xs">(Google Drive, ou S3 / R2 / compatible S3)</span>',
	tblPerMonth: (n) => `${n.toLocaleString('fr-FR')} / mois`,
	tblFiles: (n) => `${n} fichiers`,
	tblQueueStandard: 'Standard',
	tblQueuePriority: 'Prioritaire',
	tblQueueTop: 'Prioritaire absolue',
	tblSoon: 'Bientôt',
	tblNotIncluded: 'non',
	tblPdfFree: 'images→PDF, 3 pages',
	tblPdfUnlimited: '✓ pages illimitées',
	faqHeading: 'Questions fréquentes',
	faqSub: 'Limites, facturation, et ce qui change quand vous changez de forfait.',
	faqs: (dayPassPrice) => [
		{
			q: "Qu'est-ce qui compte pour une image ?",
			a: 'Chaque image que nous vous renvoyons est décomptée de votre quota mensuel. Compresser, convertir, redimensionner, ou toute combinaison de ces opérations sur un même fichier, compte pour une image. Demander plusieurs formats ou plusieurs tailles du même fichier renvoie plusieurs images, et chacune compte : WebP et AVIF en deux largeurs font quatre. Les envois par lot comptent une image par fichier.'
		},
		{
			q: 'Les images non utilisées sont-elles reportées ?',
			a: 'Non. Le forfait gratuit se réinitialise sur un cycle glissant de 30 jours à partir de votre première utilisation ; Seller, Pro et Growth se réinitialisent à votre date de facturation. Les images non utilisées ne sont pas reportées.'
		},
		{
			q: 'Pro vaut-il le coup par rapport à Seller ?',
			a: "Cela dépend du volume. Pro donne quatre fois plus d'images pour un peu plus de trois fois le prix, soit environ 22 % de moins par image, en mensuel comme en annuel. Pro place aussi vos fichiers en tête de la file d'attente et donne droit à une assistance par e-mail prioritaire. Si vous restez confortablement sous 300 images par mois, Seller est le meilleur choix."
		},
		{
			q: "Puis-je utiliser l'API avec le forfait gratuit ?",
			a: "Oui : tous les forfaits donnent un accès complet à MCP et à l'API. La même limite mensuelle s'applique."
		},
		{
			q: 'Comment fonctionne le Day Pass ?',
			a: `Payez ${dayPassPrice} et nous vous envoyons un lien magique par e-mail : cliquez dessus pour débloquer 100 envois d'images en 24 heures, des fichiers de 75 Mo et des lots plus grands pendant 24 heures. Aucun compte ni abonnement nécessaire.`
		},
		{
			q: 'Puis-je annuler à tout moment ?',
			a: "Oui. Annulez à tout moment et vous conservez l'accès jusqu'à la fin de votre période de facturation."
		}
	],
	ctaHeading: 'Commencez gratuitement, changez de forfait quand vous le dépassez',
	ctaBody:
		'25 images par mois sur le forfait gratuit, sans carte bancaire. Accès MCP, CLI et API sur tous les forfaits, y compris le gratuit.',
	ctaCreateAccount: 'Créer un compte gratuit →',
	ctaTryFree: 'Essayer 3 images, sans inscription',
	ctaContactBefore: 'Vous hésitez encore sur le forfait ? Écrivez à',
	ctaContactAfter: '.',
	metaTitle: 'Tarifs | Mochify',
	metaDescription:
		'Des tarifs simples. 3 images gratuites sans inscription, ou 25 par mois avec un compte gratuit. Seller pour 300 images, Pro pour 1 200, Growth pour 5 000. Ou un Day Pass à 2 € pour 100 envois en 24 heures, sans abonnement.',
	schemaUrl: 'https://mochify.app/fr/pricing',
	schemaDescription:
		'Des tarifs simples. 3 images gratuites sans inscription, ou 25 par mois avec un compte gratuit. Seller pour 300 images, Pro pour 1 200, Growth pour 5 000 images par mois.',
	schemaOffers: [
		{
			plan: null,
			name: 'Free',
			description: () =>
				"3 images gratuites sans compte. Créez un compte gratuit pour 25 images par mois. Tous les formats, redimensionnement, rotation, recadrage, détourage du fond, accès MCP et API inclus. File d'attente standard."
		},
		{
			plan: 'sellerMonthly',
			name: 'Seller mensuel',
			unitCode: 'MON',
			description: () =>
				"300 images par mois. Tous les formats, redimensionnement, rotation, recadrage, détourage du fond, accès MCP et API inclus. Jusqu'à 75 Mo par fichier. File d'attente prioritaire."
		},
		{
			plan: 'proMonthly',
			name: 'Pro mensuel',
			unitCode: 'MON',
			description: () =>
				"1 200 images par mois. Tous les formats, redimensionnement, rotation, recadrage, détourage du fond, accès MCP et API inclus. Jusqu'à 75 Mo par fichier. File d'attente prioritaire absolue."
		},
		{
			plan: 'growthMonthly',
			name: 'Growth mensuel',
			unitCode: 'MON',
			description: () =>
				"5 000 images par mois. Tout Pro, plus les pages PDF illimitées et les PDF construits à partir de 200 images. Enregistrement des résultats sur votre propre bucket ou sur Google Drive. File d'attente prioritaire absolue."
		},
		{
			plan: 'sellerYearly',
			name: 'Seller annuel',
			unitCode: 'ANN',
			description: (price) =>
				`300 images par mois, facturées ${price('sellerYearly')} par an. Détourage du fond inclus. Jusqu'à 75 Mo par fichier. File d'attente prioritaire.`
		},
		{
			plan: 'proYearly',
			name: 'Pro annuel',
			unitCode: 'ANN',
			description: (price) =>
				`1 200 images par mois, facturées ${price('proYearly')} par an. Détourage du fond inclus. Jusqu'à 75 Mo par fichier. File d'attente prioritaire absolue.`
		},
		{
			plan: 'growthYearly',
			name: 'Growth annuel',
			unitCode: 'ANN',
			description: (price) =>
				`5 000 images par mois, facturées ${price('growthYearly')} par an. Pages PDF illimitées. File d'attente prioritaire absolue.`
		},
		{
			plan: 'dayPass',
			name: 'Day Pass',
			description: () =>
				"Pass de 24 heures, paiement unique. Jusqu'à 100 envois d'images, des fichiers jusqu'à 75 Mo, des lots plus grands. Sans abonnement ni compte, activé immédiatement par lien magique."
		}
	]
};
