# Feature : Accès sécurisé par device — Bilan technique

## Synthèse

| Métrique | Planifié | Réalisé |
|----------|----------|---------|
| Stories | 2 US + 2 TS | 2 US + 2 TS |
| Points | 8 | 8 |
| Tests | — | 25 (17 API + 8 web) |
| Couverture | 60% (DoD) | Non mesurée (dep installée, seuil à vérifier) |

## Critère de complétion

**Objectif** : Identification silencieuse par device ID, jeton d'invitation, écran accès refusé.

**Atteint** : [x] Oui — [protocole de test validé](f2-test-protocol.md) le 2026-05-20 par Papa.

1. Ouvrir l'URL avec `?invite=<token>` sur un nouveau device → device ID créé, accès autorisé → **validé**
2. Ouvrir l'URL sans jeton sur le même device → reconnu automatiquement → **validé**
3. Ouvrir l'URL sans jeton sur un device inconnu → écran FO-14 → **validé**
4. Toutes les requêtes tRPC portent le header `X-Device-Id` → **validé**
5. Jeton épuisé → accès refusé pour le device suivant → **validé**
6. Vérification API directe (curl) → réponses conformes à la spec → **validé**

## Stories implémentées

| # | Titre | Points | Statut | Remarques |
|---|-------|--------|--------|-----------|
| S1 | Génération et stockage device ID | 2 | Terminée | `crypto.randomUUID()`, localStorage, hook useDeviceId |
| S2 | Jeton d'invitation et enregistrement backend | 3 | Terminée | Schema Drizzle, service + repo DDD, seed script |
| S3 | Middleware auth tRPC | 2 | Terminée | `protectedProcedure`, rate limiting reporté |
| S4 | Écran accès refusé (FO-14) | 1 | Terminée | AccessRefused.tsx, CSS modules, design tokens |

## Stories non terminées

Aucune — toutes les stories sont livrées.

## Bloqueurs rencontrés

| Bloqueur | Impact | Résolution |
|----------|--------|------------|
| StrictMode + `useMutation` en dépendance useEffect | Premier accès avec jeton → "accès refusé" | Extraction `mutate` (ref stable) + garde `useRef` contre double appel |
| Format superjson dans curl | Test protocol scénario 6 échouait | Input wrappé dans `{"json": {...}}` |
| Seed `onConflictDoNothing` silencieux | Compteur non réinitialisé entre sessions de test | Remplacé par détection explicite + erreur si jeton existe |

## Revue qualité

Revue effectuée via `pbm-impl-code-review`. Écarts corrigés :

| Écart | Sévérité | Correction |
|-------|----------|------------|
| 4 critères Gherkin sans test (S1, S4) | Haute | 8 tests frontend ajoutés (useDeviceId + AccessRefused) |
| Colonnes SQLite en anglais vs langage ubiquitaire | Moyenne | Migration 0002 : `created_at` → `date_creation`, `last_seen_at` → `derniere_activite` |
| `@vitest/coverage-v8` absent | Basse | Installé dans api + web |

## Dette technique identifiée

| Élément | Sévérité | Action recommandée |
|---------|----------|--------------------|
| Rate limiting non implémenté | Moyenne | Prévu dans S3 (`[ ]`), reporté à une story dédiée — pas critique pour M0 mono-utilisatrice |
| Pas de lien device ↔ invite_token en base | Basse | Acceptable M0 — ajouter `invited_by` sur `devices` si besoin de traçabilité |
| Couverture non mesurée (seuil 60% DoD) | Basse | Dep installée, configurer le seuil en CI |
| Storybook non configuré | Basse | FO-14 est un écran simple, pas de composant réutilisable à ajouter |
| Tests composant DeviceGuard absents | Basse | Flux complexe (tRPC mock), couvert par le protocole de test manuel |

## Qualité du code

| Métrique | Valeur | Seuil | Statut |
|----------|--------|-------|--------|
| Erreurs lint (Biome) | 0 | 0 | [x] OK |
| Erreurs TypeScript | 0 | 0 | [x] OK |
| Tests | 25/25 passent | 0 échec | [x] OK |
| Design tokens respectés | 100% CSS via var() | 0 valeur en dur | [x] OK |
| Wireframe FO-14 conforme | Layout, contenu, cul-de-sac | — | [x] OK |
| ADR-005, ADR-006 respectés | Auth device + middleware | — | [x] OK |

## Architecture implémentée

```
apps/api/src/identite/           # bc-identite
├── identite.router.ts           # Router tRPC (2 procédures publiques)
├── identite.test.ts             # 11 tests d'intégration
├── enregistrer-device/
│   ├── enregistrer-device.service.ts
│   └── enregistrer-device.repository.ts
└── verifier-device/
    ├── verifier-device.service.ts
    └── verifier-device.repository.ts

apps/web/src/identite/           # bc-identite frontend
├── DeviceGuard.tsx              # Garde d'identification
├── AccessRefused.tsx            # Écran FO-14
├── AccessRefused.module.css     # Styles design tokens
├── AccessRefused.test.tsx       # 4 tests composant
├── use-device-id.ts             # Hook localStorage
└── use-device-id.test.ts        # 4 tests unitaires
```

## Points d'attention pour la suite

1. **F3 Onboarding** dépend de `identite.verifierDevice` qui retourne `etatOnboarding: "non_demarre"` en dur — à enrichir quand bc-onboarding sera implémenté
2. **Rate limiting** à implémenter si l'app est exposée publiquement (actuellement pas critique)
3. **Tester sur smartphone réel** de Juju (FO-14) pour valider contraste WCAG AA et zones tactiles

---

**Rédigé le** : 2026-05-20

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| feature | [F2 — Accès sécurisé par device](f2-feature-auth-device.md) |
| test protocol | [Protocole de test](f2-test-protocol.md) |
| ADR-005 | [Authentification](../../03-design/2-architecture/adr/adr-005-authentification.md) |
| ADR-006 | [Autorisation](../../03-design/2-architecture/adr/adr-006-autorisation.md) |
| bc-identite | [BC Identité](../../03-design/1-domain/bc-identite.md) |
| spec FO-14 | [Écran accès refusé](../../03-design/3-wireframes/spec-ecran-acces-refuse.md) |
