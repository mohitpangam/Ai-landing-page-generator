import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Connecting to Neon database...");
  try {
    await sql`ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "viewsCount" INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "clicksCount" INTEGER DEFAULT 0;`;
    console.log("SUCCESS: Analytics columns (viewsCount, clicksCount, isPublished) created/verified in Neon PostgreSQL!");
  } catch (err) {
    console.error("Migration error:", err);
  }
}

main();
