// French copy for /fr/flow, extracted verbatim from the content-ops copy sheet
// (`article-originals/fr/flow.md`, drafted 2026-09-23) and checked character for
// character against it, including the no-break space before `:` and the narrow
// no-break space inside `1 200 px`.
//
// DO NOT edit the French here. The copy sheet is the source of record; a change
// arrives as a handoff and is re-extracted. Native review happens on the live
// page after launch (strategy/2026-09-23-fr-localisation-pilot.md).
//
// No language claim appears anywhere on the page: the Magic Flow parse test
// (handoff Part B) has not run, so the page shows French examples and never
// says the parser understands French.

import { EN_PROMPT_FORM_STRINGS, type PromptFormStrings } from '$lib/i18n/promptForm';

export type FrSectionBlock = { type: 'p' | 'prompt'; text: string };
export type FrSection = { id: string; heading: string; blocks: FrSectionBlock[] };
export type FrFaq = { q: string; a: string };

export const frFlowMeta = {
	title: 'Compresser une image en ligne, gratuit | Mochify',
	metaDescription:
		'Compressez, redimensionnez ou convertissez un HEIC en JPG en décrivant ce que vous voulez : poids, fond blanc ou transparent. Gratuit, sans inscription.',
	ogTitle: 'Compresser une image en ligne, gratuit',
	ogDescription:
		"Décrivez ce que vous voulez : compresser, redimensionner, convertir un HEIC en JPG, enlever le fond. Mochify s'en charge, gratuitement et sans inscription."
} as const;

export const frFlowTool = {
	h1: 'Compresser une image en ligne, gratuit : décrivez le résultat que vous voulez',
	subtitle:
		"Déposez vos images ou PDF, décrivez le résultat voulu en une phrase, Mochify s'occupe du reste.",
	uploadButton: 'Ajouter des images, des PDF ou des vidéos',
	placeholder: 'Ex. : redimensionner à 1 500 px de large et convertir en WebP',
	defaultPrompt: 'Compresser en WebP, 1 200 px de large',
	badgeLine: 'Zéro rétention · 25 gratuites / mois · AVIF · JPEG XL · WebP · PDF · WebM',
	examples: [
		'Compresser en JPG pour le web',
		'Redimensionner à 1 000 px de large',
		'Compresser en JPG pour un envoi par e-mail',
		'Convertir ce HEIC en JPG',
		'Détourer avec un fond transparent en PNG',
		'Remplacer le fond par du blanc',
		'Recadrer en carré pour une annonce en ligne'
	],
	errors: {
		parse: "Nous n'avons pas bien compris la demande : réessayez, ou reformulez et renvoyez-la.",
		connection:
			'Connexion perdue pendant le traitement de [nom du fichier] : vérifiez votre connexion internet et réessayez.',
		server: 'Une erreur est survenue de notre côté. Veuillez réessayer dans un instant.'
	}
} as const;

// The sheet lists eight chips. The first six are prompt chips; the last two are
// the component's own "Convert to…" and "Rotate…" expanders, which open a menu
// rather than loading a prompt, so they are labelled separately.
export const frFlowChips = [
	'Enlever le fond',
	'eBay',
	'Vinted',
	'Recadrer en carré',
	'PageSpeed',
	'En PDF'
] as const;

// The prompts the six chips write into the box.
//
// PROVENANCE, because this is the one place on the page the copy sheet does not
// cover: the sheet lists the six chip LABELS and not the prompts behind them, so
// these were drafted dev-side on the operator's instruction (2026-09-23) to keep
// the French chips working like the English ones, rather than leaving them off.
// They are NOT native-reviewed and they are not in the sheet. Content-ops should
// take or replace them, after which they move up into frFlowChips with the rest.
//
// Two rules were followed rather than writing freely. The vocabulary is the
// sheet's own ("detourer", "recadrer en carre", "compresser", "convertir en"),
// and each prompt keeps the shape of a prompt the parse test already scores
// (fr-06, fr-07), so a chip cannot ask for something the test has not measured.
// Each one reuses its own chip label as the verb, so the chip and the prompt it
// writes cannot drift apart.
export const frFlowChipPrompts: readonly string[] = [
	'Enlever le fond et convertir en PNG',
	'Optimiser pour eBay : recadrer en carré et convertir en JPG',
	'Optimiser pour Vinted : recadrer en carré et compresser',
	'Recadrer en carré en centrant le sujet',
	'Convertir en WebP et compresser pour accélérer le chargement',
	'Regrouper en un seul PDF'
];

