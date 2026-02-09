import { db } from "../db/db";
import { notifications, activities, users } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export class NotificationService {
  static async getUserNotifications(userId: string, limit = 50) {
    const result = await db
      .select({
        id: notifications.id,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        activityId: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityId: activities.entityId,
        entityName: activities.entityName,
        boardId: activities.boardId,
        workspaceId: activities.workspaceId,
        metadata: activities.metadata,
        activityCreatedAt: activities.createdAt,
        actorId: users.id,
        actorName: users.name,
        actorImage: users.image,
      })
      .from(notifications)
      .leftJoin(activities, eq(notifications.activityId, activities.id))
      .leftJoin(users, eq(activities.userId, users.id))
      .where(eq(notifications.recipientId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return result.map(n => ({
      id: n.id,
      isRead: n.isRead,
      createdAt: n.createdAt,
      activity: n.activityId ? {
        id: n.activityId,
        action: n.action!,
        entityType: n.entityType!,
        entityId: n.entityId!,
        entityName: n.entityName,
        boardId: n.boardId,
        workspaceId: n.workspaceId,
        metadata: n.metadata || {},
        createdAt: n.activityCreatedAt!,
        actor: n.actorId ? {
          id: n.actorId,
          name: n.actorName!,
          image: n.actorImage,
        } : null
      } : null
    }));
  }

  static async getUnreadCount(userId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, userId),
          eq(notifications.isRead, false)
        )
      );
    return Number(result?.count || 0);
  }

  static async markAsRead(userId: string, notificationId: string) {
    return await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId as any),
          eq(notifications.recipientId, userId)
        )
      )
      .returning();
  }

  static async markAllAsRead(userId: string) {
    return await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, userId))
      .returning();
  }
}
