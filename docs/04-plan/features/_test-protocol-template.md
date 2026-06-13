# Template — Protocole de test manuel

Ce fichier est la **référence** pour rédiger les protocoles de test manuels (`f{N}-test-protocol.md`).
L'agent doit le lire avant d'écrire un nouveau protocole et en respecter toutes les règles.

## Règles de rédaction

### Structure & sections

- **R1 — Nommage** : `f{N}-test-protocol.md`, dans `docs/04-plan/features/`.
- **R2 — Metadata** : bloc blockquote en tête avec Feature (lien relatif vers la feature spec), Date de création, Testeur (champ à remplir).
- **R3 — Sections obligatoires** (dans cet ordre) :
  1. `## Prérequis`
  2. `## Scénarios` (contenant les sous-sections `### N. Titre (Sx)`)
  3. `## Vérification API directe` *(optionnelle — si des endpoints sont testables via curl)*
  4. `## Vérification post-deploy`
  5. `## Résultat`

### Prérequis & données de test

- **R4 — Setup from scratch** : décrire le setup complet pour un testeur qui part de zéro (commandes, URLs, données de test).
- **R5 — Proche de la production** : utiliser un mécanisme de déploiement le plus proche possible de la production (ex. `docker compose up` plutôt que `pnpm dev` en direct).
- **R6 — Remise à zéro** : inclure les manipulations pour repartir d'un état propre (supprimer localStorage, volumes Docker, etc.).

### Rédaction des scénarios

- **R7 — Un objectif par scénario** : chaque scénario teste un seul comportement. Max 10-15 étapes ; au-delà, découper en plusieurs scénarios.
- **R8 — Référence aux stories** : le titre du scénario mentionne la/les story(ies) concernée(s) via leur code `(Sx)` ou `(Sx + Sy)`.
- **R9 — Critères Gherkin** : chaque scénario commence par un bloc `**Critères Gherkin**` au format GIVEN / WHEN / THEN.
- **R10 — Actions numérotées** : une action par étape, commençant par un verbe d'action (Ouvrir, Cliquer, Vérifier, Saisir, Fermer…). Ne pas combiner plusieurs actions sur une même ligne.
- **R11 — Séparation actions / résultats** : les **Actions** décrivent ce que fait le testeur. Le **Résultat attendu** décrit ce que fait le système. Les deux sont dans des blocs distincts.
- **R12 — Résultats mesurables** : le résultat attendu doit être spécifique et vérifiable (texte exact, valeur JSON, état visuel). Deux testeurs doivent arriver au même verdict sans discussion.
- **R13 — Checkboxes** : chaque point de validation a une checkbox `- [ ] OK` ou `- [ ] OK — détail`. Cocher `[x]` une fois validé.

### Traçabilité

- **R14 — Traçabilité story/exigence** : chaque scénario doit être traçable vers au moins une story ou exigence du plan.
- **R15 — Lien feature spec** : le bloc metadata contient un lien vers la feature spec.

### Vérification production

- **R16 — Section post-deploy systématique** : chaque protocole inclut une section `## Vérification post-deploy` avec les URLs de production et les vérifications à effectuer après déploiement.
- **R17 — Checkboxes prod séparées** : les vérifications prod ont leurs propres checkboxes, distinctes des tests locaux.

### Runbook transverse (anti-redites)

- **R20 — Renvoyer au runbook** : ne jamais recopier une procédure **transverse** (démarrage de l'environnement, seed du jeton, remise à zéro, récupération du `device-id`, conventions d'appel API tRPC, healthcheck/accès prod, gestion du jeton prod, device vierge). Renvoyer vers la section concernée du [Runbook — Test manuel](../../06-run/runbook-test-manuel.md) via un lien d'ancre, et ne décrire dans le protocole que le **spécifique feature** (scénarios, énoncés, endpoints propres).
- **R21 — Maintenir le runbook** : si la feature introduit ou modifie une procédure transverse (nouveau script de reset, nouvelle convention API, changement d'URL ou de stack de déploiement), **mettre à jour le runbook** dans le même mouvement que la rédaction du protocole — pas après coup. Une procédure obsolète se corrige dans le runbook en priorité, les protocoles en héritent par renvoi.

### Résultat global

- **R18 — Checklist récapitulative** : la section `## Résultat` contient une checklist résumant le verdict.
- **R19 — Testeur & Date** : champs **Testeur** et **Date** obligatoires dans la section Résultat.

---

## Gabarit

Copier le gabarit ci-dessous et l'adapter à la feature.

````markdown
# Protocole de test manuel — F{N} {Nom de la feature}

> **Feature** : [F{N} — {Nom}](f{N}-feature-{slug}.md)
> **Date** : {YYYY-MM-DD}
> **Testeur** : _____________

## Prérequis

Procédures communes dans le [Runbook — Test manuel](../../06-run/runbook-test-manuel.md) :

- Démarrer l'environnement local → [§1](../../06-run/runbook-test-manuel.md#1-démarrer-lenvironnement-de-test-local).
- Créer le jeton → [§2](../../06-run/runbook-test-manuel.md#2-créer-un-jeton-dinvitation-local).
- Remise à zéro → [§3](../../06-run/runbook-test-manuel.md#3-remettre-létat-à-zéro-local).

**Spécifique F{N}** : {manipulations propres à la feature pour atteindre le point de départ des scénarios}

## Scénarios

### 1. {Titre du scénario} (S{x})

**Critères Gherkin** : GIVEN {contexte} WHEN {action} THEN {résultat observable}

**Actions** :

1. {Verbe d'action} …
2. {Verbe d'action} …
3. Vérifier : {point de contrôle précis}

**Résultat attendu** : {description spécifique et mesurable}

- [ ] OK

### 2. {Titre du scénario suivant} (S{y})

**Critères Gherkin** : GIVEN … WHEN … THEN …

**Actions** :

1. …

**Résultat attendu** : …

- [ ] OK

## Vérification API directe

> Section optionnelle — inclure si des endpoints sont testables via curl.

```bash
curl -s http://localhost:3000/{endpoint} | jq .
# Attendu : {JSON attendu}
```

- [ ] OK

## Vérification post-deploy

> Vérifications à effectuer après déploiement en production. Procédures communes (healthcheck, accès VPS/base, jeton prod, device vierge) : voir [Runbook §6](../../06-run/runbook-test-manuel.md#6-vérification-post-déploiement-production).

**API production** (healthcheck → [Runbook §6.1](../../06-run/runbook-test-manuel.md#61-healthcheck-de-lapi)) :

```bash
curl -s https://api.juju-aviatrice.uk/{endpoint propre à la feature} | jq .
```

- [ ] OK — {point de vérification prod 1}
- [ ] OK — {point de vérification prod 2}

**Frontend production** : ouvrir https://app.juju-aviatrice.uk/{page}

- [ ] OK — {point de vérification frontend prod}

## Résultat

- [ ] Tous les scénarios locaux validés
- [ ] Vérifications post-deploy validées
- **Testeur** : _____________
- **Date** : _____________
````
