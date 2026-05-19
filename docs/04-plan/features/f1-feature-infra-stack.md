# Feature : Infrastructure & Stack

## Description

Mettre en place le socle technique du projet : monorepo fullstack TypeScript, API backend, frontend SPA, base de données, environnement de développement, pipeline CI/CD et environnement de preview. Cette feature est le prérequis technique de toutes les autres.

## Critère de complétion

1. `docker compose up` démarre l'API et le frontend en dev local avec hot reload
2. Le frontend SPA affiche une page d'accueil vide accessible sur smartphone via le réseau local
3. Un appel tRPC end-to-end (frontend → API → SQLite → réponse) fonctionne
4. Un push sur PR déclenche la CI (lint, type-check, tests) et le merge déploie en production
5. L'URL de production et l'URL de preview sont accessibles en HTTPS

## Priorité

- [x] Must have

## Exigences couvertes

- [ENF-AUT-001] : Disponibilité ≥ 99%
- [ENF-AUT-002] : Déploiement simple < 15 min
- [ENF-AUT-005] : Environnement de preview testable
- [ENF-AUT-006] : Hot reload en développement
- [ENF-AUT-008] : Test sur device réel pendant le build
- [ENF-PERF-001] : Temps de chargement initial < 3s

## Dépendances

Aucune — cette feature est le point de départ.

## Écrans et API concernés

### Écrans

Aucun écran fonctionnel — page d'accueil placeholder uniquement.

### API

- **Health check** : endpoint `/health` (200 OK si SQLite accessible)

---

## Stories

### S1 : Scaffold monorepo fullstack

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Créer la structure monorepo pnpm workspaces avec les deux apps (api + web) et le package partagé.
**Justification** : ADR-003 impose un monorepo fullstack. pnpm workspaces est le gestionnaire retenu.

**Critères d'acceptation :**

```gherkin
GIVEN un clone frais du repo
WHEN je lance pnpm install
THEN les dépendances de apps/api, apps/web et packages/ sont installées sans erreur
```

```gherkin
GIVEN le monorepo scaffoldé
WHEN je vérifie la structure des dossiers
THEN apps/api/src/, apps/web/src/, packages/ existent avec leur package.json respectif
```

**Implémentation :**

- [ ] Initialiser pnpm workspaces (pnpm-workspace.yaml)
- [ ] Créer apps/api/ avec package.json (Hono, tRPC, Drizzle, better-sqlite3, TypeScript)
- [ ] Créer apps/web/ avec package.json (React, Vite, TanStack Query, @trpc/react-query, Lucide, TypeScript)
- [ ] Créer packages/shared/ pour les types tRPC partagés
- [ ] Configurer tsconfig.json racine + héritage par workspace
- [ ] Configurer Biome (biome.json racine)
- [ ] Tests : vérifier `pnpm install` et `pnpm -r build` passent
- **Statut** : À faire

---

### S2 : API backend Hono + tRPC

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Mettre en place le serveur API Hono avec le router tRPC racine, le middleware CORS et un endpoint health check.
**Justification** : ADR-002 retient Hono + tRPC. Le health check est requis pour le déploiement (ADR-013).

**Critères d'acceptation :**

```gherkin
GIVEN l'API démarrée sur le port 3000
WHEN j'appelle GET /health
THEN je reçois 200 OK avec { "status": "ok" }
```

```gherkin
GIVEN l'API démarrée
WHEN j'appelle une procédure tRPC de test (hello)
THEN je reçois une réponse typée sans erreur
```

**Implémentation :**

- [ ] Créer le serveur Hono (apps/api/src/index.ts)
- [ ] Configurer le router tRPC racine (apps/api/src/trpc/)
- [ ] Ajouter le middleware CORS (origin configurable via env)
- [ ] Ajouter le endpoint /health
- [ ] Ajouter une procédure tRPC de test
- [ ] Tests : health check + procédure tRPC
- **Statut** : À faire

---

### S3 : Frontend React SPA + Vite

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Créer le frontend React avec Vite, le client tRPC connecté à l'API, et une page placeholder.
**Justification** : ADR-002 retient React SPA + Vite. Le client tRPC assure le typage end-to-end.

**Critères d'acceptation :**

```gherkin
GIVEN le frontend démarré en dev
WHEN j'ouvre http://localhost:5173 sur un navigateur mobile
THEN la page s'affiche en < 3 secondes avec le layout smartphone-first
```

```gherkin
GIVEN le frontend connecté à l'API
WHEN la page appelle la procédure tRPC de test
THEN la réponse typée s'affiche sans erreur dans le composant
```

**Implémentation :**

- [ ] Scaffolder apps/web/ avec Vite (template React + TypeScript)
- [ ] Configurer le client tRPC (@trpc/react-query + TanStack Query)
- [ ] Créer App.tsx avec layout mobile-first (max-width 480px, centré)
- [ ] Intégrer les fonts (Outfit + Plus Jakarta Sans) et les design tokens de base
- [ ] Vérifier le HMR (hot module replacement)
- [ ] Tests : build production sans erreur
- **Statut** : À faire

---

### S4 : Base de données SQLite + Drizzle

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Configurer SQLite avec Drizzle ORM, le schéma initial et les migrations.
**Justification** : ADR-004 retient SQLite + better-sqlite3 + Drizzle. Le schéma initial pose les tables de base.

**Critères d'acceptation :**

```gherkin
GIVEN le schéma Drizzle défini
WHEN je lance la migration
THEN la base SQLite est créée avec les tables de base (devices, invite_tokens)
```

