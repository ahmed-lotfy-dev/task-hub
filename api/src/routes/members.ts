import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { boards, workspaceMembers, boardMembers, users } from "../db/schema";
import { eq, and, or } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const memberRoutes = new Elysia({ prefix: "/members" })
  .use(betterAuth)
  .get("/candidates", async (context: any) => {
    const { boardId } = context.query;
    const user = context.user as User;

    if (!boardId) {
      throw new Error("Board ID is required");
    }

    // 1. Get the workspace ID for this board
    const [board] = await db
      .select()
      .from(boards)
      .where(eq(boards.id, boardId));

    if (!board) {
      throw new Error("Board not found");
    }

    // 2. Fetch all Workspace Members
    const workspaceUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, board.workspaceId));

    // 3. Fetch all Board Members (some might be guests not in workspace)
    const boardUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image
      })
      .from(boardMembers)
      .innerJoin(users, eq(boardMembers.userId, users.id))
      .where(eq(boardMembers.boardId, boardId));

    // 4. Merge and Deduplicate
    const allCandidates = [...workspaceUsers];

    boardUsers.forEach(bu => {
      if (!allCandidates.find(c => c.id === bu.id)) {
        allCandidates.push(bu);
      }
    });

    return allCandidates;
  }, {
    auth: true,
    query: t.Object({
      boardId: t.String()
    })
  });
