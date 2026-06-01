// bc-contenu — catalogue pédagogique en mémoire (model-pilier, model-chapitre, model-exercice)
//
// STUB M0 : en attendant le loader Markdown défini par ADR-015 (convention de stockage
// du catalogue contenu), le catalogue est ici codé en dur. Le loader et les fichiers
// `src/content/**` sont du ressort de F5 (catalogue scientifique) / F6 (psy) et
// remplaceront ce module sans changer son interface (selectionnerExercices, obtenirExercice).

import type { Format } from "../shared/schemas.js";

export interface ChapitreCatalogue {
  id: string;
  pilierId: "sciences" | "psychotechniques";
  nom: string;
  ordre: number;
  formatsDisponibles: Format[];
}

interface EnonceFlashcard {
  faceQuestion: string;
  faceReponse: string;
}

interface ChoixQcm {
  id: string;
  libelle: string;
}

interface EnonceQcm {
  question: string;
  choix: ChoixQcm[];
}

interface ExerciceFlashcard {
  id: string;
  chapitreId: string;
  format: "flashcard";
  ordre: number;
  enonce: EnonceFlashcard;
  correction: string;
}

interface ExerciceQcm {
  id: string;
  chapitreId: string;
  format: "qcm";
  ordre: number;
  enonce: EnonceQcm;
  bonneReponseId: string;
  correction: string;
}

export type ExerciceCatalogue = ExerciceFlashcard | ExerciceQcm;

const CHAPITRES: ChapitreCatalogue[] = [
  {
    id: "maths-geometrie",
    pilierId: "sciences",
    nom: "Géométrie",
    ordre: 1,
    formatsDisponibles: ["flashcard", "qcm"],
  },
  {
    id: "maths-algebre",
    pilierId: "sciences",
    nom: "Algèbre",
    ordre: 2,
    formatsDisponibles: ["flashcard", "qcm"],
  },
  {
    id: "maths-analyse",
    pilierId: "sciences",
    nom: "Analyse",
    ordre: 3,
    formatsDisponibles: ["flashcard"],
  },
  {
    id: "psy-logique",
    pilierId: "psychotechniques",
    nom: "Logique",
    ordre: 1,
    formatsDisponibles: ["qcm"],
  },
  {
    id: "psy-calcul-mental",
    pilierId: "psychotechniques",
    nom: "Calcul mental",
    ordre: 2,
    formatsDisponibles: ["qcm"],
  },
];

