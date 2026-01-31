import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { boards } from "../db/schema";
import { eq } from "drizzle-orm";
import { betterAuth } from "../middleware/authMiddleware";
import { Board } from "@taskflow/shared";
import type { Board as DBBoard } from "../db/schema/boards";

function mapBoard(b: DBBoard): Board {
  return {
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    background: b.background as any, // Cast to shared Background type
    settings: b.settings as any,
    template: b.template as any,
    visibility: b.visibility as any,
  };
}

export const boardRoutes = new Elysia({ prefix: "/boards" })
  .use(betterAuth)
  .get("/", async ({ query }) => {
    const { workspaceId } = query;
    const where = workspaceId
      ? eq(boards.workspaceId, workspaceId)
      : undefined; // In a real app, join with members to see accessible boards

    const data = await db.select().from(boards).where(where);
    return data.map(mapBoard);
  }, {
    auth: true,
    query: t.Object({
      workspaceId: t.Optional(t.String())
    })
  })
  .post("/", async ({ body }) => {
    const [board] = await db.insert(boards).values({
      ...body,
      visibility: (body.visibility as "private" | "team" | "public") ?? "private",
      template: (body.template as "kanban" | "scrum" | "simple" | "bug_tracker" | "blank") ?? "blank",
    }).returning();
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
