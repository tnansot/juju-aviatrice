# Exigences non-fonctionnelles : Performance

## Thème

**Performance** — Temps de chargement, fluidité des exercices, poids des assets, usage réseau dégradé.

### Source

- **Journeys** : [J2 — Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) (fatigue, attention courte, tolérance à la friction nulle)

## Exigences

### ENF-PERF-001 [Must] : Temps de chargement initial < 3 secondes

Le premier chargement de l'application (cold start, cache vide) doit être inférieur à 3 secondes sur une connexion 4G mobile standard. Ce seuil est critique : Juju est fatiguée le soir, un chargement long provoque un abandon.

**Vérification** : mesurer le temps de chargement sur un smartphone 4G (Lighthouse mobile, WebPageTest) → First Contentful Paint < 3s.

### ENF-PERF-002 [Must] : Fluidité des exercices < 300ms

La transition entre deux exercices au sein d'une mini-session doit être perçue comme instantanée : temps de réponse < 300ms entre la validation d'un exercice et l'affichage du suivant. Aucune page de chargement intermédiaire.

**Vérification** : enchaîner 5 exercices → aucune latence perceptible entre les transitions, mesurée < 300ms.

### ENF-PERF-003 [Should] : Poids total des assets < 5 Mo

Le poids total des assets chargés au premier accès (HTML, CSS, JS, images, fonts) doit rester inférieur à 5 Mo. Cela garantit un chargement rapide sur mobile et un usage raisonnable du forfait data.

**Vérification** : mesurer le poids total transféré au premier chargement (DevTools Network) → < 5 Mo.

### ENF-PERF-004 [Could] : Usage en réseau dégradé

Si la stack le permet, les exercices déjà chargés doivent rester jouables sans requête réseau supplémentaire (mode offline-first ou cache agressif). Cela permet l'usage en zone de couverture faible (transport, campagne).

**Vérification** : charger l'app en 4G, passer en mode avion, lancer une session → les exercices déjà en cache sont jouables.

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J2 (friction nulle, 15 min) | [Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| persona Juju (fatigue, attention courte) | [Persona Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) |
