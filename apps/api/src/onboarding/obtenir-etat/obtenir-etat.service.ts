// bc-onboarding — service obtention état onboarding (bc-onboarding, model-etat-onboarding)
import type { EtatOnboarding } from "../../shared/schemas.js";
import type { ObtenirEtatRepository } from "./obtenir-etat.repository.js";

export function createObtenirEtatService(repo: ObtenirEtatRepository) {
  return {
    execute(deviceId: string): {
      etat: EtatOnboarding;
      etapeCourante: number | null;
      premierAccesPsyFait: boolean;
    } {
      const row = repo.findByDeviceId(deviceId);
      if (!row) {
        return {
          etat: "non_demarre",
          etapeCourante: null,
          premierAccesPsyFait: false,
        };
      }

      return {
        etat: row.etat as EtatOnboarding,
        etapeCourante: row.etapeCourante,
        premierAccesPsyFait: row.premierAccesPsyFait,
      };
    },
  };
}
