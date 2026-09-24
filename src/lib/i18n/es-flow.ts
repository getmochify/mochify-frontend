// Spanish copy for /es/flow, extracted from the content-ops copy sheet
// (`article-originals/es/flow.md`, drafted 2026-09-24) by a script that reads the
// sheet directly, so every string is character for character what it says: the
// « » quotes, the unseparated `1200 px`, the `¿` opening each FAQ question, and
// the accents.
//
// DO NOT edit the Spanish here. The copy sheet is the source of record; a change
// arrives as a handoff and is re-extracted. Native review happens on the live
// page after launch (strategy/2026-09-24-es-localisation-pilot.md §8).
//
// Neutral Spanish for Spain and Latin America together, which is why the page
// declares `es` with no region. Numbers are written without separators on
// purpose (`1200 px`): Spain and Mexico group them oppositely, so the copy
// sidesteps the question the parser still has to answer from the visitor's own
// Accept-Language (handoff A7).
//
// No language claim appears anywhere on the page: the parse test (handoff Part B)
// has not run, so the page shows Spanish examples and never says the parser
// understands Spanish.

import type { PromptFormStrings } from '$lib/i18n/promptForm';
import type { FaqPart } from '$lib/faq';

export type EsSectionBlock =
	| { type: 'prompt'; text: string }
	| { type: 'p'; text: string }
	| { type: 'p'; parts: FaqPart[] };
export type EsSection = { id: string; heading: string; blocks: EsSectionBlock[] };
export type EsFaq = { q: string; a: string };

export const esFlowMeta = {
	title: 'Convertir y comprimir imágenes online gratis | Mochify',
	metaDescription:
		'Convierte HEIC, WebP o PNG a JPG, comprime, redimensiona o quita el fondo de tus imágenes: dilo con tus palabras. Gratis, y puedes probarlo sin registrarte.',
	ogTitle: 'Convierte HEIC, WebP y PNG a JPG, comprime y recorta',
	ogDescription:
		'Dilo con tus palabras: convierte, comprime, redimensiona o quita el fondo de tus imágenes. Gratis y sin instalar nada. Pruébalo sin registrarte.'
} as const;

export const esFlowTool = {
	h1: 'Convierte HEIC, WebP y PNG a JPG, comprime y recorta: dilo con tus palabras',
	subtitle:
		'Sube tus imágenes o PDF, describe en una frase el resultado que quieres y Mochify se encarga del resto.',
	uploadButton: 'Añadir imágenes, PDF o videos',
	placeholder: 'Ej.: convertir a JPG y redimensionar a 1200 px de ancho',
	defaultPrompt: 'Convertir a JPG, 1200 px de ancho',
	badgeLine: 'Cero retención · 25 gratis al mes · AVIF · JPEG XL · WebP · PDF · WebM',
	examples: [
		'Convertir este HEIC a JPG',
		'Convertir este WebP a JPG',
		'Comprimir esta imagen para que pese menos',
		'Redimensionar a 1200 px de ancho',
		'Quitar el fondo y dejarlo transparente',
		'Quitar el fondo y ponerlo blanco',
		'Recortar en cuadrado para un anuncio online'
	],
	errors: {
		parse: 'No se entendió bien la instrucción: inténtalo de nuevo o escríbela de otra forma.',
		connection:
			'Se perdió la conexión mientras se procesaba [nombre del archivo]: comprueba tu conexión a internet e inténtalo de nuevo.',
		server: 'Se produjo un error en nuestro servidor. Inténtalo de nuevo en un momento.'
	}
} as const;

// The sheet lists nine chips. The first seven write a prompt into the box; the
// last two are the component's own menu expanders, which open a list rather than
// loading a prompt, so they are labelled separately.
export const esFlowChips = [
	'Quitar el fondo',
	'eBay',
	'Mercado Libre',
	'Wallapop',
	'Recortar en cuadrado',
	'PageSpeed',
	'En PDF'
] as const;

export const esFlowExpanders = {
	convertTo: 'Convertir a…',
	rotate: 'Girar…'
} as const;

