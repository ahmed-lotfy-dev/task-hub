import { db } from "../src/db/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Listing columns in 'users' table...");
  try {
    const result = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log("Columns:", result.rows.map((r: any) => r.column_name));
  } catch (e: any) {
    console.log("Error:", e.message);
  }
  process.exit(0);
}

main();
