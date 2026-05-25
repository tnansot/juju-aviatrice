# Bilan technique — F11 Diagnostic de version

> **Date** : 2026-05-21 — Thomas (Papa) avec Claude

## Résumé

Feature de diagnostic opérationnel : expose le git SHA du build, la date de build et la dernière migration DB via le healthcheck API (`GET /health`) et une page `/version` dans la SPA. Permet de vérifier en un coup d'œil quelle version est déployée en production.

## Stories livrées

| Story | Type | Points | Statut |
|-------|------|--------|--------|
| S1 — Enrichir healthcheck avec version | TS | 2 | Terminée |
| S2 — Injecter git SHA dans CI/CD | TS | 2 | Terminée |
| S3 — Page /version dans la SPA | US | 2 | Terminée |

**Total** : 3/3 stories — 6 points

## Décisions techniques

| Décision | Justification |
|----------|---------------|
| Git SHA court (pas SemVer) | Identifie exactement le code déployé sans gestion manuelle de version |
| Variables d'env (`GIT_SHA`, `BUILD_DATE`) | Injectées au build Docker (ARG→ENV) et Vite (`VITE_*`), fallback "dev"/"unknown" en local |
| Query `__drizzle_migrations` avec try/catch isolé | La table peut ne pas exister si les migrations n'ont pas été exécutées — ne doit pas faire tomber le healthcheck |
| Page `/version` hors DeviceGuard | Page technique pour Papa, pas besoin d'authentification device |
| Migrations auto au démarrage Docker dev | Évite l'état incohérent (tables existantes, journal migrations vide) |
| `not_found_handling: single-page-application` dans wrangler | Nécessaire pour que Cloudflare Workers serve `index.html` sur les routes SPA |

## Problèmes rencontrés et corrections

| Problème | Cause | Fix |
|----------|-------|-----|
| Healthcheck 503 au lieu de 200 | Le `SELECT` sur `__drizzle_migrations` échouait si table absente, le catch unique renvoyait "error" | Try/catch séparé pour la DB check et la lecture migration |
| `lastMigration: "unknown"` en Docker dev | Les migrations n'étaient pas exécutées au démarrage du container | CMD dev modifié : `tsx src/migrate.ts && pnpm dev` |
| `lastMigration: "unknown"` après recréation DB | Fichiers WAL orphelins + API avec ancienne connexion | Supprimer `-shm`/`-wal` + restart API |
| 404 sur `/version` en production | Cloudflare Workers ne fait pas de fallback SPA par défaut | Ajout `not_found_handling: "single-page-application"` |

## Fichiers modifiés

| Fichier | Nature |
|---------|--------|
| `apps/api/src/index.ts` | Healthcheck enrichi |
| `apps/api/src/health.test.ts` | 4 tests healthcheck |
| `apps/api/Dockerfile` | ARG/ENV version + migrations auto dev |
| `.github/workflows/cd.yml` | Injection SHA dans builds Docker et Vite |
| `apps/web/src/App.tsx` | Route `/version` |
| `apps/web/src/version/VersionPage.tsx` | Page diagnostic |
| `apps/web/src/version/VersionPage.test.tsx` | 2 tests page version |
| `apps/web/src/vite-env.d.ts` | Types Vite env |
| `wrangler.jsonc` | Fallback SPA |

## Métriques

| Métrique | Valeur |
|----------|--------|
| Tests ajoutés | 6 (4 API + 2 web) |
| Fichiers créés | 4 |
| Fichiers modifiés | 5 |
| Commits | 5 (1 feature + 1 protocole + 1 fix healthcheck + 1 fix Docker + 1 fix SPA) |

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| Feature F11 | [f11-feature-version-diagnostic.md](f11-feature-version-diagnostic.md) |
| Protocole de test | [f11-test-protocol.md](f11-test-protocol.md) |
| ADR-008 Observabilité | [adr-008](../../03-design/2-architecture/adr/adr-008-observabilite.md) |
| ADR-013 Pipeline CI/CD | [adr-013](../../03-design/2-architecture/adr/adr-013-pipeline-cicd.md) |
