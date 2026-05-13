# Exigences non-fonctionnelles : Interopérabilité

## Thème

**Interopérabilité** — Support navigateurs et devices, standards, anticipation multi-appareil.

### Source

- **Personas** : [Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) (smartphone quotidien, ordi week-end en M1)
- **Journey J4** : [Week-end immersion](../../../02-discovery/journeys/journey-week-end-immersion.md) (ordi, M1)

## Exigences

### ENF-INT-001 [Must] : Support smartphone de Juju

L'application fonctionne correctement sur le smartphone de Juju (modèle et OS à identifier avant la phase Implementation). Le rendu, la navigation et les exercices sont testés sur ce device précis.

**Vérification** : tester l'application sur le smartphone réel de Juju → toutes les fonctionnalités M0 fonctionnent sans bug bloquant.

### ENF-INT-002 [Should] : Navigateurs modernes (si web)

Si la stack retenue est web (PWA, SPA, SSR), l'application supporte les 2 dernières versions majeures de Chrome, Safari et Firefox sur mobile et desktop. Pas de support IE ni de navigateurs obsolètes.

**Vérification** : tester sur Chrome mobile, Safari iOS, Firefox mobile → rendu correct et fonctionnalités opérationnelles.

### ENF-INT-003 [Won't — M0] : Support ordi

Le support ordinateur (responsive desktop, ergonomie grand écran) est différé en M1. En M0, l'application est conçue smartphone-first. Elle peut être ouverte sur ordi mais sans garantie d'ergonomie.

**Vérification** : N/A en M0.

## Traçabilité

| Dépendance | Référence |
|---|---|
| persona Juju (smartphone quotidien) | [Persona Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) |
| journey J4 (ordi M1) | [Week-end immersion](../../../02-discovery/journeys/journey-week-end-immersion.md) |
| initiative I-T.1 (stack, multi-appareil) | [Initiatives](../../../01-strategy/initiatives.md) |
