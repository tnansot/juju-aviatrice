import type { Format } from "../../shared/schemas.js";
// bc-contenu — service de sélection d'exercices d'un chapitre (bc-contenu, model-exercice)
//
// Fournit à bc-entrainement (appel in-process) les exercices d'une mini-session.
// Sélectionne 3 à 5 exercices du chapitre/format demandé, mélangés aléatoirement.
import { type ExerciceCatalogue, exercicesDuChapitre } from "../catalogue.js";

export const NOMBRE_MIN_EXERCICES = 3;
export const NOMBRE_MAX_EXERCICES = 5;

type Shuffle = <T>(items: T[]) => T[];

function melangeAleatoire<T>(items: T[]): T[] {
  const copie = [...items];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

export function createChargerExercicesService(
  shuffle: Shuffle = melangeAleatoire,
) {
  return {
    /**
     * Sélectionne entre NOMBRE_MIN et `nombre` exercices du chapitre/format.
     * Le nombre demandé est borné par le contenu disponible : si le chapitre
     * compte exactement 3 exercices, 3 sont retournés (minimum respecté).
     */
    execute(
      chapitreId: string,
      format: Format,
      nombre: number,
    ): ExerciceCatalogue[] {
      const disponibles = exercicesDuChapitre(chapitreId, format);
      const cible = Math.min(
        Math.max(nombre, NOMBRE_MIN_EXERCICES),
        NOMBRE_MAX_EXERCICES,
        disponibles.length,
      );
      return shuffle(disponibles).slice(0, cible);
    },
  };
}

export type ChargerExercicesService = ReturnType<
  typeof createChargerExercicesService
>;
