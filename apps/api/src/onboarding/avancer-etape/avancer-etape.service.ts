// bc-onboarding — service avancement étape onboarding (bc-onboarding, model-etat-onboarding, spec API onboarding)
import type { EtatOnboarding } from "../../shared/schemas.js";
import type { AvancerEtapeRepository } from "./avancer-etape.repository.js";

export function createAvancerEtapeService(repo: AvancerEtapeRepository) {
  return {
    execute(
      deviceId: string,
      etapeCompletee: number,
    ): { etat: EtatOnboarding; etapeSuivante: number | null } {
      const existing = repo.findByDeviceId(deviceId);
      const etatActuel = (existing?.etat ?? "non_demarre") as EtatOnboarding;

      if (etatActuel === "complete" || etatActuel === "saute") {
        return { etat: etatActuel, etapeSuivante: null };
      }

      if (etapeCompletee === 1) {
        repo.upsert(deviceId, "en_cours", 2);
        return { etat: "en_cours", etapeSuivante: 2 };
      }

      if (etapeCompletee === 2) {
        repo.upsert(deviceId, "en_cours", 3);
        return { etat: "en_cours", etapeSuivante: 3 };
      }

      if (etapeCompletee === 3) {
        repo.upsert(deviceId, "complete", null);
        return { etat: "complete", etapeSuivante: null };
      }

      return {
        etat: etatActuel,
        etapeSuivante: existing?.etapeCourante ?? null,
      };
    },
  };
}
