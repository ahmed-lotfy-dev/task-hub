import { db } from "../../db/db";
import { boards, lists } from "../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logActivity } from "../../lib/activity-logger";

export const registerBoardTools = (server: McpServer) => {
  server.tool(
    "get_workspace_boards",
    {
      workspaceId: z.string().describe("The UUID of the workspace")
    },
    async ({ workspaceId }) => {
      const data = await db
        .select()
        .from(boards)
        .where(eq(boards.workspaceId, workspaceId as any));

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
    "create_board",
    {
      userId: z.string().describe("The ID of the user creating the board"),
      workspaceId: z.string().describe("The UUID of the workspace"),
      name: z.string().describe("The name of the board"),
      description: z.string().optional().describe("Board description"),
      visibility: z.enum(["private", "team", "public"]).optional().describe("Board visibility"),
      template: z.enum(["kanban", "scrum", "simple", "bug_tracker", "blank"]).optional().describe("Board template")
    },
    async ({ userId, workspaceId, name, description, visibility, template }) => {
      const [board] = await db.insert(boards).values({
        workspaceId: workspaceId as any,
        name,
        description: description ?? null,
        visibility: visibility ?? "private",
        template: template ?? "blank",
      }).returning();

      await logActivity({
        userId,
        workspaceId: workspaceId as any,
        boardId: board.id,
        action: 'create',
        entityType: 'board',
        entityId: board.id,
        entityName: board.name,
        metadata: { via: 'mcp' }
      });

      return {
        content: [{ type: "text", text: `Board '${name}' created (ID: ${board.id})` }]
      };
    }
  );

  server.tool(
    "create_list",
    {
      userId: z.string().describe("The ID of the user creating the list"),
      boardId: z.string().describe("The UUID of the board"),
      workspaceId: z.string().describe("The UUID of the workspace (needed for logging)"),
      name: z.string().describe("The name of the list"),
      position: z.number().optional().describe("Sort position")
    },
    async ({ userId, boardId, workspaceId, name, position }) => {
      const [list] = await db.insert(lists).values({
        boardId: boardId as any,
        name,
        position: position ?? 1000,
      }).returning();

      await logActivity({
        userId,
        workspaceId: workspaceId as any,
        boardId: boardId as any,
        action: 'create',
        entityType: 'list',
        entityId: list.id,
        entityName: list.name,
        metadata: { via: 'mcp' }
      });

      return {
        content: [{ type: "text", text: `List '${name}' created (ID: ${list.id})` }]
      };
    }
  );
};
