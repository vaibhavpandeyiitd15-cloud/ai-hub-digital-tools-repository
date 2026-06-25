import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makePrisma() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    return null;
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient | null {
  if (!getDatabaseUrl()) {
    return null;
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = makePrisma() ?? undefined;
  }
  return globalForPrisma.prisma ?? null;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    if (!client) {
      throw new Error(
        "Database URL not set. Add POSTGRES_PRISMA_URL or DATABASE_URL from Vercel Supabase integration.",
      );
    }
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function hasDatabase() {
  return Boolean(getDatabaseUrl());
}
