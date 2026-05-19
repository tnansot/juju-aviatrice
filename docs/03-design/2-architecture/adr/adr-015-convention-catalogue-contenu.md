# ADR-015 : Convention de stockage du catalogue contenu

## Contexte

Le catalogue pédagogique (sciences + psychotechniques) est statique en M0 (~70 exercices + fiches méthode). Un stockage en **fichiers Markdown avec frontmatter YAML**, versionnés dans le repo, est plus simple qu'une base relationnelle et permet l'édition directe par Papa ou par skills Claude Code. Un loader TypeScript parse le contenu au démarrage et l'expose en mémoire pour les procédures tRPC de bc-contenu.

Alternatives écartées : base relationnelle (surdimensionnée pour ~70 items statiques), JSON (moins lisible/éditable), CMS headless (dépendance externe injustifiée).

## Décision

### Hiérarchie de fichiers

```
src/content/
  piliers/
    sciences.md
    psychotechniques.md
  chapitres/
    maths-suites-numeriques/
      index.md                  # métadonnées chapitre
      flashcard-001.md          # un exercice par fichier
      qcm-001.md
    psy-logique/
      index.md
      fiche-methode.md          # spécifique psy
      qcm-001.md
```

### Format Pilier (`piliers/*.md`)

Frontmatter aligné sur [model-pilier](../../1-domain/models/model-pilier.md) :

```yaml
---
id: sciences
nom: Sciences
description: Maths et physique-chimie spécialité 1ère
---
```

### Format Chapitre (`chapitres/<slug>/index.md`)

Frontmatter aligné sur [model-chapitre](../../1-domain/models/model-chapitre.md) :

```yaml
---
id: maths-suites-numeriques
pilier_id: sciences
nom: Suites numériques
matiere: maths
reference_bo: "Spé maths 1ère — Suites numériques"
formats_disponibles: [flashcard, qcm]
etat_initial: debloque
ordre: 1
---
```

### Format Exercice — Flashcard (`chapitres/<slug>/flashcard-NNN.md`)

Frontmatter aligné sur [model-exercice](../../1-domain/models/model-exercice.md) :

```yaml
---
id: maths-suites-num-fc-001
format: flashcard
ordre: 1
---

## Question

Quelle est la formule du terme général d'une suite arithmétique ?

## Réponse

$u_n = u_0 + n \times r$

## Correction

Une suite arithmétique a une raison constante *r*. On part du premier terme $u_0$ et on ajoute *r* autant de fois que le rang *n*. C'est l'analogue discret d'une fonction affine.
```

### Format Exercice — QCM (`chapitres/<slug>/qcm-NNN.md`)

```yaml
---
id: maths-suites-num-qcm-001
format: qcm
ordre: 1
---

## Question

La suite $(u_n)$ définie par $u_n = 3n + 2$ est :

## Choix

- [ ] Géométrique de raison 3
- [x] Arithmétique de raison 3
- [ ] Ni arithmétique ni géométrique
- [ ] Constante

## Correction

On calcule $u_{n+1} - u_n = 3(n+1)+2 - (3n+2) = 3$. La différence est constante, donc la suite est arithmétique de raison 3.
```

Convention : `[x]` marque la bonne réponse dans le fichier source. Le loader extrait `est_correct` et ne l'envoie jamais au frontend (validation côté backend via `entrainement.soumettreReponse`).

### Format Fiche Méthode — Psy uniquement (`chapitres/<slug>/fiche-methode.md`)

Frontmatter aligné sur [model-fiche-methode](../../1-domain/models/model-fiche-methode.md). Un seul fichier par chapitre psy :

```yaml
---
id: psy-logique-fiche
chapitre_id: psy-logique
type_psy: logique
---

## C'est quoi ?

Paragraphe explicatif court décrivant le type de test.

## Ce que ça évalue

- Capacité de raisonnement déductif
- Identification de patterns et séquences
- Pensée logique structurée

## Comment l'aborder

- Lire l'énoncé deux fois avant de répondre
- Chercher la règle qui relie les éléments entre eux
- Éliminer les réponses manifestement incorrectes
```

### Loader

Le loader TypeScript (`apps/api/src/contenu/loader.ts`) :

- Parse tous les fichiers au démarrage du serveur
- Valide les frontmatter contre les modèles domaine
- Lève une erreur explicite avec le chemin du fichier fautif si un frontmatter est invalide
- Expose un catalogue typé en mémoire consommable par les procédures tRPC

## Conséquences

- Ajout de contenu = ajout de fichiers MD + commit → pas de migration, pas de déploiement spécifique
- Les skills Claude Code de génération (`gen-exercices-maths`, `gen-exercices-physique-chimie`, `gen-exercices-psy`) produisent des fichiers conformes à cette convention
- Limitation M0 : le catalogue entier est en mémoire — acceptable pour ~70 items, à réévaluer si le volume croît

## Traçabilité

| Dépendance | Référence |
|---|---|
| modèles domaine | [models/](../../1-domain/models/) |
| bc-contenu | [bc-contenu](../../1-domain/bc-contenu.md) |
| ADR-003 (structure projet) | [adr-003](adr-003-structure-projet.md) |
| F5 — Catalogue scientifique | [f5](../../../04-plan/features/f5-feature-catalogue-scientifique.md) |
| F6 — Découverte psy | [f6](../../../04-plan/features/f6-feature-decouverte-psy.md) |
