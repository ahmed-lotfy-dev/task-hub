import { db } from "../db/db";
import { activities, users, workspaceMembers } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";

export class ActivityService {
  static async getWorkspaceActivities(userId: string, limit = 20) {
    return await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityName: activities.entityName,
        createdAt: activities.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .innerJoin(workspaceMembers, eq(activities.workspaceId, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  static async getBoardActivities(boardId: string, limit = 20) {
    return await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityName: activities.entityName,
        createdAt: activities.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .where(eq(activities.boardId, boardId as any))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }
}
