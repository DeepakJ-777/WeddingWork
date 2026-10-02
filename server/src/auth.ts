import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db/index.js";
import * as schema from "./db/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "default_dev_secret_key_needs_change_32_chars!",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: process.env.DATABASE_URL
    ? drizzleAdapter(getDb(), {
        provider: "pg",
        schema: {
          user: schema.user,
          session: schema.session,
          account: schema.account,
          verification: schema.verification,
        },
      })
    : undefined,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
});
