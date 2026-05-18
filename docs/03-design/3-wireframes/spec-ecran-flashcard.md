# Spécification d'écran : Flashcard

## Identifiant

**FO-05** — `/session/flashcard` — [Voir le wireframe HTML](html-wireframes/fo-05-flashcard.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J2 — Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) — Étape 3

## Description fonctionnelle

Écran d'exercice au format flashcard, utilisé dans les mini-sessions Sciences et Psychotechniques. Juju formule mentalement sa réponse, tape pour retourner la carte, lit la réponse et la correction expliquée. Aucune évaluation de la réponse mentale n'est demandée par le système. L'exercice compte comme effort dès le retournement.

## Règles d'affichage métier

- **Progression locale** : la topbar affiche le numéro d'exercice courant et le total de la mini-session (ex : « 2 / 4 »), pas un pourcentage ni un score.
- **Pas de chrono en flashcard** : le format flashcard n'a jamais de chronomètre visible, même si la mini-session est en mode chrono (le chrono est réservé aux QCM).
- **Bouton Suivant après flip** : le bouton « Suivant » n'apparaît qu'après retournement de la carte, forçant la lecture de la correction.
- **Correction expliquée** : chaque flashcard affiche le raisonnement attendu après retournement, pas seulement la réponse brute (REQ-SESSION-006).

## Données affichées

| Information | Source | Note |
|---|---|---|
| Nom du chapitre | `Chapitre.nom` | Affiché dans la topbar |
| Progression N / M | `ExerciceEnCours.ordre` / `MiniSession.exercices.length` | Ex : « 2 / 4 » |
| Question | `Exercice.enonce.face_question` | Face visible avant flip |
| Réponse | `Exercice.enonce.face_reponse` | Face visible après flip |
| Correction | `Exercice.correction` | Explication du raisonnement |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Suivant (exercice restant) | FO-05 Flashcard ou [FO-06 QCM](spec-ecran-qcm.md) selon le prochain exercice |
| Suivant (dernier exercice) | [FO-07 Bilan](spec-ecran-bilan.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| exigence REQ-SESSION-001 | [Mini-session 3-5 exercices](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-002 | [Format flashcard](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-006 | [Correction expliquée](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-008 | [Tolérance aux interruptions](../0-requirements/fonctionnelles/req-session.md) |
| model Exercice (flashcard) | [Exercice](../1-domain/models/model-exercice.md) |
| model ExerciceEnCours | [ExerciceEnCours](../1-domain/models/model-exercice-en-cours.md) |
| model MiniSession | [MiniSession](../1-domain/models/model-mini-session.md) |
| model Chapitre | [Chapitre](../1-domain/models/model-chapitre.md) |
