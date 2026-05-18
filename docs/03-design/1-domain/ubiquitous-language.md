# Langage ubiquitaire — juju-aviatrice

> Glossaire métier centralisé. Chaque terme est la référence dans le code, la doc et les échanges.
> **2026-05-17** — Thomas (Papa) avec Claude

## Convention

- Termes classés par **ordre alphabétique**
- **Synonymes à éviter** : termes ambigus ou incorrects à ne pas utiliser
- Le terme **préféré** est celui utilisé partout (code, doc, échanges)

## Glossaire

### A

#### Avatar

- **Définition** : Représentation visuelle de la progression de Juju. Possède 3-4 états visuellement distincts (M0). La progression est basée sur l'**effort** (exercices traversés), jamais sur le score.
- **Synonymes à éviter** : personnage, mascotte, badge
- **Exemple** : après 5 exercices effectués, l'avatar passe du stade 1 au stade 2 avec un changement visuel perceptible.

### B

#### Bilan

- **Définition** : Écran sobre affiché en fin de mini-session. Mentionne le nombre d'exercices faits et le temps passé, sans note /N ni pourcentage. Peut déclencher une célébration si un seuil de progression est atteint.
- **Synonymes à éviter** : score, résultat, évaluation, récap de performance
- **Exemple** : « 4 exercices faits — ton avatar a progressé ! Encore une mini-session ou bonne nuit ? »

### C

#### Calcul mental

- **Définition** : Type de test psychotechnique évaluant la vitesse et la précision du calcul sans support. Second type couvert en M0 (après logique). Structure identique : fiche méthode → exercices sans chrono → QCM chrono.
- **Synonymes à éviter** : arithmétique, maths mentales

#### Célébration

- **Définition** : Animation légère et/ou message positif accompagnant un moment de progression (changement d'état de l'avatar, déblocage). Brève (2-3 secondes), ne bloque pas l'usage, alignée sur la charte de ton. Jamais de modale agressive ni de fanfare.
- **Synonymes à éviter** : récompense, trophée, achievement
- **Exemple** : l'avatar s'anime brièvement + message « Nouveau chapitre disponible : Mécanique ».

#### Chapitre

- **Définition** : Unité de contenu au sein d'un pilier. Correspond à un chapitre du programme BO (pilier Sciences) ou à un type de test (pilier Psychotechniques). En M0 : 3 chapitres maths + 3 physique-chimie + 2 types psy (logique, calcul mental).
- **Synonymes à éviter** : module, leçon, cours, thème (réservé aux exigences)
- **Exemple** : « Géométrie dans le plan » (maths 1ère), « Mécanique newtonienne » (physique 1ère).

#### Charte de ton

- **Définition** : Ensemble de règles de formulation qui garantit que tout message de l'app est positif, encourageant et non culpabilisant. Découle de la règle d'or. Interdit : « échec », « raté », « mauvaise réponse », « tu n'as pas fini », « en retard ». Valorise l'effort et le progrès.
- **Synonymes à éviter** : guide éditorial, tone of voice
- **Exemple** : au lieu de « Faux — la bonne réponse était X », dire « C'était la réponse attendue : X. On continue. »

#### Correction

- **Définition** : Explication pédagogique affichée après un exercice. Détaille le raisonnement attendu (pas seulement la bonne réponse). Formulation neutre, alignée sur la charte de ton.
- **Synonymes à éviter** : verdict, notation, évaluation
- **Exemple** : « Le raisonnement ici est une suite géométrique de raison 2. Chaque terme est le double du précédent. »

### D

#### Déblocage

- **Définition** : Mécanisme par lequel du contenu initialement verrouillé (chapitres, formats) devient accessible après un seuil d'effort atteint. Le seuil est atteignable en quelques sessions. Les contenus verrouillés sont visibles mais marqués « à venir ».
- **Synonymes à éviter** : unlock, récompense, gain
- **Exemple** : après 3 mini-sessions complétées, le chapitre « Ondes » passe de verrouillé à accessible.

### E

#### Entretien jalon

- **Définition** : Session conversationnelle semi-structurée entre Juju et un skill Claude Code (`juju-entretien-m0`, puis `-m1`) à la livraison d'un milestone. Juju conduit seule sur son ordi. Les verbatims sont consignés dans `cadrage-brouillon/entretien-jalon-M*.md`. Mesure les KRs qualitatifs.
- **Synonymes à éviter** : questionnaire, sondage, feedback form
- **Exemple** : Juju lance `/juju-entretien-m0` et répond sur 7 thèmes (peur psy, ressenti messages, envie de revenir…).

