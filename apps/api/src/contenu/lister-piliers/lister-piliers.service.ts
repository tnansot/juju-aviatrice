// bc-contenu — service liste piliers (bc-contenu, model-pilier, model-chapitre)
import { listerChapitres } from "../catalogue.js";

const PILIERS = [
  {
    id: "sciences" as const,
    nom: "Sciences",
    description:
      "Maths + physique-chimie de 1ère. Flashcards et QCM pour ancrer les réflexes.",
  },
  {
    id: "psychotechniques" as const,
    nom: "Psychotechniques",
    description:
      "Logique et calcul mental. Fiches méthode pour comprendre, puis exercices pour s'entraîner.",
  },
];

export function createListerPiliersService() {
  return {
    execute() {
      const chapitres = listerChapitres();
      return PILIERS.map((pilier) => ({
        ...pilier,
        chapitres: chapitres
          .filter((c) => c.pilierId === pilier.id)
          .sort((a, b) => a.ordre - b.ordre)
          .map((c) => ({ id: c.id, nom: c.nom, ordre: c.ordre })),
      }));
    },
  };
}
