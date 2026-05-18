# ADR-012 : Stratégie Git

## Contexte

Développeur solo sur un projet personnel. GitFlow (branches develop, release, hotfix) est surdimensionné. Le trunk-based pur perd la possibilité de review avant merge (utile même en solo pour structurer le travail).

## Décision

### Workflow

**GitHub Flow** — branche `main` toujours déployable. Feature branches courtes, merge via PR (même en solo, pour structurer et historiser).

### Règles de merge

**Squash merge** — chaque PR produit un seul commit propre dans `main`. Historique lisible.

### Protection de `main`

PR obligatoire (pas de push direct). CI doit passer (lint, tests, type-check) avant merge.

### Convention de commits

**Conventional Commits en français**. Format : `type(scope): message`.

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Refactoring sans changement fonctionnel |
| `test` | Ajout/modification de tests |
| `chore` | Config, outillage, dépendances |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de logique) |

Scope optionnel, aligné sur les BCs : `feat(entrainement): ajouter le mode chrono`.

### Hooks Git

**Lefthook** (fichier `lefthook.yml`) :

| Hook | Action |
|---|---|
| `pre-commit` | Biome check (lint + format) sur les fichiers stagés |
| `commit-msg` | Validation du format Conventional Commits |

### Versioning

**SemVer** avec changelog auto-généré depuis les Conventional Commits (outil : **changelogen**). Tag de release sur `main` à chaque milestone (M0, M1…).

## Exigences concernées

- [ENF-AUT-002 : Déploiement simple](../../0-requirements/non-fonctionnelles/req-autres.md) — PR → CI → merge → deploy

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-013 Pipeline CI/CD | [adr-013](adr-013-pipeline-cicd.md) |
| ADR-014 Conventions de code (Biome) | [adr-014](adr-014-conventions-code.md) |
