// bc-contenu — service flashcard échantillon onboarding (bc-contenu, spec API contenu)
export function createObtenirFlashcardEchantillonService() {
  return {
    execute() {
      return {
        id: "onboarding-fc-001",
        faceQuestion: "Quelle est la dérivée de x² ?",
        faceReponse: "2x",
        correction: "La dérivée de xⁿ est nxⁿ⁻¹. Ici n = 2, donc 2x¹ = 2x.",
      };
    },
  };
}
