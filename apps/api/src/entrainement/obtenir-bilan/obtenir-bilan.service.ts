// bc-entrainement — service bilan de mini-session (bc-entrainement, model-mini-session)
import { TRPCError } from "@trpc/server";
import { obtenirChapitre } from "../../contenu/catalogue.js";
import type { Format } from "../../shared/schemas.js";
import type { SessionRepository } from "../session.repository.js";

export interface BilanResult {
  miniSessionId: string;
  chapitreNom: string;
  format: Format;
  nombreExercicesFaits: number;
  dureeMinutes: number;
  modeChrono: boolean;
  messageBilan: string;
}

// Message sobre et positif (charte de ton) — jamais de note /N ni de pourcentage.
function construireMessage(nombre: number): string {
  if (nombre <= 1) {
    return "1 exercice fait — chaque pas compte.";
  }
  return `${nombre} exercices faits — beau travail, ton avatar avance.`;
}

export function createObtenirBilanService(repo: SessionRepository) {
  return {
    execute(deviceId: string, miniSessionId: string): BilanResult {
      const ctx = repo.contexteMiniSession(miniSessionId);
      if (!ctx || ctx.deviceId !== deviceId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const nombreExercicesFaits = repo.compterExercicesFaits(miniSessionId);
      const chapitre = obtenirChapitre(ctx.chapitreId);
      const finMs = (ctx.fin ?? new Date()).getTime();
      const dureeMinutes = Math.max(
        1,
        Math.round((finMs - ctx.debut.getTime()) / 60000),
      );

      return {
        miniSessionId,
        chapitreNom: chapitre?.nom ?? ctx.chapitreId,
        format: ctx.format as Format,
        nombreExercicesFaits,
        dureeMinutes,
        modeChrono: ctx.modeChrono,
        messageBilan: construireMessage(nombreExercicesFaits),
      };
    },
  };
}

export type ObtenirBilanService = ReturnType<typeof createObtenirBilanService>;
