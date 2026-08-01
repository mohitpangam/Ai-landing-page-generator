import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// ─────────────────────────────────────────────────────────────────────────────
// Prisma client singleton — using Neon's serverless HTTP/WebSocket adapter.
//
// Why @prisma/adapter-neon instead of @prisma/adapter-pg:
//  - Uses HTTPS / WebSockets (port 443) — never blocked by ISPs or firewalls
//  - Works correctly inside Vercel serverless functions (no persistent TCP)
//  - Neon's HTTP driver handles compute wake-up automatically
//
// Connection URL:
//  - DATABASE_URL = pooled Neon connection string (pgBouncer)
//    Used for all runtime queries in Next.js / Vercel.
//  - DIRECT_URL = direct connection string — only used by `prisma migrate`
//    (run manually via Neon SQL Editor since TCP/5432 may be blocked locally)
//
// Singleton pattern prevents connection pool exhaustion during Next.js HMR:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections
// ─────────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Fill in your Neon pooled connection string in .env.local"
    );
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
