// One-off backfill: every existing account onto the Resend contact list.
//
//   RESEND_API_KEY=re_... node scripts/backfill-resend-contacts.mjs --dry-run
//   RESEND_API_KEY=re_... node scripts/backfill-resend-contacts.mjs
//
// From here on new signups sync themselves (see the databaseHooks in
// src/lib/auth.ts); this only exists to catch up the accounts that predate that.
// Safe to re-run: it reads each contact before writing and skips ones already in
// the right state, so a second pass costs reads and changes nothing. That also
// makes it the repair tool if the mirror is ever suspected of having drifted —
// including the `tier` and `signup_date` properties, which contacts created
// before those existed are missing entirely until this runs over them.
//
// Rules match the live sync exactly, and each exclusion is deliberate:
//   - unverified addresses are skipped (bounce risk on the sending domain)
//   - soft-deleted accounts are skipped (they asked to be gone)
//   - marketing_opt_out = 1 lands as unsubscribed, NOT as an omission, so a
//     later dashboard import can't quietly resurrect them as subscribed

import { execFileSync } from 'node:child_process';
import { Resend } from 'resend';

const DB = 'mochify-auth';
const DRY_RUN = process.argv.includes('--dry-run');
const API_KEY = process.env.RESEND_API_KEY;
const CONCURRENCY = 4;

if (!API_KEY) {
	console.error('RESEND_API_KEY is required (needs full access, not sending-only)');
	process.exit(1);
}

const resend = new Resend(API_KEY);

const SQL = `
	SELECT u.email AS email, u.name AS name, u.createdAt AS created_at,
	       p.marketing_opt_out AS opt_out, p.plan AS plan
	FROM user u
	LEFT JOIN profile p ON p.user_id = u.id
	WHERE u.emailVerified = 1 AND u.deleted_at IS NULL
`.replace(/\s+/g, ' ');

function readUsers() {
	const out = execFileSync(
		'npx',
		['wrangler', 'd1', 'execute', DB, '--remote', '--json', '--command', SQL],
		{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
	);
	// wrangler prints banner lines before the JSON payload.
	return JSON.parse(out.slice(out.indexOf('[')))[0].results;
}

const firstNameOf = (name) => name?.trim().split(/\s+/)[0] || undefined;

// Keep these three in step with src/lib/server/resendContacts.ts. They are copied
// rather than imported because this runs under plain node, outside the SvelteKit
// module graph the $lib alias belongs to.
function signupDate(value) {
	if (value === null || value === undefined || value === '') return undefined;
	const ms = typeof value === 'number' ? value : /^\d+$/.test(value) ? Number(value) : value;
	const date = new Date(ms);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function propertiesFor(row) {
	const signedUp = signupDate(row.created_at);
	return {
		tier: row.plan ?? 'free',
		...(signedUp ? { signup_date: signedUp } : {})
	};
}

// Resend returns properties as `{ key: { type, value } }`; we hold plain values.
const propertiesMatch = (existing, desired) =>
	Object.entries(desired).every(([key, value]) => existing?.[key]?.value === value);

// Mirrors syncContact() in src/lib/server/resendContacts.ts: read first, because
// create against an existing address does not reliably overwrite `unsubscribed`.
async function syncOne(row) {
	const unsubscribed = row.opt_out === 1;
	const properties = propertiesFor(row);
	const existing = await resend.contacts.get({ email: row.email });

	if (existing.data) {
		if (
			existing.data.unsubscribed === unsubscribed &&
			propertiesMatch(existing.data.properties, properties)
		) {
			return 'unchanged';
		}
		if (DRY_RUN) return 'would-update';
		const { error } = await resend.contacts.update({ email: row.email, unsubscribed, properties });
		if (error) throw new Error(`update: ${error.name} ${error.message}`);
		return 'updated';
	}

	if (DRY_RUN) return 'would-create';
	const { error } = await resend.contacts.create({
		email: row.email,
		unsubscribed,
		properties,
		...(firstNameOf(row.name) ? { firstName: firstNameOf(row.name) } : {})
	});
	if (error) throw new Error(`create: ${error.name} ${error.message}`);
	return 'created';
}

const users = readUsers();
console.log(`${users.length} verified, non-deleted accounts${DRY_RUN ? ' (dry run)' : ''}`);

const tally = {};
const failures = [];
const queue = [...users];

// Resend rate limits per endpoint; keep the fan-out small and let a 429 surface
// as a named failure rather than something to retry blindly.
await Promise.all(
	Array.from({ length: CONCURRENCY }, async () => {
		let row;
		while ((row = queue.shift())) {
			try {
				const result = await syncOne(row);
				tally[result] = (tally[result] ?? 0) + 1;
			} catch (e) {
				failures.push(`${row.email}: ${e.message}`);
			}
		}
	})
);

console.log(tally);
if (failures.length) {
	console.error(`\n${failures.length} failed:`);
	for (const f of failures) console.error(`  ${f}`);
	process.exit(1);
}
