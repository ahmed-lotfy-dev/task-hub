import { Elysia, t } from "elysia";
import { ListService } from "../services/list.service";
import { User } from "@taskflow/shared";
import { betterAuth } from "../middleware/auth-middleware";

export const listRoutes = new Elysia({ prefix: "/lists" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const { boardId } = context.query;
    if (!boardId) return [];

    const data = await ListService.getBoardLists(boardId);

    return data.map(l => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));
  }, {
    auth: true,
    query: t.Object({
      boardId: t.String()
    })
  })
  .post("/", async (context: any) => {
    const body = context.body;
    const user = context.user as User;

    const list = await ListService.createList({
      ...body,
      userId: user.id
    });

    return {
      ...list,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
    };
  }, {
    auth: true,
    body: t.Object({
      boardId: t.String(),
      name: t.String(),
      position: t.Optional(t.Number())
    })
  })
  .put("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;
    const body = context.body;

    const updated = await ListService.updateList(id, user.id, body);
    if (!updated) {
      context.set.status = 404;
      return { message: "List not found" };
    }

    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }, {
    auth: true,
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      position: t.Optional(t.Number())
    })
  })
  .delete("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    const deleted = await ListService.deleteList(id, user.id);
    if (!deleted) {
      context.set.status = 404;
      return { message: "List not found" };
    }

    return { success: true };
  }, {
    auth: true,
    params: t.Object({ id: t.String() })
  });

