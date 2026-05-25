# Accès à la base de données

La base de données est un fichier **SQLite** unique (`juju-aviatrice.sqlite`), géré via **Drizzle ORM** avec le driver `better-sqlite3` en mode WAL.

## Fichiers associés

| Fichier | Rôle |
|---|---|
| `juju-aviatrice.sqlite` | Base de données principale |
| `juju-aviatrice.sqlite-wal` | Journal WAL (écritures non encore consolidées) |
| `juju-aviatrice.sqlite-shm` | Shared Memory (coordination accès concurrent) |

Les fichiers `-wal` et `-shm` sont temporaires et autogérés par SQLite. Ne jamais copier le `.sqlite` sans eux si la DB est ouverte.

## Deux bases distinctes en local

`pnpm dev` à la racine lance **Docker** — la base vit dans le volume Docker `api-data`, pas sur le disque hôte. Le fichier `apps/api/data/juju-aviatrice.sqlite` sur le disque est une **base séparée**, utilisée uniquement quand on lance le serveur hors Docker (depuis `apps/api/`).

| Base | Quand | Migrations |
|---|---|---|
| Volume Docker `api-data` | `pnpm dev` (racine, via Docker) | Automatiques au démarrage du conteneur |
| `apps/api/data/juju-aviatrice.sqlite` | `pnpm dev` depuis `apps/api/` (hors Docker) | Automatiques au démarrage (`migrate.ts` chaîné dans le script `dev`) |

Les deux bases **ne se synchronisent pas** entre elles. Toute donnée créée en Docker reste dans le volume Docker, et inversement.

## Environnement local (sans Docker)

**Emplacement** : `apps/api/data/juju-aviatrice.sqlite` (créé automatiquement au premier démarrage ou migration).

**Accès CLI** :

```bash
# Ouvrir un shell SQLite interactif
sqlite3 apps/api/data/juju-aviatrice.sqlite

# Exemples de requêtes
.tables                          -- lister les tables
.schema users                    -- voir le DDL d'une table
SELECT * FROM users LIMIT 5;     -- requête libre
.quit                            -- quitter
```

**Appliquer les migrations** :

```bash
cd apps/api
pnpm exec tsx src/migrate.ts
```

**Scripts utilitaires** (depuis `apps/api/`) :

```bash
pnpm seed               # peupler la base avec des données de test
pnpm reset:onboarding   # remettre à zéro l'onboarding
```

**Drizzle Studio** (interface graphique de visualisation) :

```bash
cd apps/api
pnpm exec drizzle-kit studio
```

## Environnement local (Docker)

La base est stockée dans un **volume Docker nommé** `api-data`, monté sur `/app/apps/api/data` dans le conteneur.

**Accès CLI via Docker** :

```bash
# Shell SQLite dans le conteneur dev
docker compose exec api sqlite3 ./data/juju-aviatrice.sqlite

# Ou copier la base en local pour inspection
docker compose cp api:/app/apps/api/data/juju-aviatrice.sqlite ./backup.sqlite
sqlite3 ./backup.sqlite
```

**Localiser le volume sur le disque hôte** :

```bash
docker volume inspect juju-aviatrice_api-data
```

## Environnement de production

**Configuration** : `docker-compose.prod.yml` — volume nommé `api-data` monté sur `/app/data`.

**Accès CLI** :

```bash
# Se connecter au conteneur prod
docker compose -f docker-compose.prod.yml exec api sqlite3 ./data/juju-aviatrice.sqlite
```

**Sauvegarder la base prod** :

```bash
# Copier le fichier en local (safe même si la DB est ouverte grâce au mode WAL)
docker compose -f docker-compose.prod.yml cp api:/app/data/juju-aviatrice.sqlite ./backup-prod.sqlite
```

**Restaurer une sauvegarde** :

```bash
# Arrêter l'API avant de restaurer
docker compose -f docker-compose.prod.yml stop api
docker compose -f docker-compose.prod.yml cp ./backup-prod.sqlite api:/app/data/juju-aviatrice.sqlite
docker compose -f docker-compose.prod.yml start api
```

## Migrations

Les migrations Drizzle sont dans `apps/api/drizzle/` et s'exécutent **automatiquement au démarrage** via `migrate.ts` — que ce soit en Docker (chaîné dans le `CMD` du Dockerfile) ou hors Docker (chaîné dans le script `dev` de `apps/api/package.json`).

Pour générer une nouvelle migration après modification du schéma :

```bash
cd apps/api
pnpm exec drizzle-kit generate
```

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `DATABASE_URL` | `./data/juju-aviatrice.sqlite` | Chemin relatif au CWD du processus API |
