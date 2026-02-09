import { Elysia, t } from "elysia";
import { ActivityService } from "../services/activity.service";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

// Helper to serialize activity dates
const serializeActivity = (a: any) => ({
  ...a,
  createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
  deletedAt: a.deletedAt instanceof Date ? a.deletedAt.toISOString() : a.deletedAt,
});

export const activityRoutes = new Elysia({ prefix: "/activities" })
  .use(betterAuth)
  // Get workspace activities (excluding soft-deleted by default)
  .get("/", async (context: any) => {
    try {
      const user = context.user as User;
      const includeDeleted = context.query?.includeDeleted === 'true';
      const limit = context.query?.limit ? parseInt(context.query.limit) : 20;

      const data = await ActivityService.getWorkspaceActivities(user.id, limit, includeDeleted);

      return data.map(serializeActivity);
    } catch (error: any) {
      console.error('[Activities] Error fetching workspace activities:', error);
      return context.error(500, { error: 'Failed to fetch activities', details: error.message });
    }
  }, {
    auth: true,
    query: t.Object({
      includeDeleted: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })
  // Get board activities
  .get("/board/:boardId", async (context: any) => {
    const user = context.user as User;
    const { boardId } = context.params;
    const includeDeleted = context.query?.includeDeleted === 'true';
    const limit = context.query?.limit ? parseInt(context.query.limit) : 20;

    const data = await ActivityService.getBoardActivities(boardId, limit, includeDeleted);

    return data.map(serializeActivity);
  }, {
    auth: true,
    params: t.Object({
      boardId: t.String(),
    }),
    query: t.Object({
      includeDeleted: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })
  // Soft delete an activity
  .delete("/:id", async (context: any) => {
    const user = context.user as User;
    const { id } = context.params;

    const result = await ActivityService.softDelete(id, user.id);

    if (!result.success) {
      return context.error(result.error === "Permission denied" ? 403 : 404, {
        error: result.error,
      });
    }

    return { success: true, message: "Activity deleted" };
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
    }),
  })
  // Restore a soft-deleted activity
  .post("/:id/restore", async (context: any) => {
    const user = context.user as User;
    const { id } = context.params;

    const result = await ActivityService.restore(id, user.id);

    if (!result.success) {
      return context.error(result.error === "Permission denied" ? 403 : 404, {
        error: result.error,
      });
    }

    return { success: true, message: "Activity restored" };
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
    }),
  })
  // Cleanup old deleted activities (30+ days) - typically run via script/cron
  // This endpoint allows manual trigger for admins
  .post("/cleanup", async (context: any) => {
    const result = await ActivityService.cleanupOldDeletedActivities();

    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} activities deleted 30+ days ago`,
    };
  }, {
    auth: true,
  });
