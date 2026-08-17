import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { Resend } from "resend";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET } from "$env/static/private";
import { PUBLIC_APP_URL } from "$env/static/public";
import { getPostHogClient } from "$lib/server/posthog";

// Which flow created the account, derived from the Better Auth endpoint that ran.
// Mirrors better-auth's own last-login-method resolver, so the path shapes below
// track what the library actually routes.
function signupMethod(path: string | undefined): string {
    if (!path) return "unknown";
    if (path.startsWith("/callback/") || path.startsWith("/oauth2/callback/"))
        return path.split("/").pop() || "oauth";
    if (path === "/sign-up/email" || path === "/sign-in/email") return "email";
    if (path.startsWith("/magic-link/verify")) return "magic-link";
    return "unknown";
}

export function createAuth(db: D1Database, resendKey: string | undefined) {
    if (!resendKey) console.warn("[auth] RESEND_API_KEY is not set — emails will not be sent");
    const resend = resendKey ? new Resend(resendKey) : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) });

    return betterAuth({
        baseURL: PUBLIC_APP_URL,
        secret: BETTER_AUTH_SECRET,
        advanced: {
            ipAddress: {
                ipAddressHeaders: ['CF-Connecting-IP', 'X-Forwarded-For'],
            },
        },
        database: kyselyAdapter(kysely, { type: "sqlite" }),
        databaseHooks: {
            user: {
                create: {
                    // The ONLY reliable place to count a signup. Every flow that
                    // creates an account funnels through here — email/password,
                    // Google OAuth, and Day Pass magic links — whereas the client
                    // can only fire on the email form: OAuth and magic link both
                    // redirect off-page, so there is no moment on the register page
                    // at which they could capture. Firing server-side also survives
                    // ad blockers and users who close the tab mid-redirect.
                    //
                    // distinctId is the email to match the identify() calls in
                    // +layout.svelte and the auth pages, so the signup lands on the
                    // same person as the rest of that user's client-side funnel.
                    after: async (user, ctx) => {
                        try {
                            const posthog = getPostHogClient();
                            posthog.capture({
                                distinctId: user.email,
                                event: "user_signed_up",
                                properties: {
                                    method: signupMethod(ctx?.path),
                                    $set: { email: user.email, name: user.name },
                                },
                            });
                            await posthog.flush();
                        } catch (e) {
                            // Analytics must never block account creation.
                            console.error("[auth] signup capture failed:", e);
                        }
                    },
                },
            },
            session: {
                create: {
                    // Any successful sign-in (password, magic link, Google)
                    // cancels a pending account deletion — the account keeps
                    // its userId, so usage counters carry over untouched.
                    after: async (session) => {
                        try {
                            await kysely
                                .updateTable("user")
                                .set({ deleted_at: null })
                                .where("id", "=", session.userId)
                                .where("deleted_at", "is not", null)
                                .execute();
                        } catch (e) {
                            console.error("[auth] clearing deleted_at failed:", e);
                        }
                    },
                },
            },
        },
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: true,
            sendResetPassword: async ({ user, url }) => {
                if (!resend) return;
                try {
                    await resend.emails.send({
                        from: "Mochify <hello@mochify.app>",
                        to: user.email,
                        subject: "Reset your password",
                        html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
                    });
                } catch (e) {
                    console.error("[auth] sendResetPassword failed:", e);
                }
            },
        },
        emailVerification: {
            sendOnSignUp: true,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({ user, url }) => {
                if (!resend) return;
                try {
                    await resend.emails.send({
                        from: "Mochify <hello@mochify.app>",
                        to: user.email,
                        subject: "Verify your email",
                        html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
                    });
                } catch (e) {
                    console.error("[auth] sendVerificationEmail failed:", e);
                }
            },
        },
        socialProviders: {
            google: {
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
            },
        },
        plugins: [
            magicLink({
                expiresIn: 600, // 10 minutes
                sendMagicLink: async ({ email, url }) => {
                    if (!resend) return;
                    try {
                        await resend.emails.send({
                            from: "Mochify <hello@mochify.app>",
                            to: email,
                            subject: "Your Mochify Day Pass is ready",
                            html: `
                                <p style="font-family:sans-serif;color:#4A2C2C">Your Day Pass has been activated.</p>
                                <p style="font-family:sans-serif;color:#4A2C2C">Click below to start converting — you have 500 images for the next 24 hours.</p>
                                <p><a href="${url}" style="display:inline-block;padding:12px 28px;background:#F06292;color:white;border-radius:10px;text-decoration:none;font-family:sans-serif;font-weight:bold">Activate Day Pass →</a></p>
                                <p style="font-family:sans-serif;font-size:12px;color:#875F42">This link expires in 10 minutes. If you didn't purchase a Day Pass, you can ignore this email.</p>
                            `,
                        });
                    } catch (e) {
                        console.error("[auth] sendMagicLink failed:", e);
                    }
                },
            }),
        ],
    });
}
