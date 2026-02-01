import Elysia from "elysia";
import { auth } from "../lib/auth";
import { User as SharedUser } from "@taskflow/shared";
import { db } from "../db/db";
import { apiKeys, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashKey } from "../lib/api-key-utils";

function mapUser(user: any): SharedUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.name || user.fullName || "User",
    avatarUrl: user.avatarUrl || user.image || null,
    timezone: user.timezone || "UTC",
    preferences: user.preferences || {
      theme: 'system',
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
      notifications: { email: true, push: true, desktop: true, digest: 'immediate' }
    },
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
  };
}

// user middleware (compute user and session and pass to routes)
export const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }): Promise<any> {
        // 1. Try Session Auth (Cookies)
        const session = await auth.api.getSession({
          headers,
        });

        if (session) {
          return {
            user: mapUser(session.user),
            session: session.session,
          };
        }

        // 2. Try API Key Auth (Bearer Token)
        const authHeader = headers.get("Authorization") || headers.get("authorization");

        if (authHeader?.startsWith("Bearer th_live_")) {
          const apiKey = authHeader.split(" ")[1];
          const hashedKey = await hashKey(apiKey);

          console.log(`[Auth] Attempting API Key auth for token starting with th_live_${apiKey.slice(8, 14)}...`);

          // Find the key and joined user
          const [result] = await db
            .select({
              user: users,
              keyId: apiKeys.id,
              keyName: apiKeys.name
            })
            .from(apiKeys)
            .innerJoin(users, eq(apiKeys.userId, users.id))
            .where(eq(apiKeys.key, hashedKey))
            .limit(1);

          if (result) {
            console.log(`[Auth] Success: Authenticated as ${result.user.name} via key "${result.keyName}"`);

            // Update last used at asynchronously
            db.update(apiKeys)
              .set({ lastUsedAt: new Date() })
              .where(eq(apiKeys.id, result.keyId))
              .execute();

            return {
              user: mapUser(result.user),
              session: null,
            };
          } else {
            console.warn(`[Auth] Failure: No matching key found for hash starting with ${hashedKey.slice(0, 10)}`);
          }
        }

        return status(401);
      },
    },
  });