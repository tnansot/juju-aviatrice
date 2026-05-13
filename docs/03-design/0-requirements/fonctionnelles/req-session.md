# Exigences : Session d'entraînement

## Thème

**Session d'entraînement** — Exécution des exercices, formats, modes chrono, corrections et bilans.

### Source

- **Journeys associés** : [J2 — Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md), [J3 — Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md)

## Exigences

### REQ-SESSION-001 [Must] : Mini-session de 3 à 5 micro-exercices enchaînés

Une mini-session d'entraînement enchaîne 3 à 5 micro-exercices sans interruption visuelle inutile. Chaque exercice dure quelques secondes à 2 minutes maximum. L'enchaînement est fluide et adapté à une attention courte en fin de journée.

**Vérification** : lancer une session → 3 à 5 exercices s'enchaînent sans écran intermédiaire parasite, chacun réalisable en moins de 2 minutes.

### REQ-SESSION-002 [Must] : Format flashcard (question → réponse à retourner)

Le format flashcard présente une question (formule, concept, définition) sur une face et la réponse sur l'autre. L'utilisatrice formule mentalement sa réponse avant de retourner la carte pour voir la correction. Aucune évaluation de la réponse mentale n'est imposée par le système.

**Vérification** : un exercice flashcard affiche la question seule, puis la réponse complète au tap. Le système ne demande pas si la réponse mentale était correcte.

### REQ-SESSION-003 [Must] : Format QCM (sélection d'une réponse parmi les choix)

Le format QCM présente une question et plusieurs choix de réponse (typiquement 3 à 5). L'utilisatrice sélectionne une réponse. Après validation, la bonne réponse est révélée avec une correction expliquée.

**Vérification** : un exercice QCM affiche les options, accepte une sélection, et affiche la correction avec le raisonnement après validation.

### REQ-SESSION-004 [Must] : Mode sans chronomètre pour l'entraînement psy

Les exercices psychotechniques sont accessibles sans chronomètre activé par défaut. Ce mode permet à l'utilisatrice de prendre le temps de comprendre la méthode et le raisonnement avant de s'entraîner en conditions réelles. Le passage au mode chronométré est toujours optionnel, proposé en fin de séquence sans chrono.

**Vérification** : les exercices psy de premier niveau sont accessibles sans chrono visible. Le chrono n'est proposé qu'après une séquence d'exercices libres.

### REQ-SESSION-005 [Must] : Mode chronométré paramétrable et discret

Un mode chronométré est disponible pour les QCM (sciences et psy). Le chronomètre est paramétrable (durée ajustable par l'utilisatrice) et sa présentation visuelle est discrète : pas de tic-tac sonore, pas d'animation stressante, pas de compte à rebours anxiogène au dernier tiers. La durée par défaut est indulgente.

**Vérification** : lancer un QCM chrono → le chrono est visible mais sobre, la durée est modifiable avant le lancement, pas de signal sonore.

### REQ-SESSION-006 [Must] : Correction expliquée après chaque exercice

Après chaque exercice (flashcard retournée, QCM validé, exercice psy terminé), une correction expliquée est proposée. La correction détaille le raisonnement attendu, pas seulement la bonne réponse. La formulation est neutre et pédagogique.

**Vérification** : terminer un exercice → une explication du raisonnement apparaît (1-3 lignes), sans formulation du type « faux », « raté » ou « incorrect ».

### REQ-SESSION-007 [Must] : Scoring non-stigmatisant

Aucun score global, note sur N, pourcentage ou classement n'est affiché à l'utilisatrice. Le récapitulatif en fin de session mentionne le nombre d'exercices faits et éventuellement le temps passé, mais pas un score. La formulation du récap est factuelle et positive (ex : « 3 réponses justes sur 5 — c'est ton 1er chrono, l'idée c'est qu'il devienne familier »), jamais évaluative.

**Vérification** : fin de session → le bilan ne contient ni note /20, ni pourcentage, ni graphique de performance comparative.

### REQ-SESSION-008 [Must] : Tolérance aux interruptions de session

L'utilisatrice peut quitter une session à tout moment (fermeture de l'app, changement d'écran). Les exercices déjà effectués sont comptabilisés dans l'historique et contribuent à la progression de l'avatar. La prochaine ouverture n'affiche aucun message sur la session inachevée (pas de « tu n'as pas terminé »).

**Vérification** : quitter en cours de session → les exercices faits comptent dans la progression, prochaine ouverture sans reproche ni mention de la session abandonnée.

### REQ-SESSION-009 [Must] : Bilan sobre de fin de session

En fin de mini-session (3-5 exercices), un bilan sobre est affiché : nombre d'exercices faits, éventuellement temps passé, progression de l'avatar si un seuil a été atteint. L'utilisatrice peut enchaîner une autre session ou s'arrêter. Le choix d'arrêter est accueilli par un message neutre et chaleureux (ex : « À demain »), sans relance ni notification programmée.

**Vérification** : fin de session → bilan visible, choix « encore » / « arrêter » affiché. Choisir d'arrêter → message positif, pas de relance.

### REQ-SESSION-010 [Must] : Formulations exclusivement positives et bienveillantes

Tous les messages et feedback de l'application (corrections, bilans, suggestions, messages d'erreur, relances) utilisent des formulations positives et encourageantes. Aucun vocabulaire négatif ou culpabilisant n'est toléré (interdits : « échec », « raté », « mauvaise réponse », « tu as échoué », « tu n'as pas fini », « en retard »). La charte de ton valorise l'effort et le progrès, jamais le score ni la comparaison.

**Vérification** : aucune chaîne de caractères de l'application ne contient de formulation négative ou culpabilisante. Un audit de toutes les chaînes de texte confirme le respect de la charte.

### REQ-SESSION-011 [Could] : Marquage pour réapparition (répétition espacée)

Les exercices auxquels l'utilisatrice a mal répondu peuvent être marqués pour réapparition dans une session ultérieure (logique de répétition espacée légère). Ce marquage est optionnel en M0 et ne doit pas alourdir l'expérience.

**Vérification** : un exercice mal répondu réapparaît dans une session future (éventuellement avec un espacement croissant).

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 | [Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| product brief — M0 formats courts | [Product Brief](../../../02-discovery/product-brief.md) |
| vision produit — pilier 3 (UX bienveillante), règle d'or | [Vision produit](../../../01-strategy/vision-produit.md) |
| initiative I-3.1.1 (charte de ton) | [Initiatives](../../../01-strategy/initiatives.md) |
