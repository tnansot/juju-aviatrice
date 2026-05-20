# Protocole de test — F11 Diagnostic de version

> **Feature** : F11 — Diagnostic de version
> **Date** : 2026-05-20
> **Testeur** : _____________

## Prérequis

```bash
# Démarrer l'environnement de dev
docker compose up
# Attendre que l'API soit prête (port 3000) et le frontend (port 5173)
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
    "lastMigration": "0002_rename_columns_french"
  }
}
```

- [ ] OK — status "ok"
- [ ] OK — version.gitSha présent (en dev local : "dev")
- [ ] OK — version.buildDate présent (en dev local : "unknown")
- [ ] OK — db.lastMigration correspond à la dernière migration Drizzle

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
- Section "Base de données" avec la dernière migration

- [ ] OK — Page /version accessible
- [ ] OK — Section Frontend affichée
- [ ] OK — Section API affichée avec données du healthcheck
- [ ] OK — Section Base de données affichée avec dernière migration

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

**Page /version en production** : ouvrir https://app.juju-aviatrice.uk/version

- [ ] OK — Git SHA front correspond au commit mergé
- [ ] OK — Git SHA API correspond au même commit

---

## Résultat

- [ ] Tous les scénarios OK
- **Testeur** : _____________
- **Date** : _____________
