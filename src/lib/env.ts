/**
 * Resolves database URLs from Vercel Supabase integration or manual .env.local.
 * Vercel injects POSTGRES_PRISMA_URL (runtime) and POSTGRES_URL_NON_POOLING (migrations).
 */
export function getDatabaseUrl(): string | undefined {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL
  );
}

export function getDirectDatabaseUrl(): string | undefined {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL
  );
}
