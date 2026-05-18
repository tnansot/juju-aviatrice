# ADR-003 : Structure du projet

## Contexte

Le projet est un fullstack TypeScript (React SPA + API Hono, ADR-002) avec 6 bounded contexts bien identifiés. Le template de repository et les patterns d'architecture interne doivent refléter la séparation frontend/backend et l'organisation par BC. Les alternatives écartées : Standard (front/back mélangés), Platform (microservices), Layered MVC (cohésion BC éclatée), DDD hexagonal complet (surdimensionné).

## Décision

### Template de repository : Fullstack monorepo

```
.
├── docs/              # livrables PBM
├── apps/
│   ├── api/           # backend Hono + tRPC
│   └── web/           # frontend React SPA
├── packages/          # librairies partagées (types tRPC, modèles domaine)
├── docker-compose.yml
├── package.json       # workspace root (pnpm workspaces)
├── CLAUDE.md
└── _bmad/
```

Gestionnaire de workspaces : **pnpm workspaces** (rapide, espace disque optimisé, lockfile strict).

### Pattern backend : Vertical Slices

Chaque bounded context est un dossier racine dans `apps/api/src/`, avec ses features verticales :

```
apps/api/src/
├── identite/
│   └── identify-device/
│       ├── identify-device.router.ts
│       ├── identify-device.service.ts
│       ├── identify-device.repository.ts
│       └── identify-device.test.ts
├── contenu/
│   ├── list-chapitres/
│   ├── get-exercice/
│   └── get-fiche-methode/
├── entrainement/
│   ├── start-session/
│   ├── submit-exercice/
│   └── end-session/
├── progression/
│   ├── get-profil/
│   ├── check-deblocage/
│   └── evolve-avatar/
├── suggestion/
│   └── get-suggestion/
├── onboarding/
│   ├── get-onboarding-state/
│   └── complete-onboarding/
├── shared/
│   ├── db/            # connexion Drizzle, schéma, migrations
│   ├── errors/        # classes d'erreurs typées
│   └── middleware/     # auth device, logging
└── trpc/              # router racine tRPC, context
```

### Pattern frontend : Feature-based

Chaque bounded context est un dossier racine dans `apps/web/src/`, avec ses features verticales :

```
apps/web/src/
├── identite/
│   └── DeviceGuard.tsx
├── contenu/
│   ├── ChapitreList.tsx
│   └── ExerciceView.tsx
├── entrainement/
│   ├── SessionScreen.tsx
│   ├── ExerciceCard.tsx
│   ├── useSession.ts
│   └── BilanScreen.tsx
├── progression/
│   ├── AvatarDisplay.tsx
│   ├── ProfilScreen.tsx
│   └── CelebrationOverlay.tsx
├── suggestion/
│   └── SuggestionCard.tsx
├── onboarding/
│   ├── OnboardingFlow.tsx
│   └── WelcomeScreen.tsx
├── shared/
│   ├── components/    # boutons, layout, chrono, typographie
│   ├── hooks/         # useDeviceId, useTheme
│   └── utils/
├── App.tsx
└── main.tsx
```

## Exigences concernées

- [ENF-AUT-006 : Hot reload](../../0-requirements/non-fonctionnelles/req-autres.md) — monorepo Vite + pnpm workspaces
- [ENF-AUT-004 : Responsive-ready M1](../../0-requirements/non-fonctionnelles/req-autres.md) — architecture CSS anticipée

## Traçabilité

| Dépendance | Référence |
|---|---|
| ADR-002 Stack applicative | [adr-002](adr-002-stack-applicative.md) |
| bounded contexts (6 BCs) | [context-map](../../1-domain/context-map.md) |
| catalogue repository-models | [repository-models.yaml](../../../../_bmad/pbm/data/repository-models.yaml) |
| catalogue architecture-patterns | [architecture-patterns.yaml](../../../../_bmad/pbm/data/architecture-patterns.yaml) |
