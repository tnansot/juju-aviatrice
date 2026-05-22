// bc-contenu — service liste piliers (bc-contenu, model-pilier, spec API contenu)
export function createListerPiliersService() {
  return {
    execute() {
      return [
        {
          id: "sciences",
          nom: "Sciences",
          description:
            "Maths + physique-chimie de 1ère. Flashcards et QCM pour ancrer les réflexes.",
          chapitres: [],
        },
        {
          id: "psychotechniques",
          nom: "Psychotechniques",
          description:
            "Logique et calcul mental. Fiches méthode pour comprendre, puis exercices pour s'entraîner.",
          chapitres: [],
        },
      ];
    },
  };
}
