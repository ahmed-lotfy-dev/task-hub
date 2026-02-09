import { db } from "../db/db";
import { boards, lists, workspaceMembers } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { logActivity } from "../lib/activity-logger";

export class BoardService {
  static async getWorkspaceBoards(workspaceId: string) {
    return await db
      .select()
      .from(boards)
      .where(eq(boards.workspaceId, workspaceId));
  }

  static async getBoardById(boardId: string) {
    const [board] = await db
      .select()
      .from(boards)
      .where(eq(boards.id, boardId as any))
      .limit(1);
    return board;
  }

  static async createBoard(data: {
    workspaceId: string;
    userId: string;
    name: string;
    description?: string;
    visibility?: "private" | "team" | "public";
    template?: "kanban" | "scrum" | "simple" | "bug_tracker" | "blank";
  }) {
    return await db.transaction(async (tx) => {
      const [board] = await tx.insert(boards).values({
        workspaceId: data.workspaceId,
        name: data.name,
        description: data.description ?? null,
        visibility: data.visibility ?? "private",
        template: data.template ?? "blank",
      }).returning();

      // Create default lists based on template
      const template = data.template || "blank";
      let boardLists: { name: string; position: number }[] = [];

      if (template === "kanban" || template === "simple") {
        boardLists = [
          { name: "Backlog", position: 1000 },
          { name: "In Progress", position: 2000 },
          { name: "Review", position: 3000 },
          { name: "Done", position: 4000 },
        ];
      } else if (template === "scrum") {
        boardLists = [
          { name: "Backlog", position: 1024 },
          { name: "In Progress", position: 2048 },
          { name: "Review", position: 3072 },
          { name: "Done", position: 4096 },
        ];
      } else if (template === "bug_tracker") {
        boardLists = [
          { name: "Reported", position: 1024 },
          { name: "In Progress", position: 2048 },
          { name: "Fixed", position: 3072 },
          { name: "Verified", position: 4096 },
        ];
      }

      for (const list of boardLists) {
        await tx.insert(lists).values({
          boardId: board.id,
          name: list.name,
          position: list.position,
        });
      }

      await logActivity({
        userId: data.userId,
        workspaceId: data.workspaceId,
        boardId: board.id,
        action: 'create',
        entityType: 'board',
        entityId: board.id,
        entityName: board.name,
        metadata: { via: 'service', template }
      });

      return board;
    });
  }

  static async updateBoard(boardId: string, userId: string, updates: {
    name?: string;
    description?: string;
    visibility?: "private" | "team" | "public";
    archived?: boolean;
  }) {
    const [updated] = await db
      .update(boards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(boards.id, boardId as any))
      .returning();

    if (!updated) return null;

    await logActivity({
      userId,
      workspaceId: updated.workspaceId,
      boardId: updated.id,
      action: 'update',
      entityType: 'board',
      entityId: updated.id,
      entityName: updated.name,
      metadata: { via: 'service', updates }
    });

    return updated;
  }

  static async deleteBoard(boardId: string, userId: string) {
    const [deleted] = await db
      .delete(boards)
      .where(eq(boards.id, boardId as any))
      .returning();

    if (!deleted) return null;

    await logActivity({
      userId,
      workspaceId: deleted.workspaceId,
      boardId: deleted.id,
      action: 'delete',
      entityType: 'board',
      entityId: deleted.id,
      entityName: deleted.name,
      metadata: { via: 'service' }
    });

    return deleted;
  }

  static async listUserBoards(userId: string) {
    return await db
      .select()
      .from(boards)
      .innerJoin(workspaceMembers, eq(boards.workspaceId, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId));
  }

  static async getBoardMembers(boardId: string) {
    const board = await this.getBoardById(boardId);
    if (!board) return [];

    const { boardMembers, workspaceMembers, users } = await import("../db/schema");

    // Get specific board members
    const boardMembersData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(boardMembers)
      .innerJoin(users, eq(boardMembers.userId, users.id))
      .where(eq(boardMembers.boardId, boardId as any));

    // Get workspace members (who also have access to the board)
    const workspaceMembersData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, board.workspaceId));

    // Combine and deduplicate
    const allMembers = [...boardMembersData];
    workspaceMembersData.forEach(wm => {
      if (!allMembers.find(m => m.id === wm.id)) {
        allMembers.push(wm as any);
      }
    });

    return allMembers;
  }
}
