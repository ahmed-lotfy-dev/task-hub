import { Elysia, t } from "elysia";
import { ApiKeyService } from "../services/api-key.service";
import { User } from "@taskflow/shared";
import { betterAuth } from "../middleware/auth-middleware";

export const apiKeyRoutes = new Elysia({ prefix: "/api-keys" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;
    const results = await ApiKeyService.listKeys(user.id);

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
    const { name, expiresInDays } = context.body;

    const newKey = await ApiKeyService.createKey(user.id, name, expiresInDays);

    return {
      ...newKey,
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
  .post("/:id/regenerate", async (context: any) => {
    const user = context.user as User;
    const { id } = context.params;

    const newKey = await ApiKeyService.regenerateKey(user.id, id);

    if (!newKey) {
      context.set.status = 404;
      return { message: "API Key not found" };
    }

    return {
      ...newKey,
      createdAt: newKey.createdAt.toISOString(),
      updatedAt: newKey.updatedAt.toISOString(),
      expiresAt: newKey.expiresAt?.toISOString() ?? null,
    };
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
    }),
    detail: { summary: "Regenerate API key" }
  })
  .delete("/:id", async (context: any) => {
    const user = context.user as User;
    const { id } = context.params;

    const deleted = await ApiKeyService.revokeKey(user.id, id);

    if (!deleted) {
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

