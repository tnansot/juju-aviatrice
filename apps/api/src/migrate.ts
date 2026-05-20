import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./shared/db/client.js";

migrate(db, { migrationsFolder: "./drizzle" });

console.log("Migrations appliquées avec succès.");
