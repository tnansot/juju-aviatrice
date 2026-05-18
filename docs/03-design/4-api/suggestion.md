# Router tRPC : suggestion

> Minimiser la décision — un tap et c'est parti.
> Bounded context : [bc-suggestion](../1-domain/bc-suggestion.md) — Supporting

## Vue d'ensemble

| Procédure | Type | Écrans consommateurs |
|---|---|---|
| `suggestion.obtenirSuggestion` | query | FO-04 Accueil |
| `suggestion.accepter` | mutation | FO-04 Accueil (bouton Go) |
| `suggestion.listerAlternatives` | query | FO-09 Choix Activité |

Toutes protégées par le middleware auth.

---

## suggestion.obtenirSuggestion

**Type** : query

**Cas d'usage** : À chaque ouverture de l'app, le frontend affiche la suggestion contextuelle sur l'écran d'accueil (1 ligne + bouton Go).

**Input** : aucun (device ID depuis `ctx.deviceId`)

**Output** :

```typescript
z.object({
  chapitreId: zChapitreId,
  chapitreNom: z.string(),          // "Géométrie dans le plan"
  format: zFormat,
  nombreExercices: z.number().int().min(3).max(5),
  libelle: z.string(),              // "Poursuis Géométrie : 4 flashcards"
  strategie: zStrategieSuggestion,
})
```

**Règles métier** (cf. [model-suggestion](../1-domain/models/model-suggestion.md)) :

| Stratégie | Déclencheur | Résultat |
|---|---|---|
| `continuite` | Chapitre en cours, historique suffisant | Poursuivre le dernier chapitre/format |
| `alternance` | ≥ 3 sessions consécutives sur un même pilier | Proposer l'autre pilier |
| `reprise` | Session précédente interrompue | Proposer le chapitre/format interrompu |
| `defaut` | Historique insuffisant (1ère ou 2e ouverture) | Flashcard maths du 1er chapitre |

- Lit en interne les données de bc-progression (chapitres parcourus, piliers visités, dernière activité) et bc-contenu (catalogue débloqué)
- Ne suggère que du contenu **débloqué** (respecte l'état de verrouillage de bc-progression)

**Écrans** : [FO-04 Accueil](../3-wireframes/spec-ecran-accueil.md) — suggestion + bouton Go visible sans scroll

---

## suggestion.accepter

**Type** : mutation

**Cas d'usage** : Juju tape le bouton Go sur la suggestion proposée.

**Input** :

```typescript
z.object({
  chapitreId: zChapitreId,
  format: zFormat,
  nombreExercices: z.number().int().min(3).max(5),
})
```

**Output** :

```typescript
z.object({
  miniSessionId: z.string(),
  // La mini-session est créée côté backend (via appel in-process à bc-entrainement)
  exercices: z.array(z.object({
    id: zExerciceId,
    format: zFormat,
    enonce: z.unknown(), // structure flashcard ou QCM (cf. contenu.chargerExercices)
  })),
})
```

**Règles métier** :

- Émet `suggestion_acceptee` → bc-entrainement démarre la mini-session avec le contenu suggéré
- Crée automatiquement une session si aucune n'est en cours
- Retourne directement les exercices pour éviter un aller-retour supplémentaire

**Événement émis** : `suggestion_acceptee`

**Écrans** : [FO-04 Accueil](../3-wireframes/spec-ecran-accueil.md) bouton Go → navigation vers [FO-05](../3-wireframes/spec-ecran-flashcard.md) ou [FO-06](../3-wireframes/spec-ecran-qcm.md) selon le format

---

## suggestion.listerAlternatives

**Type** : query

**Cas d'usage** : Juju appuie sur « Changer » dans FO-04 pour choisir elle-même. Affiche les piliers → chapitres accessibles en ≤ 2 taps.

**Input** : aucun

**Output** :

```typescript
z.array(z.object({
  pilierId: z.string(),
  pilierNom: z.string(),
  chapitres: z.array(z.object({
    id: zChapitreId,
    nom: z.string(),
    matiere: zMatiere,
    formatsDisponibles: z.array(zFormat),
    etat: zEtatChapitre,           // verrouillé, débloqué, en_cours, terminé
    exercicesEffectues: z.number().int(),
  })),
}))
```

**Règles métier** :

- Croise le catalogue de bc-contenu avec les états de bc-progression
- Les chapitres verrouillés apparaissent dans la liste mais marqués comme tels (« à venir »)
- Les chapitres débloqués/en_cours sont sélectionnables
- Ordonnés par `ordre` au sein de chaque pilier

**Écrans** : [FO-09 Choix Activité](../3-wireframes/spec-ecran-choix-activite.md)

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| bounded context | [bc-suggestion](../1-domain/bc-suggestion.md) |
| modèle Suggestion | [model-suggestion](../1-domain/models/model-suggestion.md) |
| journey J2 (suggestion + Go) | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| exigences suggestion | [req-suggest](../0-requirements/fonctionnelles/req-suggest.md) |
| schemas partagés | [schemas-partages](schemas-partages.md) |
