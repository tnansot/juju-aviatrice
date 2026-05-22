// bc-onboarding — router tRPC (spec API onboarding.md, bc-onboarding)
import { z } from "zod";
import type { Db } from "../shared/db/client.js";
import { db as prodDb } from "../shared/db/client.js";
import { zEtatOnboarding } from "../shared/schemas.js";
import { createProtectedProcedure, router } from "../trpc/trpc.js";
import { createAvancerEtapeRepository } from "./avancer-etape/avancer-etape.repository.js";
import { createAvancerEtapeService } from "./avancer-etape/avancer-etape.service.js";
import { createObtenirEtatRepository } from "./obtenir-etat/obtenir-etat.repository.js";
import { createObtenirEtatService } from "./obtenir-etat/obtenir-etat.service.js";
import { createSauterRepository } from "./sauter/sauter.repository.js";
import { createSauterService } from "./sauter/sauter.service.js";

export function createOnboardingRouter(db: Db) {
  const protectedProcedure = createProtectedProcedure(db);

  const obtenirEtatService = createObtenirEtatService(
    createObtenirEtatRepository(db),
  );
  const avancerEtapeService = createAvancerEtapeService(
    createAvancerEtapeRepository(db),
  );
  const sauterService = createSauterService(createSauterRepository(db));

  return router({
    obtenirEtat: protectedProcedure
      .output(
        z.object({
          etat: zEtatOnboarding,
          etapeCourante: z.number().int().min(1).nullable(),
          premierAccesPsyFait: z.boolean(),
        }),
      )
      .query(({ ctx }) => {
        return obtenirEtatService.execute(ctx.deviceId);
      }),

    avancerEtape: protectedProcedure
      .input(
        z.object({
          etapeCompletee: z.number().int().min(1).max(3),
        }),
      )
      .output(
        z.object({
          etat: zEtatOnboarding,
          etapeSuivante: z.number().int().nullable(),
        }),
      )
      .mutation(({ ctx, input }) => {
        return avancerEtapeService.execute(ctx.deviceId, input.etapeCompletee);
      }),

    sauter: protectedProcedure
      .output(
        z.object({
          etat: z.literal("saute"),
        }),
      )
      .mutation(({ ctx }) => {
        return sauterService.execute(ctx.deviceId);
      }),
  });
}

export const onboardingRouter = createOnboardingRouter(prodDb);
