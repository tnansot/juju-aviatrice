// bc-entrainement — service retournement flashcard (bc-entrainement, model-exercice-en-cours)
import { TRPCError } from "@trpc/server";
import type { EventBus } from "../../shared/events.js";
import type { SessionRepository } from "../session.repository.js";

export function createRetournerFlashcardService(
  repo: SessionRepository,
  bus: EventBus,
) {
  return {
    execute(
      deviceId: string,
      exerciceEnCoursId: string,
    ): { exerciceSuivant: boolean } {
      const ctx = repo.contexteExercice(exerciceEnCoursId);
      if (!ctx || ctx.deviceId !== deviceId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      if (ctx.etat === "en_attente") {
        const dureeReponseMs = Date.now() - ctx.chargeA.getTime();
        // Flashcard : auto-évaluation mentale, pas de est_correct (null).
        repo.completerExercice(exerciceEnCoursId, {
          reponse: null,
          estCorrect: null,
          dureeReponseMs,
        });
        bus.emit({
          type: "exercice_effectue",
          deviceId,
          miniSessionId: ctx.miniSessionId,
          exerciceId: ctx.exerciceId,
          estCorrect: null,
        });
      }

      return {
        exerciceSuivant: repo.resteExercicesEnAttente(ctx.miniSessionId),
      };
    },
  };
}

export type RetournerFlashcardService = ReturnType<
  typeof createRetournerFlashcardService
>;
