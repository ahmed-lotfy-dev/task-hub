import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { users, sessions, accounts, verifications } from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications
    }
  }),

  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL,

  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://web.ahmedlotfy.site",
    "https://web.ahmedlotfy.site",
    "https://api.ahmedlotfy.site",
  ],
  logger: {
    level: "debug",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".ahmedlotfy.site",
    },
    useSecureCookies: true,
    trustedProxyHeaders: true,
  },
  account: {
    skipStateCookieCheck: true,
  },
});
