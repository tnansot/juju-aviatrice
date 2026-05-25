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

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| Feature F3 | [f3-feature-onboarding-bienvenue.md](f3-feature-onboarding-bienvenue.md) |
| Protocole de test | [f3-test-protocol.md](f3-test-protocol.md) |
| Template test | [_test-protocol-template.md](_test-protocol-template.md) |
| Feature F2 (auth device) | [f2-feature-auth-device.md](f2-feature-auth-device.md) |
| Feature F1 (infra) | [f1-feature-infra-stack.md](f1-feature-infra-stack.md) |
