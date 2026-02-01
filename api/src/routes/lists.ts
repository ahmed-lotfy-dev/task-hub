import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { boards, lists } from "../db/schema";
import { eq } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { User } from "@taskflow/shared";

export const listRoutes = new Elysia({ prefix: "/lists" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const { boardId } = context.query;
    if (!boardId) return [];

    const data = await db
      .select()
      .from(lists)
      .where(eq(lists.boardId, boardId));

    return data.sort((a, b) => a.position - b.position).map(l => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));
  }, {
    auth: true,
    query: t.Object({
      boardId: t.String()
    })
  })
  .post("/", async (context: any) => {
    const body = context.body;
    const [list] = await db.insert(lists).values({
      ...body,
      position: body.position ?? 1000,
    }).returning();

    const user = context.user as User;
    // Get workspaceId for logging
    const [board] = await db.select().from(boards).where(eq(boards.id, list.boardId)).limit(1);

    if (board) {
      await logActivity({
        userId: user.id,
        workspaceId: board.workspaceId,
        boardId: board.id,
        action: 'create',
        entityType: 'list',
        entityId: list.id,
        entityName: list.name,
      });
    }

    return {
      ...list,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
    };
  }, {
    auth: true,
    body: t.Object({
      boardId: t.String(),
      name: t.String(),
      position: t.Optional(t.Number())
    })
  });
