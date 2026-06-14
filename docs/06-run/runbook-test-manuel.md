# Runbook — Test manuel & vérification post-déploiement

Procédures **transverses** réutilisées par tous les protocoles de test manuels (`docs/04-plan/features/f{N}-test-protocol.md`). Centralisées ici pour éviter les redites : chaque protocole renvoie aux sections ci-dessous au lieu de les recopier, et ne décrit que ce qui lui est **spécifique** (scénarios, énoncés, endpoints propres à la feature).

Voir aussi [Accès à la base de données](acces-base-de-donnees.md) pour les opérations DB bas niveau (sauvegarde, restauration, Drizzle Studio, migrations).

## URLs et accès

| Cible | Local | Production |
|---|---|---|
| API | `http://localhost:3000` | `https://api.juju-aviatrice.uk` |
| Frontend | `http://localhost:5173` | `https://app.juju-aviatrice.uk` |

**VPS de production** : `ssh juju-vps`. La stack y tourne via `/opt/juju-aviatrice/docker-compose.prod.yml`. L'image prod **n'embarque ni `tsx` ni `scripts/`** : les scripts de dev (`pnpm seed`, `pnpm reset:onboarding`) n'y existent pas — toute opération prod passe par du SQL direct (voir [§6](#6-vérification-post-déploiement-production)).

**Jetons par défaut** : `juju-aviatrice-2026` en local (max 3 utilisations), `juju-prod-2026` en production.

## 1. Démarrer l'environnement de test local

```bash
# Repartir d'un état propre puis démarrer (proche de la prod, via Docker)
pnpm dev:clean
# Attendre les logs de démarrage (API sur :3000, frontend sur :5173)
```

