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

      const onboardingRow = repo.findOnboardingState(deviceId);
      const etatOnboarding: EtatOnboarding =
        (onboardingRow?.etat as EtatOnboarding) ?? "non_demarre";

      return { valide: true as const, etatOnboarding };
    },
  };
}
