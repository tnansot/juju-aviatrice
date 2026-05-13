<!-- Copyright (C) 2026 Cyril Vrillaud - SPDX-License-Identifier: AGPL-3.0-only -->

# Persona : Papa — porteur, builder et intervieweur

> Second utilisateur du produit en M0. Utilise le skill d'entretien et le pilotage projet, pas le contenu d'entraînement.

## Identité et profil

- **Nom** : Thomas (« Papa » — posture relationnelle)
- **Âge** : adulte parent
- **Rôle** : porteur du projet, builder principal, intervieweur jalon, gardien du périmètre
- **Localisation** : France, foyer familial
- **Citation** : _« Le projet est personnel et familial : la motivation est d'aider Juju concrètement, pas de bâtir un produit générique. »_

## Contexte d'usage

### Situation personnelle

Père de Juju. Investit du temps personnel pour construire un outil sur mesure — pas de mise en marché, code personnel. Connaît bien sa fille : profil gameuse, peur exprimée (entretien 11/04/2026), rythme semaine/week-end, ressources spontanées (Yvan Monka, Pierre Olivier).

### Environnement de pilotage

- **Outillage** : VS Code + Claude Code, framework PBM (BMAD), Git, Cloudflare Pages (wiki)
- **Phases** : Strategy ✅ → Discovery (en cours) → Design → Plan → Implementation → Run
- **Posture** : assume des décisions parentales sur deux tensions explicites (priorité maths > psy, périmètre élargi), à re-soumettre à Juju au premier prototype

### Usage prévu

**Mensuel** (skill d'entretien aux jalons) + **ponctuel** (revues, ajustements de scope, observation retours Juju).

## Objectifs et motivations

**Objectifs** :

1. **Aider Juju concrètement** sans jamais la décourager — règle d'or absolue.
2. **Bâtir un outil qui dure 2-3 ans** : école d'aujourd'hui → concours (1ère → Terminale → post-bac → concours actifs).
3. **Mesurer le ressenti de Juju aux jalons** via le skill d'entretien, sans la fliquer.
4. **Garder le projet pragmatique** : pas de sur-ingénierie, livrer tôt, itérer sur retours réels.

**Motivations profondes** : amour parental · refus de la posture autoritaire (donner un outil qui tire vers le haut, pas pousser) · plaisir d'ingénieur à construire quelque chose d'utile · conviction que Juju a plus de potentiel qu'elle ne le croit.

## Frustrations et pain points

1. **Risque de sur-construire** un produit générique (le framework PBM peut pousser vers l'exhaustivité).
2. **Manque de retours** tant que Juju n'utilise pas réellement → arriver vite à un prototype M0 testable.
3. **Tensions non validées** : les deux décisions parentales pourraient être désavouées par Juju.
4. **Stack non tranchée** : bloque le passage Design/Implementation.
5. **Dosage de l'implication de Juju** : elle préfère laisser construire, mais ses retours sont essentiels.

**Conséquences** : gaspillage si la voie initiale ne convient pas · tension parent/enfant si l'outil est perçu comme surveillance · risque d'abandon si l'écart effort/usage devient trop grand.

## Besoins fonctionnels

**Prioritaires (M0)** :

1. Lancer le skill `juju-entretien-m0` à la livraison du prototype, consigner dans `cadrage-brouillon/entretien-jalon-M0.md`
2. Présenter les tensions actées à Juju, capter sa position explicite
3. Observer l'usage **uniquement** via le ressenti en entretien — **pas de dashboard de surveillance** (interdit par règle d'or)
4. Publier des mises à jour simplement (CI/CD léger, initiative I-T.1)
5. Vision claire avancement par milestone et couverture pédagogique

**Secondaires (M1+)** : skill entretien adapté par milestone · propagation d'impact entre phases PBM · vue consolidée des feedbacks Juju · templates de contenu réutilisables.

## Compétences numériques

**Expert** : Git, VS Code, Claude Code, CI/CD GitHub, Cloudflare Pages, MkDocs, framework BMAD/PBM. Concepteur de skills Claude Code.

## Accessibilité

Aucun besoin spécifique. Exigence associée : RGAA / WCAG AA sur l'app livrée à Juju.

## Canaux de communication

**Email** (tnansot@gmail.com) + **Claude Code** (canal principal de travail) + **commits Git** via `safe-commit` (journal de bord du projet).

## Parcours utilisateurs associés

À compléter (journeys) :

- **entretien-jalon-M0** : skill avec Juju à la livraison du prototype
- **propagation-impact** : ajustement artefacts aval quand un livrable amont change
- **scope-protection** (optionnel) : décision de ne pas étendre M0 si un signal manque

## Priorité

**MVP (M0)** : persona indispensable (sans elle, pas de skill d'entretien donc pas de mesure qualitative).

## Notes complémentaires

**Posture non-surveillante** : Papa n'aura **jamais** accès à un dashboard comportemental (temps, scores, sessions…). Décision de produit. Canal unique : entretien semi-structuré face à face via skill `juju-entretien-*`.

**Style projet** : pragmatique, personnel et familial. Pas de jargon corporate, pas de roadmap calendaire, pas de KPIs cosmétiques.

## Traçabilité

| Dépendance | Référence |
|---|---|
| product-brief | [Product Brief](../product-brief.md) |
| vision produit | [vision-produit.md](../../01-strategy/vision-produit.md) |
| OKRs (skill entretien) | [okrs.md](../../01-strategy/okrs.md) |
| initiatives (I-T.1, I-3.1.5) | [initiatives.md](../../01-strategy/initiatives.md) |
| contexte projet | [CLAUDE.md](../../../CLAUDE.md) |
| pattern skill conversationnel | [safe-commit/SKILL.md](../../../.claude/skills/safe-commit/SKILL.md) |
