// bc-contenu — service métadonnées d'un chapitre (bc-contenu, model-chapitre, spec API contenu)
//
// Retourne les métadonnées d'un chapitre (sans les exercices) ainsi que le
// nombre d'exercices par format. Lève NON_TROUVE si le chapitre n'existe pas.
import { TRPCError } from "@trpc/server";
import type { Format, Matiere } from "../../shared/schemas.js";
import { exercicesDuChapitre, obtenirChapitre } from "../catalogue.js";

export interface ObtenirChapitreResult {
  id: string;
  pilierId: string;
  nom: string;
  matiere: Matiere;
  referenceBo: string | null;
  formatsDisponibles: Format[];
  ordre: number;
  ficheMethodeDisponible: boolean;
  nombreExercicesParFormat: Record<string, number>;
}

export function createObtenirChapitreService() {
  return {
    execute(chapitreId: string): ObtenirChapitreResult {
      const chapitre = obtenirChapitre(chapitreId);
      if (!chapitre) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const nombreExercicesParFormat: Record<string, number> = {};
      for (const format of chapitre.formatsDisponibles) {
        nombreExercicesParFormat[format] = exercicesDuChapitre(
          chapitre.id,
          format,
        ).length;
      }

      return {
        id: chapitre.id,
        pilierId: chapitre.pilierId,
        nom: chapitre.nom,
        matiere: chapitre.matiere,
        referenceBo: chapitre.referenceBo,
        formatsDisponibles: chapitre.formatsDisponibles,
        ordre: chapitre.ordre,
        ficheMethodeDisponible: chapitre.ficheMethodeDisponible,
        nombreExercicesParFormat,
      };
    },
  };
}

export type ObtenirChapitreService = ReturnType<
  typeof createObtenirChapitreService
>;
