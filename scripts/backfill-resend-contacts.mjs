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
// Resend allows 10 requests a second per team, shared with live traffic (signup
// syncs, onboarding events, transactional email). One request every 200ms across
// all workers leaves half of that for production while this runs.
const MIN_GAP_MS = 200;
const MAX_ATTEMPTS = 5;

if (!API_KEY) {
	console.error('RESEND_API_KEY is required (needs full access, not sending-only)');
	process.exit(1);
}

const resend = new Resend(API_KEY);

let nextSlot = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Waits for a global slot, so the four workers share one request rate. */
async function paced() {
	const now = Date.now();
	const slot = Math.max(now, nextSlot);
	nextSlot = slot + MIN_GAP_MS;
	if (slot > now) await sleep(slot - now);
}

/**
 * One Resend call, paced, retrying a 429 with backoff. Returns the SDK's
 * `{ data, error }` so callers see any other error exactly as before.
 */
async function call(fn) {
	for (let attempt = 1; ; attempt++) {
		await paced();
		const result = await fn();
		if (result.error?.name !== 'rate_limit_exceeded' || attempt === MAX_ATTEMPTS) return result;
		await sleep(1000 * attempt);
	}
}

const SQL = `
	SELECT u.email AS email, u.name AS name, u.createdAt AS created_at,
	       p.marketing_opt_out AS opt_out, p.plan AS plan, p.use_case AS use_case
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
		...(signedUp ? { signup_date: signedUp } : {}),
		...(row.use_case ? { use_case: row.use_case } : {})
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
	const existing = await call(() => resend.contacts.get({ email: row.email }));
	// Only not_found means missing. Anything else (a 429 that outlasted the
	// retries, an outage) used to fall through to "create", so a dry run counted
	// rate-limited lookups as missing contacts.
	if (existing.error && existing.error.name !== 'not_found') {
		throw new Error(`get: ${existing.error.name} ${existing.error.message}`);
	}

	if (existing.data) {
		if (
			existing.data.unsubscribed === unsubscribed &&
			propertiesMatch(existing.data.properties, properties)
		) {
			return 'unchanged';
		}
		if (DRY_RUN) return 'would-update';
		const { error } = await call(() =>
			resend.contacts.update({ email: row.email, unsubscribed, properties })
		);
		if (error) throw new Error(`update: ${error.name} ${error.message}`);
		return 'updated';
	}

	if (DRY_RUN) return 'would-create';
	const { error } = await call(() => resend.contacts.create({
		email: row.email,
		unsubscribed,
		properties,
		...(firstNameOf(row.name) ? { firstName: firstNameOf(row.name) } : {})
	}));
	if (error) throw new Error(`create: ${error.name} ${error.message}`);
	return 'created';
}

const users = readUsers();
console.log(`${users.length} verified, non-deleted accounts${DRY_RUN ? ' (dry run)' : ''}`);

const tally = {};
const failures = [];
// Who is missing, by name: the dry run is mostly run to answer exactly that.
const missing = [];
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
				if (result === 'would-create' || result === 'created') missing.push(row.email);
			} catch (e) {
				failures.push(`${row.email}: ${e.message}`);
			}
		}
	})
);

console.log(tally);
if (missing.length) {
	console.log(`\n${missing.length} not on the list${DRY_RUN ? '' : ' (now added)'}:`);
	for (const email of missing) console.log(`  ${email}`);
}
if (failures.length) {
	console.error(`\n${failures.length} failed:`);
	for (const f of failures) console.error(`  ${f}`);
	process.exit(1);
}
