# Vision produit — juju-aviatrice

> Document de référence pour la phase Strategy. Cadre toutes les phases aval (Discovery, Design, Plan, Implementation, Run).
>
> **Date** : 2026-05-06 — **Auteur** : Thomas (Papa) avec assistance Claude

## Ultimate Goal

> **Permettre à Juju de transformer sa peur des concours pilote en confiance, en construisant ses réflexes scientifiques et psychotechniques jour après jour.**

L'enjeu n'est pas seulement de la préparer techniquement aux épreuves : c'est de désarmer la peur qu'elle a exprimée pendant l'entretien du 11 avril 2026, en lui donnant un outil qui la fait progresser visiblement, sans jamais la décourager.

## Positionnement

**Ni soutien scolaire générique, ni prépa concours intensive.** Un compagnon personnalisé qui sert d'abord l'école au quotidien (programme officiel actuel) et étend progressivement vers le niveau concours, en gardant l'engagement vivant grâce à une expérience **bienveillante par design** et alignée avec le terrain naturel de Juju (gameuse).

**Différenciateurs clés** :

- **Dual-usage école + concours** — Utile dès aujourd'hui pour les contrôles de 1ère, pas seulement pour un objectif lointain. Chaque session investie sert deux buts à la fois.
- **Progression sur 4 niveaux** — 1ère → Terminale → Post-bac (écoles psy européennes) → ENAC (PCSI/MPSI). Le contenu monte avec Juju, jamais l'inverse.
- **Bienveillant par design** — Règle d'or « ne jamais décourager » incarnée dans toutes les mécaniques : suivi minimaliste, scoring non-stigmatisant, formulations positives.
- **Engagement par le jeu** — Avatar progressif, déblocages, célébration des avancées : aligne avec le profil gameuse de Juju, pas plaqué contre.
- **Adaptable aux contextes** — 15 min en semaine sur téléphone (fatigue, soir) vs sessions longues le week-end sur ordi. Deux modes natifs, pas un compromis bancal.
- **Multi-formats** — Exercices de recherche (compréhension profonde), flashcards (ancrage des formules), QCM chronométrés (conditions concours). Chaque format sert un usage précis.

## Piliers stratégiques

### 1. Scientifique multi-niveaux

Couvrir maths + physique du programme officiel actuel jusqu'au niveau ENAC, par paliers gradués sur **4 niveaux** : **1ère** (point de départ, programme actuel) → **Terminale** (anticipation rentrée septembre 2026) → **Post-bac généraliste** (cible écoles psy européennes type Luxair, Lufthansa DLR) → **ENAC PCSI/MPSI** (cible ENAC EPL/S).

Bénéfice immédiat : aide pour les contrôles et le bac. Bénéfice long terme : prépa concours scientifique. La même session sert les deux à la fois.

### 2. Psychotechnique démystifié

Désarmer la peur de Juju face à ces tests qu'elle ne connaît pas (« je n'ai aucune idée de ce que sont les tests psychotechniques »). Méthode en 3 temps :

1. **Comprendre** — explications claires de ce qu'est chaque type de test, ce qu'il évalue, comment l'aborder
2. **S'entraîner progressivement** — sans chronomètre d'abord, pour acquérir la méthode
3. **Conditions réelles** — QCM chronométré in fine, pour habituer aux conditions concours

### 3. UX bienveillante

Incarner la règle d'or **« ne jamais décourager »** dans chaque détail de l'interface :

- Suivi simple (pas de graphiques anxiogènes ni de leaderboards)
- Scoring non-stigmatisant (pas de « note sur 20 » qui flippe)
- Formulations qui valorisent l'effort et le progrès, jamais l'échec
- Adaptation native aux deux modes de session (15 min vs sessions longues)
- Pas de friction superflue (chargement rapide, navigation évidente)

### 4. Engagement par le jeu

Aligner les mécaniques de progression avec le **terrain naturel de Juju, gameuse**. L'engagement n'est pas obtenu par culpabilisation ou pression, mais par les ressorts qu'elle apprécie déjà dans ses jeux :

- **Avatar progressif** qui évolue visiblement avec le travail accompli
- **Déblocages** de contenu, de niveaux, de formats au fil des progrès
- **Célébration positive** des avancées (jamais de réprimande des absences)
- **Streaks doux** : encourager la régularité sans punir les ruptures

Limite explicite : **pas de gamification compétitive ni de pression sociale.** L'objectif est l'auto-progression, pas la comparaison.

### 5. Ouverture multi-concours

Garder ouvertes en parallèle les voies **psy européennes (Luxair, KLM, BA, Lufthansa, easyJet…) + ENAC EPL/S + Cadets AF** sans trancher prématurément. Le contenu doit servir chacune de ces voies — c'est le rôle du calibrage 4 niveaux du pilier 1 et de la palette élargie de psychotechniques (à terme) du pilier 2.

> **Note** : ce pilier formalise une **décision parentale assumée** — voir section « Tensions à acter » plus bas.

## Périmètre MVP

### Inclus

