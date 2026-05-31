# Bilan technique — F3 Parcours de bienvenue

> **Date** : 2026-05-25 — Thomas (Papa) avec Claude

## Résumé

Parcours d'onboarding en 3 étapes (bienvenue, piliers, flashcard) avec saut et tolérance aux interruptions. Arrivée sur l'écran d'accueil FO-04 avec avatar et suggestion d'activité.

## Stories livrées

| Story | Type | Points | Statut |
|-------|------|--------|--------|
| S1 — Écran de bienvenue personnalisé (FO-01) | US | 2 | Terminée |
| S2 — Présentation des deux piliers (FO-02) | US | 2 | Terminée |
| S3 — Flashcard d'échantillon maths (FO-03) | US | 2 | Terminée |
| S4 — Saut et interruption de l'onboarding | US | 2 | Terminée |
| S5 — Écran d'accueil récurrent (FO-04) | US | 3 | Terminée |

**Total** : 5/5 stories — 11 points

## Dette technique — Testabilité

Lacunes identifiées lors de l'audit de testabilité (basé sur [_test-protocol-template.md](_test-protocol-template.md)). **Toutes résolues** le 2026-05-25 (commit `5a3a2af`).

| Item | Problème | Résolution |
|------|----------|------------|
| Script de remise à zéro | Le testeur doit manuellement supprimer `device-id` du localStorage et gérer les volumes Docker | ✅ `pnpm reset:onboarding` — supprime les enregistrements d'onboarding en DB via Drizzle |
| Build explicite au setup | `docker compose up` sans `--build` risque d'utiliser une image obsolète | ✅ `pnpm dev` inclut `--build` par défaut |
| Purge volumes | Pas de commande unique pour repartir d'un état vierge | ✅ `pnpm dev:clean` — `docker compose down -v && docker compose up --build` |

## Revue de code (2026-05-31)

Auto-revue DDD / tests / conventions / design system / DoD. Qualité de base saine : Biome + `tsc` verts, **0 couleur en dur** (100% design tokens, identiques à la source), layouts FO-01→FO-04 conformes aux wireframes, charte de ton respectée (feedback flashcard neutre, aucun message culpabilisant). Écarts traités :

| # | Sévérité | Écart | Résolution |
|---|----------|-------|------------|
| M1 | Moyenne | `onComplete()` appelé pendant le render de `OnboardingFlow` (setState parent → avertissement React) | ✅ Déplacé dans un `useEffect` |
| M2 | Moyenne | Critères Gherkin S1–S5 non couverts par des tests frontend (aucun test d'écran) | ✅ 13 tests ajoutés (`WelcomeScreen`, `PiliersScreen`, `OnboardingFlashcard`, `HomeScreen`) — web : 10 → 23 tests |
| M3 | Moyenne | `PiliersScreen` codait les piliers en dur ; `contenu.listerPiliers` (implémenté) inutilisé → contenu dupliqué | ✅ Écran branché sur `trpc.contenu.listerPiliers` ; source de vérité unique |

Écarts mineurs **acceptés en l'état pour M0** (non bloquants) :

- **B1** — `contenu.obtenirFlashcardEchantillon` en `publicProcedure` (vs `protected` ailleurs). Écran derrière `DeviceGuard` ; à harmoniser ultérieurement.
- **B2** — `avancerEtape` ne valide pas la séquence d'étapes côté serveur (confiance au client). Acceptable M0.
- **B3** — Événement `onboarding_complete` non émis ; micro-progression avatar simulée côté front. **Dette tracée** : à câbler avec F8 (progression).
- **B4** — `findByDeviceId` dupliqué dans les 3 repositories onboarding (choix vertical-slice).

État final : lint ✓, typecheck ✓, **55 tests passants** (32 API + 23 web).

## Clôture (2026-05-31)

| Métrique | Planifié | Réalisé |
|----------|----------|---------|
| Stories | 5 | 5 (100 %) |
| Points | 11 | 11 |
| Tests | — | 55 verts (32 API + 23 web) |

**Critère de complétion** : ✅ Atteint — première ouverture → « Salut Juju » sans inscription, 2 piliers, flashcard maths à feedback neutre, avatar stade 1 + micro-progression, arrivée FO-04, parcours sauteable et tolérant aux interruptions.

| Porte qualité | Valeur | Statut |
|---------------|--------|--------|
| Erreurs lint (Biome) | 0 | ✅ |
| Typecheck (`tsc`) | 0 erreur | ✅ |
| CI | Verte (run sur `9051b5e`) | ✅ |
| CD / déploiement prod | Vert (`gitSha 9051b5e` en prod) | ✅ |
| Vérification prod | Walkthrough FO-01→FO-04 OK (Papa) | ✅ |

**Dette reportée** (à reprendre hors F3) :

- **B3 → F8** : émission de l'événement `onboarding_complete` + micro-progression avatar réelle (aujourd'hui simulée côté front). À câbler lors de F8 (Avatar & Progression).
- **B1, B2, B4** : harmonisations mineures acceptées pour M0 (cf. section Revue de code), sans story dédiée.

**Reste différé par dépendance** : S5 — navigation `Go → session (F4)` et `Changer → FO-09` (écrans non encore construits). À brancher quand F4 sera livrée.

**Points d'attention pour la suite :**

1. Estimation S → calibrage juste : 5 stories S/M livrées sans dépassement, aucune story non terminée.
2. La dette B3 crée un couplage F3↔F8 : penser à rejouer le parcours onboarding lors de F8 pour valider la progression réelle de l'avatar.
3. Prochaine feature selon le planning : **F5 — Catalogue scientifique** (dépendances F1+F2 satisfaites), parallélisable.

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| Feature F3 | [f3-feature-onboarding-bienvenue.md](f3-feature-onboarding-bienvenue.md) |
| Protocole de test | [f3-test-protocol.md](f3-test-protocol.md) |
| Template test | [_test-protocol-template.md](_test-protocol-template.md) |
| Feature F2 (auth device) | [f2-feature-auth-device.md](f2-feature-auth-device.md) |
| Feature F1 (infra) | [f1-feature-infra-stack.md](f1-feature-infra-stack.md) |
