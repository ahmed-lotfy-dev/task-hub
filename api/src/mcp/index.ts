import { Elysia } from "elysia";
import { mcp, transports } from "elysia-mcp";
import { registerAllTools } from "./tools";
import { db } from "../db/db";
import { apiKeys, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashKey } from "../lib/api-key-utils";
import { mcpEvents, TaskEvent } from "../lib/mcp-events";

const sessionUserMap = new Map<string, string>();

mcpEvents.on("task:event", async (event: TaskEvent) => {
  console.log(`[MCP] Task event received:`, event.type, event.task.id);

  for (const [sessionId, transport] of Object.entries(transports)) {
    const userId = sessionUserMap.get(sessionId);

    if (userId && (userId === event.userId || event.workspaceId)) {
      try {
        await transport.send({
          jsonrpc: "2.0",
          method: "notifications/message",
          params: {
            level: "info",
            logger: "taskhub",
            data: {
              type: event.type,
              task: event.task,
              timestamp: event.timestamp,
            }
          }
        });
        console.log(`[MCP] Notification sent to session ${sessionId} (user ${userId})`);
      } catch (error) {
        console.error(`[MCP] Failed to send notification to ${sessionId}:`, error);
      }
    }
  }
});

export const mcpServer = new Elysia({ name: "mcp-server" })
  .use(
    mcp({
      stateless: true,
      enableJsonResponse: true,
      serverInfo: {
        name: "Task Hub AI Bridge",
        version: "1.0.0",
      },
      authentication: async ({ request }) => {
        const url = new URL(request.url);
        const queryKey = url.searchParams.get("apiKey") || url.searchParams.get("token");
        const authHeader = request.headers.get("Authorization");

        const apiKey = (queryKey || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null))?.trim();

        if (!apiKey || apiKey === "") {
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

        await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.key, hashedKey));

        const sessionId = request.headers.get("mcp-session-id");
        if (sessionId) {
          sessionUserMap.set(sessionId, keyRecord.userId);
          console.log(`[MCP] Mapped session ${sessionId} to user ${keyRecord.userId}`);
        }

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

export { sessionUserMap };
