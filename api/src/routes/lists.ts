import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { lists } from "../db/schema";
import { eq } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";

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
  });
