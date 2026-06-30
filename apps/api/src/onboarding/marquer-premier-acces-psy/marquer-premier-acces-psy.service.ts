// bc-onboarding — service premier accès psy (bc-onboarding, model-etat-onboarding, spec API onboarding)
import type { MarquerPremierAccesPsyRepository } from "./marquer-premier-acces-psy.repository.js";

// Message d'accueil psy unique (J3 étape 1), aligné charte de ton. Repris du
// contenu rédactionnel de l'écran FO-10 Psy Bienvenue (spec-ecran-psy-bienvenue).
const MESSAGE_ACCUEIL_PSY =
  "Deux types de tests utilisés dans les sélections pilote. On commence par comprendre, puis on s'entraîne.";

export function createMarquerPremierAccesPsyService(
  repo: MarquerPremierAccesPsyRepository,
) {
  return {
    execute(deviceId: string): {
      premierAccesPsyFait: true;
      messageAccueil: string;
    } {
      // Idempotent : si le premier accès est déjà marqué, on ne réécrit pas. Le
      // frontend décide de l'affichage de FO-10 d'après obtenirEtat.premierAccesPsyFait ;
      // le message est donc renvoyé systématiquement pour respecter le contrat.
      const existing = repo.findByDeviceId(deviceId);
      if (!existing?.premierAccesPsyFait) {
        repo.marquer(deviceId);
      }
      return { premierAccesPsyFait: true, messageAccueil: MESSAGE_ACCUEIL_PSY };
    },
  };
}
