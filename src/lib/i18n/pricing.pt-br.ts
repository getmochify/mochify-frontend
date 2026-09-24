// Brazilian Portuguese pricing copy.
//
// PROVENANCE. The localisation plan says the devs never write Portuguese, and
// this page has no copy sheet: content-ops has written
// `article-originals/pt-br/flow.md` and nothing for /pricing. The handoff
// (2026-09-24, A9) makes this file the dev's, on the same footing as
// `pricing.fr.ts`, `pricing.es.ts` and `pricing.ja.ts`. It is NOT
// native-reviewed; content-ops checks the claims once live and the Brazilian
// reviewer reads it too.
//
// Brazilian vocabulary throughout, never European: arquivo not ficheiro, celular
// not telemóvel, cadastro not registo, tela not ecrã, você not tu.
//
// House rules from the /pt-br/flow sheet: pixel values unseparated (`1200 px`),
// units spaced (`20 MB`), “ ” for quotes, and zero em dashes.
//
// No price is written here. Every figure is formatted from what Polar returns
// for the visitor, so a Brazilian reader abroad sees their own currency rather
// than one baked into the copy.
//
// Per A9: no per-image cost figures anywhere, and Growth named everywhere Seller
// and Pro are.

import type { PricingStrings } from '$lib/i18n/pricing';

