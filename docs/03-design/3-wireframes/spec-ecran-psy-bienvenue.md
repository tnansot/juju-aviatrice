# Spécification d'écran : Psy — Bienvenue

## Identifiant

**FO-10** — `/psy/bienvenue` — [Voir le wireframe HTML](html-wireframes/fo-10-psy-bienvenue.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J3 — Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) — Étape 1

## Description fonctionnelle

Écran d'accueil du pilier Psychotechniques, affiché uniquement au premier accès. Présente les deux types de tests (Logique et Calcul mental) sous forme de cartes, avec une recommandation pour commencer par la logique. L'objectif est de désarmer la peur du premier contact avec un terrain inconnu, en proposant un point d'entrée balisé.

## Règles d'affichage métier

- **Affichage unique** : cet écran n'apparaît que si `EtatOnboarding.premier_acces_psy_fait` = `false`. Après la première visite, le flag passe à `true` et les accès suivants mènent directement au choix de type ou aux exercices.
- **Recommandation Logique** : la carte Logique porte un badge « Recommandé en 1er » pour orienter sans imposer (REQ-CONTENU-007). Juju reste libre de choisir Calcul mental.
- **Ton rassurant** : le message de bas de page rassure sur le libre choix et explique pourquoi la logique est un bon point de départ (plus visuelle).

## Transitions

| Action utilisateur | Destination |
|---|---|
| Carte Logique | [FO-11 Fiche Méthode](spec-ecran-fiche-methode.md) (logique) |
| Carte Calcul mental | [FO-11 Fiche Méthode](spec-ecran-fiche-methode.md) (calcul mental) |
| Retour à l'accueil | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigence REQ-CONTENU-007 | [1er accès psy guidé](../0-requirements/fonctionnelles/req-contenu.md) |
| exigence REQ-CONTENU-001 | [Organisation 2 piliers](../0-requirements/fonctionnelles/req-contenu.md) |
| model EtatOnboarding | [EtatOnboarding](../1-domain/models/model-etat-onboarding.md) |
| model Chapitre | [Chapitre](../1-domain/models/model-chapitre.md) |
