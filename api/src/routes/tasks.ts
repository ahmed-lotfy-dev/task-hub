import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { cards, lists, boards, workspaceMembers, boardMembers, cardComments, cardAssignees, users } from "../db/schema";
import { eq, and, or, sql } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { Card as Task, User } from "@taskflow/shared";
import { mcpEvents } from "../lib/mcp-events";

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .get("/", async (context: any) => {
    const user = context.user as User;
    const { boardId } = context.query;

    const data = await db
      .select({
        card: cards,
        commentCount: sql<number>`(SELECT count(*) FROM ${cardComments} WHERE ${cardComments.cardId} = ${cards.id})`.mapWith(Number),
        assignees: sql<any[]>`coalesce(
          (SELECT json_agg(json_build_object('id', u.id, 'name', u.name, 'image', u.image))
           FROM ${cardAssignees} ca
           JOIN ${users} u ON ca.user_id = u.id
           WHERE ca.card_id = ${cards.id}),
          '[]'
        )`
      })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          boardId ? eq(cards.boardId, boardId) : undefined,
          or(
            sql`EXISTS (SELECT 1 FROM ${workspaceMembers} WHERE ${workspaceMembers.workspaceId} = ${boards.workspaceId} AND ${workspaceMembers.userId} = ${user.id})`,
            sql`EXISTS (SELECT 1 FROM ${boardMembers} WHERE ${boardMembers.boardId} = ${boards.id} AND ${boardMembers.userId} = ${user.id})`
          )
        )
      )
      .limit(50);

    return data.map((d) => {
      const c = d.card;
      return {
        ...c,
        commentCount: d.commentCount,
        assignees: d.assignees,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        dueDate: c.dueDate?.toISOString() ?? null,
        startDate: c.startDate?.toISOString() ?? null,
        priority: c.priority as any,
      };
    });
  }, {
    auth: true,
    query: t.Object({
      boardId: t.Optional(t.String())
    })
  })
  .get("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    const [data] = await db
      .select({
        card: cards,
        assignees: sql<any[]>`coalesce(
          (SELECT json_agg(json_build_object('id', u.id, 'name', u.name, 'image', u.image))
           FROM ${cardAssignees} ca
           JOIN ${users} u ON ca.user_id = u.id
           WHERE ca.card_id = ${cards.id}),
          '[]'
        )`
      })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(cards.id, id),
          or(
            sql`EXISTS (SELECT 1 FROM ${workspaceMembers} WHERE ${workspaceMembers.workspaceId} = ${boards.workspaceId} AND ${workspaceMembers.userId} = ${user.id})`,
            sql`EXISTS (SELECT 1 FROM ${boardMembers} WHERE ${boardMembers.boardId} = ${boards.id} AND ${boardMembers.userId} = ${user.id})`
          )
        )
      )
      .limit(1);

    if (!data) {
      throw new Error("Task not found or access denied");
    }

    console.log(`[Backend] Fetched task ${id}, assignees:`, data.assignees);

    const c = data.card;
    return {
      ...c,
      assignees: data.assignees,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      dueDate: c.dueDate?.toISOString() ?? null,
      startDate: c.startDate?.toISOString() ?? null,
      priority: c.priority as any,
    };
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
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

      mcpEvents.emitTaskEvent({
        type: "task:created",
        task: {
          id: c.id,
          title: c.title,
          boardId: c.boardId,
          workspaceId: board.workspaceId,
          listId: c.listId,
          description: c.description || undefined,
          priority: c.priority || undefined,
        },
        userId: user.id,
        workspaceId: board.workspaceId,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      ...c,
      assignees: [],
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
    const user = context.user as User;

    const [card] = await db.update(cards)
      .set(body)
      .where(eq(cards.id, id))
      .returning();
    const c = card;

    const [board] = await db.select().from(boards).where(eq(boards.id, c.boardId)).limit(1);
    if (board) {
      mcpEvents.emitTaskEvent({
        type: "task:updated",
        task: {
          id: c.id,
          title: c.title,
          boardId: c.boardId,
          workspaceId: board.workspaceId,
          listId: c.listId,
          description: c.description || undefined,
          priority: c.priority || undefined,
        },
        userId: user.id,
        workspaceId: board.workspaceId,
        timestamp: new Date().toISOString(),
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
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      listId: t.Optional(t.String()),
      position: t.Optional(t.Number()),
      priority: t.Optional(t.String()),
      archived: t.Optional(t.Boolean())
    })
  })
  .delete("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    // Get task for logging before deletion
    const [card] = await db
      .select()
      .from(cards)
      .where(eq(cards.id, id))
      .limit(1);

    if (card) {
      const [board] = await db.select().from(boards).where(eq(boards.id, card.boardId)).limit(1);
      if (board) {
        await logActivity({
          userId: user.id,
          workspaceId: board.workspaceId,
          boardId: board.id,
          action: 'delete',
          entityType: 'card',
          entityId: card.id,
          entityName: card.title,
        });

        mcpEvents.emitTaskEvent({
          type: "task:deleted",
          task: {
            id: card.id,
            title: card.title,
            boardId: card.boardId,
            workspaceId: board.workspaceId,
          },
          userId: user.id,
          workspaceId: board.workspaceId,
          timestamp: new Date().toISOString(),
        });
      }
    }

    await db.delete(cards).where(eq(cards.id, id));

    return { success: true };
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  })
  .post("/:id/assignees", async (context: any) => {
    const { id } = context.params;
    const { userId } = context.body;
    console.log(`[Backend] Assigning user ${userId} to task ${id}`);

    try {
      await db.insert(cardAssignees).values({
        cardId: id,
        userId
      }).onConflictDoNothing();

      // Log assignment activity
      const [card] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
      if (card) {
        const [board] = await db.select().from(boards).where(eq(boards.id, card.boardId)).limit(1);
        if (board) {
          const user = context.user as User;
          await logActivity({
            userId: user.id,
            workspaceId: board.workspaceId,
            boardId: board.id,
            action: 'assign',
            entityType: 'card',
            entityId: card.id,
            entityName: card.title,
            metadata: { assignedUserId: userId }
          });

          mcpEvents.emitTaskEvent({
            type: "task:assigned",
            task: {
              id: card.id,
              title: card.title,
              boardId: card.boardId,
              workspaceId: board.workspaceId,
              assignedUserId: userId,
            },
            userId: user.id,
            workspaceId: board.workspaceId,
            timestamp: new Date().toISOString(),
          });
        }
      }

      console.log(`[Backend] Assignment successful for ${userId}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[Backend] Assignment failed for ${userId}:`, error);
      throw error;
    }
  }, {
    auth: true,
    params: t.Object({ id: t.String() }),
    body: t.Object({ userId: t.String() })
  })
  .delete("/:id/assignees/:userId", async (context: any) => {
    const { id, userId } = context.params;

    await db.delete(cardAssignees)
      .where(
        and(
          eq(cardAssignees.cardId, id),
          eq(cardAssignees.userId, userId)
        )
      );

    return { success: true };
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
      userId: t.String()
    })
  });