export const PT_BR_PRICING: PricingStrings = {
	eyebrow: 'As ferramentas de imagem que acompanham você',
	h1Before: 'Preços',
	h1Accent: 'claros',
	h1After: 'e honestos',
	heroSub:
		'Não precisa assinar nada para começar. Teste de graça e mude de plano quando precisar.',
	surfaces: 'Web · CLI · Extensão do Chrome · MCP · API',
	billingMonthly: 'Mensal',
	billingYearly: 'Anual',
	saveExact: (pct) => `Economize ${pct}%`,
	mostPopular: 'Mais escolhido',
	perMonth: '/ mês',
	perYear: '/ ano',
	perForever: '/ para sempre',
	oneTime: 'pagamento único',
	or: 'Ou',
	perYearInline: (price) => `${price} / ano`,
	billedAnnually: (monthly) => `${monthly} / mês, cobrado anualmente`,
	percentOff: (pct) => `${pct}% de desconto`,
	vsMonthly: 'em relação ao mensal',
	everythingInSeller: 'Tudo do Seller, mais:',
	everythingInPro: 'Tudo do Pro, mais:',
	sellerFeatures: [
		'<strong>300 imagens</strong> por mês',
		'<strong>75 MB</strong> por arquivo',
		'<strong>25 arquivos</strong> por lote',
		'Ferramentas de <strong>PDF</strong> completas',
		'Salvar no <strong>Google Drive</strong> ou no seu próprio bucket',
		'Processamento <strong>prioritário</strong>'
	],
	proFeatures: [
		'<strong>1200 imagens</strong> por mês',
		'<strong>Quatro vezes mais imagens</strong> por pouco mais de três vezes o preço',
		'Fila de <strong>prioridade máxima</strong>',
		'Suporte prioritário por e-mail'
	],
	growthFeatures: [
		'<strong>5000 imagens</strong> por mês',
		'<strong>Páginas de PDF ilimitadas</strong> <span class="text-[#6C3F31]/50">(10 no máximo nos outros planos)</span>',
		'PDF a partir de <strong>200 imagens</strong>'
	],
	freeFeatures: [
		'<strong>25 imagens</strong> por mês',
		'<strong>20 MB</strong> por arquivo',
		'Até <strong>3 arquivos</strong> por lote',
		'Remoção de fundo',
		'Fila padrão'
	],
	dayPassFeatures: [
		'<strong>100 envios</strong> em 24 horas',
		'<strong>75 MB</strong> por arquivo e lotes maiores',
		'Sem assinatura e sem cadastro',
		'Liberado na hora por link mágico'
	],
	ctaSeller: 'Escolher o Seller',
	ctaPro: 'Escolher o Pro',
	ctaGrowth: 'Escolher o Growth',
	ctaFree: 'Começar de graça',
	ctaDayPass: (price) => `Comprar o Day Pass por ${price}`,
	noSignupLink: '3 imagens, sem cadastro',
	flowHref: '/pt-br/flow',
	privacyLead: 'Privacidade desde o projeto.',
	privacyBody:
		'Suas imagens são processadas na memória, nunca são armazenadas e nunca são usadas para treinar IA.',
	privacyHref: '/privacy',
	learnMore: 'Saiba mais →',
	orNoSubscription: 'Ou, sem assinatura',
	fullComparison: 'Comparativo completo',
	tblFeature: 'Recurso',
	tblMonthlyImages: 'Imagens por mês',
	tblMaxFileSize: 'Tamanho máximo por arquivo',
	tblSizeFree: '20 MB',
	tblSizePaid: '75 MB',
	tblHeicUpload: 'Envio de arquivos HEIC',
	tblResizeRotateCrop: 'Redimensionar, girar e cortar',
	tblBackgroundRemoval: 'Remoção de fundo',
	tblAiBackgrounds: 'Fundos e sombras com IA',
	tblMcpApi: 'Acesso a MCP e API',
	tblBatchUpload: 'Envio em lote',
	tblQueue: 'Fila de processamento',
	tblPdfTools:
		'Ferramentas de PDF <span class="text-[#6C3F31]/50 text-xs">(rasterizar, dividir, imagens→PDF)</span>',
	tblOwnStorage:
		'Salvar no seu próprio armazenamento <span class="text-[#6C3F31]/50 text-xs">(Google Drive, ou S3 / R2 / compatível com S3)</span>',
	tblPerMonth: (n) => `${n.toLocaleString('pt-BR')} / mês`,
	tblFiles: (n) => `${n} arquivos`,
	tblQueueStandard: 'Padrão',
	tblQueuePriority: 'Prioritária',
	tblQueueTop: 'Prioridade máxima',
	tblSoon: 'Em breve',
	tblNotIncluded: 'não',
	tblPdfFree: 'imagens→PDF, 3 páginas',
	tblPdfUnlimited: '✓ páginas ilimitadas',
	faqHeading: 'Perguntas frequentes',
	faqSub: 'Limites, cobrança e o que muda quando você troca de plano.',
	faqs: (dayPassPrice) => [
		{
			q: 'O que conta como uma imagem?',
			a: 'Cada imagem que devolvemos usa uma da sua cota mensal. Comprimir, converter, redimensionar, ou qualquer combinação dessas operações no mesmo arquivo, conta como uma imagem. Pedir vários formatos ou vários tamanhos do mesmo arquivo devolve várias imagens, e cada uma conta: WebP e AVIF em duas larguras são quatro. Envios em lote contam uma por arquivo.'
		},
		{
			q: 'As imagens que eu não usar acumulam para o mês seguinte?',
			a: 'Não. O plano gratuito zera num ciclo contínuo de 30 dias a partir do primeiro uso; Seller, Pro e Growth zeram na sua data de cobrança. As imagens que você não usar não acumulam.'
		},
		{
			q: 'Vale mais a pena o Pro ou o Seller?',
			a: 'Depende do volume. O Pro dá quatro vezes mais imagens por pouco mais de três vezes o preço, então cada imagem sai cerca de 22% mais barata, tanto no mensal quanto no anual. O Pro também coloca seus arquivos no começo da fila e dá direito a suporte prioritário por e-mail. Se você fica com folga abaixo de 300 imagens por mês, o Seller é a melhor escolha.'
		},
		{
			q: 'Dá para usar a API no plano gratuito?',
			a: 'Sim: todos os planos têm acesso completo a MCP e à API. O mesmo limite mensal vale para todos.'
		},
		{
			q: 'Como funciona o Day Pass?',
			a: `Você paga ${dayPassPrice} e enviamos um link mágico por e-mail: clique nele para liberar 100 envios de imagens em 24 horas, arquivos de 75 MB e lotes maiores durante 24 horas. Não precisa de cadastro nem de assinatura.`
		},
		{
			q: 'Posso cancelar quando quiser?',
			a: 'Sim. Cancele quando quiser e você continua com acesso até o fim do período já pago.'
		}
	],
	ctaHeading: 'Comece de graça e mude de plano quando precisar de mais',
	ctaBody:
		'25 imagens por mês no plano gratuito, sem cartão. Acesso a MCP, CLI e API em todos os planos, inclusive no gratuito.',
	ctaCreateAccount: 'Criar uma conta gratuita →',
	ctaTryFree: 'Testar 3 imagens, sem cadastro',
	ctaContactBefore: 'Ainda na dúvida sobre o plano? Escreva para',
	ctaContactAfter: '.',
	metaTitle: 'Preços | Mochify',
	metaDescription:
		'Preços claros. 3 imagens grátis sem cadastro, ou 25 por mês com uma conta gratuita. Seller com 300 imagens, Pro com 1200 e Growth com 5000. Ou um Day Pass para 100 envios em 24 horas, sem assinatura.',
	schemaUrl: 'https://mochify.app/pt-br/pricing',
	schemaDescription:
		'Preços claros. 3 imagens grátis sem cadastro, ou 25 por mês com uma conta gratuita. Seller com 300 imagens, Pro com 1200 e Growth com 5000 imagens por mês.',
	schemaOffers: [
		{
			plan: null,
			name: 'Free',
			description: () =>
				'3 imagens grátis sem conta. Crie uma conta gratuita para 25 imagens por mês. Inclui todos os formatos, redimensionar, girar, cortar, remoção de fundo e acesso a MCP e API. Fila de processamento padrão.'
		},
		{
			plan: 'sellerMonthly',
			name: 'Seller mensal',
			unitCode: 'MON',
			description: () =>
				'300 imagens por mês. Inclui todos os formatos, redimensionar, girar, cortar, remoção de fundo e acesso a MCP e API. Até 75 MB por arquivo. Fila de processamento prioritária.'
		},
		{
			plan: 'proMonthly',
			name: 'Pro mensal',
			unitCode: 'MON',
			description: () =>
				'1200 imagens por mês. Inclui todos os formatos, redimensionar, girar, cortar, remoção de fundo e acesso a MCP e API. Até 75 MB por arquivo. Fila de prioridade máxima.'
		},
		{
			plan: 'growthMonthly',
			name: 'Growth mensal',
			unitCode: 'MON',
			description: () =>
				'5000 imagens por mês. Tudo do Pro, mais páginas de PDF ilimitadas e PDFs criados a partir de 200 imagens. Salve os resultados no seu próprio bucket ou no Google Drive. Fila de prioridade máxima.'
		},
		{
			plan: 'sellerYearly',
			name: 'Seller anual',
			unitCode: 'ANN',
			description: (price) =>
				`300 imagens por mês, cobradas ${price} por ano. Inclui remoção de fundo. Até 75 MB por arquivo. Fila de processamento prioritária.`
		},
		{
			plan: 'proYearly',
			name: 'Pro anual',
			unitCode: 'ANN',
			description: (price) =>
				`1200 imagens por mês, cobradas ${price} por ano. Inclui remoção de fundo. Até 75 MB por arquivo. Fila de prioridade máxima.`
		},
		{
			plan: 'growthYearly',
			name: 'Growth anual',
			unitCode: 'ANN',
			description: (price) =>
				`5000 imagens por mês, cobradas ${price} por ano. Páginas de PDF ilimitadas. Fila de prioridade máxima.`
		},
		{
			plan: 'dayPass',
			name: 'Day Pass',
			description: () =>
				'Passe de 24 horas, pagamento único. Até 100 envios de imagens, arquivos de até 75 MB e lotes maiores. Sem assinatura e sem cadastro, liberado na hora por link mágico.'
		}
	]
};
