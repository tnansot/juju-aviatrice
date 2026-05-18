# Spécification d'écran : Fiche Méthode

## Identifiant

**FO-11** — `/psy/fiche-methode` — [Voir le wireframe HTML](html-wireframes/fo-11-fiche-methode.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J3 — Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) — Étape 2

## Description fonctionnelle

Guide pédagogique court pour un type de test psychotechnique. Structure en 3 sections : *C'est quoi ?* (explication accessible), *Ce que ça évalue* (compétences ciblées), *Comment l'aborder* (conseils concrets). Lisible en moins de 3 minutes sur smartphone. L'objectif est de comprendre avant de s'entraîner, réduisant l'anxiété face à un format inconnu.

## Règles d'affichage métier

- **Contenu dynamique par type** : la fiche affiche les champs `FicheMethode.cest_quoi`, `ce_que_ca_evalue` et `comment_aborder` du type psy sélectionné (logique ou calcul mental).
- **Pas de chrono sur cet écran** : la fiche est une lecture libre, sans pression temporelle.
- **Toujours proposée avant les exercices psy** : lors du premier accès à un type psy, la fiche méthode est le passage obligé avant les exercices. Aux accès suivants, le bouton « S'entraîner » est toujours disponible mais la fiche n'est plus imposée.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Type psy | `FicheMethode.type_psy` | Affiché comme sous-titre (« Logique », « Calcul mental ») |
| C'est quoi ? | `FicheMethode.cest_quoi` | Paragraphe court |
| Ce que ça évalue | `FicheMethode.ce_que_ca_evalue` | 3-5 puces |
| Comment l'aborder | `FicheMethode.comment_aborder` | 3-5 conseils concrets |

## Transitions

| Action utilisateur | Destination |
|---|---|
| S'entraîner | [FO-06 QCM](spec-ecran-qcm.md) (exercices psy sans chrono) |
| Plus tard | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigence REQ-CONTENU-004 | [Fiche méthode par type psy](../0-requirements/fonctionnelles/req-contenu.md) |
| exigence REQ-SESSION-004 | [Mode sans chrono](../0-requirements/fonctionnelles/req-session.md) |
| model FicheMethode | [FicheMethode](../1-domain/models/model-fiche-methode.md) |
| model Chapitre | [Chapitre](../1-domain/models/model-chapitre.md) |
