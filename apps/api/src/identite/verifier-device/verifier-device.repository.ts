// bc-identite — repository vérification device
import { eq } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import { devices, onboarding } from "../../shared/db/schema.js";

export function createVerifierDeviceRepository(db: Db) {
  return {
    findDevice(deviceId: string) {
      return db.select().from(devices).where(eq(devices.id, deviceId)).get();
    },

    findOnboardingState(deviceId: string) {
      return db
        .select({ etat: onboarding.etat })
        .from(onboarding)
        .where(eq(onboarding.deviceId, deviceId))
        .get();
    },

    updateLastSeen(deviceId: string) {
      db.update(devices)
        .set({ derniereActivite: new Date() })
        .where(eq(devices.id, deviceId))
        .run();
    },
  };
}

export type VerifierDeviceRepository = ReturnType<
  typeof createVerifierDeviceRepository
>;
