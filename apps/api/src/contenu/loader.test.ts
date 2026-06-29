// bc-contenu — tests du loader Markdown (ADR-010, ADR-015)
//
// Construit des arborescences de contenu dans un répertoire temporaire puis
// vérifie le parsing, l'extraction de la bonne réponse QCM et les erreurs
// explicites sur fichier malformé.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { chargerCatalogue } from "./loader.js";

let racine: string;

beforeEach(() => {
  racine = mkdtempSync(join(tmpdir(), "catalogue-"));
});

afterEach(() => {
  rmSync(racine, { recursive: true, force: true });
});

/** Écrit un fichier (et ses répertoires parents) sous la racine temporaire. */
function ecrire(cheminRelatif: string, contenu: string) {
  const chemin = join(racine, cheminRelatif);
  mkdirSync(dirname(chemin), { recursive: true });
  writeFileSync(chemin, contenu, "utf-8");
}

const PILIER_VALIDE = `---
id: sciences
nom: Sciences
description: Maths de 1ère.
---
`;

const CHAPITRE_VALIDE = `---
id: maths-suites
pilier_id: sciences
nom: Suites numériques
matiere: maths
reference_bo: "Spé maths 1ère — Suites"
formats_disponibles: [flashcard, qcm]
etat_initial: debloque
ordre: 1
---
`;

const FLASHCARD_VALIDE = `---
id: maths-suites-fc-001
format: flashcard
ordre: 1
---

## Question

Formule du terme général d'une suite arithmétique ?

## Réponse

u_n = u_0 + n × r

## Correction

On ajoute la raison r autant de fois que le rang n.
`;

const QCM_VALIDE = `---
id: maths-suites-qcm-001
format: qcm
ordre: 1
---

## Question

La suite u_n = 3n + 2 est :

## Choix

- [ ] Géométrique de raison 3
- [x] Arithmétique de raison 3
- [ ] Constante

## Correction

u_(n+1) − u_n = 3, différence constante : arithmétique.
`;

const FICHE_VALIDE = `---
id: maths-suites-fiche
chapitre_id: maths-suites
type_psy: logique
---

## C'est quoi ?

Un test de logique évalue ta capacité à trouver une règle.

## Ce que ça évalue

- Raisonnement inductif
- Reconnaissance de patterns
- Capacité d'abstraction

## Comment l'aborder

- Cherche les écarts entre éléments
- Teste arithmétique ou géométrique
- Passe et reviens si tu bloques
`;

/** Pose un catalogue minimal valide ; les overrides remplacent un fichier. */
function poserCatalogueValide(overrides: Record<string, string> = {}) {
  const fichiers: Record<string, string> = {
    "piliers/sciences.md": PILIER_VALIDE,
    "chapitres/maths-suites/index.md": CHAPITRE_VALIDE,
    "chapitres/maths-suites/flashcard-001.md": FLASHCARD_VALIDE,
    "chapitres/maths-suites/qcm-001.md": QCM_VALIDE,
    ...overrides,
  };
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    ecrire(chemin, contenu);
  }
}

describe("chargerCatalogue — cas nominal", () => {
  it("parse piliers, chapitres et exercices sans erreur", () => {
    poserCatalogueValide();

    const catalogue = chargerCatalogue(racine);

    expect(catalogue.piliers).toHaveLength(1);
    expect(catalogue.piliers[0]).toMatchObject({
      id: "sciences",
      nom: "Sciences",
      description: "Maths de 1ère.",
    });
    expect(catalogue.chapitres).toHaveLength(1);
    expect(catalogue.exercices).toHaveLength(2);
  });

  it("expose les métadonnées de chapitre conformes au modèle", () => {
    poserCatalogueValide();

    const [chapitre] = chargerCatalogue(racine).chapitres;

    expect(chapitre).toMatchObject({
      id: "maths-suites",
      pilierId: "sciences",
      nom: "Suites numériques",
      matiere: "maths",
      referenceBo: "Spé maths 1ère — Suites",
      formatsDisponibles: ["flashcard", "qcm"],
      etatInitial: "debloque",
      ordre: 1,
      ficheMethodeDisponible: false,
    });
  });

  it("parse une flashcard (faces + correction)", () => {
    poserCatalogueValide();

    const flashcard = chargerCatalogue(racine).exercices.find(
      (e) => e.format === "flashcard",
    );

    expect(flashcard).toMatchObject({
      id: "maths-suites-fc-001",
      chapitreId: "maths-suites",
      format: "flashcard",
      enonce: {
        faceQuestion: "Formule du terme général d'une suite arithmétique ?",
        faceReponse: "u_n = u_0 + n × r",
      },
      typologiePsy: null,
    });
  });

  it("extrait la bonne réponse QCM depuis [x] sans l'exposer dans les choix", () => {
    poserCatalogueValide();

    const qcm = chargerCatalogue(racine).exercices.find(
      (e) => e.format === "qcm",
    );

    expect(qcm).toMatchObject({ format: "qcm", bonneReponseId: "b" });
    if (qcm?.format === "qcm") {
      expect(qcm.enonce.choix).toEqual([
        { id: "a", libelle: "Géométrique de raison 3" },
        { id: "b", libelle: "Arithmétique de raison 3" },
        { id: "c", libelle: "Constante" },
      ]);
      // Aucun champ est_correct ne fuit dans les choix.
      for (const choix of qcm.enonce.choix) {
        expect(choix).not.toHaveProperty("est_correct");
      }
    }
  });

  it("détecte la présence d'une fiche méthode", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/fiche-methode.md": FICHE_VALIDE,
    });

    const [chapitre] = chargerCatalogue(racine).chapitres;

    expect(chapitre.ficheMethodeDisponible).toBe(true);
  });

  it("parse une fiche méthode (3 sections + puces)", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/fiche-methode.md": FICHE_VALIDE,
    });

    const { fichesMethode } = chargerCatalogue(racine);

    expect(fichesMethode).toHaveLength(1);
    expect(fichesMethode[0]).toMatchObject({
      id: "maths-suites-fiche",
      chapitreId: "maths-suites",
      typePsy: "logique",
      cestQuoi: "Un test de logique évalue ta capacité à trouver une règle.",
      ceQueCaEvalue: [
        "Raisonnement inductif",
        "Reconnaissance de patterns",
        "Capacité d'abstraction",
      ],
    });
    expect(fichesMethode[0].commentAborder).toHaveLength(3);
  });

  it("n'expose aucune fiche méthode si aucun fichier n'est présent", () => {
    poserCatalogueValide();

    expect(chargerCatalogue(racine).fichesMethode).toHaveLength(0);
  });
});

