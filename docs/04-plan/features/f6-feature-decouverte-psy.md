# Feature : Découverte psychotechniques (J3)

## Description

Premier contact de Juju avec le pilier Psychotechniques. Le parcours désarme la peur en 3 temps : accueil psy guidé → fiche méthode → exercices sans chrono. Deux types M0 (logique + calcul mental), fiches méthode dédiées, exercices avec corrections expliquées, et récap sobre de la séquence. Le chrono est proposé mais jamais imposé (traité dans F7).

## Critère de complétion

1. Premier accès psy → écran FO-10 « Bienvenue dans la zone Psy » avec logique recommandée
2. Fiche méthode affichée en 3 sections (C'est quoi, Ce que ça évalue, Comment l'aborder) < 3 min de lecture
3. Exercices psy sans chrono avec correction expliquée après chaque exercice
4. Récap sobre de la séquence (FO-13) avec checklist factuelle
5. L'écran de bienvenue psy ne réapparaît pas aux accès suivants

## Priorité

- [x] Must have

## Exigences couvertes

- [REQ-CONTENU-001] : Organisation en deux piliers (volet Psychotechniques)
- [REQ-CONTENU-004] : Fiche méthode par type psychotechnique
- [REQ-CONTENU-005] : ≥ 5 exercices par type psy avec correction expliquée
- [REQ-CONTENU-007] : Premier accès au pilier psy signalé et guidé
- [REQ-SESSION-004] : Mode sans chronomètre pour l'entraînement psy
- [REQ-SESSION-006] : Correction expliquée après chaque exercice

## Dépendances

- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : API et frontend opérationnels
- [Feature Accès sécurisé](f2-feature-auth-device.md) : device identifié
- [Feature Parcours de bienvenue](f3-feature-onboarding-bienvenue.md) : onboarding complété
- [Feature Session d'entraînement](f4-feature-session-entrainement.md) : composants Flashcard/QCM réutilisés

## Écrans et API concernés

### Écrans

- **Psy Bienvenue (FO-10)**
  - Spec : [spec-ecran-psy-bienvenue.md](../../03-design/3-wireframes/spec-ecran-psy-bienvenue.md)
  - Wireframe HTML : [fo-10-psy-bienvenue.html](../../03-design/3-wireframes/html-wireframes/fo-10-psy-bienvenue.html)

- **Fiche Méthode (FO-11)**
  - Spec : [spec-ecran-fiche-methode.md](../../03-design/3-wireframes/spec-ecran-fiche-methode.md)
  - Wireframe HTML : [fo-11-fiche-methode.html](../../03-design/3-wireframes/html-wireframes/fo-11-fiche-methode.html)

- **Récap Séquence Psy (FO-13)**
  - Spec : [spec-ecran-recap-psy.md](../../03-design/3-wireframes/spec-ecran-recap-psy.md)
  - Wireframe HTML : [fo-13-recap-psy.html](../../03-design/3-wireframes/html-wireframes/fo-13-recap-psy.html)

### API

- **onboarding.marquerPremierAccesPsy** : [onboarding.md](../../03-design/4-api/onboarding.md) — Marquer le 1er accès psy
- **contenu.obtenirFicheMethode** : [contenu.md](../../03-design/4-api/contenu.md) — Fiche méthode d'un type psy
- **contenu.chargerExercices** : [contenu.md](../../03-design/4-api/contenu.md) — Exercices psy pour entraînement

---

## Stories

### S1 : Écran de bienvenue psy (FO-10)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** être accueillie dans la zone Psy avec une orientation claire,
**afin de** ne pas me sentir perdue face à un terrain inconnu.

**Critères d'acceptation :**

```gherkin
GIVEN le pilier Psy n'a jamais été visité (premier_acces_psy = false)
WHEN Juju choisit Psychotechniques dans FO-09
THEN l'écran FO-10 affiche les 2 types (Logique + Calcul mental) avec Logique recommandée en 1er
```

```gherkin
GIVEN le pilier Psy déjà visité (premier_acces_psy = true)
WHEN Juju choisit Psychotechniques
THEN FO-10 n'apparaît pas — navigation directe vers les exercices ou la fiche
```

**Implémentation :**

- [ ] Backend : procédure onboarding.marquerPremierAccesPsy
- [ ] Frontend : composant PsyBienvenueScreen (FO-10) — 2 cartes type, badge « Recommandé »
- [ ] Frontend : routing conditionnel (premier_acces_psy ? FO-10 : exercices)
- [ ] Tests : affichage 1ère fois, non-réaffichage, choix logique/calcul mental
- **Statut** : À faire

---

### S2 : Fiche méthode psy (FO-11)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** lire une fiche courte qui explique ce qu'est un test de logique,
**afin de** comprendre ce qu'on attend de moi avant de m'entraîner.

**Critères d'acceptation :**

```gherkin
GIVEN Juju a choisi le type Logique
WHEN la fiche méthode s'affiche (FO-11)
THEN 3 sections sont visibles : "C'est quoi ?", "Ce que ça évalue" (3-5 puces), "Comment l'aborder" (3-5 conseils)
```

```gherkin
GIVEN la fiche méthode affichée
WHEN Juju tape "S'entraîner"
THEN les exercices psy sans chrono démarrent immédiatement
```

```gherkin
GIVEN la fiche méthode affichée
WHEN Juju tape "Plus tard"
THEN retour à l'accueil FO-04 sans reproche
```

**Implémentation :**

- [ ] Backend : procédure contenu.obtenirFicheMethode(chapitreId)
- [ ] Frontend : composant FicheMethodeScreen (FO-11) — 3 sections, lisible < 3 min
- [ ] Frontend : transition vers exercices sans chrono ou retour accueil
- [ ] Tests : affichage sections, navigation, pas de chrono sur cet écran
- **Statut** : À faire

---

### S3 : Exercices psy sans chrono

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** faire des exercices de logique sans chronomètre visible,
**afin de** comprendre le raisonnement à mon rythme avant de tester en conditions réelles.

**Critères d'acceptation :**

```gherkin
GIVEN le lancement d'exercices psy depuis la fiche méthode
WHEN les exercices s'affichent
THEN aucun chronomètre n'est visible — le mode chrono est désactivé par défaut
```

```gherkin
GIVEN un exercice psy terminé (correction affichée)
WHEN Juju tape "Suivant"
THEN l'exercice suivant s'affiche en < 300ms
```

```gherkin
GIVEN tous les exercices psy sans chrono terminés
WHEN la séquence est finie
THEN la proposition de QCM chrono (FO-12) s'affiche, ou le récap (FO-13) si le chrono n'est pas disponible
```

**Implémentation :**

- [ ] Frontend : réutilisation QCMScreen (FO-06) avec flag modeChrono = false (chrono masqué)
- [ ] Frontend : enchaînement exercices psy sans chrono → proposition chrono ou récap
- [ ] Backend : demarrerMiniSession avec modeChrono = false pour les sessions psy initiales
- [ ] Tests : absence de chrono, corrections, transition vers proposition chrono
- **Statut** : À faire

---

### S4 : Génération contenu psy (fiches + exercices) — skill Claude Code

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** avoir des fiches méthode et des exercices de logique et de calcul mental,
**afin de** comprendre ce qu'on attend de moi et m'entraîner sur des exercices adaptés.

**Critères d'acceptation :**

```gherkin
GIVEN le skill Claude Code psy exécuté
WHEN je vérifie les fichiers générés dans src/content/chapitres/
THEN 2 répertoires psy existent (logique + calcul mental) avec chacun 1 fiche méthode et ≥ 5 exercices QCM, conformes à la convention MD
```

```gherkin
GIVEN la fiche méthode Logique générée
WHEN Juju la lit
THEN les 3 sections ("C'est quoi ?", "Ce que ça évalue", "Comment l'aborder") sont complètes, sans jargon, lisibles en < 3 min
```

```gherkin
GIVEN les exercices psy générés
WHEN je vérifie les typologies
THEN les exercices logique couvrent au moins 2 typologies (séries, analogies, syllogismes, déductif) et les exercices calcul mental au moins 2 typologies (opérations, fractions, conversions, pourcentages)
```

```gherkin
GIVEN un exercice psy généré
WHEN Juju lit la correction
THEN le raisonnement est détaillé étape par étape, formulé de manière pédagogique
```

**Implémentation :**

- [ ] Création du skill Claude Code `gen-exercices-psy` : génère les fichiers MD pour 2 types psy (logique + calcul mental)
- [ ] Le skill produit 2 fiches méthode (3 sections chacune : cest_quoi + ce_que_ca_evalue + comment_aborder)
- [ ] Le skill produit ≥ 5 exercices QCM logique (variété typologique) avec correction expliquée
- [ ] Le skill produit ≥ 5 exercices QCM calcul mental (variété typologique) avec correction expliquée
- [ ] Les fiches et corrections respectent la charte de ton : neutres, pédagogiques, sans jargon
- [ ] Exécution du skill, relecture diff git, commit
- **Statut** : À faire

---

### S5 : Récap séquence psy (FO-13)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** voir un résumé de ma première exploration psy,
**afin de** réaliser que j'ai franchi un cap sans être jugée.

**Critères d'acceptation :**

```gherkin
GIVEN la séquence psy terminée (fiche + exos ± chrono)
WHEN le récap s'affiche (FO-13)
THEN une checklist factuelle montre les étapes franchies (fiche lue, N exos, QCM chrono si fait)
```

```gherkin
GIVEN le récap affiché
WHEN Juju choisit "Essayer l'autre type psy"
THEN la navigation mène vers la fiche méthode de l'autre type (calcul mental si logique déjà fait)
```

```gherkin
GIVEN le récap affiché
WHEN Juju choisit "Retour à l'accueil"
THEN retour sur FO-04 avec avatar mis à jour
```

**Implémentation :**

- [ ] Frontend : composant RecapPsyScreen (FO-13) — checklist, résultat chrono factuel si applicable
- [ ] Frontend : message avatar progression (1er passage psy)
- [ ] Frontend : navigation vers autre type psy ou accueil
- [ ] Tests : checklist correcte, résultat chrono factuel (pas de note), navigation
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Écran de bienvenue psy (FO-10) | US | S (2 pts) | À faire |
| S2 | Fiche méthode psy (FO-11) | US | S (2 pts) | À faire |
| S3 | Exercices psy sans chrono | US | M (3 pts) | À faire |
| S4 | Génération contenu psy — skill Claude Code | US | M (3 pts) | À faire |
| S5 | Récap séquence psy (FO-13) | US | S (2 pts) | À faire |

**Total** : 5 stories — 12 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| bc-contenu | [bc-contenu](../../03-design/1-domain/bc-contenu.md) |
| bc-onboarding (premier accès psy) | [bc-onboarding](../../03-design/1-domain/bc-onboarding.md) |
| modèles FicheMethode, Chapitre, Exercice | [models/](../../03-design/1-domain/models/) |
| convention catalogue contenu | [ADR-015](../../03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md) |
| exigences contenu | [req-contenu](../../03-design/0-requirements/fonctionnelles/req-contenu.md) |
| exigences session | [req-session](../../03-design/0-requirements/fonctionnelles/req-session.md) |
| wireframes FO-10, FO-11, FO-13 | [navigation](../../03-design/3-wireframes/navigation.md) |
| API contenu + onboarding | [contenu.md](../../03-design/4-api/contenu.md), [onboarding.md](../../03-design/4-api/onboarding.md) |
