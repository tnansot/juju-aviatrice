# Router tRPC : identite

> Identification sans friction — device ID, pas de compte.
> Bounded context : [bc-identite](../1-domain/bc-identite.md) — Generic

## Vue d'ensemble

| Procédure | Type | Auth | Écrans consommateurs |
|---|---|---|---|
| `identite.enregistrerDevice` | mutation | publique (jeton invitation) | Premier accès via URL |
| `identite.verifierDevice` | query | publique | Toute ouverture de l'app |

Ce router est le point d'entrée de l'app. Il ne dépend d'aucun autre router. Tous les autres routers dépendent de lui via le middleware d'authentification (`ctx.deviceId`).

---

## identite.enregistrerDevice

**Type** : mutation (publique — pas de middleware auth)

**Cas d'usage** : Juju ouvre l'URL pour la première fois. Le frontend génère un UUID v4, l'envoie avec le jeton d'invitation de l'URL.

**Input** :

```typescript
z.object({
  deviceId: zDeviceId,          // UUID v4 généré côté client
  jetonInvitation: z.string(),  // Token extrait du query param ?invite=<token>
})
```

**Output** :

```typescript
z.object({
  enregistre: z.literal(true),
  premierAcces: z.boolean(),  // true = device tout neuf
})
```

**Erreurs** :

| Code | Condition |
|---|---|
| `INVITE_INVALIDE` | Jeton inexistant, expiré, ou quota d'utilisations atteint |

**Règles métier** :

- Vérifie que le jeton existe en base et que `utilisations < max_utilisations`
- Crée le device en base avec `date_creation = now()`, `derniere_activite = now()`
- Incrémente le compteur d'utilisations du jeton
- Si le device existe déjà (re-enregistrement), retourne `premierAcces: false` sans erreur

**Événement émis** : `device_identifie` (nouveau) → consommé par bc-onboarding (vérifie si onboarding fait)

**Écran** : aucun écran visible — le frontend appelle cette procédure automatiquement avant toute navigation.

---

## identite.verifierDevice

**Type** : query (publique — vérifie avant d'injecter dans ctx)

**Cas d'usage** : À chaque ouverture de l'app, le frontend vérifie si le device ID stocké en localStorage est encore valide. Détermine si l'utilisatrice arrive sur l'onboarding ou l'accueil.

**Input** :

```typescript
z.object({
  deviceId: zDeviceId,
})
```

**Output** :

```typescript
z.object({
  valide: z.boolean(),
  etatOnboarding: zEtatOnboarding.optional(),  // présent si valide
})
```

**Erreurs** : aucune — un device inconnu retourne `{ valide: false }` plutôt qu'une erreur (UX sans friction).

**Règles métier** :

- Cherche le device en base
- Si trouvé : met à jour `derniere_activite`, retourne l'état d'onboarding
- Si non trouvé : retourne `{ valide: false }` → le frontend affiche l'écran FO-14 (Accès Refusé)

**Événement émis** : `device_identifie` (connu) → consommé par bc-onboarding / bc-suggestion selon l'état

**Écrans** : routing conditionnel vers [FO-01 Onboarding Bienvenue](../3-wireframes/spec-ecran-onboarding-bienvenue.md) (si `etatOnboarding = non_demarre`), [FO-04 Accueil](../3-wireframes/spec-ecran-accueil.md) (si `etatOnboarding = complete/saute`), ou [FO-14 Accès Refusé](../3-wireframes/spec-ecran-acces-refuse.md) (si `valide = false`).

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| bounded context | [bc-identite](../1-domain/bc-identite.md) |
| modèle DeviceID | [model-device-id](../1-domain/models/model-device-id.md) |
| ADR-005 authentification | [adr-005](../2-architecture/adr/adr-005-authentification.md) |
| schemas partagés | [schemas-partages](schemas-partages.md) |
| écran FO-14 | [spec-ecran-acces-refuse](../3-wireframes/spec-ecran-acces-refuse.md) |
