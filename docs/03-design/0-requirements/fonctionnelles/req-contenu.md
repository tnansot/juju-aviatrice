# Exigences : Catalogue et contenu pédagogique

## Thème

**Catalogue et contenu pédagogique** — Organisation du contenu par piliers, chapitres et formats, et contenu pédagogique psychotechnique.

### Source

- **Journeys associés** : [J2 — Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md), [J3 — Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md)

## Exigences

### REQ-CONTENU-001 [Must] : Organisation en deux piliers (Sciences + Psy)

Le contenu est structuré en deux piliers distincts : **Sciences** (maths + physique-chimie 1ère) et **Psychotechniques** (logique + calcul mental). La navigation permet de distinguer clairement les deux piliers à tout moment.

**Vérification** : depuis l'écran d'accueil ou le catalogue, l'utilisatrice peut identifier et accéder aux deux piliers de manière distincte.

### REQ-CONTENU-002 [Must] : 3 chapitres maths + 3 chapitres physique-chimie 1ère

En M0, le pilier Sciences couvre exactement 3 chapitres de spécialité maths 1ère et 3 chapitres de spécialité physique-chimie 1ère, choisis avec Juju. Les chapitres sont sélectionnés pour leur variété typologique (algèbre + analyse + géométrie en maths ; mécanique + ondes ou chimie + électrique en physique). L'identification précise des chapitres est une décision Plan, pas Design.

**Vérification** : 6 chapitres sont accessibles au total, correctement répartis (3 maths, 3 physique-chimie), avec des intitulés correspondant au programme officiel BO de 1ère.

### REQ-CONTENU-003 [Must] : Deux formats par chapitre scientifique (flashcard + QCM chrono)

Chaque chapitre scientifique est disponible dans 2 formats d'exercice adaptés à une session courte smartphone : flashcards (ancrage des formules et concepts clés) et QCM chronométré court (5 à 10 questions). Les exercices de recherche longs sont exclus de M0.

**Vérification** : pour chaque chapitre scientifique, au moins des flashcards et un QCM court chronométré sont disponibles et fonctionnels.

### REQ-CONTENU-004 [Must] : Fiche méthode par type psychotechnique

Le pilier Psychotechniques comprend une fiche méthode par type de test couvert en M0 (logique, calcul mental). Chaque fiche explique en termes simples et accessibles : ce qu'est le test, ce qu'il évalue concrètement, et comment l'aborder (3-5 conseils concrets). Le ton est aligné sur la charte de bienveillance. La fiche est courte, lisible sur smartphone, et ne déborde pas.

**Vérification** : 2 fiches méthode existent (logique + calcul mental), chacune lisible intégralement sur smartphone en moins de 3 minutes, sans jargon technique inutile.

### REQ-CONTENU-005 [Must] : ≥5 exercices par type psy avec correction expliquée

Le pilier Psychotechniques comprend au moins 5 exercices par type de test (5 logique + 5 calcul mental). Chaque exercice est accompagné d'une correction expliquée qui détaille le raisonnement attendu, pas seulement la bonne réponse. Les exercices couvrent une variété de typologies au sein de chaque type (séries, analogies, syllogismes pour la logique ; différents niveaux de complexité pour le calcul mental).

**Vérification** : 10 exercices psychotechniques minimum (5+5), chacun avec une correction pédagogique complète.

### REQ-CONTENU-006 [Won't — M1] : Exercices de recherche longs

Des exercices de recherche longs (10-30 min, raisonnement écrit, plusieurs sous-questions) seront disponibles en M1 pour les sessions ordinateur. Ils sont exclus du périmètre M0 (smartphone session courte uniquement).

**Vérification** : N/A en M0.

### REQ-CONTENU-007 [Must] : Premier accès au pilier psy signalé et guidé

Lorsque l'utilisatrice accède au pilier Psychotechniques pour la première fois, le système signale explicitement cette première fois et l'oriente vers la logique comme premier type recommandé (sans obligation). Ce guidage vise à désarmer la peur du premier contact avec un terrain inconnu.

**Vérification** : au 1er accès au pilier psy, un message d'accueil spécifique apparaît et la logique est proposée en premier choix recommandé. Au 2e accès, ce message n'apparaît plus.

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 | [Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 | [Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| product brief — périmètre M0 | [Product Brief](../../../02-discovery/product-brief.md) |
| vision produit — pilier 1 (scientifique) + pilier 2 (psy) | [Vision produit](../../../01-strategy/vision-produit.md) |
| OKRs — KR-2.1.1, KR-2.1.2 | [OKRs](../../../01-strategy/okrs.md) |
