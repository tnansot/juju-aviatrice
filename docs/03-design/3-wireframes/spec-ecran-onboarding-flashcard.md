# Spécification d'écran : Onboarding — Mini-exercice

## Identifiant

**FO-03** — `/onboarding/flashcard` — [Voir le wireframe HTML](html-wireframes/fo-03-onboarding-flashcard.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J1 — Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) — Étapes 3-4-5

## Description fonctionnelle

Troisième et dernière étape de l'onboarding. Juju découvre le format flashcard via un exercice d'échantillon maths (dérivée de x²). L'écran a deux phases : (1) la flashcard avec retournement, puis (2) un message de progression avatar montrant que l'effort a déjà fait avancer son compagnon. L'objectif est de donner un premier goût sans évaluation ni pression.

## Règles d'affichage métier

- **Feedback strictement neutre** : après retournement, aucun verdict bonne/mauvaise réponse. La réponse mentale de Juju n'est ni demandée ni évaluée par le système (REQ-ACCUEIL-003).
- **Progression avatar immédiate** : le message « Ton avatar a fait un premier pas » apparaît après la flashcard, montrant que l'exercice compte comme effort dès l'onboarding (REQ-AVATAR-002).
- **Exercice prédéfini** : l'exercice d'onboarding est toujours le même (hardcodé), pas issu du moteur de suggestion.
- **Marquage onboarding** : à la fin de cet écran, `EtatOnboarding.etat` passe à `complete`.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Question flashcard | Hardcodé (onboarding) | « Quelle est la dérivée de x² ? » |
| Réponse + correction | Hardcodé (onboarding) | « 2x » + explication nxⁿ⁻¹ |
| Avatar stade | `Avatar.stade` = 1 | Affiché comme « Stade 1+ » pour signifier le progrès |

## Transitions

| Action utilisateur | Destination |
|---|---|
| C'est parti (après progression) | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J1 | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| exigence REQ-ACCUEIL-003 | [Exercice d'échantillon](../0-requirements/fonctionnelles/req-accueil.md) |
| exigence REQ-SESSION-002 | [Format flashcard](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-AVATAR-002 | [Progression basée sur l'effort](../0-requirements/fonctionnelles/req-avatar.md) |
| model Exercice | [Exercice](../1-domain/models/model-exercice.md) |
| model Avatar | [Avatar](../1-domain/models/model-avatar.md) |
| model EtatOnboarding | [EtatOnboarding](../1-domain/models/model-etat-onboarding.md) |
