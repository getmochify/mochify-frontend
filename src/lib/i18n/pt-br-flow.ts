// Brazilian Portuguese copy for /pt-br/flow, extracted from the content-ops copy
// sheet (`article-originals/pt-br/flow.md`, drafted 2026-09-24) by a script that
// reads the sheet directly, so every string is character for character what it
// says: the “ ” quotes, the unseparated `1200 px`, the spaced `20 MB`, and the
// accents.
//
// DO NOT edit the Portuguese here. The copy sheet is the source of record; a
// change arrives as a handoff and is re-extracted. Native review follows launch
// (strategy/2026-09-24-pt-br-localisation-pilot.md §8), and the handoff is
// explicit that a phrase looking odd is not a reason to reword it.
//
// Brazilian vocabulary throughout (arquivo, celular, cadastro), never European
// (ficheiro, telemóvel, registo). The page is written for Brazil and declared as
// both pt-BR and pt, so it also serves every other Portuguese speaker.
//
// No language claim appears anywhere: the parse test (handoff Part B) has not
// run, so the page teaches Portuguese prompts by example and never says the
// parser understands Portuguese.

import type { PromptFormStrings } from '$lib/i18n/promptForm';
import type { FaqItem, FaqPart } from '$lib/faq';

export type PtSectionBlock =
	{ type: 'prompt'; text: string } | { type: 'p'; text: string } | { type: 'p'; parts: FaqPart[] };
export type PtSection = { id: string; heading: string; blocks: PtSectionBlock[] };

export const ptBrFlowMeta = {
	title: 'Comprimir e redimensionar imagem online grátis | Mochify',
	metaDescription:
		'Comprima, redimensione, corte ou converta HEIC para JPG: é só dizer o que você quer, numa frase. Grátis, sem instalar nada, e você pode testar sem cadastro.',
	ogTitle: 'Comprima, redimensione e converta HEIC para JPG: é só pedir',
	ogDescription:
		'É só dizer o que você quer: comprimir, redimensionar, converter HEIC para JPG ou remover o fundo. Grátis, e você pode testar sem cadastro.'
} as const;

export const ptBrFlowTool = {
	h1: 'Comprima, redimensione e converta HEIC para JPG: é só pedir',
	subtitle:
		'Envie suas imagens ou PDFs, descreva numa frase o resultado que você quer, e o Mochify faz o resto.',
	uploadButton: 'Adicionar imagens, PDF ou vídeos',
	placeholder: 'Ex.: redimensionar para 1200 px de largura e converter para JPG',
	defaultPrompt: 'Comprimir em WebP, 1200 px de largura',
	badgeLine: 'Zero retenção · 25 grátis por mês · AVIF · JPEG XL · WebP · PDF · WebM',
	examples: [
		'Comprimir esta imagem',
		'Redimensionar para 1200 px de largura',
		'Converter este HEIC para JPG',
		'Converter este WebP para JPG',
		'Remover o fundo e deixar transparente',
		'Remover o fundo e deixar branco',
		'Cortar em quadrado de 1200 x 1200 px'
	],
	errors: {
		parse: 'Não entendemos essa instrução: tente de novo ou escreva de outro jeito.',
		connection:
			'A conexão caiu enquanto [nome do arquivo] estava sendo processado: verifique sua internet e tente de novo.',
		server: 'Ocorreu um erro no nosso servidor. Tente de novo em instantes.'
	}
} as const;

// The sheet lists eight chips. Six write a prompt; the last two are the
// component's menu expanders, which open a list rather than loading text.
export const ptBrFlowChips = [
	'Remover fundo',
	'Mercado Livre',
	'Shopee',
	'Cortar em quadrado',
	'PageSpeed',
	'Em PDF'
] as const;

// Two of the six prompts are specified by the sheet and used verbatim.
//
// Mercado Livre loads a 1200 x 1200 square and NO white background. That is not
// an omission: Mercado Livre's own current guidance tells sellers to avoid white
// backgrounds in most categories, with white still mandatory only in Tecnologia,
// Beleza, Saúde and Supermercado (ledger v48). Shopee loads a plain square,
// because no Shopee-specific rule is confirmed and nothing may be presented as
// that platform's rule without one.
//
// The other four were drafted dev-side, as on the French and Spanish pages,
// using only vocabulary the sheet itself uses. They are NOT native-reviewed.
export const ptBrFlowChipPrompts: readonly string[] = [
	'Remover o fundo e deixar transparente',
	'Cortar em quadrado de 1200 x 1200 px',
	'Cortar em quadrado',
	'Cortar em quadrado de 1200 x 1200 px',
	'Converter para WebP e comprimir',
	'Juntar em um único PDF'
];

export const ptBrFlowExpanders = {
	convertTo: 'Converter para…',
	rotate: 'Girar…'
} as const;

