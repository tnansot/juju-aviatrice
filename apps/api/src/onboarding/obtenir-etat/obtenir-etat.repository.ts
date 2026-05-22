// bc-onboarding — repository obtention état onboarding (bc-onboarding, model-etat-onboarding)
import { eq } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import { onboarding } from "../../shared/db/schema.js";

export function createObtenirEtatRepository(db: Db) {
  return {
    findByDeviceId(deviceId: string) {
      return db
        .select()
        .from(onboarding)
        .where(eq(onboarding.deviceId, deviceId))
        .get();
    },
  };
}

export type ObtenirEtatRepository = ReturnType<
  typeof createObtenirEtatRepository
>;
