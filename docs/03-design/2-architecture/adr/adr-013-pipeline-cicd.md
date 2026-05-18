# ADR-013 : Pipeline CI/CD

## Contexte

Le repo est sur GitHub. GitHub Actions est natif, gratuit pour les repos publics et généreux en minutes pour les privés (2000 min/mois). Les alternatives (GitLab CI, CircleCI) nécessitent un outillage supplémentaire sans bénéfice dans ce contexte.

## Décision

**GitHub Actions** avec deux workflows :

### Workflow CI (sur chaque PR)

| Étape | Outil | Bloquant |
|---|---|---|
| Lint + format | Biome check | Oui |
| Type-check | `tsc --noEmit` | Oui |
| Tests unitaires + intégration | Vitest | Oui |
| Couverture | Vitest coverage | Non (warning) |
| Scan dépendances | Dependabot (natif GitHub) | Non (PR auto) |

### Workflow CD (sur merge dans `main`)

| Étape | Action |
|---|---|
| Build frontend | `pnpm build` dans `apps/web/` |
| Deploy frontend | Cloudflare Pages (via wrangler ou GitHub integration) |
| Build API | Docker build multi-stage |
| Deploy API | SSH + `docker compose pull && docker compose up -d` sur le VPS Scaleway |

### Environnements

| Env | Déclencheur | URL |
|---|---|---|
| **Preview** | Push sur branche de PR | URL temporaire Cloudflare Pages (front) + branche preview sur le VPS (optionnel) |
| **Production** | Merge dans `main` | URL principale |

### Gestion des dépendances

**Dependabot** activé pour les mises à jour automatiques des dépendances npm (PR hebdomadaire).

## Exigences concernées

- [ENF-AUT-002 : Déploiement < 15 min](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-003 : Tests automatisés ≥ 60%](../../0-requirements/non-fonctionnelles/req-autres.md)
- [ENF-AUT-005 : Environnement de preview](../../0-requirements/non-fonctionnelles/req-autres.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-001 Cadrage infrastructure (VPS Scaleway, Cloudflare Pages) | [adr-001](adr-001-cadrage-infrastructure.md) |
| ADR-010 Stratégie de test (Vitest) | [adr-010](adr-010-strategie-test.md) |
| ADR-012 Stratégie Git (GitHub Flow, squash) | [adr-012](adr-012-strategie-git.md) |
| ADR-014 Conventions de code (Biome) | [adr-014](adr-014-conventions-code.md) |
