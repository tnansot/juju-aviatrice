// bc-identite — repository enregistrement device
import { eq, sql } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import { devices, inviteTokens } from "../../shared/db/schema.js";

export function createEnregistrerDeviceRepository(db: Db) {
  return {
    findToken(token: string) {
      return db
        .select()
        .from(inviteTokens)
        .where(eq(inviteTokens.token, token))
        .get();
    },

    findDevice(deviceId: string) {
      return db.select().from(devices).where(eq(devices.id, deviceId)).get();
    },

    insertDevice(deviceId: string) {
      const now = new Date();
      db.insert(devices)
        .values({ id: deviceId, dateCreation: now, derniereActivite: now })
        .run();
    },

    incrementTokenUsage(token: string) {
      db.update(inviteTokens)
        .set({ utilisations: sql`${inviteTokens.utilisations} + 1` })
        .where(eq(inviteTokens.token, token))
        .run();
    },
  };
}

export type EnregistrerDeviceRepository = ReturnType<
  typeof createEnregistrerDeviceRepository
>;
