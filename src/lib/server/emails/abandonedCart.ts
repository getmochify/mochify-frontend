import { Resend } from 'resend';
import { CODE_TTL_DAYS } from '$lib/server/discounts';
import { signUnsubscribeToken, unsubscribeUrl } from '$lib/server/unsubscribe';

const FROM = 'Mochify <hello@mochify.app>';

// Hours after the abandoned checkout that the second email lands. Scheduled at
// send time via Resend rather than swept by a cron: adapter-cloudflare emits a
// fetch-only worker, so a cron would mean standing up a second worker.
const FOLLOWUP_DELAY_HOURS = 48;

// PECR (UK) and CAN-SPAM (US) both expect marketing email to identify the sender
// with a physical postal address. Mochify's ICO registration is public but is not
// a substitute for one.
//
// TODO(taylor): set this before the first production send. Leaving it empty
// renders the footer without an address, which is a compliance gap, not a
// cosmetic one.
const POSTAL_ADDRESS = '';

const PLAN_COPY: Record<string, { name: string; full: string; discounted: string }> = {
	seller: { name: 'Seller', full: '$7.99', discounted: '$4.00' },
	pro: { name: 'Pro', full: '$24.99', discounted: '$12.50' }
};

type CartContext = {
	plan: string;
	billing: string;
	code: string;
	appUrl: string;
	unsubscribe: string;
};

function shell(inner: string, unsubscribe: string): string {
	return `
	<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FDFBF7;padding:32px 16px">
	  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px">
	    ${inner}
	  </div>
	  <div style="max-width:520px;margin:16px auto 0;text-align:center">
	    <p style="font-size:11px;color:#875F42;line-height:1.6;margin:0">
	      Mochify, privacy-first image processing.
	      ${POSTAL_ADDRESS ? `<br>${POSTAL_ADDRESS}` : ''}
	      <br>ICO registration ZC088248.
	      <br><a href="${unsubscribe}" style="color:#875F42;text-decoration:underline">Unsubscribe from offers</a>
	      &middot; <a href="mailto:hello@mochify.app" style="color:#875F42;text-decoration:underline">hello@mochify.app</a>
	    </p>
	  </div>
	</div>`;
}

function button(href: string, label: string): string {
	return `<p style="margin:28px 0"><a href="${href}" style="display:inline-block;padding:14px 30px;background:#F06292;color:#ffffff;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px">${label}</a></p>`;
}

function codeBlock(code: string): string {
	return `<p style="margin:20px 0;padding:14px;background:#FFF0F3;border-radius:12px;text-align:center;font-size:19px;font-weight:bold;letter-spacing:1px;color:#BE185D">${code}</p>`;
}

function checkoutLink(ctx: CartContext): string {
	const params = new URLSearchParams({
		plan: ctx.plan,
		billing: ctx.billing,
		code: ctx.code
	});
	return `${ctx.appUrl}/api/checkout?${params.toString()}`;
}

// Copy notes, per docs/abandoned-cart-new50.md:
// - Lead with the value, not the discount. "50% OFF!!" subject lines get filtered.
// - State the renewal price plainly. Burying it is what generates chargebacks.
// - No em dashes anywhere, per house style.

function firstEmail(ctx: CartContext): string {
	const p = PLAN_COPY[ctx.plan] ?? PLAN_COPY.seller;
	return shell(
		`
	    <h1 style="font-size:21px;color:#4A2C2C;margin:0 0 16px">You were partway to ${p.name}</h1>
	    <p style="font-size:15px;color:#4A2C2C;line-height:1.6;margin:0 0 14px">
	      You started setting up Mochify ${p.name} and did not finish. No problem, your images are
	      still where you left them.
	    </p>
	    <p style="font-size:15px;color:#4A2C2C;line-height:1.6;margin:0 0 14px">
	      If it was the price that gave you pause, here is a code for 50% off your first month.
	      It works once, and only for you.
	    </p>
	    ${codeBlock(ctx.code)}
	    <p style="font-size:15px;color:#4A2C2C;line-height:1.6;margin:0">
	      That is <strong>${p.discounted} for your first month</strong> instead of ${p.full}.
	      It renews at ${p.full} a month afterwards, and you can cancel any time before then.
	    </p>
	    ${button(checkoutLink(ctx), `Finish setting up ${p.name}`)}
	    <p style="font-size:13px;color:#875F42;line-height:1.6;margin:0">
	      The code is applied automatically when you use that button. It expires in
	      ${CODE_TTL_DAYS} days.
	    </p>`,
		ctx.unsubscribe
	);
}

