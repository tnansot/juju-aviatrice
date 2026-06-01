# Protocole de test manuel — F4 Session d'entraînement courte

> **Feature** : [F4 — Session d'entraînement courte](f4-feature-session-entrainement.md)
> **Date** : 2026-06-01
> **Testeur** : _____________

## Prérequis

```bash
# Repartir d'un état propre puis démarrer (proche de la prod)
pnpm dev:clean
# Attendre les logs de démarrage (API sur :3000, frontend sur :5173)
# Les migrations (dont 0004 sessions/mini_sessions/exercices_en_cours) sont
# appliquées automatiquement au démarrage dev.
```

**Création d'un jeton d'invitation** (DB vide après `dev:clean`) :

```bash
pnpm seed
# Crée le jeton par défaut "juju-aviatrice-2026" (max 3 utilisations)
```

**Atteindre l'accueil FO-04** : F4 démarre depuis l'accueil post-onboarding.

1. Supprimer la clé `device-id` du localStorage (DevTools → Application → Local Storage)
2. Ouvrir `http://localhost:5173/?invite=juju-aviatrice-2026`
3. Cliquer « Passer » sur l'onboarding (ou le compléter) pour arriver sur FO-04

**Récupérer le `device-id`** (pour les vérifications API) : DevTools → Application → Local Storage → clé `device-id`. Le noter pour la section « Vérification API directe ».

**Remise à zéro de l'entraînement entre scénarios** : les sessions sont conservées en DB mais sans effet visible sur l'accueil (pas encore de compteur branché — bc-progression/F8). Pour repartir totalement propre, relancer `pnpm dev:clean` + `pnpm seed`.

## Scénarios

### 1. Démarrage de mini-session en 1 tap (S1)

**Critères Gherkin** : GIVEN l'écran d'accueil FO-04 avec une suggestion affichée WHEN Juju tape Go THEN une mini-session de 3-5 exercices démarre immédiatement sans écran intermédiaire

**Actions** :

1. Depuis FO-04, vérifier la suggestion « Lance ta première session : 4 flashcards maths »
2. Cliquer le bouton « Go »
3. Vérifier : affichage immédiat d'une flashcard (FO-05), sans écran intermédiaire
4. Vérifier : topbar affiche le chapitre « Géométrie » et la progression « 1 / 4 »

**Résultat attendu** : la première flashcard de Géométrie s'affiche directement, topbar « Géométrie » + « 1 / 4 », aucun écran de transition entre le tap Go et l'exercice

- [x] OK

### 2. Exercice flashcard : retournement et explication (S2)

**Critères Gherkin** : GIVEN un exercice flashcard affiché (face question) WHEN Juju tape pour retourner la carte THEN la face réponse s'affiche et l'explication pédagogique apparaît

**Actions** :

1. Sur la flashcard, vérifier la présence de la question et de l'indication « Tape pour retourner »
2. Vérifier : aucun bouton « Suivant » visible avant retournement
3. Cliquer sur la carte
4. Vérifier : libellé « Réponse » + le texte de réponse
5. Vérifier : libellé « Explication » + le texte de raisonnement
6. Vérifier : le bouton « Suivant » apparaît
7. Cliquer « Suivant »
8. Vérifier : l'exercice suivant s'affiche, progression « 2 / 4 »

**Résultat attendu** : retournement révèle Réponse + Explication, « Suivant » n'apparaît qu'après retournement, et avance à l'exercice 2/4 sans délai perceptible

- [x] OK

### 3. Exercice QCM : sélection, validation, correction neutre (S3)

**Critères Gherkin** : GIVEN un exercice QCM affiché WHEN Juju sélectionne une réponse et valide THEN la bonne réponse est mise en évidence et l'explication s'affiche, sans aucun mot négatif (« faux », « raté », « mauvaise réponse »)

**Actions** :

1. Démarrer une session QCM : depuis FO-04 cliquer « Changer d'activité » → « Sciences » → « Géométrie » (le format Sciences par défaut est flashcard ; pour un QCM, utiliser la vérification API du §7, ou un chapitre dont le format est QCM)
2. Alternative QCM via Psychotechniques : « Changer d'activité » → « Psychotechniques » → « Calcul mental »
3. Vérifier : un énoncé QCM avec 3-5 choix, bouton « Valider » désactivé
4. Sélectionner un choix
5. Vérifier : le bouton « Valider » devient actif
6. Cliquer « Valider »
7. Vérifier : la bonne réponse est encadrée en vert ; un choix non retenu reste neutre (gris), jamais en rouge
8. Vérifier : panneau « Explication » avec le raisonnement
9. Vérifier : aucun mot « Faux », « Raté », « Mauvaise réponse » à l'écran
10. Cliquer « Suivant »

**Résultat attendu** : validation met la bonne réponse en vert, choix non retenu en gris neutre, panneau « Explication » affiché, vocabulaire exclusivement neutre, passage à l'exercice suivant

- [x] OK

### 4. Bilan sobre de fin de mini-session (S4)

**Critères Gherkin** : GIVEN les 3-5 exercices terminés WHEN le bilan FO-07 s'affiche THEN il mentionne le nombre d'exercices faits et le temps passé, sans note /N ni pourcentage

**Actions** :

1. Terminer tous les exercices d'une mini-session (retourner/valider jusqu'au dernier « Suivant »)
2. Vérifier : écran « Session terminée »
3. Vérifier : le nombre d'exercices faits et une durée « N min » sont affichés
4. Vérifier : aucune note sur N, aucun pourcentage, aucun ratio de réussite
5. Vérifier : message positif (ex. « beau travail, ton avatar avance »)
6. Vérifier : boutons « Encore une session » et « Bonne nuit »
7. Cliquer « Encore une session »
8. Vérifier : retour à l'accueil FO-04
9. Refaire une session jusqu'au bilan, cliquer « Bonne nuit »
10. Vérifier : retour à l'accueil FO-04, aucun message culpabilisant ni relance

