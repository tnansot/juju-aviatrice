# API Design — tRPC Procedures

> Point d'entrée de la spécification API du projet juju-aviatrice. Organise les procédures tRPC par bounded context, avec traçabilité vers les écrans, journeys et modèles de domaine.
> **2026-05-18** — Thomas (Papa) avec Claude

## Pourquoi tRPC et pas REST/OpenAPI

Le projet utilise **tRPC** (ADR-002) : typage end-to-end entre le frontend React et le backend Hono, sans schéma API séparé. Les contrats sont définis en TypeScript/Zod et partagés à la compilation. Ce document décrit le **design** des procédures — pas un schéma OpenAPI.

## Architecture du root router

```typescript
const appRouter = t.router({
  identite: identiteRouter,       // Generic — auth, device ID
  onboarding: onboardingRouter,   // Supporting — parcours bienvenue
  contenu: contenuRouter,         // Core — catalogue pédagogique
  suggestion: suggestionRouter,   // Supporting — recommandation 1 tap
  entrainement: entrainementRouter, // Core — sessions, exercices, bilans
  progression: progressionRouter, // Core — avatar, déblocages, suivi
});
```

**Middleware auth** : toutes les procédures passent par le middleware `X-Device-Id` sauf `identite.enregistrerDevice` et `identite.verifierDevice` (publiques).

## Inventaire des procédures

### Queries (lecture)

| Procédure | Router | Écrans | Spec |
|---|---|---|---|
| `identite.verifierDevice` | identite | Routing initial | [identite](identite.md) |
| `onboarding.obtenirEtat` | onboarding | Routing J1 | [onboarding](onboarding.md) |
| `contenu.listerPiliers` | contenu | FO-02, FO-09 | [contenu](contenu.md) |
| `contenu.obtenirChapitre` | contenu | FO-09 | [contenu](contenu.md) |
| `contenu.chargerExercices` | contenu | FO-05, FO-06 | [contenu](contenu.md) |
| `contenu.obtenirFicheMethode` | contenu | FO-11 | [contenu](contenu.md) |
| `contenu.obtenirFlashcardEchantillon` | contenu | FO-03 | [contenu](contenu.md) |
| `suggestion.obtenirSuggestion` | suggestion | FO-04 | [suggestion](suggestion.md) |
| `suggestion.listerAlternatives` | suggestion | FO-09 | [suggestion](suggestion.md) |
| `entrainement.obtenirBilan` | entrainement | FO-07 | [entrainement](entrainement.md) |
| `progression.obtenirProfil` | progression | FO-04 | [progression](progression.md) |
| `progression.obtenirAvancementChapitres` | progression | FO-09 | [progression](progression.md) |

### Mutations (écriture)

| Procédure | Router | Événement émis | Spec |
|---|---|---|---|
| `identite.enregistrerDevice` | identite | `device_identifie` | [identite](identite.md) |
| `onboarding.avancerEtape` | onboarding | `onboarding_complete` (étape 3) | [onboarding](onboarding.md) |
| `onboarding.sauter` | onboarding | `onboarding_complete` | [onboarding](onboarding.md) |
| `onboarding.marquerPremierAccesPsy` | onboarding | `premier_acces_psy` | [onboarding](onboarding.md) |
| `suggestion.accepter` | suggestion | `suggestion_acceptee` | [suggestion](suggestion.md) |
| `entrainement.demarrerMiniSession` | entrainement | — | [entrainement](entrainement.md) |
| `entrainement.soumettreReponse` | entrainement | `exercice_effectue` | [entrainement](entrainement.md) |
| `entrainement.retournerFlashcard` | entrainement | `exercice_effectue` | [entrainement](entrainement.md) |
| `entrainement.terminerMiniSession` | entrainement | `mini_session_terminee` | [entrainement](entrainement.md) |
| `entrainement.signalerInterruption` | entrainement | `session_interrompue` | [entrainement](entrainement.md) |

**Total** : 12 queries + 10 mutations = **22 procédures**.

## Matrice écrans → procédures

