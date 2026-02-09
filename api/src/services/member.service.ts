import { db } from "../db/db";
import { boards, workspaceMembers, boardMembers, users } from "../db/schema";
import { eq } from "drizzle-orm";

export class MemberService {
  static async getBoardCandidates(boardId: string) {
    const [board] = await db
      .select()
      .from(boards)
      .where(eq(boards.id, boardId as any));

    if (!board) throw new Error("Board not found");

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

    const boardUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image
      })
      .from(boardMembers)
      .innerJoin(users, eq(boardMembers.userId, users.id))
      .where(eq(boardMembers.boardId, boardId as any));

    const allCandidates = [...workspaceUsers];
    boardUsers.forEach(bu => {
      if (!allCandidates.find(c => c.id === bu.id)) {
        allCandidates.push(bu);
      }
    });

    return allCandidates;
  }
}
