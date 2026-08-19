#!/usr/bin/env node
/**
 * Guards the /guides listing against date drift.
 *
 * The listing in src/routes/guides/+page.svelte hand-maintains `date` and
 * `lastUpdated` strings per entry. Nothing links them to the guide pages, so
 * they silently go stale when a guide is edited (four entries sat on
 * "Mar 13, 2026" for up to five months before this check existed).
 *
 * For every guide this asserts:
 *   listing `date`         === the guide's schema `datePublished`
 *   listing `lastUpdated`  === the guide's schema `dateModified`
 *   the guide's own visible dates agree with its schema
 *   `lastUpdated` is present on the listing iff the guide page shows one
 *
 * Exits non-zero and prints every mismatch when anything drifts.
 */
import fs from 'fs';
import path from 'path';

const ROOT = 'src/routes/guides';
const LISTING = path.join(ROOT, '+page.svelte');

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

/** "August 6, 2026" | "Aug 6, 2026" -> "2026-08-06" */
function toISO(value) {
	if (!value) return null;
	const m = value.match(/([A-Za-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/);
	if (!m) return `UNPARSEABLE(${value})`;
	const month = MONTHS.findIndex((name) => name.toLowerCase().startsWith(m[1].slice(0, 3).toLowerCase()));
	if (month < 0) return `UNPARSEABLE(${value})`;
	return `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

const field = (src, name) => (src.match(new RegExp(`"${name}":\\s*"([^"]+)"`)) || [])[1]?.slice(0, 10);
const meta = (src, name) => (src.match(new RegExp(`\\b${name}:\\s*"([^"]+)"`)) || [])[1];

const listing = fs.readFileSync(LISTING, 'utf8');
const entries = new Map();
for (const block of listing.split(/\n\s{8}\{\n/).slice(1)) {
	const url = (block.match(/url:\s*"([^"]+)"/) || [])[1];
	if (!url) continue;
	entries.set(url.replace('/guides/', ''), {
		date: meta(block, 'date'),
		lastUpdated: meta(block, 'lastUpdated')
	});
}

const problems = [];
const slugs = fs
	.readdirSync(ROOT, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

for (const slug of slugs) {
	const file = path.join(ROOT, slug, '+page.svelte');
	if (!fs.existsSync(file)) continue;
	const src = fs.readFileSync(file, 'utf8');
	const entry = entries.get(slug);

	if (!entry) {
		problems.push(`${slug}: guide exists but has no /guides listing entry`);
		continue;
	}

	const published = field(src, 'datePublished');
	const modified = field(src, 'dateModified');

	if (!published) {
		problems.push(`${slug}: no Article schema datePublished`);
	} else if (toISO(entry.date) !== published) {
		problems.push(`${slug}: listing date ${entry.date} != schema datePublished ${published}`);
	}

	// A guide only advertises an Updated date if it was actually revised.
	const pageShowsUpdated = /lastUpdated:\s*"/.test(src) && modified && modified !== published;

	if (pageShowsUpdated && !entry.lastUpdated) {
		problems.push(`${slug}: page shows Updated ${modified} but listing has no lastUpdated`);
	} else if (!pageShowsUpdated && entry.lastUpdated) {
		problems.push(`${slug}: listing has lastUpdated ${entry.lastUpdated} but page shows none`);
	} else if (pageShowsUpdated && toISO(entry.lastUpdated) !== modified) {
		problems.push(
			`${slug}: listing lastUpdated ${entry.lastUpdated} != schema dateModified ${modified}`
		);
	}

	// The guide's own visible strings must agree with its schema.
	const visiblePublished = meta(src, 'datePublished') || meta(src, 'date');
	if (published && visiblePublished && toISO(visiblePublished) !== published) {
		problems.push(`${slug}: visible "${visiblePublished}" != schema datePublished ${published}`);
	}
	const visibleUpdated = meta(src, 'lastUpdated');
	if (modified && visibleUpdated && toISO(visibleUpdated) !== modified) {
		problems.push(`${slug}: visible Updated "${visibleUpdated}" != schema dateModified ${modified}`);
	}
}

for (const slug of entries.keys()) {
	if (!slugs.includes(slug)) problems.push(`${slug}: listed on /guides but no such guide directory`);
}

if (problems.length) {
	console.error(`Guide date drift (${problems.length}):\n`);
	for (const p of problems) console.error(`  ${p}`);
	process.exit(1);
}

console.log(`Guide dates OK: ${slugs.length} guides, listing and schema agree.`);
