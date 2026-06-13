# Protocole de test manuel — F5 Catalogue contenu scientifique

> **Feature** : [F5 — Catalogue contenu scientifique](f5-feature-catalogue-scientifique.md)
> **Date** : 2026-06-13
> **Testeur** : _____________

## Prérequis

Procédures communes dans le [Runbook — Test manuel](../../06-run/runbook-test-manuel.md) :

- Démarrer l'environnement local → [§1](../../06-run/runbook-test-manuel.md#1-démarrer-lenvironnement-de-test-local).
- Créer le jeton → [§2](../../06-run/runbook-test-manuel.md#2-créer-un-jeton-dinvitation-local).
- Récupérer le `device-id` et l'exporter (`export DEVICE_ID=…`) → [§4](../../06-run/runbook-test-manuel.md#4-récupérer-le-device-id).
- Conventions d'appel tRPC (curl, superjson, header device) → [§5](../../06-run/runbook-test-manuel.md#5-conventions-dappel-api-trpc-curl).

**Spécifique F5** : les procédures `contenu.*` sont des **queries protégées** — elles exigent le header `X-Device-Id`. Enregistrer d'abord un device (ouvrir `http://localhost:5173/?invite=juju-aviatrice-2026`, terminer l'arrivée), puis exporter `DEVICE_ID` (Runbook §4). Le catalogue est chargé **au démarrage du serveur** depuis `apps/api/src/content/**` : si un fichier MD est malformé, l'API ne démarre pas (erreur explicite dans les logs citant le fichier fautif).

## Scénarios

### 1. Le catalogue se charge au démarrage (S1)

**Critères Gherkin** : GIVEN les fichiers MD du catalogue WHEN le serveur démarre THEN le loader parse tous les piliers, chapitres et exercices sans erreur.

**Actions** :

1. Démarrer l'environnement (Runbook §1).
2. Observer les logs de l'API au démarrage.
3. Vérifier le healthcheck :

   ```bash
   curl -s http://localhost:3000/health | jq .
   ```

**Résultat attendu** : aucune erreur de type `Frontmatter invalide (…)` ou `Catalogue : …` dans les logs ; le healthcheck renvoie `{"status":"ok"}`.

- [ ] OK

### 2. listerPiliers expose 2 piliers et les 6 chapitres Sciences (S1 + S2)

**Critères Gherkin** : GIVEN le catalogue chargé WHEN j'appelle `contenu.listerPiliers` THEN je reçois 2 piliers, le pilier Sciences ayant 6 chapitres avec `matiere` et `formatsDisponibles`.

**Actions** :

1. Appeler la procédure :

   ```bash
   curl -s -G http://localhost:3000/trpc/contenu.listerPiliers \
     -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json'
   ```

2. Vérifier le nombre de piliers et de chapitres Sciences :

   ```bash
   curl -s -G http://localhost:3000/trpc/contenu.listerPiliers \
     -H "X-Device-Id: $DEVICE_ID" \
     | jq '.result.data.json | {piliers: length, sciences: (.[] | select(.id=="sciences") | .chapitres | length)}'
   ```

**Résultat attendu** : `{"piliers": 2, "sciences": 6}`. Chaque chapitre Sciences porte un champ `matiere` (`maths` ou `physique_chimie`) et un tableau `formatsDisponibles` non vide ; les chapitres sont triés par `ordre` croissant.

- [ ] OK

### 3. obtenirChapitre renvoie les métadonnées et les compteurs (S2)

**Critères Gherkin** : GIVEN un `chapitreId` valide WHEN j'appelle `contenu.obtenirChapitre` THEN je reçois nom, matière, formats et le nombre d'exercices par format.

**Actions** :

1. Interroger le chapitre `maths-geometrie` :

   ```bash
   curl -s -G http://localhost:3000/trpc/contenu.obtenirChapitre \
     --data-urlencode 'input={"json":{"chapitreId":"maths-geometrie"}}' \
     -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json'
   ```

