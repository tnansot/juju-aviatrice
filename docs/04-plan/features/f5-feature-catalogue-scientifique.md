# Feature : Catalogue contenu scientifique M0

## Description

Le pilier Sciences est alimenté avec 3 chapitres maths + 3 chapitres physique-chimie 1ère, chacun disponible en flashcards et QCM. Les exercices sont accompagnés de corrections expliquées. Le contenu est stocké dans des **fichiers Markdown avec frontmatter YAML**, versionnés dans le repo, chargés au runtime par un loader TypeScript qui alimente les procédures tRPC de bc-contenu.

La rédaction des exercices est **automatisée par des skills Claude Code dédiés par matière**, exécutés par Papa. Le contenu généré est relu via diff git puis commité.

## Critère de complétion

1. 6 chapitres scientifiques accessibles (3 maths, 3 physique-chimie 1ère)
2. Chaque chapitre a ≥ 5 flashcards et ≥ 5 QCM avec corrections expliquées
3. L'API contenu.listerPiliers retourne le pilier Sciences avec ses 6 chapitres
4. L'API contenu.chargerExercices retourne les exercices du chapitre/format demandé
5. Les corrections respectent la charte de ton (neutre, pédagogique)

## Priorité

- [x] Must have

## Exigences couvertes

- [REQ-CONTENU-001] : Organisation en deux piliers (volet Sciences)
- [REQ-CONTENU-002] : 3 chapitres maths + 3 chapitres physique-chimie 1ère
- [REQ-CONTENU-003] : Deux formats par chapitre (flashcard + QCM)
- [REQ-SESSION-006] : Correction expliquée après chaque exercice

## Dépendances

- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : API tRPC opérationnelle
- [Feature Accès sécurisé](f2-feature-auth-device.md) : middleware auth pour les procédures protégées

## Écrans et API concernés

### Écrans

- **Choix Activité (FO-09)**
  - Spec : [spec-ecran-choix-activite.md](../../03-design/3-wireframes/spec-ecran-choix-activite.md)
  - Wireframe HTML : [fo-09-choix-activite.html](../../03-design/3-wireframes/html-wireframes/fo-09-choix-activite.html)

### API

- **contenu.listerPiliers** : [contenu.md](../../03-design/4-api/contenu.md) — Piliers avec chapitres ordonnés
- **contenu.obtenirChapitre** : [contenu.md](../../03-design/4-api/contenu.md) — Métadonnées d'un chapitre
- **contenu.chargerExercices** : [contenu.md](../../03-design/4-api/contenu.md) — Exercices pour une mini-session

---

## Convention de stockage Markdown

→ [ADR-015 — Convention de stockage du catalogue contenu](../../03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md)

---

## Stories

### S1 : Structure de fichiers et loader du catalogue

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Définir la convention de fichiers MD du catalogue, implémenter le loader TypeScript qui parse le contenu au démarrage et l'expose en mémoire pour les procédures tRPC.
**Justification** : Le contenu est statique en M0 (~60 exercices). Un loader MD est plus simple qu'une base relationnelle et permet l'édition directe par Papa.

**Critères d'acceptation :**

```gherkin
GIVEN les fichiers MD du catalogue dans src/content/
WHEN le serveur démarre
THEN le loader parse tous les piliers, chapitres et exercices en mémoire sans erreur
```

```gherkin
GIVEN un fichier exercice avec un frontmatter invalide
WHEN le loader tente de le parser
THEN une erreur explicite est levée avec le chemin du fichier fautif
```

**Implémentation :**

- [x] Créer la structure `src/content/` avec les répertoires piliers/ et chapitres/
- [x] Loader TypeScript : parse frontmatter YAML + corps Markdown des piliers et chapitres
- [x] Loader TypeScript : parse les exercices (flashcard et QCM), extraction de `est_correct` depuis `[x]`
- [x] Validation au chargement : frontmatter conforme aux modèles domaine, erreur explicite si invalide
- [x] Export d'un catalogue typé en mémoire (piliers, chapitres, exercices) consommable par les procédures tRPC
- [x] Tests : chargement d'un jeu de fixtures MD, validation du parsing, erreur sur fichier malformé (10 tests, `loader.test.ts`)
- **Statut** : Terminée

> **Note d'implémentation** : le stub `catalogue.ts` codé en dur est remplacé par le loader (`loader.ts`, parser `gray-matter`) sans changer son interface publique (`listerChapitres`, `obtenirChapitre`, `obtenirExercice`, `exercicesDuChapitre`) — les 5 consommateurs (bc-entrainement, services bc-contenu) restent verts. Le contenu existant a été migré en MD. Le build copie `src/content` → `dist/content` (`scripts/copy-content.mjs`) car le stage prod du Dockerfile ne copie que `dist/`.

---

