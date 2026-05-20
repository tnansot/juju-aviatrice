# Feature : Infrastructure & Stack — Bilan technique

## Synthèse

| Métrique | Planifié | Réalisé |
|----------|----------|---------|
| Stories | 7 TS | 7 TS |
| Points | 18 | 18 |
| Couverture de tests | - | Non mesurée (coverage non configuré) |

## Critère de complétion

**Objectif** : Socle technique opérationnel — monorepo, API, frontend SPA, BDD, Docker, CI/CD, déploiement prod.

**Atteint** : [x] Oui

1. `docker compose up` démarre API + frontend avec hot reload → **validé**
2. Frontend SPA accessible sur smartphone réseau local → **validé**
3. Appel tRPC end-to-end (frontend → API → SQLite → réponse) → **validé**
4. Push PR → CI → merge → deploy prod → **validé**
5. URLs prod et preview accessibles HTTPS → **validé**

## Stories implémentées

| # | Titre | Points | Statut | Remarques |
|---|-------|--------|--------|-----------|
| S1 | Scaffold monorepo fullstack | 3 | Terminée | pnpm workspaces, 3 packages |
| S2 | API backend Hono + tRPC | 3 | Terminée | Health check + procédure test |
| S3 | Frontend React SPA + Vite | 2 | Terminée | Client tRPC + page placeholder |
| S4 | Base de données SQLite + Drizzle | 2 | Terminée | Schéma initial + migrations |
| S5 | Docker Compose dev + prod | 3 | Terminée | Multi-stage build |
| S6 | Pipeline CI (GitHub Actions) | 2 | Terminée | Biome + tsc + Vitest |
| S7 | Pipeline CD + Déploiement prod | 3 | Terminée | VPS Scaleway + CF Pages |

## Stories non terminées

Aucune — toutes les stories sont livrées.

## Bloqueurs rencontrés

| Bloqueur | Impact | Résolution |
|----------|--------|------------|
| Clé SSH VPS protégée par passphrase | CD échouait (SSH auth impossible) | Ajout secret `VPS_SSH_PASSPHRASE` + paramètre `passphrase` dans ssh-action |
| Wrangler 4.x ne supporte plus `.toml` | CF Pages build échouait | Migration vers `wrangler.jsonc` à la racine du monorepo |
| Formatage Biome (ligne trop longue) | CI échouait sur tous les push | Reformatage de `router.test.ts` |
| Wrangler `not_found_handling` en TOML | Deploy CF Pages cassé | Retiré temporairement — SPA routing à configurer séparément |

## Dette technique identifiée

| Élément | Sévérité | Action recommandée | Story à créer |
|---------|----------|-------------------|---------------|
| Actions GitHub v4 → v6 | Moyenne | Merger les PR Dependabot (Node.js 20 deprecated juin 2026) | Non — PRs Dependabot existantes |
| SPA routing CF Pages | Basse | Configurer `not_found_handling` dans `wrangler.jsonc` quand supporté | Non — fonctionnel tant que l'app n'a qu'une route |
| Couverture de tests non mesurée | Basse | Installer `@vitest/coverage-v8` | À intégrer dans F2+ |
| trpc-panel en dev | Basse | Ajouter interface d'exploration tRPC en dev | Optionnel |
| Storybook / Design system | Basse | À configurer quand le frontend avancera | Prévu dans la setup avant stories frontend |

## Qualité du code

| Métrique | Valeur | Seuil | Statut |
|----------|--------|-------|--------|
| Couverture tests | Non mesurée | 60% (DoD) | En attente |
| Erreurs lint | 0 | 0 | [x] OK |
| CI/CD | Vert | Vert | [x] OK |
| Tests | 2/2 passent | 0 échec | [x] OK |
| Build frontend | 298 KB (91 KB gzip) | < 3s chargement | [x] OK |

## Points d'attention pour la suite

1. **Merger les PR Dependabot** (actions/checkout v6, actions/setup-node v6, pnpm/action-setup v6) avant juin 2026 — Node.js 20 sera retiré des runners GitHub Actions
2. **Installer `@vitest/coverage-v8`** dès F2 pour respecter le seuil DoD de 60% de couverture
3. **Configurer Storybook** avant les premières stories frontend (F3)
4. **Tester le SPA routing** dès que l'app aura plusieurs routes (F3) — le `not_found_handling` devra être résolu
5. **Surveiller la taille du bundle** frontend à chaque feature (298 KB gzip actuel, seuil ENF-PERF-001 < 3s 4G)

---

**Rédigé le** : 2026-05-20

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| feature | [F1 — Infrastructure & Stack](f1-feature-infra-stack.md) |
| setup-report | [Setup Report](../setup-report.md) |
| protocole-deploiement | [Protocole déploiement](../protocole-deploiement-prod.md) |
| ADR appliqués | [ADR](../../03-design/2-architecture/adr/) |
