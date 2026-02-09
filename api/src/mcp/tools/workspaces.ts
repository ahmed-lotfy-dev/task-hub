import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WorkspaceService } from "../../services/workspace.service";

export const registerWorkspaceTools = (server: McpServer) => {
  server.registerTool(
    "list_workspaces",
    {
      description: "List all workspaces a user is a member of",
      inputSchema: z.object({})
    },
    async (_, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const data = await WorkspaceService.listWorkspaces(userId);

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
          content: [{ type: "text", text: `Error listing workspaces: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "get_workspace",
    {
      description: "Get detailed information about a workspace",
      inputSchema: z.object({
        workspaceId: z.string().uuid().optional().describe("The UUID of the workspace"),
        slug: z.string().optional().describe("The workspace slug")
      })
    },
    async ({ workspaceId, slug }) => {
      try {
        if (!workspaceId && !slug) {
          throw new Error("Either workspaceId or slug must be provided");
        }

        const workspace = workspaceId
          ? await WorkspaceService.getWorkspaceById(workspaceId)
          : await WorkspaceService.getWorkspaceBySlug(slug!);

        if (!workspace) {
          return {
            content: [{ type: "text", text: "Workspace not found" }],
            isError: true
          };
        }

        return {
          content: [{ type: "text", text: JSON.stringify(workspace, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error fetching workspace: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "create_workspace",
    {
      description: "Create a new workspace",
      inputSchema: z.object({
        name: z.string().describe("The name of the workspace"),
        description: z.string().optional().describe("Workspace description"),
        visibility: z.enum(["private", "team", "public"]).optional().describe("Workspace visibility")
      })
    },
    async ({ name, description, visibility }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const result = await WorkspaceService.createWorkspace({
          name,
          userId,
          description,
          visibility
        });

        return {
          content: [{ type: "text", text: `Workspace '${name}' created (ID: ${result.id})` }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error creating workspace: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "update_workspace",
    {
      description: "Update workspace details",
      inputSchema: z.object({
        workspaceId: z.string().uuid().describe("The UUID of the workspace"),
        name: z.string().optional().describe("New name"),
        description: z.string().optional().describe("New description"),
        visibility: z.enum(["private", "team", "public"]).optional().describe("New visibility")
      })
    },
    async ({ workspaceId, name, description, visibility }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const updated = await WorkspaceService.updateWorkspace(workspaceId, userId, {
          name,
          description,
          visibility
        });

        if (!updated) {
          return { content: [{ type: "text", text: "Workspace not found or update failed" }], isError: true };
        }

        return {
          content: [{ type: "text", text: `Workspace updated successfully` }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error updating workspace: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "delete_workspace",
    {
      description: "Delete a workspace",
      inputSchema: z.object({
        workspaceId: z.string().uuid().describe("The UUID of the workspace")
      })
    },
    async ({ workspaceId }, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found. Please provide a valid API key." }],
          isError: true
        };
      }
      try {
        const deleted = await WorkspaceService.deleteWorkspace(workspaceId, userId);

        if (!deleted) {
          return { content: [{ type: "text", text: "Workspace not found" }], isError: true };
        }

        return { content: [{ type: "text", text: `Workspace '${deleted.name}' deleted` }] };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error deleting workspace: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "get_workspace_members",
    {
      description: "List members of a workspace",
      inputSchema: z.object({
        workspaceId: z.string().uuid().describe("The UUID of the workspace")
      })
    },
    async ({ workspaceId }) => {
      try {
        const members = await WorkspaceService.getWorkspaceMembers(workspaceId);

        return {
          content: [{ type: "text", text: JSON.stringify(members, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error listing members: ${error.message}` }],
          isError: true
        };
      }
    }
  );
};

