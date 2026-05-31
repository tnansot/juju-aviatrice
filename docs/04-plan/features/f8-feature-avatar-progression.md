# Feature : Avatar & Progression

## Description

Avatar progressif à 3-4 états visuels, basé sur l'effort (pas le score). Mécanisme de déblocage de chapitres, célébrations sobres, suivi non-anxiogène (compteurs + avancement par chapitre). L'absence n'est jamais mentionnée. Les données de progression ne sont jamais exposées en temps réel à Papa (ENF-SEC-005).

## Critère de complétion

1. Avatar affiché sur l'accueil FO-04 avec stade visuel distinct (1 à 4)
2. Progression déclenchée par l'effort : 5 exos avec 0 bonne réponse = même progression que 5 justes
3. Déblocage d'un chapitre après quelques sessions (3-5) avec célébration sobre (FO-08)
4. Suivi : compteur sessions + avancement par chapitre — aucune note, courbe, classement
5. Après 7 jours d'absence → aucun message relatif à l'absence

## Priorité

- [x] Must have

## Exigences couvertes

- [REQ-AVATAR-001] : Avatar avec 3-4 états progressifs visibles
- [REQ-AVATAR-002] : Progression basée sur l'effort, pas le score
- [REQ-AVATAR-003] : Mécanisme de déblocage de contenu
- [REQ-AVATAR-004] : Suivi non-anxiogène (compteur + avancement)
- [REQ-AVATAR-005] : Célébration positive sobre des déblocages
- [REQ-AVATAR-006] : Absence jamais mentionnée négativement

## Dépendances

- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : API et DB opérationnels
- [Feature Accès sécurisé](f2-feature-auth-device.md) : device identifié
- [Feature Session d'entraînement](f4-feature-session-entrainement.md) : événements exercice_effectue et mini_session_terminee
- [Feature Parcours de bienvenue](f3-feature-onboarding-bienvenue.md) : événement onboarding_complete pour initialisation

## Écrans et API concernés

### Écrans

- **Accueil (FO-04)** — bloc avatar + suivi
  - Spec : [spec-ecran-accueil.md](../../03-design/3-wireframes/spec-ecran-accueil.md)

- **Déblocage (FO-08)**
  - Spec : [spec-ecran-deblocage.md](../../03-design/3-wireframes/spec-ecran-deblocage.md)
  - Wireframe HTML : [fo-08-deblocage.html](../../03-design/3-wireframes/html-wireframes/fo-08-deblocage.html)

- **Choix Activité (FO-09)** — états de verrouillage par chapitre
  - Spec : [spec-ecran-choix-activite.md](../../03-design/3-wireframes/spec-ecran-choix-activite.md)

### API

- **progression.obtenirProfil** : [progression.md](../../03-design/4-api/progression.md) — Avatar, compteurs, dernière activité
- **progression.obtenirAvancementChapitres** : [progression.md](../../03-design/4-api/progression.md) — États de verrouillage par chapitre

---

## Stories

### S1 : Initialisation du profil de progression

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Créer le profil de progression à la complétion de l'onboarding, avec avatar stade 1 et états initiaux des chapitres.
**Justification** : bc-progression consomme l'événement onboarding_complete pour initialiser le profil (chapitres débloqués/verrouillés).

> ⚠️ **Prérequis — dette B3 héritée de F3** : à la clôture de F3 (2026-05-31), l'événement `onboarding_complete` **n'est pas émis** ; la micro-progression avatar de l'onboarding est simulée côté front. `bc-onboarding` le prescrit pourtant (cf. [bilan F3](f3-feature-onboarding-bienvenue-review.md), B3). Cette story doit donc **commencer par câbler l'émission de `onboarding_complete` dans le backend onboarding** avant de brancher la réaction bc-progression — sinon le 1er critère Gherkin ci-dessous ne peut pas être satisfait.

**Critères d'acceptation :**

```gherkin
GIVEN un événement onboarding_complete émis
WHEN bc-progression réagit
THEN un ProfilProgression est créé avec avatar stade 1, compteurs à 0, et chapitres initialisés selon etat_initial du catalogue
```

```gherkin
GIVEN le profil initialisé
WHEN j'appelle progression.obtenirProfil
THEN avatar.stade = 1, compteurExercices = 0, compteurMiniSessions = 0
```

**Implémentation :**

- [ ] **Câbler l'émission de `onboarding_complete` dans le backend onboarding (dette B3 de F3)** — remplacer la micro-progression simulée côté front
- [ ] Schéma Drizzle : tables profil_progression, avatars, etats_chapitres
- [ ] Réaction à onboarding_complete : création profil + initialisation chapitres
- [ ] Procédure progression.obtenirProfil (query)
- [ ] Procédure progression.obtenirAvancementChapitres (query)
- [ ] Tests : initialisation, lecture profil, états chapitres
- **Statut** : À faire

---

### S2 : Compteurs d'effort et seuils avatar

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Incrémenter les compteurs à chaque exercice effectué et vérifier les seuils de transition d'avatar.
**Justification** : REQ-AVATAR-002 impose une progression par l'effort. Les seuils avatar sont le déclencheur de l'évolution visuelle.

**Critères d'acceptation :**

```gherkin
GIVEN un événement exercice_effectue émis (bonne ou mauvaise réponse)
WHEN bc-progression réagit
THEN compteurExercices est incrémenté de 1 et le seuil avatar est vérifié
```

```gherkin
GIVEN compteurExercices atteint le seuil du stade 2
WHEN la vérification de seuil s'exécute
THEN avatar passe au stade 2 et l'événement avatar_evolue est émis
```

```gherkin
GIVEN un événement mini_session_terminee émis
WHEN bc-progression réagit
THEN compteurMiniSessions est incrémenté et derniereActivite mise à jour
```

**Implémentation :**

- [ ] Réaction à exercice_effectue : incrémenter compteur, vérifier seuils avatar
- [ ] Réaction à mini_session_terminee : incrémenter compteur sessions, mettre à jour derniereActivite
- [ ] Réaction à session_interrompue : comptabiliser exercices faits, pas de pénalité
- [ ] Définition des seuils avatar (stade 1→2→3→4, basés sur exercices effectués)
- [ ] Émission avatar_evolue quand un seuil est atteint
- [ ] Tests : incrémentation, seuils, 0 bonne réponse = même progression, interruption sans pénalité
- **Statut** : À faire

---

### S3 : Déblocage de chapitres

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Débloquer un chapitre verrouillé quand les conditions d'effort sont réunies.
**Justification** : REQ-AVATAR-003 — seuil atteignable en 3-5 sessions.

**Critères d'acceptation :**

```gherkin
GIVEN un chapitre verrouillé et 3 mini-sessions terminées sur d'autres chapitres
WHEN la vérification de déblocage s'exécute
THEN le chapitre passe de verrouille à debloque et l'événement chapitre_debloque est émis
```

```gherkin
GIVEN un chapitre verrouillé
WHEN j'appelle progression.obtenirAvancementChapitres
THEN le chapitre est listé avec etat = verrouille (visible mais non sélectionnable)
```

**Implémentation :**

- [ ] Logique de déblocage : condition basée sur mini-sessions terminées (seuil 3-5)
- [ ] Mise à jour etat_chapitre : verrouille → debloque
- [ ] Émission chapitre_debloque
- [ ] Tests : condition atteinte → déblocage, condition non atteinte → pas de changement
- **Statut** : À faire

---

### S4 : Affichage avatar et suivi sur l'accueil (FO-04)

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** voir mon avatar évoluer et mes compteurs de progression sur l'accueil,
**afin de** sentir que chaque session me fait avancer.

**Critères d'acceptation :**

```gherkin
GIVEN l'accueil FO-04 affiché
WHEN le profil est chargé
THEN l'avatar est affiché avec son stade actuel, le compteur de sessions et l'avancement chapitres
```

```gherkin
GIVEN l'avatar au stade 2
WHEN Juju consulte le profil
THEN l'avatar est visuellement distinct du stade 1 — le changement est perceptible
```

```gherkin
GIVEN 7 jours sans ouverture de l'app
WHEN Juju ouvre l'app
THEN l'accueil FO-04 s'affiche normalement sans aucun message relatif à l'absence
```

**Implémentation :**

- [ ] Frontend : composant AvatarDisplay — rendu visuel des 3-4 stades (illustrations/icônes)
- [ ] Frontend : intégration profil sur FO-04 (avatar + compteurs + prochain seuil)
- [ ] Frontend : animation de transition entre stades (scale + glow, 400ms)
- [ ] Frontend : aucune mention d'absence — pas de date de dernière visite affichée
- [ ] Tests : affichage par stade, compteurs, pas de mention d'absence
- **Statut** : À faire

---

### S5 : Écran de déblocage (FO-08) et célébrations

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** voir une célébration sobre quand un nouveau chapitre se débloque,
**afin de** sentir la récompense de mon effort sans être submergée.

**Critères d'acceptation :**

```gherkin
GIVEN une mini-session qui déclenche un déblocage de chapitre
WHEN l'écran FO-08 s'affiche
THEN le nom du chapitre débloqué est affiché avec un cadenas ouvert et un message positif
```

```gherkin
GIVEN l'écran FO-08 affiché
WHEN Juju tape "Découvrir" ou "Plus tard"
THEN retour à l'accueil FO-04 — la célébration ne bloque pas l'usage
```

```gherkin
GIVEN une évolution d'avatar pendant une session
WHEN le bilan FO-07 s'affiche
THEN le nouveau stade est mentionné avec un message sobre (aligné charte de ton)
```

**Implémentation :**

- [ ] Frontend : composant DeblocageScreen (FO-08) — cadenas, nom chapitre, message positif
- [ ] Frontend : animation sobre (apparition card, 2-3 secondes, pas de modale bloquante)
- [ ] Frontend : intégration dans le flux session (après dernier exercice, avant bilan si déblocage)
- [ ] Tests : affichage, navigation, animation non-bloquante
- **Statut** : À faire

---

### S6 : États de verrouillage dans le choix d'activité (FO-09)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** voir quels chapitres sont débloqués et lesquels sont « à venir »,
**afin de** savoir ce qui m'attend sans me sentir bloquée.

**Critères d'acceptation :**

```gherkin
GIVEN l'écran FO-09 affiché
WHEN les chapitres sont listés
THEN les chapitres débloqués/en_cours sont sélectionnables et les verrouillés sont marqués "à venir" (grisés)
```

```gherkin
GIVEN un chapitre verrouillé affiché
WHEN Juju tape dessus
THEN rien ne se passe (pas de message d'erreur, pas de frustration — le chapitre est visuellement non-cliquable)
```

**Implémentation :**

- [ ] Frontend : croisement contenu.listerPiliers + progression.obtenirAvancementChapitres
- [ ] Frontend : rendu différencié : débloqué (actif) / en_cours (indicateur) / verrouillé (grisé « à venir ») / terminé (check)
- [ ] Frontend : chapitres verrouillés non-interactifs (pas de tap handler)
- [ ] Tests : tous les états visuels, non-cliquabilité des verrouillés
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Initialisation du profil de progression | TS | M (3 pts) | À faire |
| S2 | Compteurs d'effort et seuils avatar | TS | M (3 pts) | À faire |
| S3 | Déblocage de chapitres | TS | S (2 pts) | À faire |
| S4 | Affichage avatar et suivi sur l'accueil (FO-04) | US | M (3 pts) | À faire |
| S5 | Écran de déblocage (FO-08) et célébrations | US | S (2 pts) | À faire |
| S6 | États de verrouillage dans le choix d'activité (FO-09) | US | S (2 pts) | À faire |

**Total** : 6 stories — 15 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J1 (première progression) | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| journey J2 (déblocages, bilan) | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 (1er badge psy) | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| bc-progression | [bc-progression](../../03-design/1-domain/bc-progression.md) |
| modèles ProfilProgression, Avatar, EtatChapitre | [models/](../../03-design/1-domain/models/) |
| exigences avatar | [req-avatar](../../03-design/0-requirements/fonctionnelles/req-avatar.md) |
| exigences sécurité (ENF-SEC-005) | [req-securite](../../03-design/0-requirements/non-fonctionnelles/req-securite.md) |
| wireframes FO-04, FO-08, FO-09 | [navigation](../../03-design/3-wireframes/navigation.md) |
| API progression | [progression.md](../../03-design/4-api/progression.md) |
