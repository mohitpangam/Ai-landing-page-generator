import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Connecting to Neon database...");
  try {
    await sql`ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN DEFAULT false;`;
    console.log("SUCCESS: isPublished column created/verified in Neon PostgreSQL!");
  } catch (err) {
    console.error("Migration error:", err);
  }
}

main();
