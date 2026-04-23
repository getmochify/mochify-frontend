import { betterAuth } from "better-auth";
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
    });
}
