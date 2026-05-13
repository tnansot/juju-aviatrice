<!-- Copyright (C) 2026 Cyril Vrillaud - SPDX-License-Identifier: AGPL-3.0-only -->

# Product Brief — juju-aviatrice

> Livrable Discovery. Re-synthétise la vision d'un angle utilisateur/problème et délimite le périmètre **M0 « Prototype validable »**.
> **2026-05-13** — Thomas (Papa) avec Claude

## Résumé exécutif

**juju-aviatrice** est un compagnon personnel d'entraînement scientifique et psychotechnique, sur mesure pour Juju (1ère spé sciences, en PPL, gameuse). Il transforme deux peurs (« je ne sais pas par où commencer » + « je ne me sens pas au niveau ») en progression visible, en couvrant dès aujourd'hui le programme de 1ère (dual-usage école + concours) et en s'étendant vers les concours pilote. Trois choix structurants : dual-usage, UX bienveillante (règle d'or « ne jamais décourager »), engagement par le jeu. L'impact visé : le **basculement de la peur vers la confiance**, mesuré par entretiens semi-structurés via Claude Code.

---

## Vision fondamentale

### Énoncé du problème

Juju veut devenir pilote de ligne. Deux peurs paralysent sa préparation :

1. **« Je ne sais pas par où commencer »** sur les psychotechniques — aucune idée de ce que sont ces tests, ni quoi ni comment réviser.
2. **« Je ne me sens pas au niveau »** sur les concours scientifiques (ENAC, Cadets AF) — préfère viser les écoles psy européennes par défaut.

C'est **critique maintenant** (2 ans du bac) : l'écart avec un candidat préparé grandit, l'absence de méthode dégrade la motivation, et aucune ressource existante n'est calibrée pour son contexte (lycéenne française, dual-usage, gameuse, 15 min/soir).

### Impact si rien n'est fait

- **Court terme** : décrochage sur les matières scientifiques, sentiment d'incompétence
- **Moyen terme** : performances en deçà du potentiel, fermeture passive des options post-bac
- **Objectif pilote** : auto-exclusion des sélections accessibles (PPL en cours, motivation forte, 2 ans d'horizon)
- **Relation** : tension parent/enfant autour du projet pilote

### Pourquoi les solutions existantes échouent

| Solution | Limite principale |
|---|---|
| Soutien scolaire générique (Anacours…) | Ignore les concours pilote, pas de psy, posture descendante |
| Prépas concours pilote (Astonfly…) | Horizon trop lointain pour une 1ère, pas d'articulation programme scolaire, 15 min/soir impossible |
| YouTube isolé (Yvan Monka…) | Ressources éparpillées, pas de progression structurée ni de feedback |
| Banques psy (PILAPT trainer, Vuibert…) | Décontextualisées, sans pédagogie, anxiogènes par défaut |
| Applis génériques (Brilliant, Khan…) | Pas calibrées programme français, pas de psy pilote, gamification compétitive |

### Solution proposée

Un compagnon d'entraînement personnel combinant : cœur scientifique multi-niveaux (1ère → ENAC) avec dual-usage école + concours · cœur psychotechnique en 3 temps (comprendre → s'entraîner → conditions réelles) · UX bienveillante incarnant la règle d'or · engagement par le jeu (avatar, déblocages) sans compétition · mode smartphone en M0, étendu ordi en M1. Différenciateurs détaillés dans [vision-produit.md](../01-strategy/vision-produit.md).

Deux **tensions actées** par Papa : maths en priorité n°1 (Juju voulait psy) et périmètre élargi à ENAC + AF (Juju voulait se limiter aux psy européennes). À re-présenter avec le 1er prototype.

---

## Personas et parcours

| Persona | Rôle | Priorité | Fiche |
|---|---|---|---|
| **Juju** | Utilisatrice unique (1ère spé sciences, PPL, gameuse) | M0 | [Persona Juju](personas/persona-juju-utilisatrice.md) |
| **Papa (Thomas)** | Porteur, builder, intervieweur jalon | M0 | [Persona Papa](personas/persona-papa-porteur.md) |

