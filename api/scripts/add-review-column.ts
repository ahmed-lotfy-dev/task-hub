import { db } from "../src/db/db";
import { boards, lists } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function addReviewColumn() {
  console.log("Adding 'Review' column to existing boards...");

  // Get all boards
  const allBoards = await db.select().from(boards);

  for (const board of allBoards) {
    // Check if board already has a Review column
    const existingLists = await db
      .select()
      .from(lists)
      .where(eq(lists.boardId, board.id));

    const hasReview = existingLists.some(l => l.name.toLowerCase() === "review");

    if (!hasReview) {
      // Find the max position to place Review between In Progress and Done
      const maxPosition = Math.max(...existingLists.map(l => l.position));

      // Insert Review column
      await db.insert(lists).values({
        boardId: board.id,
        name: "Review",
        position: maxPosition + 1024,
      });

      console.log(`Added Review column to board: ${board.name} (${board.id})`);
    } else {
      console.log(`Board ${board.name} already has Review column, skipping...`);
    }
  }

  console.log("Done adding Review column to all boards!");
}

addReviewColumn()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
