import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListService } from "../../services/list.service";
import { TaskService } from "../../services/task.service";

export const registerCardTools = (server: McpServer) => {
  server.registerTool(
    "get_board_tasks",
    {
      description: "Get all tasks (cards) in a board",
      inputSchema: z.object({
        boardId: z.string().describe("The UUID of the board")
      })
    },
    async ({ boardId }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      try {
        const data = await TaskService.getBoardTasks(boardId, userId);

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
        const data = await ListService.getBoardLists(boardId);

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
        workspaceId: z.string().describe("The UUID of the workspace (used for context)"),
        boardId: z.string().describe("The UUID of the board"),
        listId: z.string().describe("The UUID of the list"),
        title: z.string().describe("The title of the task"),
        description: z.string().optional().describe("The description of the task"),
        priority: z.enum(['low', 'medium', 'high']).optional().describe("The task priority")
      })
    },
    async ({ boardId, listId, title, description, priority }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const card = await TaskService.createTask({
          userId,
          boardId,
          listId,
          title,
          description,
          priority: priority as any
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

  server.registerTool(
    "update_task",
    {
      description: "Update an existing task",
      inputSchema: z.object({
        taskId: z.string().uuid().describe("The UUID of the task"),
        title: z.string().optional().describe("New title"),
        description: z.string().optional().describe("New description"),
        listId: z.string().optional().describe("New list ID (move task)"),
        priority: z.enum(['low', 'medium', 'high']).optional().describe("New priority")
      })
    },
    async ({ taskId, ...updates }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found." }],
          isError: true
        };
      }
      try {
        const updated = await TaskService.updateTask(taskId, userId, updates as any);
        if (!updated) {
          return { content: [{ type: "text", text: "Task not found" }], isError: true };
        }
        return { content: [{ type: "text", text: `Task updated successfully` }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Error updating task: ${error.message}` }], isError: true };
      }
    }
  );

  server.registerTool(
    "delete_task",
    {
      description: "Delete a task",
      inputSchema: z.object({
        taskId: z.string().uuid().describe("The UUID of the task")
      })
    },
    async ({ taskId }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found." }],
          isError: true
        };
      }
      try {
        const deleted = await TaskService.deleteTask(taskId, userId);
        if (!deleted) {
          return { content: [{ type: "text", text: "Task not found" }], isError: true };
        }
        return { content: [{ type: "text", text: `Task deleted successfully` }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Error deleting task: ${error.message}` }], isError: true };
      }
    }
  );
};