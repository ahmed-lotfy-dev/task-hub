import { db } from "../db/db";
import { activities, users, workspaceMembers } from "../db/schema";
import { eq, desc, and, isNull, isNotNull, lte } from "drizzle-orm";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export class ActivityService {
  /**
   * Get workspace activities (excluding soft-deleted)
   */
  static async getWorkspaceActivities(userId: string, limit = 20, includeDeleted = false) {
    const conditions = [eq(workspaceMembers.userId, userId)];
    
    if (!includeDeleted) {
      conditions.push(isNull(activities.deletedAt));
    }

    return await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityName: activities.entityName,
        createdAt: activities.createdAt,
        deletedAt: activities.deletedAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .innerJoin(workspaceMembers, eq(activities.workspaceId, workspaceMembers.workspaceId))
      .where(and(...conditions))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  /**
   * Get board activities (excluding soft-deleted)
   */
  static async getBoardActivities(boardId: string, limit = 20, includeDeleted = false) {
    const conditions = [eq(activities.boardId, boardId as any)];
    
    if (!includeDeleted) {
      conditions.push(isNull(activities.deletedAt));
    }

    return await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityName: activities.entityName,
        createdAt: activities.createdAt,
        deletedAt: activities.deletedAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  /**
   * Soft delete an activity
   */
  static async softDelete(activityId: string, userId: string) {
    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, activityId))
      .limit(1);

    if (!activity) {
      return { success: false, error: "Activity not found" };
    }

    // Check if user has permission (activity owner or workspace admin)
    const hasPermission = await ActivityService.canDeleteActivity(activityId, userId);
    if (!hasPermission) {
      return { success: false, error: "Permission denied" };
    }

    await db
      .update(activities)
      .set({ deletedAt: new Date() })
      .where(eq(activities.id, activityId));

    return { success: true };
  }

  /**
   * Restore a soft-deleted activity
   */
  static async restore(activityId: string, userId: string) {
    const hasPermission = await ActivityService.canDeleteActivity(activityId, userId);
    if (!hasPermission) {
      return { success: false, error: "Permission denied" };
    }

    await db
      .update(activities)
      .set({ deletedAt: null })
      .where(eq(activities.id, activityId));

    return { success: true };
  }

  /**
   * Hard delete activities that were soft-deleted more than 30 days ago
   */
  static async cleanupOldDeletedActivities() {
    const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_MS);

    const result = await db
      .delete(activities)
      .where(
        and(
          lte(activities.deletedAt, thirtyDaysAgo),
          isNotNull(activities.deletedAt)
        )
      )
      .returning({ id: activities.id });

    return {
      deletedCount: result.length,
      deletedIds: result.map(r => r.id)
    };
  }

  /**
   * Check if user can delete/restore an activity
   */
  private static async canDeleteActivity(activityId: string, userId: string): Promise<boolean> {
    const [activity] = await db
      .select({
        activityUserId: activities.userId,
        workspaceId: activities.workspaceId
      })
      .from(activities)
      .where(eq(activities.id, activityId))
      .limit(1);

    if (!activity) return false;

    // User is the activity creator
    if (activity.activityUserId === userId) return true;

    // Check if user is workspace admin/owner
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, activity.workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    // Check if user has admin role (you may need to adjust based on your role system)
    return membership?.role === 'admin' || membership?.role === 'owner';
  }
}
