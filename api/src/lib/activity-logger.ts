import { db } from "../db/db";
import { activities } from "../db/schema";

export interface LogActivityParams {
  userId: string;
  workspaceId: string;
  boardId?: string;
  action: 'create' | 'update' | 'delete' | 'move' | 'archive' | 'unarchive' | 'comment';
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

    return activity;
  } catch (error) {
    console.error("Failed to log activity:", error);
    // We don't want to throw error and break the main request
    return null;
  }
}
