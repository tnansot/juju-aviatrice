// bc-identite — service enregistrement device (ADR-005, ADR-006)
import { TRPCError } from "@trpc/server";
import type { EnregistrerDeviceRepository } from "./enregistrer-device.repository.js";

export function createEnregistrerDeviceService(
  repo: EnregistrerDeviceRepository,
) {
  return {
    async execute(deviceId: string, jetonInvitation: string) {
      const token = repo.findToken(jetonInvitation);
      if (!token || token.utilisations >= token.maxUtilisations) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "INVITE_INVALIDE",
        });
      }

      const existingDevice = repo.findDevice(deviceId);
      if (existingDevice) {
        return { enregistre: true as const, premierAcces: false };
      }

      repo.insertDevice(deviceId);
      repo.incrementTokenUsage(jetonInvitation);

      return { enregistre: true as const, premierAcces: true };
    },
  };
}