// The prompts the seven chips write into the box.
//
// PROVENANCE, because this is the one place the copy sheet does not fully cover:
// it lists the chip LABELS, not the prompts behind them. Two of the seven are
// specified rather than drafted.
//
// Mercado Libre loads a 1200 x 1200 square and NO white background. The sheet
// originally gave it the white-background prompt; handoff 2026-09-24 E1
// corrected that against ledger v49, because Mercado Libre's own seller guidance
// recommends 1200 x 1200 and now asks sellers to AVOID white backgrounds, which
// stay mandatory only in Tecnología, Belleza, Salud y Supermercado. Same rule as
// the Mercado Livre chip on /pt-br/flow.
//
// Wallapop keeps the white-background prompt, which is what its sheet entry says
// and what E1 explicitly leaves alone. The other five were drafted dev-side on the
// same footing as the French ones, using only vocabulary the sheet itself uses
// ("quitar el fondo", "recortar en cuadrado", "convertir a", "comprimir"), so a
// chip cannot ask for something the copy has not already said Mochify does.
// They are NOT native-reviewed. Content-ops should take or replace them.
export const esFlowChipPrompts: readonly string[] = [
	'Quitar el fondo y dejarlo transparente',
	'Optimizar para eBay: recortar en cuadrado y convertir a JPG',
	'Recortar en cuadrado de 1200 x 1200 px',
	'Recortar en cuadrado y poner el fondo blanco',
	'Recortar en cuadrado de 1200 px',
	'Convertir a WebP y comprimir',
	'Combinar en un solo PDF'
];

const ES_CHIP_DOTS = [
	'bg-purple-400',
	'bg-[#3665F3]',
	'bg-amber-400',
	'bg-teal-400',
	'bg-[#66BB6A]',
	'bg-[#4285F4]',
	'bg-rose-400'
];

