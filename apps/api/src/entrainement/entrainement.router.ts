// bc-entrainement — router tRPC (spec API entrainement.md, bc-entrainement)
import { z } from "zod";
import { createChargerExercicesService } from "../contenu/charger-exercices/charger-exercices.service.js";
import type { Db } from "../shared/db/client.js";
import { db as prodDb } from "../shared/db/client.js";
import { type EventBus, createEventBus } from "../shared/events.js";
import { zChapitreId, zExerciceId, zFormat } from "../shared/schemas.js";
import { createProtectedProcedure, router } from "../trpc/trpc.js";
import { createDemarrerMiniSessionRepository } from "./demarrer-mini-session/demarrer-mini-session.repository.js";
import { createDemarrerMiniSessionService } from "./demarrer-mini-session/demarrer-mini-session.service.js";
import { createObtenirBilanService } from "./obtenir-bilan/obtenir-bilan.service.js";
import { createRetournerFlashcardService } from "./retourner-flashcard/retourner-flashcard.service.js";
import { createSessionRepository } from "./session.repository.js";
import { createSignalerInterruptionService } from "./signaler-interruption/signaler-interruption.service.js";
import { createSoumettreReponseService } from "./soumettre-reponse/soumettre-reponse.service.js";
import { createTerminerMiniSessionService } from "./terminer-mini-session/terminer-mini-session.service.js";

const zEnonce = z.union([
  z.object({
    faceQuestion: z.string(),
    faceReponse: z.string(),
    explication: z.string(),
  }),
  z.object({
    question: z.string(),
    choix: z.array(z.object({ id: z.string(), libelle: z.string() })),
  }),
]);

export function createEntrainementRouter(
  db: Db,
  bus: EventBus = createEventBus(),
) {
  const protectedProcedure = createProtectedProcedure(db);
  const chargerExercices = createChargerExercicesService();
  const sessionRepo = createSessionRepository(db);

  const demarrerMiniSessionService = createDemarrerMiniSessionService(
    createDemarrerMiniSessionRepository(db),
    chargerExercices,
  );
  const retournerFlashcardService = createRetournerFlashcardService(
    sessionRepo,
    bus,
  );
  const soumettreReponseService = createSoumettreReponseService(
    sessionRepo,
    bus,
  );
  const terminerMiniSessionService = createTerminerMiniSessionService(
    sessionRepo,
    bus,
  );
  const obtenirBilanService = createObtenirBilanService(sessionRepo);
  const signalerInterruptionService = createSignalerInterruptionService(
    sessionRepo,
    bus,
  );

  return router({
    demarrerMiniSession: protectedProcedure
      .input(
        z.object({
          chapitreId: zChapitreId,
          format: zFormat,
          modeChrono: z.boolean().default(false),
          dureeChrono: z.number().int().min(30).optional(),
          nombre: z.number().int().min(3).max(5).default(4),
        }),
      )
      .output(
        z.object({
          sessionId: z.string(),
          miniSessionId: z.string(),
          exercices: z.array(
            z.object({
              id: zExerciceId,
              exerciceEnCoursId: z.string(),
              format: zFormat,
              enonce: zEnonce,
              ordre: z.number().int(),
            }),
          ),
          modeChrono: z.boolean(),
          dureeChrono: z.number().int().nullable(),
        }),
      )
      .mutation(({ ctx, input }) => {
        return demarrerMiniSessionService.execute(ctx.deviceId, input);
      }),

    retournerFlashcard: protectedProcedure
      .input(z.object({ exerciceEnCoursId: z.string() }))
      .output(z.object({ exerciceSuivant: z.boolean() }))
      .mutation(({ ctx, input }) => {
        return retournerFlashcardService.execute(
          ctx.deviceId,
          input.exerciceEnCoursId,
        );
      }),

    soumettreReponse: protectedProcedure
      .input(
        z.object({
          exerciceEnCoursId: z.string(),
          choixId: z.string(),
        }),
      )
      .output(
        z.object({
          estCorrect: z.boolean(),
          correction: z.string(),
          bonneReponseId: z.string(),
          exerciceSuivant: z.boolean(),
        }),
      )
      .mutation(({ ctx, input }) => {
        return soumettreReponseService.execute(
          ctx.deviceId,
          input.exerciceEnCoursId,
          input.choixId,
        );
      }),

    terminerMiniSession: protectedProcedure
      .input(z.object({ miniSessionId: z.string() }))
      .output(
        z.object({
          etat: z.literal("terminee"),
          nombreExercicesFaits: z.number().int(),
          avatarProgresse: z.boolean(),
          nouveauStadeAvatar: z.number().int().nullable(),
          chapitreDebloque: z
            .object({
              chapitreId: zChapitreId,
              chapitreNom: z.string(),
            })
            .nullable(),
        }),
      )
      .mutation(({ ctx, input }) => {
        return terminerMiniSessionService.execute(
          ctx.deviceId,
          input.miniSessionId,
        );
      }),

    obtenirBilan: protectedProcedure
      .input(z.object({ miniSessionId: z.string() }))
      .output(
        z.object({
          miniSessionId: z.string(),
          chapitreNom: z.string(),
          format: zFormat,
          nombreExercicesFaits: z.number().int(),
          dureeMinutes: z.number(),
          modeChrono: z.boolean(),
          messageBilan: z.string(),
        }),
      )
      .query(({ ctx, input }) => {
        return obtenirBilanService.execute(ctx.deviceId, input.miniSessionId);
      }),

    signalerInterruption: protectedProcedure
      .input(z.object({ miniSessionId: z.string() }))
      .output(z.object({ exercicesFaitsComptes: z.number().int() }))
      .mutation(({ ctx, input }) => {
        return signalerInterruptionService.execute(
          ctx.deviceId,
          input.miniSessionId,
        );
      }),
  });
}

export const entrainementRouter = createEntrainementRouter(prodDb);
