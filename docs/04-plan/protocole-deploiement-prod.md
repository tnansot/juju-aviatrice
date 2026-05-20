# Protocole de déploiement production — juju-aviatrice

> Procédure de mise en service initiale de l'app d'entraînement (API + Frontend SPA).
> À suivre une seule fois. Après ça, le CD est automatique.
>
> **Domaine** : `juju-aviatrice.uk` (Cloudflare Registrar)
> **VPS** : `<IP_VPS>` (Scaleway DEV1-S, Paris)

## Étape 1 — Provisionner le VPS Scaleway

- [x] Créer instance **DEV1-S** (2 vCPU, 2 Go RAM, 20 Go SSD) — région **Paris (fr-par-1)** — OS **Ubuntu 24.04.3 LTS (Noble Numbat) 64 bits** — ajouter clé SSH publique (Ed25519 dédiée : `~/.ssh/id_ed25519_scaleway`)
- [x] Exécuter le provisionnement depuis le Mac local :

```bash
ssh root@<IP_VPS> 'bash -s' < scripts/setup-vps.sh
```

- [x] Vérifier l'installation :

```bash
ssh juju-vps "docker --version && caddy version && ufw status"
```

Résultat attendu : versions Docker + Caddy + firewall actif (22, 80, 443 ouverts).

> **Note** : le script clone le repo dans `/opt/juju-aviatrice` et copie le `Caddyfile` vers `/etc/caddy/Caddyfile`. Si le `Caddyfile` n'est pas encore poussé sur `main`, le copier manuellement : `scp Caddyfile juju-vps:/etc/caddy/Caddyfile`

## Étape 2 — Configurer le DNS

Dans **Cloudflare Dashboard → juju-aviatrice.uk → DNS → Records** :

| Enregistrement | Type | Valeur | Proxy | TTL |
|---|---|---|---|---|
| `api` | A | `<IP_VPS>` | DNS only (nuage gris) | Auto |

> Le sous-domaine `app` est géré automatiquement par Cloudflare Pages lors de l'ajout du custom domain (étape 5). Ne pas créer de CNAME manuellement — CF Pages le gère.

- [x] Créer l'enregistrement A pour `api`
- [x] Vérifier la propagation :

```bash
dig api.juju-aviatrice.uk +short   # → <IP_VPS>
```

## Étape 3 — Configurer Caddy sur le VPS

- [x] Synchroniser le repo et copier le Caddyfile :

```bash
ssh juju-vps "cd /opt/juju-aviatrice && git pull && cp Caddyfile /etc/caddy/Caddyfile"
```

- [x] Remplacer le domaine et redémarrer :

```bash
ssh juju-vps
sed -i 's/{$DOMAIN_API:api.localhost}/api.juju-aviatrice.uk/' /etc/caddy/Caddyfile
cat /etc/caddy/Caddyfile   # vérifier
systemctl restart caddy
systemctl status caddy
```

Caddy obtient automatiquement un certificat Let's Encrypt.

## Étape 4 — Premier déploiement API

- [x] Déployer sur le VPS :

```bash
ssh juju-vps "cd /opt/juju-aviatrice && git pull && docker compose -f docker-compose.prod.yml up -d --build"
```

- [x] Health check local (depuis le VPS) :

```bash
curl -s http://localhost:3000/health
# → {"status":"ok"}
```

- [x] Health check HTTPS (depuis le Mac) :

```bash
curl -s https://api.juju-aviatrice.uk/health
# → {"status":"ok"}
```

## Étape 5 — Cloudflare Pages v2 (frontend SPA)

- [x] **Workers & Pages → Create → Pages → Connect to Git** → repo `tnansot/juju-aviatrice`
- [x] Nom du projet : `app-juju-aviatrice`
- [x] Config build :

| Paramètre | Valeur |
|---|---|
| Build command | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @juju-aviatrice/web build` |
| Deploy command | `npx wrangler deploy --config apps/web/wrangler.toml` |
| Path | `/` |

> Le fichier `apps/web/wrangler.toml` configure le nom du projet, la compatibility date et le répertoire d'assets (`./dist`) avec le SPA routing (`not_found_handling = "single-page-application"`).

- [x] Variables d'environnement :

| Nom | Valeur | Scope |
|---|---|---|
| `NODE_VERSION` | `22` | Production + Preview |
| `VITE_API_URL` | `https://api.juju-aviatrice.uk` | Production |

- [x] Custom domain : ajouter `app.juju-aviatrice.uk` via **Settings → Custom Domains** (CF Pages crée l'enregistrement DNS automatiquement)
- [x] Vérifier sur `https://app.juju-aviatrice.uk/`

## Étape 6 — Secrets GitHub Actions

**Settings → Secrets and variables → Actions → New repository secret :**

- [x] `VPS_HOST` → `<IP_VPS>`
- [x] `VPS_USER` → `root`
- [x] `VPS_SSH_KEY` → contenu de `~/.ssh/id_ed25519_scaleway` (clé privée)

**Settings → Environments → New environment :**

- [x] Créer l'environment `production`

## Étape 7 — Configurer CORS

Le CORS est configuré dans `docker-compose.prod.yml` (versionné dans le repo) :

```yaml
environment:
  - CORS_ORIGIN=https://app.juju-aviatrice.uk
```

- [x] Vérifier que la variable est présente dans `docker-compose.prod.yml`
- [x] Redéployer si nécessaire :

```bash
ssh juju-vps "cd /opt/juju-aviatrice && git pull && docker compose -f docker-compose.prod.yml up -d"
```

## Étape 8 — Test pipeline CD complet

- [x] Pusher un commit sur `main` (ou merger une PR)
- [x] CI passe sur GitHub (Biome + tsc + Vitest)
- [x] CD se déclenche : GitHub → Actions → "CD" → job `deploy-api` passe
- [x] CF Pages rebuilde automatiquement le frontend
- [x] Vérifier :

```bash
curl -s https://api.juju-aviatrice.uk/health        # → {"status":"ok"}
curl -s https://api.juju-aviatrice.uk/trpc/hello     # → réponse tRPC
```

## Étape 9 — Test end-to-end sur smartphone

- [x] Ouvrir `https://app.juju-aviatrice.uk/` sur le smartphone de Juju
- [x] La page s'affiche en < 3 secondes
- [x] L'appel tRPC frontend → API fonctionne (la réponse de bienvenue s'affiche)

## Checklist finale

- [x] VPS accessible en SSH (`ssh juju-vps`)
- [x] DNS propagé (A pour `api`)
- [x] Caddy + TLS opérationnel
- [x] API `/health` en HTTPS
- [x] tRPC `/trpc/hello` en HTTPS
- [x] Frontend SPA déployé sur CF Pages v2
- [x] CI passe sur PR
- [x] CD déploie l'API au merge
- [x] CORS configuré
- [x] Test smartphone OK

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| Feature F1 — Story S7 | [f1-feature-infra-stack.md](features/f1-feature-infra-stack.md) |
| ADR-001 Cadrage infrastructure | [adr-001](../03-design/2-architecture/adr/adr-001-cadrage-infrastructure.md) |
| ADR-013 Pipeline CI/CD | [adr-013](../03-design/2-architecture/adr/adr-013-pipeline-cicd.md) |
| Infrastructure technique | [infrastructure.md](../03-design/2-architecture/deployment/infrastructure.md) |
| DEPLOIEMENT.md | [DEPLOIEMENT.md](../../DEPLOIEMENT.md) |
