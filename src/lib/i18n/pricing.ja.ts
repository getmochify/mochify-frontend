// Japanese pricing copy.
//
// PROVENANCE. The localisation plan says the devs never write Japanese, and this
// page has no copy sheet: content-ops has written `article-originals/ja/flow.md`
// and nothing for /pricing. The Japanese handoff (2026-09-24, A10) makes this
// file the dev's explicitly, on the same footing as `pricing.fr.ts` and
// `pricing.es.ts`, and says to build it right the first time. It is NOT
// native-reviewed; content-ops checks the claims once live and the native
// reviewer reads it too.
//
// House rules taken from the /ja/flow sheet: half-width digits, no space between
// Japanese and Latin text (so `20MB` and `17%`, never `20 MB`), 「」 for quotes,
// and zero em dashes and zero ― (U+2015).
//
// Prices are NOT written here. Polar charges in JPY for a Japanese connection
// (operator-confirmed, ledger v47) and every figure on the page is formatted from
// what Polar returns, so a Japanese reader abroad correctly sees their own
// currency rather than yen baked into the copy.
//
// Two things the French and English pages carry are deliberately absent, per
// A10: no per-image cost figures anywhere, and Growth is named everywhere Seller
// and Pro are.

import type { PricingStrings } from '$lib/i18n/pricing';

