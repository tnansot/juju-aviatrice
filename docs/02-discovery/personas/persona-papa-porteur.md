<!-- Copyright (C) 2026 Cyril Vrillaud - SPDX-License-Identifier: AGPL-3.0-only -->

# Persona : Papa — porteur, builder et intervieweur

> Second utilisateur du produit en M0. Pas un utilisateur du contenu d'entraînement (réservé à Juju), mais utilisateur du skill d'entretien et du pilotage du projet.

## Identité et profil

- **Nom** : Thomas (« Papa » dans le projet — désigné ainsi pour rappeler la posture relationnelle)
- **Âge** : adulte parent
- **Rôle** : porteur du projet, builder principal, intervieweur jalon, gardien du périmètre
- **Localisation** : France, foyer familial
- **Citation** : _« Le projet est personnel et familial : la motivation est d'aider Juju concrètement, pas de bâtir un produit générique. »_

## Contexte d'usage

### Situation personnelle

Père de Juju. Investit du temps personnel pour construire un outil sur mesure qui aide sa fille à transformer sa peur des concours pilote en confiance. Pas de retour sur investissement attendu (pas de mise en marché, code ouvert et personnel).

Connaît bien sa fille : son terrain naturel de gameuse, sa peur exprimée pendant l'entretien du 11 avril 2026, son rythme (semaine fatiguée / week-end motivée), ses ressources spontanées (Yvan Monka, Pierre Olivier).

### Environnement de pilotage

- **Outillage projet** : VS Code + Claude Code (CLI Anthropic), framework **PBM** (Product Builder Method) du module BMAD
- **Repo Git** : `juju-aviatrice` (main branch, push systématique via skill `safe-commit`)
- **Phases produit** : Strategy ✅ → Discovery (en cours) → Design → Plan → Implementation → Run
- **Posture builder** : assume des **décisions parentales** sur deux tensions explicites (priorité maths > psy, périmètre concours élargi), à re-soumettre à Juju quand un prototype sera testable

### Fréquence d'utilisation de la plateforme

- [ ] Quotidienne (pas du produit lui-même — du repo / Claude Code, oui)
- [ ] Hebdomadaire
- [x] Mensuelle (skill d'entretien aux jalons M0/M1/M2/M3)
- [x] Ponctuelle (revues, ajustements de scope, observation des retours de Juju)

## Objectifs et motivations

### Objectifs principaux

1. **Aider Juju concrètement** dans sa préparation aux concours pilote sans jamais la décourager — règle d'or absolue.
2. **Bâtir un outil qui dure 2-3 ans** : qui sert l'école d'aujourd'hui (1ère) et accompagne Juju jusqu'aux concours (Terminale → post-bac → concours actifs).
3. **Mesurer le ressenti de Juju aux jalons** via le skill d'entretien, sans la fliquer ni la sur-solliciter.
4. **Garder le projet pragmatique** : ne pas sur-ingénier, ne pas fermer prématurément des options, livrer de la valeur tôt et itérer sur retours réels.

### Motivations profondes

- **Amour parental** et conviction que son ingénierie peut servir directement le rêve de sa fille.
- **Refus de la posture parentale autoritaire** : pas question de pousser Juju, mais lui donner un outil qui la tire vers le haut par elle-même.
- **Plaisir d'ingénieur** à construire quelque chose d'utile et de soigné, avec une finalité claire et personnelle.
- **Conviction stratégique** que Juju a plus de potentiel qu'elle ne le croit, et qu'un outil bien conçu peut le révéler — d'où les tensions actées.

## Frustrations et pain points

### Obstacles actuels

1. **Risque de sur-construire** un produit générique au lieu d'un outil sur mesure — le framework PBM peut pousser vers l'exhaustivité, à recadrer en permanence.
2. **Manque de retours utilisateur direct** tant que Juju n'utilise pas réellement le produit — d'où l'importance d'arriver vite à un prototype M0 testable.
3. **Tensions actées non encore validées** : les deux décisions parentales (priorité, périmètre) pourraient être désavouées par Juju quand elle testera ; ne pas trop investir dans une direction avant le verdict.
4. **Friction technique du choix de stack** non encore tranché : bloque le passage en Design/Implementation.
5. **Difficulté à doser l'implication de Juju** : elle préfère laisser construire, mais ses retours sont essentiels — ne pas la sur-solliciter, ne pas avancer trop loin sans avis.

### Conséquences

- Risque de gaspillage si la voie initiale ne convient pas à Juju (ex. une stack inadaptée à son usage réel).
- Tension parent/enfant si l'outil pousse Juju là où elle bloque, ou si elle perçoit l'outil comme un instrument de surveillance.
- Risque d'abandon du projet si l'écart entre l'effort de construction et l'usage réel devient trop grand.

## Besoins fonctionnels

### Besoins prioritaires (M0)

1. **Lancer le skill `juju-entretien-m0`** à la livraison du prototype et en consigner les retours dans `cadrage-brouillon/entretien-jalon-M0.md`.
2. **Présenter les tensions actées** à Juju avec le prototype, et capter sa position explicite.
3. **Observer l'usage de Juju** sans la fliquer — uniquement via le ressenti recueilli en entretien, **pas** de dashboard de surveillance comportementale (interdit par règle d'or).
4. **Pouvoir publier des mises à jour** de l'outil de manière simple et sans interrompre Juju (CI/CD léger, prévu en initiative I-T.1).
5. **Garder une vision claire** de l'avancement par milestone (M0 → M1 → M2 → M3) et de la couverture pédagogique (chapitres BO, exos psy).

