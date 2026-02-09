import { db } from "../db/db";
import { apiKeys } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { generateKey } from "../lib/api-key-utils";

export class ApiKeyService {
  static async listKeys(userId: string) {
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
      .where(eq(apiKeys.userId, userId));
  }

  static async createKey(userId: string, name: string, expiresInDays?: number) {
    const { key, hash, preview } = await generateKey();

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const [newKey] = await db.insert(apiKeys).values({
      userId,
      name,
      key: hash,
      preview,
      expiresAt,
    }).returning();

    return { ...newKey, key };
  }

  static async regenerateKey(userId: string, keyId: string) {
    const [oldKey] = await db
      .select({
        name: apiKeys.name,
        expiresAt: apiKeys.expiresAt,
      })
      .from(apiKeys)
      .where(and(eq(apiKeys.id, keyId as any), eq(apiKeys.userId, userId)))
      .limit(1);

    if (!oldKey) return null;

    await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, keyId as any), eq(apiKeys.userId, userId)));

    const { key, hash, preview } = await generateKey();

    const [newKey] = await db.insert(apiKeys).values({
      userId,
      name: oldKey.name,
      key: hash,
      preview,
      expiresAt: oldKey.expiresAt,
    }).returning();

    return { ...newKey, key };
  }

  static async revokeKey(userId: string, keyId: string) {
    const [deleted] = await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, keyId as any), eq(apiKeys.userId, userId)))
      .returning();
    return deleted;
  }
}