export const JA_PRICING: PricingStrings = {
	eyebrow: 'どこでも使える画像ツール',
	h1Before: 'わかりやすい',
	h1Accent: '料金',
	h1After: 'プラン',
	heroSub: '始めるのに契約は不要です。まず無料で試して、必要になったらプランを変更できます。',
	surfaces: 'ウェブ・CLI・Chrome拡張機能・MCP・API',
	billingMonthly: '月払い',
	billingYearly: '年払い',
	saveExact: (pct) => `${pct}%お得`,
	saveUpTo: (pct) => `最大${pct}%お得`,
	mostPopular: '人気',
	perMonth: '/ 月',
	perYear: '/ 年',
	perForever: '/ ずっと無料',
	oneTime: '買い切り',
	or: 'または',
	perYearInline: (price) => `${price} / 年`,
	billedAnnually: (monthly) => `月あたり${monthly}、年額でのお支払い`,
	percentOff: (pct) => `${pct}%割引`,
	vsMonthly: '月払いと比べて',
	everythingInSeller: 'Sellerのすべてに加えて：',
	everythingInPro: 'Proのすべてに加えて：',
	sellerFeatures: [
		'1か月<strong>300枚</strong>',
		'1ファイル<strong>75MB</strong>まで',
		'1回に<strong>25ファイル</strong>',
		'<strong>PDFツール</strong>をすべて利用可能',
		'<strong>Google Drive</strong>や自分のバケットに保存',
		'<strong>優先</strong>処理'
	],
	proFeatures: [
		'1か月<strong>1,200枚</strong>',
		'<strong>4倍の枚数</strong>を3倍ほどの料金で',
		'<strong>最優先</strong>の処理キュー',
		'メールサポートを優先対応'
	],
	growthFeatures: [
		'1か月<strong>5,000枚</strong>',
		'<strong>PDFのページ数無制限</strong> <span class="text-[#6C3F31]/50">（他のプランは10ページまで）</span>',
		'<strong>200枚</strong>の画像からPDFを作成'
	],
	freeFeatures: [
		'1か月<strong>25枚</strong>',
		'1ファイル<strong>20MB</strong>まで',
		'1回に<strong>3ファイル</strong>まで',
		'背景の削除',
		'標準の処理キュー'
	],
	dayPassFeatures: [
		'24時間で<strong>100枚</strong>アップロード',
		'1ファイル<strong>75MB</strong>、まとめて処理も可能',
		'契約もアカウントも不要',
		'マジックリンクですぐに利用開始'
	],
	ctaSeller: 'Sellerを選ぶ',
	ctaPro: 'Proを選ぶ',
	ctaGrowth: 'Growthを選ぶ',
	ctaFree: '無料で始める',
	ctaDayPass: (price) => `Day Passを${price}で購入`,
	noSignupLink: '登録なしで3枚試す',
	flowHref: '/ja/flow',
	privacyLead: '設計としてのプライバシー。',
	privacyBody:
		'画像はメモリ上で処理され、保存されることも、AIの学習に使われることもありません。',
	privacyHref: '/privacy',
	learnMore: '詳しく見る →',
	orNoSubscription: '契約なしで使うなら',
	fullComparison: 'プラン比較',
	tblFeature: '機能',
	tblMonthlyImages: '1か月の枚数',
	tblMaxFileSize: '1ファイルの上限',
	tblSizeFree: '20MB',
	tblSizePaid: '75MB',
	tblHeicUpload: 'HEICのアップロード',
	tblResizeRotateCrop: 'リサイズ・回転・トリミング',
	tblBackgroundRemoval: '背景の削除',
	tblAiBackgrounds: 'AIによる背景と影',
	tblMcpApi: 'MCP・APIの利用',
	tblBatchUpload: 'まとめてアップロード',
	tblQueue: '処理キュー',
	tblPdfTools:
		'PDFツール <span class="text-[#6C3F31]/50 text-xs">（ラスタライズ、分割、画像→PDF）</span>',
	tblOwnStorage:
		'自分のストレージに保存 <span class="text-[#6C3F31]/50 text-xs">（Google Drive、S3 / R2 / S3互換）</span>',
	tblPerMonth: (n) => `${n.toLocaleString('ja')} / 月`,
	tblFiles: (n) => `${n}ファイル`,
	tblQueueStandard: '標準',
	tblQueuePriority: '優先',
	tblQueueTop: '最優先',
	tblSoon: '近日対応',
	tblNotIncluded: 'なし',
	tblPdfFree: '画像→PDF、3ページ',
	tblPdfUnlimited: '✓ ページ数無制限',
	faqHeading: 'よくある質問',
	faqSub: '上限、お支払い、プラン変更で変わることについて。',
	faqs: (dayPassPrice) => [
		{
			q: '1枚としてカウントされるのはどの操作ですか？',
			a: 'お返しした画像1枚につき、1か月の枚数から1枚分が使われます。1つのファイルを圧縮、変換、リサイズしても、それらを組み合わせても、1枚です。同じファイルから複数の形式や複数のサイズを指定した場合は、書き出される画像の数だけカウントされます。WebPとAVIFを2つの幅で指定すれば4枚です。まとめてアップロードした場合は、1ファイルにつき1枚です。'
		},
		{
			q: '使わなかった枚数は翌月に繰り越せますか？',
			a: 'いいえ。無料プランは使い始めた日を起点とする30日ごとにリセットされ、Seller、Pro、Growthはお支払い日にリセットされます。使わなかった枚数は繰り越されません。'
		},
		{
			q: 'SellerよりProのほうがお得ですか？',
			a: '枚数によります。Proは4倍の枚数を3倍ほどの料金で使えるため、1枚あたりは約22%安くなります。月払いでも年払いでも同じです。Proは処理キューでも先に処理され、メールサポートも優先されます。1か月300枚に収まっているなら、Sellerのほうが向いています。'
		},
		{
			q: '無料プランでもAPIを使えますか？',
			a: 'はい。すべてのプランでMCPとAPIをフルに利用できます。1か月の上限は同じように適用されます。'
		},
		{
			q: 'Day Passはどのように使いますか？',
			a: `${dayPassPrice}をお支払いいただくと、マジックリンクをメールでお送りします。リンクを開くと24時間のあいだ、画像を100枚までアップロードでき、1ファイル75MBまで、まとめての処理も可能になります。アカウントも契約も必要ありません。`
		},
		{
			q: 'いつでも解約できますか？',
			a: 'はい。いつでも解約でき、お支払い期間の終わりまでは引き続きご利用いただけます。'
		}
	],
	ctaHeading: 'まず無料で始めて、足りなくなったらプランを変更',
	ctaBody:
		'無料プランは1か月25枚、クレジットカードは不要です。MCP、CLI、APIは無料プランを含むすべてのプランで使えます。',
	ctaCreateAccount: '無料アカウントを作成 →',
	ctaTryFree: '登録なしで3枚試す',
	ctaContactBefore: 'どのプランが合うか迷ったら、こちらまで：',
	ctaContactAfter: '',
	metaTitle: '料金 | Mochify',
	metaDescription:
		'わかりやすい料金プラン。登録なしで3枚、無料アカウントなら1か月25枚。Sellerは300枚、Proは1,200枚、Growthは5,000枚。契約なしのDay Passなら24時間で100枚アップロードできます。',
	schemaUrl: 'https://mochify.app/ja/pricing',
	schemaDescription:
		'わかりやすい料金プラン。登録なしで3枚、無料アカウントなら1か月25枚。Sellerは1か月300枚、Proは1,200枚、Growthは5,000枚です。',
	schemaOffers: [
		{
			plan: null,
			name: 'Free',
			description: () =>
				'アカウントなしで3枚。無料アカウントなら1か月25枚。すべての形式、リサイズ、回転、トリミング、背景の削除、MCPとAPIの利用を含みます。標準の処理キュー。'
		},
		{
			plan: 'sellerMonthly',
			name: 'Seller 月払い',
			unitCode: 'MON',
			description: () =>
				'1か月300枚。すべての形式、リサイズ、回転、トリミング、背景の削除、MCPとAPIの利用を含みます。1ファイル75MBまで。優先処理キュー。'
		},
		{
			plan: 'proMonthly',
			name: 'Pro 月払い',
			unitCode: 'MON',
			description: () =>
				'1か月1,200枚。すべての形式、リサイズ、回転、トリミング、背景の削除、MCPとAPIの利用を含みます。1ファイル75MBまで。最優先の処理キュー。'
		},
		{
			plan: 'growthMonthly',
			name: 'Growth 月払い',
			unitCode: 'MON',
			description: () =>
				'1か月5,000枚。Proのすべてに加えて、PDFのページ数無制限と、200枚の画像からのPDF作成。結果を自分のバケットやGoogle Driveに保存できます。最優先の処理キュー。'
		},
		{
			plan: 'sellerYearly',
			name: 'Seller 年払い',
			unitCode: 'ANN',
			description: (price) =>
				`1か月300枚、年額${price}のお支払い。背景の削除を含みます。1ファイル75MBまで。優先処理キュー。`
		},
		{
			plan: 'proYearly',
			name: 'Pro 年払い',
			unitCode: 'ANN',
			description: (price) =>
				`1か月1,200枚、年額${price}のお支払い。背景の削除を含みます。1ファイル75MBまで。最優先の処理キュー。`
		},
		{
			plan: 'growthYearly',
			name: 'Growth 年払い',
			unitCode: 'ANN',
			description: (price) =>
				`1か月5,000枚、年額${price}のお支払い。PDFのページ数無制限。最優先の処理キュー。`
		},
		{
			plan: 'dayPass',
			name: 'Day Pass',
			description: () =>
				'24時間の買い切りパス。画像を100枚までアップロードでき、1ファイル75MBまで、まとめての処理も可能です。契約もアカウントも不要で、マジックリンクですぐに使えます。'
		}
	]
};