export const frFlowExpanders = {
	convertTo: 'Convertir en…',
	rotate: 'Pivoter…'
} as const;

export const frFlowSections: FrSection[] = [
	{
		id: 'compresser-une-image-poids-du-fichier',
		heading: 'Compresser une image (poids du fichier)',
		blocks: [
			{
				type: 'p',
				text: "La compression réduit le poids d'un fichier image sans changer sa taille en pixels. Elle limite le temps de chargement d'une page, l'espace de stockage utilisé sur un téléphone ou un site, et la bande passante consommée à l'envoi. Pour un JPG, Mochify encode avec jpegli, un encodeur qui conserve une meilleure qualité visuelle à poids égal qu'un encodeur JPG classique. Pour le web, WebP et AVIF vont plus loin : à qualité perçue comparable, ils produisent des fichiers nettement plus légers qu'un JPG, ce qui profite directement à la vitesse de chargement d'une page et, indirectement, à son référencement. Le PNG, lui, reste le bon choix quand la transparence ou des traits nets (texte, logos, captures) comptent plus que le poids. L'idée reste la même dans tous les cas : on décrit le résultat voulu en une phrase, sans choisir soi-même un format ou un niveau de compression, et Mochify sélectionne l'encodeur et les réglages adaptés à ce résultat."
			},
			{ type: 'prompt', text: 'Compresser cette image en JPG' }
		]
	},
	{
		id: 'reduire-la-taille-en-pixels-ou-en-mo',
		heading: 'Réduire la taille : en pixels ou en Mo ?',
		blocks: [
			{
				type: 'p',
				text: "C'est la confusion la plus fréquente. « Réduire la taille » d'une image peut vouloir dire deux choses différentes : réduire ses dimensions, c'est-à-dire sa largeur et sa hauteur en pixels, ou réduire son poids, c'est-à-dire l'espace qu'elle occupe sur le disque, en Mo. Les deux sont liés, mais pas de la même façon : diminuer la largeur en pixels est ce qui fait le plus baisser le poids du fichier, bien davantage qu'un simple réglage de compression appliqué à une image gardée à sa taille d'origine. Une photo de smartphone à 4 000 px de large pèsera nettement plus, une fois compressée, que la même photo ramenée à 1 200 px avant compression, même avec le même réglage de qualité. Autrement dit, la largeur en pixels est le premier levier à actionner, la compression vient ensuite. Pour chaque besoin, un prompt différent :"
			},
			{ type: 'prompt', text: 'Redimensionner à 1 200 px de large' },
			{ type: 'prompt', text: 'Compresser cette image en gardant sa largeur actuelle' }
		]
	},
	{
		id: 'redimensionner-une-image',
		heading: 'Redimensionner une image',
		blocks: [
			{
				type: 'p',
				text: "Redimensionner change les dimensions en pixels d'une image tout en gardant ses proportions : la largeur et la hauteur varient dans la même proportion, et l'image entière reste visible, sans qu'aucune partie ne soit retirée. C'est différent de recadrer, qui retire une partie de l'image pour changer son cadrage ou obtenir un format précis, par exemple un carré pour une vignette ou une annonce. Dans un prompt, ce sont deux mots différents : « redimensionner » garde tout le contenu, « recadrer » en enlève une partie. Pour réduire la taille sans rien couper, il suffit d'indiquer une largeur (ou une hauteur) : Mochify garde les proportions."
			},
			{
				type: 'p',
				text: "La question des centimètres revient souvent, en particulier pour l'impression. Un écran affiche des pixels, pas des centimètres : la correspondance entre les deux dépend de la résolution d'impression choisie, en DPI, qui varie selon l'imprimante et le support de tirage utilisé. Pour rester fiable quel que soit l'usage final, à l'écran comme à l'impression, Mochify travaille en pixels plutôt qu'en centimètres."
			},
			{ type: 'prompt', text: 'Redimensionner à 1 200 px de large' }
		]
	},
	{
		id: 'convertir-heic-en-jpg',
		heading: 'Convertir HEIC en JPG',
		blocks: [
			{
				type: 'p',
				text: "HEIC est le format d'image utilisé par défaut sur iPhone depuis plusieurs générations d'iOS : Apple l'a choisi parce qu'il compresse mieux qu'un JPG à qualité équivalente, ce qui économise de l'espace de stockage sur l'appareil et dans iCloud. Un fichier .HEIC n'est toutefois pas un fichier .HIF : le .HIF est l'extension utilisée par les appareils photo Canon, Sony et Fujifilm, dans un flux de travail de photographe, pas de téléphone. Mochify accepte les deux, mais les deux usages ne se confondent pas."
			},
			{
				type: 'p',
				text: "Pour convertir un ou plusieurs HEIC en JPG, il suffit de décrire l'opération :"
			},
			{ type: 'prompt', text: 'Convertir ce HEIC en JPG' },
			{
				type: 'p',
				text: "Trois questions reviennent souvent à propos de l'iPhone. Pourquoi les photos sont-elles en HEIC ? C'est le réglage par défaut d'iOS, choisi par Apple pour son meilleur taux de compression à qualité équivalente. Comment empêcher le téléphone d'utiliser ce format ? Dans Réglages, puis Appareil photo, puis Formats, il faut sélectionner Le plus compatible, ce qui bascule l'iPhone sur JPEG pour les prochaines photos. Comment envoyer une photo HEIC au format JPG sans changer ce réglage ? Mochify convertit le fichier directement, sans toucher à la configuration du téléphone ni aux photos déjà prises."
			}
		]
	},
	{
		id: 'enlever-le-fond-d-une-image',
		heading: "Enlever le fond d'une image",
		blocks: [
			{
				type: 'p',
				text: "Mochify détoure le sujet d'une image et propose deux résultats au choix : un fond transparent, en PNG, ou un fond blanc uni. Cette fonction est disponible sur tous les forfaits, y compris le compte gratuit, sans système de crédits : il suffit de le demander dans le prompt, en une phrase, comme pour n'importe quelle autre opération."
			},
			{
				type: 'p',
				text: "À titre de comparaison, remove.bg, un service concurrent bien connu, indique sur son propre site offrir un crédit gratuit à l'inscription et annonce une transition vers Canva au 1er décembre 2026 (relevé sur son site en septembre 2026)."
			},
			{ type: 'prompt', text: 'Détourer le sujet et remplacer le fond par du blanc' }
		]
	},
	{
		id: 'formats-et-qualite',
		heading: 'Formats et qualité',
		blocks: [
			{
				type: 'p',
				text: "En entrée, Mochify accepte JPG, PNG, WebP, AVIF, HEIC/HEIF/HIF, JPEG XL, GIF (la première image de l'animation) et SVG. Les formats TIFF, BMP, RAW et PSD ne sont pas pris en charge. En sortie, un même prompt peut demander plusieurs formats ou plusieurs largeurs à la fois, par exemple WebP et AVIF en deux tailles différentes en une seule opération, ce qui évite de refaire la demande pour chaque variante."
			},
			{
				type: 'p',
				text: "Pour un propriétaire de site, JPEG XL et AVIF valent le détour : à qualité équivalente, ils produisent des fichiers plus légers qu'un JPG ou un PNG classique, ce qui aide directement les temps de chargement et les métriques de performance d'une page, en particulier sur mobile."
			},
			{
				type: 'p',
				text: "Magic Flow existe aussi dans l'extension Chrome, en ligne de commande et via MCP."
			},
			{ type: 'prompt', text: 'Convertir en AVIF et WebP, 1 200 px et 600 px de large' }
		]
	},
	{
		id: 'confidentialite',
		heading: 'Confidentialité',
		blocks: [
			{
				type: 'p',
				text: 'Les images et les PDF envoyés à Mochify sont transmis aux serveurs de Mochify (api.mochify.app), traités en mémoire, jamais écrits sur disque, jamais conservés et jamais utilisés pour entraîner une IA.'
			}
		]
	}
];

