import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET } from "$env/static/private";
import { PUBLIC_APP_URL } from "$env/static/public";

export function createAuth(db: D1Database) {
    return betterAuth({
        baseURL: PUBLIC_APP_URL,
        secret: BETTER_AUTH_SECRET,
        database: kyselyAdapter(
            new Kysely({ dialect: new D1Dialect({ database: db }) }),
            { type: "sqlite" }
        ),
        emailAndPassword: { enabled: true },
        socialProviders: {
            google: {
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
            },
        },
    });
}
