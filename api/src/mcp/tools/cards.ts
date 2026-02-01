import { db } from "../../db/db";
import { cards, lists } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logActivity } from "../../lib/activity-logger";

export const registerCardTools = (server: McpServer) => {
  // Get all cards (tasks) for a specific board
  server.tool(
    "get_board_tasks",
    {
      boardId: z.string().describe("The UUID of the board")
    },
    async ({ boardId }) => {
      const data = await db
        .select()
        .from(cards)
        .where(eq(cards.boardId, boardId as any));

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

  // List all lists for a board (to find destination list for new tasks)
  server.tool(
    "list_board_lists",
    {
      boardId: z.string().describe("The UUID of the board")
    },
    async ({ boardId }) => {
      const data = await db
        .select()
        .from(lists)
        .where(eq(lists.boardId, boardId as any))
        .orderBy(lists.position);

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

  // Create a new task (card)
  server.tool(
    "create_task",
    {
      userId: z.string().describe("The ID of the user creating the task"),
      workspaceId: z.string().describe("The UUID of the workspace"),
      boardId: z.string().describe("The UUID of the board"),
      listId: z.string().describe("The UUID of the list"),
      title: z.string().describe("The title of the task"),
      description: z.string().optional().describe("The description of the task"),
      priority: z.enum(['low', 'medium', 'high']).optional().describe("The task priority")
    },
    async ({ userId, workspaceId, boardId, listId, title, description, priority }) => {
      // Get highest position to append to end
      const lastCard = await db
        .select({ position: cards.position })
        .from(cards)
        .where(eq(cards.listId, listId as any))
        .orderBy(desc(cards.position))
        .limit(1);

      const position = (lastCard[0]?.position ?? 0) + 1000;

      const [card] = await db
        .insert(cards)
        .values({
          boardId: boardId as any,
          listId: listId as any,
          title,
          description: description ?? null,
          priority: priority as any,
          position,
        })
        .returning();

      await logActivity({
        userId,
        workspaceId: workspaceId as any,
        boardId: boardId as any,
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
    }
  );
};