- **Pilier 1 (Scientifique)** : programme officiel **1ère générale spé maths + spé physique-chimie**, dans tous les formats (exercices de recherche + flashcards + QCM chronométré). Niveau 1 uniquement (1ère).
- **Pilier 2 (Psychotechnique)** : **1 à 2 types de tests** (proposition initiale : **logique + calcul mental**, conformément à `cadrage-brouillon/prochaines-etapes.md`), avec explications de méthode + entraînement progressif.
- **Pilier 3 (UX bienveillante)** : suivi simple (compteur d'exercices, indicateur d'avancement par chapitre), scoring non-stigmatisant, modes session courte (téléphone) et longue (ordi), navigation responsive.
- **Pilier 4 (Engagement par le jeu)** : avatar progressif basique (évolue avec le travail), déblocages de chapitres au fil de l'avancement.
- **Pilier 5 (Ouverture)** : implicite dans le MVP — le contenu choisi (programme 1ère + logique/calcul mental) sert toutes les voies cibles sans spécialisation prématurée.

### Exclus du MVP (MVP+ ultérieurs)

- **Niveaux Terminale / Post-bac / ENAC** pour maths/physique (à ajouter par paliers selon adoption et progression de Juju)
- **Autres types psychotechniques** : mémoire, représentation spatiale, attention partagée, tests psychomoteurs
- **Anglais** (hors scope global, confirmé par Juju et par décision projet)
- **Culture aéronautique** pour les oraux
- **Mode hors-ligne**
- **Vidéos intégrées** : on s'appuie d'abord sur les ressources YouTube externes que Juju utilise déjà (Yvan Monka pour les maths, Pierre Olivier pour la physique), via liens curés
- **Calibrage par école spécifique** : PILAPT vs DLR vs PSY Air France — différenciation différée jusqu'à ce que Juju ait choisi une voie principale
- **Mécaniques de game design avancées** : achievements complexes, économie virtuelle, customisation poussée d'avatar (le MVP a juste le strict nécessaire)

## Tensions à acter

> **Décision parentale assumée — à revisiter avec Juju quand le premier prototype sera prêt** (cf. `cadrage-brouillon/prochaines-etapes.md`, point n°4).

Deux décisions structurantes ont été prises par le porteur du projet (Papa) en s'écartant de ce que Juju a explicitement dit pendant l'entretien du 11 avril 2026 :

| Sujet | Ce que Juju a dit | Ce qui a été décidé | Rationnel |
|---|---|---|---|
| **Ordre des priorités** | Psychotechniques en n°1, maths/physique en n°2 | **Maths/physique en n°1, psychotechniques en n°2** | Le dual usage école + concours rend l'investissement maths/physique immédiatement utile, ce qui maintient l'engagement quotidien sans dépendre d'un objectif lointain |
| **Périmètre concours** | Préfère écoles psy européennes (« je ne me sens pas au niveau pour ENAC/AF ») | **Périmètre élargi : psy européennes + ENAC EPL/S + Cadets AF** | Ne pas fermer prématurément les portes ; la PPL en cours, le travail sur 4 niveaux et un horizon de 12-24 mois rendent l'ENAC/AF accessible si Juju progresse |

**Action prévue** : présenter ces décisions à Juju quand le premier prototype sera testable (étape 4 du plan dans `cadrage-brouillon/prochaines-etapes.md`), pour qu'elle valide ou réoriente sur la base d'une expérience concrète plutôt qu'en abstrait.

## Périmètre futur (au-delà du MVP)

Sans engagement de calendrier (horizon itératif retenu), les axes d'élargissement prévisibles :

- **Maths/physique niveau Terminale** dès la rentrée septembre 2026 (anticipation programme officiel)
- **Maths/physique niveaux Post-bac et ENAC** au fil de la progression de Juju et de la clarification de sa cible concours
- **Élargissement psychotechniques** : mémoire, représentation spatiale, attention partagée, psychomoteur (alignement avec les tests des écoles cibles : PILAPT, DLR, PSY)
- **Calibrage par école** une fois la cible principale identifiée
- **Mode hors-ligne** si l'usage révèle un besoin
- **Module culture aéronautique** pour préparer les oraux (si la voie Cadets AF / ENAC se confirme)

---

## Traçabilité

| Dépendance | Référence |
|---|---|
| Notes brutes de cadrage | [cadrage-brouillon/besoins-juju.md](../../cadrage-brouillon/besoins-juju.md) |
| Étapes envisagées par le porteur | [cadrage-brouillon/prochaines-etapes.md](../../cadrage-brouillon/prochaines-etapes.md) |
| Questions ouvertes | [cadrage-brouillon/questions-ouvertes.md](../../cadrage-brouillon/questions-ouvertes.md) |
| Base documentaire formations cibles | [wiki/](../../wiki/) (publié sur Cloudflare Pages) |
| Profil utilisatrice (gameuse) | Confirmé par le porteur le 2026-05-06 (mémoire `project_juju_profile.md`) |
| Contexte projet et conventions | [CLAUDE.md](../../CLAUDE.md) |
