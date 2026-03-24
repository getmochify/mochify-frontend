import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { Resend } from "resend";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET, RESEND_API_KEY } from "$env/static/private";
import { PUBLIC_APP_URL } from "$env/static/public";

// better-auth defaults to scrypt(N=16384,r=16) which allocates ~64 MB per
// hash/verify — half the Cloudflare Worker memory limit and the source of
// worker OOM errors during login and registration.
//
// PBKDF2-SHA256 (100k iterations) is the NIST SP 800-132 recommendation and
// is used by Django, Spring Security, and iOS Keychain. Web Crypto runs it
// hardware-accelerated with negligible memory overhead on Workers.
// Hashes are prefixed "p2:<salt_hex>:<key_hex>".

const P2_ITERS = 600_000;

function hexEncode(buf: ArrayBuffer): string {
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function pbkdf2Hash(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: P2_ITERS, hash: "SHA-256" },
        key, 256,
    );
    return `p2:${hexEncode(salt.buffer)}:${hexEncode(bits)}`;
}

async function pbkdf2Verify(password: string, saltHex: string, keyHex: string): Promise<boolean> {
    const salt = new Uint8Array(saltHex.match(/../g)!.map(h => parseInt(h, 16)));
    const key = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"],
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
                hash: pbkdf2Hash,
                verify: async ({ hash, password }) => {
                    const [, saltHex, keyHex] = hash.split(":");
                    return pbkdf2Verify(password, saltHex, keyHex);
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
