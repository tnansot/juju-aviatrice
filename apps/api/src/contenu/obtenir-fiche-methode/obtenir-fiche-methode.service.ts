// bc-contenu — service fiche méthode psy (bc-contenu, model-fiche-methode, spec API contenu)
//
// Retourne la fiche méthode d'un chapitre psychotechnique. Lève NON_TROUVE si le
// chapitre n'a pas de fiche méthode (chapitres sciences notamment).
import { TRPCError } from "@trpc/server";
import { type TypePsy, obtenirFicheMethode } from "../catalogue.js";

export interface ObtenirFicheMethodeResult {
  id: string;
  chapitreId: string;
  typePsy: TypePsy;
  cestQuoi: string;
  ceQueCaEvalue: string[];
  commentAborder: string[];
}

export function createObtenirFicheMethodeService() {
  return {
    execute(chapitreId: string): ObtenirFicheMethodeResult {
      const fiche = obtenirFicheMethode(chapitreId);
      if (!fiche) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }
      return {
        id: fiche.id,
        chapitreId: fiche.chapitreId,
        typePsy: fiche.typePsy,
        cestQuoi: fiche.cestQuoi,
        ceQueCaEvalue: fiche.ceQueCaEvalue,
        commentAborder: fiche.commentAborder,
      };
    },
  };
}

export type ObtenirFicheMethodeService = ReturnType<
  typeof createObtenirFicheMethodeService
>;
