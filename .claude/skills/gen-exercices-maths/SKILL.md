---
name: gen-exercices-maths
description: "Générer ou enrichir les exercices de maths (flashcards + QCM) du catalogue scientifique de juju-aviatrice, au format Markdown ADR-015. Utiliser quand l'utilisateur dit « générer les exercices de maths », « contenu maths », « flashcards maths » ou « QCM maths »."
---

# gen-exercices-maths — Génération des exercices de maths

## Contexte

Ce skill produit le contenu pédagogique **maths** du pilier Sciences de
juju-aviatrice, sous forme de fichiers Markdown chargés au runtime par le loader
du catalogue (cf. [ADR-015](../../../docs/03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md)).

Public : **Juju**, 1ère générale, spécialité maths. Le contenu cible le
**programme BO de spé maths 1ère** et doit être directement utile à sa
préparation aux épreuves scientifiques des concours pilote (ENAC EPL/S, cadets).

## Périmètre — 3 chapitres maths (M0)

| Chapitre (slug) | Thème BO spé maths 1ère |
|---|---|
| `maths-algebre` | Second degré : forme canonique, discriminant, racines, signe du trinôme |
| `maths-analyse` | Dérivation : dérivées usuelles, opérations, sens de variation, tangente |
| `maths-geometrie` | Géométrie repérée : distance, milieu, vecteurs, produit scalaire, colinéarité |

Chaque chapitre doit comporter **≥ 5 flashcards ET ≥ 5 QCM**.

## Emplacement et format des fichiers

Racine : `apps/api/src/content/chapitres/<slug>/`.

- `index.md` — métadonnées du chapitre (frontmatter aligné sur model-chapitre).
- `flashcard-NNN.md` — une flashcard par fichier.
- `qcm-NNN.md` — un QCM par fichier.

Respecter **strictement** la convention de frontmatter et de sections de
l'ADR-015 :

- **Chapitre** `index.md` : `id`, `pilier_id: sciences`, `nom`, `matiere: maths`,
  `reference_bo`, `formats_disponibles: [flashcard, qcm]`, `etat_initial: debloque`,
  `ordre`.
- **Flashcard** : frontmatter `id`, `format: flashcard`, `ordre` ; corps avec
  sections `## Question`, `## Réponse`, `## Correction`.
- **QCM** : frontmatter `id`, `format: qcm`, `ordre` ; corps avec sections
  `## Question`, `## Choix` (3 à 5 puces `- [ ]` / `- [x]`, **une seule** `[x]`),
  `## Correction`.

Convention d'`id` : `<slug>-fc-NNN` (flashcard) et `<slug>-qcm-NNN` (QCM).

## Charte de ton (BLOQUANT)

Les corrections sont **pédagogiques et neutres** :

- Détailler le **raisonnement étape par étape**, pas seulement donner la réponse.
- **Jamais** de vocabulaire négatif ou culpabilisant : aucun « faux », « raté »,
  « mauvais », « erreur » adressé à l'élève (cf. règle métier bc-contenu §5 et la
  Definition of Done).
- Privilégier l'explication de la méthode (« on applique… », « on retient… »).

## Procédure

1. Pour chaque chapitre, lire l'existant dans `apps/api/src/content/chapitres/<slug>/`.
2. Compléter jusqu'à atteindre **≥ 5 flashcards + ≥ 5 QCM** par chapitre, en
   variant les notions du thème BO et les niveaux de difficulté.
3. Vérifier la conformité au format (frontmatter + sections) — le loader rejette
   tout fichier malformé au démarrage.
4. Lancer `pnpm --filter @juju-aviatrice/api test` : le catalogue doit charger
   sans erreur et les tests rester verts.
5. Relire le diff git (contrôle du ton et de l'exactitude mathématique) puis
   committer avec un message Conventional Commits (`feat(contenu): …`).