| # | Journey | Périmètre | Fiche |
|---|---|---|---|
| J1 | Première utilisation | M0 — critique | [J1](journeys/journey-premiere-utilisation.md) |
| J2 | Soir-semaine-smartphone (nominal récurrent) | M0 — critique | [J2](journeys/journey-soir-semaine-smartphone.md) |
| J3 | Découverte-psychotechniques (logique d'abord) | M0 — critique | [J3](journeys/journey-decouverte-psychotechniques.md) |
| J4 | Week-end-immersion (session longue ordi) | M1 — anticipé | [J4](journeys/journey-week-end-immersion.md) |
| J5 | Entretien-jalon-m0 (Juju autonome, Papa dépouille) | M0 — critique | [J5](journeys/journey-entretien-jalon-m0.md) |

---

## Métriques de succès

### Succès utilisateur

| Indicateur | Cible | Seuil d'alerte |
|---|---|---|
| Jours/semaine avec session courte smartphone | ≥ 3/sem en croisière post-M0 | < 1/sem sur 3 semaines |
| Sessions longues/week-end (M1+) | ≥ 1/sem | 0 sur 2 week-ends |
| Plaisir et envie de revenir (entretien) | Ressenti majoritairement positif au jalon M0 | Verbatim négatif récurrent sur une mécanique |
| Messages perçus comme négatifs (KR-3.1.1) | 0 | Un seul verbatim négatif → correction immédiate |

### Impact transformatif

- **Baisse de la peur des psy** : verbatims avant/après comparés (KR-2.1.4)
- **Sentiment de maîtrise** : ouverture explicite de Juju à viser ENAC/AF (signal de bascule motivationnelle)
- **Résultats scolaires** : amélioration en spé maths + physique sur l'année
- **Continuité d'engagement** : usage maintenu 6-12 mois sans relance externe

### Indicateurs avancés (prédicteurs)

**1ère session non sollicitée** (Juju lance l'app sans que Papa demande) · **1ère mention spontanée** (en parle à un tiers) · **1er dépassement 15 min** en semaine · **1er déblocage célébré** verbalement.

### Objectifs du projet

> Milestones produit (M0, M1…), pas de trimestres. Horizons calendaires indicatifs.

**À 3 mois post-M0** : régularité semaine atteinte · 1ère itération sur retours entretien effectuée · aucun frein UX bloquant non corrigé · décision poursuite M1 actée.

**À 12 mois post-M0** (~rentrée Terminale sept 2026) : M1 livré ou bien avancé (couverture intégrale 1ère, ≥ 50 exos psy, mode ordi) · M2 démarré (Terminale) · palette psy élargie · Juju a repositionné sa cible concours · baisse peur psy confirmée en entretien M1.

---

## Périmètre MVP (M0 — Prototype validable)

> M0 est **plus restreint** que le M1 des OKRs Strategy. Il vise à **valider les hypothèses produit** avec Juju avant d'investir dans la couverture exhaustive. La Strategy doit être mise à jour pour intégrer M0.

**Stratégie de livraison** : Vague 0 (M0, ce MVP) valide les hypothèses. Vague 1 (M1) couvre intégralement le programme. Découpage aligné avec `cadrage-brouillon/prochaines-etapes.md` étape 2.

### Fonctionnalités essentielles

**1. Scientifique — 3 chapitres × 2 matières** : 3 chapitres spé maths + 3 spé physique choisis avec Juju (variété de typologies). Formats smartphone : flashcards + QCM chronométré court (5-10 Q). Exercices de recherche longs reportés en M1.

**2. Psychotechnique — démystification + ~10 exercices** : 2 fiches méthode (logique + calcul mental) + 5 exos chacun. Mode entraînement libre + chronométré paramétrable.

**3. Smartphone uniquement** : UX optimisée 15 min max. Pas de mode ordi, pas de session longue, pas de continuité multi-appareil (M1).

**4. UX bienveillante** : charte de ton appliquée à tous les messages. Suivi : compteur sessions + avancement par chapitre, pas de notation /20. Validation écrans par Juju sur maquette avant implémentation.

**5. Engagement par le jeu minimal** : avatar progressif simple (3-4 états), un seul mécanisme de déblocage, célébration positive sobre.

**6. Skill `juju-entretien-m0`** : recalibré sur le scope M0. Valide les hypothèses fondamentales (envie de revenir ? messages OK ? suivi motivant ? avatar suscite ? psy démystifiés ?). N'interroge pas sur les fonctionnalités absentes.

### Prérequis

- ADR Stack technique (I-T.1) : smartphone d'abord, ordi en M1 sans refonte
- Charte de ton & vocabulaire (I-3.1.1) : produite très tôt
- Sélection des 3+3 chapitres avec Juju (mai-juin 2026)
- Templates flashcards + QCM chronométré
- Conventions tests et structure `src/` (I-T.1)

### Hors périmètre MVP

| Fonctionnalité | Phase prévue |
|---|---|
| Couverture intégrale BO 1ère | M1 |
| Exercices de recherche longs / mode ordi / continuité multi-appareil | M1 |
| Banque ≥ 50 exos par type psy | M1 |
| Maths/physique Terminale | M2 |
| Psy mémoire, spatial, attention partagée | M2 |
| Curation YouTube dans les chapitres | M2 |
| Maths/physique Post-bac / ENAC | M3 |
| Psychomoteur / calibrage par école / culture aéro | M3 |
| Anglais | Hors scope |
| Mode hors-ligne | Si besoin |
| Jeu avancé (achievements, customisation) | Selon retour M0/M1 |
| Gamification compétitive / partage social | **Jamais** (règle d'or) |

### Critères de succès M0 → M1

Passage à Vague 1 déclenché par la conjonction de :

1. **Tout M0 livré et fonctionnel** : 6 chapitres × 2 formats, 10 exos psy, mode chrono, charte, suivi, avatar, déblocages, skill entretien
2. **Entretien confirme** : peur psy en baisse · messages non négatifs (KR-3.1.1) · suivi motivant (KR-3.1.3) · envie de revenir · avatar/déblocage suscitent un intérêt
3. **Régularité installée** : ≥ 3 jours/sem sur 3 semaines consécutives
4. **Tensions présentées à Juju** avec position explicite
5. **Aucun frein UX bloquant non corrigé**

Si un critère échoue, on ajuste avant d'investir dans M1.

### Vision future

**M1** : couverture 100 % BO 1ère, ≥ 50 exos psy/type, exos longs, mode ordi + continuité multi-appareil.
**M2** : Terminale, palette psy élargie, curation YouTube, enrichissement jeu.
**M3** : niveaux Post-bac/ENAC, calibrage par école, culture aéro.

**Vision long terme** : à maturité, juju-aviatrice est l'unique outil de Juju pour préparer ses concours, de la 1ère session jusqu'à l'admission. Il a transformé la peur en confiance. Le code reste ouvert et personnel — un cadeau d'ingénieur à sa fille.

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| vision-produit | [Vision produit](../01-strategy/vision-produit.md) |
| OKRs | [OKRs](../01-strategy/okrs.md) |
| initiatives | [Initiatives](../01-strategy/initiatives.md) |
| glossaire | [Glossaire](../01-strategy/glossaire.md) |
| cadrage — besoins Juju | [besoins-juju.md](../../cadrage-brouillon/besoins-juju.md) |
| cadrage — étapes | [prochaines-etapes.md](../../cadrage-brouillon/prochaines-etapes.md) |
| cadrage — questions | [questions-ouvertes.md](../../cadrage-brouillon/questions-ouvertes.md) |
| base documentaire | [wiki/](../../wiki/) |
| profil utilisatrice | Confirmé 2026-05-06 (mémoire `project_juju_profile.md`) |
| contexte projet | [CLAUDE.md](../../CLAUDE.md) |
