// Japanese copy for /ja/flow, extracted from the content-ops copy sheet
// (`article-originals/ja/flow.md`, drafted 2026-09-24) by a script that reads the
// sheet directly, so every string is character for character what it says: the
// 「」 quotes, the half-width digits in `1200px` and `20MB`, no space between
// Japanese and Latin text, and the ？ closing each FAQ question.
//
// DO NOT edit the Japanese here. The copy sheet is the source of record; a change
// arrives as a handoff and is re-extracted. Native review happens on the live
// page after launch (strategy/2026-09-24-ja-localisation-pilot.md §8).
//
// No language claim appears anywhere on the page: the parse test (handoff Part B)
// has not run, so the page teaches Japanese prompts by example and never says the
// parser understands Japanese.
//
// Full-width input (１２００ｐｘ) is NOT handled here. It is normalised in the
// worker, on the way into the parse, so the visitor's own text stays as they
// typed it and every surface benefits, not just this page. See normalizePrompt
// in mochify-worker/src/lang.ts (handoff A7).

import type { PromptFormStrings } from '$lib/i18n/promptForm';
import type { FaqItem, FaqPart } from '$lib/faq';

export type JaSectionBlock =
	{ type: 'prompt'; text: string } | { type: 'p'; text: string } | { type: 'p'; parts: FaqPart[] };
export type JaSection = { id: string; heading: string; blocks: JaSectionBlock[] };

export const jaFlowMeta = {
	title: '画像圧縮・HEICをJPGに変換｜無料オンライン | Mochify',
	metaDescription:
		'無料でHEIC・WebP・PNG・JPGの変換、圧縮、リサイズ、背景の透過・白背景をまとめて処理。登録なしで試せます。「JPGに変換して1200pxに」のように、やりたいことを文章で書くだけ。インストール不要。',
	ogTitle: 'HEIC・WebP・PNGをJPGに変換、圧縮、背景透過もまとめて',
	ogDescription:
		'やりたいことを一文で書くだけ。画像の変換・圧縮・リサイズ、背景の透過や白背景まで。無料で、登録なしでも試せます。'
} as const;

export const jaFlowTool = {
	h1: '画像を圧縮、HEICをJPGに変換：やりたいことを文章で書くだけ',
	subtitle: '画像やPDFをアップロードして、欲しい結果を一文で書くだけ。あとはMochifyが処理します。',
	uploadButton: '画像・PDF・動画を追加',
	placeholder: '例：JPGに変換して、横幅1200pxに',
	defaultPrompt: 'JPGに変換、横幅1200px',
	badgeLine: 'データ保持なし・1か月25枚無料・AVIF・JPEG XL・WebP・PDF・WebM',
	examples: [
		'このHEICをJPGに変換',
		'画像を圧縮して軽くする',
		'横幅1200pxにリサイズ',
		'このWebPをJPGに変換',
		'背景を透過にする',
		'背景を白にする',
		'メルカリ用に正方形にトリミング、720px、JPGで'
	],
	errors: {
		parse: '指示の内容を理解できませんでした。別の言い方でもう一度お試しください。',
		connection:
			'[ファイル名]の処理中に接続が切れました。通信状況を確認して、もう一度お試しください。',
		server: 'サーバー側でエラーが発生しました。しばらくしてからもう一度お試しください。'
	}
} as const;

// The sheet lists seven chips and a load string for each. Five write a prompt
// into the box. The last two, 変換… and 回転…, are the component's menu
// expanders: they open a list of formats and angles rather than loading text, so
// their labels are used and their load strings are not. Flagged to content-ops
// rather than worked around, per A6.
//
// PageSpeed also differs in KIND from the English chip, which converts and
// compresses; the Japanese one converts and resizes to 1200px. The sheet's
// string is used as written, per Part C, and the difference reported.
export const jaFlowChips = [
	'背景を削除',
	'メルカリ',
	'正方形にトリミング',
	'PageSpeed',
	'PDFに'
] as const;

export const jaFlowChipPrompts: readonly string[] = [
	'背景を削除',
	'メルカリ用に正方形にトリミング、720px、JPGで',
	'正方形にトリミング',
	'ウェブ用にWebPに変換、横幅1200px',
	'PDFにまとめる'
];

export const jaFlowExpanders = {
	convertTo: '変換…',
	rotate: '回転…'
} as const;

