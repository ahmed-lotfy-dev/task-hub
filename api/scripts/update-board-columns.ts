import { db } from "../src/db/db";
import { lists, boards } from "../src/db/schema";
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

  // Define the new flow
  const newFlow = [
    { name: "Backlog", position: 1000 },
    { name: "Todo", position: 2000 },
    { name: "In Progress", position: 3000 },
    { name: "Review", position: 4000 },
    { name: "Done", position: 5000 },
  ];

  console.log("\nNew flow will be:");
  newFlow.forEach((list, i) => {
    console.log(`  ${i + 1}. ${list.name} (position: ${list.position})`);
  });

  // Rename existing lists to match new flow where possible
  const renameMap: Record<string, string> = {
    "To Do": "Todo",
    "In Progress": "In Progress", // Same
    "Review": "Review", // Same
    "Done": "Done", // Same
  };

  console.log("\nUpdating lists...");

  for (const list of currentLists) {
    const newName = renameMap[list.name];
    if (newName && newName !== list.name) {
      await db
        .update(lists)
        .set({ name: newName })
        .where(eq(lists.id, list.id));
      console.log(`  Renamed "${list.name}" → "${newName}"`);
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

  // Update positions to match new flow
  const updatedLists = await db
    .select()
    .from(lists)
    .where(eq(lists.boardId, boardId as any))
    .orderBy(asc(lists.position));

  console.log("\nUpdated lists:");
  updatedLists.forEach((list, i) => {
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
