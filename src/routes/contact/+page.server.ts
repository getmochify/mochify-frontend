import { fail } from '@sveltejs/kit'
import { Resend } from 'resend'
import type { Actions, PageServerLoad } from './$types'

const TOPICS = ['Feedback', 'Support', 'Billing', 'General'] as const
type Topic = (typeof TOPICS)[number]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Canonical Cloudflare Turnstile siteverify: browser → this server action → siteverify.
// Secret is read from the environment as TURNSTILE_SECRET (never hard-coded).
async function verifyTurnstile(token: string, secret: string, remoteip: string): Promise<boolean> {
    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret, response: token, remoteip }),
        })
        const data = (await res.json()) as { success?: boolean }
        return data.success === true
    } catch (e) {
        console.error('[contact] turnstile siteverify failed:', e)
        return false
    }
}

export const load: PageServerLoad = async ({ url }) => {
    const topic = url.searchParams.get('topic')
    return {
        topics: TOPICS,
        presetTopic: TOPICS.includes(topic as Topic) ? (topic as Topic) : '',
    }
}

export const actions: Actions = {
    send: async ({ request, platform, getClientAddress }) => {
        const data = await request.formData()

        const name = ((data.get('name') as string) ?? '').trim()
        const email = ((data.get('email') as string) ?? '').trim()
        const topic = ((data.get('topic') as string) ?? '').trim()
        const message = ((data.get('message') as string) ?? '').trim()

        const values = { name, email, topic, message }

        // Turnstile — verify the bot-challenge token before doing any work.
        const turnstileSecret = platform?.env?.TURNSTILE_SECRET
        const turnstileToken = ((data.get('cf-turnstile-response') as string) ?? '').trim()
        if (!turnstileSecret) {
            console.error('[contact] TURNSTILE_SECRET is not set — cannot verify challenge')
            return fail(500, { error: 'Something went wrong on our end. Please email hello@mochify.app directly.', values })
        }
        if (!turnstileToken || !(await verifyTurnstile(turnstileToken, turnstileSecret, getClientAddress()))) {
            return fail(403, { error: 'Bot check failed. Please refresh the page and try again.', values })
        }

        // Honeypot — bots fill hidden fields; humans never see it.
        if (((data.get('company') as string) ?? '').trim() !== '') {
            return { success: true }
        }

        if (!name || !email || !topic || !message) {
            return fail(400, { error: 'Please fill in every field.', values })
        }
        if (!EMAIL_RE.test(email)) {
            return fail(400, { error: 'Please enter a valid email address.', values })
        }
        if (!TOPICS.includes(topic as Topic)) {
            return fail(400, { error: 'Please choose a topic.', values })
        }
        if (message.length > 5000) {
            return fail(400, { error: 'Message is too long (5000 characters max).', values })
        }

        const resendKey = platform?.env?.RESEND_API_KEY
        if (!resendKey) {
            console.error('[contact] RESEND_API_KEY is not set — message not sent')
            return fail(500, { error: 'Something went wrong on our end. Please email hello@mochify.app directly.', values })
        }

        const resend = new Resend(resendKey)

        try {
            const { error } = await resend.emails.send({
                from: 'Mochify Contact <hello@mochify.app>',
                to: 'hello@mochify.app',
                replyTo: email,
                subject: `[${topic}] Contact form — ${name}`,
                html: `
                    <div style="font-family:sans-serif;color:#4A2C2C;line-height:1.6">
                        <p style="margin:0 0 4px"><strong>Topic:</strong> ${escapeHtml(topic)}</p>
                        <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
                        <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
                        <hr style="border:none;border-top:1px solid #FFE5EC;margin:0 0 16px" />
                        <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
                    </div>
                `,
            })

            if (error) {
                console.error('[contact] resend error:', error)
                return fail(502, { error: 'We could not send your message. Please try again in a moment.', values })
            }
        } catch (e) {
            console.error('[contact] send failed:', e)
            return fail(502, { error: 'We could not send your message. Please try again in a moment.', values })
        }

        return { success: true }
    },
}
