<!-- BEGIN PBM-WORKFLOW -->
# PBM — Product Builder Method

Ce repository utilise le **Product Builder Method** (module BMAD), un framework structuré de conception et construction produit en 6 phases séquentielles : Strategy → Discovery → Design → Plan → Implementation → Run.

## Démarrage rapide

1. Personnaliser ce fichier avec les conventions du projet
2. Lancer `bmad-help` pour découvrir les skills disponibles
3. Commencer par `pbm-strategy` (stratégie produit) ou `pbm-discovery` (discovery produit)

## Conventions générales

- Les commandes exécutées doivent être compatibles Linux et macOS
- Privilégier systématiquement les **questions interactives visuelles AskUserQuestion** (avec options cliquables) pour guider l'utilisateur à chaque étape. Ne pas hésiter à poser un nombre conséquent de questions pour affiner les choix, clarifier les besoins et valider les orientations avant de produire un livrable
- Les diagrammes utilisent exclusivement **Mermaid**
- Supprimer les fichiers `.gitkeep` d'un répertoire dès qu'il contient de vrais fichiers
<!-- END PBM-WORKFLOW -->
# juju-aviatrice

## Objectif du projet

Application d'entraînement pour aider **Juju** (fille du porteur du projet, en classe de **1ère générale, spécialités scientifiques**) à préparer les épreuves de sélection pour intégrer une formation de **pilote de ligne**.

Juju est impliquée dans le projet : les décisions de contenu, d'ergonomie et de format sont co-construites avec elle.

## Profil de Juju

- **Scolarité** : 1ère générale, spécialités scientifiques (maths, physique-chimie).
- **Expérience de vol** : Juju est en cours de formation **PPL** (Private Pilot License / Licence de Pilote Privé EASA) — obtention prévue dans les prochains mois (courant 2026). Elle aura donc des **heures de vol réelles en solo et en double commande** au moment des épreuves de sélection.
  - Implications à garder en tête : la PPL est un **atout fort** pour la motivation/les oraux et témoigne d'un engagement concret dans le projet pilote. Elle ne change pas la filière d'entrée (Juju reste candidate **EPL/S** à l'ENAC, qui ne requiert pas d'expérience préalable), mais elle peut faciliter certains tests psychomoteurs et donne un vocabulaire aéronautique déjà acquis.
  - À ne pas confondre avec CPL/ATPL : la PPL **ne permet pas** l'accès à la filière ENAC EPL/P (qui exige CPL + théorie ATPL).

## Formations visées

Les concours / programmes ciblés pour calibrer le contenu :

