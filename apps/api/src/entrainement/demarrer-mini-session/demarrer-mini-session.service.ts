// bc-entrainement — service démarrage mini-session (bc-entrainement, model-session)
//
// Crée (ou réutilise) la session du device, crée la mini-session, charge les
// exercices via bc-contenu (appel in-process) et renvoie un énoncé sûr pour le
// frontend (la bonne réponse QCM n'est jamais transmise).
import { TRPCError } from "@trpc/server";
import {
  type ExerciceCatalogue,
  obtenirChapitre,
} from "../../contenu/catalogue.js";
import type { ChargerExercicesService } from "../../contenu/charger-exercices/charger-exercices.service.js";
import type { Format } from "../../shared/schemas.js";
import type { DemarrerMiniSessionRepository } from "./demarrer-mini-session.repository.js";

type EnonceFrontend =
  | { faceQuestion: string; faceReponse: string; explication: string }
  | { question: string; choix: { id: string; libelle: string }[] };

export interface ExerciceFrontend {
  id: string;
  exerciceEnCoursId: string;
  format: Format;
  enonce: EnonceFrontend;
  ordre: number;
}

export interface DemarrerMiniSessionResult {
  sessionId: string;
  miniSessionId: string;
  exercices: ExerciceFrontend[];
  modeChrono: boolean;
  dureeChrono: number | null;
}

export interface DemarrerMiniSessionInput {
  chapitreId: string;
  format: Format;
  modeChrono: boolean;
  dureeChrono?: number;
  nombre: number;
}

// Énoncé sûr pour le frontend : on retire la bonne réponse des QCM.
function enonceSur(ex: ExerciceCatalogue): EnonceFrontend {
  if (ex.format === "flashcard") {
    return {
      faceQuestion: ex.enonce.faceQuestion,
      faceReponse: ex.enonce.faceReponse,
      explication: ex.correction,
    };
  }
  return {
    question: ex.enonce.question,
    choix: ex.enonce.choix.map((c) => ({ id: c.id, libelle: c.libelle })),
  };
}

export function createDemarrerMiniSessionService(
  repo: DemarrerMiniSessionRepository,
  chargerExercices: ChargerExercicesService,
) {
  return {
    execute(
      deviceId: string,
      input: DemarrerMiniSessionInput,
    ): DemarrerMiniSessionResult {
      const chapitre = obtenirChapitre(input.chapitreId);
      if (!chapitre) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      // Vérification du déblocage du chapitre : déléguée à bc-progression (F8).
      // En attendant, tous les chapitres du catalogue stub sont considérés débloqués.

      const exercices = chargerExercices.execute(
        input.chapitreId,
        input.format,
        input.nombre,
      );
      if (exercices.length < 3) {
        // Contenu insuffisant pour une mini-session (3 minimum).
        throw new TRPCError({ code: "NOT_FOUND", message: "NON_TROUVE" });
      }

      const sessionExistante = repo.trouverSessionEnCours(deviceId);
      const sessionId = sessionExistante?.id ?? repo.creerSession(deviceId);

      const dureeChrono = input.modeChrono ? (input.dureeChrono ?? null) : null;
      const miniSessionId = repo.creerMiniSession({
        sessionId,
        chapitreId: input.chapitreId,
        format: input.format,
        modeChrono: input.modeChrono,
        dureeChrono,
      });

      const instances = repo.creerExercicesEnCours(
        miniSessionId,
        exercices.map((ex, index) => ({
          exerciceId: ex.id,
          ordre: index + 1,
        })),
      );

      const exercicesFrontend: ExerciceFrontend[] = exercices.map(
        (ex, index) => ({
          id: ex.id,
          exerciceEnCoursId: instances[index].exerciceEnCoursId,
          format: ex.format,
          enonce: enonceSur(ex),
          ordre: index + 1,
        }),
      );

      return {
        sessionId,
        miniSessionId,
        exercices: exercicesFrontend,
        modeChrono: input.modeChrono,
        dureeChrono,
      };
    },
  };
}

export type DemarrerMiniSessionService = ReturnType<
  typeof createDemarrerMiniSessionService
>;
