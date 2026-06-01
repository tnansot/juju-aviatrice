// bc-entrainement — service soumission réponse QCM (bc-entrainement, model-exercice-en-cours)
import { TRPCError } from "@trpc/server";
import { obtenirExercice } from "../../contenu/catalogue.js";
import type { EventBus } from "../../shared/events.js";
import type { SessionRepository } from "../session.repository.js";

export interface SoumettreReponseResult {
  estCorrect: boolean;
  correction: string;
  bonneReponseId: string;
  exerciceSuivant: boolean;
}

export function createSoumettreReponseService(
  repo: SessionRepository,
  bus: EventBus,
) {
  return {
    execute(
      deviceId: string,
      exerciceEnCoursId: string,
      choixId: string,
    ): SoumettreReponseResult {
      const ctx = repo.contexteExercice(exerciceEnCoursId);
      if (!ctx || ctx.deviceId !== deviceId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const exercice = obtenirExercice(ctx.exerciceId);
      if (!exercice || exercice.format !== "qcm") {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const estCorrect = choixId === exercice.bonneReponseId;

      if (ctx.etat === "en_attente") {
        const dureeReponseMs = Date.now() - ctx.chargeA.getTime();
        repo.completerExercice(exerciceEnCoursId, {
          reponse: choixId,
          estCorrect,
          dureeReponseMs,
        });
        bus.emit({
          type: "exercice_effectue",
          deviceId,
          miniSessionId: ctx.miniSessionId,
          exerciceId: ctx.exerciceId,
          estCorrect,
        });
      }

      return {
        estCorrect,
        correction: exercice.correction,
        bonneReponseId: exercice.bonneReponseId,
        exerciceSuivant: repo.resteExercicesEnAttente(ctx.miniSessionId),
      };
    },
  };
}

export type SoumettreReponseService = ReturnType<
  typeof createSoumettreReponseService
>;
