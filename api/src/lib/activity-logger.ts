import { db } from "../db/db";
import { activities } from "../db/schema";

export interface LogActivityParams {
  userId: string;
  workspaceId: string;
  boardId?: string;
  action: 'create' | 'update' | 'delete' | 'move' | 'archive' | 'unarchive' | 'comment' | 'assign';
  entityType: 'workspace' | 'board' | 'list' | 'card' | 'comment';
  entityId: string;
  entityName?: string;
  metadata?: Record<string, any>;
}

/**
 * Logs a user activity to the database.
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const [activity] = await db
      .insert(activities)
      .values({
        userId: params.userId,
        workspaceId: params.workspaceId,
        boardId: params.boardId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        entityName: params.entityName,
        metadata: params.metadata || {},
      })
      .returning();

    import("./notification-service").then(({ notificationService }) => {
      notificationService.createNotificationsForActivity(activity).catch(err => {
        console.error("Failed to create notifications:", err);
      });
    });

    return activity;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return null;
  }
}
