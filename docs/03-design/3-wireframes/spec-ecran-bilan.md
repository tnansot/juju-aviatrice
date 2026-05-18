# Spécification d'écran : Bilan Mini-session

## Identifiant

**FO-07** — `/session/bilan` — [Voir le wireframe HTML](html-wireframes/fo-07-bilan.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J2 — Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) — Étape 4

## Description fonctionnelle

Écran de fin de mini-session. Résume l'effort fourni (nombre d'exercices faits, durée), montre l'état de l'avatar et la progression vers le prochain déblocage. Propose de continuer ou de s'arrêter. Le choix d'arrêter est accueilli par un message chaleureux sans relance.

## Règles d'affichage métier

- **Pas de score /N** : le bilan affiche uniquement le nombre d'exercices faits et la durée, jamais un ratio de réussite, un pourcentage ou une note (REQ-SESSION-007).
- **Barre de progression** : indique visuellement l'avancement vers le prochain déblocage de chapitre, basé sur `ProfilProgression.compteur_exercices` rapporté au seuil du prochain `EtatChapitre` verrouillé.
- **Message d'arrêt positif** : le bouton d'arrêt dit « Bonne nuit » (ou équivalent contextuel), jamais « Quitter » ou « Abandonner » (REQ-SESSION-009).
- **Déblocage intercalé** : si un seuil de déblocage est atteint pendant la session, FO-08 Déblocage s'affiche avant ce bilan.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Nombre d'exercices | `MiniSession.nombre_exercices_faits` | Entier |
| Durée | Calcul : fin − début de la mini-session | Format « N min » |
| Avatar | `Avatar.stade` | Visuel + message d'encouragement |
| Progression déblocage | `ProfilProgression.compteur_exercices` / seuil suivant | Barre de remplissage (%) |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Encore une session | [FO-04 Accueil](spec-ecran-accueil.md) |
| Bonne nuit | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| exigence REQ-SESSION-009 | [Bilan sobre](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-007 | [Scoring non-stigmatisant](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-010 | [Formulations positives](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-AVATAR-002 | [Progression effort](../0-requirements/fonctionnelles/req-avatar.md) |
| exigence REQ-AVATAR-004 | [Suivi non-anxiogène](../0-requirements/fonctionnelles/req-avatar.md) |
| model MiniSession | [MiniSession](../1-domain/models/model-mini-session.md) |
| model Avatar | [Avatar](../1-domain/models/model-avatar.md) |
| model ProfilProgression | [ProfilProgression](../1-domain/models/model-profil-progression.md) |
