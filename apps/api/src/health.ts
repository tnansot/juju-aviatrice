import { readFileSync } from "node:fs";
import path from "node:path";
import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { Context } from "hono";

/** Une entrée du fichier drizzle/meta/_journal.json (livré avec le build). */
export interface JournalEntry {
  idx: number;
  when: number;
  tag: string;
}

/**
 * État des migrations exposé par /health. Les suffixes InDB / InBuild lèvent
 * toute ambiguïté : InDB = ce qui est réellement appliqué en base, InBuild =
 * ce que le build d'API qui tourne embarque. L'écart entre les deux indique
 * une base en retard (ou en avance) sur le code déployé.
 */
export interface MigrationStatus {
  /** Nombre de migrations enregistrées dans __drizzle_migrations. */
  appliedInDB: number;
  /** Nombre de migrations livrées dans ce build (entrées du journal). */
  availableInBuild: number;
  /** Nom lisible de la dernière migration appliquée en base, ou null. */
  currentInDB: string | null;
  /** Nom lisible de la dernière migration livrée dans ce build, ou null. */
  latestInBuild: string | null;
}

/** Interface minimale du client Drizzle dont /health a besoin. */
export interface HealthDb {
  run(query: SQL): unknown;
  get<T = unknown>(query: SQL): T | undefined;
}

export interface ApiVersion {
  gitSha: string;
  buildDate: string;
}

export interface HealthDeps {
  db: HealthDb;
  journalEntries: JournalEntry[];
  version: ApiVersion;
}

/**
 * Croise les migrations appliquées en base avec le journal embarqué.
 * Le nom lisible (tag) n'est pas stocké en base — seul le hash SHA256 l'est —
 * mais __drizzle_migrations.created_at correspond exactement au champ `when`
 * du journal, ce qui permet de retrouver le tag de la dernière migration.
 */
export function computeMigrationStatus(
  applied: { count: number; lastWhen: number | null },
  entries: JournalEntry[],
): MigrationStatus {
  const sorted = [...entries].sort((a, b) => a.idx - b.idx);
  const currentInDB =
    applied.lastWhen != null
      ? (sorted.find((e) => e.when === applied.lastWhen)?.tag ?? null)
      : null;
  return {
    appliedInDB: applied.count,
    availableInBuild: sorted.length,
    currentInDB,
    latestInBuild: sorted.at(-1)?.tag ?? null,
  };
}

/** Lit le compteur et le timestamp de la dernière migration appliquée en base. */
function readAppliedMigrations(db: HealthDb): {
  count: number;
  lastWhen: number | null;
} {
  try {
    const row = db.get<{ count: number; lastWhen: number | null }>(
      sql`SELECT COUNT(*) AS count, MAX(created_at) AS lastWhen FROM __drizzle_migrations`,
    );
    return { count: row?.count ?? 0, lastWhen: row?.lastWhen ?? null };
  } catch {
    // Table absente : migrations jamais exécutées.
    return { count: 0, lastWhen: null };
  }
}

/** Charge les entrées du journal Drizzle depuis le dossier de migrations. */
export function loadJournalEntries(migrationsFolder: string): JournalEntry[] {
  try {
    const raw = readFileSync(
      path.join(migrationsFolder, "meta", "_journal.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as { entries?: JournalEntry[] };
    return parsed.entries ?? [];
  } catch {
    return [];
  }
}

/** Construit le handler Hono de /health avec ses dépendances injectées. */
export function healthHandler(deps: HealthDeps) {
  return (c: Context) => {
    try {
      deps.db.run(sql`SELECT 1`);
    } catch {
      return c.json({ status: "error", version: deps.version }, 503);
    }

    const applied = readAppliedMigrations(deps.db);
    const migrations = computeMigrationStatus(applied, deps.journalEntries);

    return c.json({
      status: "ok",
      version: deps.version,
      db: { migrations },
    });
  };
}
