# Spécification d'écran : Déblocage

## Identifiant

**FO-08** — `/session/deblocage` — [Voir le wireframe HTML](html-wireframes/fo-08-deblocage.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J2 — Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) — Étape 6

## Description fonctionnelle

Écran de célébration sobre affiché lorsque l'effort cumulé de Juju atteint le seuil de déblocage d'un chapitre verrouillé. Montre le nom du nouveau chapitre accessible et un message positif. L'écran n'est pas bloquant : les deux actions ramènent à l'accueil, Juju choisit si elle explore maintenant ou plus tard.

## Règles d'affichage métier

- **Déclenchement automatique** : cet écran s'intercale automatiquement entre le dernier exercice et le bilan lorsque `EtatChapitre.etat` passe de `verrouille` à `debloque` pendant la session.
- **Célébration sobre** : une icône de cadenas ouvert et un message court. Pas de modale agressive, pas de fanfare, pas d'animation bloquante (REQ-AVATAR-005).
- **Seuils atteignables** : le déblocage est calibré pour arriver en quelques sessions (3-5), pas un objectif lointain (REQ-AVATAR-003).

## Données affichées

| Information | Source | Note |
|---|---|---|
| Nom du chapitre | `Chapitre.nom` | Chapitre nouvellement débloqué |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Découvrir | [FO-04 Accueil](spec-ecran-accueil.md) |
| Plus tard | [FO-04 Accueil](spec-ecran-accueil.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| exigence REQ-AVATAR-003 | [Mécanisme de déblocage](../0-requirements/fonctionnelles/req-avatar.md) |
| exigence REQ-AVATAR-005 | [Célébration sobre](../0-requirements/fonctionnelles/req-avatar.md) |
| model EtatChapitre | [EtatChapitre](../1-domain/models/model-etat-chapitre.md) |
| model Chapitre | [Chapitre](../1-domain/models/model-chapitre.md) |
