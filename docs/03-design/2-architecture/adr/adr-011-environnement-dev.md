# ADR-011 : Environnement de développement local

## Contexte

Le projet est un monorepo fullstack TypeScript (React + Hono + SQLite). L'alternative « local natif » offre le hot reload le plus rapide mais ne garantit pas la parité avec la prod. Docker Compose complet assure cette parité. Les Devcontainers ajoutent une couche de complexité sans bénéfice net pour un développeur solo.

## Décision

**Docker Compose complet** — API et frontend tournent dans des containers en dev, identiques à la prod.

| Aspect | Détail |
|---|---|
| **Services** | `api` (Node.js + Hono), `web` (Node.js + Vite dev server) |
| **BDD** | SQLite fichier monté en volume Docker (pas de container BDD séparé) |
| **Hot reload** | Volumes bind-mount pour le code source. Vite HMR pour le frontend, `tsx --watch` pour l'API |
| **Runtime Docker macOS** | **OrbStack** (remplacement Docker Desktop, performances réseau et volumes nettement supérieures sur Mac) |
| **Accès réseau local** | Ports exposés pour tester sur smartphone via le réseau local (ENF-AUT-008) |
| **Commande unique** | `docker compose up` démarre tout l'environnement |

### Debug API (backend isolé)

**trpc-panel** (`trpc-panel`, dépendance dev) — UI web auto-générée depuis le root router tRPC, exposée en dev uniquement sur `/panel`. Permet de tester chaque procédure (queries et mutations) indépendamment du frontend, avec formulaires d'input générés depuis les schémas Zod et réponses JSON en temps réel. Conditionné à `NODE_ENV === "development"`.

## Exigences concernées

- [ENF-AUT-006 : Hot reload < 3s](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-008 : Test sur device réel](../../0-requirements/non-fonctionnelles/req-autres.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-001 Cadrage infrastructure (Docker Compose) | [adr-001](adr-001-cadrage-infrastructure.md) |
| ADR-002 Stack (Node.js, Vite) | [adr-002](adr-002-stack-applicative.md) |
| ADR-004 Base de données (SQLite) | [adr-004](adr-004-base-de-donnees.md) |
