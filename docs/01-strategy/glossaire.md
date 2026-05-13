# Glossaire stratégique — juju-aviatrice

> Termes de haut niveau utilisés en Strategy. Le **langage ubiquitaire DDD** (chapitre, exercice, format…) sera produit en phase Design.
> **2026-05-13** — Thomas (Papa) avec Claude

## Acteurs

| Terme | Définition |
|---|---|
| **Juju** | Utilisatrice unique. 1ère générale spé maths + physique-chimie. En formation PPL (obtention prévue 2026). Profil **gameuse**. |
| **Thomas / Papa** | Porteur du projet. Construit le produit pour Juju. |
| **ENAC** | École Nationale de l'Aviation Civile (Toulouse). Opère la filière EPL/S. |
| **Air France — Cadets** | Programme cadets AF, sélection scientifique + psy. |
| **Compagnies européennes** | Luxair, KLM, BA, Lufthansa, easyJet… — programmes cadets à sélection principalement psy. |
| **DLR** | _Deutsches Zentrum für Luft- und Raumfahrt_ — batteries de tests psy pour Lufthansa et compagnies européennes. |
| **Yvan Monka / Pierre Olivier** | Chaînes YouTube maths / physique utilisées par Juju. Curation prévue en M2. |

## Formations cibles

| Terme | Définition |
|---|---|
| **EPL/S** | Filière ENAC ouverte sans CPL. **Cible principale.** |
| **EPL/P** | Filière ENAC réservée CPL + ATPL. **Hors-scope** (PPL insuffisante). |
| **Cadets AF** | Programme cadets Air France. Cible concours. |
| **Écoles psy européennes** | Programmes cadets compagnies européennes à sélection psy. Voie préférée par Juju (entretien 11/04/2026). |

## Concepts stratégiques

| Terme | Définition |
|---|---|
| **Compagnon d'entraînement** | Positionnement produit : ni soutien scolaire, ni prépa intensive. Outil personnalisé dual-usage école + concours. |
| **Dual-usage** | Chaque session sert école (contrôles/bac) **et** concours pilote simultanément. |
| **4 niveaux scientifiques** | 1ère → Terminale → Post-bac (psy européennes) → ENAC PCSI/MPSI. |
| **Règle d'or** | « Ne jamais décourager » — règle UX absolue (Juju, 11/04/2026). Interdit messages culpabilisants, scores stigmatisants, leaderboards. |
| **Engagement par le jeu** | Pilier 4 : avatar, déblocages, célébration. Jamais compétition ni pression sociale. |
| **Ouverture multi-concours** | Pilier 5 : garde-fou transverse, pas de spécialisation par école avant M3. |
| **Tensions à acter** | Décisions parentales divergentes des préférences de Juju (maths > psy ; périmètre élargi). À revisiter au 1er prototype. |
| **Milestone produit** | M0 (prototype validable), M1 (MVP complet), M2 (MVP+), M3 (prépa concours). Pas de dates fixes. M0 valide les hypothèses avant d'investir dans M1. |
| **Skill `juju-entretien-jalon`** | Skill Claude Code conversationnel pour mesurer les KRs qualitatifs à chaque jalon. Instancié en `juju-entretien-m0` puis `juju-entretien-m1`. |

## Réglementation

| Terme | Définition |
|---|---|
| **BO** | Bulletin Officiel de l'Éducation nationale. Source de vérité pour les programmes 1ère. |
| **PCSI / MPSI** | Classes prépa scientifiques. Niveau visé en M3 pour ENAC EPL/S. |
| **EASA** | Agence européenne de sécurité aérienne. Émet la PPL. |
| **PPL** | Licence de pilote privé EASA. Atout pour motivation/oraux, sans effet sur éligibilité EPL/S. |
| **CPL / ATPL** | Licences professionnelles. Nécessaires pour EPL/P uniquement (hors-scope). |

## Tests psychotechniques

| Terme | Définition |
|---|---|
| **Psychotechniques** | Tests d'aptitude : logique, mémoire, calcul mental, spatial, attention, psychomoteur. MVP : **logique + calcul mental**. |
| **PILAPT** | Batterie psy commerciale (compagnies européennes). Pas de calibrage avant M3. |
| **DLR-Test** | Batterie DLR (Lufthansa). Pas de calibrage avant M3. |
| **PSY Air France** | Tests psy Cadets AF. Calibrage différé en M3. |

## Framework PBM

| Terme | Définition |
|---|---|
| **PBM** | Product Builder Method — 6 phases : Strategy → Discovery → Design → Plan → Implementation → Run. |
| **OKR** | Objectives & Key Results. Structure les milestones M1/M2/M3. |
| **KR** | Key Result — quantitatif ou qualitatif (via skill entretien). |
| **Initiative** | Action concrète rattachée à un KR. Priorisée MoSCoW, dépendances explicites. |
| **MoSCoW** | Must / Should / Could / Won't. |
| **ADR** | Architecture Decision Record. Stack (web/mobile/PWA) tracée en phase Design. |
| **DDD** | Domain-Driven Design — langage ubiquitaire à structurer en phase Design. |

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| Vision produit | [vision-produit.md](vision-produit.md) |
| OKRs | [okrs.md](okrs.md) |
| Initiatives | [initiatives.md](initiatives.md) |
| Cadrage initial | [cadrage-brouillon/besoins-juju.md](../../cadrage-brouillon/besoins-juju.md) |
| Base documentaire formations | [wiki/](../../wiki/) |
| Profil utilisatrice (gameuse) | Mémoire `project_juju_profile.md` |
