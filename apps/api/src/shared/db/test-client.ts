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
      date_creation INTEGER NOT NULL,
      derniere_activite INTEGER NOT NULL
    );
    CREATE TABLE invite_tokens (
      token TEXT PRIMARY KEY NOT NULL,
      max_utilisations INTEGER NOT NULL DEFAULT 3,
      utilisations INTEGER NOT NULL DEFAULT 0,
      date_creation INTEGER NOT NULL
    );
    CREATE TABLE onboarding (
      device_id TEXT PRIMARY KEY NOT NULL,
      etat TEXT NOT NULL DEFAULT 'non_demarre',
      etape_courante INTEGER,
      premier_acces_psy_fait INTEGER NOT NULL DEFAULT 0,
      date_maj INTEGER NOT NULL,
      FOREIGN KEY (device_id) REFERENCES devices(id)
    );
    CREATE TABLE sessions (
      id TEXT PRIMARY KEY NOT NULL,
      device_id TEXT NOT NULL,
      debut INTEGER NOT NULL,
      fin INTEGER,
      etat TEXT NOT NULL DEFAULT 'en_cours',
      FOREIGN KEY (device_id) REFERENCES devices(id)
    );
    CREATE TABLE mini_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      chapitre_id TEXT NOT NULL,
      format TEXT NOT NULL,
      mode_chrono INTEGER NOT NULL DEFAULT 0,
      duree_chrono INTEGER,
      etat TEXT NOT NULL DEFAULT 'en_cours',
      nombre_exercices_faits INTEGER NOT NULL DEFAULT 0,
      debut INTEGER NOT NULL,
      fin INTEGER,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
    CREATE TABLE exercices_en_cours (
      id TEXT PRIMARY KEY NOT NULL,
      mini_session_id TEXT NOT NULL,
      exercice_id TEXT NOT NULL,
      reponse TEXT,
      est_correct INTEGER,
      duree_reponse_ms INTEGER,
      etat TEXT NOT NULL DEFAULT 'en_attente',
      ordre INTEGER NOT NULL,
      charge_a INTEGER NOT NULL,
      FOREIGN KEY (mini_session_id) REFERENCES mini_sessions(id)
    );
  `);

  return drizzle(sqlite, { schema });
}
