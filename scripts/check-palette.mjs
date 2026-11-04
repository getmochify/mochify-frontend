#!/usr/bin/env node
/**
 * Keeps palette colors spelled as tokens.
 *
 * Until Nov 2026 nearly every color was a hard-coded Tailwind class
 * (`text-[#4A2C2C]`, about 6,100 of them) while the tokens in
 * src/routes/layout.css went mostly unused. They were migrated to tokens
 * (`text-cocoa-ink`); this stops new ones creeping back in.
 *
 * Fails on:
 *   a `[#hex]` class whose hex is a palette color (use the token instead)
 *   a token in scripts/palette.mjs that layout.css does not define, or defines
 *   with a different value
 *
 * A one-off color that is not in the palette may stay a hex class.
 */
import fs from 'fs';
import { execSync } from 'child_process';
import { PALETTE, HEX_CLASS } from './palette.mjs';

const problems = [];

const css = fs.readFileSync('src/routes/layout.css', 'utf8');
for (const [hex, token] of Object.entries(PALETTE)) {
	const m = new RegExp(`--color-${token}:\\s*#([0-9A-Fa-f]{6})\\s*;`).exec(css);
	if (!m)
		problems.push(
			`layout.css: --color-${token} is missing (scripts/palette.mjs maps #${hex} to it)`
		);
	else if (m[1].toUpperCase() !== hex) {
		problems.push(`layout.css: --color-${token} is #${m[1]}, scripts/palette.mjs says #${hex}`);
	}
}

const files = execSync("git ls-files 'src/*.svelte' 'src/*.ts'", { encoding: 'utf8' })
	.split('\n')
	.filter(Boolean);
for (const file of files) {
	const lines = fs.readFileSync(file, 'utf8').split('\n');
	lines.forEach((line, i) => {
		for (const m of line.matchAll(HEX_CLASS)) {
			const token = PALETTE[m[1].toUpperCase()];
			if (token) problems.push(`${file}:${i + 1}: [#${m[1]}] -> ${token}`);
		}
	});
}

if (problems.length) {
	console.error(`Palette check failed (${problems.length}):`);
	for (const p of problems) console.error(`  ${p}`);
	process.exit(1);
}
console.log('Palette check passed.');
