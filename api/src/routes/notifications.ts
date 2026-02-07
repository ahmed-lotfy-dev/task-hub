import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { notifications, activities, users } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const notificationRoutes = new Elysia({ prefix: "/notifications" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;

    // Fetch flattened data to avoid Drizzle's nested object inference issues
    const result = await db
      .select({
        id: notifications.id,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        // Activity fields
        activityId: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityId: activities.entityId,
        entityName: activities.entityName,
        boardId: activities.boardId, 
        workspaceId: activities.workspaceId, 
        metadata: activities.metadata,
        activityCreatedAt: activities.createdAt,
        // User (Actor) fields
        actorId: users.id,
        actorName: users.name,
        actorImage: users.image,
      })
      .from(notifications)
      .innerJoin(activities, eq(notifications.activityId, activities.id))
      .innerJoin(users, eq(activities.userId, users.id))
      .where(eq(notifications.recipientId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return result.map(n => ({
      id: n.id,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
      activity: {
        id: n.activityId,
        action: n.action,
        entityType: n.entityType,
        entityId: n.entityId,
        entityName: n.entityName,
        boardId: n.boardId, // Add this
        workspaceId: n.workspaceId, // Add this
        metadata: n.metadata as Record<string, any>,
        createdAt: n.activityCreatedAt.toISOString(),
        actor: {
          id: n.actorId,
          name: n.actorName,
          image: n.actorImage,
        }
      }
    }));
  }, {
    auth: true,
  })
  .get("/unread-count", async (context: any) => {
    const user = context.user as User;

    // Efficiently count unread notifications
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, user.id),
          eq(notifications.isRead, false)
        )
      );

    return { count: Number(result?.count || 0) };
  }, {
    auth: true
  })
  .patch("/:id/read", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.recipientId, user.id)
        )
      );

    return { success: true };
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  })
  .patch("/read-all", async (context: any) => {
    const user = context.user as User;

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, user.id));

    return { success: true };
  }, {
    auth: true
  });