- **ENAC — EPL** (École Nationale de l'Aviation Civile, filière Élève Pilote de Ligne)
- **Cadets Air France**
- **Autres programmes cadets** de compagnies aériennes d'Europe de l'Ouest (Lufthansa, KLM, etc.)

## Priorités de contenu

L'application doit d'abord couvrir :

1. **Révision maths & physique** — au niveau attendu aux épreuves scientifiques de ces concours
2. **Tests psychotechniques** — logique, mémoire, calcul mental, représentation spatiale, attention partagée (format QCM/chronométré typique des sélections pilote)

D'autres axes (anglais aéronautique, culture aéro, préparation aux oraux…) pourront être ajoutés plus tard si besoin.

## Format technique

**Stack arrêtée** (phase Design — 13 ADR) : monorepo fullstack TypeScript avec Hono + tRPC (backend), React + Vite (frontend SPA), SQLite + Drizzle (BDD). Détail complet dans les [ADR](docs/03-design/2-architecture/adr/).

Le code de l'app vit dans [apps/](apps/) et [packages/](packages/) (cf. `pbm_code_roots` dans `_bmad/pbm/config.yaml`).

## Structure du repository

Le projet produit deux artefacts indépendants. **Toujours raisonner en gardant cette dualité en tête** :

| Territoire | Rôle | Public |
|---|---|---|
| [wiki/](wiki/) | Base documentaire **domaine** (formations, épreuves, prérequis pilote) — publiée sur Cloudflare Pages | Juju et son père, en lecture |
| [apps/](apps/) + [packages/](packages/) | Code de l'**app d'entraînement** (maths, physique, psychotechniques) | Juju, en utilisation |

Et trois territoires de pilotage produit :

| Territoire | Rôle | Pilote |
|---|---|---|
| [cadrage-brouillon/](cadrage-brouillon/) | Notes brutes de discovery (entretien Juju, prochaines étapes, questions ouvertes) — **pré-PBM**, matière première | Humain |
| [docs/](docs/) | Artefacts produit **structurés** générés par PBM, organisés par phase (`strategy/`, `discovery/`, `design/`, `plan/`, `run/`, `proposals/`) | PBM |
| [_bmad/](_bmad/) + [_bmad-output/](_bmad-output/) | Module PBM installé + outputs transitoires (brainstorming, etc.) — gitignoré | PBM |

Règles à respecter :

- Ne **jamais** mélanger contenu wiki (`wiki/`) et artefacts produit (`docs/`) : ce sont deux sources de vérité différentes pour deux audiences différentes.
- Le wiki décrit **le métier de pilote** (savoir externe). Les artefacts PBM décrivent **l'app qu'on construit pour Juju** (savoir produit interne).
- Les notes de [cadrage-brouillon/](cadrage-brouillon/) doivent être consultées avant tout lancement de `/pbm-discovery` ou `/pbm-strategy` — elles contiennent les besoins exprimés par Juju et ne doivent pas être perdus dans la traduction PBM.

## État d'avancement & prochaines étapes

Phases PBM : **Strategy → Discovery → Design → Plan → Implementation → Run**.

| Phase | Statut | Livrables attendus |
|---|---|---|
| Setup repo & wiki | ✅ Fait | Wiki déployé, Giscus actif, cadrage initial collecté |
| 1. Strategy | ✅ Fait | `docs/01-strategy/` : vision-produit, OKRs, initiatives, glossaire |
| 2. Discovery | ✅ Fait | `docs/02-discovery/` : product-brief, personas, journeys |
| 3. Design | ✅ Fait | `docs/03-design/` : exigences, domaine DDD, wireframes, API, 13 ADR |
| 4. Plan | ✅ Fait | `docs/04-plan/` : 10 features, 48 stories, definition of done |
| 5. **Implementation (build)** | ⏳ En cours | Code dans `apps/`, CI/CD, tests — F1 Infra en cours |
| 6. Run | ⏳ À venir | `docs/06-run/` : observabilité, runbooks, support |

À chaque démarrage de session, vérifier où en est le projet en regardant le contenu de [docs/](docs/) (présence/absence de sous-dossiers et fichiers).

## Base documentaire de référence

Une base documentaire complète sur les formations pilote de ligne visées par Juju se trouve dans [wiki/](wiki/) (publié sur Cloudflare Pages). Elle doit être consultée comme **contexte de référence** pour toute discussion sur le contenu de l'application, l'ordre de priorité des sujets, les épreuves ciblées, etc.

Points d'entrée utiles :

- [wiki/README.md](wiki/README.md) — Index général et priorités pour Juju
- [wiki/formations/comparatif.md](wiki/formations/comparatif.md) — Tableau comparatif des voies
- [wiki/formations/01-enac-epl.md](wiki/formations/01-enac-epl.md) — Cible prioritaire (ENAC EPL/S)
- [wiki/formations/02-air-france-cadets.md](wiki/formations/02-air-france-cadets.md) — Autre cible prioritaire
- [wiki/epreuves/scientifiques-maths-physique.md](wiki/epreuves/scientifiques-maths-physique.md) — Contenu maths/physique à réviser
- [wiki/epreuves/psychotechniques.md](wiki/epreuves/psychotechniques.md) — Tests à entraîner

Cette base est un instantané d'avril 2026 : les conditions de sélection et tarifs évoluent chaque année. Les sources officielles à revérifier sont listées dans [wiki/sources.md](wiki/sources.md).

## Cadrage produit (matière brute)

Les notes de cadrage avec Juju (interview besoins, prochaines étapes, questions ouvertes) sont dans [cadrage-brouillon/](cadrage-brouillon/). Ce sont des **brouillons internes**, non publiés, destinés à alimenter les workflows PBM (`/pbm-discovery`, `/pbm-strategy`).

## Artefacts produit (PBM)

Le module PBM ([_bmad/pbm/README.md](_bmad/pbm/README.md)) écrit ses livrables dans [docs/](docs/) organisés par phase : `docs/01-strategy/`, `docs/02-discovery/`, `docs/03-design/`, `docs/04-plan/`, `docs/06-run/`, `docs/99-proposals/`. Les préfixes numériques rendent la chronologie des phases visible dans l'arborescence ; on saute le `05-` car la phase 5 (Implementation) vit dans [apps/](apps/) et [packages/](packages/). Ces sous-répertoires sont créés au premier lancement de chaque skill PBM.

## Ton & posture

- Le projet est **personnel et familial** : la motivation est d'aider Juju concrètement, pas de bâtir un produit générique.
- Rester **pragmatique** : privilégier ce qui est directement utile à sa préparation, éviter la sur-ingénierie.
- Quand l'intention d'une décision n'est pas claire, **demander** plutôt que supposer — ce projet est en phase de cadrage.

## Conventions de rédaction `docs/`

Les artefacts PBM dans `docs/` sont chargés en contexte par Claude Code. **Rédiger de manière synthétique** pour limiter l'empreinte sur la fenêtre de contexte, sans perdre d'information :

- **Prose concise** : resserrer les formulations, supprimer les mots inutiles.
- **Tables et listes inline** plutôt que paragraphes verbeux ou listes à puces longues.
- **Renvois plutôt que répétitions** : si une information existe déjà dans un autre doc, y référer au lieu de la dupliquer.
- **Journeys compacts** : chaque étape en un seul paragraphe dense (pas de format 4 lignes Action / Système / Émotion / Touchpoint séparées). Pas de table Touchpoints ni de diagramme courbe émotionnelle séparés — intégrer l'essentiel dans les étapes.
- **Sections redondantes** : supprimer toute section dont le contenu est intégralement couvert par un autre fichier du même livrable.
- **Toujours conserver la section Traçabilité** en fin de document — c'est le graphe de dépendances entre livrables.
- **Codes et abréviations lisibles** : utiliser des codes (ex. « Pilier 1 », « KR-1.0.1 ») mais éviter les raccourcis ambigus qui risquent la confusion avec une autre codification (ex. ne pas écrire « P1 » pour un pilier — pourrait être confondu avec une priorité).

## Conventions Markdown

La doc du projet est rendue par plusieurs parsers (MkDocs Material, export PDF, aperçu IDE). Certains sont stricts sur l'espacement autour des blocs. **À respecter systématiquement lors de toute création ou modification de `.md`** :

- **Ligne vide avant toute liste** lorsque la ligne précédente n'est pas vide et n'est pas elle-même une puce. Cela inclut :
  - une liste qui suit un titre (`#`, `##`, `###`…),
  - une liste qui suit un pseudo-titre en gras (`**Section**`),
  - une liste qui suit un paragraphe terminé par `:`.
- **Ligne vide après une liste** avant tout nouveau paragraphe ou titre (même règle, symétrique).
- **Ligne vide autour des blocs** : titres, blocs de code, citations, tableaux — toujours isolés par une ligne vide au-dessus et en dessous.

Règle mémo : *si ce n'est pas une continuation de liste, une ligne vide sépare.* En cas de doute, ajouter la ligne vide.
