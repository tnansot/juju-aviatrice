# ADR-005 : Authentification

## Contexte

juju-aviatrice n'utilise pas de système de comptes (ENF-SEC-001). L'identification se fait par device ID, sans login, mot de passe ni email. Les alternatives (OAuth2, OIDC, Keycloak, Auth0, magic links) sont toutes surdimensionnées — elles supposent des comptes utilisateurs. Le fingerprinting navigateur ajoute de la complexité et des soucis de vie privée sans valeur ajoutée pour 1 utilisatrice.

## Décision

**UUID v4 en localStorage** + **jeton d'invitation** pour la création de device, header HTTP sur chaque requête tRPC.

| Aspect | Détail |
|---|---|
| **Génération** | UUID v4 côté client (`crypto.randomUUID()`) à la première visite |
| **Stockage client** | `localStorage` du navigateur (clé : `device-id`) |
| **Transport** | Header HTTP custom (`X-Device-Id`) injecté automatiquement par le client tRPC |
| **Création de device** | Protégée par un **jeton d'invitation** dans l'URL (`?invite=<token>`). Le backend valide le jeton (existe en base, usage < max) avant de créer le device. Un UUID inconnu sans jeton valide est rejeté (`UNAUTHORIZED`). Le jeton est configuré avec un nombre max d'utilisations (ex : 3 — smartphone Juju, smartphone Papa, spare) |
| **Visites ultérieures** | Le device ID existe déjà en base → pas besoin de jeton. Le header `X-Device-Id` suffit |
| **Pas de token/session** | Pas de JWT, pas de refresh token, pas de cookie de session. Le device ID est le seul identifiant |
| **Pas de MFA** | Non applicable (pas de compte) |
| **Pas de SSO** | Non applicable |
| **Limitation connue** | Si Juju vide son localStorage ou change de navigateur, un nouveau device ID est créé (consomme une utilisation du jeton) — ses données de progression ne seront pas récupérables sans intervention manuelle (migration en base). Acceptable pour M0 |

## Exigences concernées

- [ENF-SEC-001 : Identification par device ID](../../0-requirements/non-fonctionnelles/req-securite.md)
- [ENF-SEC-002 : Accès initial par URL](../../0-requirements/non-fonctionnelles/req-securite.md)
- [ENF-SEC-004 : RGPD — pas de cookies tiers](../../0-requirements/non-fonctionnelles/req-securite.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| bc-identite | [bc-identite](../../1-domain/bc-identite.md) |
| modèle DeviceID | [model-device-id](../../1-domain/models/model-device-id.md) |
| ADR-002 Stack (tRPC) | [adr-002](adr-002-stack-applicative.md) |
