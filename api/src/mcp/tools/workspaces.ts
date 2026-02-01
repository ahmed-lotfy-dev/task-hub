import { db } from "../../db/db";
import { workspaces, workspaceMembers } from "../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logActivity } from "../../lib/activity-logger";

export const registerWorkspaceTools = (server: McpServer) => {
  server.tool(
    "list_workspaces",
    {
      userId: z.string().describe("The ID of the user whose workspaces to list")
    },
    async ({ userId }) => {
      const data = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.ownerId, userId));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    "create_workspace",
    {
      userId: z.string().describe("The ID of the owner user"),
      name: z.string().describe("The name of the workspace"),
      description: z.string().optional().describe("Workspace description"),
      visibility: z.enum(["private", "team", "public"]).optional().describe("Workspace visibility")
    },
    async ({ userId, name, description, visibility }) => {
      const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");

      const result = await db.transaction(async (tx) => {
        const [workspace] = await tx.insert(workspaces).values({
          name,
          description: description ?? null,
          visibility: visibility ?? "private",
          slug,
          ownerId: userId,
        }).returning();

        await tx.insert(workspaceMembers).values({
          workspaceId: workspace.id,
          userId: userId,
          role: "admin",
        });

        await logActivity({
          userId,
          workspaceId: workspace.id,
          action: 'create',
          entityType: 'workspace',
          entityId: workspace.id,
          entityName: workspace.name,
          metadata: { via: 'mcp' }
        });

        return workspace;
      });

      return {
        content: [{ type: "text", text: `Workspace '${name}' created (ID: ${result.id})` }]
      };
    }
  );
};