export const frFlowFaqs: FrFaq[] = [
	{
		q: 'Comment redimensionner une image ?',
		a: "Dans Magic Flow, décrivez le résultat voulu en une phrase, par exemple « redimensionner à 1 200 px de large ». Mochify lit la demande, calcule les nouvelles dimensions en gardant les proportions par défaut, et applique le changement. Aucun réglage à chercher dans un menu : la largeur, ou la hauteur, en pixels suffit pour lancer l'opération."
	},
	{
		q: 'Comment puis-je redimensionner une image sans la couper ?',
		a: "Indiquez seulement une largeur, ou seulement une hauteur, par exemple « redimensionner à 1 200 px de large » : Mochify ajuste l'autre dimension dans la même proportion, sans retirer aucune partie de l'image. C'est la différence entre redimensionner, qui garde tout le contenu, et recadrer, qui en enlève une partie pour changer le cadrage."
	},
	{
		q: 'Comment puis-je redimensionner gratuitement une image en centimètres ?',
		a: "Un écran ou un fichier image se mesure en pixels, pas en centimètres : la conversion dépend de la résolution d'impression, en DPI, choisie pour l'imprimante ou le support, qui varie d'un cas à l'autre. Pour un résultat fiable, indiquez la largeur voulue en pixels dans le prompt ; c'est gratuit sur le compte gratuit, jusqu'à 25 images par mois."
	},
	{
		q: "Comment modifier un format d'image ?",
		a: "Décrivez le format de départ et celui d'arrivée dans le prompt, par exemple « convertir en WebP ». Mochify accepte JPG, PNG, WebP, AVIF, HEIC/HEIF/HIF, JPEG XL, GIF et SVG en entrée, et peut produire plusieurs formats de sortie en une seule opération si le prompt le demande."
	},
	{
		q: 'Comment changer le format de photo HEIC en JPG ?',
		a: "Déposez le ou les fichiers HEIC dans Mochify et écrivez « convertir ce HEIC en JPG ». La conversion se fait sans toucher aux réglages de l'iPhone : le fichier d'origine reste inchangé sur l'appareil, seul le nouveau fichier JPG est généré par Mochify."
	},
	{
		q: 'Comment enlever le mode HEIC ?',
		a: "Sur l'iPhone, ouvrez Réglages, puis Appareil photo, puis Formats, et sélectionnez Le plus compatible. Les prochaines photos seront enregistrées en JPEG plutôt qu'en HEIC. Ce réglage ne change rien aux photos déjà prises sur l'appareil : pour convertir celles-ci, il faut utiliser Mochify."
	},
	{
		q: 'Pourquoi HEIC au lieu de JPG ?',
		a: "HEIC est le format par défaut sur iPhone parce qu'il compresse mieux qu'un JPG à qualité équivalente, ce qui économise de l'espace de stockage sur l'appareil et dans iCloud. C'est un choix d'Apple, pas une obligation : le réglage Le plus compatible, dans Appareil photo, permet de repasser en JPEG pour les prochaines photos."
	},
	{
		q: 'Comment envoyer une photo HEIC au format JPG ?',
		a: "Le plus simple est de convertir le fichier avant l'envoi : déposez la photo HEIC dans Mochify avec le prompt « convertir en JPG ». Certains partages depuis l'iPhone, par AirDrop ou par e-mail, convertissent aussi automatiquement en JPEG si l'appareil du destinataire ne prend pas en charge le HEIC."
	},
	{
		q: 'Comment réduire une photo à 1 Mo ?',
		a: "Mochify ne vise pas un poids précis en Mo, mais réduire la largeur en pixels est ce qui fait le plus baisser le poids d'un fichier. Un bon point de départ : demander une largeur de 1 200 px, éventuellement moins pour un usage web léger, puis ajuster si le résultat n'est pas encore assez léger."
	}
];

// The PromptFormApp overrides for this page. Only the strings the copy sheet
// supplies: the chips it lists as labels without prompts are handled by turning
// the prompt chips off (see `showSuggestionChips`), not by inventing French.
export const FR_PROMPT_FORM_STRINGS: Partial<PromptFormStrings> = {
	uploadButton: frFlowTool.uploadButton,
	imagePlaceholders: [frFlowTool.placeholder],
	convertToLabel: frFlowExpanders.convertTo,
	rotateLabel: frFlowExpanders.rotate,
	errorParse: frFlowTool.errors.parse,
	errorServer: frFlowTool.errors.server,
	// The sheet writes the file name as `[nom du fichier]`; the component has the
	// real one, so the placeholder is substituted rather than shown literally.
	errorConnection: (fileName: string) =>
		frFlowTool.errors.connection.replace('[nom du fichier]', fileName),
	// Labels from the sheet, prompts drafted dev-side (see frFlowChipPrompts),
	// dot colours shared with the English set so a chip means the same thing on
	// both pages.
	imageSuggestions: frFlowChips.map((label, i) => ({
		label,
		prompt: frFlowChipPrompts[i],
		dot: EN_PROMPT_FORM_STRINGS.imageSuggestions[i].dot
	}))
};
