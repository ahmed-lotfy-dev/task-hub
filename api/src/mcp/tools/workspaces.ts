import { db } from "../../db/db";
import { workspaces, workspaceMembers, users } from "../../db/schema";
import { eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logActivity } from "../../lib/activity-logger";

export const registerWorkspaceTools = (server: McpServer) => {
  server.registerTool(
    "list_workspaces",
    {
      description: "List all workspaces a user is a member of",
      inputSchema: z.object({
        userId: z.string().describe("The ID of the user")
      })
    },
    async ({ userId }) => {
      try {
        // Find workspaces where user is owner OR a member
        const data = await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
            slug: workspaces.slug,
            description: workspaces.description,
            visibility: workspaces.visibility,
            ownerId: workspaces.ownerId,
            role: workspaceMembers.role,
            createdAt: workspaces.createdAt
          })
          .from(workspaces)
          .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
          .where(eq(workspaceMembers.userId, userId));

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

        const query = db.select().from(workspaces);
        if (workspaceId) {
          query.where(eq(workspaces.id, workspaceId as any));
        } else if (slug) {
          query.where(eq(workspaces.slug, slug));
        }

        const [workspace] = await query.limit(1);

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
        userId: z.string().describe("The ID of the owner user"),
        name: z.string().describe("The name of the workspace"),
        description: z.string().optional().describe("Workspace description"),
        visibility: z.enum(["private", "team", "public"]).optional().describe("Workspace visibility")
      })
    },
    async ({ userId, name, description, visibility }) => {
      try {
        const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

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
            role: "owner",
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
    async ({ workspaceId, name, description, visibility }) => {
      try {
        const updates: any = {};
        if (name) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (visibility) updates.visibility = visibility;
        if (name) updates.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

        if (Object.keys(updates).length === 0) {
          return { content: [{ type: "text", text: "No updates provided" }] };
        }

        const [updated] = await db
          .update(workspaces)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(workspaces.id, workspaceId as any))
          .returning();

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
    async ({ workspaceId }) => {
      try {
        const [deleted] = await db
          .delete(workspaces)
          .where(eq(workspaces.id, workspaceId as any))
          .returning();

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
        const members = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: workspaceMembers.role,
            joinedAt: workspaceMembers.joinedAt
          })
          .from(workspaceMembers)
          .innerJoin(users, eq(workspaceMembers.userId, users.id))
          .where(eq(workspaceMembers.workspaceId, workspaceId as any));

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
