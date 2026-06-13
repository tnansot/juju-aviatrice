---
name: gen-exercices-physique-chimie
description: "Générer ou enrichir les exercices de physique-chimie (flashcards + QCM) du catalogue scientifique de juju-aviatrice, au format Markdown ADR-015. Utiliser quand l'utilisateur dit « générer les exercices de physique-chimie », « contenu physique », « contenu chimie » ou « QCM physique-chimie »."
---

# gen-exercices-physique-chimie — Génération des exercices de physique-chimie

## Contexte

Ce skill produit le contenu pédagogique **physique-chimie** du pilier Sciences de
juju-aviatrice, sous forme de fichiers Markdown chargés au runtime par le loader
du catalogue (cf. [ADR-015](../../../docs/03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md)).

Public : **Juju**, 1ère générale, spécialité physique-chimie. Le contenu cible le
**programme BO de spé physique-chimie 1ère** et doit être directement utile à sa
préparation aux épreuves scientifiques des concours pilote (ENAC EPL/S, cadets).

## Périmètre — 3 chapitres physique-chimie (M0)

| Chapitre (slug) | Thème BO spé physique-chimie 1ère |
|---|---|
| `pc-constitution-matiere` | Quantité de matière : mole, masse molaire, concentration, dilution |
| `pc-ondes-signaux` | Ondes et signaux : période, fréquence, longueur d'onde, lentilles |
| `pc-energie` | Énergie : cinétique, potentielle, travail d'une force, énergie mécanique |

Chaque chapitre doit comporter **≥ 5 flashcards ET ≥ 5 QCM**, en variant les
notions (formules, unités, lois) et les niveaux de difficulté.

## Emplacement et format des fichiers

Racine : `apps/api/src/content/chapitres/<slug>/`. Mêmes conventions que pour les
maths (cf. [ADR-015](../../../docs/03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md)) :

- `index.md` — frontmatter `id`, `pilier_id: sciences`, `nom`,
  `matiere: physique_chimie`, `reference_bo`, `formats_disponibles: [flashcard, qcm]`,
  `etat_initial: debloque`, `ordre`.
- `flashcard-NNN.md` — frontmatter `id`, `format: flashcard`, `ordre` ; sections
  `## Question`, `## Réponse`, `## Correction`.
- `qcm-NNN.md` — frontmatter `id`, `format: qcm`, `ordre` ; sections
  `## Question`, `## Choix` (3 à 5 puces `- [ ]` / `- [x]`, **une seule** `[x]`),
  `## Correction`.

Convention d'`id` : `<slug>-fc-NNN` et `<slug>-qcm-NNN`.

**Soigner les unités** : toujours préciser l'unité SI (mol, mol·L⁻¹, J, Hz, m…)
dans les réponses et corrections.

## Charte de ton (BLOQUANT)

Corrections **pédagogiques et neutres** : raisonnement étape par étape, **jamais**
de « faux », « raté », « mauvais » adressé à l'élève (règle métier bc-contenu §5
et Definition of Done). Expliquer la méthode et l'unité.

## Procédure

1. Pour chaque chapitre, lire l'existant dans `apps/api/src/content/chapitres/<slug>/`.
2. Compléter jusqu'à **≥ 5 flashcards + ≥ 5 QCM** par chapitre.
3. Vérifier la conformité au format (le loader rejette tout fichier malformé).
4. Lancer `pnpm --filter @juju-aviatrice/api test` : le catalogue doit charger
   sans erreur.
5. Relire le diff git (ton, exactitude physique, unités) puis committer
   (`feat(contenu): …`).
