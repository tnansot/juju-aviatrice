// bc-identite, bc-onboarding — schemas Zod partagés entre routers tRPC
import { z } from "zod";

export const zDeviceId = z.string().uuid();
export type DeviceId = z.infer<typeof zDeviceId>;

export const zEtatOnboarding = z.enum([
  "non_demarre",
  "en_cours",
  "complete",
  "saute",
]);
export type EtatOnboarding = z.infer<typeof zEtatOnboarding>;
