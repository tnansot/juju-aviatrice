# Spécification d'écran : Choix Activité

## Identifiant

**FO-09** — `/choix-activite` — [Voir le wireframe HTML](html-wireframes/fo-09-choix-activite.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J2 — Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) — Alternative 1

## Description fonctionnelle

Écran de sélection manuelle d'activité, accessible via « Changer d'activité » depuis l'accueil. Navigation en 2 phases : (1) choix du pilier (Sciences ou Psychotechniques), puis (2) choix du chapitre dans le pilier sélectionné. L'objectif est de rester simple et rapide (2 taps maximum), sans exposer un catalogue exhaustif.

## Règles d'affichage métier

- **2 taps max** : le parcours pilier → chapitre respecte la contrainte des 2 interactions maximum (REQ-SUGGEST-002).
- **États des chapitres** : chaque chapitre affiche son état (`en_cours`, `debloque`, `verrouille`). Les chapitres verrouillés sont visibles mais grisés et non cliquables (REQ-AVATAR-003).
- **Premier accès psy** : si `EtatOnboarding.premier_acces_psy_fait` = `false` et que Juju choisit le pilier Psy, elle est redirigée vers FO-10 (Psy Bienvenue) au lieu de voir directement la liste des chapitres.
- **Badge recommandé** : dans la liste psy, le type Logique porte un badge « Recommandé » si c'est le premier accès (REQ-CONTENU-007).

## Données affichées

| Information | Source | Note |
|---|---|---|
| Piliers | `Pilier[]` | 2 piliers fixes en M0 |
| Chapitres | `Chapitre[]` par pilier | Sciences : 6 chapitres, Psy : 2 types |
| État par chapitre | `EtatChapitre.etat` | `en_cours`, `debloque`, `verrouille` |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Chapitre Sciences (débloqué) | [FO-05 Flashcard](spec-ecran-flashcard.md) |
| Chapitre Psy (1er accès) | [FO-10 Psy Bienvenue](spec-ecran-psy-bienvenue.md) |
| Chapitre Psy (accès récurrent) | [FO-05 Flashcard](spec-ecran-flashcard.md) ou [FO-06 QCM](spec-ecran-qcm.md) |
| Retour | Phase 1 (choix pilier) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| exigence REQ-SUGGEST-002 | [Choix alternatif 2 taps](../0-requirements/fonctionnelles/req-suggest.md) |
| exigence REQ-AVATAR-003 | [Déblocage visible](../0-requirements/fonctionnelles/req-avatar.md) |
| exigence REQ-CONTENU-001 | [Organisation 2 piliers](../0-requirements/fonctionnelles/req-contenu.md) |
| exigence REQ-CONTENU-007 | [1er accès psy guidé](../0-requirements/fonctionnelles/req-contenu.md) |
| model Pilier | [Pilier](../1-domain/models/model-pilier.md) |
| model Chapitre | [Chapitre](../1-domain/models/model-chapitre.md) |
| model EtatChapitre | [EtatChapitre](../1-domain/models/model-etat-chapitre.md) |
| model EtatOnboarding | [EtatOnboarding](../1-domain/models/model-etat-onboarding.md) |
