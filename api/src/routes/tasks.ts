import { Elysia, t } from "elysia";
import { TaskService } from "../services/task.service";
import { User } from "@taskflow/shared";
import { betterAuth } from "../middleware/auth-middleware";

function mapTask(c: any) {
  return {
    ...c,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
    dueDate: (c.dueDate instanceof Date) ? c.dueDate.toISOString() : (c.dueDate ?? null),
    startDate: (c.startDate instanceof Date) ? c.startDate.toISOString() : (c.startDate ?? null),
    priority: c.priority as any,
  };
}

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;
    const { boardId } = context.query;

    if (boardId) {
      const tasks = await TaskService.getBoardTasks(boardId, user.id);
      return tasks.map(mapTask);
    }

    // Default: Get priority tasks for the user dashboard
    const tasks = await TaskService.getUserPriorityTasks(user.id);
    return tasks.map(mapTask);
  }, {
    auth: true,
    query: t.Object({
      boardId: t.Optional(t.String())
    })
  })
  .get("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    const task = await TaskService.getTaskById(id, user.id);

    if (!task) {
      context.set.status = 404;
      return { message: "Task not found" };
    }

    return mapTask(task);
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  })
  .post("/", async (context: any) => {
    const body = context.body;
    const user = context.user as User;

    const task = await TaskService.createTask({
      ...body,
      userId: user.id,
      priority: body.priority as any
    });

    return mapTask(task);
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
  .patch("/:id", async (context: any) => {
    try {
      const { id } = context.params;
      const body = context.body;
      const user = context.user as User;
      
      console.log('[Task Update] Request:', { id, body, userId: user.id });

      const task = await TaskService.updateTask(id, user.id, body as any);

      if (!task) {
        context.set.status = 404;
        return { message: "Task not found" };
      }
      
      console.log('[Task Update] Success:', task.id);
      return mapTask(task);
    } catch (error: any) {
      console.error('[Task Update] Error:', error);
      context.set.status = 500;
      return { message: error.message || "Internal server error" };
    }
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
  })
  .delete("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    const deleted = await TaskService.deleteTask(id, user.id);

    if (!deleted) {
      context.set.status = 404;
      return { message: "Task not found" };
    }

    return { success: true };
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  })
  .post("/:id/assignees", async (context: any) => {
    const { id } = context.params;
    const { userId } = context.body;
    const user = context.user as User;

    await TaskService.assignUser(id, userId, user.id);
    return { success: true };
  }, {
    auth: true,
    params: t.Object({ id: t.String() }),
    body: t.Object({ userId: t.String() })
  })
  .delete("/:id/assignees/:userId", async (context: any) => {
    const { id, userId } = context.params;

    await TaskService.unassignUser(id, userId);
    return { success: true };
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
      userId: t.String()
    })
  });

