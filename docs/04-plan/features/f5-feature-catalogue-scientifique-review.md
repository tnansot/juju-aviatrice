# Bilan technique — F5 Catalogue contenu scientifique

> **Date** : 2026-06-13 — Thomas (Papa) avec Claude

## Résumé

Le pilier Sciences est alimenté : **6 chapitres** (3 maths + 3 physique-chimie 1ère), chacun en flashcards + QCM avec corrections expliquées. Le stub mémoire `catalogue.ts` (dette héritée de F4) est remplacé par un **loader Markdown** (ADR-015) qui parse `src/content/**` au démarrage, valide les frontmatter contre les modèles de domaine et lève une erreur explicite citant le fichier fautif. L'interface publique du catalogue est **préservée** : les 5 consommateurs (bc-entrainement, services bc-contenu) restent inchangés. L'API contenu est complétée (`obtenirChapitre`, `chargerExercices`) et `listerPiliers` enrichie au contrat OpenAPI.

## Stories livrées

| Story | Type | Points | Statut |
|-------|------|--------|--------|
| S1 — Structure de fichiers et loader du catalogue | TS | 3 | Terminée |
| S2 — API contenu.listerPiliers et contenu.obtenirChapitre | TS | 2 | Terminée |
| S3 — API contenu.chargerExercices | TS | 2 | Terminée |
| S4 — Génération des exercices maths (skill) | US | 3 | Terminée |
| S5 — Génération des exercices physique-chimie (skill) | US | 3 | Terminée |

**Total** : 5/5 stories — 13 points

## Architecture livrée

- **Loader** (`apps/api/src/contenu/loader.ts`, `gray-matter`) : parse piliers, chapitres et exercices (flashcard/QCM), extrait `est_correct` depuis `[x]`, valide via Zod (aligné model-pilier/chapitre/exercice), contrôle les invariants (pilier non vide, chapitre sans exercice, format non déclaré, plusieurs/aucune bonne réponse). Erreurs explicites avec chemin du fichier.
- **Catalogue** (`catalogue.ts`) : devient un wrapper du loader (singleton chargé au démarrage), **interface identique** (`listerChapitres`, `obtenirChapitre`, `obtenirExercice`, `exercicesDuChapitre`) — enrichi de `matiere`, `referenceBo`, `typologiePsy`, `ficheMethodeDisponible`.
- **Contenu MD** (`src/content/**`) : 8 chapitres — 6 Sciences (`maths-{geometrie,algebre,analyse}`, `pc-{constitution-matiere,ondes-signaux,energie}`, 5 fc + 5 qcm chacun) + 2 psy provisoires migrés du stub.
- **API** : `listerPiliers` enrichie (`matiere` + `formatsDisponibles`), `obtenirChapitre` (métadonnées + `nombreExercicesParFormat` + `ficheMethodeDisponible`, NON_TROUVE), `chargerExercices` exposée (énoncé sûr, sans bonne réponse ni correction). `zMatiere` ajouté aux schémas partagés.
- **Build** : `scripts/copy-content.mjs` copie `src/content` → `dist/content` après `tsc` (le stage prod du Dockerfile ne copie que `dist/`). Loader résolu via `import.meta.url` → valide en dev (tsx) et prod (node).
- **Skills de génération** : `.claude/skills/gen-exercices-maths` et `gen-exercices-physique-chimie` (convention ADR-015 + charte de ton).

## Décisions de conception actées