#### Exercice

- **Définition** : Unité atomique de pratique. Peut être une flashcard, une question QCM, un exercice de logique, un calcul mental. Dure quelques secondes à 2 minutes maximum. Une mini-session enchaîne 3 à 5 exercices.
- **Synonymes à éviter** : micro-exercice, item, question (trop restrictif — n'inclut pas les flashcards)
- **Exemple** : une flashcard « Quelle est la dérivée de x² ? » ou une question QCM à 4 choix sur les forces.

### F

#### Fiche méthode

- **Définition** : Document pédagogique court (lisible en < 3 min sur smartphone) présentant un type de test psychotechnique. Structure : *C'est quoi ?* (1 paragraphe) → *Ce que ça évalue* (3-5 puces) → *Comment l'aborder* (3-5 conseils). Ton charte, pas de jargon.
- **Synonymes à éviter** : tutoriel, guide, cours
- **Exemple** : fiche méthode « Logique » expliquant les séries, analogies et syllogismes.

#### Flashcard

- **Définition** : Format d'exercice présentant une question sur une face (formule, concept, définition) et la réponse sur l'autre. L'utilisatrice formule mentalement sa réponse avant de retourner. Aucune évaluation de la réponse mentale par le système.
- **Synonymes à éviter** : carte mémoire, quiz ouvert
- **Exemple** : face question « Formule de l'énergie cinétique ? » → face réponse « Ec = ½mv² ».

#### Format

- **Définition** : Type d'exercice disponible au sein d'un chapitre. En M0 : flashcard et QCM chronométré. En M1 : ajout des exercices de recherche longs.
- **Synonymes à éviter** : mode (réservé à chrono/sans chrono), type (réservé aux types psy)
- **Exemple** : le chapitre « Géométrie » propose 2 formats : flashcard + QCM chrono.

### L

#### Logique

- **Définition** : Type de test psychotechnique évaluant le raisonnement abstrait (séries, analogies, syllogismes, raisonnement déductif). Premier type couvert en M0, recommandé comme premier contact psy (plus visuel/intuitif que le calcul mental).
- **Synonymes à éviter** : raisonnement, QI
- **Exemple** : « Complète la série : 2, 6, 18, 54, ? »

### M

#### Mini-session

- **Définition** : Séquence de 3 à 5 exercices enchaînés sans interruption visuelle. Durée totale : quelques minutes. Unité de base de l'entraînement. Plusieurs mini-sessions peuvent s'enchaîner au sein d'une même session. Se termine par un bilan.
- **Synonymes à éviter** : série, tour, round, run
- **Exemple** : « Poursuis Géométrie : 4 flashcards » → 4 exercices enchaînés → bilan.

#### Mode chrono

- **Définition** : Mode de passation d'un QCM avec chronomètre actif. Durée paramétrable par l'utilisatrice, par défaut indulgente. Présentation discrète (pas de tic-tac, pas d'animation stressante). Toujours optionnel — proposé après une séquence sans chrono.
- **Synonymes à éviter** : mode examen, mode concours, mode évaluation
- **Exemple** : « Tu veux essayer en chronométré ? 3 min pour 5 questions. Tu peux toujours arrêter. »

#### Mode sans chrono

- **Définition** : Mode de passation par défaut des exercices psychotechniques. Pas de chronomètre visible. L'utilisatrice prend le temps de comprendre la méthode et le raisonnement avant de passer au mode chrono.
- **Synonymes à éviter** : mode libre, mode débutant
- **Exemple** : exercice de logique affiché sans aucune indication de temps.

### O

#### Onboarding

- **Définition** : Parcours de bienvenue à la première ouverture de l'app (cf. journey J1). Présente le prénom de Juju, les deux piliers et l'avatar. Inclut un exercice d'échantillon (flashcard maths). Sauteable à tout moment, tolérant aux interruptions, sans message culpabilisant au retour.
- **Synonymes à éviter** : inscription, tutoriel, configuration initiale

### P

#### Pilier

- **Définition** : Catégorie de contenu de premier niveau. Deux piliers en M0 : **Sciences** (maths + physique-chimie 1ère) et **Psychotechniques** (logique + calcul mental). Chaque pilier contient des chapitres.
- **Synonymes à éviter** : catégorie, domaine, matière, section. Ne jamais abréger en P1/P2 — toujours écrire « Pilier 1 », « Pilier 2 ».
- **Exemple** : « Pilier Sciences → Chapitre Géométrie → Format Flashcard ».

#### Progression

- **Définition** : Ensemble des données qui tracent l'avancement de Juju. Couvre à la fois la **vue visible** (compteur de sessions, avancement par chapitre, état de l'avatar) et les **données internes** (exercices faits, chapitres parcourus, déblocages obtenus). Alimente le moteur de suggestion et le suivi affiché. Basée sur l'effort, jamais sur le score. Aucun graphique anxiogène, aucune note /N, aucun classement.
- **Synonymes à éviter** : historique (trop technique), suivi (trop restrictif — ne couvre que la vue visible), statistiques, performance
- **Exemple** : « Juju a fait 12 mini-sessions, 3 chapitres en cours, avatar au stade 2, 1 déblocage obtenu. »

### Q

#### QCM

- **Définition** : Format d'exercice à choix multiples (3 à 5 options). L'utilisatrice sélectionne une réponse puis valide. La correction expliquée s'affiche après validation. Peut être en mode chrono ou sans chrono.
- **Synonymes à éviter** : quiz, test (trop anxiogène dans le contexte)
- **Exemple** : « Quelle est la force résultante ? A) 10 N B) 20 N C) 30 N D) 40 N »

