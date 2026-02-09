import { db } from "../db/db";
import { invitations, workspaces, boards, workspaceMembers, boardMembers, users, activities, notifications } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { sendInviteEmail, sendDirectAddEmail } from "../lib/mail";
import { randomBytes } from "crypto";

export class InvitationService {
  static async createInvitation(data: {
    userId: string;
    email: string;
    workspaceId?: string;
    boardId?: string;
    role?: string;
  }) {
    const { email, workspaceId, boardId, role, userId } = data;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return await this.directAddUser({ ...data, existingUserId: existingUser.id, targetUser: existingUser });
    }

    // User doesn't exist - proceed with email invitation
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    let contextName = "";
    let type: "workspace" | "board" = "workspace";

    if (workspaceId) {
      const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId as any));
      if (!ws) throw new Error("Workspace not found");
      contextName = ws.name;
    } else if (boardId) {
      type = "board";
      const [board] = await db.select().from(boards).where(eq(boards.id, boardId as any));
      if (!board) throw new Error("Board not found");
      contextName = board.name;
    }

    const [invitation] = await db.insert(invitations).values({
      email,
      workspaceId: workspaceId as any,
      boardId: boardId as any,
      inviterId: userId,
      token,
      role: (role as any) || "member",
      expiresAt,
    }).returning();

    const [inviter] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    await sendInviteEmail({
      email,
      inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite/${token}`,
      inviterName: inviter?.name || inviter?.email || "someone",
      contextName,
      type
    });

    return {
      method: "email_invitation",
      invitation
    };
  }

  private static async directAddUser(data: any) {
    const { email, workspaceId, boardId, role, userId, existingUserId, targetUser } = data;

    return await db.transaction(async (tx) => {
      let contextName = "";
      let contextType: "workspace" | "board" = "workspace";

      if (workspaceId) {
        contextType = "workspace";
        const [ws] = await tx.select().from(workspaces).where(eq(workspaces.id, workspaceId as any));
        if (!ws) throw new Error("Workspace not found");
        contextName = ws.name;

        await tx.insert(workspaceMembers).values({
          workspaceId: workspaceId as any,
          userId: existingUserId,
          role: (role as any) || "member",
        }).onConflictDoNothing();
      } else if (boardId) {
        contextType = "board";
        const [board] = await tx.select().from(boards).where(eq(boards.id, boardId as any));
        if (!board) throw new Error("Board not found");
        contextName = board.name;

        await tx.insert(boardMembers).values({
          boardId: boardId as any,
          userId: existingUserId,
          role: (role as any) || "member",
        }).onConflictDoNothing();
      }

      const [inviter] = await tx.select().from(users).where(eq(users.id, userId)).limit(1);

      const [activity] = await tx.insert(activities).values({
        userId: userId,
        workspaceId: workspaceId || (await tx.select().from(boards).where(eq(boards.id, boardId!))).map(b => b.workspaceId)[0],
        boardId: boardId || null,
        action: "add",
        entityType: "member",
        entityId: existingUserId,
        entityName: targetUser.name || targetUser.email,
        metadata: {
          addedBy: userId,
          addedByName: inviter?.name || inviter?.email,
          role: role || "member"
        }
      }).returning();

      await tx.insert(notifications).values({
        recipientId: existingUserId,
        activityId: activity.id,
        isRead: false,
      });

      const workspaceUrl = workspaceId
        ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/workspace/${workspaceId}`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/board/${boardId}`;

      await sendDirectAddEmail({
        email: targetUser.email,
        inviterName: inviter?.name || inviter?.email || "someone",
        contextName,
        type: contextType,
        workspaceUrl
      });

      return {
        method: "direct_add",
        message: `${targetUser.name || email} has been added directly`,
        user: targetUser,
        contextName,
        contextType
      };
    });
  }

  static async verifyToken(token: string) {
    const [invitation] = await db
      .select({
        invitation: invitations,
        workspaceName: workspaces.name,
        boardName: boards.name,
        inviterName: users.name,
        inviterEmail: users.email
      })
      .from(invitations)
      .leftJoin(workspaces, eq(invitations.workspaceId, workspaces.id))
      .leftJoin(boards, eq(invitations.boardId, boards.id))
      .innerJoin(users, eq(invitations.inviterId, users.id))
      .where(
        and(
          eq(invitations.token, token),
          eq(invitations.status, 'pending'),
          gt(invitations.expiresAt, new Date())
        )
      );
    return invitation;
  }

  static async acceptInvitation(token: string, userId: string) {
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.token, token),
          eq(invitations.status, 'pending'),
          gt(invitations.expiresAt, new Date())
        )
      );

    if (!invitation) throw new Error("Invalid or expired invitation");

    return await db.transaction(async (tx) => {
      await tx
        .update(invitations)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(invitations.id, invitation.id));

      if (invitation.workspaceId) {
        await tx.insert(workspaceMembers).values({
          workspaceId: invitation.workspaceId,
          userId,
          role: invitation.role as any,
        }).onConflictDoNothing();
      } else if (invitation.boardId) {
        await tx.insert(boardMembers).values({
          boardId: invitation.boardId,
          userId,
          role: invitation.role as any,
        }).onConflictDoNothing();
      }

      return { success: true };
    });
  }
}
