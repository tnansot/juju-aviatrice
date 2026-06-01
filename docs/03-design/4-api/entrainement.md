# Router tRPC : entrainement

> Orchestration de l'usage quotidien — le cœur de l'expérience de Juju.
> Bounded context : [bc-entrainement](../1-domain/bc-entrainement.md) — Core

## Vue d'ensemble

| Procédure | Type | Écrans consommateurs |
|---|---|---|
| `entrainement.demarrerMiniSession` | mutation | FO-04 (Go direct sans suggestion) |
| `entrainement.soumettreReponse` | mutation | FO-06 QCM |
| `entrainement.retournerFlashcard` | mutation | FO-05 Flashcard |
| `entrainement.terminerMiniSession` | mutation | FO-05/FO-06 (dernier exercice) |
| `entrainement.obtenirBilan` | query | FO-07 Bilan |
| `entrainement.signalerInterruption` | mutation | Fermeture app / navigation away |

Toutes protégées par le middleware auth. La majorité du flux passe par `suggestion.accepter` (qui crée la mini-session en interne), mais `demarrerMiniSession` est disponible pour le choix manuel (FO-09 → exercices).

---

## entrainement.demarrerMiniSession

**Type** : mutation

**Cas d'usage** : Juju choisit manuellement un chapitre/format depuis FO-09 (choix alternatif) au lieu d'accepter la suggestion.

**Input** :

```typescript
z.object({
  chapitreId: zChapitreId,
  format: zFormat,
  modeChrono: z.boolean().default(false),
  dureeChrono: z.number().int().min(30).optional(),
  // Durée en secondes, requis si modeChrono = true
  nombre: z.number().int().min(3).max(5).default(4),
})
```

**Output** :

```typescript
z.object({
  sessionId: z.string(),
  miniSessionId: z.string(),
  exercices: z.array(z.object({
    id: zExerciceId,
    exerciceEnCoursId: z.string(),
    // ID de l'instance (ExerciceEnCours), pas de l'exercice source
    format: zFormat,
    enonce: z.union([
      z.object({
        faceQuestion: z.string(),
        faceReponse: z.string(),
        explication: z.string(),
        // Raisonnement affiché après retournement (REQ-SESSION-006).
        // Libellé UI : « Explication ». La bonne réponse QCM, elle, n'est
        // jamais envoyée ici (révélée via soumettreReponse).
      }),
      z.object({
        question: z.string(),
        choix: z.array(z.object({
          id: z.string(),
          libelle: z.string(),
        })),
      }),
    ]),
    ordre: z.number().int(),
  })),
  modeChrono: z.boolean(),
  dureeChrono: z.number().int().nullable(),
})
```

**Règles métier** :

- Crée une session si aucune n'est `en_cours` pour ce device, sinon rattache à la session existante
- Crée la mini-session avec `etat = en_cours`
- Charge les exercices via bc-contenu (appel in-process) et crée les instances `ExerciceEnCours`
- Les exercices sont mélangés aléatoirement
- La bonne réponse QCM n'est pas envoyée au frontend
- Vérifie que le chapitre est **débloqué** (sinon erreur `CONFLIT`)

**Erreurs** :

| Code | Condition |
|---|---|
| `NON_TROUVE` | Chapitre inexistant |
| `CONFLIT` | Chapitre verrouillé |

**Écrans** : [FO-09 Choix Activité](../3-wireframes/spec-ecran-choix-activite.md) → [FO-05](../3-wireframes/spec-ecran-flashcard.md) ou [FO-06](../3-wireframes/spec-ecran-qcm.md)

---

## entrainement.soumettreReponse

**Type** : mutation

**Cas d'usage** : Juju sélectionne une réponse QCM et valide.

**Input** :

```typescript
z.object({
  exerciceEnCoursId: z.string(),
  choixId: z.string(),
  // ID du choix sélectionné parmi ceux de l'énoncé
})
```

**Output** :

```typescript
z.object({
  estCorrect: z.boolean(),
  correction: z.string(),
  // Explication du raisonnement, charte de ton
  bonneReponseId: z.string(),
  // ID du choix correct (pour highlight visuel)
  exerciceSuivant: z.boolean(),
  // true s'il reste des exercices dans la mini-session
})
```

**Règles métier** :

- Enregistre la réponse, le temps de réponse (`dureeReponseMs` calculé côté backend entre chargement et soumission)
- Passe l'exercice à `etat = complete`
- La correction est formulée positivement (charte de ton) — jamais « Faux » ni « Raté »

**Événement émis** : `exercice_effectue` → consommé par bc-progression (incrémenter compteur effort, vérifier seuils avatar/déblocage)

**Écrans** : [FO-06 QCM](../3-wireframes/spec-ecran-qcm.md) — après validation, le frontend affiche la correction puis passe à l'exercice suivant ou au bilan

---

## entrainement.retournerFlashcard

