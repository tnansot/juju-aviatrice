# Feature : Session d'entraînement courte (J2)

## Description

Juju fait une mini-session de 3-5 exercices (flashcards ou QCM) en 15 min max sur smartphone. Le flux : suggestion + Go → enchaînement d'exercices → corrections → bilan sobre → encore ou bonne nuit. Tolérance aux interruptions, formulations positives, scoring non-stigmatisant.

## Critère de complétion

1. Taper Go sur l'accueil → les exercices s'enchaînent sans écran intermédiaire
2. Chaque exercice (flashcard ou QCM) affiche une correction expliquée
3. Fin de mini-session → bilan sobre (nombre d'exercices faits, pas de note /N)
4. Choix « Encore » ou « Bonne nuit » avec message neutre
5. Fermeture en cours → exercices faits comptabilisés, prochaine ouverture sans reproche

## Priorité

- [x] Must have

## Exigences couvertes

- [REQ-SESSION-001] : Mini-session de 3-5 micro-exercices
- [REQ-SESSION-002] : Format flashcard
- [REQ-SESSION-003] : Format QCM
- [REQ-SESSION-006] : Correction expliquée après chaque exercice
- [REQ-SESSION-007] : Scoring non-stigmatisant
- [REQ-SESSION-008] : Tolérance aux interruptions
- [REQ-SESSION-009] : Bilan sobre de fin de session
- [REQ-SESSION-010] : Formulations exclusivement positives

## Dépendances

- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : API et frontend opérationnels
- [Feature Accès sécurisé](f2-feature-auth-device.md) : device identifié
- [Feature Parcours de bienvenue](f3-feature-onboarding-bienvenue.md) : onboarding complété, écran d'accueil FO-04 disponible

## Écrans et API concernés

### Écrans

- **Accueil (FO-04)**
  - Spec : [spec-ecran-accueil.md](../../03-design/3-wireframes/spec-ecran-accueil.md)
  - Wireframe HTML : [fo-04-accueil.html](../../03-design/3-wireframes/html-wireframes/fo-04-accueil.html)

- **Flashcard (FO-05)**
  - Spec : [spec-ecran-flashcard.md](../../03-design/3-wireframes/spec-ecran-flashcard.md)
  - Wireframe HTML : [fo-05-flashcard.html](../../03-design/3-wireframes/html-wireframes/fo-05-flashcard.html)

- **QCM (FO-06)**
  - Spec : [spec-ecran-qcm.md](../../03-design/3-wireframes/spec-ecran-qcm.md)
  - Wireframe HTML : [fo-06-qcm.html](../../03-design/3-wireframes/html-wireframes/fo-06-qcm.html)

- **Bilan (FO-07)**
  - Spec : [spec-ecran-bilan.md](../../03-design/3-wireframes/spec-ecran-bilan.md)
  - Wireframe HTML : [fo-07-bilan.html](../../03-design/3-wireframes/html-wireframes/fo-07-bilan.html)

- **Choix Activité (FO-09)**
  - Spec : [spec-ecran-choix-activite.md](../../03-design/3-wireframes/spec-ecran-choix-activite.md)
  - Wireframe HTML : [fo-09-choix-activite.html](../../03-design/3-wireframes/html-wireframes/fo-09-choix-activite.html)

### API

- **entrainement.demarrerMiniSession** : [entrainement.md](../../03-design/4-api/entrainement.md) — Démarrer une mini-session
- **entrainement.retournerFlashcard** : [entrainement.md](../../03-design/4-api/entrainement.md) — Marquer flashcard complétée
- **entrainement.soumettreReponse** : [entrainement.md](../../03-design/4-api/entrainement.md) — Soumettre réponse QCM
- **entrainement.terminerMiniSession** : [entrainement.md](../../03-design/4-api/entrainement.md) — Terminer et obtenir le bilan
- **entrainement.signalerInterruption** : [entrainement.md](../../03-design/4-api/entrainement.md) — Signaler une fermeture en cours

---

## Stories

### S1 : Démarrage de mini-session (Go)

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** démarrer un entraînement en un seul tap sur Go,
**afin de** ne pas perdre de temps quand je suis fatiguée le soir.

**Critères d'acceptation :**

```gherkin
GIVEN l'écran d'accueil FO-04 avec une suggestion affichée
WHEN Juju tape Go
THEN une mini-session de 3-5 exercices démarre immédiatement sans écran intermédiaire
```

```gherkin
GIVEN l'écran d'accueil
WHEN Juju tape "Changer"
THEN l'écran FO-09 propose un choix simple : pilier → chapitre (2 taps max)
```

**Implémentation :**

- [ ] Backend : procédure entrainement.demarrerMiniSession(chapitre_id, format, mode_chrono)
- [ ] Backend : modèle Session + MiniSession + ExerciceEnCours (tables Drizzle)
- [ ] Frontend : démarrage de session depuis Go (charge exercices + lance le premier)
- [ ] Frontend : composant ChoixActivite (FO-09) — sélection pilier → chapitre
- [ ] Tests : démarrage nominal, choix alternatif
- **Statut** : À faire

---

### S2 : Exercice flashcard (FO-05)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** retourner une flashcard pour vérifier ma réponse mentale,
**afin de** ancrer mes connaissances sans pression.

**Critères d'acceptation :**

```gherkin
GIVEN un exercice flashcard affiché (face question)
WHEN Juju tape pour retourner la carte
THEN la face réponse s'affiche avec une animation flip, et la correction pédagogique apparaît
```

```gherkin
GIVEN la flashcard retournée
WHEN Juju tape "Suivant"
THEN l'exercice suivant s'affiche sans délai perceptible (< 300ms)
```

**Implémentation :**

- [ ] Backend : procédure entrainement.retournerFlashcard (émet exercice_effectue)
- [ ] Frontend : composant FlashcardScreen (FO-05) avec animation flip
- [ ] Frontend : affichage correction sous la réponse
- [ ] Frontend : transition fluide vers l'exercice suivant (< 300ms)
- [ ] Tests : flip, correction, transition, événement exercice_effectue
- **Statut** : À faire

---

### S3 : Exercice QCM (FO-06)

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** répondre à un QCM et voir la correction expliquée,
**afin de** comprendre le raisonnement attendu.

**Critères d'acceptation :**

```gherkin
GIVEN un exercice QCM affiché avec 3-5 options
WHEN Juju sélectionne une réponse et valide
THEN la bonne réponse est mise en évidence et la correction expliquée s'affiche
```

```gherkin
GIVEN une mauvaise réponse au QCM
WHEN la correction s'affiche
THEN le texte est neutre et pédagogique (pas de "Faux", "Raté", "Mauvaise réponse")
```

```gherkin
GIVEN la correction affichée
WHEN Juju tape "Suivant"
THEN l'exercice suivant s'affiche en < 300ms
```

**Implémentation :**

- [ ] Backend : procédure entrainement.soumettreReponse (émet exercice_effectue)
- [ ] Frontend : composant QCMScreen (FO-06) — options tactiles ≥ 44×44px
- [ ] Frontend : affichage correction (bonne réponse + raisonnement, formulation charte de ton)
- [ ] Frontend : indicateur de progression discret ("2/4")
- [ ] Tests : sélection, validation, correction neutre, transition
- **Statut** : À faire

---

### S4 : Bilan de mini-session (FO-07)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** voir un résumé sobre de ma mini-session,
**afin de** savoir ce que j'ai fait sans être évaluée.

**Critères d'acceptation :**

```gherkin
GIVEN les 3-5 exercices d'une mini-session terminés
WHEN le bilan s'affiche (FO-07)
THEN il mentionne le nombre d'exercices faits et le temps passé, sans note /N ni pourcentage
```

```gherkin
GIVEN le bilan affiché
WHEN Juju choisit "Encore une session"
THEN une nouvelle mini-session démarre (retour FO-04 avec nouvelle suggestion)
```

```gherkin
GIVEN le bilan affiché
WHEN Juju choisit "S'arrêter là"
THEN un message neutre et chaleureux s'affiche ("À bientôt") sans relance ni notification
```

**Implémentation :**

- [ ] Backend : procédure entrainement.terminerMiniSession (émet mini_session_terminee)
- [ ] Backend : procédure entrainement.obtenirBilan
- [ ] Frontend : composant BilanScreen (FO-07) — nombre d'exercices, pas de score
- [ ] Frontend : boutons "Encore" et "Bonne nuit"
- [ ] Tests : bilan correct, choix encore/stop, formulation positive
- **Statut** : À faire

---

### S5 : Tolérance aux interruptions

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** pouvoir fermer l'app à tout moment sans perdre mes exercices faits,
**afin de** ne jamais me sentir prisonnière d'une session.

**Critères d'acceptation :**

```gherkin
GIVEN une mini-session en cours (2 exercices faits sur 4)
WHEN Juju ferme l'application
THEN les 2 exercices faits sont comptabilisés dans la progression
```

```gherkin
GIVEN une session interrompue
WHEN Juju rouvre l'app plus tard
THEN l'écran d'accueil FO-04 s'affiche normalement sans mention de la session inachevée
```

**Implémentation :**

- [ ] Backend : procédure entrainement.signalerInterruption (émet session_interrompue)
- [ ] Frontend : détection de fermeture (beforeunload / visibilitychange) → signaler interruption
- [ ] Frontend : aucun message de reproche au retour
- [ ] Tests : interruption, comptabilisation, réouverture propre
- **Statut** : À faire

---

### S6 : Chargement des exercices depuis le catalogue

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Charger les exercices du chapitre/format choisi depuis bc-contenu et les servir à bc-entrainement.
**Justification** : Le flux session lit les exercices via contenu.chargerExercices. La sélection de 3-5 exercices par mini-session est une logique métier du BC entraînement.

**Critères d'acceptation :**

```gherkin
GIVEN un chapitre avec ≥ 5 exercices disponibles
WHEN une mini-session est démarrée sur ce chapitre
THEN 3 à 5 exercices sont sélectionnés et chargés en une requête
```

```gherkin
GIVEN un chapitre avec exactement 3 exercices
WHEN une mini-session est démarrée
THEN les 3 exercices sont chargés (minimum respecté)
```

**Implémentation :**

- [ ] Backend : procédure contenu.chargerExercices(chapitre_id, format, nombre)
- [ ] Backend : logique de sélection (aléatoire ou séquentiel, à définir)
- [ ] Tests : nombre correct, format respecté, chapitre valide/invalide
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Démarrage de mini-session (Go) | US | M (3 pts) | À faire |
| S2 | Exercice flashcard (FO-05) | US | S (2 pts) | À faire |
| S3 | Exercice QCM (FO-06) | US | M (3 pts) | À faire |
| S4 | Bilan de mini-session (FO-07) | US | S (2 pts) | À faire |
| S5 | Tolérance aux interruptions | US | S (2 pts) | À faire |
| S6 | Chargement des exercices depuis le catalogue | TS | S (2 pts) | À faire |

**Total** : 6 stories — 14 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| bc-entrainement | [bc-entrainement](../../03-design/1-domain/bc-entrainement.md) |
| bc-contenu | [bc-contenu](../../03-design/1-domain/bc-contenu.md) |
| modèles Session, MiniSession, ExerciceEnCours | [models/](../../03-design/1-domain/models/) |
| exigences session | [req-session](../../03-design/0-requirements/fonctionnelles/req-session.md) |
| wireframes FO-04 à FO-09 | [navigation](../../03-design/3-wireframes/navigation.md) |
| API entrainement | [entrainement.md](../../03-design/4-api/entrainement.md) |
