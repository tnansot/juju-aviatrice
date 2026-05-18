# Spécification d'écran : Onboarding — Bienvenue

## Identifiant

**FO-01** — `/onboarding/bienvenue` — [Voir le wireframe HTML](html-wireframes/fo-01-onboarding-bienvenue.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J1 — Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) — Étape 1

## Description fonctionnelle

Premier écran affiché à Juju lors de sa toute première ouverture de l'app (via le lien d'invitation). L'objectif est de créer un contact chaleureux et immédiat : prénom affiché, avatar à l'état initial, message court. Aucune inscription, aucun formulaire. L'identité mono-utilisateur est implicite (device ID généré silencieusement en arrière-plan).

## Règles d'affichage métier

- **Affichage conditionnel** : cet écran n'apparaît que si `EtatOnboarding.etat` = `non_demarre`. Si l'onboarding est déjà complété, sauté, ou interrompu → redirection vers FO-04 Accueil.
- **Avatar stade initial** : l'avatar est toujours affiché au stade 1 (état initial) sur cet écran.
- **Bouton Passer visible** : le saut est accessible dès ce premier écran (REQ-ACCUEIL-004).

## Données affichées

| Information | Source | Note |
|---|---|---|
| Prénom | Hardcodé « Juju » | App mono-utilisateur, pas de champ dynamique en M0 |
| Avatar | `Avatar.stade` = 1 | Toujours stade 1 à la première ouverture |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Continuer | [FO-02 Onboarding Piliers](spec-ecran-onboarding-piliers.md) |
| Passer | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J1 | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| exigence REQ-ACCUEIL-001 | [Bienvenue personnalisée](../0-requirements/fonctionnelles/req-accueil.md) |
| exigence REQ-ACCUEIL-004 | [Onboarding sauteable](../0-requirements/fonctionnelles/req-accueil.md) |
| model EtatOnboarding | [EtatOnboarding](../1-domain/models/model-etat-onboarding.md) |
| model Avatar | [Avatar](../1-domain/models/model-avatar.md) |
