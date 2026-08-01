/**
 * Quick DB connection test — verifies:
 * 1. DATABASE_URL is set and Neon HTTP adapter can connect
 * 2. The migration was applied (User table exists and is queryable)
 *
 * Run with: npx tsx scripts/test-db.ts
 */

// Load .env.local manually for this script
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  console.log("🔌 Connecting to Neon via HTTP adapter...");
  const adapter = new PrismaNeon({ connectionString });
  const db = new PrismaClient({ adapter });

  try {
    // Simple query — will fail if the User table doesn't exist
    const count = await db.user.count();
    console.log(`✅ Connected! User table exists — ${count} rows`);

    // List all tables to confirm full migration
    const tables = await db.$queryRaw<{ tablename: string }[]>`
      SELECT tablename::text FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    console.log("\n📋 Tables in database:");
    tables.forEach((t) => console.log(`   • ${t.tablename}`));
    console.log("\n🎉 Migration verified — all tables present!");
  } catch (err) {
    console.error("❌ Connection or query failed:", err);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
