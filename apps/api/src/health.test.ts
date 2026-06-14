import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Hono } from "hono";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type JournalEntry,
  computeMigrationStatus,
  healthHandler,
} from "./health.js";

// Journal embarqué dans le build (mêmes tags/when que apps/api/drizzle/meta).
const JOURNAL: JournalEntry[] = [
  { idx: 0, when: 1779183257410, tag: "0000_eager_nico_minoru" },
  { idx: 1, when: 1779523200000, tag: "0001_auth_device_invite_tokens" },
  { idx: 2, when: 1779537600000, tag: "0002_rename_columns_french" },
];

function createHealthApp(
  db: ReturnType<typeof drizzle>,
  journalEntries: JournalEntry[] = JOURNAL,
) {
  const app = new Hono();
  app.get(
    "/health",
    healthHandler({
      db,
      journalEntries,
      version: {
        gitSha: process.env.GIT_SHA || "dev",
        buildDate: process.env.BUILD_DATE || "unknown",
      },
    }),
  );
  return app;
}

describe("computeMigrationStatus", () => {
  it("retrouve le tag lisible via le timestamp created_at ↔ when", () => {
    const status = computeMigrationStatus(
      { count: 3, lastWhen: 1779537600000 },
      JOURNAL,
    );
    expect(status).toEqual({
      appliedInDB: 3,
      availableInBuild: 3,
      currentInDB: "0002_rename_columns_french",
      latestInBuild: "0002_rename_columns_french",
    });
  });

  it("signale une base en retard sur le build", () => {
    // Le build embarque 3 migrations mais la base n'en a appliqué que 2.
    const status = computeMigrationStatus(
      { count: 2, lastWhen: 1779523200000 },
      JOURNAL,
    );
    expect(status).toEqual({
      appliedInDB: 2,
      availableInBuild: 3,
      currentInDB: "0001_auth_device_invite_tokens",
      latestInBuild: "0002_rename_columns_french",
    });
  });

  it("renvoie des valeurs nulles quand aucune migration n'est appliquée", () => {
    const status = computeMigrationStatus(
      { count: 0, lastWhen: null },
      JOURNAL,
    );
    expect(status).toEqual({
      appliedInDB: 0,
      availableInBuild: 3,
      currentInDB: null,
      latestInBuild: "0002_rename_columns_french",
    });
  });
});

describe("GET /health", () => {
  let sqlite: InstanceType<typeof Database>;
  let db: ReturnType<typeof drizzle>;

  beforeEach(() => {
    sqlite = new Database(":memory:");
    sqlite.exec(`
      CREATE TABLE __drizzle_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL,
        created_at numeric
      );
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('a1b2c3', 1779183257410);
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('d4e5f6', 1779523200000);
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('a7b8c9', 1779537600000);
    `);
    db = drizzle(sqlite);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retourne 200 avec version et état des migrations (nom lisible, pas le hash)", async () => {
    vi.stubEnv("GIT_SHA", "abc1234");
    vi.stubEnv("BUILD_DATE", "2026-05-20T12:00:00Z");
    const app = createHealthApp(db);

    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      status: "ok",
      version: { gitSha: "abc1234", buildDate: "2026-05-20T12:00:00Z" },
      db: {
        migrations: {
          appliedInDB: 3,
          availableInBuild: 3,
          currentInDB: "0002_rename_columns_french",
          latestInBuild: "0002_rename_columns_french",
        },
      },
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

  it("expose une base en retard quand le build embarque une migration de plus", async () => {
    const journalAvecMigrationEnPlus: JournalEntry[] = [
      ...JOURNAL,
      { idx: 3, when: 1779624000000, tag: "0003_panoramic_tigra" },
    ];
    const app = createHealthApp(db, journalAvecMigrationEnPlus);

    const res = await app.request("/health");
    const body = await res.json();
    expect(body.db.migrations).toEqual({
      appliedInDB: 3,
      availableInBuild: 4,
      currentInDB: "0002_rename_columns_french",
      latestInBuild: "0003_panoramic_tigra",
    });
  });

  it("retourne appliedInDB 0 si aucune migration n'existe", async () => {
    sqlite.exec("DELETE FROM __drizzle_migrations");
    const app = createHealthApp(db);

    const res = await app.request("/health");
    const body = await res.json();
    expect(body.db.migrations.appliedInDB).toBe(0);
    expect(body.db.migrations.currentInDB).toBeNull();
  });

  it("retourne appliedInDB 0 si la table __drizzle_migrations n'existe pas", async () => {
    const freshSqlite = new Database(":memory:");
    const freshDb = drizzle(freshSqlite);
    const app = createHealthApp(freshDb);

    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.db.migrations.appliedInDB).toBe(0);
    expect(body.db.migrations.currentInDB).toBeNull();
  });
});
