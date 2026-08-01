import "dotenv/config";
import { defineConfig } from "prisma/config";

// ─────────────────────────────────────────────────────────────────────────────
// Prisma 7 configuration file
//
// Connection URL strategy for Neon (serverless PostgreSQL with pgBouncer):
//
//  DIRECT_URL   → non-pooled, direct connection  → used here for migrations
//                 (Prisma Migrate uses PREPARE statements that pgBouncer blocks)
//
//  DATABASE_URL → pooled via pgBouncer            → used at runtime in lib/db.ts
//                 (serverless-safe for Vercel/Next.js API routes)
//
// Both variables must be set in:
//  - .env        (for Prisma CLI: prisma migrate, prisma generate, etc.)
//  - .env.local  (for Next.js runtime: API routes, Server Actions)
//
// Get both connection strings from: https://console.neon.tech
//   → your project → Connection string → toggle Pooling ON/OFF
// ─────────────────────────────────────────────────────────────────────────────

const directUrl = process.env.DIRECT_URL;

if (!directUrl || directUrl.includes("USER:PASSWORD")) {
  console.warn(
    "\n⚠️  Prisma: DIRECT_URL is not configured.\n" +
      "   Fill in your Neon connection strings in .env (for CLI) and .env.local (for Next.js).\n" +
      "   See README.md → Database Setup for instructions.\n"
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: directUrl ?? "postgresql://localhost/placeholder",
  },
});
