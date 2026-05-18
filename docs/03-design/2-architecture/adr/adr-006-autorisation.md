# ADR-006 : Modèle d'autorisation

## Contexte

Le projet est mono-utilisatrice (Juju), sans notion de rôles ni de tenants. Un modèle RBAC, ABAC ou ReBAC ajouterait de la complexité sans bénéfice. L'alternative « RBAC minimal user/admin » est écartée — Papa n'a pas besoin d'une interface d'admin en M0 (il gère le contenu directement en code/fichiers).

## Décision

**Device ID valide = accès complet.** Un middleware tRPC vérifie sur chaque requête :

1. Présence du header `X-Device-Id`
2. Existence du device ID en base SQLite
3. Si valide → accès autorisé à toutes les procédures tRPC
4. Si absent ou invalide → erreur `UNAUTHORIZED`

Pas de matrice de permissions, pas de rôles, pas de guards par ressource. La seule protection est la validation du device ID.

## Exigences concernées

- [ENF-SEC-001 : Identification par device ID](../../0-requirements/non-fonctionnelles/req-securite.md)
- [ENF-SEC-003 : Protection des données d'usage](../../0-requirements/non-fonctionnelles/req-securite.md)
- [ENF-SEC-005 : Pas de surveillance comportementale](../../0-requirements/non-fonctionnelles/req-securite.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-005 Authentification | [adr-005](adr-005-authentification.md) |
| personas (1 utilisatrice, 1 builder) | [persona-juju](../../../02-discovery/personas/persona-juju-utilisatrice.md), [persona-papa](../../../02-discovery/personas/persona-papa-porteur.md) |
