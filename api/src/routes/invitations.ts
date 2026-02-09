import { Elysia, t } from "elysia";
import { InvitationService } from "../services/invitation.service";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const invitationRoutes = new Elysia({ prefix: "/invitations" })
  .use(betterAuth)
  .post("/", async (context: any) => {
    const user = context.user as User;
    const body = context.body;

    if (!body.workspaceId && !body.boardId) {
      context.set.status = 400;
      return { error: "Must provide either workspaceId or boardId" };
    }

    try {
      const result = await InvitationService.createInvitation({
        ...body,
        userId: user.id
      });
      return { success: true, ...result };
    } catch (error: any) {
      context.set.status = 400;
      return { error: error.message };
    }
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
    const invitation = await InvitationService.verifyToken(token);

    if (!invitation) {
      return { valid: false, error: "Invitation not found or expired" };
    }

    return { valid: true, details: invitation };
  })
  .post("/accept", async (context: any) => {
    const user = context.user as User;
    const { token } = context.body;

    try {
      const result = await InvitationService.acceptInvitation(token, user.id);
      return result;
    } catch (error: any) {
      context.set.status = 400;
      return { error: error.message };
    }
  }, {
    auth: true,
    body: t.Object({
      token: t.String()
    })
  });
