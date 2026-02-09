import { Elysia, t } from "elysia";
import { CommentService } from "../services/comment.service";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const commentRoutes = new Elysia({ prefix: "/comments" })
  .use(betterAuth)
  .get("/card/:cardId", async (context: any) => {
    const { cardId } = context.params;
    const comments = await CommentService.getTaskComments(cardId);

    return comments.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    }));
  }, {
    auth: true,
    params: t.Object({
      cardId: t.String()
    })
  })
  .post("/card/:cardId", async (context: any) => {
    const { cardId } = context.params;
    const { content } = context.body;
    const user = context.user as User;

    const fullComment = await CommentService.addComment(cardId, user.id, content);

    return {
      ...fullComment,
      createdAt: fullComment.createdAt.toISOString()
    };
  }, {
    auth: true,
    params: t.Object({
      cardId: t.String()
    }),
    body: t.Object({
      content: t.String()
    })
  })
  .delete("/:id", async (context: any) => {
    const { id } = context.params;
    const user = context.user as User;

    const deleted = await CommentService.deleteComment(id, user.id);

    return { success: !!deleted };
  }, {
    auth: true,
    params: t.Object({
      id: t.String()
    })
  });

