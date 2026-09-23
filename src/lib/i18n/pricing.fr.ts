// French pricing copy.
//
// PROVENANCE. The French localisation plan says the devs never write French, and
// this page has no copy sheet: content-ops has written `article-originals/fr/flow.md`
// and nothing for /pricing. This file was drafted dev-side on the operator's
// instruction (2026-09-23) so a French visitor clicking "Tarifs" does not land on
// an English page. It is NOT native-reviewed and NOT through the section 4.1
// claim check. `/fr/pricing` is noindex until content-ops verifies it.
//
// Every figure here is the same nominal number as the English page, which is
// correct and not a coincidence: EUR prices sit at nominal parity with USD
// (operator, 2026-09-23), so the per-image arithmetic in the Pro-vs-Seller answer
// carries over unchanged. It would NOT carry over to GBP, where Pro's annual
// discount is 18% against the 22% quoted. Re-derive before adding a third currency.
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
	save: 'Économisez',
	upTo: "jusqu'à ",
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
		'<strong>75 Mo</strong> par fichier',
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
		'<strong>20 Mo</strong> par fichier',
		"Jusqu'à <strong>3 fichiers</strong> par lot",
		'Détourage du fond',
		"File d'attente standard"
	],
	dayPassFeatures: [
		'<strong>100 envois</strong> en 24 heures',
		'<strong>75 Mo</strong> par fichier et des lots plus grands',
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
			a: 'Non. Le forfait gratuit se réinitialise sur un cycle glissant de 30 jours à partir de votre première utilisation ; Seller et Pro se réinitialisent à votre date de facturation. Les images non utilisées ne sont pas reportées.'
		},
		{
			q: 'Pro vaut-il le coup par rapport à Seller ?',
			a: "Cela dépend du volume. Pro donne quatre fois plus d'images pour un peu plus de trois fois le prix, soit environ 22 % de moins par image : environ 2,1 centimes sur Pro contre 2,7 centimes sur Seller, ou 1,7 contre 2,2 centimes en facturation annuelle. Pro place aussi vos fichiers en tête de la file d'attente et donne droit à une assistance par e-mail prioritaire. Si vous restez confortablement sous 300 images par mois, Seller est le meilleur choix."
		},
		{
			q: "Puis-je utiliser l'API avec le forfait gratuit ?",
			a: "Oui : tous les forfaits donnent un accès complet à MCP et à l'API. La même limite mensuelle s'applique."
		},
		{
			q: 'Comment fonctionne le Day Pass ?',
			a: `Payez ${dayPassPrice} et nous vous envoyons un lien magique par e-mail : cliquez dessus pour débloquer 100 envois d'images en 24 heures, des fichiers de 75 Mo et des lots plus grands pendant 24 heures. Aucun compte ni abonnement nécessaire.`
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
		'Des tarifs simples. 3 images gratuites sans inscription, ou 25 par mois avec un compte gratuit. Seller pour 300 images, Pro pour 1 200, Growth pour 5 000. Ou un Day Pass à 2 € pour 100 envois en 24 heures, sans abonnement.'
};
