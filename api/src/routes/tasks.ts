import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { cards, lists } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { apiInstance } from "../lib/api-instance";

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .use(apiInstance)
  .get("/", async ({ query }: any) => {
    const { boardId } = query;
    return await db.select().from(cards).where(boardId ? eq(cards.boardId, boardId) : undefined);
  }, {
    auth: true,
    query: t.Object({
      boardId: t.Optional(t.String())
    })
  })
  .post("/", async ({ body }: any) => {
    const [card] = await db.insert(cards).values(body).returning();
    return card;
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
  .patch("/:id", async ({ params: { id }, body }: any) => {
    const [card] = await db.update(cards)
      .set(body)
      .where(eq(cards.id, id))
      .returning();
    return card;
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
