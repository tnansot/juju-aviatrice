// bc-entrainement — service clôture de mini-session (bc-entrainement, model-mini-session)
import { TRPCError } from "@trpc/server";
import type { EventBus } from "../../shared/events.js";
import type { SessionRepository } from "../session.repository.js";

export interface TerminerMiniSessionResult {
  etat: "terminee";
  nombreExercicesFaits: number;
  avatarProgresse: boolean;
  nouveauStadeAvatar: number | null;
  chapitreDebloque: { chapitreId: string; chapitreNom: string } | null;
}

export function createTerminerMiniSessionService(
  repo: SessionRepository,
  bus: EventBus,
) {
  return {
    execute(
      deviceId: string,
      miniSessionId: string,
    ): TerminerMiniSessionResult {
      const ctx = repo.contexteMiniSession(miniSessionId);
      if (!ctx || ctx.deviceId !== deviceId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const nombreExercicesFaits = repo.compterExercicesFaits(miniSessionId);

      if (ctx.etat === "en_cours") {
        repo.cloturerMiniSession(
          miniSessionId,
          "terminee",
          nombreExercicesFaits,
        );
        bus.emit({
          type: "mini_session_terminee",
          deviceId,
          miniSessionId,
          nombreExercicesFaits,
        });
      }

      // Évolution avatar / déblocage : calculés par bc-progression (F8) au moment
      // où il consommera mini_session_terminee. En M0, valeurs neutres.
      return {
        etat: "terminee",
        nombreExercicesFaits,
        avatarProgresse: false,
        nouveauStadeAvatar: null,
        chapitreDebloque: null,
      };
    },
  };
}

export type TerminerMiniSessionService = ReturnType<
  typeof createTerminerMiniSessionService
>;
