import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getPool(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set; cannot create Postgres pool");
    }
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}
