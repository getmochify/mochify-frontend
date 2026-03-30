import { betterAuth } from "better-auth";
import { verifyPassword } from "better-auth/crypto";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { Resend } from "resend";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET, RESEND_API_KEY, PBKDF2_PEPPER } from "$env/static/private";
import { PUBLIC_APP_URL } from "$env/static/public";

// New passwords use better-auth's default scrypt (node:crypto, Workers Plus).
// Legacy "p2:<salt_hex>:<key_hex>" hashes from the PBKDF2 era are verified
// transparently on login — no forced password resets needed. Once all p2:
// hashes are gone from the DB, remove PBKDF2_PEPPER and the block below.

const P2_ITERS = 100_000;

function hexEncode(buf: ArrayBuffer): string {
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function pbkdf2Verify(password: string, saltHex: string, keyHex: string): Promise<boolean> {
    const salt = new Uint8Array(saltHex.match(/../g)!.map(h => parseInt(h, 16)));
    const key = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(PBKDF2_PEPPER + password), "PBKDF2", false, ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: P2_ITERS, hash: "SHA-256" },
        key, 256,
    );
    const derived = hexEncode(bits);
    if (derived.length !== keyHex.length) return false;
    let diff = 0;
    for (let i = 0; i < derived.length; i++) diff |= derived.charCodeAt(i) ^ keyHex.charCodeAt(i);
    return diff === 0;
}

export function createAuth(db: D1Database) {
    const resend = new Resend(RESEND_API_KEY);

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
            password: {
                verify: async ({ hash, password }) => {
                    if (hash.startsWith("p2:")) {
                        const [, saltHex, keyHex] = hash.split(":");
                        return pbkdf2Verify(password, saltHex, keyHex);
                    }
                    return verifyPassword({ hash, password });
                },
            },
            sendResetPassword: async ({ user, url }) => {
                if (!RESEND_API_KEY) return;
                try {
                    await resend.emails.send({
                        from: "Mochify <hello@mochify.xyz>",
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
                if (!RESEND_API_KEY) return;
                try {
                    await resend.emails.send({
                        from: "Mochify <hello@mochify.xyz>",
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
