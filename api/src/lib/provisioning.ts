import { db } from "../db/db";
import { workspaces, workspaceMembers, boards, lists } from "../db/schema";
import { eq, count } from "drizzle-orm";
import { logActivity } from "./activity-logger";

/**
 * Ensures a user has a default environment.
 * If no workspaces are found for the user, creates a "Personal Workspace",
 * a "General" board, and standard lists (To Do, In Progress, Done).
 */
export async function ensureUserOnboarding(userId: string) {
  // Check if user already has workspaces
  const [result] = await db
    .select({ value: count() })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId));

  if (result.value > 0) {
    return;
  }

  console.log(`Provisioning default environment for user: ${userId}`);

  await db.transaction(async (tx) => {
    // 1. Create Personal Workspace
    const [workspace] = await tx
      .insert(workspaces)
      .values({
        name: "Personal Workspace",
        slug: "personal-workspace",
        ownerId: userId,
        visibility: "private",
      })
      .returning();

    // Log Activity: Workspace Created
    await logActivity({
      userId,
      workspaceId: workspace.id,
      action: 'create',
      entityType: 'workspace',
      entityId: workspace.id,
      entityName: workspace.name,
    });

    // 2. Add user as admin member
    await tx.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: userId,
      role: "admin",
    });

    // 3. Create General Board
    const [board] = await tx
      .insert(boards)
      .values({
        workspaceId: workspace.id,
        name: "General",
        visibility: "private",
        template: "kanban",
      })
      .returning();

    // Log Activity: Board Created
    await logActivity({
      userId,
      workspaceId: workspace.id,
      boardId: board.id,
      action: 'create',
      entityType: 'board',
      entityId: board.id,
      entityName: board.name,
    });

    // 4. Create Default Lists
    const defaultLists = [
      { name: "To Do", position: 1024 },
      { name: "In Progress", position: 2048 },
      { name: "Done", position: 3072 },
    ];

    for (const list of defaultLists) {
      await tx.insert(lists).values({
        boardId: board.id,
        name: list.name,
        position: list.position,
      });
    }
  });

  console.log(`Successfully provisioned default environment for user: ${userId}`);
}
