import { db } from "../db/db";
import { cardComments, users, cards, boards } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { logActivity } from "../lib/activity-logger";

export class CommentService {
  static async getTaskComments(taskId: string) {
    const comments = await db
      .select({
        id: cardComments.id,
        content: cardComments.content,
        createdAt: cardComments.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(cardComments)
      .innerJoin(users, eq(cardComments.userId, users.id))
      .where(eq(cardComments.cardId, taskId as any))
      .orderBy(desc(cardComments.createdAt));
    return comments;
  }

  static async addComment(taskId: string, userId: string, content: string) {
    return await db.transaction(async (tx) => {
      const [comment] = await tx.insert(cardComments).values({
        cardId: taskId as any,
        userId: userId,
        content,
      }).returning();

      // Log comment activity
      const [card] = await tx.select().from(cards).where(eq(cards.id, taskId as any)).limit(1);
      if (card) {
        const [board] = await tx.select().from(boards).where(eq(boards.id, card.boardId as any)).limit(1);
        if (board) {
          await logActivity({
            userId,
            workspaceId: board.workspaceId,
            boardId: board.id,
            action: 'comment',
            entityType: 'comment',
            entityId: comment.id,
            entityName: content.substring(0, 50),
            metadata: { via: 'service', cardId: taskId }
          });
        }
      }

      // Fetch the full comment with user info
      const [fullComment] = await tx
        .select({
          id: cardComments.id,
          content: cardComments.content,
          createdAt: cardComments.createdAt,
          user: {
            id: users.id,
            name: users.name,
            image: users.image,
          }
        })
        .from(cardComments)
        .innerJoin(users, eq(cardComments.userId, users.id))
        .where(eq(cardComments.id, comment.id));

      return fullComment;
    });
  }

  static async deleteComment(commentId: string, userId: string) {
    const [deleted] = await db.delete(cardComments)
      .where(eq(cardComments.id, commentId as any))
      .returning();
    return deleted;
  }
}
