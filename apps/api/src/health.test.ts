import Database from "better-sqlite3";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Hono } from "hono";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function createHealthApp(db: ReturnType<typeof drizzle>) {
  const app = new Hono();
  const apiVersion = {
    gitSha: process.env.GIT_SHA || "dev",
    buildDate: process.env.BUILD_DATE || "unknown",
  };

  app.get("/health", (c) => {
    try {
      db.run(sql`SELECT 1`);
    } catch {
      return c.json({ status: "error", version: apiVersion }, 503);
    }

    let lastMigration = "unknown";
    try {
      const row = db.get<{ hash: string }>(
        sql`SELECT hash FROM __drizzle_migrations ORDER BY id DESC LIMIT 1`,
      );
      lastMigration = row?.hash ?? "none";
    } catch {
      // table absente
    }

    return c.json({
      status: "ok",
      version: apiVersion,
      db: { lastMigration },
    });
  });

  return app;
}

describe("GET /health", () => {
  let sqlite: InstanceType<typeof Database>;
  let db: ReturnType<typeof drizzle>;

  beforeEach(() => {
    sqlite = new Database(":memory:");
    sqlite.exec(`
      CREATE TABLE __drizzle_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL,
        created_at TEXT
      );
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('0000_eager_nico_minoru', '1779183257410');
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('0001_auth_device_invite_tokens', '1779523200000');
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('0002_rename_columns_french', '1779537600000');
    `);
    db = drizzle(sqlite);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retourne 200 avec version et dernière migration", async () => {
    vi.stubEnv("GIT_SHA", "abc1234");
    vi.stubEnv("BUILD_DATE", "2026-05-20T12:00:00Z");
    const app = createHealthApp(db);

    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      status: "ok",
      version: { gitSha: "abc1234", buildDate: "2026-05-20T12:00:00Z" },
      db: { lastMigration: "0002_rename_columns_french" },
    });
  });

  it("retourne les fallbacks sans variables d'environnement", async () => {
    vi.stubEnv("GIT_SHA", "");
    vi.stubEnv("BUILD_DATE", "");
    const app = createHealthApp(db);

    const res = await app.request("/health");
    const body = await res.json();
    expect(body.version.gitSha).toBe("dev");
    expect(body.version.buildDate).toBe("unknown");
  });

  it("retourne 'none' si aucune migration n'existe", async () => {
    sqlite.exec("DELETE FROM __drizzle_migrations");
    const app = createHealthApp(db);

    const res = await app.request("/health");
    const body = await res.json();
    expect(body.db.lastMigration).toBe("none");
  });

  it("retourne 'unknown' si la table __drizzle_migrations n'existe pas", async () => {
    const freshSqlite = new Database(":memory:");
    const freshDb = drizzle(freshSqlite);
    const app = createHealthApp(freshDb);

    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.db.lastMigration).toBe("unknown");
  });
});