### R

#### Règle d'or

- **Définition** : Principe UX absolu du projet : « ne jamais décourager ». Interdit tout message culpabilisant, score stigmatisant, leaderboard, mention d'absence, notification de relance. Irrigue toutes les décisions de contenu, de ton et de game design. Source : entretien Juju du 11/04/2026.
- **Synonymes à éviter** : guideline UX, best practice
- **Exemple** : après 7 jours sans ouvrir l'app → aucun message relatif à l'absence. L'accueil est identique à une ouverture normale.

### S

#### Session

- **Définition** : Période d'usage continue de l'app, du lancement à la fermeture. Deux modes de session définis : **session courte** (~15 min, smartphone, soir de semaine, M0) et **session longue** (30 min+, ordinateur, week-end, M1). Une session contient une ou plusieurs mini-sessions.
- **Synonymes à éviter** : plage, créneau, séance
- **Exemple** : Juju ouvre l'app à 21h, fait 2 mini-sessions en 12 minutes, ferme l'app → 1 session courte.

#### Suggestion

- **Définition** : Recommandation contextuelle d'activité affichée à chaque ouverture de l'app, en une ligne + bouton Go. Permet le démarrage en 1 tap sans naviguer dans un catalogue. Tient compte de la progression (dernière activité, chapitres visités, alternance piliers). Si l'historique est insuffisant, une suggestion par défaut est proposée.
- **Synonymes à éviter** : recommandation, notification, alerte
- **Exemple** : « Poursuis Géométrie : 4 flashcards » + bouton [Go].

---

## Acronymes et abréviations

| Acronyme | Signification | Contexte |
|---|---|---|
| BO | Bulletin Officiel de l'Éducation nationale | Source de vérité pour les programmes scolaires 1ère |
| QCM | Questionnaire à Choix Multiples | Format d'exercice |
| M0 | Milestone 0 — Prototype validable | Première livraison testable avec Juju |
| M1 | Milestone 1 — MVP complet | Couverture intégrale BO 1ère + mode ordi |
| PPL | Private Pilot License (EASA) | Formation en cours de Juju, atout motivation |
| ENAC | École Nationale de l'Aviation Civile | Cible concours principale (EPL/S) |
| EPL/S | Élève Pilote de Ligne / Sciences | Filière ENAC ouverte sans CPL |

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| glossaire stratégique | [Glossaire](../../01-strategy/glossaire.md) |
| personas | [Persona Juju](../../02-discovery/personas/persona-juju-utilisatrice.md), [Persona Papa](../../02-discovery/personas/persona-papa-porteur.md) |
| journeys | [J1](../../02-discovery/journeys/journey-premiere-utilisation.md), [J2](../../02-discovery/journeys/journey-soir-semaine-smartphone.md), [J3](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigences fonctionnelles | [0-requirements/fonctionnelles/](../0-requirements/fonctionnelles/) |
| vision produit | [Vision produit](../../01-strategy/vision-produit.md) |
