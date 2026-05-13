# Glossaire stratégique — juju-aviatrice

> Termes de haut niveau utilisés en Strategy : acteurs, formations cibles, réglementation, concepts stratégiques, vocabulaire framework. Le **langage ubiquitaire DDD** (chapitre, exercice, format, banque, score, suivi…) sera produit en phase Design et complétera ce glossaire sans le redondancer.
>
> **Date** : 2026-05-13 — **Auteur** : Thomas (Papa) avec assistance Claude

## Acteurs et parties prenantes

| Terme | Définition |
|---|---|
| **Juju** | Utilisatrice unique du produit. Lycéenne en **1ère générale spécialités scientifiques** (spé maths + spé physique-chimie). En cours de formation **PPL** (obtention prévue courant 2026). Profil **gameuse** — trait UX clé pour l'engagement par le jeu (pilier 4). |
| **Thomas / Papa** | Porteur du projet et parent. Construit le produit pour Juju ; décide en autonomie tant qu'aucun choix n'engage la cible (les tensions sont actées et seront représentées à Juju quand un prototype sera prêt). |
| **ENAC** | École Nationale de l'Aviation Civile (Toulouse). Opère la filière **EPL/S** (cible concours principale). |
| **Air France — Cadets** | Programme cadets opéré par Air France, sélection scientifique + psychotechnique exigeante. Cible concours. |
| **Compagnies européennes (Luxair, KLM, BA, Lufthansa, easyJet, …)** | Opérateurs de programmes cadets dont la sélection repose principalement sur les psychotechniques. Voie initialement préférée par Juju lors de l'entretien du 11/04/2026. |
| **DLR** | _Deutsches Zentrum für Luft- und Raumfahrt_ — institut allemand qui opère des batteries de tests psy utilisées par Lufthansa et plusieurs compagnies européennes. |
| **Yvan Monka / Pierre Olivier** | Auteurs de chaînes YouTube éducatives (maths / physique) utilisés spontanément par Juju. **Ressources externes de référence** pour la curation prévue en M2. |

## Formations et concours cibles

| Terme | Définition |
|---|---|
| **EPL/S** | _Élève Pilote de Ligne / Sélection_ — filière ENAC ouverte aux candidats sans CPL. **Cible concours principale** du projet. |
| **EPL/P** | _Élève Pilote de Ligne / Professionnel_ — filière ENAC réservée aux titulaires CPL + théorie ATPL. **Hors-scope** (la PPL de Juju ne donne pas accès à cette voie). |
| **Cadets Air France** | Programme cadets d'Air France. Sélection scientifique + psychotechnique. Cible concours. |
| **Écoles psy européennes** | Raccourci désignant les programmes cadets de compagnies européennes (Luxair, KLM, BA, Lufthansa, easyJet…) dont la sélection est principalement psychotechnique. Cibles concours. |

## Concepts stratégiques

| Terme | Définition |
|---|---|
| **Compagnon d'entraînement** | Positionnement du produit : ni soutien scolaire générique, ni prépa concours intensive. Outil personnalisé qui sert l'école au quotidien **et** la prépa concours en simultané. |
| **Dual-usage école + concours** | Différenciateur clé : chaque session investie sert deux buts à la fois (contrôles/bac + concours pilote). Sécurise l'engagement quotidien en s'appuyant sur une utilité immédiate. |
| **4 niveaux scientifiques** | Échelle de progression du pilier 1 : **1ère → Terminale → Post-bac (écoles psy européennes) → ENAC PCSI/MPSI**. Le contenu monte avec Juju, jamais l'inverse. |
| **Règle d'or « ne jamais décourager »** | Règle UX absolue exprimée par Juju (entretien 11/04/2026). Incarne le pilier 3 : interdit messages culpabilisants, scores stigmatisants, leaderboards. |
| **Engagement par le jeu** | Pilier 4 : aligner les mécaniques de progression avec le terrain naturel de Juju (gameuse). S'appuie sur avatar progressif, déblocages, célébration positive — **jamais** sur la compétition ou la pression sociale. |
| **Ouverture multi-concours** | Pilier 5 : garde-fou transverse qui interdit toute spécialisation prématurée par école. Aucun contenu ne doit être propre à une école unique tant que Juju n'a pas tranché sa voie cible (cible : M3). |
| **Tensions à acter** | Décisions parentales prises en s'écartant des préférences explicites de Juju (priorité maths > psy ; périmètre élargi à ENAC/AF). À revisiter avec Juju au premier prototype. |
| **Milestone produit** | Unité de planification retenue **à la place des trimestres calendaires** : M1 (MVP), M2 (MVP+), M3 (prépa concours assumée). Pas de dates fixes — horizon itératif. |
| **Skill `juju-entretien-jalon`** | Outil de mesure qualitative dédié au projet. Skill Claude Code conversationnel qui entretient Juju à chaque jalon pour évaluer les KRs qualitatifs (ressenti des messages, baisse de la peur, envie de revenir). Premier exemplaire : `juju-entretien-m1` (initiative I-3.1.5). |

