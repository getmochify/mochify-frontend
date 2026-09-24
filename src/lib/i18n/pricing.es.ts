// Spanish pricing copy.
//
// PROVENANCE. The localisation plan says the devs never write Spanish, and this
// page has no copy sheet: content-ops has written `article-originals/es/flow.md`
// and nothing for /pricing. The Spanish handoff (2026-09-24, A9) makes this file
// the dev's explicitly, on the same footing as `pricing.fr.ts`, and says to build
// it right the first time rather than shipping it noindex and fixing it later.
// It is NOT native-reviewed. Content-ops checks the claims once live.
//
// Neutral Spanish for Spain and Latin America, matching /es/flow, so the page
// renders with the `es` locale and no region. That is also what produces the
// copy sheet's own number convention for free: Intl formats 1200 and 5000 with
// no separator under plain `es`, which is how the sheet writes them, and avoids
// having to choose between Spain's `1.200` and Mexico's `1,200`.
//
// House rules: `¿` and `¡` opened, « » for quotes, MB/KB with a space, and zero
// em dashes in any encoding.
//
// Two figures the French and English pages carry are deliberately absent, per
// A9: there are no per-image cost figures anywhere (they are computed from one
// currency and wrong in every other), and Growth is named everywhere Seller and
// Pro are.

import type { PricingStrings } from '$lib/i18n/pricing';

