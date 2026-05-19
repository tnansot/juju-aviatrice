# Setup Report — juju-aviatrice

> **Date** : 2026-05-19
> **Builder** : Papa avec Claude

## ADR appliqués

| ADR | Domaine | Statut |
|-----|---------|--------|
| [ADR-001](docs/03-design/2-architecture/adr/adr-001-cadrage-infrastructure.md) | Infrastructure (VPS Scaleway + Cloudflare Pages) | ✅ Appliqué |
| [ADR-002](docs/03-design/2-architecture/adr/adr-002-stack-applicative.md) | Stack (Hono + tRPC + React + Vite) | ✅ Appliqué |
| [ADR-003](docs/03-design/2-architecture/adr/adr-003-structure-projet.md) | Structure (monorepo fullstack pnpm) | ✅ Appliqué |
| [ADR-004](docs/03-design/2-architecture/adr/adr-004-base-de-donnees.md) | BDD (SQLite + Drizzle) | ✅ Appliqué |
| [ADR-010](docs/03-design/2-architecture/adr/adr-010-strategie-test.md) | Tests (Vitest) | ✅ Appliqué |
| [ADR-011](docs/03-design/2-architecture/adr/adr-011-environnement-dev.md) | Env dev (Docker Compose + hot reload) | ✅ Appliqué |
| [ADR-012](docs/03-design/2-architecture/adr/adr-012-strategie-git.md) | Git (GitHub Flow + Lefthook) | ✅ Appliqué |
| [ADR-013](docs/03-design/2-architecture/adr/adr-013-pipeline-cicd.md) | CI/CD (GitHub Actions) | ✅ Configuré |
| [ADR-014](docs/03-design/2-architecture/adr/adr-014-conventions-code.md) | Conventions (Biome) | ✅ Appliqué |

## Étapes exécutées

| Étape | Statut | Détail |
|-------|--------|--------|
| Config PBM mise à jour | ✅ | `pbm_code_roots` → fullstack template |
| Scaffolding monorepo | ✅ | pnpm workspaces : apps/api, apps/web, packages/shared |
| Backend Hono + tRPC | ✅ | Serveur, router, healthcheck, procédure test |
| Frontend React + Vite | ✅ | SPA, client tRPC, page placeholder |
| SQLite + Drizzle | ✅ | Schéma (devices, invite_tokens), migration générée |
| Docker Compose dev | ✅ | 2 services, hot reload, volumes source |
| Docker Compose prod | ✅ | Multi-stage build, restart always |
| Biome config | ✅ | Lint + format racine |
| Vitest config | ✅ | API : 2 tests passent |
| CI GitHub Actions | ✅ | Workflow ci.yml (Biome + tsc + Vitest) |
| Lefthook | ✅ | pre-commit (Biome), commit-msg (Conventional Commits) |
| README.md | ✅ | Sections techniques ajoutées |

## Vérifications automatiques

| Vérification | Commande | Résultat |
|---|---|---|
| Lint | `npx biome check .` | ✅ 0 erreur |
| Typecheck API | `cd apps/api && tsc --noEmit` | ✅ 0 erreur |
| Typecheck Web | `cd apps/web && tsc --noEmit` | ✅ 0 erreur |
| Tests | `pnpm test` | ✅ 2/2 passent |
| Build frontend | `cd apps/web && vite build` | ✅ 298 KB (91 KB gzip) |
| API native | `tsx src/index.ts` | ✅ Démarre, healthcheck OK |
| Docker build | `docker compose build` | ✅ Images construites |
| Docker up | `docker compose up -d` | ✅ 2 services UP |
| Health Docker | `curl localhost:3000/health` | ✅ `{"status":"ok"}` |
| tRPC Docker | `curl localhost:3000/trpc/hello` | ✅ Réponse typée |
| Frontend Docker | `curl localhost:5173` | ✅ HTML Vite avec HMR |

## Éléments restants

| Élément | Statut | Note |
|---|---|---|
| CI verte sur GitHub | ⏸ | À valider au premier push/PR |
| CD (workflow) | ✅ | `.github/workflows/cd.yml` — deploy API via SSH |
| CD (VPS provisionné) | ⏸ | Exécuter `scripts/setup-vps.sh` + configurer secrets GitHub |
| CD (CF Pages app) | ⏸ | Créer le 2e projet CF Pages (instructions dans `DEPLOIEMENT.md`) |
| CD (DNS configuré) | ⏸ | Enregistrements A + CNAME à créer |
| Caddyfile | ✅ | Reverse proxy TLS auto pour l'API |
| Dependabot | ✅ | `.github/dependabot.yml` — npm + GH Actions hebdomadaire |
| trpc-panel en dev | ⏸ | Story S2 — configurable via env |
| Storybook / Design system | ⏸ | À configurer quand le frontend sera plus avancé |
