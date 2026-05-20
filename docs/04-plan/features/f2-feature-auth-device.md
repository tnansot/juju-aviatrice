# Feature : Accès sécurisé par device

## Description

Juju accède à l'application via une URL partagée par Papa. Son smartphone est identifié par un device ID unique, généré silencieusement sans compte ni mot de passe. Un jeton d'invitation protège la création de nouveaux devices. Les devices non reconnus sont redirigés vers un écran sobre.

## Critère de complétion

1. Ouvrir l'URL avec `?invite=<token>` sur un nouveau device → device ID créé, accès autorisé
2. Ouvrir l'URL sans jeton sur le même device → reconnu automatiquement, accès autorisé
3. Ouvrir l'URL sans jeton sur un device inconnu → écran « Accès refusé » sobre
4. Toutes les requêtes tRPC suivantes portent le header `X-Device-Id`

## Priorité

- [x] Must have

## Exigences couvertes

- [ENF-SEC-001] : Identification par device ID
- [ENF-SEC-002] : Accès initial par URL
- [ENF-SEC-003] : Protection des données d'usage
- [ENF-SEC-004] : RGPD — pas de trackers tiers
- [REQ-ACCUEIL-001] : Bienvenue personnalisée sans inscription

## Dépendances

- [Feature Infrastructure & Stack](f1-feature-infra-stack.md) : nécessite l'API tRPC, SQLite et le frontend fonctionnels

## Écrans et API concernés

### Écrans

- **Accès Refusé (FO-14)**
  - Spec : [spec-ecran-acces-refuse.md](../../03-design/3-wireframes/spec-ecran-acces-refuse.md)
  - Wireframe HTML : [fo-14-acces-refuse.html](../../03-design/3-wireframes/html-wireframes/fo-14-acces-refuse.html)

### API

- **identite.enregistrerDevice** : [identite.md](../../03-design/4-api/identite.md) — Création device + validation jeton
- **identite.verifierDevice** : [identite.md](../../03-design/4-api/identite.md) — Vérification device existant

---

## Stories

### S1 : Génération et stockage du device ID côté client

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** que mon smartphone soit reconnu automatiquement à chaque ouverture,
**afin de** ne jamais avoir à m'identifier manuellement.

**Critères d'acceptation :**

```gherkin
GIVEN un navigateur sans device ID en localStorage
WHEN Juju ouvre l'URL de l'app
THEN un UUID v4 est généré via crypto.randomUUID() et stocké en localStorage (clé "device-id")
```

```gherkin
GIVEN un device ID déjà en localStorage
WHEN Juju ouvre l'app
THEN le device ID existant est lu et envoyé au backend via le header X-Device-Id
```

**Implémentation :**

- [x] Créer le hook useDeviceId() (lecture/écriture localStorage)
- [x] Injecter le header X-Device-Id dans le client tRPC
- [x] Créer le composant DeviceGuard (vérifie l'identification au chargement)
- [ ] Tests : génération UUID, lecture/écriture localStorage
- **Statut** : Terminée

---

### S2 : Jeton d'invitation et enregistrement backend

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Protéger la création de devices par un jeton d'invitation à usage limité.
**Justification** : ADR-005 requiert un jeton d'invitation pour empêcher la création de devices non autorisés.

**Critères d'acceptation :**

```gherkin
GIVEN un device ID inconnu et un jeton d'invitation valide
WHEN le frontend appelle identite.enregistrerDevice(device_id, invite_token)
THEN le device est créé en base et le compteur d'utilisation du jeton est incrémenté
```

```gherkin
GIVEN un jeton d'invitation épuisé (max utilisations atteint)
WHEN le frontend appelle identite.enregistrerDevice
THEN le backend retourne UNAUTHORIZED et le device n'est pas créé
```

**Implémentation :**

- [x] Créer le schéma Drizzle : table invite_tokens (id, token, max_usages, usages_courant)
- [x] Créer le schéma Drizzle : table devices (id, date_creation, derniere_activite)
- [x] Implémenter la procédure identite.enregistrerDevice
- [x] Implémenter la procédure identite.verifierDevice
- [x] Créer un script seed pour insérer un jeton initial
- [x] Tests d'intégration : création device, jeton valide/invalide/épuisé
- **Statut** : Terminée

---

### S3 : Middleware auth tRPC

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Vérifier le device ID sur chaque requête tRPC protégée.
**Justification** : ADR-006 impose que device ID valide = accès complet, device absent/invalide = UNAUTHORIZED.

**Critères d'acceptation :**

```gherkin
GIVEN une requête tRPC avec un header X-Device-Id valide (device existant en base)
WHEN le middleware s'exécute
THEN la requête passe et le device_id est disponible dans le contexte tRPC
```

```gherkin
GIVEN une requête sans header X-Device-Id ou avec un device inconnu
WHEN le middleware s'exécute
THEN la requête est rejetée avec TRPCError UNAUTHORIZED
```

**Implémentation :**

- [x] Créer le middleware tRPC authDevice
- [x] Appliquer le middleware sur toutes les procédures sauf enregistrerDevice et verifierDevice
- [ ] Ajouter le rate limiting (60 req/min auth, 5 req/15min register, 10 req/min non-auth)
- [x] Tests : device valide, device invalide, header absent
- **Statut** : Terminée

---

### S4 : Écran accès refusé (FO-14)

**Type** : US — **Estimation** : XS (1 pt)

**En tant que** visiteur non autorisé,
**je veux** voir un écran sobre m'indiquant que l'accès n'est pas autorisé,
**afin de** ne pas voir d'erreur technique incompréhensible.

**Critères d'acceptation :**

```gherkin
GIVEN un device non reconnu et aucun jeton d'invitation valide
WHEN le frontend reçoit UNAUTHORIZED du backend
THEN l'écran FO-14 s'affiche avec un message sobre et aucune erreur technique
```

```gherkin
GIVEN l'écran FO-14 affiché
WHEN le visiteur consulte la page
THEN aucune donnée de contenu ni de progression n'est exposée
```

**Implémentation :**

- [x] Créer le composant AccessRefused (FO-14)
- [x] Intégrer dans le DeviceGuard : rediriger vers FO-14 si UNAUTHORIZED
- [x] Retirer le paramètre `?invite` de l'URL après traitement (history.replaceState)
- [ ] Tests : affichage correct, pas de données exposées
- **Statut** : Terminée

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Génération et stockage du device ID | US | S (2 pts) | Terminée |
| S2 | Jeton d'invitation et enregistrement backend | TS | M (3 pts) | Terminée |
| S3 | Middleware auth tRPC | TS | S (2 pts) | Terminée |
| S4 | Écran accès refusé (FO-14) | US | XS (1 pt) | Terminée |

**Total** : 4 stories — 8 points

---

**Statut** : En cours

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| ADR-005 Authentification | [adr-005](../../03-design/2-architecture/adr/adr-005-authentification.md) |
| ADR-006 Autorisation | [adr-006](../../03-design/2-architecture/adr/adr-006-autorisation.md) |
| bc-identite | [bc-identite](../../03-design/1-domain/bc-identite.md) |
| modèle DeviceID | [model-device-id](../../03-design/1-domain/models/model-device-id.md) |
| sécurité | [security.md](../../03-design/2-architecture/security.md) |
| wireframe FO-14 | [spec-ecran-acces-refuse](../../03-design/3-wireframes/spec-ecran-acces-refuse.md) |
