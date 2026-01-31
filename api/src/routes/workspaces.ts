import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { workspaces, workspaceMembers } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const workspaceRoutes = new Elysia({ prefix: "/workspaces" })
  .get("/", async ({ user }: any) => {
    const userWorkspaces = await db
      .select({
        workspace: workspaces,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, user.id));

    return userWorkspaces.map(w => w.workspace);
  }, {
    auth: true
  })
  .post("/", async ({ body, user }: any) => {
    const { name, description, visibility } = body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    return await db.transaction(async (tx) => {
      const [workspace] = await tx.insert(workspaces).values({
        name,
        description,
        visibility,
        slug,
        ownerId: user.id,
      }).returning();

      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: user.id,
        role: "admin",
      });

      return workspace;
    });
  }, {
    auth: true,
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      visibility: t.Optional(t.String())
    })
  });
