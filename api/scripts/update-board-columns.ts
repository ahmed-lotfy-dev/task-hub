import { db } from "../src/db/db";
import { lists } from "../src/db/schema";
import { eq, asc } from "drizzle-orm";

/**
 * Script to update existing board columns to the new Kanban flow:
 * Backlog → Todo → In Progress → Review → Done
 */
async function updateBoardColumns() {
  const boardId = process.argv[2];

  if (!boardId) {
    console.error("Usage: bun run scripts/update-board-columns.ts <board-id>");
    console.error("\nTo find your board ID, check the URL when viewing the board:");
    console.error("  /boards/<board-id>");
    process.exit(1);
  }

  console.log(`Updating board: ${boardId}`);

  // Get current lists
  const currentLists = await db
    .select()
    .from(lists)
    .where(eq(lists.boardId, boardId as any))
    .orderBy(asc(lists.position));

  console.log("\nCurrent lists:");
  currentLists.forEach((list, i) => {
    console.log(`  ${i + 1}. ${list.name} (position: ${list.position})`);
  });

  // Define target positions for the new flow
  const positionMap: Record<string, number> = {
    Backlog: 1000,
    Todo: 2000,
    "In Progress": 3000,
    Review: 4000,
    Done: 5000,
  };

  console.log("\nUpdating list positions...");

  // Update positions for all lists
  for (const list of currentLists) {
    const targetPosition = positionMap[list.name];
    if (targetPosition && targetPosition !== list.position) {
      await db
        .update(lists)
        .set({ position: targetPosition })
        .where(eq(lists.id, list.id));
      console.log(`  Updated "${list.name}" position: ${list.position} → ${targetPosition}`);
    }
  }

  // Check if Backlog exists, if not create it
  const hasBacklog = currentLists.some((l) => l.name === "Backlog");
  if (!hasBacklog) {
    await db.insert(lists).values({
      boardId: boardId as any,
      name: "Backlog",
      position: 1000,
    });
    console.log(`  Created "Backlog" column`);
  }

  // Rename "To Do" to "Todo" if exists
  const todoList = currentLists.find((l) => l.name === "To Do");
  if (todoList) {
    await db
      .update(lists)
      .set({ name: "Todo" })
      .where(eq(lists.id, todoList.id));
    console.log(`  Renamed "To Do" → "Todo"`);
  }

  // Show final state
  const finalLists = await db
    .select()
    .from(lists)
    .where(eq(lists.boardId, boardId as any))
    .orderBy(asc(lists.position));

  console.log("\nFinal lists (ordered by position):");
  finalLists.forEach((list, i) => {
    console.log(`  ${i + 1}. ${list.name} (position: ${list.position})`);
  });

  console.log("\n✅ Board columns updated successfully!");
  console.log("Refresh your browser to see the changes.");
}

updateBoardColumns()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