// Presentational, shared with the English set where a chip means the same thing.
// メルカリ has no English counterpart and takes an unused palette colour rather
// than a brand hex nobody has verified.
const JA_CHIP_DOTS = [
	'bg-purple-400',
	'bg-amber-400',
	'bg-[#66BB6A]',
	'bg-[#4285F4]',
	'bg-rose-400'
];

export const jaFlowSections: JaSection[] = [
	{
		id: 'compress',
		heading: '画像を圧縮して容量を小さくする',
		blocks: [
			{
				type: 'p',
				text: '画像の「サイズ」という言葉は、縦横のサイズ（ピクセル数）と容量（MBやKBで表すファイルの重さ）の両方の意味で使われるため、混同されがちです。この2つは別のものですが、互いに関係しています。ピクセル数を減らすと、容量もそれに応じて軽くなります。そのため画像を軽くしたいときは、多くの場合、まず幅を小さくするのがいちばん効果的です。幅は変えずに容量だけを軽くしたい場合は、圧縮だけを指示することもできます。MochifyはJPGの出力に、jpegliというエンコーダーを使っています。画像が軽くなればページの読み込みが速くなり、通信量やストレージの節約にもつながります。とくにウェブサイトを運営している場合は効果が大きくなります。どちらの操作も、一文で指示するだけです。'
			},
			{ type: 'prompt', text: '横幅1200pxにリサイズ' },
			{ type: 'prompt', text: '幅を変えずに圧縮' }
		]
	},
	{
		id: 'heic-to-jpg',
		heading: 'HEICをJPGに変換する',
		blocks: [
			{
				type: 'p',
				text: 'iPhoneのカメラのフォーマットが「高効率」になっていると、写真はHEIC形式で保存されます。HEICは同程度の画質でもJPGよりファイルの容量を抑えられる形式です。JPGで保存したい場合は、「設定」を開き、「カメラ」をタップします。「フォーマット」をタップし、「互換性優先」をタップすると、新しく撮影する写真がJPEGで保存されます。この設定で変わるのは新しく撮影する写真だけなので、撮影済みのHEICは別途変換が必要です。'
			},
			{
				type: 'p',
				text: 'Appleによると、AirDrop、メッセージ、メールなどで共有すると、受信側のデバイスによっては、JPEGなど対応する可能性が高い形式で自動的に共有されることがあります。USBでパソコンに取り込むときにも変換されることがあり、元のHEICのまま取り込みたい場合は、「設定」を開いて「アプリ」＞「写真」の順にタップし、下にスクロールして「元のフォーマットのまま」をタップしてください。'
			},
			{
				type: 'p',
				parts: [
					'キヤノン、ソニー、富士フイルムのカメラで撮影した場合は、拡張子が.HEICではなく.HIFになっていることがあります。どちらも同じHEIFという技術がベースですが、スマホとカメラという異なる機器・ワークフロー向けのものです。Mochifyはどちらの形式にも対応しています。カメラの.HIFファイルについては、',
					{ href: '/solutions/hif-to-jpg', label: 'HIF→JPG（英語）' },
					'のページも参考にしてください。'
				]
			},
			{ type: 'prompt', text: 'HEICをJPGに変換' }
		]
	},
	{
		id: 'webp-png-avif-to-jpg',
		heading: 'WebP・PNG・AVIFをJPGに変換する',
		blocks: [
			{
				type: 'p',
				text: '写真共有サイトやSNS、ウェブサイトから画像を保存すると、WebP形式で保存されることがあります。WebPは同程度の画質でもJPGより軽い容量で保存できる形式で、ウェブサイトの表示を速くする目的でよく使われています。MochifyはWebP、PNG、AVIFをJPGに変換でき、一文の指示で複数の画像をまとめて処理することもできます。透過背景のPNGをJPGに変換すると、JPGは透過に対応していないため背景は透過ではなくなります。透過を保ちたい場合は、出力形式にPNGかWebPを指定してください。'
			},
			{ type: 'prompt', text: 'このWebPをJPGに変換' }
		]
	},
	{
		id: 'resize-and-square-crop',
		heading: 'リサイズと正方形トリミング',
		blocks: [
			{
				type: 'p',
				text: 'リサイズは画像の縦横の比率を保ったまま、指定した幅または高さに合わせて縮小します。画像の内容は変わらず、全体がそのまま残ります。一方トリミングは、正方形など特定の比率に合わせて画像の一部を取り除きます。指示を書くときも、全体を残したいなら「リサイズ」、一部を切り取ってよいなら「トリミング」と使い分けてください。リサイズでは幅か高さのどちらかを指定すれば、もう一方は同じ比率でMochifyが調整します。'
			},
			{
				type: 'p',
				text: 'Mochifyは画像を拡大しません。出力のピクセル数は常に元の画像を超えないため、JPG画像を元より大きくすることはできません。画面や画像ファイルはピクセル単位で測られており、印刷時のセンチメートルへの換算は解像度（DPI）に左右されるため、使う機器や印刷方法によって変わります。そのため、サイズはセンチメートルではなくピクセルで指定してください。'
			},
			{
				type: 'p',
				text: '正方形にトリミングする際、Mochifyは画像の被写体をできる範囲で自動的に検出し、その位置を基準に正方形を切り出します。被写体がはっきりしている画像ではうまく機能しますが、要素が多い画像や背景が複雑な画像では、出品や公開の前に結果を確認することをおすすめします。'
			},
			{
				type: 'p',
				text: 'メルカリの出品画像は正方形で表示されます。メルカリの公式コラムは、「720×720」「640×640」など正方形かつ大きすぎず小さすぎないサイズをすすめています。同じコラムによると、長方形のまま登録することもできますが、正方形で表示されたときに歪んで見えることがあります。1回の出品で登録できる写真は20枚までです（メルカリヘルプセンター）。Mochifyは拡大しないため、720pxの正方形にするには、元の写真の短い辺が720px以上ある必要があります。'
			},
			{ type: 'prompt', text: '高さ800pxにリサイズ' },
			{ type: 'prompt', text: 'メルカリ用に正方形にトリミング、720px、JPGで' }
		]
	},
	{
		id: 'background',
		heading: '背景を透過・白にする',
		blocks: [
			{
				type: 'p',
				text: 'Mochifyでは、被写体と背景を分離して、背景を透過にするか白一色にするかを指示で選べます。透過背景はPNGで書き出せば、別のデザインの上に重ねて使えます。白背景は商品写真や出品用の画像に向いています。この機能は無料アカウント（1か月25枚）を含むすべてのプランで使え、他の操作と同じように一文の指示で行えます。Mochifyが用意している背景色は白のみです。'
			},
			{ type: 'prompt', text: '背景を白にする' }
		]
	},
	{
		id: 'formats-and-exif',
		heading: '対応形式と位置情報',
		blocks: [
			{
				type: 'p',
				text: 'Mochifyが画像として受け付ける形式は、JPG、PNG、WebP、AVIF、HEIC・HEIF（カメラの.HIFを含む）、JPEG XL、SVGです。TIFF、BMP、カメラのRAW、PSDには対応していません。画像の出力形式として指定できるのはJPG（jpegliエンコード）、PNG、WebP、AVIF、JPEG XLで、一文の指示で複数の形式や複数の幅をまとめて指定することもできます。写真には撮影日時や位置情報などのEXIF情報が含まれていることがあります。「位置情報（EXIF）を削除」と指示すれば、位置情報を含むEXIF情報をまとめて取り除けます。サイトやネットショップを運営している場合、WebPやAVIFはJPGやPNGと同程度の画質のまま容量を軽くできるため、ページの表示速度に効果があります。JPEG XLも軽量ですが、対応しているブラウザはまだ限られます。文章で指示するMagic Flowは、Chrome拡張機能、コマンドライン、MCPでも使えます（拡張機能の画面表示は英語です）。'
			},
			{ type: 'prompt', text: 'WebPとAVIFに変換、1200pxと600px' },
			{ type: 'prompt', text: '位置情報（EXIF）を削除' }
		]
	},
	{
		id: 'privacy',
		heading: 'プライバシー',
		blocks: [
			{
				type: 'p',
				text: 'アップロードした画像やPDFは、Mochifyのサーバー（api.mochify.app）に送信され、メモリ上で処理されます。ディスクに書き込まれることはなく、保存されることも、AIの学習に使われることもありません。'
			}
		]
	}
];

