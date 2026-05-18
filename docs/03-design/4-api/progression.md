# Router tRPC : progression

> Ce qui maintient l'engagement — l'avatar, les déblocages, les célébrations.
> Bounded context : [bc-progression](../1-domain/bc-progression.md) — Core

## Vue d'ensemble

| Procédure | Type | Écrans consommateurs |
|---|---|---|
| `progression.obtenirProfil` | query | FO-04 Accueil (avatar + compteurs) |
| `progression.obtenirAvancementChapitres` | query | FO-09 Choix Activité (états verrouillage) |

Le router est principalement en **lecture**. Les mises à jour de la progression se font via les événements de bc-entrainement (`exercice_effectue`, `mini_session_terminee`, `session_interrompue`) et bc-onboarding (`onboarding_complete`) traités en appels in-process — pas d'exposition API directe pour les mutations de progression.

Toutes protégées par le middleware auth.

---

## progression.obtenirProfil

**Type** : query

**Cas d'usage** : L'écran d'accueil affiche l'avatar, le compteur de sessions et l'avancement global. Appelé à chaque ouverture.

**Input** : aucun (device ID depuis `ctx.deviceId`)

**Output** :

```typescript
z.object({
  avatar: z.object({
    stade: z.number().int().min(1).max(4),
    prochainSeuil: z.number().int().nullable(),
    // Nombre d'exercices restants avant le prochain stade (null si stade max)
    progressionVersSeuil: z.number().min(0).max(1).nullable(),
    // Ratio 0-1 pour une éventuelle barre de progression sobre
  }),
  compteurExercices: z.number().int().min(0),
  compteurMiniSessions: z.number().int().min(0),
  derniereActivite: z.string().datetime().nullable(),
  chapitresEnCours: z.number().int(),
  // Nombre de chapitres avec état "en_cours"
  chapitresTermines: z.number().int(),
  // Nombre de chapitres avec état "termine"
})
```

**Règles métier** :

- Le suivi est basé sur l'**effort** (compteurs), jamais sur le score
- Aucun graphique de courbe, aucune note globale, aucun classement
- L'absence n'est jamais mentionnée — pas de « dernière visite il y a X jours »
- `prochainSeuil` est un indicateur encourageant, pas une pression (« encore 5 exercices et ton avatar évolue ! »)
- Données de progression jamais exposées en temps réel à Papa (ENF-SEC-005)

**Écrans** : [FO-04 Accueil](../3-wireframes/spec-ecran-accueil.md) — bloc avatar + suivi sobre

---

## progression.obtenirAvancementChapitres

**Type** : query

**Cas d'usage** : Afficher l'état de chaque chapitre (verrouillé, débloqué, en cours, terminé) dans FO-09 Choix Activité et dans la suggestion.

**Input** : aucun (device ID depuis `ctx.deviceId`)

**Output** :

```typescript
z.array(z.object({
  chapitreId: zChapitreId,
  etat: zEtatChapitre,
  exercicesEffectues: z.number().int().min(0),
  dateDeblocage: z.string().datetime().nullable(),
}))
```

**Règles métier** :

- Retourne l'état de **tous** les chapitres (ceux du catalogue bc-contenu)
- Les chapitres verrouillés sont présents dans la liste avec `etat = verrouille`
- Le frontend croise cette donnée avec `contenu.listerPiliers` pour construire l'écran FO-09
- `exercicesEffectues` permet au frontend d'afficher un indicateur de progression par chapitre (ex : barre sobre)

**Écrans** : [FO-09 Choix Activité](../3-wireframes/spec-ecran-choix-activite.md) — croiser avec le catalogue pour afficher l'arbre pilier → chapitres avec états

---

## Note d'implémentation : événements consommés

Les procédures ci-dessous ne sont **pas exposées en API tRPC** — elles sont appelées en interne (in-process) par les routers entrainement et onboarding. Elles sont documentées ici pour traçabilité.

### Réaction à `exercice_effectue`

- Incrémente `compteurExercices` du profil
- Incrémente `exercicesEffectues` du chapitre concerné
- Si le chapitre passe de `debloque` à `en_cours` (premier exercice), met à jour l'état
- Vérifie les seuils d'avatar : si `compteurExercices >= seuil[stade+1]`, émet `avatar_evolue`
- Vérifie les seuils de déblocage : si les conditions sont réunies (ex : 3 mini-sessions complétées), émet `chapitre_debloque`

### Réaction à `mini_session_terminee`

- Incrémente `compteurMiniSessions`
- Met à jour `derniereActivite`
- Revérifie les seuils (car certains seuils comptent les mini-sessions, pas les exercices individuels)

### Réaction à `session_interrompue`

- Comptabilise les exercices faits (pas de pénalité)
- Ne décrémente rien, ne réinitialise rien

### Réaction à `onboarding_complete`

- Initialise le profil de progression si inexistant
- Positionne l'avatar au stade 1
- Initialise les états de chapitres depuis le catalogue (avec `etat_initial` de chaque chapitre)

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| bounded context | [bc-progression](../1-domain/bc-progression.md) |
| modèles ProfilProgression, Avatar, EtatChapitre | [models/](../1-domain/models/) |
| exigences avatar | [req-avatar](../0-requirements/fonctionnelles/req-avatar.md) |
| exigences sécurité (ENF-SEC-005) | [req-securite](../0-requirements/non-fonctionnelles/req-securite.md) |
| schemas partagés | [schemas-partages](schemas-partages.md) |
