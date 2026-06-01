import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const devices = sqliteTable("devices", {
  id: text("id").primaryKey(),
  label: text("label"),
  dateCreation: integer("date_creation", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  derniereActivite: integer("derniere_activite", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const inviteTokens = sqliteTable("invite_tokens", {
  token: text("token").primaryKey(),
  maxUtilisations: integer("max_utilisations").notNull().default(3),
  utilisations: integer("utilisations").notNull().default(0),
  dateCreation: integer("date_creation", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// bc-onboarding — état du parcours de bienvenue (model-etat-onboarding)
export const onboarding = sqliteTable("onboarding", {
  deviceId: text("device_id")
    .primaryKey()
    .references(() => devices.id),
  etat: text("etat").notNull().default("non_demarre"),
  etapeCourante: integer("etape_courante"),
  premierAccesPsyFait: integer("premier_acces_psy_fait", { mode: "boolean" })
    .notNull()
    .default(false),
  dateMaj: integer("date_maj", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// bc-entrainement — période d'usage continue (model-session)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  deviceId: text("device_id")
    .notNull()
    .references(() => devices.id),
  debut: integer("debut", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  fin: integer("fin", { mode: "timestamp" }),
  etat: text("etat").notNull().default("en_cours"),
});

// bc-entrainement — séquence de 3-5 exercices enchaînés (model-mini-session)
export const miniSessions = sqliteTable("mini_sessions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id),
  chapitreId: text("chapitre_id").notNull(),
  format: text("format").notNull(),
  modeChrono: integer("mode_chrono", { mode: "boolean" })
    .notNull()
    .default(false),
  dureeChrono: integer("duree_chrono"),
  etat: text("etat").notNull().default("en_cours"),
  nombreExercicesFaits: integer("nombre_exercices_faits").notNull().default(0),
  debut: integer("debut", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  fin: integer("fin", { mode: "timestamp" }),
});

// bc-entrainement — instance d'exercice pendant l'exécution (model-exercice-en-cours)
export const exercicesEnCours = sqliteTable("exercices_en_cours", {
  id: text("id").primaryKey(),
  miniSessionId: text("mini_session_id")
    .notNull()
    .references(() => miniSessions.id),
  exerciceId: text("exercice_id").notNull(),
  reponse: text("reponse"),
  estCorrect: integer("est_correct", { mode: "boolean" }),
  dureeReponseMs: integer("duree_reponse_ms"),
  etat: text("etat").notNull().default("en_attente"),
  ordre: integer("ordre").notNull(),
  chargeA: integer("charge_a", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
