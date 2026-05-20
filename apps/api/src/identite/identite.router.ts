// bc-identite — router tRPC (spec API identite.md, ADR-005)
import { z } from "zod";
import type { Db } from "../shared/db/client.js";
import { db as prodDb } from "../shared/db/client.js";
import { zDeviceId, zEtatOnboarding } from "../shared/schemas.js";
import { publicProcedure, router } from "../trpc/trpc.js";
import { createEnregistrerDeviceRepository } from "./enregistrer-device/enregistrer-device.repository.js";
import { createEnregistrerDeviceService } from "./enregistrer-device/enregistrer-device.service.js";
import { createVerifierDeviceRepository } from "./verifier-device/verifier-device.repository.js";
import { createVerifierDeviceService } from "./verifier-device/verifier-device.service.js";

export function createIdentiteRouter(db: Db) {
  const enregistrerDeviceService = createEnregistrerDeviceService(
    createEnregistrerDeviceRepository(db),
  );

  const verifierDeviceService = createVerifierDeviceService(
    createVerifierDeviceRepository(db),
  );

  return router({
    enregistrerDevice: publicProcedure
      .input(
        z.object({
          deviceId: zDeviceId,
          jetonInvitation: z.string().min(1),
        }),
      )
      .output(
        z.object({
          enregistre: z.literal(true),
          premierAcces: z.boolean(),
        }),
      )
      .mutation(async ({ input }) => {
        return enregistrerDeviceService.execute(
          input.deviceId,
          input.jetonInvitation,
        );
      }),

    verifierDevice: publicProcedure
      .input(
        z.object({
          deviceId: zDeviceId,
        }),
      )
      .output(
        z.object({
          valide: z.boolean(),
          etatOnboarding: zEtatOnboarding.optional(),
        }),
      )
      .query(async ({ input }) => {
        return verifierDeviceService.execute(input.deviceId);
      }),
  });
}

export const identiteRouter = createIdentiteRouter(prodDb);
