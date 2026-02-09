import { Elysia, t } from "elysia";
import { NotificationService } from "../services/notification.service";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const notificationRoutes = new Elysia({ prefix: "/notifications" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;

    try {
      const result = await NotificationService.getUserNotifications(user.id);

      return (result || []).map(n => {
        // Service already provides activity as null or object, 
        // we just need to ISO the dates if they are Date objects
        return {
          ...n,
          createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
          activity: n.activity ? {
            ...n.activity,
            createdAt: n.activity.createdAt instanceof Date ? n.activity.createdAt.toISOString() : n.activity.createdAt,
          } : null
        };
      });
    } catch (error: any) {
      console.error("[Notifications API] Error fetching for user", user.id, ":", error);
      context.set.status = 500;
      return {
        message: "Internal Server Error",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }, {
    auth: true,
  })
  .get("/unread-count", async (context: any) => {
    const user = context.user as User;
    const count = await NotificationService.getUnreadCount(user.id);
    return { count };
  }, {
    auth: true
  })
  .patch("/:id/read", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    await NotificationService.markAsRead(user.id, id);
    return { success: true };
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  })
  .patch("/read-all", async (context: any) => {
    const user = context.user as User;

    await NotificationService.markAllAsRead(user.id);
    return { success: true };
  }, {
    auth: true
  });

