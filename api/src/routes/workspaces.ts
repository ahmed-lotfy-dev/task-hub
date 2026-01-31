import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { workspaces, workspaceMembers } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { Workspace, WorkspaceSettings, User } from "@taskflow/shared";
import type { Workspace as DBWorkspace } from "../db/schema/workspaces";
import { betterAuth } from "../middleware/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { ensureUserOnboarding } from "../lib/provisioning";

function mapWorkspace(w: DBWorkspace): Workspace {
  return {
    ...w,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    settings: w.settings as WorkspaceSettings,
    visibility: w.visibility as "private" | "team" | "public",
  };
}

export const workspaceRoutes = new Elysia({ prefix: "/workspaces" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;

    // Auto-provision if needed
    await ensureUserOnboarding(user.id);

    const userWorkspaces = await db
      .select({
        workspace: workspaces,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, user!.id));

    return userWorkspaces.map(w => mapWorkspace(w.workspace));
  }, {
    auth: true
  })
  .post("/", async (context: any) => {
    const user = context.user as User;
    const body = context.body;
    const { name, description, visibility } = body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    return await db.transaction(async (tx) => {
      const [workspace] = await tx.insert(workspaces).values({
        name,
        description: description ?? null,
        visibility: (visibility as "private" | "team" | "public") ?? "private",
        slug,
        ownerId: user!.id,
      }).returning();

      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: user!.id,
        role: "admin",
      });

      await logActivity({
        userId: user.id,
        workspaceId: workspace.id,
        action: 'create',
        entityType: 'workspace',
        entityId: workspace.id,
        entityName: workspace.name,
      });

      return mapWorkspace(workspace);
    });
  }, {
    auth: true,
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      visibility: t.Optional(t.String())
    })
  });