export const ES_PRICING: PricingStrings = {
	eyebrow: 'Las herramientas de imagen que te acompañan donde trabajas',
	h1Before: 'Precios',
	h1Accent: 'claros',
	h1After: 'y honestos',
	heroSub:
		'No hace falta suscribirse para empezar. Pruébalo gratis y cambia de plan cuando lo necesites.',
	surfaces: 'Web · CLI · Extensión de Chrome · MCP · API',
	billingMonthly: 'Mensual',
	billingYearly: 'Anual',
	saveExact: (pct) => `Ahorra un ${pct} %`,
	mostPopular: 'El más elegido',
	perMonth: '/ mes',
	perYear: '/ año',
	perForever: '/ para siempre',
	oneTime: 'pago único',
	or: 'O',
	perYearInline: (price) => `${price} / año`,
	billedAnnually: (monthly) => `${monthly} / mes, facturado anualmente`,
	percentOff: (pct) => `${pct} % de descuento`,
	vsMonthly: 'frente al plan mensual',
	everythingInSeller: 'Todo lo de Seller, y además:',
	everythingInPro: 'Todo lo de Pro, y además:',
	sellerFeatures: [
		'<strong>300 imágenes</strong> al mes',
		'<strong>75 MB</strong> por archivo',
		'<strong>25 archivos</strong> por lote',
		'Herramientas <strong>PDF</strong> completas',
		'Guardar en <strong>Google Drive</strong> o en tu propio bucket',
		'Procesamiento <strong>prioritario</strong>'
	],
	proFeatures: [
		'<strong>1200 imágenes</strong> al mes',
		'<strong>Cuatro veces más imágenes</strong> por tres veces el precio',
		'Cola de <strong>máxima prioridad</strong>',
		'Soporte prioritario por correo'
	],
	growthFeatures: [
		'<strong>5000 imágenes</strong> al mes',
		'<strong>Páginas PDF ilimitadas</strong> <span class="text-[#6C3F31]/50">(10 como máximo en el resto de planes)</span>',
		'PDF a partir de <strong>200 imágenes</strong>'
	],
	freeFeatures: [
		'<strong>25 imágenes</strong> al mes',
		'<strong>20 MB</strong> por archivo',
		'Hasta <strong>3 archivos</strong> por lote',
		'Quitar el fondo',
		'Cola estándar'
	],
	dayPassFeatures: [
		'<strong>100 subidas</strong> en 24 horas',
		'<strong>75 MB</strong> por archivo y lotes más grandes',
		'Sin suscripción y sin cuenta',
		'Activación inmediata con un enlace mágico'
	],
	ctaSeller: 'Elegir Seller',
	ctaPro: 'Elegir Pro',
	ctaGrowth: 'Elegir Growth',
	ctaFree: 'Empezar gratis',
	ctaDayPass: (price) => `Conseguir el Day Pass por ${price}`,
	noSignupLink: '3 imágenes, sin registrarte',
	flowHref: '/es/flow',
	privacyLead: 'Privacidad por diseño.',
	privacyBody:
		'Tus imágenes se procesan en memoria, nunca se guardan y nunca se usan para entrenar una IA.',
	privacyHref: '/privacy',
	learnMore: 'Más información →',
	orNoSubscription: 'O, sin suscripción',
	fullComparison: 'Comparativa completa',
	tblFeature: 'Función',
	tblMonthlyImages: 'Imágenes al mes',
	tblMaxFileSize: 'Tamaño máximo por archivo',
	tblSizeFree: '20 MB',
	tblSizePaid: '75 MB',
	tblHeicUpload: 'Subida de archivos HEIC',
	tblResizeRotateCrop: 'Redimensionar, girar y recortar',
	tblBackgroundRemoval: 'Quitar el fondo',
	tblAiBackgrounds: 'Fondos y sombras con IA',
	tblMcpApi: 'Acceso a MCP y API',
	tblBatchUpload: 'Subida por lotes',
	tblQueue: 'Cola de procesamiento',
	tblPdfTools:
		'Herramientas PDF <span class="text-[#6C3F31]/50 text-xs">(rasterizar, dividir, imágenes→PDF)</span>',
	tblOwnStorage:
		'Guardar en tu propio almacenamiento <span class="text-[#6C3F31]/50 text-xs">(Google Drive, o S3 / R2 / compatible con S3)</span>',
	tblPerMonth: (n) => `${n.toLocaleString('es')} / mes`,
	tblFiles: (n) => `${n} archivos`,
	tblQueueStandard: 'Estándar',
	tblQueuePriority: 'Prioritaria',
	tblQueueTop: 'Máxima prioridad',
	tblSoon: 'Próximamente',
	tblNotIncluded: 'no',
	tblPdfFree: 'imágenes→PDF, 3 páginas',
	tblPdfUnlimited: '✓ páginas ilimitadas',
	faqHeading: 'Preguntas frecuentes',
	faqSub: 'Límites, facturación y qué cambia cuando cambias de plan.',
	faqs: (dayPassPrice) => [
		{
			q: '¿Qué cuenta como una imagen?',
			a: 'Cada imagen que te devolvemos descuenta una de tu cuota mensual. Comprimir, convertir, redimensionar, o cualquier combinación de esas operaciones sobre un mismo archivo, cuenta como una imagen. Pedir varios formatos o varios tamaños del mismo archivo devuelve varias imágenes, y cada una cuenta: WebP y AVIF en dos anchos son cuatro. Las subidas por lotes cuentan una por archivo.'
		},
		{
			q: '¿Las imágenes que no uso se acumulan para el mes siguiente?',
			a: 'No. El plan gratuito se reinicia en un ciclo móvil de 30 días desde que empiezas a usarlo; Seller, Pro y Growth se reinician en tu fecha de facturación. Las imágenes que no uses no se acumulan.'
		},
		{
			q: '¿Merece la pena Pro frente a Seller?',
			a: 'Depende del volumen. Pro da cuatro veces más imágenes por algo más de tres veces el precio, así que cada imagen sale alrededor de un 22 % más barata, tanto en el plan mensual como en el anual. Pro también pone tus archivos al principio de la cola y da derecho a soporte prioritario por correo. Si te mantienes con holgura por debajo de 300 imágenes al mes, Seller es la mejor opción.'
		},
		{
			q: '¿Puedo usar la API con el plan gratuito?',
			a: 'Sí: todos los planes tienen acceso completo a MCP y a la API. Se aplica el mismo límite mensual.'
		},
		{
			q: '¿Cómo funciona el Day Pass?',
			a: `Paga ${dayPassPrice} y te enviamos un enlace mágico por correo: pulsa en él para desbloquear 100 subidas de imágenes en 24 horas, archivos de 75 MB y lotes más grandes durante 24 horas. No hace falta cuenta ni suscripción.`
		},
		{
			q: '¿Puedo cancelar cuando quiera?',
			a: 'Sí. Cancela cuando quieras y conservas el acceso hasta el final de tu periodo de facturación.'
		}
	],
	ctaHeading: 'Empieza gratis y cambia de plan cuando se te quede corto',
	ctaBody:
		'25 imágenes al mes en el plan gratuito, sin tarjeta. Acceso a MCP, CLI y API en todos los planes, incluido el gratuito.',
	ctaCreateAccount: 'Crear una cuenta gratis →',
	ctaTryFree: 'Probar 3 imágenes, sin registrarte',
	ctaContactBefore: '¿Aún no sabes qué plan te conviene? Escribe a',
	ctaContactAfter: '.',
	metaTitle: 'Precios | Mochify',
	metaDescription:
		'Precios claros. 3 imágenes gratis sin registrarte, o 25 al mes con una cuenta gratuita. Seller para 300 imágenes, Pro para 1200 y Growth para 5000. O un Day Pass para 100 subidas en 24 horas, sin suscripción.',
	schemaUrl: 'https://mochify.app/es/pricing',
	schemaDescription:
		'Precios claros. 3 imágenes gratis sin registrarte, o 25 al mes con una cuenta gratuita. Seller para 300 imágenes, Pro para 1200 y Growth para 5000 imágenes al mes.',
	schemaOffers: [
		{
			plan: null,
			name: 'Free',
			description: () =>
				'3 imágenes gratis sin cuenta. Crea una cuenta gratuita para 25 imágenes al mes. Incluye todos los formatos, redimensionar, girar, recortar, quitar el fondo y acceso a MCP y API. Cola de procesamiento estándar.'
		},
		{
			plan: 'sellerMonthly',
			name: 'Seller mensual',
			unitCode: 'MON',
			description: () =>
				'300 imágenes al mes. Incluye todos los formatos, redimensionar, girar, recortar, quitar el fondo y acceso a MCP y API. Hasta 75 MB por archivo. Cola de procesamiento prioritaria.'
		},
		{
			plan: 'proMonthly',
			name: 'Pro mensual',
			unitCode: 'MON',
			description: () =>
				'1200 imágenes al mes. Incluye todos los formatos, redimensionar, girar, recortar, quitar el fondo y acceso a MCP y API. Hasta 75 MB por archivo. Cola de máxima prioridad.'
		},
		{
			plan: 'growthMonthly',
			name: 'Growth mensual',
			unitCode: 'MON',
			description: () =>
				'5000 imágenes al mes. Todo lo de Pro, más páginas PDF ilimitadas y PDF creados a partir de 200 imágenes. Guarda los resultados en tu propio bucket o en Google Drive. Cola de máxima prioridad.'
		},
		{
			plan: 'sellerYearly',
			name: 'Seller anual',
			unitCode: 'ANN',
			description: (price) =>
				`300 imágenes al mes, facturadas a ${price('sellerYearly')} al año. Incluye quitar el fondo. Hasta 75 MB por archivo. Cola de procesamiento prioritaria.`
		},
		{
			plan: 'proYearly',
			name: 'Pro anual',
			unitCode: 'ANN',
			description: (price) =>
				`1200 imágenes al mes, facturadas a ${price('proYearly')} al año. Incluye quitar el fondo. Hasta 75 MB por archivo. Cola de máxima prioridad.`
		},
		{
			plan: 'growthYearly',
			name: 'Growth anual',
			unitCode: 'ANN',
			description: (price) =>
				`5000 imágenes al mes, facturadas a ${price('growthYearly')} al año. Páginas PDF ilimitadas. Cola de máxima prioridad.`
		},
		{
			plan: 'dayPass',
			name: 'Day Pass',
			description: () =>
				'Pase de 24 horas, pago único. Hasta 100 subidas de imágenes, archivos de hasta 75 MB y lotes más grandes. Sin suscripción ni cuenta, activado al instante con un enlace mágico.'
		}
	]
};