export const jaFlowFaqs: FaqItem[] = [
	{
		q: '画像の容量を小さくするにはどうすればいいですか？',
		a: '画像の容量（ファイルの重さ）を軽くするには、縦横のサイズ（ピクセル数）を減らすのが効果的です。ピクセル数を減らすと、容量もそれに応じて軽くなります。Mochifyに画像をアップロードし、「横幅1200pxにリサイズして圧縮」のように一文で指示すれば、リサイズと圧縮をまとめて行えます。'
	},
	{
		q: 'iPhoneで写真を圧縮するには？',
		a: 'パソコンでもiPhoneのブラウザでも、写真をMochifyにアップロードして「圧縮して」や「横幅1200pxにリサイズ」と指示するだけです。アプリのインストールは必要ありません。無料アカウントなら1か月25枚まで利用できます。'
	},
	{
		q: 'iPhoneでHEICをJPGに変換するには？',
		a: 'iPhoneで撮った写真（HEIC形式）をMochifyにアップロードし、「JPGに変換」と指示すれば、新しいJPGファイルが作成されます。元のHEICファイルやiPhoneの設定はそのままです。複数の写真をまとめてアップロードして、一度に変換することもできます。'
	},
	{
		q: 'なぜHEICファイルになってしまうのか？',
		a: 'iPhoneのカメラのフォーマットが「高効率」になっていると、写真はHEIC形式で保存されます。HEICは同程度の画質でもJPGより容量を抑えられる形式です。JPGで保存したい場合は、「設定」の「カメラ」＞「フォーマット」で「互換性優先」を選ぶと、新しく撮影する写真がJPEGで保存されます。'
	},
	{
		q: 'HEICファイルを大量にJPGに変換するにはどうすればいいですか？',
		a: [
			'MochifyにHEICファイルを複数まとめてアップロードし、「JPGに変換」と一文で指示すれば、アップロードしたすべての画像がまとめて変換されます。一度に処理できるのは、無料アカウントで3枚（1か月25枚まで、1ファイル20MBまで）、有料プランで25枚（1ファイル75MBまで）です。アカウントなしでも1か月3枚まで試せます。プランの詳細は',
			{ href: '/ja/pricing', label: '料金ページ' },
			'で確認できます。'
		]
	},
	{
		q: 'PNGとJPGどっちが画質いい？',
		a: '形式としては、PNGは画質が劣化しない可逆圧縮、JPGは容量を小さくするために画質を少し落とす非可逆圧縮です。ただ、実際には用途で選びます。JPGは写真向けで、同じ写真ならPNGよりずっと小さな容量で保存できますが、透過には対応していません。PNGは透過や、文字・ロゴのようなくっきりした線を保つのに向いていますが、写真では容量が大きくなりがちです。写真ならJPG、透過や図版ならPNGが目安です。'
	},
	{
		q: 'JPG画像サイズを大きくするにはどうすればいいですか？',
		a: '縦横のサイズ（ピクセル数）を元より大きくすることは、Mochifyではできません。出力のピクセル数は常に元の画像以下になります。大きな画像が必要な場合は、より高い解像度で撮影またはスキャンしたファイルを用意してください。'
	},
	{
		q: 'メルカリで写真サイズが合わないのはなぜですか？',
		a: 'メルカリの出品画像は正方形で表示されるため、長方形のまま登録すると見え方が変わることがあります。メルカリの公式コラムは「720×720」「640×640」など正方形のサイズをすすめています。Mochifyに画像をアップロードし、「メルカリ用に正方形にトリミング、720px、JPGで」と指示すれば、720pxの正方形で書き出せます（元の写真の短い辺が720px以上ある場合）。'
	},
	{
		q: '画像の背景を白くするにはどうすればいいですか？',
		a: 'Mochifyに画像をアップロードし、「背景を白にする」と指示すると、被写体と背景を分離して白一色の背景に置き換えます。透過が必要な場合は「背景を透過にする」と指示してください。無料アカウント（1か月25枚）を含むすべてのプランで使えます。'
	}
];

export const JA_PROMPT_FORM_STRINGS: Partial<PromptFormStrings> = {
	uploadButton: jaFlowTool.uploadButton,
	imagePlaceholders: [jaFlowTool.placeholder],
	convertToLabel: jaFlowExpanders.convertTo,
	rotateLabel: jaFlowExpanders.rotate,
	errorParse: jaFlowTool.errors.parse,
	errorServer: jaFlowTool.errors.server,
	// The sheet writes the file name as [ファイル名]; the component has the real
	// one, so the placeholder is substituted rather than shown literally.
	errorConnection: (fileName: string) =>
		jaFlowTool.errors.connection.replace('[ファイル名]', fileName),
	imageSuggestions: jaFlowChips.map((label, i) => ({
		label,
		prompt: jaFlowChipPrompts[i],
		dot: JA_CHIP_DOTS[i]
	}))
};
