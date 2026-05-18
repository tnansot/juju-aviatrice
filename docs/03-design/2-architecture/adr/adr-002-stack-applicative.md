# ADR-002 : Stack applicative

## Contexte

Le projet est un monolithe personnel mono-tenant, construit par un développeur solo (Papa) pour une utilisatrice unique (Juju). La stack doit maximiser la productivité en solo et la légèreté sur un VPS 2 Go (ADR-001). Les alternatives lourdes (NestJS, Prisma, GraphQL, microservices, message broker) sont écartées — surdimensionnées pour ce contexte.

## Décision

### Architecture applicative

**Monolithe** — une application backend unique, un seul container Docker, un seul process Node.js.

### Multi-tenancy

**Mono-tenant** — pas de notion de tenant. Une seule instance pour Juju, pas de colonne `tenant_id`.

### Stack backend

| Choix | Détail |
|---|---|
| **Langage** | TypeScript, runtime Node.js (LTS) |
| **Framework** | Hono — API minimaliste, typage natif, middleware intégré |
| **API** | tRPC — type-safe end-to-end avec le frontend React |
| **ORM** | Drizzle ORM — léger, type-safe, proche du SQL, bon support SQLite |
| **Gestion d'erreurs** | Exceptions typées (classes custom) converties en `TRPCError` par middleware |

### Stack frontend

| Choix | Détail |
|---|---|
| **Type** | SPA (Single Page Application) — pas de SSR (pas de SEO nécessaire) |
| **Framework** | React |
| **Build tool** | Vite (hot reload rapide, build optimisé) |
| **State management** | TanStack Query via `@trpc/react-query` (server state) + `useState`/`useContext` (client state) |
| **Icônes** | Lucide (`lucide-react`, tree-shakable) |
| **Hébergement** | Cloudflare Pages (gratuit, CDN mondial, déjà utilisé pour le wiki) |

### Protocole frontend-backend

**tRPC** — typage partagé end-to-end entre le frontend React et le backend Hono. Pas de schéma API à maintenir séparément.

### Communication inter-modules

**Appels de méthode in-process** — les bounded contexts s'appellent directement via leurs interfaces TypeScript. Les événements de domaine (`exercice_effectue`, `mini_session_terminee`…) sont des appels de méthode synchrones, pas des messages asynchrones.

## Exigences concernées

- [ENF-PERF-001 : Chargement < 3s](../../0-requirements/non-fonctionnelles/req-performance.md) — SPA légère sur CDN
- [ENF-PERF-002 : Fluidité < 300ms](../../0-requirements/non-fonctionnelles/req-performance.md) — SPA + tRPC sans page intermédiaire
- [ENF-PERF-003 : Assets < 5 Mo](../../0-requirements/non-fonctionnelles/req-performance.md) — Vite tree-shaking + Lucide tree-shakable
- [ENF-AUT-006 : Hot reload](../../0-requirements/non-fonctionnelles/req-autres.md) — Vite HMR
- [ENF-INT-001 : Support smartphone Juju](../../0-requirements/non-fonctionnelles/req-interoperabilite.md) — React SPA responsive

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-001 Cadrage infrastructure | [adr-001](adr-001-cadrage-infrastructure.md) |
| bounded contexts (6 BCs) | [context-map](../../1-domain/context-map.md) |
| persona Papa (builder solo) | [persona-papa-porteur.md](../../../02-discovery/personas/persona-papa-porteur.md) |
| initiative I-T.1 | [initiatives.md](../../../01-strategy/initiatives.md) |
