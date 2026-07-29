// Build-time Open Graph card generator.
//
//   bun run og
//
// Renders one 1200x630 PNG per entry in src/lib/og/cards.js (plus a generic
// default.png) into static/og/, using satori (HTML/CSS -> SVG) and resvg
// (SVG -> PNG). satori embeds glyphs as vector paths, so resvg needs no fonts.
// The PNGs are committed; re-run this whenever card copy in cards.js changes.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { cards, slugFor } from '../src/lib/og/cards.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(root, 'static', 'og');
const WIDTH = 1200;
const HEIGHT = 630;

const font = (rel) => readFileSync(join(root, 'node_modules/@fontsource', rel));
const fonts = [
	{
		name: 'Outfit',
		data: font('outfit/files/outfit-latin-800-normal.woff'),
		weight: 800,
		style: 'normal'
	},
	{
		name: 'Outfit',
		data: font('outfit/files/outfit-latin-700-normal.woff'),
		weight: 700,
		style: 'normal'
	},
	{
		name: 'Nunito',
		data: font('nunito/files/nunito-latin-700-normal.woff'),
		weight: 700,
		style: 'normal'
	},
	{
		name: 'Nunito',
		data: font('nunito/files/nunito-latin-600-normal.woff'),
		weight: 600,
		style: 'normal'
	}
];

const logo = readFileSync(join(root, 'static', 'logo.png'));
const LOGO_URI = `data:image/png;base64,${logo.toString('base64')}`;

// Tiny hyperscript helper so we can build satori's element tree without JSX.
const h = (type, props, ...children) => ({
	type,
	props: {
		...props,
		children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children
	}
});

// The "latin" font subset lacks a few glyphs that appear in titles; swap them
// for covered equivalents so nothing renders as tofu.
const sanitize = (s) => s.replace(/‑/g, '-'); // non-breaking hyphen -> hyphen

function titleSize(title) {
	const n = title.length;
	if (n <= 30) return 74;
	if (n <= 50) return 62;
	if (n <= 78) return 52;
	return 44;
}

function card({ eyebrow, title }) {
	title = sanitize(title);
	return h(
		'div',
		{
			style: {
				width: `${WIDTH}px`,
				height: `${HEIGHT}px`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '72px',
				backgroundColor: '#FDFBF7',
				backgroundImage: 'linear-gradient(135deg, #FFF0F3 0%, #FDFBF7 58%)',
				fontFamily: 'Nunito',
				position: 'relative'
			}
		},
		// soft accent glow, top-right
		h('div', {
			style: {
				position: 'absolute',
				top: '-180px',
				right: '-140px',
				width: '520px',
				height: '520px',
				borderRadius: '9999px',
				backgroundColor: 'rgba(240, 98, 146, 0.12)'
			}
		}),
		// eyebrow / category
		h(
			'div',
			{
				style: {
					fontFamily: 'Nunito',
					fontWeight: 700,
					fontSize: '28px',
					letterSpacing: '5px',
					color: '#F06292'
				}
			},
			eyebrow.toUpperCase()
		),
		// title
		h(
			'div',
			{ style: { display: 'flex', flex: '1', alignItems: 'center' } },
			h(
				'div',
				{
					style: {
						fontFamily: 'Outfit',
						fontWeight: 800,
						fontSize: `${titleSize(title)}px`,
						lineHeight: 1.12,
						color: '#6C3F31',
						maxWidth: '1000px',
						letterSpacing: '-1px'
					}
				},
				title
			)
		),
		// footer: brand + tagline
		h(
			'div',
			{ style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
			h(
				'div',
				{ style: { display: 'flex', alignItems: 'center' } },
				h('img', { src: LOGO_URI, width: 56, height: 56 }),
				h(
					'div',
					{
						style: {
							fontFamily: 'Outfit',
							fontWeight: 700,
							fontSize: '32px',
							color: '#6C3F31',
							marginLeft: '18px'
						}
					},
					'mochify.app'
				)
			),
			h(
				'div',
				{ style: { fontFamily: 'Nunito', fontWeight: 600, fontSize: '24px', color: '#B79A8C' } },
				'Fast · Private · Zero-retention'
			)
		)
	);
}

async function render(entry, slug) {
	const svg = await satori(card(entry), { width: WIDTH, height: HEIGHT, fonts });
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
	writeFileSync(join(OUT_DIR, `${slug}.png`), png);
	return slug;
}

mkdirSync(OUT_DIR, { recursive: true });

const jobs = [
	...cards.map((c) => render(c, slugFor(c.path))),
	render(
		{
			eyebrow: 'MOCHIFY',
			title: 'Intelligent image, video & PDF compression for AI-native workflows'
		},
		'default'
	)
];

const done = await Promise.all(jobs);
console.log(`Generated ${done.length} OG cards -> static/og/`);
