import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { cards, lists, boards } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { Card as Task, User } from "@taskflow/shared";

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .get("/", async (context: any) => {
    const { boardId } = context.query;
    const data = await db.select().from(cards).where(boardId ? eq(cards.boardId, boardId) : undefined);
    return data.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      dueDate: c.dueDate?.toISOString() ?? null,
      startDate: c.startDate?.toISOString() ?? null,
      priority: c.priority as any,
    }));
  }, {
    auth: true,
    query: t.Object({
      boardId: t.Optional(t.String())
    })
  })
  .post("/", async (context: any) => {
    const body = context.body;
    const [card] = await db.insert(cards).values({
      ...body,
      priority: body.priority as any,
    }).returning();
    const c = card;

    const user = context.user as User;
    // Get workspaceId for logging
    const [board] = await db.select().from(boards).where(eq(boards.id, c.boardId)).limit(1);

    if (board) {
      await logActivity({
        userId: user.id,
        workspaceId: board.workspaceId,
        boardId: board.id,
        action: 'create',
        entityType: 'card',
        entityId: c.id,
        entityName: c.title,
      });
    }

    return {
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      dueDate: c.dueDate?.toISOString() ?? null,
      startDate: c.startDate?.toISOString() ?? null,
      priority: c.priority as any,
    };
  }, {
    auth: true,
    body: t.Object({
      boardId: t.String(),
      listId: t.String(),
      title: t.String(),
      description: t.Optional(t.String()),
      position: t.Number(),
      priority: t.Optional(t.String())
    })
  })
  .patch("/:id", async (context: any) => {
    const { id } = context.params;
    const body = context.body;
    const [card] = await db.update(cards)
      .set(body)
      .where(eq(cards.id, id))
      .returning();
    const c = card;
    return {
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      dueDate: c.dueDate?.toISOString() ?? null,
      startDate: c.startDate?.toISOString() ?? null,
      priority: c.priority as any,
    };
  }, {
    auth: true,
    body: t.Object({
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      listId: t.Optional(t.String()),
      position: t.Optional(t.Number()),
      priority: t.Optional(t.String()),
      archived: t.Optional(t.Boolean())
    })
  });