const EXERCICES: ExerciceCatalogue[] = [
  // --- maths-geometrie : flashcards (5) ---
  {
    id: "maths-geometrie-fc-001",
    chapitreId: "maths-geometrie",
    format: "flashcard",
    ordre: 1,
    enonce: {
      faceQuestion:
        "Quelle est la formule de la distance entre deux points A(x₁, y₁) et B(x₂, y₂) ?",
      faceReponse: "AB = √((x₂−x₁)² + (y₂−y₁)²)",
    },
    correction:
      "On applique le théorème de Pythagore dans le repère orthonormé : le segment AB est l'hypoténuse d'un triangle rectangle de côtés (x₂−x₁) et (y₂−y₁).",
  },
  {
    id: "maths-geometrie-fc-002",
    chapitreId: "maths-geometrie",
    format: "flashcard",
    ordre: 2,
    enonce: {
      faceQuestion:
        "Quelles sont les coordonnées du milieu I du segment [AB] avec A(x₁, y₁) et B(x₂, y₂) ?",
      faceReponse: "I((x₁+x₂)/2 ; (y₁+y₂)/2)",
    },
    correction:
      "Le milieu est la moyenne des coordonnées : on additionne les abscisses et on divise par 2, de même pour les ordonnées.",
  },
  {
    id: "maths-geometrie-fc-003",
    chapitreId: "maths-geometrie",
    format: "flashcard",
    ordre: 3,
    enonce: {
      faceQuestion: "Comment calcule-t-on la norme d'un vecteur u(a, b) ?",
      faceReponse: "‖u‖ = √(a² + b²)",
    },
    correction:
      "La norme est la longueur du vecteur. C'est encore Pythagore appliqué aux composantes a et b du vecteur.",
  },
  {
    id: "maths-geometrie-fc-004",
    chapitreId: "maths-geometrie",
    format: "flashcard",
    ordre: 4,
    enonce: {
      faceQuestion:
        "Quel est le produit scalaire de u(x, y) et v(x', y') avec leurs coordonnées ?",
      faceReponse: "u · v = xx' + yy'",
    },
    correction:
      "Dans un repère orthonormé, le produit scalaire est la somme des produits des coordonnées correspondantes. Il sert notamment à tester l'orthogonalité (u · v = 0).",
  },
  {
    id: "maths-geometrie-fc-005",
    chapitreId: "maths-geometrie",
    format: "flashcard",
    ordre: 5,
    enonce: {
      faceQuestion:
        "À quelle condition sur leurs coordonnées deux vecteurs u(x, y) et v(x', y') sont-ils colinéaires ?",
      faceReponse: "xy' − x'y = 0",
    },
    correction:
      "Le déterminant xy' − x'y mesure l'aire du parallélogramme formé par u et v. S'il est nul, les vecteurs sont alignés, donc colinéaires.",
  },
  // --- maths-geometrie : QCM (5) ---
  {
    id: "maths-geometrie-qcm-001",
    chapitreId: "maths-geometrie",
    format: "qcm",
    ordre: 1,
    enonce: {
      question: "Un vecteur a pour coordonnées (3, −4). Quelle est sa norme ?",
      choix: [
        { id: "a", libelle: "7" },
        { id: "b", libelle: "5" },
        { id: "c", libelle: "1" },
        { id: "d", libelle: "25" },
      ],
    },
    bonneReponseId: "b",
    correction:
      "La norme d'un vecteur (a, b) vaut √(a² + b²). Ici √(9 + 16) = √25 = 5. Retiens la formule plutôt que le résultat.",
  },
  {
    id: "maths-geometrie-qcm-002",
    chapitreId: "maths-geometrie",
    format: "qcm",
    ordre: 2,
    enonce: {
      question: "Quel est le milieu du segment [AB] avec A(2, 3) et B(6, 1) ?",
      choix: [
        { id: "a", libelle: "(4, 2)" },
        { id: "b", libelle: "(8, 4)" },
        { id: "c", libelle: "(2, 1)" },
        { id: "d", libelle: "(4, 4)" },
      ],
    },
    bonneReponseId: "a",
    correction:
      "On fait la moyenne des coordonnées : ((2+6)/2 ; (3+1)/2) = (4, 2).",
  },
  {
    id: "maths-geometrie-qcm-003",
    chapitreId: "maths-geometrie",
    format: "qcm",
    ordre: 3,
    enonce: {
      question: "Les vecteurs u(2, 3) et v(4, 6) sont :",
      choix: [
        { id: "a", libelle: "Orthogonaux" },
        { id: "b", libelle: "Colinéaires" },
        { id: "c", libelle: "De même norme" },
        { id: "d", libelle: "Opposés" },
      ],
    },
    bonneReponseId: "b",
    correction:
      "Le déterminant xy' − x'y = 2×6 − 4×3 = 12 − 12 = 0, donc u et v sont colinéaires (v = 2u).",
  },
  {
    id: "maths-geometrie-qcm-004",
    chapitreId: "maths-geometrie",
    format: "qcm",
    ordre: 4,
    enonce: {
      question: "Quel est le produit scalaire de u(1, 2) et v(3, −1) ?",
      choix: [
        { id: "a", libelle: "1" },
        { id: "b", libelle: "5" },
        { id: "c", libelle: "−1" },
        { id: "d", libelle: "3" },
      ],
    },
    bonneReponseId: "a",
    correction: "u · v = 1×3 + 2×(−1) = 3 − 2 = 1.",
  },
  {
    id: "maths-geometrie-qcm-005",
    chapitreId: "maths-geometrie",
    format: "qcm",
    ordre: 5,
    enonce: {
      question: "Quelle est la distance entre A(0, 0) et B(3, 4) ?",
      choix: [
        { id: "a", libelle: "7" },
        { id: "b", libelle: "5" },
        { id: "c", libelle: "12" },
        { id: "d", libelle: "25" },
      ],
    },
    bonneReponseId: "b",
    correction:
      "AB = √(3² + 4²) = √(9 + 16) = √25 = 5. C'est le triangle 3-4-5.",
  },
  // --- maths-algebre : flashcards (3, cas minimum) ---
  {
    id: "maths-algebre-fc-001",
    chapitreId: "maths-algebre",
    format: "flashcard",
    ordre: 1,
    enonce: {
      faceQuestion: "Quelle est la forme canonique d'un trinôme ax² + bx + c ?",
      faceReponse: "a(x − α)² + β avec α = −b/(2a)",
    },
    correction:
      "La forme canonique met en évidence le sommet de la parabole (α, β). On l'obtient en factorisant a puis en complétant le carré.",
  },
  {
    id: "maths-algebre-fc-002",
    chapitreId: "maths-algebre",
    format: "flashcard",
    ordre: 2,
    enonce: {
      faceQuestion: "Quel est le discriminant de ax² + bx + c ?",
      faceReponse: "Δ = b² − 4ac",
    },
    correction:
      "Le discriminant détermine le nombre de racines réelles : deux si Δ > 0, une si Δ = 0, aucune si Δ < 0.",
  },
  {
    id: "maths-algebre-fc-003",
    chapitreId: "maths-algebre",
    format: "flashcard",
    ordre: 3,
    enonce: {
      faceQuestion: "Quand Δ > 0, quelles sont les racines de ax² + bx + c ?",
      faceReponse: "x = (−b ± √Δ) / (2a)",
    },
    correction:
      "On utilise la formule des racines une fois Δ calculé. Les deux signes ± donnent les deux solutions.",
  },
  // --- maths-algebre : QCM (3) ---
  {
    id: "maths-algebre-qcm-001",
    chapitreId: "maths-algebre",
    format: "qcm",
    ordre: 1,
    enonce: {
      question: "Quel est le discriminant de x² − 5x + 6 ?",
      choix: [
        { id: "a", libelle: "1" },
        { id: "b", libelle: "−1" },
        { id: "c", libelle: "49" },
        { id: "d", libelle: "25" },
      ],
    },
    bonneReponseId: "a",
    correction: "Δ = b² − 4ac = (−5)² − 4×1×6 = 25 − 24 = 1.",
  },
  {
    id: "maths-algebre-qcm-002",
    chapitreId: "maths-algebre",
    format: "qcm",
    ordre: 2,
    enonce: {
      question: "Combien de solutions réelles a l'équation x² + x + 1 = 0 ?",
      choix: [
        { id: "a", libelle: "Deux" },
        { id: "b", libelle: "Une" },
        { id: "c", libelle: "Aucune" },
        { id: "d", libelle: "Une infinité" },
      ],
    },
    bonneReponseId: "c",
    correction:
      "Δ = 1 − 4 = −3 < 0 : le trinôme n'a aucune racine réelle, donc l'équation n'a pas de solution dans ℝ.",
  },
  {
    id: "maths-algebre-qcm-003",
    chapitreId: "maths-algebre",
    format: "qcm",
    ordre: 3,
    enonce: {
      question: "Quelles sont les racines de x² − 5x + 6 = 0 ?",
      choix: [
        { id: "a", libelle: "2 et 3" },
        { id: "b", libelle: "−2 et −3" },
        { id: "c", libelle: "1 et 6" },
        { id: "d", libelle: "0 et 5" },
      ],
    },
    bonneReponseId: "a",
    correction:
      "Avec Δ = 1, x = (5 ± 1)/2, soit 3 et 2. On vérifie : leur somme vaut 5 (= −b/a) et leur produit 6 (= c/a).",
  },
  // --- maths-analyse : flashcards (4) ---
  {
    id: "maths-analyse-fc-001",
    chapitreId: "maths-analyse",
    format: "flashcard",
    ordre: 1,
    enonce: {
      faceQuestion: "Quelle est la dérivée de xⁿ ?",
      faceReponse: "n·xⁿ⁻¹",
    },
    correction:
      "C'est la règle de dérivation des puissances : on descend l'exposant en facteur et on le diminue de 1.",
  },
  {
    id: "maths-analyse-fc-002",
    chapitreId: "maths-analyse",
    format: "flashcard",
    ordre: 2,
    enonce: {
      faceQuestion: "Quelle est la dérivée d'un produit u·v ?",
      faceReponse: "u'·v + u·v'",
    },
    correction:
      "La dérivée d'un produit n'est pas le produit des dérivées : on dérive l'un en gardant l'autre, puis on additionne les deux termes.",
  },
  {
    id: "maths-analyse-fc-003",
    chapitreId: "maths-analyse",
    format: "flashcard",
    ordre: 3,
    enonce: {
      faceQuestion: "Que vaut la dérivée de la fonction exponentielle eˣ ?",
      faceReponse: "eˣ",
    },
    correction:
      "L'exponentielle est sa propre dérivée : c'est la fonction qui vérifie f' = f et f(0) = 1.",
  },
  {
    id: "maths-analyse-fc-004",
    chapitreId: "maths-analyse",
    format: "flashcard",
    ordre: 4,
    enonce: {
      faceQuestion:
        "Que signifie f'(a) > 0 sur un intervalle pour la fonction f ?",
      faceReponse: "f est croissante sur cet intervalle",
    },
    correction:
      "Le signe de la dérivée donne le sens de variation : positive → croissante, négative → décroissante.",
  },
  // --- psy-logique : QCM (4) ---
  {
    id: "psy-logique-qcm-001",
    chapitreId: "psy-logique",
    format: "qcm",
    ordre: 1,
    enonce: {
      question: "Quelle est la suite logique : 2, 4, 8, 16, … ?",
      choix: [
        { id: "a", libelle: "20" },
        { id: "b", libelle: "24" },
        { id: "c", libelle: "32" },
        { id: "d", libelle: "18" },
      ],
    },
    bonneReponseId: "c",
    correction:
      "Chaque terme est le double du précédent (×2). Après 16 vient donc 32.",
  },
  {
    id: "psy-logique-qcm-002",
    chapitreId: "psy-logique",
    format: "qcm",
    ordre: 2,
    enonce: {
      question: "Intrus dans la liste : chien, chat, cheval, tournevis ?",
      choix: [
        { id: "a", libelle: "chien" },
        { id: "b", libelle: "chat" },
        { id: "c", libelle: "cheval" },
        { id: "d", libelle: "tournevis" },
      ],
    },
    bonneReponseId: "d",
    correction:
      "Trois mots désignent des animaux, le quatrième est un outil : c'est l'intrus.",
  },
  {
    id: "psy-logique-qcm-003",
    chapitreId: "psy-logique",
    format: "qcm",
    ordre: 3,
    enonce: {
      question: "Si tous les A sont B, et tous les B sont C, alors :",
      choix: [
        { id: "a", libelle: "Tous les A sont C" },
        { id: "b", libelle: "Tous les C sont A" },
        { id: "c", libelle: "Aucun A n'est C" },
        { id: "d", libelle: "On ne peut rien conclure" },
      ],
    },
    bonneReponseId: "a",
    correction:
      "La relation d'inclusion se transmet : A ⊂ B et B ⊂ C entraînent A ⊂ C. L'inverse n'est pas garanti.",
  },
  {
    id: "psy-logique-qcm-004",
    chapitreId: "psy-logique",
    format: "qcm",
    ordre: 4,
    enonce: {
      question: "Quelle est la suite : 1, 1, 2, 3, 5, 8, … ?",
      choix: [
        { id: "a", libelle: "11" },
        { id: "b", libelle: "13" },
        { id: "c", libelle: "12" },
        { id: "d", libelle: "16" },
      ],
    },
    bonneReponseId: "b",
    correction:
      "C'est la suite de Fibonacci : chaque terme est la somme des deux précédents. 5 + 8 = 13.",
  },
  // --- psy-calcul-mental : QCM (4) ---
  {
    id: "psy-calcul-mental-qcm-001",
    chapitreId: "psy-calcul-mental",
    format: "qcm",
    ordre: 1,
    enonce: {
      question: "Combien font 25 × 12 ?",
      choix: [
        { id: "a", libelle: "300" },
        { id: "b", libelle: "250" },
        { id: "c", libelle: "320" },
        { id: "d", libelle: "275" },
      ],
    },
    bonneReponseId: "a",
    correction:
      "Astuce : 25 × 12 = 25 × 4 × 3 = 100 × 3 = 300. Décomposer simplifie le calcul mental.",
  },
  {
    id: "psy-calcul-mental-qcm-002",
    chapitreId: "psy-calcul-mental",
    format: "qcm",
    ordre: 2,
    enonce: {
      question: "Combien font 15 % de 200 ?",
      choix: [
        { id: "a", libelle: "30" },
        { id: "b", libelle: "15" },
        { id: "c", libelle: "45" },
        { id: "d", libelle: "20" },
      ],
    },
    bonneReponseId: "a",
    correction: "10 % de 200 = 20, et 5 % = 10. On additionne : 20 + 10 = 30.",
  },
  {
    id: "psy-calcul-mental-qcm-003",
    chapitreId: "psy-calcul-mental",
    format: "qcm",
    ordre: 3,
    enonce: {
      question: "Combien font 144 ÷ 12 ?",
      choix: [
        { id: "a", libelle: "12" },
        { id: "b", libelle: "14" },
        { id: "c", libelle: "11" },
        { id: "d", libelle: "13" },
      ],
    },
    bonneReponseId: "a",
    correction: "12 × 12 = 144, donc 144 ÷ 12 = 12.",
  },
  {
    id: "psy-calcul-mental-qcm-004",
    chapitreId: "psy-calcul-mental",
    format: "qcm",
    ordre: 4,
    enonce: {
      question: "Combien font 47 + 38 ?",
      choix: [
        { id: "a", libelle: "85" },
        { id: "b", libelle: "75" },
        { id: "c", libelle: "95" },
        { id: "d", libelle: "84" },
      ],
    },
    bonneReponseId: "a",
    correction:
      "Astuce : 47 + 38 = 47 + 40 − 2 = 87 − 2 = 85. Arrondir puis ajuster facilite le calcul.",
  },
];

export function listerChapitres(): ChapitreCatalogue[] {
  return CHAPITRES;
}

export function obtenirChapitre(
  chapitreId: string,
): ChapitreCatalogue | undefined {
  return CHAPITRES.find((c) => c.id === chapitreId);
}

export function obtenirExercice(
  exerciceId: string,
): ExerciceCatalogue | undefined {
  return EXERCICES.find((e) => e.id === exerciceId);
}

/**
 * Exercices d'un chapitre pour un format donné (usage interne, contient la
 * bonne réponse QCM — ne jamais exposer tel quel au frontend).
 */
export function exercicesDuChapitre(
  chapitreId: string,
  format: Format,
): ExerciceCatalogue[] {
  return EXERCICES.filter(
    (e) => e.chapitreId === chapitreId && e.format === format,
  ).sort((a, b) => a.ordre - b.ordre);
}
