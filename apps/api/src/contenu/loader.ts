// bc-contenu — loader Markdown du catalogue pédagogique
// Source de conception : ADR-015 (convention de stockage du catalogue contenu),
// model-pilier, model-chapitre, model-exercice.
//
// Parse au démarrage les fichiers `src/content/**` (frontmatter YAML + corps
// Markdown), valide chaque frontmatter contre les modèles de domaine et expose
// un catalogue typé en mémoire. Toute incohérence lève une erreur explicite
// citant le chemin du fichier fautif.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { z } from "zod";
import {
  type Format,
  type Matiere,
  zFormat,
  zMatiere,
} from "../shared/schemas.js";

export type { Matiere } from "../shared/schemas.js";

const CONTENT_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../content",
);

export type TypologiePsy = "serie" | "analogie" | "syllogisme" | "deductif";

export interface PilierCatalogue {
  id: string;
  nom: string;
  description: string;
}

export interface ChapitreCatalogue {
  id: string;
  pilierId: string;
  nom: string;
  matiere: Matiere;
  referenceBo: string | null;
  formatsDisponibles: Format[];
  etatInitial: "debloque" | "verrouille";
  ordre: number;
  ficheMethodeDisponible: boolean;
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

export interface ExerciceFlashcard {
  id: string;
  chapitreId: string;
  format: "flashcard";
  ordre: number;
  enonce: EnonceFlashcard;
  correction: string;
  typologiePsy: TypologiePsy | null;
}

export interface ExerciceQcm {
  id: string;
  chapitreId: string;
  format: "qcm";
  ordre: number;
  enonce: EnonceQcm;
  bonneReponseId: string;
  correction: string;
  typologiePsy: TypologiePsy | null;
}

export type ExerciceCatalogue = ExerciceFlashcard | ExerciceQcm;

export type TypePsy = "logique" | "calcul_mental";

export interface FicheMethodeCatalogue {
  id: string;
  chapitreId: string;
  typePsy: TypePsy;
  cestQuoi: string;
  ceQueCaEvalue: string[];
  commentAborder: string[];
}

export interface Catalogue {
  piliers: PilierCatalogue[];
  chapitres: ChapitreCatalogue[];
  exercices: ExerciceCatalogue[];
  fichesMethode: FicheMethodeCatalogue[];
}

// --- Schémas de validation des frontmatter (alignés sur les modèles domaine) ---

const zPilierFrontmatter = z.object({
  id: z.string().min(1),
  nom: z.string().min(1),
  description: z.string().min(1),
});

const zChapitreFrontmatter = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  pilier_id: z.string().min(1),
  nom: z.string().min(1),
  matiere: zMatiere,
  reference_bo: z.string().min(1).optional(),
  formats_disponibles: z.array(zFormat).min(1),
  etat_initial: z.enum(["debloque", "verrouille"]),
  ordre: z.number().int().min(1),
});

const zExerciceFrontmatter = z.object({
  id: z.string().min(1),
  format: zFormat,
  ordre: z.number().int().min(1),
  typologie_psy: z
    .enum(["serie", "analogie", "syllogisme", "deductif"])
    .optional(),
});

const zFicheMethodeFrontmatter = z.object({
  id: z.string().min(1),
  chapitre_id: z.string().min(1),
  type_psy: z.enum(["logique", "calcul_mental"]),
});

// --- Helpers de parsing du corps Markdown ---

