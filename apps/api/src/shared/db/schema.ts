import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const devices = sqliteTable("devices", {
  id: text("id").primaryKey(),
  label: text("label"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const inviteTokens = sqliteTable("invite_tokens", {
  token: text("token").primaryKey(),
  usedByDeviceId: text("used_by_device_id").references(() => devices.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  usedAt: integer("used_at", { mode: "timestamp" }),
});
