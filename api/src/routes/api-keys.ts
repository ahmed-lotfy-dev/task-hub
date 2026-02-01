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
    return await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        preview: apiKeys.preview,
        expiresAt: apiKeys.expiresAt,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id));
  }, {
    auth: true,
    detail: { summary: "List API keys" }
  })
  .post("/", async (context: any) => {
    const user = context.user as User;
    const body = context.body as { name: string; expiresInDays?: number };
    const { name, expiresInDays } = body;
    const { key, hash, preview } = await generateKey();

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const [newKey] = await db.insert(apiKeys).values({
      userId: user.id,
      name,
      key: hash,
      preview,
      expiresAt,
    }).returning();

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
