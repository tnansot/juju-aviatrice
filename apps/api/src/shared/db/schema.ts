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
