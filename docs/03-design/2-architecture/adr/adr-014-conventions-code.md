# ADR-014 : Conventions de code

## Contexte

Le projet est fullstack TypeScript avec React + Hono dans un monorepo. Les conventions doivent être cohérentes entre frontend et backend, et alignées avec le langage ubiquitaire français du domaine (bounded contexts, modèles, événements).

## Décision

### Formatage et linting

**Biome** — linter + formatter tout-en-un, rapide (Rust), configuration unique dans `biome.json` à la racine du monorepo.

### Nommage

| Élément | Convention | Exemple |
|---|---|---|
| **Fichiers TS/TSX** | kebab-case | `identify-device.service.ts`, `SessionScreen.tsx` |
| **Composants React** | PascalCase | `AvatarDisplay`, `ExerciceCard` |
| **Fonctions / méthodes** | camelCase | `getDeviceId()`, `submitExercice()` |
| **Variables / constantes** | camelCase / UPPER_SNAKE_CASE | `exerciceEnCours`, `MAX_EXERCICES` |
| **Types / interfaces** | PascalCase | `ProfilProgression`, `MiniSession` |
| **Dossiers BC** | kebab-case | `entrainement/`, `progression/` |
| **Tables SQLite** | snake_case | `profil_progression`, `exercice_en_cours` |
| **Événements domaine** | snake_case | `exercice_effectue`, `mini_session_terminee` |

### Conventions d'URL

| Aspect | Choix |
|---|---|
| **Langue** | Français métier (aligné langage ubiquitaire) |
| **Casse** | kebab-case |
| **Pluriel** | Pluriel pour les collections (`/chapitres`, `/exercices`), singulier pour les singletons (`/profil`, `/suggestion`) |
| **Versioning API** | Aucun — front et back déployés ensemble via tRPC |

Exemples routes frontend : `/entrainement`, `/progression`, `/onboarding`.
Exemples procédures tRPC : `chapitres.list`, `exercices.get`, `sessions.start`, `profil.get`.

### Internationalisation

Pas d'i18n en M0 — l'app est en français uniquement. Pas de préfixe `/fr/` dans les URLs.

## Exigences concernées

- [ENF-ACC-001 : WCAG AA](../../0-requirements/non-fonctionnelles/req-accessibilite.md) — conventions de nommage accessibles
- Langage ubiquitaire du domaine : [ubiquitous-language](../../1-domain/ubiquitous-language.md)

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-002 Stack (TypeScript, React, Hono) | [adr-002](adr-002-stack-applicative.md) |
| ADR-003 Structure (monorepo fullstack) | [adr-003](adr-003-structure-projet.md) |
| ADR-012 Stratégie Git (Conventional Commits FR) | [adr-012](adr-012-strategie-git.md) |
| langage ubiquitaire | [ubiquitous-language](../../1-domain/ubiquitous-language.md) |