export const esFlowSections: EsSection[] = [
	{
		id: 'convertir-imagenes-a-jpg',
		heading: 'Convertir imágenes a JPG: HEIC, WebP, PNG y AVIF',
		blocks: [
			{ type: 'p', text: 'Convertir cambia el formato en que se guarda una imagen: lo que muestra la foto no cambia, aunque el archivo se vuelve a codificar. Mochify convierte HEIC, WebP, PNG y AVIF a JPG, y también a WebP, AVIF, PNG o JPEG XL, a partir de una instrucción en una frase: dices qué formato quieres y Mochify hace el resto, sin menús ni pasos intermedios. Convertir sirve sobre todo para que el archivo se abra en todas partes: un HEIC o un WebP no se abre igual de bien en todos los programas, las aplicaciones y los formularios de subida, mientras que un JPG se abre prácticamente en cualquier sitio. Para JPG, Mochify codifica con jpegli, un codificador que conserva más calidad visual que un codificador JPG clásico con el mismo peso. Puedes subir varias imágenes a la vez y pedir la misma conversión para todas en una sola instrucción. Ten en cuenta que JPG no admite transparencia: si conviertes un PNG con fondo transparente a JPG, el fondo deja de ser transparente, y en ese caso conviene pedir PNG o WebP.' },
			{ type: 'prompt', text: 'Convertir este HEIC a JPG' }
		]
	},
	{
		id: 'por-que-tu-telefono-guarda-las-fotos-en-heic',
		heading: 'Por qué tu teléfono guarda las fotos en HEIC',
		blocks: [
			{ type: 'p', text: 'Si tu iPhone guarda las fotos en HEIC y no en JPG, es porque es el formato que Apple usa por defecto desde hace varias versiones de iOS: ocupa menos espacio que un JPG con una calidad similar. Para cambiarlo, abre Ajustes (Configuración, según el idioma del teléfono) y toca Cámara. Luego toca Formatos y elige Más compatible: a partir de ese momento el iPhone guarda las fotos nuevas en JPEG. El cambio no afecta a las fotos que ya tienes; esas hay que convertirlas aparte. Apple indica además que, al compartir una foto por un medio que no sea Fotos de iCloud, el iPhone puede enviarla ya convertida a JPEG, y que al pasarla por cable a Windows o a un Mac se convierte también, salvo que actives Conservar originales (Mantener originales) en los ajustes de Fotos.' },
			{
				type: 'p',
				parts: [
					'Si el archivo viene de una cámara Canon, Sony o Fujifilm y no de un teléfono, lo normal es que la extensión sea .HIF y no .HEIC. Los dos comparten la misma base técnica, HEIF, pero vienen de equipos distintos y se usan en flujos de trabajo distintos: uno es el de un teléfono y el otro el de una cámara profesional. Mochify acepta los dos. Para los archivos de cámara hay una página específica, ',
					{ href: '/solutions/hif-to-jpg', label: 'HIF a JPG (en inglés)' },
					'.'
				]
			},
			{ type: 'prompt', text: 'Convertir mis fotos de iPhone a JPG' }
		]
	},
	{
		id: 'comprimir',
		heading: 'Comprimir: cómo bajar el peso de una imagen',
		blocks: [
			{ type: 'p', text: 'Bajar el peso de una imagen y cambiar su tamaño no es lo mismo, aunque a menudo se usan como sinónimos. El peso es el espacio que ocupa el archivo, en MB o KB; el tamaño en píxeles es su ancho y su alto. Los dos están relacionados, pero no de la misma forma: reducir el ancho en píxeles baja el peso mucho más que comprimir una imagen que conserva su tamaño original. Una foto de teléfono de varios miles de píxeles de ancho pesa bastante más, ya comprimida, que la misma foto reducida a 1200 px de ancho antes de comprimirla. Por eso, si lo que buscas es que la imagen pese menos, el primer paso suele ser reducir el ancho, y la compresión viene después. Para una web o una tienda online que necesita cargar rápido, esa combinación suele bastar. Cada necesidad es una instrucción distinta:' },
			{ type: 'prompt', text: 'Redimensionar a 1200 px de ancho' },
			{ type: 'prompt', text: 'Comprimir esta imagen sin cambiar su ancho' }
		]
	},
	{
		id: 'redimensionar-y-recortar',
		heading: 'Redimensionar y recortar',
		blocks: [
			{ type: 'p', text: 'Redimensionar cambia el ancho y el alto de una imagen manteniendo la proporción: toda la imagen sigue visible, sin quitar nada. Recortar, en cambio, elimina una parte de la imagen para ajustarla a un encuadre o una proporción concreta, por ejemplo un cuadrado para un anuncio. En una instrucción son dos palabras distintas: «redimensionar» conserva todo el contenido y «recortar» quita una parte. Basta con indicar el ancho o el alto para que Mochify ajuste el otro en la misma proporción.' },
			{ type: 'p', text: 'Mochify nunca amplía una imagen: el resultado no supera los píxeles del archivo original, así que reducir es posible y agrandar no. La pregunta por los centímetros aparece a menudo, sobre todo para imprimir: una pantalla o un archivo se miden en píxeles, y la equivalencia en centímetros depende de la resolución de impresión, los DPI, que cambia según la impresora y el papel. Por eso Mochify trabaja en píxeles y no en centímetros.' },
			{ type: 'p', text: 'Para un anuncio o una tienda online, un recorte cuadrado da a todas las fotos el mismo encuadre. Mochify intenta localizar el sujeto principal de la imagen y colocar el cuadrado sobre él; funciona bien cuando el sujeto es claro, pero en fotos con varios elementos o un fondo muy cargado conviene revisar el resultado antes de publicarlo.' },
			{ type: 'prompt', text: 'Recortar en cuadrado de 1200 px' }
		]
	},
	{
		id: 'fondo-blanco-o-fondo-transparente',
		heading: 'Fondo blanco o fondo transparente',
		blocks: [
			{ type: 'p', text: 'Mochify separa el sujeto del fondo de una imagen y te da dos opciones: fondo transparente, en PNG, o fondo blanco liso. El fondo transparente sirve para colocar la imagen sobre otro diseño; el fondo blanco, para fichas de producto, anuncios y catálogos. La función está disponible en todos los planes, incluida la cuenta gratuita (25 imágenes al mes), y se pide igual que cualquier otra operación: con una frase en la instrucción. El blanco es el único color de fondo que Mochify ofrece.' },
			{ type: 'prompt', text: 'Quitar el fondo y ponerlo blanco' }
		]
	},
	{
		id: 'formatos',
		heading: 'Formatos',
		blocks: [
			{ type: 'p', text: 'Mochify acepta como entrada JPG, PNG, WebP, AVIF, HEIC y HEIF (incluidos los .HIF de cámara), JPEG XL y SVG. No admite TIFF, BMP, RAW de cámara ni PSD. Como salida puedes pedir JPG (codificado con jpegli), PNG, WebP, AVIF o JPEG XL, y una misma instrucción puede pedir varios formatos o varios anchos a la vez, por ejemplo WebP y AVIF en dos tamaños distintos, sin repetir la instrucción para cada variante. Si administras un sitio web o una tienda online, WebP y AVIF producen archivos más ligeros que un JPG o un PNG con una calidad comparable, lo que acorta el tiempo de carga de la página, sobre todo en el teléfono; JPEG XL también es más ligero, aunque todavía no todos los navegadores lo muestran. Magic Flow, la forma de describir en una frase lo que quieres, también está en la extensión de Chrome, en la línea de comandos y por MCP.' },
			{ type: 'prompt', text: 'Convertir a WebP y AVIF, 1200 px y 600 px de ancho' }
		]
	},
	{
		id: 'privacidad',
		heading: 'Privacidad',
		blocks: [
			{ type: 'p', text: 'Las imágenes y los PDF que envías a Mochify se transmiten a los servidores de Mochify (api.mochify.app), se procesan en memoria, nunca se escriben en disco, nunca se guardan y nunca se usan para entrenar una IA.' }
		]
	}
];