const PT_CHIP_DOTS = [
	'bg-purple-400',
	'bg-amber-400',
	'bg-orange-400',
	'bg-[#66BB6A]',
	'bg-[#4285F4]',
	'bg-rose-400'
];

export const ptBrFlowSections: PtSection[] = [
	{
		id: 'comprimir',
		heading: 'Comprimir: peso do arquivo ou tamanho em pixels',
		blocks: [
			{
				type: 'p',
				text: 'Comprimir uma imagem reduz o peso do arquivo, em MB ou KB, sem mudar a largura e a altura. Já o tamanho em pixels é outra coisa: a largura e a altura da imagem. Em português, “tamanho” serve para as duas coisas, e por isso uma busca como “diminuir o tamanho da foto” mistura ferramentas de compressão e de redimensionamento. Reduzir a largura em pixels costuma baixar o peso mais do que só comprimir uma imagem que mantém as dimensões originais: uma foto de celular com vários milhares de pixels de largura pesa bem mais, mesmo comprimida, do que a mesma foto reduzida para 1200 px de largura antes de comprimir. Por isso, se o objetivo é um arquivo mais leve para enviar por e-mail, anexar num formulário ou carregar rápido num site, o primeiro passo costuma ser diminuir a largura, e a compressão vem depois. Para JPG, o Mochify codifica com o jpegli. Se a imagem tem fundo transparente, converter para JPG não é a escolha certa, porque o formato não guarda transparência; nesse caso, peça PNG ou WebP. Cada necessidade é uma instrução diferente:'
			},
			{ type: 'prompt', text: 'Redimensionar para 1200 px de largura' },
			{ type: 'prompt', text: 'Comprimir esta imagem sem mudar a largura' }
		]
	},
	{
		id: 'redimensionar-e-cortar',
		heading: 'Redimensionar e cortar',
		blocks: [
			{
				type: 'p',
				text: 'Redimensionar muda a largura e a altura de uma imagem mantendo a proporção: toda a imagem continua visível, nada é removido. Cortar é diferente: remove uma parte da imagem para chegar num enquadramento ou numa proporção específica, por exemplo um quadrado para um anúncio. Basta pedir a largura ou a altura que o Mochify ajusta o outro lado na mesma proporção, e para cortar é só descrever o formato que você quer.'
			},
			{
				type: 'p',
				text: 'O Mochify nunca amplia uma imagem: o resultado nunca tem mais pixels do que o arquivo enviado, então reduzir funciona e ampliar não. A dúvida sobre centímetros aparece bastante, principalmente para impressão: uma imagem, na tela ou no arquivo, é medida em pixels, e a conversão para centímetros depende da resolução de impressão, o DPI, que muda conforme a impressora e o papel. Por isso o Mochify trabalha em pixels, não em centímetros.'
			},
			{
				type: 'p',
				text: 'Para um anúncio ou uma loja online, um corte quadrado dá o mesmo enquadramento a todas as fotos. O Mochify tenta localizar o objeto principal da imagem (o produto ou a pessoa) e centralizar o quadrado nele; funciona bem quando esse objeto é claro, mas em fotos com vários elementos ou um fundo carregado vale revisar o resultado antes de publicar.'
			},
			{ type: 'prompt', text: 'Cortar em quadrado de 1200 x 1200 px' }
		]
	},
	{
		id: 'heic-para-jpg',
		heading: 'HEIC para JPG',
		blocks: [
			{
				type: 'p',
				text: 'Se o seu iPhone salva as fotos em HEIC, e não em JPG, é porque esse é o formato que a Apple usa quando a câmera está em Alta Eficiência. Para mudar, abra Ajustes e toque em Câmera. Depois toque em Formatos e escolha Mais Compatível; a partir daí as fotos e os vídeos novos passam a usar os formatos JPEG ou H.264. A mudança vale para as fotos novas; as que você já tem continuam em HEIC. Ao compartilhar uma foto por AirDrop, Mensagens ou e-mail, o iPhone pode enviar a mídia já num formato mais compatível, como JPEG, se o outro aparelho não aceitar HEIC. Ao importar as fotos para um computador, elas também podem ser convertidas para JPEG, a menos que você escolha Manter Originais em Ajustes, Apps, Fotos.'
			},
			{
				type: 'p',
				parts: [
					'Se o arquivo vem de uma câmera Canon, Sony ou Fujifilm, e não de um celular, o normal é a extensão ser .HIF, não .HEIC. Os dois fazem parte da mesma família, HEIF, mas vêm de equipamentos diferentes e servem fluxos de trabalho diferentes: um é de celular e o outro de câmera profissional. O Mochify aceita os dois formatos. Para os arquivos de câmera existe uma página específica, ',
					{ href: '/solutions/hif-to-jpg', label: 'HIF para JPG (em inglês)' },
					'.'
				]
			},
			{ type: 'prompt', text: 'Converter este HEIC para JPG' }
		]
	},
	{
		id: 'outras-conversoes',
		heading: 'Outras conversões: WebP, PNG, AVIF e JPG',
		blocks: [
			{
				type: 'p',
				text: 'Além do HEIC, o Mochify converte entre WebP, PNG, AVIF e JPG, e o formato de saída pode ser qualquer um desses ou JPEG XL. É só descrever o que você quer numa frase, sem escolher menus ou configurações. Converter para JPG é útil quando um arquivo precisa abrir em qualquer programa ou formulário, já que WebP e AVIF nem sempre são aceitos. O ponto de atenção é a transparência: JPG não admite fundo transparente, então, se a imagem original é um PNG ou um WebP com fundo transparente, convertê-la para JPG faz a transparência se perder. Nesse caso, o formato certo continua sendo PNG ou WebP. Você pode enviar várias imagens de uma vez e pedir a mesma conversão para todas numa única instrução.'
			},
			{ type: 'prompt', text: 'Converter este WebP para JPG' }
		]
	},
	{
		id: 'fundo-branco-ou-transparente',
		heading: 'Fundo branco ou fundo transparente',
		blocks: [
			{
				type: 'p',
				text: 'O Mochify separa o objeto principal da imagem (o produto ou a pessoa) do fundo e devolve o arquivo de duas formas possíveis: com fundo transparente (em PNG ou WebP, por exemplo) ou com fundo branco liso. O fundo transparente serve para colocar a imagem sobre outro design; o fundo branco, para fichas de produto e anúncios que pedem esse padrão. A remoção de fundo está disponível em todos os planos, incluindo a conta gratuita, com 25 imagens por mês, e é pedida do mesmo jeito que qualquer outra operação, numa frase. Por enquanto, a cor de fundo que você pode pedir é o branco.'
			},
			{
				type: 'p',
				text: 'Para quem vende no Mercado Livre, vale saber o que a própria plataforma recomenda na sua orientação geral para vendedores: fotos quadradas, com largura e altura iguais, na resolução de 1200 x 1200 px, para que o comprador consiga dar zoom. Sobre o fundo, o Mercado Livre orienta os vendedores a evitar fundos brancos: eles continuam permitidos, mas deixaram de ser obrigatórios na maioria das categorias, e o fundo branco ainda é exigido em Tecnologia, Beleza, Saúde e Supermercado. Por isso, o atalho “Mercado Livre” desta página corta em quadrado de 1200 x 1200 px e não coloca fundo branco.'
			},
			{ type: 'prompt', text: 'Remover o fundo e deixar transparente' },
			{ type: 'prompt', text: 'Remover o fundo e deixar branco' }
		]
	},
	{
		id: 'formatos-aceitos',
		heading: 'Formatos aceitos',
		blocks: [
			{
				type: 'p',
				text: 'O Mochify aceita como entrada JPG, PNG, WebP, AVIF, HEIC e HEIF (incluindo o .HIF de câmera), JPEG XL e SVG. Não aceita TIFF, BMP, RAW de câmera nem PSD. Como saída, você pode pedir JPG (codificado com jpegli), PNG, WebP, AVIF ou JPEG XL, e uma única instrução pode pedir mais de um formato ou mais de uma largura ao mesmo tempo, por exemplo WebP e AVIF em dois tamanhos diferentes, sem repetir o pedido para cada variação. Para quem administra um site ou uma loja online, WebP e AVIF geram arquivos mais leves do que um JPG ou PNG com qualidade parecida, o que ajuda a reduzir o tempo de carregamento da página, principalmente no celular; o JPEG XL também é mais leve, mas ainda não é exibido por todos os navegadores. O Magic Flow, a forma de descrever numa frase o que você quer, também está disponível na extensão do Chrome (em inglês), na linha de comando e por MCP.'
			},
			{ type: 'prompt', text: 'Converter para WebP e AVIF, 1200 px e 600 px de largura' }
		]
	},
	{
		id: 'privacidade',
		heading: 'Privacidade',
		blocks: [
			{
				type: 'p',
				text: 'As imagens e os PDFs que você envia ao Mochify são transmitidos para o servidor do Mochify, api.mochify.app, processados em memória, nunca gravados em disco, nunca armazenados e nunca usados para treinar uma IA.'
			}
		]
	}
];

