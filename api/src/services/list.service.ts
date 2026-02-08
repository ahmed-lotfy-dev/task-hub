import { db } from "../db/db";
import { boards, lists } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import { logActivity } from "../lib/activity-logger";

export class ListService {
  static async getBoardLists(boardId: string) {
    const data = await db
      .select()
      .from(lists)
      .where(eq(lists.boardId, boardId as any))
      .orderBy(asc(lists.position));
    return data;
  }

  static async createList(data: {
    boardId: string;
    userId: string;
    name: string;
    position?: number;
  }) {
    const [list] = await db.insert(lists).values({
      boardId: data.boardId,
      name: data.name,
      position: data.position ?? 1000,
    }).returning();

    // Get workspaceId for logging
    const [board] = await db.select().from(boards).where(eq(boards.id, data.boardId as any)).limit(1);

    if (board) {
      await logActivity({
        userId: data.userId,
        workspaceId: board.workspaceId,
        boardId: board.id,
        action: 'create',
        entityType: 'list',
        entityId: list.id,
        entityName: list.name,
        metadata: { via: 'service' }
      });
    }

    return list;
  }

  static async updateList(listId: string, userId: string, updates: {
    name?: string;
    position?: number;
  }) {
    const [updated] = await db
      .update(lists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lists.id, listId as any))
      .returning();

    if (!updated) return null;

    // Optional: Log list update activity
    // ...

    return updated;
  }

  static async deleteList(listId: string, userId: string) {
    const [deleted] = await db
      .delete(lists)
      .where(eq(lists.id, listId as any))
      .returning();

    if (!deleted) return null;

    // Optional: Log list deletion activity
    // ...

    return deleted;
  }
}
