# juju-aviatrice

Projet personnel et familial pour aider **Juju** (lycéenne en 1ère générale, spécialités scientifiques, en cours de formation PPL) à préparer les épreuves de sélection des **formations pilote de ligne** européennes (ENAC EPL, Cadets Air France, et autres programmes cadets).

Le projet produit **deux artefacts complémentaires** :

| Artefact | Rôle | Public | Source |
|---|---|---|---|
| **Wiki** | Base documentaire de référence sur les formations, épreuves et prérequis | Juju (et son père) | [wiki/](wiki/) → publié sur [juju-aviatrice.pages.dev](https://juju-aviatrice.pages.dev) |
| **App d'entraînement** | Outil interactif de révision (maths, physique, tests psychotechniques) | Juju | [apps/](apps/) |

## Structure du repository

```
juju-aviatrice/
├── apps/
│   ├── api/              # Backend Hono + tRPC + SQLite (Drizzle)
│   └── web/              # Frontend React SPA + Vite
├── packages/
│   └── shared/           # Types partagés entre apps
├── wiki/                 # Sources du wiki (MkDocs Material)
├── docs/                 # Artefacts produit PBM (strategy → plan)
├── cadrage-brouillon/    # Notes brutes de discovery (entretien Juju)
├── docker-compose.yml    # Dev local (hot reload)
├── docker-compose.prod.yml
└── CLAUDE.md
```

## Stack technique

| Composant | Technologie |
|---|---|
| Backend | Hono + tRPC + TypeScript |
| Frontend | React SPA + Vite |
| Base de données | SQLite + better-sqlite3 + Drizzle ORM |
| Dev local | Docker Compose (OrbStack sur macOS) |
| CI | GitHub Actions (Biome + tsc + Vitest) |
| Hébergement | Cloudflare Pages (front) + VPS Scaleway (API) |

## Développement local

### Prérequis

- Node.js >= 22
- pnpm (`corepack enable`)
- Docker + OrbStack (macOS)

### Démarrer (Docker)

```bash
pnpm install
docker compose up
```

### Démarrer (sans Docker)

```bash
pnpm install

# Terminal 1 — API
cd apps/api && pnpm dev

# Terminal 2 — Frontend
cd apps/web && pnpm dev
```

| URL | Service |
|---|---|
| http://localhost:5173 | Frontend |
| http://localhost:3000 | API |
| http://localhost:3000/health | Health check |
| http://localhost:3000/panel | tRPC Panel (dev uniquement) |

### Commandes

| Commande | Description |
|---|---|
| `pnpm lint` | Biome check (lint + format) |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm typecheck` | tsc --noEmit sur tous les workspaces |
| `pnpm test` | Vitest sur tous les workspaces |
| `pnpm build` | Build tous les workspaces |

### Migrations

```bash
cd apps/api
npx drizzle-kit generate   # Générer une migration
npx drizzle-kit migrate     # Appliquer les migrations
```

### Variables d'environnement

Voir [.env.example](.env.example).

## État d'avancement

- ✅ **Wiki en ligne** : fiches formations + épreuves publiées sur Cloudflare Pages avec Giscus.
- ✅ **Phases Strategy → Plan** : vision, discovery, design (13 ADR), plan (10 features, 48 stories).
- ⏳ **Phase Implementation** : scaffolding du monorepo fullstack en cours (F1).

## Méthodologie : PBM (Product Builder Method)

Le projet suit le framework **PBM** en 6 phases séquentielles :

```
Strategy → Discovery → Design → Plan → Implementation → Run
```

Chaque phase produit des livrables structurés dans le sous-répertoire `docs/<phase>/` correspondant. Pour démarrer ou continuer : `/bmad-help` puis `/pbm-strategy` (ou la phase courante).

Détails du module : [_bmad/pbm/README.md](_bmad/pbm/README.md).

## Wiki (MkDocs)

```bash
.venv/bin/mkdocs serve   # http://127.0.0.1:8000
```

Publier : `git push origin main` → Cloudflare Pages rebuild (~1 min). Voir [DEPLOIEMENT.md](DEPLOIEMENT.md).

## Liens utiles

- **Wiki publié** : <https://juju-aviatrice.pages.dev> (accès restreint Cloudflare Access)
- **Discussions GitHub** (commentaires Giscus) : onglet Discussions du repo
- **Index du wiki** : [wiki/README.md](wiki/README.md)
- **Comparatif des formations** : [wiki/formations/comparatif.md](wiki/formations/comparatif.md)
- **Doc déploiement** : [DEPLOIEMENT.md](DEPLOIEMENT.md)
- **Instructions IA** : [CLAUDE.md](CLAUDE.md)
