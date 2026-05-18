# Router tRPC : onboarding

> Parcours de bienvenue et premiers contacts spéciaux.
> Bounded context : [bc-onboarding](../1-domain/bc-onboarding.md) — Supporting

## Vue d'ensemble

| Procédure | Type | Écrans consommateurs |
|---|---|---|
| `onboarding.obtenirEtat` | query | Routing initial (J1) |
| `onboarding.avancerEtape` | mutation | FO-01, FO-02, FO-03 |
| `onboarding.sauter` | mutation | FO-01, FO-02 (bouton Passer) |
| `onboarding.marquerPremierAccesPsy` | mutation | FO-09 → FO-10 (1er accès psy) |

Toutes les procédures sont protégées par le middleware auth (`ctx.deviceId`).

---

## onboarding.obtenirEtat

**Type** : query

**Cas d'usage** : Le frontend vérifie l'état de l'onboarding au lancement pour décider de la navigation initiale.

**Input** : aucun (device ID depuis `ctx.deviceId`)

**Output** :

```typescript
z.object({
  etat: zEtatOnboarding,
  etapeCourante: z.number().int().min(1).nullable(),
  premierAccesPsyFait: z.boolean(),
})
```

**Écrans** : si `etat = non_demarre` → [FO-01](../3-wireframes/spec-ecran-onboarding-bienvenue.md) ; si `etat = en_cours` → reprendre à `etapeCourante` ; si `complete/saute` → [FO-04](../3-wireframes/spec-ecran-accueil.md).

---

## onboarding.avancerEtape

**Type** : mutation

**Cas d'usage** : Juju progresse dans l'onboarding (Bienvenue → Piliers → Flashcard → Terminé).

**Input** :

```typescript
z.object({
  etapeCompletee: z.number().int().min(1).max(3),
  // 1 = Bienvenue, 2 = Piliers, 3 = Flashcard
})
```

**Output** :

```typescript
z.object({
  etat: zEtatOnboarding,
  etapeSuivante: z.number().int().nullable(),
  // null si onboarding terminé
})
```

**Règles métier** :

- Étape 1 (Bienvenue) → passe `etat` à `en_cours`, `etapeCourante = 2`
- Étape 2 (Piliers) → `etapeCourante = 3`
- Étape 3 (Flashcard) → `etat = complete`, `etapeCourante = null`
- Si `etat` est déjà `complete` ou `saute`, la mutation est un no-op (idempotente)

**Événement émis** : `onboarding_complete` (quand étape 3 complétée) → consommé par bc-progression (première micro-progression avatar stade 1)

**Écrans** : [FO-01](../3-wireframes/spec-ecran-onboarding-bienvenue.md) → [FO-02](../3-wireframes/spec-ecran-onboarding-piliers.md) → [FO-03](../3-wireframes/spec-ecran-onboarding-flashcard.md) → [FO-04](../3-wireframes/spec-ecran-accueil.md)

---

## onboarding.sauter

**Type** : mutation

**Cas d'usage** : Juju appuie sur « Passer » pendant l'onboarding.

**Input** : aucun

**Output** :

```typescript
z.object({
  etat: z.literal("saute"),
})
```

**Règles métier** :

- Passe `etat` à `saute`, `etapeCourante = null`
- Si `etat` est déjà `complete` ou `saute`, no-op
- Pas de message culpabilisant au retour (le frontend navigue directement vers FO-04)

**Événement émis** : `onboarding_complete` (le saut vaut complétion du point de vue de bc-progression)

**Écrans** : bouton « Passer » visible sur [FO-01](../3-wireframes/spec-ecran-onboarding-bienvenue.md) et [FO-02](../3-wireframes/spec-ecran-onboarding-piliers.md)

---

## onboarding.marquerPremierAccesPsy

**Type** : mutation

**Cas d'usage** : Juju choisit le pilier Psychotechniques pour la première fois (depuis FO-09 Choix Activité).

**Input** : aucun

**Output** :

```typescript
z.object({
  premierAccesPsyFait: z.literal(true),
  messageAccueil: z.string(),
  // Message d'accueil psy unique, aligné charte de ton
})
```

**Règles métier** :

- Si `premierAccesPsyFait` est déjà `true`, retourne directement sans message d'accueil (le frontend navigue normalement)
- Sinon, passe `premierAccesPsyFait = true` et retourne le message d'accueil + recommandation logique
- Le message n'apparaît qu'une seule fois (J3 étape 1)

**Événement émis** : `premier_acces_psy` → consommé par bc-entrainement (afficher message d'accueil psy, recommander logique en premier)

**Écrans** : [FO-09](../3-wireframes/spec-ecran-choix-activite.md) → [FO-10 Psy Bienvenue](../3-wireframes/spec-ecran-psy-bienvenue.md)

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| bounded context | [bc-onboarding](../1-domain/bc-onboarding.md) |
| modèle EtatOnboarding | [model-etat-onboarding](../1-domain/models/model-etat-onboarding.md) |
| journey J1 | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| journey J3 (premier accès psy) | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| schemas partagés | [schemas-partages](schemas-partages.md) |
