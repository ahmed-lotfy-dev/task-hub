import { db } from "../src/db/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Renaming password_hash to password...");
  try {
    await db.execute(sql`ALTER TABLE "users" RENAME COLUMN "password_hash" TO "password"`);
    console.log("Success!");
  } catch (e: any) {
    console.log("Error (maybe already renamed?):", e.message);
  }
  process.exit(0);
}

main();
