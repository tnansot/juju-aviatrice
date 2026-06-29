// bc-contenu — catalogue pédagogique en mémoire
// Source de conception : ADR-015 (convention de stockage du catalogue contenu),
// model-pilier, model-chapitre, model-exercice.
//
// Charge au démarrage les fichiers Markdown de `src/content/**` via le loader et
// expose le catalogue typé. Remplace l'ancien stub codé en dur ; l'interface
// (listerChapitres, obtenirChapitre, obtenirExercice, exercicesDuChapitre) est
// préservée pour ses consommateurs (bc-entrainement, services bc-contenu).
import type { Format } from "../shared/schemas.js";
import {
  type Catalogue,
  type ChapitreCatalogue,
  type ExerciceCatalogue,
  type FicheMethodeCatalogue,
  type PilierCatalogue,
  chargerCatalogue,
} from "./loader.js";

export type {
  ChapitreCatalogue,
  ExerciceCatalogue,
  FicheMethodeCatalogue,
  PilierCatalogue,
  TypePsy,
} from "./loader.js";

const catalogue: Catalogue = chargerCatalogue();

export function listerPiliers(): PilierCatalogue[] {
  return catalogue.piliers;
}

export function listerChapitres(): ChapitreCatalogue[] {
  return catalogue.chapitres;
}

export function obtenirChapitre(
  chapitreId: string,
): ChapitreCatalogue | undefined {
  return catalogue.chapitres.find((c) => c.id === chapitreId);
}

export function obtenirFicheMethode(
  chapitreId: string,
): FicheMethodeCatalogue | undefined {
  return catalogue.fichesMethode.find((f) => f.chapitreId === chapitreId);
}

export function obtenirExercice(
  exerciceId: string,
): ExerciceCatalogue | undefined {
  return catalogue.exercices.find((e) => e.id === exerciceId);
}

/**
 * Exercices d'un chapitre pour un format donné, triés par ordre (usage interne,
 * contient la bonne réponse QCM — ne jamais exposer tel quel au frontend).
 */
export function exercicesDuChapitre(
  chapitreId: string,
  format: Format,
): ExerciceCatalogue[] {
  return catalogue.exercices
    .filter((e) => e.chapitreId === chapitreId && e.format === format)
    .sort((a, b) => a.ordre - b.ordre);
}
