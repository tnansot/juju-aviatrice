# Exigences : Suggestion intelligente

## Thème

**Suggestion intelligente** — Moteur de suggestion contextuelle qui minimise la décision à l'ouverture et guide l'utilisatrice vers la prochaine activité pertinente.

### Source

- **Journeys associés** : [J2 — Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md), [J3 — Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md)

## Exigences

### REQ-SUGGEST-001 [Must] : Suggestion contextuelle à chaque ouverture

À chaque ouverture de l'application, une suggestion d'activité est formulée en une ligne et accompagnée d'un bouton de démarrage immédiat. L'objectif est de permettre à Juju de commencer en 1 tap, sans avoir à naviguer dans un catalogue ou prendre une décision coûteuse quand elle est fatiguée.

**Vérification** : ouvrir l'app → une suggestion textuelle (ex : « Poursuis Géométrie : 4 flashcards ») et un bouton Go sont visibles sans scroll.

### REQ-SUGGEST-002 [Must] : Choix alternatif à la suggestion

L'utilisatrice peut refuser la suggestion proposée et choisir elle-même une activité via un parcours de sélection simple : pilier (Sciences ou Psy) → chapitre ou type d'exercice. Ce parcours de sélection ne doit pas exposer un catalogue exhaustif — il reste simple et rapide (2 taps maximum pour choisir).

**Vérification** : un bouton « Changer » ou « Autre chose » permet d'accéder à un choix alternatif ; l'alternative est sélectionnable en 2 interactions maximum.

### REQ-SUGGEST-003 [Must] : Suggestion par défaut (historique insuffisant)

Si l'historique d'usage est insuffisant pour personnaliser la suggestion (première ou deuxième ouverture post-onboarding), le système propose une suggestion par défaut prédéfinie et pertinente (typiquement : flashcard maths sur le premier chapitre du contenu).

**Vérification** : première ouverture post-onboarding → une suggestion pertinente apparaît malgré l'absence d'historique.

### REQ-SUGGEST-004 [Should] : Suggestion basée sur l'historique

La suggestion tient compte de l'historique d'usage (dernière activité, chapitres parcourus, nombre de sessions par pilier) pour proposer un enchaînement cohérent. Elle peut alterner sciences et psy, proposer un chapitre peu visité, ou suggérer de passer au pilier psychotechnique après plusieurs sessions sciences consécutives.

**Vérification** : après 3 sessions maths consécutives, la suggestion propose une session psy (ou un chapitre de physique peu visité).

### REQ-SUGGEST-005 [Should] : Suggestion de reprise après interruption

Si une session a été interrompue (fermeture de l'app en cours de mini-session), la suggestion suivante peut proposer de reprendre là où l'utilisatrice s'est arrêtée, sans mention culpabilisante de l'abandon.

**Vérification** : quitter en milieu de session, rouvrir → la suggestion propose de reprendre le même chapitre/format, sans message de type « tu n'as pas fini ».

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 (suggestion + Go) | [Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 (suggestion cross-pilier) | [Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| product brief — session courte 15 min | [Product Brief](../../../02-discovery/product-brief.md) |