/** Normalise un titre de section (minuscule, sans accent) pour le repérage. */
function normaliser(titre: string): string {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

/** Découpe le corps Markdown en sections `## Titre` → contenu. */
function parserSections(corps: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let sectionCourante: string | null = null;
  let tampon: string[] = [];
  const vider = () => {
    if (sectionCourante) sections[sectionCourante] = tampon.join("\n").trim();
    tampon = [];
  };
  for (const ligne of corps.split("\n")) {
    const titre = ligne.match(/^##\s+(.+?)\s*$/);
    if (titre) {
      vider();
      sectionCourante = normaliser(titre[1]);
    } else if (sectionCourante) {
      tampon.push(ligne);
    }
  }
  vider();
  return sections;
}

const ID_CHOIX = "abcdefgh";

/** Extrait les choix QCM (`- [ ]` / `- [x]`) et l'id de la bonne réponse. */
function parserChoix(brut: string, chemin: string) {
  const choix: ChoixQcm[] = [];
  let bonneReponseId: string | null = null;
  let index = 0;
  for (const ligne of brut.split("\n")) {
    const m = ligne.match(/^-\s*\[([ xX])\]\s*(.+?)\s*$/);
    if (!m) continue;
    const id = ID_CHOIX[index++];
    choix.push({ id, libelle: m[2] });
    if (m[1].toLowerCase() === "x") {
      if (bonneReponseId !== null) {
        throw new Error(
          `Exercice QCM invalide (${chemin}) : plusieurs bonnes réponses marquées [x].`,
        );
      }
      bonneReponseId = id;
    }
  }
  if (choix.length < 3 || choix.length > 5) {
    throw new Error(
      `Exercice QCM invalide (${chemin}) : ${choix.length} choix (attendu 3 à 5).`,
    );
  }
  if (bonneReponseId === null) {
    throw new Error(
      `Exercice QCM invalide (${chemin}) : aucune bonne réponse marquée [x].`,
    );
  }
  return { choix, bonneReponseId };
}

/** Extrait les puces (`- texte`) d'un bloc Markdown, dans l'ordre. */
function parserPuces(brut: string): string[] {
  const puces: string[] = [];
  for (const ligne of brut.split("\n")) {
    const m = ligne.match(/^-\s+(.+?)\s*$/);
    if (m) puces.push(m[1]);
  }
  return puces;
}

/** Formate une erreur de validation Zod avec le chemin du fichier fautif. */
function erreurFrontmatter(chemin: string, erreur: z.ZodError): Error {
  const details = erreur.issues
    .map((i) => `${i.path.join(".") || "(racine)"} : ${i.message}`)
    .join(" ; ");
  return new Error(`Frontmatter invalide (${chemin}) : ${details}`);
}

// --- Chargement des piliers ---

function chargerPiliers(dir: string): PilierCatalogue[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((fichier) => {
      const chemin = join(dir, fichier);
      const { data } = matter(readFileSync(chemin, "utf-8"));
      const parsed = zPilierFrontmatter.safeParse(data);
      if (!parsed.success) throw erreurFrontmatter(chemin, parsed.error);
      return parsed.data;
    });
}

// --- Chargement des chapitres et exercices ---

function chargerExercice(
  chemin: string,
  chapitreId: string,
  formatsAutorises: Format[],
): ExerciceCatalogue {
  const { data, content } = matter(readFileSync(chemin, "utf-8"));
  const parsed = zExerciceFrontmatter.safeParse(data);
  if (!parsed.success) throw erreurFrontmatter(chemin, parsed.error);
  const fm = parsed.data;

  if (!formatsAutorises.includes(fm.format)) {
    throw new Error(
      `Exercice invalide (${chemin}) : format « ${fm.format} » absent des formats_disponibles du chapitre.`,
    );
  }

  const sections = parserSections(content);
  const typologiePsy = fm.typologie_psy ?? null;

  if (fm.format === "flashcard") {
    const { question, reponse, correction } = sections;
    if (!question || !reponse || !correction) {
      throw new Error(
        `Flashcard invalide (${chemin}) : sections ## Question, ## Réponse et ## Correction obligatoires.`,
      );
    }
    return {
      id: fm.id,
      chapitreId,
      format: "flashcard",
      ordre: fm.ordre,
      enonce: { faceQuestion: question, faceReponse: reponse },
      correction,
      typologiePsy,
    };
  }

  const { question, choix, correction } = sections;
  if (!question || !choix || !correction) {
    throw new Error(
      `QCM invalide (${chemin}) : sections ## Question, ## Choix et ## Correction obligatoires.`,
    );
  }
  const { choix: choixParses, bonneReponseId } = parserChoix(choix, chemin);
  return {
    id: fm.id,
    chapitreId,
    format: "qcm",
    ordre: fm.ordre,
    enonce: { question, choix: choixParses },
    bonneReponseId,
    correction,
    typologiePsy,
  };
}

/** Parse une fiche méthode psy (frontmatter + 3 sections), cf. model-fiche-methode. */
function chargerFicheMethode(
  chemin: string,
  chapitreId: string,
): FicheMethodeCatalogue {
  const { data, content } = matter(readFileSync(chemin, "utf-8"));
  const parsed = zFicheMethodeFrontmatter.safeParse(data);
  if (!parsed.success) throw erreurFrontmatter(chemin, parsed.error);
  const fm = parsed.data;

  if (fm.chapitre_id !== chapitreId) {
    throw new Error(
      `Fiche méthode invalide (${chemin}) : chapitre_id « ${fm.chapitre_id} » ne correspond pas au chapitre « ${chapitreId} ».`,
    );
  }

  const sections = parserSections(content);
  const cestQuoi = sections["c'est quoi ?"];
  const ceQueCaEvalue = parserPuces(sections["ce que ca evalue"] ?? "");
  const commentAborder = parserPuces(sections["comment l'aborder"] ?? "");

  if (!cestQuoi || ceQueCaEvalue.length === 0 || commentAborder.length === 0) {
    throw new Error(
      `Fiche méthode invalide (${chemin}) : sections ## C'est quoi ?, ## Ce que ça évalue et ## Comment l'aborder obligatoires.`,
    );
  }
  for (const [nom, puces] of [
    ["Ce que ça évalue", ceQueCaEvalue],
    ["Comment l'aborder", commentAborder],
  ] as const) {
    if (puces.length < 3 || puces.length > 5) {
      throw new Error(
        `Fiche méthode invalide (${chemin}) : « ${nom} » doit compter 3 à 5 puces (trouvé ${puces.length}).`,
      );
    }
  }

  return {
    id: fm.id,
    chapitreId,
    typePsy: fm.type_psy,
    cestQuoi,
    ceQueCaEvalue,
    commentAborder,
  };
}

function chargerChapitres(dir: string): {
  chapitres: ChapitreCatalogue[];
  exercices: ExerciceCatalogue[];
  fichesMethode: FicheMethodeCatalogue[];
} {
  const chapitres: ChapitreCatalogue[] = [];
  const exercices: ExerciceCatalogue[] = [];
  const fichesMethode: FicheMethodeCatalogue[] = [];

  const sousDirs = readdirSync(dir)
    .filter((nom) => statSync(join(dir, nom)).isDirectory())
    .sort();

  for (const slug of sousDirs) {
    const chapitreDir = join(dir, slug);
    const cheminIndex = join(chapitreDir, "index.md");
    const { data } = matter(readFileSync(cheminIndex, "utf-8"));
    const parsed = zChapitreFrontmatter.safeParse(data);
    if (!parsed.success) throw erreurFrontmatter(cheminIndex, parsed.error);
    const fm = parsed.data;

    const cheminFiche = join(chapitreDir, "fiche-methode.md");
    const ficheMethodeDisponible = existsSync(cheminFiche);

    chapitres.push({
      id: fm.id,
      pilierId: fm.pilier_id,
      nom: fm.nom,
      matiere: fm.matiere,
      referenceBo: fm.reference_bo ?? null,
      formatsDisponibles: fm.formats_disponibles,
      etatInitial: fm.etat_initial,
      ordre: fm.ordre,
      ficheMethodeDisponible,
    });

    if (ficheMethodeDisponible) {
      fichesMethode.push(chargerFicheMethode(cheminFiche, fm.id));
    }

    const fichiersExercices = readdirSync(chapitreDir)
      .filter((f) => /^(flashcard|qcm)-.*\.md$/.test(f))
      .sort();
    for (const fichier of fichiersExercices) {
      exercices.push(
        chargerExercice(
          join(chapitreDir, fichier),
          fm.id,
          fm.formats_disponibles,
        ),
      );
    }
  }

  return { chapitres, exercices, fichesMethode };
}

/**
 * Charge l'intégralité du catalogue depuis `rootDir` (défaut : `src/content`).
 * Lève une erreur explicite si un fichier est malformé ou si une invariante de
 * domaine est violée (pilier vide, chapitre sans exercice).
 */
export function chargerCatalogue(rootDir: string = CONTENT_DIR): Catalogue {
  const piliers = chargerPiliers(join(rootDir, "piliers"));
  const { chapitres, exercices, fichesMethode } = chargerChapitres(
    join(rootDir, "chapitres"),
  );

  for (const chapitre of chapitres) {
    if (!piliers.some((p) => p.id === chapitre.pilierId)) {
      throw new Error(
        `Catalogue : le chapitre « ${chapitre.id} » référence un pilier inconnu « ${chapitre.pilierId} ».`,
      );
    }
    if (!exercices.some((e) => e.chapitreId === chapitre.id)) {
      throw new Error(
        `Catalogue : le chapitre « ${chapitre.id} » ne contient aucun exercice (règle métier : ≥ 1).`,
      );
    }
  }
  for (const pilier of piliers) {
    if (!chapitres.some((c) => c.pilierId === pilier.id)) {
      throw new Error(
        `Catalogue : le pilier « ${pilier.id} » ne contient aucun chapitre (règle métier : ≥ 1).`,
      );
    }
  }

  return { piliers, chapitres, exercices, fichesMethode };
}