export const esFlowFaqs: EsFaq[] = [
	{
		q: '¿Cómo cambiar fotos de formato HEIC a JPG?',
		a: 'Sube el archivo HEIC a Mochify y escribe una instrucción como «convertir a JPG». Mochify genera un archivo JPG nuevo sin tocar el original ni los ajustes del teléfono. Puedes subir varias fotos a la vez y pedir la conversión de todas en una sola instrucción, y el resultado se abre en cualquier programa, aplicación o formulario de subida.'
	},
	{
		q: '¿Por qué mis fotos están en formato HEIC?',
		a: 'Es el formato que Apple usa por defecto en el iPhone desde hace varias versiones de iOS, porque ocupa menos espacio que un JPG con una calidad similar. Si prefieres JPG para las fotos nuevas, abre Ajustes (o Configuración), toca Cámara, luego Formatos, y elige Más compatible. Las fotos que ya tienes siguen en HEIC.'
	},
	{
		q: '¿Cómo se abren los archivos HEIC?',
		a: 'En un iPhone, un iPad o un Mac se abren como cualquier otra foto. En Windows y en muchos programas no siempre se abren sin instalar algo aparte, así que lo más sencillo es convertirlos a JPG: sube los archivos a Mochify y pide «convertir a JPG» para abrirlos en cualquier equipo.'
	},
	{
		q: '¿Qué es el formato .HEIC para fotos?',
		a: 'HEIC es el formato en que el iPhone guarda las fotos por defecto: comprime más que un JPG con una calidad similar. Es la versión de Apple del formato HEIF. Las cámaras Canon, Sony y Fujifilm usan la extensión .HIF, que parte de la misma base pero pertenece a otro flujo de trabajo. Mochify acepta los dos.'
	},
	{
		q: '¿Cómo puedo convertir HEIC a JPG gratis?',
		a: 'Con una cuenta gratuita de Mochify puedes convertir hasta 25 imágenes al mes, de hasta 20 MB cada una, sin pagar nada: sube el archivo HEIC y escribe «convertir a JPG». Sin cuenta puedes probarlo con 3 imágenes al mes, contadas por dirección IP, antes de registrarte.'
	},
	{
		q: '¿Cómo hago para poner un fondo blanco a una foto?',
		a: 'Sube la foto a Mochify y escribe una instrucción como «quitar el fondo y ponerlo blanco». Mochify separa el sujeto del fondo y te devuelve la imagen con un fondo blanco liso. Si la necesitas para colocarla sobre otro diseño, pide en su lugar un fondo transparente en PNG.'
	},
	{
		q: '¿Qué aplicación puedo usar para poner fondo blanco a una foto?',
		a: 'No hace falta instalar ninguna aplicación: esta página lo hace. Sube la foto, escribe «poner el fondo blanco» y descarga el resultado, desde el teléfono o desde cualquier otro equipo con navegador. La función está disponible en todos los planes, incluida la cuenta gratuita, con 25 imágenes al mes.'
	},
	{
		q: '¿Cómo hacer que una foto pese menos?',
		a: 'Mochify no apunta a un peso exacto en MB, pero reducir el ancho en píxeles es lo que más baja el peso de un archivo. Pide «redimensionar a 1200 px de ancho», o convierte a WebP o AVIF, que pesan menos que un JPG con una calidad similar. Si necesitas bajar más el peso, combina las dos cosas en la misma instrucción.'
	},
	{
		q: '¿Se pierde calidad al convertir WebP a JPG?',
		a: 'Algo sí: JPG es un formato con pérdida, así que convertir a JPG siempre vuelve a codificar la imagen. Mochify usa jpegli, que conserva más calidad visual que un codificador JPG clásico con el mismo peso, pero pasar de un formato a otro nunca es una copia exacta. Si el WebP tiene transparencia, conviértelo a PNG, porque JPG no la admite.'
	}
];

// The PromptFormApp overrides for this page.
//
// The dot colours are presentational and shared with the English set where a
// chip means the same thing. Mercado Libre and Wallapop have no English
// counterpart, so they take two unused palette colours rather than a brand hex
// nobody has verified.
export const ES_PROMPT_FORM_STRINGS: Partial<PromptFormStrings> = {
	uploadButton: esFlowTool.uploadButton,
	imagePlaceholders: [esFlowTool.placeholder],
	convertToLabel: esFlowExpanders.convertTo,
	rotateLabel: esFlowExpanders.rotate,
	errorParse: esFlowTool.errors.parse,
	errorServer: esFlowTool.errors.server,
	// The sheet writes the file name as `[nombre del archivo]`; the component has
	// the real one, so the placeholder is substituted rather than shown literally.
	errorConnection: (fileName: string) =>
		esFlowTool.errors.connection.replace('[nombre del archivo]', fileName),
	imageSuggestions: esFlowChips.map((label, i) => ({
		label,
		prompt: esFlowChipPrompts[i],
		dot: ES_CHIP_DOTS[i]
	}))
};
