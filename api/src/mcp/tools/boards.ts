import { db } from "../../db/db";
import { lists } from "../../db/schema";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logActivity } from "../../lib/activity-logger";
import { BoardService } from "../../services/board.service";
import { ListService } from "../../services/list.service";

export const registerBoardTools = (server: McpServer) => {
  server.registerTool(
    "get_workspace_boards",
    {
      description: "Get all boards in a workspace",
      inputSchema: z.object({
        workspaceId: z.string().describe("The UUID of the workspace")
      })
    },
    async ({ workspaceId }) => {
      try {
        const data = await BoardService.getWorkspaceBoards(workspaceId);
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
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "create_board",
    {
      description: "Create a new board in a workspace",
      inputSchema: z.object({
        workspaceId: z.string().describe("The UUID of the workspace"),
        name: z.string().describe("The name of the board"),
        description: z.string().optional().describe("Board description"),
        visibility: z.enum(["private", "team", "public"]).optional().describe("Board visibility"),
        template: z.enum(["kanban", "scrum", "simple", "bug_tracker", "blank"]).optional().describe("Board template")
      })
    },
    async ({ workspaceId, name, description, visibility, template }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }

      try {
        const board = await BoardService.createBoard({
          workspaceId,
          userId,
          name,
          description,
          visibility,
          template
        });

        return {
          content: [{ type: "text", text: `Board '${name}' created (ID: ${board.id})` }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error creating board: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "create_list",
    {
      description: "Create a new list on a board",
      inputSchema: z.object({
        boardId: z.string().describe("The UUID of the board"),
        name: z.string().describe("The name of the list"),
        position: z.number().optional().describe("Sort position")
      })
    },
    async ({ boardId, name, position }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }

      try {
        const list = await ListService.createList({
          boardId,
          userId,
          name,
          position
        });

        return {
          content: [{ type: "text", text: `List '${name}' created (ID: ${list.id})` }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error creating list: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "get_board",
    {
      description: "Get detailed information about a board",
      inputSchema: z.object({
        boardId: z.string().uuid().describe("The UUID of the board")
      })
    },
    async ({ boardId }) => {
      try {
        const board = await BoardService.getBoardById(boardId);

        if (!board) {
          return {
            content: [{ type: "text", text: "Board not found" }],
            isError: true
          };
        }

        return {
          content: [{ type: "text", text: JSON.stringify(board, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error fetching board: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "update_board",
    {
      description: "Update board details",
      inputSchema: z.object({
        boardId: z.string().uuid().describe("The UUID of the board"),
        name: z.string().optional().describe("New name"),
        description: z.string().optional().describe("New description"),
        visibility: z.enum(["private", "team", "public"]).optional().describe("New visibility"),
        archived: z.boolean().optional().describe("Archive status")
      })
    },
    async ({ boardId, name, description, visibility, archived }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const updated = await BoardService.updateBoard(boardId, userId, {
          name,
          description,
          visibility,
          archived
        });

        if (!updated) {
          return { content: [{ type: "text", text: "Board not found or update failed" }], isError: true };
        }

        return {
          content: [{ type: "text", text: `Board updated successfully` }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error updating board: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "delete_board",
    {
      description: "Delete a board",
      inputSchema: z.object({
        boardId: z.string().uuid().describe("The UUID of the board")
      })
    },
    async ({ boardId }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const deleted = await BoardService.deleteBoard(boardId, userId);

        if (!deleted) {
          return { content: [{ type: "text", text: "Board not found" }], isError: true };
        }

        return { content: [{ type: "text", text: `Board '${deleted.name}' deleted` }] };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error deleting board: ${error.message}` }],
          isError: true
        };
      }
    }
  );
};

