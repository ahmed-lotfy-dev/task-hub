import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { boards, workspaces } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { apiInstance } from "../lib/api-instance";

export const boardRoutes = new Elysia({ prefix: "/boards" })
  .use(apiInstance)
  .get("/", async ({ user, query }: any) => {
    const { workspaceId } = query;
    const where = workspaceId
      ? eq(boards.workspaceId, workspaceId)
      : undefined; // In a real app, join with members to see accessible boards

    return await db.select().from(boards).where(where);
  }, {
    auth: true,
    query: t.Object({
      workspaceId: t.Optional(t.String())
    })
  })
  .post("/", async ({ body }: any) => {
    const [board] = await db.insert(boards).values(body).returning();
    return board;
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
