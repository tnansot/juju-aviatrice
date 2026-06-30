---
name: gen-exercices-psy
description: "Générer ou enrichir les exercices psychotechniques (fiches méthode + QCM logique et calcul mental) du catalogue de juju-aviatrice, au format Markdown ADR-015. Utiliser quand l'utilisateur dit « générer les exercices psy », « contenu psy », « QCM logique », « QCM calcul mental » ou « fiches méthode psy »."
---

# gen-exercices-psy — Génération du contenu psychotechniques

## Contexte

Ce skill produit le contenu pédagogique **psychotechniques** de juju-aviatrice,
sous forme de fichiers Markdown chargés au runtime par le loader du catalogue
(cf. [ADR-015](../../../docs/03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md)).

Public : **Juju**, candidate aux sélections pilote de ligne (ENAC EPL/S, cadets).
Les tests psychotechniques ne demandent **aucune connaissance de cours** : tout
est dans l'énoncé. Le contenu vise à dédramatiser ce terrain et à entraîner les
réflexes (repérage de motifs, raisonnement, calcul rapide).

## Périmètre — 2 types psy (M0)

| Chapitre (slug) | Type | Typologies à couvrir (≥ 2) |
|---|---|---|
| `psy-logique` | Logique | séries, analogies, syllogismes, raisonnement déductif |
| `psy-calcul-mental` | Calcul mental | opérations, pourcentages, fractions, conversions |

Chaque chapitre doit comporter **une fiche méthode ET ≥ 5 QCM**.

## Emplacement et format des fichiers

Racine : `apps/api/src/content/chapitres/<slug>/`.

- `index.md` — métadonnées du chapitre (frontmatter aligné sur model-chapitre :
  `id`, `pilier_id: psychotechniques`, `nom`, `matiere: logique|calcul_mental`,
  `formats_disponibles: [qcm]`, `etat_initial: debloque`, `ordre`).
- `fiche-methode.md` — **une seule** par chapitre psy (cf. format ci-dessous).
- `qcm-NNN.md` — un QCM par fichier.

### Format QCM

Frontmatter `id`, `format: qcm`, `ordre`, et `typologie_psy` **uniquement pour
la logique** (`serie`, `analogie`, `syllogisme`, `deductif` — c'est le seul
enum accepté par le loader ; le calcul mental n'a pas de `typologie_psy`).
Corps avec sections `## Question`, `## Choix` (3 à 5 puces `- [ ]` / `- [x]`,
**une seule** `[x]`), `## Correction`.

Convention d'`id` : `<slug>-qcm-NNN`.

### Format Fiche Méthode

Frontmatter `id: <slug>-fiche`, `chapitre_id: <slug>`, `type_psy: logique|calcul_mental`.
Corps avec exactement 3 sections :

- `## C'est quoi ?` — paragraphe court, sans jargon
- `## Ce que ça évalue` — 3 à 5 puces
- `## Comment l'aborder` — 3 à 5 conseils concrets

L'ensemble doit être lisible en **< 3 min** sur smartphone.

## Charte de ton (BLOQUANT)

Fiches et corrections sont **pédagogiques, neutres et encourageantes** :

- Détailler le **raisonnement étape par étape** (l'astuce, pas seulement la réponse).
- **Jamais** de vocabulaire négatif ou culpabilisant : aucun « faux », « raté »,
  « mauvais », « erreur » adressé à l'élève (cf. règle métier bc-contenu et la
  Definition of Done).
- Tutoyer Juju, rester concret et rassurant.

## Procédure

1. Pour chaque chapitre, lire l'existant dans `apps/api/src/content/chapitres/<slug>/`.
2. Compléter jusqu'à **une fiche méthode + ≥ 5 QCM** par chapitre, en variant les
   typologies (≥ 2 par type) et les niveaux de difficulté.
3. Vérifier la conformité au format (frontmatter + sections) — le loader rejette
   tout fichier malformé au démarrage.
4. Lancer `pnpm --filter @juju-aviatrice/api test` : le catalogue doit charger
   sans erreur et les tests rester verts.
5. Relire le diff git (contrôle du ton et de l'exactitude) puis committer avec un
   message Conventional Commits (`feat(contenu): …`).
