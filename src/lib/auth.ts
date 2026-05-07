import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { Resend } from "resend";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET } from "$env/static/private";
import { PUBLIC_APP_URL } from "$env/static/public";

export function createAuth(db: D1Database, resendKey: string | undefined) {
    if (!resendKey) console.warn("[auth] RESEND_API_KEY is not set — emails will not be sent");
    const resend = resendKey ? new Resend(resendKey) : null;

    return betterAuth({
        baseURL: PUBLIC_APP_URL,
        secret: BETTER_AUTH_SECRET,
        database: kyselyAdapter(
            new Kysely({ dialect: new D1Dialect({ database: db }) }),
            { type: "sqlite" }
        ),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: true,
            sendResetPassword: async ({ user, url }) => {
                if (!resend) return;
                try {
                    await resend.emails.send({
                        from: "Mochify <hello@send.mochify.app>",
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
                        from: "Mochify <hello@send.mochify.app>",
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
                            from: "Mochify <hello@send.mochify.app>",
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