export const ptBrFlowFaqs: FaqItem[] = [
	{
		q: 'Como faço para diminuir o tamanho de uma foto?',
		a: 'Depende do que você quer diminuir: o peso do arquivo, em MB ou KB, ou a largura e a altura em pixels. Para reduzir o peso, o mais eficaz costuma ser diminuir a largura em pixels antes de comprimir. Peça “redimensionar para 1200 px de largura”, deixe o Mochify ajustar a altura na mesma proporção, e comprima em seguida se ainda precisar de um arquivo mais leve.'
	},
	{
		q: 'Como reduzir uma imagem para 1 MB?',
		a: 'Não dá para garantir um peso exato, como “1 MB” ou “2 MB”. O caminho que funciona hoje é reduzir a largura em pixels, porque isso é o que mais derruba o peso de um arquivo: peça “redimensionar para 1200 px de largura” e comprima em seguida. Quanto menor a largura, menor tende a ser o peso final do arquivo.'
	},
	{
		q: 'Por que minhas fotos estão no formato HEIC?',
		a: 'Porque o iPhone salva as fotos nesse formato quando a câmera está configurada em Alta Eficiência, em Ajustes, Câmera, Formatos. Segundo a Apple, o HEIF ocupa menos espaço. Para mudar esse ajuste, escolha Mais Compatível em vez de Alta Eficiência; a partir daí as fotos novas passam a ser salvas em JPEG.'
	},
	{
		q: 'Qual programa abre o arquivo HEIC?',
		a: 'Nos aparelhos da Apple, um arquivo HEIC abre normalmente, como qualquer outra foto. Em outros aparelhos, e em muitos programas de Windows, o arquivo pode não abrir sem instalar algo à parte. O caminho mais simples é converter para JPG: envie o arquivo ao Mochify e peça “converter para JPG”. O JPG abre em qualquer aparelho ou programa.'
	},
	{
		q: 'Qual a diferença entre HEIC e JPG?',
		a: 'HEIC é o formato que o iPhone usa quando a câmera está em Alta Eficiência, e ocupa menos espaço que um JPG, mas nem todo programa ou site aceita HEIC direto. JPG é mais antigo e abre em praticamente qualquer lugar. Arquivos de câmeras profissionais Canon, Sony e Fujifilm usam a extensão .HIF, da mesma família HEIF, mas num fluxo de trabalho de câmera.'
	},
	{
		q: 'Qual é melhor, PNG ou WebP?',
		a: 'Depende do que a imagem precisa. PNG é a escolha certa quando o fundo precisa ser transparente ou a imagem tem bordas nítidas, como um logotipo. WebP costuma gerar um arquivo mais leve com qualidade parecida, inclusive com transparência, e os navegadores atuais exibem WebP. Para converter entre os dois, envie o arquivo ao Mochify e descreva o formato que você quer.'
	},
	{
		q: 'Como colocar fundo branco numa imagem?',
		a: 'Envie a foto ao Mochify e escreva uma instrução como “remover o fundo e deixar branco”. O Mochify separa o objeto principal do fundo original e devolve a imagem com um fundo branco liso. A remoção de fundo está disponível em todos os planos, incluindo a conta gratuita, com 25 imagens por mês. No Mercado Livre, o fundo branco continua obrigatório em Tecnologia, Beleza, Saúde e Supermercado e deixou de ser obrigatório na maioria das outras categorias.'
	},
	{
		q: 'Qual o tamanho da imagem do produto no Mercado Livre?',
		a: 'Na orientação geral para vendedores, o Mercado Livre recomenda fotos quadradas, com largura e altura iguais, de 1200 x 1200 px, para que o comprador consiga dar zoom na imagem. Sobre o fundo, a plataforma orienta a evitar o fundo branco, que deixou de ser obrigatório na maioria das categorias; ele continua exigido em Tecnologia, Beleza, Saúde e Supermercado.'
	},
	{
		q: 'Como cortar uma imagem pelo celular?',
		a: 'Pelo navegador do celular, abra o Mochify, envie a foto e escreva uma instrução como “cortar em quadrado”. Não é preciso instalar nenhum aplicativo: o corte é feito no servidor, e o resultado fica pronto para baixar direto no celular. Para anúncios no Mercado Livre, peça “cortar em quadrado de 1200 x 1200 px”, o tamanho que a plataforma recomenda.'
	}
];

export const PT_BR_PROMPT_FORM_STRINGS: Partial<PromptFormStrings> = {
	uploadButton: ptBrFlowTool.uploadButton,
	imagePlaceholders: [ptBrFlowTool.placeholder],
	convertToLabel: ptBrFlowExpanders.convertTo,
	rotateLabel: ptBrFlowExpanders.rotate,
	errorParse: ptBrFlowTool.errors.parse,
	errorServer: ptBrFlowTool.errors.server,
	// The sheet writes the file name as [nome do arquivo]; the component has the
	// real one, so the placeholder is substituted rather than shown literally.
	errorConnection: (fileName: string) =>
		ptBrFlowTool.errors.connection.replace('[nome do arquivo]', fileName),
	imageSuggestions: ptBrFlowChips.map((label, i) => ({
		label,
		prompt: ptBrFlowChipPrompts[i],
		dot: PT_CHIP_DOTS[i]
	}))
};
