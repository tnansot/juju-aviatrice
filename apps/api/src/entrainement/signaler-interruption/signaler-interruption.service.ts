// bc-entrainement — service signalement d'interruption (bc-entrainement, model-mini-session)
//
// Tolérance aux interruptions : les exercices déjà complétés sont comptabilisés,
// aucune pénalité, aucune relance à la réouverture (règle d'or).
import { TRPCError } from "@trpc/server";
import type { EventBus } from "../../shared/events.js";
import type { SessionRepository } from "../session.repository.js";

export function createSignalerInterruptionService(
  repo: SessionRepository,
  bus: EventBus,
) {
  return {
    execute(
      deviceId: string,
      miniSessionId: string,
    ): { exercicesFaitsComptes: number } {
      const ctx = repo.contexteMiniSession(miniSessionId);
      if (!ctx || ctx.deviceId !== deviceId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const exercicesFaitsComptes = repo.compterExercicesFaits(miniSessionId);

      if (ctx.etat === "en_cours") {
        repo.cloturerMiniSession(
          miniSessionId,
          "interrompue",
          exercicesFaitsComptes,
        );
        // Si plus aucune mini-session active, la session parente est aussi interrompue.
        if (!repo.sessionAMiniEnCours(ctx.sessionId)) {
          repo.cloturerSession(ctx.sessionId, "interrompue");
        }
        bus.emit({
          type: "session_interrompue",
          deviceId,
          miniSessionId,
          exercicesFaitsComptes,
        });
      }

      return { exercicesFaitsComptes };
    },
  };
}

export type SignalerInterruptionService = ReturnType<
  typeof createSignalerInterruptionService
>;
