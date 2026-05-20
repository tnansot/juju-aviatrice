// bc-identite — service vérification device (ADR-005, ADR-006)
import type { EtatOnboarding } from "../../shared/schemas.js";
import type { VerifierDeviceRepository } from "./verifier-device.repository.js";

export function createVerifierDeviceService(repo: VerifierDeviceRepository) {
  return {
    async execute(deviceId: string) {
      const device = repo.findDevice(deviceId);
      if (!device) {
        return { valide: false as const };
      }

      repo.updateLastSeen(deviceId);

      // M0 : pas de table onboarding encore — on renvoie "non_demarre" par défaut
      // Sera enrichi par F3 (bc-onboarding)
      const etatOnboarding: EtatOnboarding = "non_demarre";

      return { valide: true as const, etatOnboarding };
    },
  };
}
