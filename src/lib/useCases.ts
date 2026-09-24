// "What will you mainly use Mochify for?", the optional select on the register
// form.
//
// One answer per account, not several. The obvious multi-select was turned down
// for a concrete reason: Resend contact properties are scalar (see
// ContactProperties in $lib/server/resendContacts), so a multi-value answer
// would have to be either a joined string nothing can segment on, or one boolean
// property per option, growing the sync every time the list does. A single
// answer mirrors as one property that segments cleanly.
//
// That only works if the options are genuinely exclusive, which is why "store"
// and "marketplace" are split the way they are rather than left as one
// "e-commerce" option somebody selling on Vinted and running a Shopify site
// would have to pick arbitrarily.
//
// The slug is the stored value and never changes. The label is copy: reword it
// freely, and nothing in D1, Resend or PostHog moves.
export const USE_CASES = [
	{ slug: 'developer', label: 'Development or automation' },
	{ slug: 'marketing', label: 'Marketing or content' },
	{ slug: 'store', label: 'My own store or site' },
	{ slug: 'marketplace', label: 'Selling on a marketplace' },
	{ slug: 'personal', label: 'Personal photos and files' },
	{ slug: 'other', label: 'Something else' }
] as const;

export type UseCase = (typeof USE_CASES)[number]['slug'];

const SLUGS: readonly string[] = USE_CASES.map((u) => u.slug);

/**
 * Guard for the value that arrives on the signup request.
 *
 * This is the whole validation story for the column: the migration deliberately
 * carries no CHECK constraint, because SQLite cannot alter one without rebuilding
 * the table and this list is expected to grow.
 */
export function isUseCase(value: unknown): value is UseCase {
	return typeof value === 'string' && SLUGS.includes(value);
}
