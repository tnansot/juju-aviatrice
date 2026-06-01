// bc-entrainement — types du contrat tRPC entrainement (spec API entrainement.md)
//
// Reproduits à la main pour éviter d'ajouter @trpc/server au frontend ; ils
// reflètent l'énoncé « sûr » renvoyé par demarrerMiniSession (sans bonne réponse QCM).

export type EnonceFlashcard = {
  faceQuestion: string;
  faceReponse: string;
  explication: string;
};

export type EnonceQcm = {
  question: string;
  choix: { id: string; libelle: string }[];
};

export interface Exercice {
  id: string;
  exerciceEnCoursId: string;
  format: "flashcard" | "qcm";
  enonce: EnonceFlashcard | EnonceQcm;
  ordre: number;
}

export interface SessionDemarree {
  sessionId: string;
  miniSessionId: string;
  exercices: Exercice[];
  modeChrono: boolean;
  dureeChrono: number | null;
}

export interface ParamsDemarrage {
  chapitreId: string;
  chapitreNom: string;
  format: "flashcard" | "qcm";
  modeChrono?: boolean;
  dureeChrono?: number;
  nombre?: number;
}

export interface PositionExercice {
  courant: number;
  total: number;
}
