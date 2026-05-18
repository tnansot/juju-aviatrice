# Schemas partagés — tRPC / Zod

> Types Zod réutilisés par plusieurs routers tRPC. Source de vérité pour les identifiants, enums et structures transverses.
> **2026-05-18** — Thomas (Papa) avec Claude

## Convention

- Chaque schema est défini une seule fois dans `src/shared/schemas.ts` (ou équivalent) et importé par les routers consommateurs.
- Nommage : `camelCase` pour les champs, `PascalCase` pour les types, préfixe `z` pour les schemas Zod.
- Les exemples utilisent des valeurs réalistes du domaine juju-aviatrice.

## Identifiants

### DeviceId

Identifiant unique du device de Juju. Généré côté client (`crypto.randomUUID()`), transporté via le header `X-Device-Id`.

```typescript
const zDeviceId = z.string().uuid();
type DeviceId = z.infer<typeof zDeviceId>;
// ex : "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**Utilisé par** : identite, onboarding, entrainement, progression.

### ChapitreId

Identifiant kebab-case d'un chapitre dans le catalogue.

```typescript
const zChapitreId = z.string().regex(/^[a-z0-9-]+$/);
type ChapitreId = z.infer<typeof zChapitreId>;
// ex : "maths-geometrie-plan", "psy-logique"
```

**Utilisé par** : contenu, entrainement, progression, suggestion.

### ExerciceId

Identifiant d'un exercice dans le catalogue.

```typescript
const zExerciceId = z.string().min(1);
type ExerciceId = z.infer<typeof zExerciceId>;
// ex : "maths-geometrie-plan-fc-001"
```

**Utilisé par** : contenu, entrainement.

## Enums métier

### Format

Type d'exercice disponible au sein d'un chapitre.

```typescript
const zFormat = z.enum(["flashcard", "qcm"]);
type Format = z.infer<typeof zFormat>;
```

**Utilisé par** : contenu, entrainement, suggestion. Étendu en M1 avec `"recherche"`.

### Matiere

Discipline associée à un chapitre.

```typescript
const zMatiere = z.enum(["maths", "physique_chimie", "logique", "calcul_mental"]);
type Matiere = z.infer<typeof zMatiere>;
```

**Utilisé par** : contenu.

### EtatOnboarding

Progression dans le parcours de bienvenue.

```typescript
const zEtatOnboarding = z.enum(["non_demarre", "en_cours", "complete", "saute"]);
type EtatOnboarding = z.infer<typeof zEtatOnboarding>;
```

**Utilisé par** : onboarding (écriture), identite (routing vers onboarding ou accueil).

### EtatSession

Cycle de vie d'une session d'usage.

```typescript
const zEtatSession = z.enum(["en_cours", "terminee", "interrompue"]);
type EtatSession = z.infer<typeof zEtatSession>;
```

**Utilisé par** : entrainement.

### EtatMiniSession

Cycle de vie d'une mini-session au sein d'une session.

```typescript
const zEtatMiniSession = z.enum(["en_cours", "terminee", "interrompue"]);
type EtatMiniSession = z.infer<typeof zEtatMiniSession>;
```

**Utilisé par** : entrainement, progression (lecture pour le bilan).

### EtatExercice

Cycle de vie d'un exercice pendant son exécution.

```typescript
const zEtatExercice = z.enum(["en_attente", "complete", "saute"]);
type EtatExercice = z.infer<typeof zEtatExercice>;
```

**Utilisé par** : entrainement.

### EtatChapitre

État d'accès d'un chapitre pour Juju (verrouillage / progression).

```typescript
const zEtatChapitre = z.enum(["verrouille", "debloque", "en_cours", "termine"]);
type EtatChapitre = z.infer<typeof zEtatChapitre>;
```

**Utilisé par** : progression (écriture), suggestion (lecture pour filtrer les chapitres accessibles).

### StrategieSuggestion

Algorithme ayant produit la suggestion contextuelle.

```typescript
const zStrategieSuggestion = z.enum(["continuite", "alternance", "reprise", "defaut"]);
type StrategieSuggestion = z.infer<typeof zStrategieSuggestion>;
```

**Utilisé par** : suggestion.

## Structures partagées

### Erreur

Format standard des erreurs tRPC retournées par le middleware.

```typescript
const zErreur = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(z.object({
    champ: z.string().optional(),
    erreur: z.string(),
  })).optional(),
});
type Erreur = z.infer<typeof zErreur>;
```

Codes d'erreur projet :

| Code | HTTP | Contexte |
|---|---|---|
| `DEVICE_INCONNU` | 401 | Header `X-Device-Id` absent ou device non enregistré en base |
| `INVITE_INVALIDE` | 401 | Jeton d'invitation absent, expiré ou quota épuisé |
| `VALIDATION` | 400 | Input Zod invalide (détails dans `details[]`) |
| `NON_TROUVE` | 404 | Ressource demandée inexistante |
| `CONFLIT` | 409 | Action impossible dans l'état courant (ex : terminer une session déjà terminée) |

## Middleware d'authentification

Toutes les procédures tRPC (sauf `identite.enregistrerDevice`) passent par un middleware qui :

1. Lit le header `X-Device-Id`
2. Vérifie l'existence du device en base SQLite
3. Injecte `deviceId` dans le contexte tRPC (`ctx.deviceId`)
4. Rejette avec `DEVICE_INCONNU` si absent ou invalide

```typescript
// Pseudo-code du middleware
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const deviceId = ctx.req.header("X-Device-Id");
  if (!deviceId) throw new TRPCError({ code: "UNAUTHORIZED", message: "DEVICE_INCONNU" });
  const device = await db.query.devices.findFirst({ where: eq(devices.valeur, deviceId) });
  if (!device) throw new TRPCError({ code: "UNAUTHORIZED", message: "DEVICE_INCONNU" });
  return next({ ctx: { ...ctx, deviceId } });
});
```

La procédure `identite.enregistrerDevice` utilise une procédure publique (sans middleware) car le device n'existe pas encore — elle vérifie le jeton d'invitation à la place.

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| modèles de domaine | [models/](../1-domain/models/) |
| ADR-002 stack (tRPC, Zod) | [adr-002](../2-architecture/adr/adr-002-stack-applicative.md) |
| ADR-005 authentification (device ID) | [adr-005](../2-architecture/adr/adr-005-authentification.md) |
| ADR-006 autorisation (device = accès) | [adr-006](../2-architecture/adr/adr-006-autorisation.md) |
| context map | [context-map](../1-domain/context-map.md) |
| langage ubiquitaire | [ubiquitous-language](../1-domain/ubiquitous-language.md) |
