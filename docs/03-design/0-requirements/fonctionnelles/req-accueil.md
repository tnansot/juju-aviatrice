# Exigences : Accueil et onboarding

## Thème

**Accueil et onboarding** — Premier contact de Juju avec l'application et écran d'accueil récurrent.

### Source

- **Journeys associés** : [J1 — Première utilisation](../../../02-discovery/journeys/journey-premiere-utilisation.md), [J2 — Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md)

## Exigences

### REQ-ACCUEIL-001 [Must] : Bienvenue personnalisée sans inscription

L'utilisatrice est accueillie par son prénom à la première ouverture de l'application. Aucune demande de compte, d'inscription, de mot de passe ou de questionnaire n'est requise. Le produit est mono-utilisateur : l'identité de Juju est implicite.

**Vérification** : à la première ouverture, l'écran affiche « Salut Juju » (ou formulation équivalente) sans aucun formulaire ni étape d'authentification.

### REQ-ACCUEIL-002 [Must] : Présentation des deux piliers

L'application présente les deux piliers de contenu — Sciences (maths + physique-chimie 1ère) et Psychotechniques (logique + calcul mental) — de manière accessible et non intimidante lors de l'onboarding. Une allusion à l'extension future du contenu est possible mais ne doit pas surcharger l'écran.

**Vérification** : l'onboarding contient un écran qui nomme et présente les deux piliers en quelques mots et un visuel sobre, sans catalogue détaillé.

### REQ-ACCUEIL-003 [Must] : Exercice d'échantillon en onboarding

L'onboarding inclut un exercice d'échantillon court (flashcard maths sur un chapitre familier) qui permet à Juju de goûter au format sans être évaluée ni notée. La restitution est strictement neutre : pas de verdict bonne/mauvaise réponse de manière stigmatisante.

**Vérification** : l'onboarding propose une flashcard maths ; après retournement, le feedback ne comporte ni croix rouge, ni score, ni formulation négative.

### REQ-ACCUEIL-004 [Must] : Onboarding sauteable à tout moment

L'utilisatrice peut sauter l'onboarding à n'importe quelle étape et arriver directement à l'écran d'accueil. Le bouton de saut est visible et accessible à chaque écran de l'onboarding.

**Vérification** : un bouton « passer » ou équivalent est visible à chaque étape de l'onboarding ; l'activer mène à l'écran d'accueil.

### REQ-ACCUEIL-005 [Must] : Tolérance aux interruptions d'onboarding

Si l'utilisatrice ferme l'application pendant l'onboarding, la prochaine ouverture ne reprend pas l'onboarding — elle arrive directement à l'écran d'accueil. Aucun message culpabilisant (« tu as quitté trop tôt », « reprends ton onboarding ») n'est affiché. L'onboarding reste accessible si Juju veut le revoir plus tard, mais sans rappel insistant.

**Vérification** : fermer l'app en étape 2 de l'onboarding, rouvrir → écran d'accueil direct, aucun message de reproche.

### REQ-ACCUEIL-006 [Must] : Écran d'accueil récurrent avec avatar

L'écran d'accueil, affiché à chaque ouverture post-onboarding, montre l'avatar dans son état courant et permet de démarrer une session d'entraînement immédiatement. C'est le point d'entrée unique vers l'usage quotidien.

**Vérification** : à chaque ouverture post-onboarding, l'avatar et un point d'entrée vers l'entraînement (suggestion + bouton Go) sont visibles sans scroll.

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J1 | [Première utilisation](../../../02-discovery/journeys/journey-premiere-utilisation.md) |
| journey J2 | [Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| product brief | [Product Brief](../../../02-discovery/product-brief.md) |
| vision produit — pilier 4 (engagement par le jeu) | [Vision produit](../../../01-strategy/vision-produit.md) |
