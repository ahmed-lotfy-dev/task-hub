import { db } from "../db/db";
import { cards, boards, cardAssignees, users, cardComments, workspaceMembers } from "../db/schema";
import { eq, and, or, sql, desc } from "drizzle-orm";
import { logActivity } from "../lib/activity-logger";
import { mcpEvents } from "../lib/mcp-events";

export class TaskService {
  static async getBoardTasks(boardId: string, userId?: string) {


    // Let's first ensure we can fetch the tasks with all relations.
    return await db.query.cards.findMany({
      where: eq(cards.boardId, boardId as any),
      limit: 100,
      with: {
        assignees: {
          with: {
            user: true
          }
        },
        labels: {
          with: {
            label: true
          }
        },
        comments: true, 
      }
    }).then(tasks => tasks.map(t => ({
      ...t,
      // Map back to flat structure expected by frontend
      assignees: t.assignees.map(a => a.user),
      labels: t.labels.map(l => l.label),
      commentCount: t.comments.length
    })));
  }

  static async getTaskById(taskId: string, userId?: string) {
    const task = await db.query.cards.findFirst({
      where: eq(cards.id, taskId as any),
      with: {
        assignees: {
          with: {
            user: true
          }
        },
        labels: {
          with: {
            label: true
          }
        },
        checklists: {
          with: {
            items: true
          }
        },
        attachments: true
      }
    });

    if (!task) return null;

    return {
      ...task,
      assignees: task.assignees.map(a => a.user),
      labels: task.labels.map(l => l.label)
    };
  }

  static async createTask(data: {
    userId: string;
    boardId: string;
    listId: string;
    title: string;
    description?: string;
    position?: number;
    priority?: "low" | "medium" | "high";
  }) {
    let position = data.position;
    if (position === undefined) {
      const lastCard = await db
        .select({ position: cards.position })
        .from(cards)
        .where(eq(cards.listId, data.listId as any))
        .orderBy(desc(cards.position))
        .limit(1);
      position = (lastCard[0]?.position ?? 0) + 1000;
    }

    const [card] = await db
      .insert(cards)
      .values({
        boardId: data.boardId,
        listId: data.listId,
        title: data.title,
        description: data.description ?? null,
        priority: (data.priority as any) ?? null,
        position,
      })
      .returning();

    const [board] = await db.select().from(boards).where(eq(boards.id, data.boardId as any)).limit(1);
    if (board) {
      await logActivity({
        userId: data.userId,
        workspaceId: board.workspaceId,
        boardId: board.id,
        action: 'create',
        entityType: 'card',
        entityId: card.id,
        entityName: card.title,
        metadata: { via: 'service' }
      });

      mcpEvents.emitTaskEvent({
        type: "task:created",
        task: {
          id: card.id,
          title: card.title,
          boardId: card.boardId,
          workspaceId: board.workspaceId,
          listId: card.listId,
          description: card.description || undefined,
          priority: card.priority || undefined,
        },
        userId: data.userId,
        workspaceId: board.workspaceId,
        timestamp: new Date().toISOString(),
      });
    }

    return { ...card, assignees: [] };
  }

  static async updateTask(taskId: string, userId: string, updates: {
    title?: string;
    description?: string;
    listId?: string;
    position?: number;
    priority?: string;
    archived?: boolean;
    dueDate?: Date;
    startDate?: Date;
  }) {
    const [card] = await db.update(cards)
      .set({ ...updates, priority: updates.priority as any, updatedAt: new Date() })
      .where(eq(cards.id, taskId as any))
      .returning();

    if (!card) return null;

    const [board] = await db.select().from(boards).where(eq(boards.id, card.boardId as any)).limit(1);
    if (board) {
      mcpEvents.emitTaskEvent({
        type: "task:updated",
        task: {
          id: card.id,
          title: card.title,
          boardId: card.boardId,
          workspaceId: board.workspaceId,
          listId: card.listId,
          description: card.description || undefined,
          priority: card.priority || undefined,
        },
        userId: userId,
        workspaceId: board.workspaceId,
        timestamp: new Date().toISOString(),
      });
    }

    return card;
  }

  static async deleteTask(taskId: string, userId: string) {
    const [card] = await db
      .select()
      .from(cards)
      .where(eq(cards.id, taskId as any))
      .limit(1);

    if (!card) return null;

    const [board] = await db.select().from(boards).where(eq(boards.id, card.boardId as any)).limit(1);
    if (board) {
      await logActivity({
        userId,
        workspaceId: board.workspaceId,
        boardId: board.id,
        action: 'delete',
        entityType: 'card',
        entityId: card.id,
        entityName: card.title,
        metadata: { via: 'service' }
      });

      mcpEvents.emitTaskEvent({
        type: "task:deleted",
        task: {
          id: card.id,
          title: card.title,
          boardId: card.boardId,
          workspaceId: board.workspaceId,
        },
        userId: userId,
        workspaceId: board.workspaceId,
        timestamp: new Date().toISOString(),
      });
    }

    await db.delete(cards).where(eq(cards.id, taskId as any));
    return card;
  }

  static async assignUser(taskId: string, userId: string, actorId: string) {
    await db.insert(cardAssignees).values({
      cardId: taskId as any,
      userId
    }).onConflictDoNothing();

    const card = await this.getTaskById(taskId);
    if (card) {
      const [board] = await db.select().from(boards).where(eq(boards.id, card.boardId as any)).limit(1);
      if (board) {
        await logActivity({
          userId: actorId,
          workspaceId: board.workspaceId,
          boardId: board.id,
          action: 'assign',
          entityType: 'card',
          entityId: card.id,
          entityName: card.title,
          metadata: { assignedUserId: userId, via: 'service' }
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
          userId: actorId,
          workspaceId: board.workspaceId,
          timestamp: new Date().toISOString(),
        });
      }
    }
    return true;
  }

  static async unassignUser(taskId: string, userId: string) {
    return await db.delete(cardAssignees)
      .where(
        and(
          eq(cardAssignees.cardId, taskId as any),
          eq(cardAssignees.userId, userId)
        )
      )
      .returning();
  }

  static async getUserPriorityTasks(userId: string) {
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
      .innerJoin(workspaceMembers, eq(boards.workspaceId, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          or(
            eq(cards.priority, 'high'),
            eq(cards.priority, 'medium') // fallback since critical isn't in enum
          )
        )
      )
      .orderBy(desc(cards.updatedAt))
      .limit(20);

    return data.map(d => ({
      ...d.card,
      commentCount: d.commentCount,
      assignees: d.assignees
    }));
  }
}
