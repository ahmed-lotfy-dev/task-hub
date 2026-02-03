import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { boards, workspaceMembers, boardMembers } from "../db/schema";
import { eq, and, or } from "drizzle-orm";
import { Board, User } from "@taskflow/shared";
import type { Board as DBBoard } from "../db/schema/boards";
import { betterAuth } from "../middleware/auth-middleware";
import { logActivity } from "../lib/activity-logger";

function mapBoard(b: DBBoard): Board {
  return {
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    background: b.background as any,
    settings: b.settings as any,
    template: b.template as any,
    visibility: b.visibility as any,
  };
}

export const boardRoutes = new Elysia({ prefix: "/boards" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;
    const { workspaceId } = context.query;

    const data = await db
      .select({ board: boards })
      .from(boards)
      .leftJoin(workspaceMembers, eq(boards.workspaceId, workspaceMembers.workspaceId))
      .leftJoin(boardMembers, eq(boards.id, boardMembers.boardId))
      .where(
        and(
          or(
            eq(workspaceMembers.userId, user.id),
            eq(boardMembers.userId, user.id)
          ),
          workspaceId ? eq(boards.workspaceId, workspaceId) : undefined
        )
      )
      .limit(100);

    // Deduping might be needed if user is matched by both joins, 
    // but map iteration usually handles duplicates if we just mapping records. 
    // Ideally use distinct() in SQL but Drizzle distinctOn supported.
    // For now simple JS dedup by ID
    const uniqueBoards = Array.from(new Map(data.map(item => [item.board.id, item.board])).values());

    return uniqueBoards.map(mapBoard);
  }, {
    auth: true,
    query: t.Object({
      workspaceId: t.Optional(t.String())
    })
  })
  .post("/", async (context: any) => {
    const body = context.body;
    const [board] = await db.insert(boards).values({
      ...body,
      visibility: (body.visibility as "private" | "team" | "public") ?? "private",
      template: (body.template as "kanban" | "scrum" | "simple" | "bug_tracker" | "blank") ?? "blank",
    }).returning();

    const user = context.user as User;
    await logActivity({
      userId: user.id,
      workspaceId: board.workspaceId,
      boardId: board.id,
      action: 'create',
      entityType: 'board',
      entityId: board.id,
      entityName: board.name,
    });

    return mapBoard(board);
  }, {
    auth: true,
    body: t.Object({
      workspaceId: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      visibility: t.Optional(t.String()),
      template: t.Optional(t.String())
    })
  });