## Réglementation et programmes officiels

| Terme | Définition |
|---|---|
| **BO (Bulletin Officiel)** | Référentiel de l'Éducation nationale qui définit les programmes officiels de l'enseignement secondaire en France. Source de vérité pour la couverture **1ère spé maths** et **1ère spé physique-chimie** (KR-1.1.1, KR-1.1.2). |
| **1ère générale — spé maths** | Programme officiel de 1ère, spécialité mathématiques. Périmètre couvert dans le MVP (M1). |
| **1ère générale — spé physique-chimie** | Programme officiel de 1ère, spécialité physique-chimie. Périmètre couvert dans le MVP (M1). |
| **PCSI / MPSI** | _Physique-Chimie-Sciences de l'Ingénieur_ / _Mathématiques-Physique-Sciences de l'Ingénieur_ — classes prépa scientifiques. Niveau visé en M3 pour aligner sur les épreuves ENAC EPL/S. |
| **EASA** | _European Union Aviation Safety Agency_ — agence européenne. Émet la PPL et les licences pilote européennes. |
| **PPL** | _Private Pilot License_ — licence de pilote privé EASA. Juju est en cours de formation PPL (obtention prévue courant 2026). **Atout fort** pour la motivation et les oraux ; sans effet sur l'éligibilité EPL/S (qui ne requiert pas d'expérience préalable). |
| **CPL / ATPL** | _Commercial Pilot License_ / _Airline Transport Pilot License_ — licences professionnelles. À ne pas confondre avec PPL ; nécessaires uniquement pour la filière EPL/P (hors-scope). |

## Tests psychotechniques

| Terme | Définition |
|---|---|
| **Psychotechniques** | Famille de tests d'aptitude évalués aux sélections pilote : **logique, mémoire, calcul mental, représentation spatiale, attention partagée, psychomoteur**. Cible MVP : **logique + calcul mental** uniquement (M1). |
| **PILAPT** | _Pilot Aptitude Test_ — batterie de tests psy commerciale utilisée par plusieurs compagnies européennes. Pas de calibrage propre PILAPT en MVP ; ouverture multi-concours (pilier 5) interdit la spécialisation par école avant M3. |
| **DLR-Test** | Batterie de tests opérée par le DLR (cf. acteurs). Utilisée notamment par Lufthansa. Même politique de non-spécialisation que PILAPT en M1/M2. |
| **PSY Air France** | Tests psychotechniques propres à la sélection Cadets Air France. Calibrage différé en M3. |

## Framework PBM

| Terme | Définition |
|---|---|
| **PBM** | _Product Builder Method_ — module du framework BMAD utilisé dans ce projet. Pilote la construction produit en 6 phases : Strategy → Discovery → Design → Plan → Implementation → Run. |
| **OKR** | _Objectives & Key Results_ — paire d'un objectif qualitatif et de ses indicateurs mesurables. Structure les milestones M1/M2/M3. |
| **KR** | _Key Result_ — indicateur mesurable rattaché à un Objective. Peut être quantitatif (couverture, comptage, test fonctionnel) ou **qualitatif consigné** (via le skill `juju-entretien-jalon`). |
| **Initiative** | Action concrète qui contribue à atteindre un KR. Priorisée **MoSCoW** ; rattachée à un OKR ; possède des dépendances explicites. |
| **MoSCoW** | Cadre de priorisation : **Must** (indispensable au milestone) / **Should** (important non bloquant) / **Could** (souhaitable si capacité) / **Won't** (explicitement écarté du milestone). |
| **ADR** | _Architecture Decision Record_ — document qui trace une décision technique structurante et son rationnel. Le choix de stack (web / mobile / PWA) sera tracé dans un ADR produit en phase Design (initiative I-T.1). |
| **DDD** | _Domain-Driven Design_ — approche de modélisation qui produit un **langage ubiquitaire** partagé entre métier et code. Sera structuré en phase Design ; ce glossaire stratégique en est l'amorce haut niveau. |

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| Vision produit (Ultimate Goal, piliers, MVP, tensions) | [vision-produit.md](vision-produit.md) |
| OKRs (Objectives, KRs, milestones produit, skill d'entretien) | [okrs.md](okrs.md) |
| Initiatives (priorisation MoSCoW, dépendances) | [initiatives.md](initiatives.md) |
| Cadrage initial (acteurs, vocabulaire de Juju) | [cadrage-brouillon/besoins-juju.md](../../cadrage-brouillon/besoins-juju.md) |
| Base documentaire formations et tests | [wiki/](../../wiki/) (Cloudflare Pages) |
| Profil utilisatrice (gameuse) | Mémoire `project_juju_profile.md` |
