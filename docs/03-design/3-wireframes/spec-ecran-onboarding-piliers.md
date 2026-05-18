# Spécification d'écran : Onboarding — Piliers

## Identifiant

**FO-02** — `/onboarding/piliers` — [Voir le wireframe HTML](html-wireframes/fo-02-onboarding-piliers.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J1 — Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) — Étape 2

## Description fonctionnelle

Deuxième étape de l'onboarding. Présente les deux piliers de contenu (Sciences et Psychotechniques) de manière accessible et non intimidante. Chaque pilier est décrit en une carte sobre avec icône, nom et phrase courte. Une mention discrète indique que le contenu s'enrichira avec le temps, sans surcharger.

## Règles d'affichage métier

- **Contenu statique** : les noms et descriptions des piliers sont fixes en M0 (pas de chargement dynamique du catalogue).
- **Note future discrète** : la mention « D'autres contenus arriveront » est présente mais visuellement secondaire, conformément à REQ-ACCUEIL-002.

## Transitions

| Action utilisateur | Destination |
|---|---|
| Continuer | [FO-03 Onboarding Flashcard](spec-ecran-onboarding-flashcard.md) |
| Passer | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J1 | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| exigence REQ-ACCUEIL-002 | [Présentation des deux piliers](../0-requirements/fonctionnelles/req-accueil.md) |
| exigence REQ-ACCUEIL-004 | [Onboarding sauteable](../0-requirements/fonctionnelles/req-accueil.md) |
| model Pilier | [Pilier](../1-domain/models/model-pilier.md) |
