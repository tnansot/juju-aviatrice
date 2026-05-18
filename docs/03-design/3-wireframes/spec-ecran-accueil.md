# Spécification d'écran : Accueil

## Identifiant

**FO-04** — `/accueil` — [Voir le wireframe HTML](html-wireframes/fo-04-accueil.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J2 — Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) — Étape 1

## Description fonctionnelle

Écran d'accueil récurrent, affiché à chaque ouverture post-onboarding. Point d'entrée unique vers l'usage quotidien. Montre l'avatar dans son état courant, une suggestion contextuelle d'activité avec bouton Go (démarrage en 1 tap), et un accès au choix alternatif. Des compteurs d'effort sobres (sessions, exercices) sont affichés en bas sans hiérarchie de performance.

## Règles d'affichage métier

- **Suggestion contextuelle** : la carte suggestion affiche `Suggestion.libelle` calculé à chaque ouverture selon les 4 stratégies (continuité, alternance, reprise, défaut). En cas d'historique insuffisant, la suggestion par défaut s'applique : flashcard maths du 1er chapitre (REQ-SUGGEST-003).
- **Absence jamais mentionnée** : aucun message relatif à la durée écoulée depuis la dernière session. L'écran est identique après 1 jour ou 30 jours d'absence (REQ-AVATAR-006).
- **Avatar toujours visible sans scroll** : avatar + suggestion + bouton Go sont au-dessus de la ligne de flottaison mobile (REQ-ACCUEIL-006).
- **Compteurs d'effort** : affichent le cumul total, jamais de moyenne, ratio ou comparaison temporelle.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Avatar (visuel + stade) | `Avatar.stade` | Stade 1 à 4 avec libellé (ex : « Exploratrice ») |
| Suggestion texte | `Suggestion.libelle` | 1 ligne, ex : « Poursuis Géométrie : 4 flashcards » |
| Nombre de sessions | `ProfilProgression.compteur_mini_sessions` | Entier affiché tel quel |
| Nombre d'exercices | `ProfilProgression.compteur_exercices` | Entier affiché tel quel |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Go (bouton suggestion) | [FO-05 Flashcard](spec-ecran-flashcard.md) ou [FO-06 QCM](spec-ecran-qcm.md) selon `Suggestion.format` |
| Changer d'activité | [FO-09 Choix Activité](spec-ecran-choix-activite.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| exigence REQ-ACCUEIL-006 | [Accueil récurrent avec avatar](../0-requirements/fonctionnelles/req-accueil.md) |
| exigence REQ-SUGGEST-001 | [Suggestion contextuelle](../0-requirements/fonctionnelles/req-suggest.md) |
| exigence REQ-SUGGEST-002 | [Choix alternatif](../0-requirements/fonctionnelles/req-suggest.md) |
| exigence REQ-SUGGEST-003 | [Suggestion par défaut](../0-requirements/fonctionnelles/req-suggest.md) |
| exigence REQ-AVATAR-001 | [Avatar progressif](../0-requirements/fonctionnelles/req-avatar.md) |
| exigence REQ-AVATAR-004 | [Suivi non-anxiogène](../0-requirements/fonctionnelles/req-avatar.md) |
| exigence REQ-AVATAR-006 | [Absence jamais mentionnée](../0-requirements/fonctionnelles/req-avatar.md) |
| model Avatar | [Avatar](../1-domain/models/model-avatar.md) |
| model ProfilProgression | [ProfilProgression](../1-domain/models/model-profil-progression.md) |
| model Suggestion | [Suggestion](../1-domain/models/model-suggestion.md) |