describe("chargerCatalogue — erreurs explicites", () => {
  it("lève une erreur citant le fichier sur frontmatter de chapitre invalide", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/index.md": `---
id: maths-suites
pilier_id: sciences
nom: Suites
formats_disponibles: [flashcard, qcm]
etat_initial: debloque
ordre: 1
---
`, // matiere manquante
    });

    expect(() => chargerCatalogue(racine)).toThrow(
      /maths-suites\/index\.md.*matiere/s,
    );
  });

  it("lève une erreur sur un QCM sans bonne réponse marquée", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/qcm-001.md": `---
id: q1
format: qcm
ordre: 1
---

## Question

Q ?

## Choix

- [ ] A
- [ ] B
- [ ] C

## Correction

C.
`,
    });

    expect(() => chargerCatalogue(racine)).toThrow(
      /qcm-001\.md.*bonne réponse/s,
    );
  });

  it("lève une erreur sur une flashcard à section manquante", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/flashcard-001.md": `---
id: f1
format: flashcard
ordre: 1
---

## Question

Q ?

## Correction

(pas de réponse)
`,
    });

    expect(() => chargerCatalogue(racine)).toThrow(/flashcard-001\.md/);
  });

  it("lève une erreur sur une fiche méthode avec trop peu de puces", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/fiche-methode.md": `---
id: maths-suites-fiche
chapitre_id: maths-suites
type_psy: logique
---

## C'est quoi ?

Texte.

## Ce que ça évalue

- Une seule puce

## Comment l'aborder

- A
- B
- C
`,
    });

    expect(() => chargerCatalogue(racine)).toThrow(
      /fiche-methode\.md.*3 à 5 puces/s,
    );
  });

  it("lève une erreur si le chapitre_id de la fiche ne correspond pas", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/fiche-methode.md": `---
id: x-fiche
chapitre_id: autre-chapitre
type_psy: logique
---

## C'est quoi ?

Texte.

## Ce que ça évalue

- A
- B
- C

## Comment l'aborder

- A
- B
- C
`,
    });

    expect(() => chargerCatalogue(racine)).toThrow(
      /fiche-methode\.md.*ne correspond pas/s,
    );
  });

  it("lève une erreur si un format d'exercice n'est pas déclaré au chapitre", () => {
    poserCatalogueValide({
      "chapitres/maths-suites/index.md": `---
id: maths-suites
pilier_id: sciences
nom: Suites
matiere: maths
formats_disponibles: [flashcard]
etat_initial: debloque
ordre: 1
---
`, // qcm absent des formats déclarés alors qu'un qcm existe
    });

    expect(() => chargerCatalogue(racine)).toThrow(/qcm-001\.md.*format/s);
  });

  it("lève une erreur si un pilier n'a aucun chapitre", () => {
    poserCatalogueValide({
      "piliers/psychotechniques.md":
        "---\nid: psychotechniques\nnom: Psy\ndescription: Tests.\n---\n",
    });

    expect(() => chargerCatalogue(racine)).toThrow(
      /psychotechniques.*aucun chapitre/s,
    );
  });
});
