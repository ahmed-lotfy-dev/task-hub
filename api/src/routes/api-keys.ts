import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { apiKeys } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { generateKey } from "../lib/api-key-utils";
import { User } from "@taskflow/shared";
import { betterAuth } from "../middleware/auth-middleware";

export const apiKeyRoutes = new Elysia({ prefix: "/api-keys" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;
    console.log(`[API Keys] Listing keys for user: "${user.id}" (email: ${user.email})`);

    const results = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        preview: apiKeys.preview,
        expiresAt: apiKeys.expiresAt,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id.trim()));

    console.log(`[API Keys] DB Results for user "${user.id.trim()}": ${JSON.stringify(results.map(r => ({ id: r.id, name: r.name })), null, 2)}`);

    return results.map(key => ({
      ...key,
      createdAt: key.createdAt.toISOString(),
      expiresAt: key.expiresAt?.toISOString() ?? null,
      lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
    }));
  }, {
    auth: true,
    detail: { summary: "List API keys" }
  })
  .post("/", async (context: any) => {
    const user = context.user as User;
    console.log(`[API Keys] Creating key for user: "${user.id}" (email: ${user.email})`);
    const body = context.body as { name: string; expiresInDays?: number };
    const { name, expiresInDays } = body;
    const { key, hash, preview } = await generateKey();

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const [newKey] = await db.insert(apiKeys).values({
      userId: user.id.trim(),
      name,
      key: hash,
      preview,
      expiresAt,
    }).returning();

    console.log(`[API Keys] Created key "${name}" with ID: ${newKey.id} for user: ${user.id}`);

    return {
      ...newKey,
      key,
      createdAt: newKey.createdAt.toISOString(),
      updatedAt: newKey.updatedAt.toISOString(),
      expiresAt: newKey.expiresAt?.toISOString() ?? null,
    };
  }, {
    auth: true,
    body: t.Object({
      name: t.String(),
      expiresInDays: t.Optional(t.Number()),
    }),
    detail: { summary: "Create API key" }
  })
  .delete("/:id", async (context: any) => {
    const user = context.user as User;
    const { id } = context.params;
    const result = await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)))
      .returning();

    if (result.length === 0) {
      context.set.status = 404;
      return { message: "API Key not found" };
    }

    return { message: "API Key revoked" };
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
    }),
    detail: { summary: "Revoke API key" }
  });
