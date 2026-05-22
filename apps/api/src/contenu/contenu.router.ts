// bc-contenu — router tRPC (spec API contenu.md, bc-contenu)
import { z } from "zod";
import type { Db } from "../shared/db/client.js";
import { db as prodDb } from "../shared/db/client.js";
import {
  createProtectedProcedure,
  publicProcedure,
  router,
} from "../trpc/trpc.js";
import { createListerPiliersService } from "./lister-piliers/lister-piliers.service.js";
import { createObtenirFlashcardEchantillonService } from "./obtenir-flashcard-echantillon/obtenir-flashcard-echantillon.service.js";

export function createContenuRouter(db: Db) {
  const protectedProcedure = createProtectedProcedure(db);
  const listerPiliersService = createListerPiliersService();
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
                ordre: z.number().int(),
              }),
            ),
          }),
        ),
      )
      .query(() => {
        return listerPiliersService.execute();
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