### S2 : API contenu.listerPiliers et contenu.obtenirChapitre

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Exposer le catalogue de piliers et chapitres via les procédures tRPC.
**Justification** : Consommé par FO-09 (choix d'activité) et FO-02 (onboarding piliers).

**Critères d'acceptation :**

```gherkin
GIVEN le catalogue chargé par le loader
WHEN j'appelle contenu.listerPiliers
THEN je reçois 2 piliers avec respectivement 6 chapitres (Sciences) et les chapitres psy
```

```gherkin
GIVEN un chapitreId valide
WHEN j'appelle contenu.obtenirChapitre(chapitreId)
THEN je reçois les métadonnées : nom, matière, formats disponibles, nombre d'exercices par format
```

**Implémentation :**

- [ ] Procédure contenu.listerPiliers (query, lit le catalogue en mémoire, retourne piliers + chapitres ordonnés)
- [ ] Procédure contenu.obtenirChapitre (query, retourne métadonnées + compteur exercices par format)
- [ ] Tests : réponses conformes au schéma, chapitre inexistant → NON_TROUVE
- **Statut** : À faire

---

### S3 : API contenu.chargerExercices

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Charger N exercices d'un chapitre/format pour alimenter une mini-session.
**Justification** : Consommé par bc-entrainement au démarrage de mini-session.

**Critères d'acceptation :**

```gherkin
GIVEN un chapitre avec ≥ 5 QCM
WHEN j'appelle contenu.chargerExercices(chapitreId, "qcm", 4)
THEN je reçois exactement 4 exercices QCM avec énoncés et choix, sans la bonne réponse
```

```gherkin
GIVEN un chapitre avec 5 flashcards
WHEN j'appelle contenu.chargerExercices(chapitreId, "flashcard", 5)
THEN je reçois 5 flashcards avec faceQuestion et faceReponse
```

```gherkin
GIVEN deux appels successifs sur le même chapitre
WHEN je compare les ordres des exercices
THEN l'ordre est mélangé aléatoirement
```

**Implémentation :**

- [ ] Procédure contenu.chargerExercices (query, sélection aléatoire depuis le catalogue en mémoire, bonne réponse non exposée)
- [ ] Validation : nombre min/max (3-5), format valide, chapitre existant
- [ ] Tests : nombre correct, mélange, bonne réponse absente côté client
- **Statut** : À faire

---

### S4 : Génération des exercices maths (3 chapitres) — skill Claude Code

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** avoir des flashcards et QCM sur 3 chapitres de maths 1ère,
**afin de** réviser mes formules et raisonnements sur des exercices adaptés à mon niveau.

**Critères d'acceptation :**

```gherkin
GIVEN le skill Claude Code maths exécuté
WHEN je vérifie les fichiers générés dans src/content/chapitres/
THEN 3 répertoires maths existent avec ≥ 5 flashcards + ≥ 5 QCM chacun, conformes à la convention MD
```

```gherkin
GIVEN un exercice QCM maths généré
WHEN Juju lit la correction
THEN le raisonnement est détaillé étape par étape, formulé de manière pédagogique
```

**Implémentation :**

- [x] Création du skill Claude Code `gen-exercices-maths` (`.claude/skills/gen-exercices-maths/SKILL.md`) : génère les fichiers MD pour 3 chapitres maths (algèbre + analyse + géométrie, programme BO spé maths 1ère)
- [x] Le skill produit ≥ 5 flashcards par chapitre (formules, théorèmes, propriétés)
- [x] Le skill produit ≥ 5 QCM par chapitre avec 3-5 choix et correction expliquée
- [x] Les corrections respectent la charte de ton : neutres et pédagogiques (aucun « faux / raté / mauvais »)
- [x] Exécution du skill, relecture diff git, commit
- **Statut** : Terminée

> **Note** : les 3 chapitres atteignent 5 flashcards + 5 QCM. `maths-analyse` passe en `formats_disponibles: [flashcard, qcm]`. Le test `charger-exercices` du bornage « minimum 3 » a été découplé du contenu réel (provider injectable).

---

### S5 : Génération des exercices physique-chimie (3 chapitres) — skill Claude Code

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** avoir des flashcards et QCM sur 3 chapitres de physique-chimie 1ère,
**afin de** m'entraîner sur les concepts clés de ma spécialité.

**Critères d'acceptation :**

```gherkin
GIVEN le skill Claude Code physique-chimie exécuté
WHEN je vérifie les fichiers générés dans src/content/chapitres/
THEN 3 répertoires physique-chimie existent avec ≥ 5 flashcards + ≥ 5 QCM chacun, conformes à la convention MD
```

```gherkin
GIVEN un exercice flashcard physique-chimie généré
WHEN Juju retourne la carte
THEN la réponse inclut la formule et une explication concise du concept sous-jacent
```

**Implémentation :**

- [ ] Création du skill Claude Code `gen-exercices-physique-chimie` : génère les fichiers MD pour 3 chapitres physique-chimie (variété typologique, programme BO spé physique-chimie 1ère)
- [ ] Le skill produit ≥ 5 flashcards par chapitre (formules, unités, lois)
- [ ] Le skill produit ≥ 5 QCM par chapitre avec correction expliquée
- [ ] Les corrections respectent la charte de ton
- [ ] Exécution du skill, relecture diff git, commit
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Structure de fichiers et loader du catalogue | TS | M (3 pts) | Terminée |
| S2 | API contenu.listerPiliers et contenu.obtenirChapitre | TS | S (2 pts) | À faire |
| S3 | API contenu.chargerExercices | TS | S (2 pts) | À faire |
| S4 | Génération des exercices maths — skill Claude Code | US | M (3 pts) | Terminée |
| S5 | Génération des exercices physique-chimie — skill Claude Code | US | M (3 pts) | À faire |

**Total** : 5 stories — 13 points

---

**Statut** : En cours

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| bc-contenu | [bc-contenu](../../03-design/1-domain/bc-contenu.md) |
| modèles Pilier, Chapitre, Exercice | [models/](../../03-design/1-domain/models/) |
| convention catalogue contenu | [ADR-015](../../03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md) |
| exigences contenu | [req-contenu](../../03-design/0-requirements/fonctionnelles/req-contenu.md) |
| API contenu | [contenu.md](../../03-design/4-api/contenu.md) |