Les migrations Drizzle sont appliquées **automatiquement** au démarrage. Après un `dev:clean`, les volumes sont purgés : la base est vide, il faut recréer un jeton ([§2](#2-créer-un-jeton-dinvitation-local)).

## 2. Créer un jeton d'invitation (local)

```bash
pnpm seed
# Crée le jeton par défaut "juju-aviatrice-2026" (max 3 utilisations)
```

## 3. Remettre l'état à zéro (local)

Pour rejouer un parcours from scratch entre deux scénarios :

1. Supprimer la clé `device-id` du localStorage (DevTools → Application → Local Storage). Un nouveau `device-id` sera généré au prochain chargement.
2. Réinitialiser l'état applicatif côté serveur si besoin :

   ```bash
   pnpm reset:onboarding   # remet l'onboarding à zéro pour tous les devices
   ```

3. Recharger avec le jeton : `http://localhost:5173/?invite=juju-aviatrice-2026`

Pour repartir **totalement** propre (DB vidée), relancer [§1](#1-démarrer-lenvironnement-de-test-local) (`pnpm dev:clean`) puis [§2](#2-créer-un-jeton-dinvitation-local) (`pnpm seed`).

## 4. Récupérer le `device-id`

Nécessaire pour les vérifications API qui exigent le header `X-Device-Id` : DevTools → Application → Local Storage → clé `device-id`. Le copier, puis l'exporter une fois pour toute la session de test :

```bash
export DEVICE_ID="<device-id copié>"
```

## 5. Conventions d'appel API tRPC (curl)

L'API tRPC encode les payloads avec **superjson** : les arguments sont toujours enveloppés dans `{"json": { ... }}`, et la réponse l'est aussi (`result.data.json`).

- **Query (GET)** : argument passé via `?input=` **url-encodé**.
- **Mutation (POST)** : argument passé dans le corps `-d`, avec `-H "Content-Type: application/json"`.
- **Endpoints liés à un device** : ajouter `-H "X-Device-Id: $DEVICE_ID"` (cf. [§4](#4-récupérer-le-device-id)).
- Une **mutation rejoue un effet de bord à chaque appel** (ex. `demarrerMiniSession` crée une nouvelle session). Capturer la réponse dans une variable et en dériver les identifiants plutôt que de rappeler la mutation entre deux étapes.

```bash
# Query (GET) — input url-encodé
curl -s -G http://localhost:3000/trpc/<routeur>.<procedure> \
  --data-urlencode 'input={"json":{"<clef>":"<valeur>"}}' \
  -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json'

# Mutation (POST) — corps JSON
curl -s -X POST http://localhost:3000/trpc/<routeur>.<procedure> \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: $DEVICE_ID" \
  -d '{"json":{"<clef>":"<valeur>"}}' | jq '.result.data.json'
```

## 6. Vérification post-déploiement (production)

À effectuer après chaque déploiement (CD verte). Les vérifications fonctionnelles propres à la feature restent dans son protocole ; les procédures ci-dessous sont communes.

### 6.1 Healthcheck de l'API

```bash
curl -s https://api.juju-aviatrice.uk/health | jq .
# Attendu : status "ok"
```

Vérifier que le schéma déployé est à jour via `db.migrations` :

- `currentInDB` (dernière migration appliquée en base) == `latestInBuild` (dernière migration livrée dans le build) ;
- `appliedInDB` == `availableInBuild`.

Si `appliedInDB < availableInBuild` (ou les noms diffèrent), la base est **en retard** sur le code déployé : les migrations ne sont pas passées au démarrage du conteneur. Les noms sont lisibles (ex. `0004_curly_crusher_hogan`), pas le hash SHA256 brut de `__drizzle_migrations`.

### 6.2 Accès au VPS et à la base prod

```bash
ssh juju-vps
# Toutes les commandes DB prod passent par le conteneur api :
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api sqlite3 ./data/juju-aviatrice.sqlite '<requête SQL>'
exit
```

### 6.3 Gérer un jeton d'invitation en prod

Lister les jetons existants :

```bash
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api sqlite3 ./data/juju-aviatrice.sqlite \
  'SELECT token, utilisations, max_utilisations FROM invite_tokens;'
```

Le format de sortie est `token|utilisations|max_utilisations` :

| Situation | Exemple affiché | Action |
|---|---|---|
| Jeton avec places restantes | `juju-prod-2026\|1\|5` (1 sur 5 utilisé) | Noter le nom du jeton, l'utiliser dans l'URL `?invite=` |
| Jeton épuisé | `juju-prod-2026\|5\|5` (5 sur 5 utilisé) | Remettre le compteur à zéro (ci-dessous) |
| Aucun jeton | Résultat vide | Créer un jeton (ci-dessous) |

Remettre un jeton épuisé à zéro (remplacer `<JETON>` par le nom affiché) :

```bash
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api sqlite3 ./data/juju-aviatrice.sqlite \
  'UPDATE invite_tokens SET utilisations = 0 WHERE token = "<JETON>";'
```

Créer un jeton (l'image prod n'a ni `tsx` ni `scripts/`, donc pas de `pnpm seed` — SQL direct uniquement) :

```bash
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api sqlite3 ./data/juju-aviatrice.sqlite \
  "INSERT INTO invite_tokens (token, max_utilisations, utilisations, date_creation)
   VALUES ('juju-prod-2026', 3, 0, strftime('%s','now'));"
# Crée "juju-prod-2026" avec max 3 utilisations
```

### 6.4 Repartir d'un device / onboarding vierge en prod

L'état applicatif (onboarding, sessions) est lié au `device-id`. Si le navigateur a déjà un `device-id` connu en prod, l'app saute l'onboarding. Pour repartir vierge :

- **Option A (client, recommandé)** : supprimer `device-id` du localStorage (DevTools → Application → Local Storage → `https://app.juju-aviatrice.uk`). Un nouveau `device-id` est généré → parcours rejoué from scratch.
- **Option B (client)** : ouvrir une fenêtre de navigation privée.
- **Option C (serveur)** : purger l'état en base — utile pour re-tester avec le **même** `device-id`. Équivalent prod des scripts de dev (absents de l'image prod) via `DELETE` SQL :

  ```bash
  ssh juju-vps
  # Purger tout l'onboarding (équivalent de reset:onboarding)
  docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
    exec api sqlite3 ./data/juju-aviatrice.sqlite 'DELETE FROM onboarding;'
  # OU cibler un seul device
  docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
    exec api sqlite3 ./data/juju-aviatrice.sqlite \
    'DELETE FROM onboarding WHERE device_id = "<DEVICE_ID>";'
  exit
  ```

## Maintenance de ce runbook

Ce runbook est **vivant** : il évolue avec le produit. Lors de la rédaction du protocole de test d'une feature (skills PBM `pbm-impl`, `pbm-impl-code-review`, `pbm-plan-feature-review`), appliquer la règle R20 du [template de protocole](../04-plan/features/_test-protocol-template.md) :

- Toute procédure **récurrente** (démarrage, seed, reset, accès prod, gestion jeton, convention API) introduite ou modifiée par la feature est ajoutée/mise à jour **ici**, pas recopiée dans le protocole.
- Le protocole **renvoie** aux sections de ce runbook et ne décrit que le spécifique feature.
- Si une procédure existante devient obsolète (changement de stack, de script, d'URL), la corriger ici en priorité — les protocoles en héritent par renvoi.