**Résultat attendu** : bilan = nombre d'exercices + durée + message positif, sans note /N ni %, et les deux choix ramènent à FO-04 sereinement

- [x] OK

### 5. Choix d'activité alternatif en 2 taps (S1)

**Critères Gherkin** : GIVEN l'écran d'accueil WHEN Juju tape « Changer d'activité » THEN l'écran FO-09 propose un choix pilier → chapitre en 2 taps maximum

**Actions** :

1. Depuis FO-04, cliquer « Changer d'activité »
2. Vérifier : titre « Choisis ton terrain » + sous-titre « Sélectionne un pilier, puis un chapitre. »
3. Vérifier : deux piliers — « Sciences » (Maths + Physique-chimie 1ère) et « Psychotechniques » (Logique + Calcul mental)
4. Cliquer « Sciences »
5. Vérifier : liste des chapitres (Géométrie, Algèbre, Analyse) avec statut « Débloqué »
6. Cliquer « Géométrie »
7. Vérifier : une mini-session démarre sur Géométrie (topbar « Géométrie »)
8. Vérifier : le bouton « Retour » en phase chapitre ramène au choix de pilier

**Résultat attendu** : pilier → chapitre en 2 taps lance la session correspondante ; « Retour » revient au choix de pilier

- [x] OK

### 6. Tolérance aux interruptions (S5)

**Critères Gherkin** : GIVEN une mini-session en cours (2 exercices faits sur 4) WHEN Juju ferme/masque l'app THEN les exercices faits sont comptabilisés ; et à la réouverture l'accueil FO-04 s'affiche sans mention de la session inachevée

**Actions** :

1. Démarrer une mini-session (Go), faire 2 exercices sur 4
2. Masquer l'onglet (changer d'onglet) ou fermer puis rouvrir l'onglet
3. Vérifier via API (cf. §7) que la mini-session passe à `interrompue` et que `exercicesFaitsComptes` = 2
4. Rouvrir `http://localhost:5173/`
5. Vérifier : l'accueil FO-04 s'affiche normalement
6. Vérifier : aucun message ni rappel sur la session inachevée

**Résultat attendu** : interruption comptabilise les 2 exercices faits (sans pénalité), réouverture = FO-04 propre sans reproche

- [x] OK

## Vérification API directe

Remplacer `<DEVICE_ID>` par le `device-id` relevé dans le localStorage, puis l'exporter une fois pour toute la session :

```bash
export DEVICE_ID="<DEVICE_ID>"
```

> **`demarrerMiniSession` est une mutation** : chaque appel crée une nouvelle mini-session avec de nouveaux `exerciceEnCoursId`. On capture donc la réponse complète dans une variable (`$RESP`) et on en dérive `exerciceEnCoursId`, `choixId` et `miniSessionId` — au lieu de rappeler la mutation entre les étapes.

```bash
# 1. Démarrer une mini-session flashcard (mutation)
curl -s -X POST http://localhost:3000/trpc/entrainement.demarrerMiniSession \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: $DEVICE_ID" \
  -d '{"json":{"chapitreId":"maths-geometrie","format":"flashcard","nombre":4}}' | jq .
# Attendu : result.data.json avec sessionId, miniSessionId, exercices[4]
#   chaque exercice porte id, exerciceEnCoursId, format, enonce, ordre
#   chaque énoncé flashcard a faceQuestion + faceReponse + explication
#   (aucun champ bonneReponseId)
```

