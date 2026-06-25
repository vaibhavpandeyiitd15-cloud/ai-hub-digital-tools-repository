import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function normalizeConnectionString(connectionString: string) {
  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");
  return url.toString();
}

export function createPgAdapter(connectionString: string) {
  const pool = new Pool({
    connectionString: normalizeConnectionString(connectionString),
    ssl: { rejectUnauthorized: false },
  });
  return new PrismaPg(pool);
}
