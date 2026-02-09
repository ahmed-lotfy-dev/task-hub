import { Elysia, t } from "elysia";
import { MemberService } from "../services/member.service";
import { betterAuth } from "../middleware/auth-middleware";

export const memberRoutes = new Elysia({ prefix: "/members" })
  .use(betterAuth)
  .get("/candidates", async (context: any) => {
    const { boardId } = context.query;
    const result = await MemberService.getBoardCandidates(boardId);
    return result;
  }, {
    auth: true,
    query: t.Object({
      boardId: t.String()
    })
  });