- [x] OK — 4 exercices flashcard retournés, sans bonne réponse exposée

```bash
# 2. Démarrer un QCM et CAPTURER la réponse complète dans $RESP
RESP=$(curl -s -X POST http://localhost:3000/trpc/entrainement.demarrerMiniSession \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: $DEVICE_ID" \
  -d '{"json":{"chapitreId":"maths-geometrie","format":"qcm","nombre":4}}')

# Vérifier que l'énoncé n'expose PAS bonneReponseId
echo "$RESP" | jq '.result.data.json.exercices[0].enonce'
# Attendu : { "question": "...", "choix": [ {id,libelle}, ... ] } — pas de bonneReponseId

# Dériver les identifiants pour les étapes suivantes
EEC_ID=$(echo "$RESP" | jq -r '.result.data.json.exercices[0].exerciceEnCoursId')
CHOIX_ID=$(echo "$RESP" | jq -r '.result.data.json.exercices[0].enonce.choix[0].id')
MS_ID=$(echo "$RESP" | jq -r '.result.data.json.miniSessionId')
echo "EEC_ID=$EEC_ID  CHOIX_ID=$CHOIX_ID  MS_ID=$MS_ID"
```

- [x] OK — l'énoncé QCM ne contient que question + choix

```bash
# 3. Soumettre une réponse QCM (utilise $EEC_ID et $CHOIX_ID issus de l'étape 2)
curl -s -X POST http://localhost:3000/trpc/entrainement.soumettreReponse \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: $DEVICE_ID" \
  -d "{\"json\":{\"exerciceEnCoursId\":\"$EEC_ID\",\"choixId\":\"$CHOIX_ID\"}}" | jq '.result.data.json'
# Attendu : { estCorrect, correction, bonneReponseId, exerciceSuivant }
```

- [x] OK — correction + bonneReponseId + estCorrect retournés

```bash
# 4. Terminer la mini-session puis obtenir le bilan (utilise $MS_ID issu de l'étape 2)
curl -s -X POST http://localhost:3000/trpc/entrainement.terminerMiniSession \
  -H "Content-Type: application/json" -H "X-Device-Id: $DEVICE_ID" \
  -d "{\"json\":{\"miniSessionId\":\"$MS_ID\"}}" | jq '.result.data.json'
# Attendu : { etat: "terminee", nombreExercicesFaits, avatarProgresse:false, ... }

curl -s -G http://localhost:3000/trpc/entrainement.obtenirBilan \
  --data-urlencode "input={\"json\":{\"miniSessionId\":\"$MS_ID\"}}" \
  -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json'
# Attendu : { chapitreNom, nombreExercicesFaits, dureeMinutes, messageBilan } — pas de note /N
```

- [x] OK — bilan sobre (nombre + durée + message positif), sans note /N

## Vérification post-deploy

> Vérifications à effectuer après déploiement en production (CD verte).

**API production** :

```bash
curl -s https://api.juju-aviatrice.uk/health | jq .
# Attendu : status "ok"

# Démarrer une mini-session (device prod enregistré requis)
curl -s -X POST https://api.juju-aviatrice.uk/trpc/entrainement.demarrerMiniSession \
  -H "Content-Type: application/json" -H "X-Device-Id: <DEVICE_ID_PROD>" \
  -d '{"json":{"chapitreId":"maths-geometrie","format":"flashcard","nombre":4}}' | jq '.result.data.json | {miniSessionId, n: (.exercices|length)}'
# Attendu : miniSessionId présent, n = 4
```

- [x] OK — API prod accessible, healthcheck OK (gitSha c90e0e7)
- [x] OK — `demarrerMiniSession` fonctionne en prod (migration 0004 appliquée — parcours Go validé)

**Frontend production** : ouvrir `https://app.juju-aviatrice.uk/` (device ayant terminé/passé l'onboarding)

- [x] OK — Go lance une mini-session (flashcard FO-05)
- [x] OK — flip révèle Réponse + Explication, « Suivant » enchaîne
- [x] OK — QCM : validation, correction neutre (0 mot négatif)
- [x] OK — bilan FO-07 sans note /N, « Encore » / « Bonne nuit » ramènent à l'accueil
- [x] OK — « Changer d'activité » : pilier → chapitre en 2 taps
- [x] OK — masquer l'onglet en cours de session ne provoque aucun reproche au retour

## Résultat

- [x] Tous les scénarios locaux validés
- [x] Vérifications API directes validées
- [x] Vérifications post-deploy validées
- [x] Aucun message culpabilisant ni note /N détecté (règle d'or)
- [x] Zones tactiles ≥ 44×44px vérifiées visuellement
- **Testeur** : Papa
- **Date** : 1er juin 2026
