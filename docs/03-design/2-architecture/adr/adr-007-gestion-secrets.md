# ADR-007 : Gestion des secrets

## Contexte

Les secrets du projet sont minimaux : URL de la base de données (chemin fichier SQLite), éventuellement une clé CORS ou un secret de signing. Pas de clés API tierces, pas de credentials cloud. Les solutions avancées (Vault, Doppler, Infisical, AWS Secrets Manager, sops/age) ajoutent de la complexité sans valeur ajoutée pour un VPS unique avec un seul développeur.

## Décision

**Variables d'environnement + fichier `.env`** sur le VPS, non commité dans le repo.

| Aspect | Détail |
|---|---|
| **Format** | Fichier `.env` à la racine du projet sur le VPS |
| **Versionnement** | `.env` dans `.gitignore`. Un `.env.example` commité documente les variables attendues (sans valeurs sensibles) |
| **Accès** | Docker Compose lit le `.env` via `env_file` |
| **Rotation** | Manuelle — modifier le `.env` et redémarrer les containers. Pas de rotation automatique |
| **Environnements** | `.env` pour la prod. `.env.local` pour le dev local (non commité) |
| **Secrets en M0** | `DATABASE_URL` (chemin SQLite), `NODE_ENV`, `CORS_ORIGIN` (URL frontend Cloudflare) |

## Exigences concernées

- [ENF-AUT-002 : Déploiement simple](../../0-requirements/non-fonctionnelles/req-autres.md) — pas d'étape de déchiffrement ni de service externe à contacter

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-001 Cadrage infrastructure (VPS, Docker Compose) | [adr-001](adr-001-cadrage-infrastructure.md) |
