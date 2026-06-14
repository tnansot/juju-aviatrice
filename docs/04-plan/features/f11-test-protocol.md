# Protocole de test — F11 Diagnostic de version

> **Feature** : F11 — Diagnostic de version
> **Date** : 2026-05-20
> **Testeur** : _____________

## Prérequis

```bash
# Repartir d'un état propre (supprime le volume DB) puis démarrer
docker compose down -v
docker compose up --build
# Attendre les logs : "Migrations appliquées avec succès." puis "API démarrée sur http://localhost:3000"
```

## Scénario 1 — Healthcheck enrichi (S1)

**Story** : S1 — Enrichir le healthcheck avec les infos de version

**Critères Gherkin** :

- GIVEN l'API démarrée → WHEN GET /health → THEN réponse 200 avec version + db
- GIVEN l'API sans GIT_SHA/BUILD_DATE → THEN fallback "dev" / "unknown"

**Action** :

```bash
curl -s http://localhost:3000/health | jq .
```

**Résultat attendu** :

```json
{
  "status": "ok",
  "version": {
    "gitSha": "dev",
    "buildDate": "unknown"
  },
  "db": {
    "migrations": {
      "appliedInDB": 5,
      "availableInBuild": 5,
      "currentInDB": "0004_curly_crusher_hogan",
      "latestInBuild": "0004_curly_crusher_hogan"
    }
  }
}
```

> **Dernière migration attendue** : `0004_curly_crusher_hogan` (5 migrations au total). Cette valeur de référence est la dernière entrée de [`apps/api/drizzle/meta/_journal.json`](../../../apps/api/drizzle/meta/_journal.json) — à mettre à jour ici à chaque nouvelle migration. Elle permet de contrôler que le **build embarque bien la migration la plus récente** : si `latestInBuild` ne correspond pas à cette valeur, le build est en retard sur le code (artefact reconstruit sans la dernière migration).

- [ ] OK — status "ok"
- [ ] OK — version.gitSha présent (en dev local : "dev")
- [ ] OK — version.buildDate présent (en dev local : "unknown")
- [ ] OK — `latestInBuild` == `0004_curly_crusher_hogan` (la migration la plus récente du repo) → le build est à jour
- [ ] OK — `currentInDB` == `latestInBuild` → la base a bien appliqué la dernière migration livrée
- [ ] OK — `appliedInDB` == `availableInBuild` (== 5) → toutes les migrations du build sont appliquées

---

## Scénario 2 — Page /version frontend (S3)

**Story** : S3 — Page /version dans la SPA

**Critères Gherkin** :

- GIVEN la SPA démarrée → WHEN j'accède à /version → THEN infos front + API + DB
- GIVEN l'API indisponible → WHEN /version → THEN message d'erreur clair

**Action** : ouvrir http://localhost:5173/version dans le navigateur

**Résultat attendu** :

- Section "Frontend" avec Git SHA "dev" et Build "unknown" (en dev local)
- Section "API" avec Status "ok", Git SHA et Build
- Section "Base de données" avec migration appliquée (base), migration livrée (build) et le compteur base / build

- [x] OK — Page /version accessible
- [x] OK — Section Frontend affichée
- [x] OK — Section API affichée avec données du healthcheck
- [x] OK — Section Base de données affichée avec migration base/build (les deux noms concordent si la base est à jour)

**Test erreur API** : arrêter l'API (`docker compose stop api`) puis recharger /version

- [ ] OK — Sections API et DB affichent un message d'erreur (pas de crash)

---

## Scénario 3 — Injection CI/CD (S2)

**Story** : S2 — Injecter le git SHA dans les builds CI/CD

> Ce scénario sera validé après le merge et le déploiement en production.

**Vérification post-deploy** :

```bash
# API en production
curl -s https://api.juju-aviatrice.uk/health | jq .
```

- [ ] OK — version.gitSha contient un SHA court (7 caractères, pas "dev")
- [ ] OK — version.buildDate contient une date ISO (pas "unknown")
- [ ] OK — `db.migrations.latestInBuild` == `0004_curly_crusher_hogan` → l'artefact prod embarque bien la migration la plus récente (sinon : image reconstruite sans la dernière migration)
- [ ] OK — `db.migrations.currentInDB` == `latestInBuild` et `appliedInDB` == `availableInBuild` → la base prod est à jour

**Page /version en production** : ouvrir https://app.juju-aviatrice.uk/version

- [ ] OK — Git SHA front correspond au commit mergé
- [ ] OK — Git SHA API correspond au même commit

---

## Résultat

- [ ] Tous les scénarios OK
- **Testeur** : _____________
- **Date** : _____________