- **`gray-matter`** comme parser de frontmatter (détail d'implémentation sous ADR-015, pas un nouvel ADR).
- **Contenu psy migré en MD provisoire** : garde le catalogue complet (invariant pilier non vide) et tout vert ; **F6 le possède** et l'enrichira (fiches méthode incluses).
- **Découplage test/contenu** : le service `chargerExercices` reçoit un provider d'exercices injectable → le test de bornage ne dépend plus du contenu réel (qui change avec S4/S5).
- **Chargement de fiche méthode différé à F6** : le loader détecte seulement la présence de `fiche-methode.md` (pour `ficheMethodeDisponible`) ; le parsing complet est hors périmètre F5.

## Dette technique identifiée

| Élément | Sévérité | Action recommandée | Report |
|---------|----------|--------------------|--------|
| Contenu psy (`psy-logique`, `psy-calcul-mental`) provisoire, sans fiche méthode, sans typologie | Moyenne | Enrichir + parser `fiche-methode.md` (`obtenirFicheMethode`) | **F6** |
| Couverture de tests non mesurable (`@vitest/coverage-v8@4.1.6` ≠ `vitest@3.2.4`) | Moyenne | Aligner les versions pour réactiver `test:coverage` (DoD ≥ 60 %) | TS dette infra (héritée F4) |
| Build Cloudflare « Workers Builds: juju-aviatrice » en échec — projet CF connecté au repo **sans config** (`wrangler.jsonc` ne définit que `app-juju-aviatrice`) | Basse | Supprimer/corriger ce projet côté dashboard Cloudflare (non bloquant, hors `cd.yml`) | Infra (hors feature) |
| `reference_bo` non exploitée côté frontend (présente dans `obtenirChapitre`) | Basse | À afficher dans FO-09 si utile | — |

## Clôture (2026-06-13)

| Métrique | Planifié | Réalisé |
|----------|----------|---------|
| Stories | 5 | 5 (100 %) |
| Points | 13 | 13 |
| Tests | — | 107 verts (70 API dont +17 F5 : loader 10 + contenu 7 ; 37 web) |

**Critère de complétion** : ✅ Atteint — (1) 6 chapitres scientifiques accessibles ; (2) chaque chapitre ≥ 5 flashcards + ≥ 5 QCM avec corrections expliquées ; (3) `listerPiliers` retourne Sciences + 6 chapitres ; (4) `chargerExercices` retourne les exercices du chapitre/format ; (5) corrections conformes à la charte de ton (vérif `grep` : 0 mot interdit).

| Porte qualité | Valeur | Statut |
|---------------|--------|--------|
| Erreurs lint (Biome, 116 fichiers) | 0 | ✅ |
| Typecheck (`tsc` api + web) | 0 erreur | ✅ |
| Build (api + web) + copie `dist/content` | Vert | ✅ |
| CI (`lint-typecheck-test`, PR #18) | Verte | ✅ |
| CD / déploiement prod | Vert (`gitSha ee2e026` en prod) | ✅ |
| Vérification prod | Healthcheck OK + catalogue chargé sans crash (loader valide en prod) + endpoints protégés (`DEVICE_INCONNU`) | ✅ |

> Note : checks fonctionnels device-based du protocole (lister 6 chapitres, compteurs en prod) à dérouler dans l'app avec Juju ; formes de réponse garanties par les tests d'intégration verts.

## Points d'attention pour la suite

1. **Calibrage** : 5 stories S/M livrées sans dépassement, aucune story non terminée — estimations justes (cohérent avec F4).
2. **F6 (Découverte psy)** débloquée (dépend de F1, F2, F3, F4 livrées) : reprend les 2 chapitres psy provisoires, ajoute fiches méthode + `obtenirFicheMethode`, et réutilise le skill `gen-exercices-psy` (à créer sur le modèle des skills maths/PC).
3. **Interface catalogue stable** : la promesse faite en bilan F4 est tenue — le passage stub → loader n'a touché aucun consommateur (tests bc-entrainement inchangés et verts).
4. **Nettoyage infra** : supprimer le projet Cloudflare `juju-aviatrice` redondant (build en échec à chaque push, sans impact sur le déploiement réel).
5. **Dette coverage** : toujours à traiter pour rétablir la mesure DoD ≥ 60 %.

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| Feature F5 | [f5-feature-catalogue-scientifique.md](f5-feature-catalogue-scientifique.md) |
| Protocole de test | [f5-test-protocol.md](f5-test-protocol.md) |
| Bilan F4 (dette catalogue stub → F5) | [f4-feature-session-entrainement-review.md](f4-feature-session-entrainement-review.md) |
| bc-contenu | [bc-contenu](../../03-design/1-domain/bc-contenu.md) |
| modèles Pilier, Chapitre, Exercice | [models/](../../03-design/1-domain/models/) |
| ADR-015 catalogue contenu | [adr-015](../../03-design/2-architecture/adr/adr-015-convention-catalogue-contenu.md) |
| API contenu | [contenu.md](../../03-design/4-api/contenu.md) |
