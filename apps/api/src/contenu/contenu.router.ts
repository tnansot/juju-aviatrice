// bc-contenu — router tRPC (spec API contenu.md, bc-contenu)
import { z } from "zod";
import type { Db } from "../shared/db/client.js";
import { db as prodDb } from "../shared/db/client.js";
import { zChapitreId, zFormat, zMatiere } from "../shared/schemas.js";
import {
  createProtectedProcedure,
  publicProcedure,
  router,
} from "../trpc/trpc.js";
import { createListerPiliersService } from "./lister-piliers/lister-piliers.service.js";
import { createObtenirChapitreService } from "./obtenir-chapitre/obtenir-chapitre.service.js";
import { createObtenirFlashcardEchantillonService } from "./obtenir-flashcard-echantillon/obtenir-flashcard-echantillon.service.js";

export function createContenuRouter(db: Db) {
  const protectedProcedure = createProtectedProcedure(db);
  const listerPiliersService = createListerPiliersService();
  const obtenirChapitreService = createObtenirChapitreService();
  const flashcardService = createObtenirFlashcardEchantillonService();

  return router({
    listerPiliers: protectedProcedure
      .output(
        z.array(
          z.object({
            id: z.string(),
            nom: z.string(),
            description: z.string(),
            chapitres: z.array(
              z.object({
                id: z.string(),
                nom: z.string(),
                matiere: zMatiere,
                formatsDisponibles: z.array(zFormat),
                ordre: z.number().int(),
              }),
            ),
          }),
        ),
      )
      .query(() => {
        return listerPiliersService.execute();
      }),

    obtenirChapitre: protectedProcedure
      .input(z.object({ chapitreId: zChapitreId }))
      .output(
        z.object({
          id: z.string(),
          pilierId: z.string(),
          nom: z.string(),
          matiere: zMatiere,
          referenceBo: z.string().nullable(),
          formatsDisponibles: z.array(zFormat),
          ordre: z.number().int(),
          ficheMethodeDisponible: z.boolean(),
          nombreExercicesParFormat: z.record(z.string(), z.number().int()),
        }),
      )
      .query(({ input }) => {
        return obtenirChapitreService.execute(input.chapitreId);
      }),

    obtenirFlashcardEchantillon: publicProcedure
      .output(
        z.object({
          id: z.string(),
          faceQuestion: z.string(),
          faceReponse: z.string(),
          correction: z.string(),
        }),
      )
      .query(() => {
        return flashcardService.execute();
      }),
  });
}

export const contenuRouter = createContenuRouter(prodDb);
