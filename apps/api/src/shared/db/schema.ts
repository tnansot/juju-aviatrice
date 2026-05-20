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