### Besoins secondaires (M1 et au-delà)

- Skill d'entretien adapté à chaque milestone (`juju-entretien-m1`, `juju-entretien-m2`, …)
- Outil de propagation d'impact entre les phases PBM (déjà disponible via `pbm-impact`)
- Vue produit consolidée des feedbacks de Juju au fil du temps (verbatims comparés)
- Templates de contenu pédagogique réutilisables (pour produire la banque vite quand le scope s'étend)

## Compétences numériques

- **Niveau général** : Expert
- **Outils maîtrisés** : Git, VS Code, Claude Code, CI/CD GitHub, Cloudflare Pages (wiki déjà déployé), MkDocs, framework BMAD/PBM
- **Appétence technologique** : Forte — concepteur et utilisateur de skills Claude Code (cf. `safe-commit`)

## Besoins d'accessibilité

Aucun besoin spécifique identifié.

### Exigences d'accessibilité associées

- Cohérence avec les standards techniques du projet (RGAA / WCAG niveau AA sur l'app livrée à Juju, pour ne pas créer de barrière même s'il n'y a pas de besoin direct exprimé)

## Canaux de communication préférés

- [x] Email (tnansot@gmail.com)
- [ ] Téléphone
- [ ] SMS
- [ ] Notification plateforme
- [x] Messagerie instantanée (Claude Code, terminal — canal principal de travail sur le projet)
- [ ] Courrier postal
- **Autre** : **commits Git** comme journal de bord du projet (`safe-commit` pousse systématiquement)

## Parcours utilisateurs associés

À compléter en étape 3 (journeys). Anticipation :

- Journey **entretien-jalon-M0** : exécution du skill avec Juju à la livraison du prototype
- Journey **propagation-impact** : ajustement des artefacts en aval quand un livrable amont change
- Journey **scope-protection** (interne porteur, optionnel) : décision de ne pas étendre M0 si un signal de Juju manque

## Priorité

- [x] **MVP (M0)** : persona indispensable dès la première version (sans elle, pas de skill d'entretien donc pas de mesure qualitative possible)
- [ ] MVP+ : persona pour les versions suivantes

## Notes complémentaires

**Posture explicitement non-surveillante** : Papa n'aura **jamais** accès à un dashboard de comportement de Juju (temps passé, scores, sessions ratées…). C'est une décision de produit, pas une limitation technique. Le canal de mesure est **uniquement** l'entretien semi-structuré conduit en face à face via le skill `juju-entretien-*`.

**Articulation avec le repo** : Papa pilote le projet via le repo `juju-aviatrice` :

- `wiki/` (publié sur Cloudflare Pages) — base documentaire métier pour Juju et lui en lecture
- `docs/` — artefacts PBM (strategy ✅, discovery en cours, design/plan/run à venir)
- `cadrage-brouillon/` — notes brutes, dont les comptes-rendus d'entretien
- `src/` (à créer en Implementation) — code de l'app

**Style projet** : pragmatique, personnel et familial. Pas de jargon corporate, pas de roadmap calendaire artificielle, pas de KPIs cosmétiques. Tout doit servir Juju directement.

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| product-brief | [Product Brief](../product-brief.md) |
| vision produit (Ultimate Goal, posture, tensions) | [vision-produit.md](../../01-strategy/vision-produit.md) |
| OKRs (skill juju-entretien-jalon) | [okrs.md](../../01-strategy/okrs.md) |
| initiatives (I-T.1, I-3.1.5) | [initiatives.md](../../01-strategy/initiatives.md) |
| contexte projet et conventions | [CLAUDE.md](../../../CLAUDE.md) |
| pattern de skill conversationnel | [.claude/skills/safe-commit/SKILL.md](../../../.claude/skills/safe-commit/SKILL.md) |
