# ADR-001 : Cadrage infrastructure

## Contexte

juju-aviatrice est un projet personnel mono-utilisatrice (Juju) construit par un développeur (Papa). L'infrastructure doit être simple, peu coûteuse et facile à maintenir. Les alternatives complexes (cloud managé multi-AZ, Kubernetes, IaC Terraform) sont écartées — surdimensionnées pour une app personnelle sans exigence de scaling.

## Décision

### Hébergement

**VPS léger** — Scaleway DEV1-S (2 vCPU, 2 Go RAM, 20 Go SSD, ~4€/mois), datacenter **Paris** (latence minimale pour Juju en France, données en UE).

Le frontend statique (SPA) est servi depuis **Cloudflare Pages** (gratuit, CDN mondial, déjà utilisé pour le wiki). Le VPS héberge uniquement l'API backend et la base de données.

### Compute

**Docker Compose** sur le VPS. Tous les services (API, BDD) décrits dans un `docker-compose.yml`. Images multi-stage pour limiter la taille.

### Résilience

**Single instance + restart auto** (`restart: always` sur les containers). Pas de haute disponibilité — en cas de panne VPS, indisponibilité de quelques minutes à heures (acceptable pour ≥99% sur un projet personnel). Pas de backup automatique en M0 ; à réévaluer en M1 si les données de progression deviennent critiques.

### Infrastructure as Code

**Docker Compose seul**. Le provisionnement initial du VPS (install Docker, firewall, DNS) est documenté dans un README ou un script shell. Pas d'Ansible ni de Terraform.

## Exigences concernées

- [ENF-AUT-001 : Disponibilité ≥ 99%](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-002 : Déploiement simple < 15 min](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-005 : Environnement de preview](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-SEC-004 : RGPD — données en UE](../../0-requirements/non-fonctionnelles/req-securite.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| vision produit | [vision-produit.md](../../../01-strategy/vision-produit.md) |
| persona Papa (pragmatique, CI/CD léger) | [persona-papa-porteur.md](../../../02-discovery/personas/persona-papa-porteur.md) |
| initiative I-T.1 | [initiatives.md](../../../01-strategy/initiatives.md) |
