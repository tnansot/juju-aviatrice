// bc-onboarding — repository saut onboarding (bc-onboarding, model-etat-onboarding)
import { eq } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import { onboarding } from "../../shared/db/schema.js";

export function createSauterRepository(db: Db) {
  return {
    findByDeviceId(deviceId: string) {
      return db
        .select()
        .from(onboarding)
        .where(eq(onboarding.deviceId, deviceId))
        .get();
    },

    upsertSaute(deviceId: string) {
      const existing = this.findByDeviceId(deviceId);
      if (existing) {
        db.update(onboarding)
          .set({ etat: "saute", etapeCourante: null, dateMaj: new Date() })
          .where(eq(onboarding.deviceId, deviceId))
          .run();
      } else {
        db.insert(onboarding)
          .values({
            deviceId,
            etat: "saute",
            etapeCourante: null,
            premierAccesPsyFait: false,
            dateMaj: new Date(),
          })
          .run();
      }
    },
  };
}

export type SauterRepository = ReturnType<typeof createSauterRepository>;