```gherkin
GIVEN la base migrée
WHEN je lance les tests d'intégration avec SQLite in-memory
THEN les opérations CRUD fonctionnent sur les tables
```

**Implémentation :**

- [ ] Configurer Drizzle ORM (drizzle.config.ts)
- [ ] Définir le schéma initial (tables devices, invite_tokens)
- [ ] Configurer les migrations Drizzle
- [ ] Créer le helper SQLite in-memory pour les tests
- [ ] Tests : migration + CRUD basique
- **Statut** : À faire

---

### S5 : Docker Compose dev + prod

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Créer les fichiers Docker pour le développement local et la production, avec hot reload en dev et build optimisé en prod.
**Justification** : ADR-001 (Docker Compose), ADR-011 (environnement dev Docker complet).

**Critères d'acceptation :**

```gherkin
GIVEN un clone frais du repo avec Docker installé
WHEN je lance docker compose up
THEN l'API (port 3000) et le frontend (port 5173) démarrent avec hot reload
```

```gherkin
GIVEN le docker-compose.yml de production
WHEN je lance docker compose -f docker-compose.prod.yml up
THEN l'API démarre avec le build optimisé et le health check répond OK
```

**Implémentation :**

- [ ] Créer docker-compose.yml (dev : bind-mount volumes, hot reload)
- [ ] Créer Dockerfile API (multi-stage : dev + prod)
- [ ] Créer Dockerfile Web (dev : Vite dev server)
- [ ] Configurer le volume SQLite persistant
- [ ] Exposer les ports pour test sur smartphone réseau local
- [ ] Créer docker-compose.prod.yml
- [ ] Tester `docker compose up` depuis zéro
- **Statut** : À faire

---

### S6 : Pipeline CI (GitHub Actions)

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Configurer le workflow CI qui bloque le merge si lint, type-check ou tests échouent.
**Justification** : ADR-013 requiert CI sur chaque PR.

**Critères d'acceptation :**

```gherkin
GIVEN un push sur une branche de PR
WHEN la CI s'exécute
THEN Biome check, tsc --noEmit et Vitest passent en séquence
```

```gherkin
GIVEN un test qui échoue
WHEN la CI s'exécute
THEN le merge dans main est bloqué
```

**Implémentation :**

- [ ] Créer .github/workflows/ci.yml (Biome, tsc, Vitest)
- [ ] Configurer la protection de branche main (PR obligatoire, CI must pass)
- [ ] Configurer Lefthook (pre-commit : Biome, commit-msg : Conventional Commits)
- [ ] Tester avec une PR factice
- **Statut** : À faire

---

### S7 : Pipeline CD + Déploiement production

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Déployer automatiquement le frontend sur Cloudflare Pages et l'API sur le VPS Scaleway au merge dans main.
**Justification** : ADR-013, ENF-AUT-002 (deploy < 15 min).

**Critères d'acceptation :**

```gherkin
GIVEN un merge dans main
WHEN le workflow CD s'exécute
THEN le frontend est déployé sur Cloudflare Pages et l'API sur le VPS en < 15 minutes
```

```gherkin
GIVEN le déploiement terminé
WHEN j'accède à l'URL de production sur smartphone
THEN la page s'affiche en HTTPS et l'API répond au health check
```

**Implémentation :**

- [ ] Provisionner le VPS Scaleway (script ou README)
- [ ] Installer Docker + Caddy sur le VPS
- [ ] Configurer Cloudflare Pages (GitHub integration)
- [ ] Créer .github/workflows/cd.yml (build + deploy front + deploy API via SSH)
- [ ] Configurer DNS (domaine frontend + API)
- [ ] Configurer Caddy (reverse proxy + TLS auto)
- [ ] Tester le déploiement complet
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Scaffold monorepo fullstack | TS | M (3 pts) | À faire |
| S2 | API backend Hono + tRPC | TS | M (3 pts) | À faire |
| S3 | Frontend React SPA + Vite | TS | S (2 pts) | À faire |
| S4 | Base de données SQLite + Drizzle | TS | S (2 pts) | À faire |
| S5 | Docker Compose dev + prod | TS | M (3 pts) | À faire |
| S6 | Pipeline CI (GitHub Actions) | TS | S (2 pts) | À faire |
| S7 | Pipeline CD + Déploiement production | TS | M (3 pts) | À faire |

**Total** : 7 stories — 18 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| ADR-001 Cadrage infra | [adr-001](../../03-design/2-architecture/adr/adr-001-cadrage-infrastructure.md) |
| ADR-002 Stack applicative | [adr-002](../../03-design/2-architecture/adr/adr-002-stack-applicative.md) |
| ADR-003 Structure projet | [adr-003](../../03-design/2-architecture/adr/adr-003-structure-projet.md) |
| ADR-004 Base de données | [adr-004](../../03-design/2-architecture/adr/adr-004-base-de-donnees.md) |
| ADR-011 Environnement dev | [adr-011](../../03-design/2-architecture/adr/adr-011-environnement-dev.md) |
| ADR-012 Stratégie Git | [adr-012](../../03-design/2-architecture/adr/adr-012-strategie-git.md) |
| ADR-013 Pipeline CI/CD | [adr-013](../../03-design/2-architecture/adr/adr-013-pipeline-cicd.md) |
| ADR-014 Conventions code | [adr-014](../../03-design/2-architecture/adr/adr-014-conventions-code.md) |
| initiative I-T.1 | [Initiatives](../../01-strategy/initiatives.md) |
| infrastructure | [Infrastructure](../../03-design/2-architecture/deployment/infrastructure.md) |
