# Feature : Diagnostic de version

## Description

Exposer un identifiant de version (git SHA court) pour le frontend, le backend et la base de données, afin de diagnostiquer rapidement les problèmes de déploiement. Le SHA est consultable via une page `/version` dans la SPA et via le healthcheck `/health` pour l'API et la DB.

## Critère de complétion

1. `GET /health` retourne le git SHA du build API, la date de build et l'état des migrations DB (appliquées en base vs livrées dans le build, avec noms lisibles)
2. La page `/version` de la SPA affiche le git SHA du build front, la date de build, et les infos du healthcheck (API + DB)
3. Le pipeline CI/CD injecte automatiquement le git SHA dans les deux builds (Docker API + Vite web)

## Priorité

- [x] Must have

## Exigences couvertes

- [ENF-AUT-001] : Disponibilité ≥ 99% — le diagnostic de version accélère la résolution d'incidents
- [ENF-AUT-002] : Déploiement simple < 15 min — vérification rapide post-deploy

## Dépendances

- F1 — Infrastructure & Stack (healthcheck existant, CI/CD en place)

## Écrans et API concernés

### Écrans

- **Page /version** : page diagnostic affichant les versions front, back et DB

### API

- **Health check enrichi** : `GET /health` retourne `{ status, version: { gitSha, buildDate }, db: { migrations: { appliedInDB, availableInBuild, currentInDB, latestInBuild } } }`. Les suffixes `InDB` / `InBuild` distinguent ce qui est réellement appliqué en base de ce que le build embarque — comparer les deux indique si la base est à jour avec le code déployé.

---

## Stories

### S1 : Enrichir le healthcheck avec les infos de version

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Ajouter au endpoint `/health` les informations de version de l'API (git SHA, date de build) et l'état des migrations DB (appliquées en base vs livrées dans le build).
**Justification** : Permet de vérifier en un `curl` que le bon code et le bon schéma sont déployés, et de détecter une base en retard sur le code.

> **Note (correctif post-livraison)** : la première version exposait `db.lastMigration` = le hash SHA256 du SQL de la dernière migration (ce que stocke `__drizzle_migrations`), illisible et inexploitable pour vérifier qu'une migration donnée est passée. Remplacé par l'objet `migrations` avec noms lisibles. Le nom (`0004_curly_crusher_hogan`) n'est pas en base mais dans `drizzle/meta/_journal.json` (livré avec le build) ; on le retrouve en croisant `__drizzle_migrations.created_at` avec le champ `when` du journal.

**Critères d'acceptation :**

```gherkin
GIVEN l'API démarrée avec GIT_SHA=abc1234 et BUILD_DATE=2026-05-20T12:00:00Z, base à jour
WHEN j'appelle GET /health
THEN je reçois 200 avec { status: "ok", version: { gitSha: "abc1234", buildDate: "2026-05-20T12:00:00Z" }, db: { migrations: { appliedInDB: 5, availableInBuild: 5, currentInDB: "0004_curly_crusher_hogan", latestInBuild: "0004_curly_crusher_hogan" } } }
```

```gherkin
GIVEN l'API démarrée avec un build embarquant une migration que la base n'a pas appliquée
WHEN j'appelle GET /health
THEN appliedInDB < availableInBuild et currentInDB ≠ latestInBuild (base en retard, visible sans booléen)
```

**Implémentation :**

- [x] Lire `GIT_SHA` et `BUILD_DATE` depuis les variables d'environnement (fallback "dev" / "unknown")
- [x] Compter les migrations appliquées (`__drizzle_migrations`) et retrouver leur nom lisible via le journal embarqué (`drizzle/meta/_journal.json`)
- [x] Enrichir la réponse de `GET /health` avec `version` et `db.migrations`
- [x] Tests : statut des migrations (base à jour, base en retard, table absente) + healthcheck avec/sans variables d'environnement
- **Statut** : Terminée

---

### S2 : Injecter le git SHA dans les builds CI/CD

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Modifier le pipeline CD pour injecter le git SHA court et la date de build dans les deux artefacts (Docker API + Vite web).
**Justification** : Sans injection CI/CD, les variables restent à leur valeur par défaut et le diagnostic est inutile.

**Critères d'acceptation :**

```gherkin
GIVEN un merge dans main qui déclenche le CD
WHEN le workflow build l'image Docker API
THEN la variable d'environnement GIT_SHA contient le short SHA du commit et BUILD_DATE la date ISO du build
```

```gherkin
GIVEN un merge dans main qui déclenche le CD
WHEN le workflow build le frontend Vite
THEN les defines VITE_GIT_SHA et VITE_BUILD_DATE sont injectés dans le bundle
```

**Implémentation :**

- [x] Dockerfile : ajouter ARG GIT_SHA / BUILD_DATE, les passer en ENV dans le stage prod
- [x] docker-compose.prod.yml : transmettre les build args (via cd.yml --build-arg)
- [x] cd.yml deploy-api : passer `--build-arg GIT_SHA=$(git rev-parse --short HEAD) --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)`
- [x] cd.yml deploy-web : ajouter `VITE_GIT_SHA` et `VITE_BUILD_DATE` au step de build Vite
- [x] vite.config.ts : variables exposées via `import.meta.env` (Vite gère nativement les VITE_*)
- [x] vite-env.d.ts : déclaration TypeScript des variables VITE_GIT_SHA et VITE_BUILD_DATE
- [x] Tests : typecheck + build local passent avec et sans les args
- **Statut** : Terminée

---

### S3 : Page /version dans la SPA

**Type** : US — **Estimation** : S (2 pts)

**Objectif** : Créer une page accessible à `/version` dans la SPA qui affiche les versions du front, du back et de la DB en un seul écran.
**Justification** : Permet à Papa de vérifier en un clic sur smartphone que le bon code est déployé partout.

**Critères d'acceptation :**

```gherkin
GIVEN la SPA déployée
WHEN j'accède à /version
THEN je vois la version front (git SHA, date de build), la version API (git SHA, date de build) et l'état des migrations DB (appliquée en base, livrée dans le build, compteur base/build)
```

```gherkin
GIVEN l'API est indisponible
WHEN j'accède à /version
THEN la section front s'affiche normalement et les sections API/DB affichent un message d'erreur clair
```

**Implémentation :**

- [x] Créer la route `/version` dans App.tsx (avant DeviceGuard, page technique sans auth)
- [x] Afficher les infos front depuis `import.meta.env` (VITE_GIT_SHA, VITE_BUILD_DATE)
- [x] Appeler `GET /health` pour récupérer les infos API + DB
- [x] Gérer le cas d'erreur (API indisponible) avec message explicite
- [x] Style mobile-first minimaliste (monospace, 480px max)
- [x] Tests : rendu de la page avec mock du healthcheck (succès + erreur)
- **Statut** : Terminée

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Enrichir healthcheck avec version | TS | S (2 pts) | Terminée |
| S2 | Injecter git SHA dans CI/CD | TS | S (2 pts) | Terminée |
| S3 | Page /version dans la SPA | US | S (2 pts) | Terminée |

**Total** : 3 stories — 6 points

---

**Statut** : Terminée

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| ADR-001 Cadrage infra | [adr-001](../../03-design/2-architecture/adr/adr-001-cadrage-infrastructure.md) |
| ADR-008 Observabilité | [adr-008](../../03-design/2-architecture/adr/adr-008-observabilite.md) |
| ADR-013 Pipeline CI/CD | [adr-013](../../03-design/2-architecture/adr/adr-013-pipeline-cicd.md) |
| F1 Infrastructure & Stack | [f1](f1-feature-infra-stack.md) |
