// bc-onboarding — repository premier accès psy (bc-onboarding, model-etat-onboarding)
import { eq } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import { onboarding } from "../../shared/db/schema.js";

export function createMarquerPremierAccesPsyRepository(db: Db) {
  return {
    findByDeviceId(deviceId: string) {
      return db
        .select()
        .from(onboarding)
        .where(eq(onboarding.deviceId, deviceId))
        .get();
    },

    marquer(deviceId: string) {
      const existing = this.findByDeviceId(deviceId);
      if (existing) {
        db.update(onboarding)
          .set({ premierAccesPsyFait: true, dateMaj: new Date() })
          .where(eq(onboarding.deviceId, deviceId))
          .run();
      } else {
        // Cas défensif : un device atteignant le pilier psy a normalement déjà une
        // ligne onboarding (complété ou sauté). On crée la ligne sans toucher au
        // parcours de bienvenue (état non_demarre conservé).
        db.insert(onboarding)
          .values({
            deviceId,
            etat: "non_demarre",
            etapeCourante: null,
            premierAccesPsyFait: true,
            dateMaj: new Date(),
          })
          .run();
      }
    },
  };
}

export type MarquerPremierAccesPsyRepository = ReturnType<
  typeof createMarquerPremierAccesPsyRepository
>;
