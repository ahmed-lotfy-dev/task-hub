import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { boards, workspaceMembers, boardMembers, users } from "../db/schema";
import { eq, and, or } from "drizzle-orm";
import { Board, User } from "@taskflow/shared";
import type { Board as DBBoard } from "../db/schema/boards";
import { betterAuth } from "../middleware/auth-middleware";
import { BoardService } from "../services/board.service";

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

    if (workspaceId) {
      const data = await BoardService.getWorkspaceBoards(workspaceId);
      return data.map(mapBoard);
    }

    // Default: Get all boards for the user across all workspaces
    const data = await BoardService.listUserBoards(user.id);
    return data.map((d: any) => mapBoard(d.boards));
  }, {
    auth: true,
    query: t.Object({
      workspaceId: t.Optional(t.String())
    })
  })
  .get("/:id", async (context: any) => {
    const { id: boardId } = context.params;
    const board = await BoardService.getBoardById(boardId);

    if (!board) {
      context.set.status = 404;
      return { message: "Board not found" };
    }

    return mapBoard(board);
  }, {
    auth: true,
    params: t.Object({ id: t.String() })
  })

  .post("/", async (context: any) => {
    const body = context.body;
    const user = context.user as User;

    const board = await BoardService.createBoard({
      ...body,
      userId: user.id,
      visibility: (body.visibility as any),
      template: (body.template as any),
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
  })
  .patch("/:id", async (context: any) => {
    const { id: boardId } = context.params;
    const body = context.body;
    const user = context.user as User;

    const updated = await BoardService.updateBoard(boardId, user.id, {
      ...body,
      visibility: body.visibility as any,
    });

    if (!updated) {
      context.set.status = 404;
      return { message: "Board not found or update failed" };
    }

    return mapBoard(updated);
  }, {
    auth: true,
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      visibility: t.Optional(t.String()),
      archived: t.Optional(t.Boolean())
    })
  })

  .delete("/:id", async (context: any) => {
    const { id: boardId } = context.params;
    const user = context.user as User;

    const deleted = await BoardService.deleteBoard(boardId, user.id);

    if (!deleted) {
      context.set.status = 404;
      return { message: "Board not found" };
    }

    return { success: true, message: `Board ${deleted.name} deleted` };
  }, {
    auth: true,
    params: t.Object({ id: t.String() })
  })
  .get("/:id/members", async (context: any) => {
    const { id: boardId } = context.params;
    const members = await BoardService.getBoardMembers(boardId);
    return members;
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  });

