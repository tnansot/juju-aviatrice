# Feature : Parcours de bienvenue (J1)

## Description

À sa toute première ouverture, Juju découvre l'app en < 3 minutes : un accueil personnalisé (« Salut Juju »), la présentation des deux piliers (Sciences + Psychotechniques), une flashcard d'échantillon maths, et l'avatar dans son état initial. Le parcours est sauteable à chaque étape et tolérant aux interruptions.

## Critère de complétion

1. Première ouverture → écran « Salut Juju » sans inscription ni questionnaire
2. Présentation des deux piliers en un écran sobre
3. Flashcard d'échantillon maths avec feedback neutre
4. Avatar visible au stade 1, micro-progression après la flashcard
5. Arrivée sur l'écran d'accueil (FO-04) — parcours complet en < 3 min

## Priorité

- [x] Must have

## Exigences couvertes

- [REQ-ACCUEIL-001] : Bienvenue personnalisée sans inscription
- [REQ-ACCUEIL-002] : Présentation des deux piliers
- [REQ-ACCUEIL-003] : Exercice d'échantillon en onboarding
- [REQ-ACCUEIL-004] : Onboarding sauteable à tout moment
- [REQ-ACCUEIL-005] : Tolérance aux interruptions d'onboarding
- [REQ-ACCUEIL-006] : Écran d'accueil récurrent avec avatar

## Dépendances

- [Feature Accès sécurisé](f2-feature-auth-device.md) : le device doit être identifié avant de démarrer l'onboarding
- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : API, frontend et DB opérationnels

## Écrans et API concernés

### Écrans

- **Onboarding Bienvenue (FO-01)**
  - Spec : [spec-ecran-onboarding-bienvenue.md](../../03-design/3-wireframes/spec-ecran-onboarding-bienvenue.md)
  - Wireframe HTML : [fo-01-onboarding-bienvenue.html](../../03-design/3-wireframes/html-wireframes/fo-01-onboarding-bienvenue.html)

- **Onboarding Piliers (FO-02)**
  - Spec : [spec-ecran-onboarding-piliers.md](../../03-design/3-wireframes/spec-ecran-onboarding-piliers.md)
  - Wireframe HTML : [fo-02-onboarding-piliers.html](../../03-design/3-wireframes/html-wireframes/fo-02-onboarding-piliers.html)

- **Onboarding Flashcard (FO-03)**
  - Spec : [spec-ecran-onboarding-flashcard.md](../../03-design/3-wireframes/spec-ecran-onboarding-flashcard.md)
  - Wireframe HTML : [fo-03-onboarding-flashcard.html](../../03-design/3-wireframes/html-wireframes/fo-03-onboarding-flashcard.html)

- **Accueil (FO-04)**
  - Spec : [spec-ecran-accueil.md](../../03-design/3-wireframes/spec-ecran-accueil.md)
  - Wireframe HTML : [fo-04-accueil.html](../../03-design/3-wireframes/html-wireframes/fo-04-accueil.html)

### API

- **onboarding.obtenirEtat** : [onboarding.md](../../03-design/4-api/onboarding.md) — État de l'onboarding pour le routing
- **onboarding.avancerEtape** : [onboarding.md](../../03-design/4-api/onboarding.md) — Progression dans l'onboarding
- **onboarding.sauter** : [onboarding.md](../../03-design/4-api/onboarding.md) — Saut de l'onboarding
- **contenu.listerPiliers** : [contenu.md](../../03-design/4-api/contenu.md) — Liste des piliers pour FO-02
- **contenu.obtenirFlashcardEchantillon** : [contenu.md](../../03-design/4-api/contenu.md) — Flashcard de l'onboarding

---

## Stories

### S1 : Écran de bienvenue personnalisé (FO-01)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** être accueillie par mon prénom dès la première ouverture,
**afin de** sentir que l'app est faite pour moi.

**Critères d'acceptation :**

```gherkin
GIVEN un device nouvellement enregistré (onboarding non commencé)
WHEN Juju ouvre l'app pour la première fois
THEN l'écran FO-01 affiche "Salut Juju" avec l'avatar au stade 1, sans formulaire ni demande d'inscription
```

```gherkin
GIVEN l'écran FO-01 affiché
WHEN Juju tape "Passer"
THEN elle arrive directement sur l'écran d'accueil FO-04
```

**Implémentation :**

