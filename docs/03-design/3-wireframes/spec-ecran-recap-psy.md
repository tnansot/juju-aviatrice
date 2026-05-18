# Spécification d'écran : Récap Séquence Psy

## Identifiant

**FO-13** — `/psy/recap` — [Voir le wireframe HTML](html-wireframes/fo-13-recap-psy.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J3 — Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) — Étape 8

## Description fonctionnelle

Bilan de la première séquence complète sur un type psychotechnique. Résume les étapes franchies sous forme de checklist (fiche lue, exercices sans chrono, mini-QCM chrono optionnel). Montre la progression de l'avatar et propose d'explorer l'autre type psy ou de revenir à l'accueil.

## Règles d'affichage métier

- **Checklist factuelle** : chaque étape est cochée si effectuée. Le contenu du QCM chrono est factuel (« 3 justes sur 5, en 1 min 47 ») — pas un score en pourcentage ni une évaluation (REQ-SESSION-007).
- **QCM chrono optionnel** : si Juju a décliné le chrono (FO-12 → Plus tard), la ligne QCM chrono est absente ou marquée « Non essayé » sans jugement.
- **Suggestion cross-pilier** : le bouton principal propose d'essayer l'autre type psy, favorisant l'alternance (REQ-SUGGEST-004).
- **Avatar progression** : message sobre indiquant que le compagnon a exploré un nouveau monde.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Checklist étapes | Calculé depuis la session | Fiche lue, exos sans chrono, QCM chrono (si fait) |
| Résultat QCM chrono | `MiniSession` (chrono) | Factuel : « N justes sur M, en X min Y » |
| Avatar | `Avatar.stade` | Visuel + message |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Essayer l'autre type psy | [FO-10 Psy Bienvenue](spec-ecran-psy-bienvenue.md) (ou directement FO-11 si premier_acces_psy déjà fait) |
| Retour à l'accueil | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigence REQ-SESSION-009 | [Bilan sobre](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-007 | [Scoring non-stigmatisant](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-AVATAR-002 | [Progression effort](../0-requirements/fonctionnelles/req-avatar.md) |
| model Avatar | [Avatar](../1-domain/models/model-avatar.md) |
| model MiniSession | [MiniSession](../1-domain/models/model-mini-session.md) |
| model ProfilProgression | [ProfilProgression](../1-domain/models/model-profil-progression.md) |
