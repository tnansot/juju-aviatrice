# ADR-004 : Base de données

## Contexte

Le projet a un volume de données très faible (1 utilisatrice, quelques centaines de sessions, ~50-100 exercices). Les alternatives relationnelles client-serveur (PostgreSQL, MariaDB) ajoutent un container et de la RAM pour aucun bénéfice à cette échelle. Les bases document (MongoDB) et les solutions managées (Turso, Supabase) ajoutent de la complexité ou du lock-in sans valeur ajoutée.

## Décision

**SQLite** via **better-sqlite3** (driver natif Node.js, synchrone, performant) + **Drizzle ORM** (schéma type-safe, migrations).

| Aspect | Détail |
|---|---|
| **Produit** | SQLite 3 |
| **Driver** | better-sqlite3 |
| **ORM** | Drizzle ORM (schéma TS, migrations SQL) |
| **Hébergement** | Fichier sur le VPS, dans un volume Docker persistant |
| **Organisation** | Schéma unique (un seul fichier `.sqlite`) — tables préfixées par BC si besoin de clarté |
| **Backup** | Copie du fichier SQLite (cron ou script shell). Restauration : remplacer le fichier |
| **Pas de cache** | Aucune couche cache (Redis, Memcached) — les temps de réponse SQLite in-process sont < 1ms, largement sous les 300ms requis (ENF-PERF-002) |

## Exigences concernées

- [ENF-PERF-002 : Fluidité < 300ms](../../0-requirements/non-fonctionnelles/req-performance.md) — SQLite in-process, pas de latence réseau
- [ENF-SEC-003 : Protection des données](../../0-requirements/non-fonctionnelles/req-securite.md) — fichier local, pas d'exposition réseau
- [ENF-AUT-001 : Disponibilité ≥ 99%](../../0-requirements/non-fonctionnelles/req-autres.md) — pas de serveur DB séparé pouvant tomber

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-001 Cadrage infrastructure | [adr-001](adr-001-cadrage-infrastructure.md) |
| ADR-002 Stack applicative (Drizzle) | [adr-002](adr-002-stack-applicative.md) |
| bounded contexts | [context-map](../../1-domain/context-map.md) |
