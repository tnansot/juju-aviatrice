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

**Stack non encore arrêtée.** Le choix (web, mobile, ou les deux) sera fait avec Juju en fonction de ses usages réels et de ses préférences. Ne pas présumer d'une stack tant que ce point n'est pas tranché — la décision sera prise et tracée pendant la phase **Design** de PBM (ADR architecture).

Par convention PBM, le code de l'app vivra dans [src/](src/) (cf. `pbm_code_roots` dans `_bmad/_config/custom/pbm/module.yaml`).

## Structure du repository

Le projet produit deux artefacts indépendants. **Toujours raisonner en gardant cette dualité en tête** :

| Territoire | Rôle | Public |
|---|---|---|
| [wiki/](wiki/) | Base documentaire **domaine** (formations, épreuves, prérequis pilote) — publiée sur Cloudflare Pages | Juju et son père, en lecture |
| [src/](src/) (à créer) | Code de l'**app d'entraînement** (maths, physique, psychotechniques) | Juju, en utilisation |

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
| 1. Strategy | ⏳ À lancer | `docs/strategy/` : vision-produit, OKRs, initiatives, glossaire |
| 2. Discovery | ⏳ À lancer | `docs/discovery/` : product-brief, personas, journeys |
| 3. Design | ⏳ À venir | `docs/design/` : exigences, domaine, wireframes, API, **ADR stack technique** |
| 4. Plan | ⏳ À venir | `docs/plan/` : features, stories, definition of done |
| 5. **Implementation (build)** | ⏳ À venir | Code dans `src/`, CI/CD, tests |
| 6. Run | ⏳ À venir | `docs/run/` : observabilité, runbooks, support |

**Préparation à la phase Build** : avant d'écrire la moindre ligne de code dans `src/`, faire passer le projet par Strategy → Discovery → Design → Plan. La phase Design tranchera la stack (ADR), la phase Plan structurera les features et stories. C'est seulement à la phase Implementation que `src/` sera scaffoldé.

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

Le module PBM ([_bmad/pbm/README.md](_bmad/pbm/README.md)) écrit ses livrables dans [docs/](docs/) organisés par phase : `docs/strategy/`, `docs/discovery/`, `docs/design/`, `docs/plan/`, `docs/run/`, `docs/proposals/`. Ces sous-répertoires sont créés au premier lancement de chaque skill PBM.

## Ton & posture

- Le projet est **personnel et familial** : la motivation est d'aider Juju concrètement, pas de bâtir un produit générique.
- Rester **pragmatique** : privilégier ce qui est directement utile à sa préparation, éviter la sur-ingénierie.
- Quand l'intention d'une décision n'est pas claire, **demander** plutôt que supposer — ce projet est en phase de cadrage.

## Conventions Markdown

La doc du projet est rendue par plusieurs parsers (MkDocs Material, export PDF, aperçu IDE). Certains sont stricts sur l'espacement autour des blocs. **À respecter systématiquement lors de toute création ou modification de `.md`** :

- **Ligne vide avant toute liste** lorsque la ligne précédente n'est pas vide et n'est pas elle-même une puce. Cela inclut :
  - une liste qui suit un titre (`#`, `##`, `###`…),
  - une liste qui suit un pseudo-titre en gras (`**Section**`),
  - une liste qui suit un paragraphe terminé par `:`.
- **Ligne vide après une liste** avant tout nouveau paragraphe ou titre (même règle, symétrique).
- **Ligne vide autour des blocs** : titres, blocs de code, citations, tableaux — toujours isolés par une ligne vide au-dessus et en dessous.

Règle mémo : *si ce n'est pas une continuation de liste, une ligne vide sépare.* En cas de doute, ajouter la ligne vide.
