# ADR-008 : Observabilité

## Contexte

Projet personnel mono-utilisatrice sur un VPS unique. Les stacks d'observabilité (Grafana/Loki, Prometheus, ELK, Datadog) consomment de la RAM et ajoutent de la complexité opérationnelle sans valeur pour ce contexte. L'alternative minimale (`docker logs`) suffit pour diagnostiquer les incidents sur une app à 1 utilisatrice.

## Décision

**Logs structurés JSON vers stdout**, capturés par Docker.

| Aspect | Détail |
|---|---|
| **Format** | JSON structuré : `{ timestamp, level, message, request_id, device_id }` |
| **Sortie** | `stdout` — Docker capture via le driver de logs par défaut |
| **Consultation** | `docker logs api` (avec `--since`, `--tail`, `grep` pour filtrer) |
| **Niveaux** | `ERROR` (erreur inattendue, investigation nécessaire), `WARN` (situation dégradée mais fonctionnelle), `INFO` (requêtes, démarrage, arrêt), `DEBUG` (détails internes, désactivé en prod) |
| **Champs obligatoires** | `timestamp` (ISO 8601), `level`, `message`, `request_id` (UUID par requête), `device_id` (si authentifié) |
| **Rétention** | Rotation Docker par défaut (`max-size: 10m`, `max-file: 3` dans `docker-compose.yml`) |
| **Pas de métriques** | Pas de Prometheus, pas de compteurs custom. La charge est négligeable (1 utilisatrice) |
| **Pas de tracing** | Pas d'OpenTelemetry, pas de Jaeger. Le monolithe n'a pas de latence inter-services à tracer |
| **Pas d'alerting** | Pas de notification automatique. Papa consulte les logs manuellement si problème |

**ADR-009 (Service d'emails)** : non applicable — le projet n'envoie aucun email transactionnel (pas de compte, pas de reset password, pas de notifications).

## Exigences concernées

- [ENF-AUT-001 : Disponibilité ≥ 99%](../../0-requirements/non-fonctionnelles/req-autres.md) — les logs permettent de diagnostiquer les pannes

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-001 Cadrage infrastructure (Docker, VPS) | [adr-001](adr-001-cadrage-infrastructure.md) |
| ADR-002 Stack applicative (Hono, Node.js) | [adr-002](adr-002-stack-applicative.md) |
