#!/usr/bin/env bash
# Provisionnement VPS Scaleway pour juju-aviatrice
# À exécuter une seule fois sur un VPS Ubuntu 24.04 fraîchement créé.
# Usage : ssh root@<IP_VPS> 'bash -s' < scripts/setup-vps.sh

set -euo pipefail

echo "=== 1/6 — Mise à jour système ==="
apt-get update && apt-get upgrade -y

echo "=== 2/6 — Installation Docker ==="
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

echo "=== 3/6 — Installation Caddy ==="
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy

echo "=== 4/6 — Firewall (ufw) ==="
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo "=== 5/6 — Clone du repo ==="
mkdir -p /opt/juju-aviatrice
cd /opt/juju-aviatrice
git init
git remote add origin https://github.com/tnansot/juju-aviatrice.git
git fetch origin main
git checkout main

echo "=== 6/6 — Configuration Caddy ==="
cp /opt/juju-aviatrice/Caddyfile /etc/caddy/Caddyfile
echo ""
echo "  IMPORTANT : éditer /etc/caddy/Caddyfile pour remplacer"
echo "  la variable DOMAIN_API par le vrai domaine API."
echo "  Puis : systemctl restart caddy"
echo ""

echo "=== Provisionnement terminé ==="
echo ""
echo "Prochaines étapes manuelles :"
echo "  1. Configurer le DNS (A record vers l'IP du VPS)"
echo "  2. Éditer /etc/caddy/Caddyfile avec le domaine API"
echo "  3. systemctl restart caddy"
echo "  4. cd /opt/juju-aviatrice && docker compose -f docker-compose.prod.yml up -d"
echo "  5. Configurer les secrets GitHub Actions (VPS_HOST, VPS_USER, VPS_SSH_KEY)"
