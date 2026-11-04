// Hex values that have a palette token in src/routes/layout.css, and the
// token each one is spelled as in a Tailwind class. Shared by the one-off
// migration and by `check-palette.mjs`, which keeps them from coming back.
export const PALETTE = {
	FDFBF7: 'mochi-bg',
	FFF5F7: 'mochi-blush',
	FFF0F3: 'mochi-strawberry',
	FFB3C6: 'mochi-pink-soft',
	FF9EBB: 'mochi-pink-light',
	F06292: 'mochi-pink',
	D81B60: 'mochi-pink-deep',
	BE185D: 'mochi-pink-ink',
	'875F42': 'cocoa-milk',
	'6C3F31': 'cocoa-deep',
	'4A2C2C': 'cocoa-ink',
	'2D1B1B': 'cocoa-night',
	A5D6A7: 'matcha-green',
	'81C784': 'matcha-dark'
};

// A utility prefix (`text-`, `hover:bg-`), then a bracketed six-digit hex
// (`[#4A2C2C]`, optionally followed by `/60`). Group 1 is the hex. Examples are
// split like this because Tailwind scans this file and would build any whole
// class written here.
export const HEX_CLASS = /(?<=[a-z0-9]-)\[#([0-9A-Fa-f]{6})\](?![\w-])/g;
