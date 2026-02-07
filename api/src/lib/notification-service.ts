import { db } from "../db/db";
import { notifications, cardAssignees, cardComments, users } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { Activity } from "../db/schema/activities";

export class NotificationService {
  /**
   * Creates notifications based on a logged activity.
   */
  async createNotificationsForActivity(activity: Activity) {
    try {
      const { entityType, action, entityId, userId: actorId } = activity;

      if (entityType === 'card' && action === 'assign') {
        const metadata = activity.metadata as Record<string, any>;
        const assignedUserId = metadata?.assignedUserId;
        if (assignedUserId && assignedUserId !== actorId) {
          await this.createNotification(assignedUserId, activity.id);
        }
      } else if (action === 'comment') {
        // Notify all assignees of the card
        // If entityType is 'card', entityId is cardId.
        // If entityType is 'comment', we need cardId from metadata.
        let cardId = entityId;
        if (entityType === 'comment') {
          const metadata = activity.metadata as Record<string, any>;
          if (metadata?.cardId) {
            cardId = metadata.cardId;
          } else {
            cardId = ""; // Logic to handle missing cardId if needed
          }
        }

        if (cardId) {
          const assignees = await db
            .select({ userId: cardAssignees.userId })
            .from(cardAssignees)
            .where(eq(cardAssignees.cardId, cardId));

          const userIdsToNotify = assignees
            .map(a => a.userId)
            .filter(id => id !== actorId); // Don't notify self

          if (userIdsToNotify.length > 0) {
            await this.createBatchNotifications(userIdsToNotify, activity.id);
          }
        }
      }
    } catch (error) {
      console.error("[NotificationService] Failed to create notifications:", error);
    }
  }

  private async createNotification(recipientId: string, activityId: string) {
    await db.insert(notifications).values({
      recipientId,
      activityId,
    });
  }

  private async createBatchNotifications(recipientIds: string[], activityId: string) {
    if (recipientIds.length === 0) return;

    // Deduplicate
    const uniqueIds = [...new Set(recipientIds)];

    await db.insert(notifications).values(
      uniqueIds.map(recipientId => ({
        recipientId,
        activityId,
      }))
    );
  }
}

export const notificationService = new NotificationService();
