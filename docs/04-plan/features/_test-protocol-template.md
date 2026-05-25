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

```bash
# Repartir d'un état propre puis démarrer (proche de la prod)
docker compose down -v
docker compose up --build
# Attendre les logs de démarrage
```

{Manipulations de remise à zéro spécifiques (localStorage, jeton, etc.)}

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

> Vérifications à effectuer après déploiement en production.

**API production** :

```bash
curl -s https://api.juju-aviatrice.uk/{endpoint} | jq .
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