function followupEmail(ctx: CartContext): string {
	const p = PLAN_COPY[ctx.plan] ?? PLAN_COPY.seller;
	return shell(
		`
	    <h1 style="font-size:21px;color:#4A2C2C;margin:0 0 16px">Your code expires in 5 days</h1>
	    <p style="font-size:15px;color:#4A2C2C;line-height:1.6;margin:0 0 14px">
	      Just a quick reminder that this is sitting unused. It takes ${p.name} to
	      ${p.discounted} for the first month, then ${p.full} a month.
	    </p>
	    ${codeBlock(ctx.code)}
	    ${button(checkoutLink(ctx), 'Use the code')}
	    <p style="font-size:13px;color:#875F42;line-height:1.6;margin:0">
	      If you have decided Mochify is not for you, that is genuinely fine. This is the last
	      email you will get about it.
	    </p>`,
		ctx.unsubscribe
	);
}

export type SentEmails = { firstId: string | null; followupId: string | null };

/**
 * Send the recovery email now and schedule the follow-up.
 *
 * Never throws. The caller is a webhook that must return 200 regardless, and a
 * failed send should not cost us the D1 row that records the minted code.
 */
export async function sendAbandonedCartEmails(
	resendKey: string | undefined,
	to: string,
	userId: string,
	opts: { plan: string; billing: string; code: string; appUrl: string }
): Promise<SentEmails> {
	if (!resendKey) {
		console.warn('[abandoned-cart] RESEND_API_KEY is not set — skipping send');
		return { firstId: null, followupId: null };
	}

	const resend = new Resend(resendKey);
	const token = await signUnsubscribeToken(userId);
	const unsubscribe = unsubscribeUrl(opts.appUrl, token);
	const ctx: CartContext = { ...opts, unsubscribe };

	// RFC 8058. Renders the mail client's own unsubscribe button, which providers
	// weight in reputation scoring — worth having on the marketing stream so it
	// does not drag down deliverability of the magic links on the same domain.
	const headers = {
		'List-Unsubscribe': `<${opts.appUrl}/unsubscribe/one-click?token=${encodeURIComponent(token)}>, <${unsubscribe}>`,
		'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
	};

	const p = PLAN_COPY[opts.plan] ?? PLAN_COPY.seller;
	let firstId: string | null = null;
	let followupId: string | null = null;

	try {
		const res = await resend.emails.send({
			from: FROM,
			to,
			subject: `Your Mochify ${p.name} setup is still waiting`,
			html: firstEmail(ctx),
			headers
		});
		firstId = res.data?.id ?? null;
	} catch (e) {
		console.error('[abandoned-cart] first email failed:', e);
	}

	try {
		const res = await resend.emails.send({
			from: FROM,
			to,
			subject: `${opts.code} expires in 5 days`,
			html: followupEmail(ctx),
			headers,
			scheduledAt: new Date(Date.now() + FOLLOWUP_DELAY_HOURS * 60 * 60 * 1000).toISOString()
		});
		followupId = res.data?.id ?? null;
	} catch (e) {
		console.error('[abandoned-cart] follow-up scheduling failed:', e);
	}

	return { firstId, followupId };
}

/**
 * Cancel a scheduled follow-up. Idempotent: cancelling an already-sent or
 * already-cancelled email is treated as success, because this runs on the
 * subscription webhook path that Polar may deliver two or three times.
 */
export async function cancelFollowup(
	resendKey: string | undefined,
	emailId: string
): Promise<boolean> {
	if (!resendKey) return false;
	try {
		await new Resend(resendKey).emails.cancel(emailId);
		return true;
	} catch (e) {
		console.error('[abandoned-cart] follow-up cancel failed:', e);
		return false;
	}
}
