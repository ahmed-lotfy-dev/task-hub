import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { invitations, workspaces, boards, workspaceMembers, boardMembers, users, activities, notifications, type User } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { sendInviteEmail, sendDirectAddEmail } from "../lib/mail";
import { randomBytes } from "crypto";

export const invitationRoutes = new Elysia({ prefix: "/invitations" })
  .use(betterAuth)
  .get("/test-email", async () => {
    // Test endpoint to verify email configuration
    const testEmail = process.env.TEST_EMAIL || "no-reply@ahmedlotfy.site";
    const testLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/test`;

    console.log("[Test] Sending test email to:", testEmail);

    const result = await sendInviteEmail({
      email: testEmail,
      inviteLink: testLink,
      inviterName: "TaskHub Test",
      contextName: "Test Workspace",
      type: "workspace"
    });

    return {
      success: result,
      message: result ? "Test email sent successfully" : "Failed to send test email",
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
        frontendUrl: process.env.FRONTEND_URL
      }
    };
  })
  .post("/", async (context: any) => {
    const user = context.user as User;
    const body = context.body;
    const { email, workspaceId, boardId, role } = body;

    // Validate request: must have either workspaceId or boardId
    if (!workspaceId && !boardId) {
      return { error: "Must provide either workspaceId or boardId" };
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    // If user exists, add them directly
    if (existingUser) {
      // Check if user is already a member
      if (workspaceId) {
        const [existingMember] = await db
          .select()
          .from(workspaceMembers)
          .where(
            and(
              eq(workspaceMembers.workspaceId, workspaceId),
              eq(workspaceMembers.userId, existingUser.id)
            )
          );
        
        if (existingMember) {
          return {
            success: false,
            error: "Already a member",
            message: `${email} is already a member of this workspace`
          };
        }
      } else if (boardId) {
        const [existingMember] = await db
          .select()
          .from(boardMembers)
          .where(
            and(
              eq(boardMembers.boardId, boardId),
              eq(boardMembers.userId, existingUser.id)
            )
          );
        
        if (existingMember) {
          return {
            success: false,
            error: "Already a member",
            message: `${email} is already a member of this board`
          };
        }
      }

      // Add user directly and create notification
      const result = await db.transaction(async (tx) => {
        let contextName = "";
        let contextType: "workspace" | "board" = "workspace";

        // Add to workspace or board
        if (workspaceId) {
          contextType = "workspace";
          const [ws] = await tx.select().from(workspaces).where(eq(workspaces.id, workspaceId));
          if (!ws) return { error: "Workspace not found" };
          contextName = ws.name;

          await tx.insert(workspaceMembers).values({
            workspaceId,
            userId: existingUser.id,
            role: role || "member",
          });
        } else if (boardId) {
          contextType = "board";
          const [board] = await tx.select().from(boards).where(eq(boards.id, boardId));
          if (!board) return { error: "Board not found" };
          contextName = board.name;

          await tx.insert(boardMembers).values({
            boardId,
            userId: existingUser.id,
            role: role || "member",
          });
        }

        // Create activity record
        const [activity] = await tx.insert(activities).values({
          userId: user.id,
          workspaceId: workspaceId || (await tx.select().from(boards).where(eq(boards.id, boardId!))).map(b => b.workspaceId)[0],
          boardId: boardId || null,
          action: "add",
          entityType: "member",
          entityId: existingUser.id,
          entityName: existingUser.name || existingUser.email,
          metadata: {
            addedBy: user.id,
            addedByName: user.name || user.email,
            role: role || "member"
          }
        }).returning();

        // Create notification for the added user
        await tx.insert(notifications).values({
          recipientId: existingUser.id,
          activityId: activity.id,
          isRead: false,
        });

        return {
          success: true,
          method: "direct_add",
          message: `${existingUser.name || email} already has an account and has been added directly to the ${contextType}`,
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
          },
          contextName,
          contextType
        };
      });

      // Send email notification to the added user (outside transaction)
      if (result.success && result.method === "direct_add") {
        const workspaceUrl = workspaceId 
          ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/workspace/${workspaceId}`
          : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/board/${boardId}`;

        await sendDirectAddEmail({
          email: existingUser.email,
          inviterName: user.name || user.email,
          contextName: result.contextName,
          type: result.contextType,
          workspaceUrl
        });
      }

      return result;
    }

    // User doesn't exist - proceed with email invitation
    // Check for existing pending invitation
    const existingConditions = [
      eq(invitations.email, email),
      eq(invitations.status, 'pending'),
      gt(invitations.expiresAt, new Date())
    ];
    
    if (workspaceId) {
      existingConditions.push(eq(invitations.workspaceId, workspaceId));
    }
    if (boardId) {
      existingConditions.push(eq(invitations.boardId, boardId));
    }

    const [existingInvitation] = await db
      .select()
      .from(invitations)
      .where(and(...existingConditions));

    if (existingInvitation) {
      const daysLeft = Math.ceil((new Date(existingInvitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return { 
        error: "Invitation already sent", 
        message: `An invitation has already been sent to ${email}. It expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Please wait for them to accept or for the invitation to expire before sending a new one.`,
        existingInvitation: {
          id: existingInvitation.id,
          expiresAt: existingInvitation.expiresAt,
          createdAt: existingInvitation.createdAt
        }
      };
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Get context name for email
    let contextName = "";
    let type: "workspace" | "board" = "workspace";

    if (workspaceId) {
      // Check if user is admin of workspace
      const [member] = await db
        .select()
        .from(workspaceMembers)
        .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id), eq(workspaceMembers.role, "admin")));

      if (!member && user.id !== (await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))).map(w => w.ownerId)[0]) {
        // simplified owner check, ideally check role or owner
      }

      const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
      if (!ws) return { error: "Workspace not found" };
      contextName = ws.name;
    } else if (boardId) {
      type = "board";
      const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
      if (!board) return { error: "Board not found" };
      contextName = board.name;
    }

    // Create invitation
    const [invitation] = await db.insert(invitations).values({
      email,
      workspaceId,
      boardId,
      inviterId: user.id,
      token,
      role: role || "member",
      expiresAt,
    }).returning();

    // Send email
    const emailSent = await sendInviteEmail({
      email,
      inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite/${token}`,
      inviterName: user.name || user.email,
      contextName,
      type
    });

    return { 
      success: true, 
      method: "email_invitation",
      message: `Invitation email sent to ${email}`,
      invitation, 
      emailSent 
    };
  }, {
    auth: true,
    body: t.Object({
      email: t.String(),
      workspaceId: t.Optional(t.String()),
      boardId: t.Optional(t.String()),
      role: t.Optional(t.String())
    })
  })
  .get("/verify/:token", async (context: any) => {
    const { token } = context.params;

    // Find valid invitation
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

    if (!invitation) {
      return { valid: false, error: "Invitation not found or expired" };
    }

    return {
      valid: true,
      details: invitation
    };
  })
  .post("/accept", async (context: any) => {
    const user = context.user as User;
    const { token } = context.body;

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

    if (!invitation) {
      return { error: "Invalid invitation" };
    }

    // Transaction to update invite and add member
    return await db.transaction(async (tx) => {
      // 1. Mark invite accepted
      await tx
        .update(invitations)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(invitations.id, invitation.id));

      let memberAdded;

      // 2. Add to workspace or board
      if (invitation.workspaceId) {
        // Check if already member
        const [existing] = await tx
          .select()
          .from(workspaceMembers)
          .where(and(eq(workspaceMembers.workspaceId, invitation.workspaceId), eq(workspaceMembers.userId, user.id)));

        if (!existing) {
          [memberAdded] = await tx.insert(workspaceMembers).values({
            workspaceId: invitation.workspaceId,
            userId: user.id,
            role: invitation.role as any,
          }).returning();
        }
      } else if (invitation.boardId) {
        const [existing] = await tx
          .select()
          .from(boardMembers)
          .where(and(eq(boardMembers.boardId, invitation.boardId), eq(boardMembers.userId, user.id)));

        if (!existing) {
          [memberAdded] = await tx.insert(boardMembers).values({
            boardId: invitation.boardId,
            userId: user.id,
            role: invitation.role as any,
          }).returning();
        }
      }

      return { success: true, memberAdded };
    });
  }, {
    auth: true,
    body: t.Object({
      token: t.String()
    })
  });
