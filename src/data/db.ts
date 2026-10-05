import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function getDb(pool: Pool) {
  return drizzle({ client: pool });
}

export type DB = ReturnType<typeof getDb>;

export const db = getDb(new Pool({ connectionString: process.env.PG }));
