import { Elysia } from "elysia";
import { mcp } from "elysia-mcp";
import { registerAllTools } from "./tools";
import { db } from "../db/db";
import { apiKeys, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashKey } from "../lib/api-key-utils";

export const mcpServer = new Elysia({ name: "mcp-server" })
  .use(
    mcp({
      serverInfo: {
        name: "Task Hub AI Bridge",
        version: "1.0.0",
      },
      authentication: async ({ request }) => {
        const url = new URL(request.url);
        const queryKey = url.searchParams.get("apiKey") || url.searchParams.get("token");
        const authHeader = request.headers.get("Authorization");

        const apiKey = queryKey || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!apiKey) {
          return { response: new Response("Unauthorized: Missing API Key (as 'apiKey' query param or Bearer token)", { status: 401 }) };
        }

        const hashedKey = await hashKey(apiKey);

        const [keyRecord] = await db
          .select({ userId: apiKeys.userId })
          .from(apiKeys)
          .where(eq(apiKeys.key, hashedKey))
          .limit(1);

        if (!keyRecord) {
          return { response: new Response("Unauthorized: Invalid API Key", { status: 401 }) };
        }

        // Update last used at
        await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.key, hashedKey));

        return {
          authInfo: {
            userId: keyRecord.userId,
            clientId: "mcp-client",
            token: apiKey,
            scopes: ["all"]
          }
        };
      },
      setupServer: (server) => {
        registerAllTools(server);
      }
    })
  );