**Résultat attendu** : objet avec `id: "maths-geometrie"`, `pilierId: "sciences"`, `nom: "Géométrie"`, `matiere: "maths"`, `formatsDisponibles: ["flashcard","qcm"]`, `ficheMethodeDisponible: false` et `nombreExercicesParFormat: {"flashcard":5,"qcm":5}`.

- [ ] OK

### 4. obtenirChapitre rejette un chapitre inexistant (S2)

**Critères Gherkin** : GIVEN un `chapitreId` inconnu WHEN j'appelle `contenu.obtenirChapitre` THEN l'API renvoie une erreur NON_TROUVE.

**Actions** :

1. Interroger un chapitre fantôme :

   ```bash
   curl -s -G http://localhost:3000/trpc/contenu.obtenirChapitre \
     --data-urlencode 'input={"json":{"chapitreId":"chapitre-fantome"}}' \
     -H "X-Device-Id: $DEVICE_ID" | jq '.error.json.message'
   ```

**Résultat attendu** : la réponse contient une erreur dont le message est `"NON_TROUVE"` (code HTTP 404).

- [ ] OK

### 5. chargerExercices renvoie N flashcards avec leurs deux faces (S3)

**Critères Gherkin** : GIVEN un chapitre avec ≥ 5 flashcards WHEN j'appelle `contenu.chargerExercices(..., "flashcard", 4)` THEN je reçois exactement 4 flashcards avec `faceQuestion` et `faceReponse`.

**Actions** :

1. Charger 4 flashcards de `maths-analyse` :

   ```bash
   curl -s -G http://localhost:3000/trpc/contenu.chargerExercices \
     --data-urlencode 'input={"json":{"chapitreId":"maths-analyse","format":"flashcard","nombre":4}}' \
     -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json | {n: length, faces: [.[0].enonce | keys]}'
   ```

**Résultat attendu** : `n` vaut `4` ; chaque énoncé contient `faceQuestion` et `faceReponse` (et aucune autre clé).

- [ ] OK

### 6. chargerExercices ne divulgue jamais la bonne réponse QCM (S3)

**Critères Gherkin** : GIVEN un chapitre avec des QCM WHEN j'appelle `contenu.chargerExercices(..., "qcm", 5)` THEN les énoncés contiennent question et choix, sans `bonneReponseId` ni `correction`.

**Actions** :

1. Charger 5 QCM de `pc-energie` et inspecter les clés exposées :

   ```bash
   curl -s -G http://localhost:3000/trpc/contenu.chargerExercices \
     --data-urlencode 'input={"json":{"chapitreId":"pc-energie","format":"qcm","nombre":5}}' \
     -H "X-Device-Id: $DEVICE_ID" \
     | jq '.result.data.json | {n: length, clesEnonce: (.[0].enonce | keys), choix0: .[0].enonce.choix[0]}'
   ```

**Résultat attendu** : `n` vaut `5` ; `clesEnonce` = `["choix","question"]` ; chaque choix ne contient que `id` et `libelle` (pas de `est_correct`) ; aucun champ `bonneReponseId` ni `correction` n'apparaît.

- [ ] OK

### 7. Les 3 chapitres maths comptent ≥ 5 flashcards + ≥ 5 QCM (S4)

**Critères Gherkin** : GIVEN le skill `gen-exercices-maths` exécuté WHEN je vérifie les chapitres maths THEN chacun a ≥ 5 flashcards et ≥ 5 QCM, corrections pédagogiques.

**Actions** :

1. Vérifier les compteurs des 3 chapitres maths :

   ```bash
   for ch in maths-algebre maths-analyse maths-geometrie; do
     curl -s -G http://localhost:3000/trpc/contenu.obtenirChapitre \
       --data-urlencode "input={\"json\":{\"chapitreId\":\"$ch\"}}" \
       -H "X-Device-Id: $DEVICE_ID" \
       | jq -c '.result.data.json | {id, n: .nombreExercicesParFormat}'
   done
   ```

