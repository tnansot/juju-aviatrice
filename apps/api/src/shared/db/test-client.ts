import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";

export function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");

  sqlite.exec(`
    CREATE TABLE devices (
      id TEXT PRIMARY KEY NOT NULL,
      label TEXT,
      created_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    );
    CREATE TABLE invite_tokens (
      token TEXT PRIMARY KEY NOT NULL,
      max_utilisations INTEGER NOT NULL DEFAULT 3,
      utilisations INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  return drizzle(sqlite, { schema });
}
