import { db } from "../../db/db";
import { cards, lists } from "../../db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logActivity } from "../../lib/activity-logger";

export const registerCardTools = (server: McpServer) => {
  server.registerTool(
    "get_board_tasks",
    {
      description: "Get all tasks (cards) in a board",
      inputSchema: z.object({
        boardId: z.string().describe("The UUID of the board")
      })
    },
    async ({ boardId }) => {
      try {
        const data = await db
          .select()
          .from(cards)
          .where(eq(cards.boardId, boardId));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error fetching board tasks: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "list_board_lists",
    {
      description: "List all lists in a board",
      inputSchema: z.object({
        boardId: z.string().describe("The UUID of the board")
      })
    },
    async ({ boardId }) => {
      try {
        const data = await db
          .select()
          .from(lists)
          .where(eq(lists.boardId, boardId))
          .orderBy(asc(lists.position));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error listing board lists: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "create_task",
    {
      description: "Create a new task (card) in a list",
      inputSchema: z.object({
        userId: z.string().describe("The ID of the user creating the task"),
        workspaceId: z.string().describe("The UUID of the workspace"),
        boardId: z.string().describe("The UUID of the board"),
        listId: z.string().describe("The UUID of the list"),
        title: z.string().describe("The title of the task"),
        description: z.string().optional().describe("The description of the task"),
        priority: z.enum(['low', 'medium', 'high']).optional().describe("The task priority")
      })
    },
    async ({ userId, workspaceId, boardId, listId, title, description, priority }) => {
      try {
        const lastCard = await db
          .select({ position: cards.position })
          .from(cards)
          .where(eq(cards.listId, listId))
          .orderBy(desc(cards.position))
          .limit(1);

        const position = (lastCard[0]?.position ?? 0) + 1000;

        const [card] = await db
          .insert(cards)
          .values({
            boardId: boardId,
            listId: listId,
            title,
            description: description ?? null,
            priority: (priority as any) ?? null,
            position,
          })
          .returning();

        await logActivity({
          userId,
          workspaceId: workspaceId,
          boardId: boardId,
          action: 'create',
          entityType: 'card',
          entityId: card.id,
          entityName: card.title,
          metadata: { via: 'mcp' }
        });

        return {
          content: [
            {
              type: "text",
              text: `Card created successfully: ${card.title} (ID: ${card.id})`
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error creating task: ${error.message}` }],
          isError: true
        };
      }
    }
  );
}