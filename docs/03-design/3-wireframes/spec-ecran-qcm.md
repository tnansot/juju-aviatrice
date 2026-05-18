# Spécification d'écran : QCM

## Identifiant

**FO-06** — `/session/qcm` — [Voir le wireframe HTML](html-wireframes/fo-06-qcm.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J2 — Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) — Étape 3 / [J3 — Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) — Étapes 4 et 7

## Description fonctionnelle

Écran d'exercice au format QCM, utilisé dans les mini-sessions Sciences et Psychotechniques. Juju lit l'énoncé, sélectionne une réponse parmi 3-5 choix, valide, puis découvre la correction expliquée avec la bonne réponse mise en évidence. Le chronomètre est optionnel, discret et paramétrable.

## Règles d'affichage métier

- **Chrono conditionnel** : le chrono n'apparaît que si `MiniSession.mode_chrono` = `true`. Quand visible, il est sobre (texte monospace, pas d'animation stressante ni de changement de couleur au dernier tiers). Pas de signal sonore (REQ-SESSION-005).
- **Sélection exclusive** : une seule réponse sélectionnable à la fois. Le bouton « Valider » est désactivé tant qu'aucun choix n'est fait.
- **Correction post-validation** : après validation, la bonne réponse est mise en évidence (bordure verte), le choix incorrect éventuel est marqué discrètement (gris, pas de croix rouge). La correction expliquée apparaît dans un panneau dédié (REQ-SESSION-006).
- **Formulations neutres** : jamais de « faux », « raté » ou « mauvaise réponse ». Le panneau correction s'intitule « Explication » (REQ-SESSION-010).
- **Post-validation verrouillée** : après validation, les choix ne sont plus cliquables.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Nom du chapitre | `Chapitre.nom` | Topbar |
| Progression N / M | `ExerciceEnCours.ordre` / `MiniSession.exercices.length` | Ex : « 3 / 4 » |
| Chrono | `MiniSession.duree_chrono` restant | Format M:SS, affiché seulement si mode_chrono = true |
| Énoncé | `Exercice.enonce.question` | Texte de la question |
| Choix | `Exercice.enonce.choix[]` | 3-5 options, ordre tel que défini |
| Correction | `Exercice.correction` | Explication du raisonnement |

## Cas d'erreur et états métier

- **Chrono expiré** : si le temps imparti est écoulé, la réponse en cours (si sélectionnée) est validée automatiquement ; sinon, l'exercice est marqué comme `saute` et la correction s'affiche quand même. Pas de message punitif.

## Transitions

| Action utilisateur | Destination |
|---|---|
| Suivant (exercice restant) | FO-06 QCM ou [FO-05 Flashcard](spec-ecran-flashcard.md) selon le prochain exercice |
| Suivant (dernier exercice) | [FO-07 Bilan](spec-ecran-bilan.md) ou [FO-13 Récap Psy](spec-ecran-recap-psy.md) selon le contexte |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigence REQ-SESSION-001 | [Mini-session 3-5 exercices](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-003 | [Format QCM](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-005 | [Chrono paramétrable discret](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-006 | [Correction expliquée](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-007 | [Scoring non-stigmatisant](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-010 | [Formulations positives](../0-requirements/fonctionnelles/req-session.md) |
| model Exercice (QCM) | [Exercice](../1-domain/models/model-exercice.md) |
| model ExerciceEnCours | [ExerciceEnCours](../1-domain/models/model-exercice-en-cours.md) |
| model MiniSession | [MiniSession](../1-domain/models/model-mini-session.md) |
| model Chapitre | [Chapitre](../1-domain/models/model-chapitre.md) |
