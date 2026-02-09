import { Elysia, t } from "elysia";
import { User, Workspace, WorkspaceSettings } from "@taskflow/shared";
import { betterAuth } from "../middleware/auth-middleware";
import { WorkspaceService } from "../services/workspace.service";
import { ensureUserOnboarding } from "../lib/provisioning";
import type { Workspace as DBWorkspace } from "../db/schema/workspaces";

function mapWorkspace(w: DBWorkspace & { memberCount?: number; role?: string }): Workspace {
  return {
    ...w,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    settings: w.settings as WorkspaceSettings,
    visibility: w.visibility as "private" | "team" | "public",
    memberCount: w.memberCount || 1,
    role: w.role as any,
  };
}

export const workspaceRoutes = new Elysia({ prefix: "/workspaces" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;

    // Auto-provision if needed
    await ensureUserOnboarding(user.id);

    // Get workspaces the user belongs to
    const userWorkspaces = await WorkspaceService.listWorkspaces(user.id);

    // Get member count for each workspace
    const workspacesWithCounts = await Promise.all(
      userWorkspaces.map(async (uw) => {
        const count = await WorkspaceService.getMemberCount(uw.id);
        return mapWorkspace({ ...uw, memberCount: count });
      })
    );

    return workspacesWithCounts;
  }, {
    auth: true
  })
  .get("/:id", async (context: any) => {
    const { id } = context.params;
    const workspace = await WorkspaceService.getWorkspaceById(id);
    if (!workspace) {
      context.set.status = 404;
      return { message: "Workspace not found" };
    }
    const count = await WorkspaceService.getMemberCount(id);
    return mapWorkspace({ ...workspace, memberCount: count });
  }, {
    auth: true,
    params: t.Object({ id: t.String() })
  })
  .get("/:id/members", async (context: any) => {
    const { id: workspaceId } = context.params;
    const user = context.user as User;

    const role = await WorkspaceService.getMemberRole(workspaceId, user.id);
    if (!role) {
      context.set.status = 403;
      return { message: "You are not a member of this workspace" };
    }

    const members = await WorkspaceService.getWorkspaceMembers(workspaceId);

    return members.map(m => ({
      ...m,
      joinedAt: m.joinedAt.toISOString(),
    }));
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  })
  .delete("/:id/members/:userId", async (context: any) => {
    const { id: workspaceId, userId } = context.params;
    const currentUser = context.user as User;

    try {
      await WorkspaceService.removeMember(workspaceId, userId, currentUser.id);
      return { message: "Member removed successfully" };
    } catch (error: any) {
      context.set.status = 400; // Simplified for brevity, service throws specific errors
      return { message: error.message };
    }
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
      userId: t.String()
    })
  })
  .post("/", async (context: any) => {
    const user = context.user as User;
    const body = context.body;

    const workspace = await WorkspaceService.createWorkspace({
      ...body,
      userId: user.id,
      visibility: body.visibility as any
    });

    return mapWorkspace(workspace);
  }, {
    auth: true,
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      visibility: t.Optional(t.String())
    })
  })
  .put("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;
    const body = context.body;

    const updated = await WorkspaceService.updateWorkspace(id, user.id, {
      ...body,
      visibility: body.visibility as any
    });

    if (!updated) {
      context.set.status = 404;
      return { message: "Workspace not found" };
    }

    return mapWorkspace(updated);
  }, {
    auth: true,
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      visibility: t.Optional(t.String())
    })
  })
  .delete("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    try {
      const deleted = await WorkspaceService.deleteWorkspace(id, user.id);
      if (!deleted) {
        context.set.status = 404;
        return { message: "Workspace not found" };
      }
      return { success: true, message: `Workspace ${deleted.name} deleted` };
    } catch (error: any) {
      context.set.status = 403;
      return { message: error.message };
    }
  }, {
    auth: true,
    params: t.Object({ id: t.String() })
  });

