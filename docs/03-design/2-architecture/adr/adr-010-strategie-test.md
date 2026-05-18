# ADR-010 : Stratégie de test

## Contexte

Projet personnel avec 1 builder et 1 utilisatrice. Une pyramide de tests classique avec E2E lourds (Playwright, Cypress) est surdimensionnée en M0 — les tests manuels sur smartphones réels via l'environnement de preview (ENF-AUT-005) couvrent les scénarios critiques. Le TDD strict ralentirait l'itération sur un MVP dont les specs évoluent encore.

## Décision

**Pyramide pragmatique** — tests unitaires + intégration légère, sans E2E automatisés en M0.

| Niveau | Outil | Scope | Cible |
|---|---|---|---|
| **Unitaires** | Vitest | Logique métier : services, règles domaine, calcul suggestion, seuils avatar | ≥ 60% couverture code métier |
| **Intégration** | Vitest + SQLite in-memory | Procédures tRPC complètes (router → service → repository → SQLite) | Flux critiques (session, exercice, progression) |
| **E2E** | Manuel (preview + smartphones) | Parcours complets (J1, J2, J3) sur le smartphone de Juju **et** celui de Papa | Avant chaque release M0 |

**Framework de test** : **Vitest** (natif Vite, rapide, compatible Jest API, supporte les workspaces pnpm).

**Tests d'accessibilité** : axe-core intégré en CI (plugin Vitest ou check dans le pipeline).

**Pas de tests de performance automatisés** en M0 (charge = 1 utilisatrice). À évaluer si le projet grandit.

## Exigences concernées

- [ENF-AUT-003 : Tests automatisés ≥ 60%](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-005 : Environnement de preview](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-008 : Test sur device réel](../../0-requirements/non-fonctionnelles/req-autres.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-002 Stack (Vitest, TypeScript) | [adr-002](adr-002-stack-applicative.md) |
| ADR-004 Base de données (SQLite in-memory pour tests) | [adr-004](adr-004-base-de-donnees.md) |
