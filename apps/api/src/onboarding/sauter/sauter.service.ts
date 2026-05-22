// bc-onboarding — service saut onboarding (bc-onboarding, model-etat-onboarding, spec API onboarding)
import type { EtatOnboarding } from "../../shared/schemas.js";
import type { SauterRepository } from "./sauter.repository.js";

export function createSauterService(repo: SauterRepository) {
  return {
    execute(deviceId: string): { etat: "saute" } {
      const existing = repo.findByDeviceId(deviceId);
      const etatActuel = (existing?.etat ?? "non_demarre") as EtatOnboarding;

      if (etatActuel === "complete" || etatActuel === "saute") {
        return { etat: "saute" };
      }

      repo.upsertSaute(deviceId);
      return { etat: "saute" };
    },
  };
}
