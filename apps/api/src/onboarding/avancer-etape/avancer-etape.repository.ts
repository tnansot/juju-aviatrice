// bc-onboarding — repository avancement étape onboarding (bc-onboarding, model-etat-onboarding)
import { eq } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import { onboarding } from "../../shared/db/schema.js";

export function createAvancerEtapeRepository(db: Db) {
  return {
    findByDeviceId(deviceId: string) {
      return db
        .select()
        .from(onboarding)
        .where(eq(onboarding.deviceId, deviceId))
        .get();
    },

    upsert(deviceId: string, etat: string, etapeCourante: number | null) {
      const existing = this.findByDeviceId(deviceId);
      if (existing) {
        db.update(onboarding)
          .set({ etat, etapeCourante, dateMaj: new Date() })
          .where(eq(onboarding.deviceId, deviceId))
          .run();
      } else {
        db.insert(onboarding)
          .values({
            deviceId,
            etat,
            etapeCourante,
            premierAccesPsyFait: false,
            dateMaj: new Date(),
          })
          .run();
      }
    },
  };
}

export type AvancerEtapeRepository = ReturnType<
  typeof createAvancerEtapeRepository
>;
