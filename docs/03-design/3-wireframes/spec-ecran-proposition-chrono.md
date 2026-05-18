# Spécification d'écran : Proposition Chrono

## Identifiant

**FO-12** — `/psy/proposition-chrono` — [Voir le wireframe HTML](html-wireframes/fo-12-proposition-chrono.html)

**Persona** : [Juju](../../02-discovery/personas/persona-juju-utilisatrice.md)
**Parcours** : [J3 — Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) — Étape 6

## Description fonctionnelle

Écran interstitiel proposant de passer au mode chronométré après une séquence d'exercices psy sans chrono. La durée est ajustable par incréments de 30 secondes. Le chrono est présenté comme un outil d'habituation au format concours, pas comme une épreuve. Le refus est sans conséquence.

## Règles d'affichage métier

- **Proposition optionnelle** : cet écran n'apparaît qu'après une séquence complète d'exercices psy sans chrono. Juju peut toujours décliner (« Plus tard ») sans message de relance (REQ-SESSION-004).
- **Durée par défaut indulgente** : 2 min 30 par défaut pour 5 questions — volontairement généreux pour ne pas stresser (REQ-SESSION-005).
- **Ajustement par pas** : incréments de ±30 secondes, borné entre 30 secondes et 10 minutes.
- **Message rassurant** : le texte de bas d'écran rappelle que le chrono sert à s'habituer, pas à stresser.

## Données affichées

| Information | Source | Note |
|---|---|---|
| Durée chrono | Valeur par défaut : 150 secondes | Ajustable par Juju, format M:SS |
| Nombre de questions | Fixe : 5 | Affiché dans la description |

## Transitions

| Action utilisateur | Destination |
|---|---|
| Lancer le chrono | [FO-06 QCM](spec-ecran-qcm.md) (mode chrono activé avec la durée choisie) |
| Plus tard | [FO-13 Récap Psy](spec-ecran-recap-psy.md) |

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigence REQ-SESSION-004 | [Mode sans chrono d'abord](../0-requirements/fonctionnelles/req-session.md) |
| exigence REQ-SESSION-005 | [Chrono paramétrable discret](../0-requirements/fonctionnelles/req-session.md) |
| model MiniSession | [MiniSession](../1-domain/models/model-mini-session.md) |