**Type** : mutation

**Cas d'usage** : Juju retourne une flashcard (auto-évaluation mentale, pas de vérification système).

**Input** :

```typescript
z.object({
  exerciceEnCoursId: z.string(),
})
```

**Output** :

```typescript
z.object({
  exerciceSuivant: z.boolean(),
  // true s'il reste des exercices dans la mini-session
})
```

**Règles métier** :

- Passe l'exercice à `etat = complete`
- Pas de `est_correct` (auto-évaluation mentale)
- Mesure le temps passé sur la flashcard

**Événement émis** : `exercice_effectue` → bc-progression

**Écrans** : [FO-05 Flashcard](../3-wireframes/spec-ecran-flashcard.md) — tap pour retourner, puis tap pour passer à l'exercice suivant

---

## entrainement.terminerMiniSession

**Type** : mutation

**Cas d'usage** : Le dernier exercice de la mini-session est complété. Le frontend appelle cette procédure pour clôturer et préparer le bilan.

**Input** :

```typescript
z.object({
  miniSessionId: z.string(),
})
```

**Output** :

```typescript
z.object({
  etat: z.literal("terminee"),
  nombreExercicesFaits: z.number().int(),
  avatarProgresse: z.boolean(),
  // true si un seuil avatar a été atteint pendant cette mini-session
  nouveauStadeAvatar: z.number().int().nullable(),
  // Nouveau stade si avatarProgresse = true
  chapitreDebloque: z.object({
    chapitreId: zChapitreId,
    chapitreNom: z.string(),
  }).nullable(),
  // Non-null si un déblocage a été déclenché
})
```

**Règles métier** :

- Passe la mini-session à `etat = terminee`
- Calcule le nombre d'exercices faits (incluant les `complete`, excluant les `saute`)
- Émet `mini_session_terminee` → bc-progression vérifie les seuils et retourne les résultats d'évolution
- La réponse contient directement les infos avatar/déblocage pour que le frontend puisse afficher le bilan et l'éventuelle célébration en un seul aller-retour

**Événement émis** : `mini_session_terminee` → consommé par bc-progression

**Écrans** : dernier exercice de [FO-05](../3-wireframes/spec-ecran-flashcard.md) ou [FO-06](../3-wireframes/spec-ecran-qcm.md) → [FO-07 Bilan](../3-wireframes/spec-ecran-bilan.md) → éventuellement [FO-08 Déblocage](../3-wireframes/spec-ecran-deblocage.md)

---

## entrainement.obtenirBilan

**Type** : query

**Cas d'usage** : Charger les données du bilan de fin de mini-session (pour FO-07). Séparé de `terminerMiniSession` pour permettre un rechargement si le frontend le perd.

**Input** :

```typescript
z.object({
  miniSessionId: z.string(),
})
```

**Output** :

```typescript
z.object({
  miniSessionId: z.string(),
  chapitreNom: z.string(),
  format: zFormat,
  nombreExercicesFaits: z.number().int(),
  dureeMinutes: z.number(),
  // Durée arrondie en minutes (pas de secondes)
  modeChrono: z.boolean(),
  messageBilan: z.string(),
  // Message sobre, aligné charte de ton
  // ex : "4 exercices faits — ton avatar a progressé !"
})
```

**Règles métier** :

- Mentionne le nombre d'exercices faits et le temps passé
- Jamais de note /N, de pourcentage, ou de score
- Le message est toujours positif (charte de ton)

**Écrans** : [FO-07 Bilan](../3-wireframes/spec-ecran-bilan.md)

---

## entrainement.signalerInterruption

**Type** : mutation

**Cas d'usage** : Juju ferme l'app ou navigue ailleurs pendant une mini-session. Appelé par un event listener `beforeunload` / `visibilitychange`.

**Input** :

```typescript
z.object({
  miniSessionId: z.string(),
})
```

**Output** :

```typescript
z.object({
  exercicesFaitsComptes: z.number().int(),
  // Nombre d'exercices comptabilisés malgré l'interruption
})
```

**Règles métier** :

- Passe la mini-session à `etat = interrompue`
- **Comptabilise les exercices déjà complétés** — pas de pénalité
- Si la session parente n'a plus de mini-session `en_cours`, passe la session aussi à `interrompue`
- Prochaine ouverture : aucun message relatif à l'interruption (règle d'or)

**Événements émis** : `session_interrompue` → consommé par bc-progression (comptabiliser exercices faits) et bc-suggestion (proposer reprise)

**Écrans** : aucun — appel silencieux au background

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| bounded context | [bc-entrainement](../1-domain/bc-entrainement.md) |
| modèles Session, MiniSession, ExerciceEnCours | [models/](../1-domain/models/) |
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| exigences session | [req-session](../0-requirements/fonctionnelles/req-session.md) |
| schemas partagés | [schemas-partages](schemas-partages.md) |
