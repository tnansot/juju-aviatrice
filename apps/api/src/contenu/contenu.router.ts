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
import type { ExerciceCatalogue } from "./catalogue.js";
import { createChargerExercicesService } from "./charger-exercices/charger-exercices.service.js";
import { createListerPiliersService } from "./lister-piliers/lister-piliers.service.js";
import { createObtenirChapitreService } from "./obtenir-chapitre/obtenir-chapitre.service.js";
import { createObtenirFlashcardEchantillonService } from "./obtenir-flashcard-echantillon/obtenir-flashcard-echantillon.service.js";

// Énoncé sûr pour le frontend : ni la bonne réponse QCM ni la correction ne sont
// transmises ici (la validation et la correction passent par bc-entrainement).
function enonceSansReponse(ex: ExerciceCatalogue) {
  if (ex.format === "flashcard") {
    return {
      faceQuestion: ex.enonce.faceQuestion,
      faceReponse: ex.enonce.faceReponse,
    };
  }
  return {
    question: ex.enonce.question,
    choix: ex.enonce.choix.map((c) => ({ id: c.id, libelle: c.libelle })),
  };
}

export function createContenuRouter(db: Db) {
  const protectedProcedure = createProtectedProcedure(db);
  const listerPiliersService = createListerPiliersService();
  const obtenirChapitreService = createObtenirChapitreService();
  const chargerExercicesService = createChargerExercicesService();
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

    chargerExercices: protectedProcedure
      .input(
        z.object({
          chapitreId: zChapitreId,
          format: zFormat,
          nombre: z.number().int().min(3).max(5).default(4),
        }),
      )
      .output(
        z.array(
          z.object({
            id: z.string(),
            format: zFormat,
            enonce: z.union([
              z.object({
                faceQuestion: z.string(),
                faceReponse: z.string(),
              }),
              z.object({
                question: z.string(),
                choix: z.array(
                  z.object({ id: z.string(), libelle: z.string() }),
                ),
              }),
            ]),
            typologiePsy: z
              .enum(["serie", "analogie", "syllogisme", "deductif"])
              .nullable(),
            ordre: z.number().int(),
          }),
        ),
      )
      .query(({ input }) => {
        return chargerExercicesService
          .execute(input.chapitreId, input.format, input.nombre)
          .map((ex) => ({
            id: ex.id,
            format: ex.format,
            enonce: enonceSansReponse(ex),
            typologiePsy: ex.typologiePsy,
            ordre: ex.ordre,
          }));
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
