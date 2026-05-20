import { eq } from "drizzle-orm";
import { db } from "../src/shared/db/client.js";
import { inviteTokens } from "../src/shared/db/schema.js";

const TOKEN =
  process.argv[2] ?? process.env.INVITE_TOKEN ?? "juju-aviatrice-2026";
const MAX = Number(process.env.INVITE_MAX ?? 3);

const existing = db
  .select()
  .from(inviteTokens)
  .where(eq(inviteTokens.token, TOKEN))
  .get();

if (existing) {
  console.error(
    `Erreur : le jeton "${TOKEN}" existe déjà (${existing.utilisations}/${existing.maxUtilisations} utilisations).`,
  );
  console.error("Supprimez-le d'abord ou choisissez un autre nom.");
  process.exit(1);
}

db.insert(inviteTokens)
  .values({ token: TOKEN, maxUtilisations: MAX, utilisations: 0 })
  .run();

console.log(`Jeton d'invitation créé : ${TOKEN} (max ${MAX} utilisations)`);
