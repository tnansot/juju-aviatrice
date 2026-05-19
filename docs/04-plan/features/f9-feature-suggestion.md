# Feature : Suggestion contextuelle

## Description

À chaque ouverture, une suggestion d'activité en 1 ligne + bouton Go permet de démarrer en 1 tap. La suggestion utilise 4 stratégies (défaut, continuité, alternance, reprise) selon l'historique. Juju peut aussi choisir elle-même via « Changer » (FO-09). L'objectif : minimiser la charge de décision le soir quand Juju est fatiguée.

## Critère de complétion

1. Ouverture post-onboarding → suggestion 1 ligne + Go visible sans scroll
2. Historique insuffisant → suggestion par défaut (flashcard maths 1er chapitre)
3. Après 3+ sessions même pilier → suggestion alternance (propose l'autre pilier)
4. Après interruption → suggestion reprise (même chapitre/format, sans reproche)
5. Bouton « Changer » → FO-09 avec choix en 2 taps max

## Priorité

- [x] Should have

## Exigences couvertes

- [REQ-SUGGEST-001] : Suggestion contextuelle à chaque ouverture
- [REQ-SUGGEST-002] : Choix alternatif à la suggestion
- [REQ-SUGGEST-003] : Suggestion par défaut (historique insuffisant)
- [REQ-SUGGEST-004] : Suggestion basée sur l'historique
- [REQ-SUGGEST-005] : Suggestion de reprise après interruption

## Dépendances

- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : API opérationnel
- [Feature Accès sécurisé](f2-feature-auth-device.md) : device identifié
- [Feature Session d'entraînement](f4-feature-session-entrainement.md) : mini-session créée en interne par suggestion.accepter
- [Feature Avatar & Progression](f8-feature-avatar-progression.md) : données d'avancement lues pour la suggestion

## Écrans et API concernés

### Écrans

- **Accueil (FO-04)** — suggestion + Go + Changer
  - Spec : [spec-ecran-accueil.md](../../03-design/3-wireframes/spec-ecran-accueil.md)

- **Choix Activité (FO-09)** — alternatives
  - Spec : [spec-ecran-choix-activite.md](../../03-design/3-wireframes/spec-ecran-choix-activite.md)

### API

- **suggestion.obtenirSuggestion** : [suggestion.md](../../03-design/4-api/suggestion.md) — Suggestion contextuelle
- **suggestion.accepter** : [suggestion.md](../../03-design/4-api/suggestion.md) — Accepter et démarrer
- **suggestion.listerAlternatives** : [suggestion.md](../../03-design/4-api/suggestion.md) — Choix alternatif

---

## Stories

### S1 : Moteur de suggestion contextuelle

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Implémenter les 4 stratégies de suggestion (défaut, continuité, alternance, reprise) côté backend.
**Justification** : Le moteur lit les données de bc-progression et bc-contenu pour choisir la meilleure suggestion.

**Critères d'acceptation :**

```gherkin
GIVEN un historique insuffisant (< 2 sessions)
WHEN j'appelle suggestion.obtenirSuggestion
THEN la stratégie "defaut" est appliquée : flashcard maths 1er chapitre
```

```gherkin
GIVEN 3+ mini-sessions consécutives sur le pilier Sciences
WHEN j'appelle suggestion.obtenirSuggestion
THEN la stratégie "alternance" propose un chapitre du pilier Psychotechniques
```

```gherkin
GIVEN une session interrompue sur "Géométrie dans le plan" en QCM
WHEN j'appelle suggestion.obtenirSuggestion
THEN la stratégie "reprise" propose le même chapitre/format
```

```gherkin
GIVEN un historique suffisant sans alternance ni reprise
WHEN j'appelle suggestion.obtenirSuggestion
THEN la stratégie "continuite" propose de poursuivre le dernier chapitre/format
```

**Implémentation :**

- [ ] Logique de sélection de stratégie (priorité : reprise > alternance > continuité > défaut)
- [ ] Procédure suggestion.obtenirSuggestion (query)
- [ ] Lecture croisée bc-progression (historique) + bc-contenu (catalogue débloqué)
- [ ] Ne suggère que du contenu débloqué
- [ ] Tests : chaque stratégie, priorité, contenu verrouillé exclu
- **Statut** : À faire

---

### S2 : Acceptation de la suggestion (Go)

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Quand Juju tape Go, créer la mini-session en interne et retourner les exercices en un aller-retour.
**Justification** : suggestion.accepter crée la session via bc-entrainement pour éviter un double appel API.

**Critères d'acceptation :**

```gherkin
GIVEN une suggestion affichée sur FO-04
WHEN Juju tape Go
THEN suggestion.accepter crée une mini-session et retourne les exercices directement
```

```gherkin
GIVEN la suggestion acceptée
WHEN les exercices sont retournés
THEN le frontend navigue vers FO-05 (flashcard) ou FO-06 (QCM) selon le format
```

**Implémentation :**

- [ ] Procédure suggestion.accepter (mutation) — appel in-process à bc-entrainement
- [ ] Retour des exercices dans la réponse (pas de second appel)
- [ ] Tests : création session, exercices retournés, format correct
- **Statut** : À faire

---

### S3 : Choix alternatif (Changer → FO-09)

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** pouvoir choisir moi-même un chapitre et un format,
**afin de** travailler ce que je veux quand la suggestion ne me convient pas.

**Critères d'acceptation :**

```gherkin
GIVEN l'écran FO-04 affiché
WHEN Juju tape "Changer"
THEN l'écran FO-09 s'affiche avec les piliers et chapitres accessibles
```

```gherkin
GIVEN l'écran FO-09 affiché
WHEN Juju sélectionne un pilier puis un chapitre
THEN le choix est fait en 2 taps maximum
```

```gherkin
GIVEN un choix fait dans FO-09
WHEN Juju lance la session
THEN entrainement.demarrerMiniSession est appelé avec le chapitre et format choisis
```

**Implémentation :**

- [ ] Frontend : composant ChoixActiviteScreen (FO-09) — arbre pilier → chapitres
- [ ] Frontend : croisement contenu.listerPiliers + progression.obtenirAvancementChapitres (via F8)
- [ ] Backend : procédure suggestion.listerAlternatives (query, croise catalogue + états)
- [ ] Frontend : navigation FO-09 → FO-05/FO-06 via entrainement.demarrerMiniSession
- [ ] Tests : affichage arbre, 2 taps max, lancement session
- **Statut** : À faire

---

### S4 : Intégration suggestion sur l'accueil (FO-04)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** voir la suggestion dès l'ouverture avec un bouton Go,
**afin de** démarrer en 1 tap quand je suis fatiguée le soir.

**Critères d'acceptation :**

```gherkin
GIVEN l'accueil FO-04 affiché
WHEN la suggestion est chargée
THEN le libellé est affiché en 1 ligne (ex : "Poursuis Géométrie : 4 flashcards") avec un bouton Go visible sans scroll
```

```gherkin
GIVEN un chargement lent de la suggestion
WHEN le frontend attend la réponse
THEN un placeholder sobre s'affiche (pas d'écran blanc ni de spinner agressif)
```

**Implémentation :**

- [ ] Frontend : intégration suggestion.obtenirSuggestion au chargement de FO-04
- [ ] Frontend : affichage libellé + bouton Go + bouton Changer
- [ ] Frontend : état de chargement sobre (placeholder)
- [ ] Tests : affichage, chargement, bouton Go → exercices, bouton Changer → FO-09
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Moteur de suggestion contextuelle | TS | M (3 pts) | À faire |
| S2 | Acceptation de la suggestion (Go) | TS | S (2 pts) | À faire |
| S3 | Choix alternatif (Changer → FO-09) | US | M (3 pts) | À faire |
| S4 | Intégration suggestion sur l'accueil (FO-04) | US | S (2 pts) | À faire |

**Total** : 4 stories — 10 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J2 (suggestion + Go) | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 (suggestion cross-pilier) | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| bc-suggestion | [bc-suggestion](../../03-design/1-domain/bc-suggestion.md) |
| modèle Suggestion | [model-suggestion](../../03-design/1-domain/models/model-suggestion.md) |
| exigences suggestion | [req-suggest](../../03-design/0-requirements/fonctionnelles/req-suggest.md) |
| wireframes FO-04, FO-09 | [navigation](../../03-design/3-wireframes/navigation.md) |
| API suggestion | [suggestion.md](../../03-design/4-api/suggestion.md) |
