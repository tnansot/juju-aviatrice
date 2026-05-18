# Router tRPC : contenu

> Catalogue pédagogique — la matière première de l'entraînement.
> Bounded context : [bc-contenu](../1-domain/bc-contenu.md) — Core

## Vue d'ensemble

| Procédure | Type | Écrans consommateurs |
|---|---|---|
| `contenu.listerPiliers` | query | FO-02 Onboarding Piliers, FO-09 Choix Activité |
| `contenu.obtenirChapitre` | query | FO-09 Choix Activité (détail) |
| `contenu.chargerExercices` | query | FO-05 Flashcard, FO-06 QCM |
| `contenu.obtenirFicheMethode` | query | FO-11 Fiche Méthode |
| `contenu.obtenirFlashcardEchantillon` | query | FO-03 Onboarding Flashcard |

Toutes les procédures sont en lecture seule (queries). Le contenu est géré en code par Papa (pas de CRUD exposé à l'API). Toutes protégées par le middleware auth sauf `obtenirFlashcardEchantillon` qui pourrait être publique (onboarding avant device enregistré) — à trancher en implémentation.

---

## contenu.listerPiliers

**Type** : query

**Cas d'usage** : Afficher les piliers avec leurs chapitres pour la navigation (onboarding piliers, choix d'activité).

**Input** : aucun

**Output** :

```typescript
z.array(z.object({
  id: z.string(),                    // "sciences", "psychotechniques"
  nom: z.string(),                   // "Sciences", "Psychotechniques"
  description: z.string(),           // Phrase courte pour l'affichage
  chapitres: z.array(z.object({
    id: zChapitreId,
    nom: z.string(),                 // "Géométrie dans le plan"
    matiere: zMatiere,
    formatsDisponibles: z.array(zFormat),
    ordre: z.number().int(),
  })),
}))
```

**Règles métier** :

- Retourne tous les piliers avec leurs chapitres ordonnés par `ordre`
- N'inclut pas les exercices (trop volumineux) — le détail des exercices se charge via `chargerExercices`
- L'état de verrouillage n'est pas dans ce router (→ bc-progression) — le frontend croise les deux réponses

**Écrans** : [FO-02 Onboarding Piliers](../3-wireframes/spec-ecran-onboarding-piliers.md), [FO-09 Choix Activité](../3-wireframes/spec-ecran-choix-activite.md)

---

## contenu.obtenirChapitre

**Type** : query

**Cas d'usage** : Obtenir les métadonnées d'un chapitre (sans les exercices).

**Input** :

```typescript
z.object({
  chapitreId: zChapitreId,
})
```

**Output** :

```typescript
z.object({
  id: zChapitreId,
  pilierId: z.string(),
  nom: z.string(),
  matiere: zMatiere,
  referenceBo: z.string().nullable(),
  formatsDisponibles: z.array(zFormat),
  ordre: z.number().int(),
  ficheMethodeDisponible: z.boolean(),    // true si chapitre psy avec fiche
  nombreExercicesParFormat: z.record(zFormat, z.number().int()),
  // ex : { flashcard: 12, qcm: 8 }
})
```

**Erreurs** : `NON_TROUVE` si `chapitreId` inexistant.

**Écrans** : [FO-09 Choix Activité](../3-wireframes/spec-ecran-choix-activite.md) (détail du chapitre avant de lancer)

---

## contenu.chargerExercices

**Type** : query

**Cas d'usage** : Charger les exercices d'un chapitre pour un format donné, dans l'ordre. Appelé par bc-entrainement au démarrage d'une mini-session.

**Input** :

```typescript
z.object({
  chapitreId: zChapitreId,
  format: zFormat,
  nombre: z.number().int().min(3).max(5).default(4),
  // Nombre d'exercices à retourner (mini-session = 3-5)
})
```

**Output** :

```typescript
z.array(z.object({
  id: zExerciceId,
  format: zFormat,
  enonce: z.union([
    // Flashcard
    z.object({
      faceQuestion: z.string(),
      faceReponse: z.string(),
    }),
    // QCM
    z.object({
      question: z.string(),
      choix: z.array(z.object({
        id: z.string(),
        libelle: z.string(),
      })),
      // Note : est_correct n'est PAS envoyé au frontend
      // La validation se fait côté backend via soumettreReponse
    }),
  ]),
  typologiePsy: z.enum(["serie", "analogie", "syllogisme", "deductif"]).nullable(),
  ordre: z.number().int(),
}))
```

**Règles métier** :

- Retourne exactement `nombre` exercices du chapitre/format demandé
- Les exercices sont mélangés aléatoirement (pas toujours dans le même ordre)
- La bonne réponse QCM (`est_correct`) n'est jamais envoyée au frontend — la validation se fait côté backend via `entrainement.soumettreReponse`
- La `correction` n'est pas envoyée non plus — elle est retournée après la réponse

**Écrans** : consommé en interne par le flux de [FO-05 Flashcard](../3-wireframes/spec-ecran-flashcard.md) et [FO-06 QCM](../3-wireframes/spec-ecran-qcm.md)

---

## contenu.obtenirFicheMethode

**Type** : query

**Cas d'usage** : Afficher la fiche méthode d'un chapitre psychotechnique (J3 étape 2).

**Input** :

```typescript
z.object({
  chapitreId: zChapitreId,
})
```

**Output** :

```typescript
z.object({
  id: z.string(),
  chapitreId: zChapitreId,
  typePsy: z.enum(["logique", "calcul_mental"]),
  cestQuoi: z.string(),
  ceQueCaEvalue: z.array(z.string()).min(3).max(5),
  commentAborder: z.array(z.string()).min(3).max(5),
})
```

**Erreurs** : `NON_TROUVE` si le chapitre n'a pas de fiche méthode (chapitres sciences).

**Écrans** : [FO-11 Fiche Méthode](../3-wireframes/spec-ecran-fiche-methode.md)

---

## contenu.obtenirFlashcardEchantillon

**Type** : query

**Cas d'usage** : Charger la flashcard d'échantillon utilisée pendant l'onboarding (J1 étapes 3-5). Terrain familier maths pour ancrer le dual-usage.

**Input** : aucun

**Output** :

```typescript
z.object({
  id: zExerciceId,
  faceQuestion: z.string(),
  faceReponse: z.string(),
})
// ex : { id: "onboarding-fc-001", faceQuestion: "Dérivée de x² ?", faceReponse: "2x" }
```

**Règles métier** :

- Retourne toujours la même flashcard prédéfinie (contenu hardcodé)
- Flashcard maths (pas psy) — terrain familier pour la 1ère expérience

**Écrans** : [FO-03 Onboarding Flashcard](../3-wireframes/spec-ecran-onboarding-flashcard.md)

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| bounded context | [bc-contenu](../1-domain/bc-contenu.md) |
| modèles Pilier, Chapitre, Exercice, FicheMethode | [models/](../1-domain/models/) |
| exigences contenu | [req-contenu](../0-requirements/fonctionnelles/req-contenu.md) |
| schemas partagés | [schemas-partages](schemas-partages.md) |