| Écran | Queries appelées | Mutations possibles |
|---|---|---|
| Routing initial | `identite.verifierDevice`, `onboarding.obtenirEtat` | `identite.enregistrerDevice` (1ère fois) |
| FO-01 Bienvenue | — | `onboarding.avancerEtape(1)`, `onboarding.sauter` |
| FO-02 Piliers | `contenu.listerPiliers` | `onboarding.avancerEtape(2)`, `onboarding.sauter` |
| FO-03 Flashcard onboarding | `contenu.obtenirFlashcardEchantillon` | `onboarding.avancerEtape(3)` |
| FO-04 Accueil | `suggestion.obtenirSuggestion`, `progression.obtenirProfil` | `suggestion.accepter` |
| FO-05 Flashcard | — (exercices déjà chargés) | `entrainement.retournerFlashcard` |
| FO-06 QCM | — (exercices déjà chargés) | `entrainement.soumettreReponse` |
| FO-07 Bilan | `entrainement.obtenirBilan` | — |
| FO-08 Déblocage | — (données dans réponse `terminerMiniSession`) | — |
| FO-09 Choix Activité | `suggestion.listerAlternatives` | `entrainement.demarrerMiniSession` |
| FO-10 Psy Bienvenue | — | `onboarding.marquerPremierAccesPsy` |
| FO-11 Fiche Méthode | `contenu.obtenirFicheMethode` | — |
| FO-12 Proposition Chrono | — | `entrainement.demarrerMiniSession(modeChrono: true)` |
| FO-13 Récap Psy | — (données locales) | — |
| FO-14 Accès Refusé | — | — |

## Flux transverses

### Flux 1 — Soir-semaine-smartphone (J2)

```
identite.verifierDevice → suggestion.obtenirSuggestion + progression.obtenirProfil
→ suggestion.accepter → [exercices chargés]
→ loop: soumettreReponse / retournerFlashcard (3-5x)
→ terminerMiniSession → obtenirBilan
→ [éventuellement: avatar_evolue / chapitre_debloque dans la réponse]
```

### Flux 2 — Première utilisation (J1)

```
identite.enregistrerDevice → identite.verifierDevice → onboarding.obtenirEtat
→ avancerEtape(1) → contenu.listerPiliers → avancerEtape(2)
→ contenu.obtenirFlashcardEchantillon → avancerEtape(3) [→ onboarding_complete]
→ suggestion.obtenirSuggestion + progression.obtenirProfil
```

### Flux 3 — Découverte psychotechniques (J3)

```
suggestion.listerAlternatives → onboarding.marquerPremierAccesPsy [→ premier_acces_psy]
→ contenu.obtenirFicheMethode → entrainement.demarrerMiniSession(format: qcm, modeChrono: false)
→ loop: soumettreReponse (3-5x) → terminerMiniSession
→ [proposition chrono] → demarrerMiniSession(modeChrono: true)
```

## Fichiers de cette spécification

| Fichier | Contenu |
|---|---|
| [schemas-partages](schemas-partages.md) | Types Zod partagés, middleware auth, codes d'erreur |
| [identite](identite.md) | Router identite — 2 procédures |
| [onboarding](onboarding.md) | Router onboarding — 4 procédures |
| [contenu](contenu.md) | Router contenu — 5 procédures |
| [suggestion](suggestion.md) | Router suggestion — 3 procédures |
| [entrainement](entrainement.md) | Router entrainement — 6 procédures |
| [progression](progression.md) | Router progression — 2 procédures (+4 réactions internes) |

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-002 stack (tRPC, Hono, React) | [adr-002](../2-architecture/adr/adr-002-stack-applicative.md) |
| ADR-005 authentification (device ID) | [adr-005](../2-architecture/adr/adr-005-authentification.md) |
| ADR-006 autorisation | [adr-006](../2-architecture/adr/adr-006-autorisation.md) |
| context map (6 BCs) | [context-map](../1-domain/context-map.md) |
| navigation (14 écrans) | [navigation](../3-wireframes/navigation.md) |
| journeys J1, J2, J3 | [J1](../../02-discovery/journeys/journey-premiere-utilisation.md), [J2](../../02-discovery/journeys/journey-soir-semaine-smartphone.md), [J3](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| langage ubiquitaire | [ubiquitous-language](../1-domain/ubiquitous-language.md) |