2. Contrôler la charte de ton sur les corrections (aucun mot interdit) :

   ```bash
   grep -rriE "faux|raté|ratée|mauvais" apps/api/src/content/chapitres/maths-* ; echo "exit=$?"
   ```

**Résultat attendu** : chaque chapitre maths renvoie `{"flashcard":5,"qcm":5}` ; le `grep` ne retourne aucune ligne (`exit=1`).

- [ ] OK

### 8. Les 3 chapitres physique-chimie comptent ≥ 5 flashcards + ≥ 5 QCM (S5)

**Critères Gherkin** : GIVEN le skill `gen-exercices-physique-chimie` exécuté WHEN je vérifie les chapitres PC THEN chacun a ≥ 5 flashcards et ≥ 5 QCM, corrections pédagogiques avec unités.

**Actions** :

1. Vérifier les compteurs des 3 chapitres PC :

   ```bash
   for ch in pc-constitution-matiere pc-ondes-signaux pc-energie; do
     curl -s -G http://localhost:3000/trpc/contenu.obtenirChapitre \
       --data-urlencode "input={\"json\":{\"chapitreId\":\"$ch\"}}" \
       -H "X-Device-Id: $DEVICE_ID" \
       | jq -c '.result.data.json | {id, n: .nombreExercicesParFormat}'
   done
   ```

2. Contrôler la charte de ton :

   ```bash
   grep -rriE "faux|raté|ratée|mauvais" apps/api/src/content/chapitres/pc-* ; echo "exit=$?"
   ```

**Résultat attendu** : chaque chapitre PC renvoie `{"flashcard":5,"qcm":5}` ; le `grep` ne retourne aucune ligne (`exit=1`).

- [ ] OK

## Vérification API directe

Récapitulatif rapide du catalogue chargé (8 chapitres : 6 Sciences + 2 psy provisoires) :

```bash
curl -s -G http://localhost:3000/trpc/contenu.listerPiliers \
  -H "X-Device-Id: $DEVICE_ID" \
  | jq '.result.data.json | map({pilier:.id, chapitres:(.chapitres|length)})'
# Attendu : [{"pilier":"sciences","chapitres":6},{"pilier":"psychotechniques","chapitres":2}]
```

- [ ] OK

## Vérification post-deploy

> Vérifications à effectuer après déploiement en production. Procédures communes (healthcheck, accès VPS/base, jeton prod, device vierge) : voir [Runbook §6](../../06-run/runbook-test-manuel.md#6-vérification-post-déploiement-production). En prod, enregistrer un device via l'app (jeton `juju-prod-2026`) puis exporter `DEVICE_ID` avant les appels protégés.

**API production** (healthcheck → [Runbook §6.1](../../06-run/runbook-test-manuel.md#61-healthcheck-de-lapi)) :

```bash
curl -s https://api.juju-aviatrice.uk/health | jq .
```

- [ ] OK — healthcheck `{"status":"ok"}` (l'API a démarré, donc le catalogue MD embarqué dans `dist/content` s'est chargé sans erreur)

```bash
curl -s -G https://api.juju-aviatrice.uk/trpc/contenu.listerPiliers \
  -H "X-Device-Id: $DEVICE_ID" \
  | jq '.result.data.json | {sciences: (.[] | select(.id=="sciences") | .chapitres | length)}'
```

- [ ] OK — le pilier Sciences expose 6 chapitres en production

```bash
curl -s -G https://api.juju-aviatrice.uk/trpc/contenu.obtenirChapitre \
  --data-urlencode 'input={"json":{"chapitreId":"pc-energie"}}' \
  -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json.nombreExercicesParFormat'
```

- [ ] OK — `{"flashcard":5,"qcm":5}` pour un chapitre PC en production

**Frontend production** : ouvrir https://app.juju-aviatrice.uk/ et lancer une mini-session sur un chapitre Sciences

- [ ] OK — les exercices d'un chapitre maths/PC s'affichent et la correction est lisible après réponse

## Résultat

- [ ] Tous les scénarios locaux validés
- [ ] Vérifications post-deploy validées
- **Testeur** : _____________
- **Date** : _____________
