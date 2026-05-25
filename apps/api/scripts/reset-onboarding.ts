import { db } from "../src/shared/db/client.js";
import { onboarding } from "../src/shared/db/schema.js";

const deleted = db.delete(onboarding).returning().all();
console.log(
  `Onboarding réinitialisé : ${deleted.length} enregistrement(s) supprimé(s).`,
);