- [x] Backend : procédure onboarding.obtenirEtat (retourne l'état courant)
- [x] Backend : procédure onboarding.avancerEtape(etape: 1)
- [x] Frontend : composant WelcomeScreen (FO-01)
- [x] Frontend : routing — redirection vers FO-01 si onboarding non fait
- [x] Tests : affichage, bouton suivant, bouton passer
- **Statut** : En cours

---

### S2 : Présentation des deux piliers (FO-02)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** comprendre en un coup d'œil les deux types de contenu disponibles,
**afin de** savoir ce que l'app couvre sans être intimidée.

**Critères d'acceptation :**

```gherkin
GIVEN l'étape 1 de l'onboarding complétée
WHEN Juju arrive sur l'écran FO-02
THEN les deux piliers (Sciences et Psychotechniques) sont présentés en quelques mots avec un visuel sobre
```

```gherkin
GIVEN l'écran FO-02 affiché
WHEN Juju tape "Passer"
THEN elle arrive sur l'écran d'accueil FO-04 sans message de reproche
```

**Implémentation :**

- [x] Backend : procédure contenu.listerPiliers
- [x] Backend : procédure onboarding.avancerEtape(etape: 2)
- [x] Frontend : composant PiliersScreen (FO-02)
- [x] Tests : affichage des 2 piliers, bouton suivant, bouton passer
- **Statut** : Terminée

---

### S3 : Flashcard d'échantillon maths (FO-03)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** faire un exercice simple et familier dès l'onboarding,
**afin de** comprendre le format sans pression.

**Critères d'acceptation :**

```gherkin
GIVEN l'étape 2 de l'onboarding complétée
WHEN Juju arrive sur l'écran FO-03
THEN une flashcard maths (terrain familier) est affichée avec un message positif
```

```gherkin
GIVEN la flashcard affichée
WHEN Juju retourne la carte
THEN la réponse s'affiche avec un feedback neutre (pas de verdict bonne/mauvaise réponse stigmatisant)
```

```gherkin
GIVEN la flashcard retournée
WHEN Juju continue
THEN l'avatar marque une micro-progression et un déblocage imminent est annoncé
```

**Implémentation :**

- [x] Backend : procédure contenu.obtenirFlashcardEchantillon
- [x] Backend : procédure onboarding.avancerEtape(etape: 3) — émet onboarding_complete
- [x] Frontend : composant OnboardingFlashcard (FO-03) avec animation flip
- [x] Frontend : micro-progression avatar (appel progression après onboarding_complete)
- [x] Tests : affichage flashcard, retournement, progression avatar
- **Statut** : Terminée

---

### S4 : Saut et interruption de l'onboarding

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** pouvoir sauter ou interrompre l'onboarding sans conséquence,
**afin de** ne jamais me sentir coincée ou culpabilisée.

**Critères d'acceptation :**

```gherkin
GIVEN l'onboarding en cours à n'importe quelle étape
WHEN Juju tape "Passer"
THEN l'onboarding est marqué comme sauté et Juju arrive sur l'écran d'accueil FO-04
```

```gherkin
GIVEN l'onboarding en cours
WHEN Juju ferme l'application
THEN la prochaine ouverture mène directement à l'écran d'accueil FO-04 sans aucun message sur l'onboarding abandonné
```

```gherkin
GIVEN l'onboarding sauté ou interrompu
WHEN Juju est sur l'écran d'accueil
THEN l'avatar est au stade 1 (état initial) et aucun rappel d'onboarding n'apparaît
```

**Implémentation :**

- [x] Backend : procédure onboarding.sauter — marque l'onboarding comme sauté, émet onboarding_complete
- [x] Backend : gestion de l'état interrompu (fermeture = accueil direct au retour)
- [x] Frontend : bouton "Passer" visible à chaque écran d'onboarding
- [x] Frontend : routing — si onboarding complet ou sauté → FO-04
- [x] Tests : saut à chaque étape, fermeture en cours, réouverture
- **Statut** : Terminée

---

### S5 : Écran d'accueil récurrent (FO-04)

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** retrouver un écran d'accueil clair à chaque ouverture post-onboarding,
**afin de** démarrer mon entraînement en 1 tap sans chercher.

**Critères d'acceptation :**

```gherkin
GIVEN l'onboarding terminé (ou sauté)
WHEN Juju ouvre l'app
THEN l'écran FO-04 affiche l'avatar, une suggestion d'activité en 1 ligne et un bouton Go, le tout sans scroll
```

```gherkin
GIVEN l'écran d'accueil affiché
WHEN Juju tape "Changer"
THEN elle accède à l'écran de choix d'activité FO-09
```

**Implémentation :**

- [x] Frontend : composant HomeScreen (FO-04) avec avatar, suggestion, bouton Go, bouton Changer
- [x] Frontend : intégration suggestion (stub en attendant F9 — suggestion par défaut)
- [x] Frontend : intégration avatar (stub en attendant F8 — stade 1)
- [ ] Frontend : navigation Go → session (F4), Changer → FO-09
- [x] Tests : affichage complet, navigation, pas de scroll sur contenu principal
- **Statut** : Terminée

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Écran de bienvenue personnalisé (FO-01) | US | S (2 pts) | Terminée |
| S2 | Présentation des deux piliers (FO-02) | US | S (2 pts) | Terminée |
| S3 | Flashcard d'échantillon maths (FO-03) | US | S (2 pts) | Terminée |
| S4 | Saut et interruption de l'onboarding | US | S (2 pts) | Terminée |
| S5 | Écran d'accueil récurrent (FO-04) | US | M (3 pts) | Terminée |

**Total** : 5 stories — 11 points

---

**Statut** : En revue

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J1 | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| bc-onboarding | [bc-onboarding](../../03-design/1-domain/bc-onboarding.md) |
| modèle EtatOnboarding | [model-etat-onboarding](../../03-design/1-domain/models/model-etat-onboarding.md) |
| exigences accueil | [req-accueil](../../03-design/0-requirements/fonctionnelles/req-accueil.md) |
| wireframes FO-01 à FO-04 | [navigation](../../03-design/3-wireframes/navigation.md) |
| API onboarding | [onboarding.md](../../03-design/4-api/onboarding.md) |
