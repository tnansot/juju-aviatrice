# Protocole de test manuel — F3 Parcours de bienvenue

> **Feature** : [F3 — Parcours de bienvenue](f3-feature-onboarding-bienvenue.md)
> **Date** : 2026-05-25
> **Testeur** : _____________

## Prérequis

```bash
# Repartir d'un état propre puis démarrer (proche de la prod)
pnpm dev:clean
# Attendre les logs de démarrage (API sur :3000, frontend sur :5173)
```

**Création d'un jeton d'invitation** : après un `dev:clean` (volumes purgés), la DB est vide. Créer un jeton via le script seed :

```bash
pnpm seed
# Crée le jeton par défaut "juju-aviatrice-2026" (max 3 utilisations)
```

**Remise à zéro entre scénarios** :

1. Réinitialiser l'état onboarding en DB : `pnpm reset:onboarding`
2. Supprimer la clé `device-id` du localStorage (DevTools → Application → Local Storage)
3. Recharger avec le jeton créé : `http://localhost:5173/?invite=juju-aviatrice-2026`

## Scénarios

### 1. Parcours onboarding complet (S1 + S2 + S3)

**Critères Gherkin** : GIVEN un device nouvellement enregistré (onboarding non commencé) WHEN Juju ouvre l'app pour la première fois THEN l'écran FO-01 affiche "Salut Juju" avec l'avatar au stade 1, sans formulaire ni demande d'inscription

**Actions** :

1. Supprimer `device-id` du localStorage
2. Ouvrir `http://localhost:5173/?invite=<JETON>`
3. Vérifier : écran FO-01 avec texte "Salut Juju"
4. Vérifier : avatar visible au stade 1
5. Vérifier : boutons "Continuer" et "Passer" présents
6. Vérifier : aucun formulaire ni champ de saisie

**Résultat attendu** : écran FO-01 affiche "Salut Juju", avatar stade 1, boutons "Continuer" et "Passer", aucun formulaire d'inscription

- [x] OK

### 2. Navigation FO-01 → FO-02 (S1 + S2)

**Critères Gherkin** : GIVEN l'écran FO-01 affiché WHEN Juju clique "Continuer" THEN l'écran FO-02 affiche les deux piliers (Sciences et Psychotechniques) avec un visuel sobre

**Actions** :

1. Depuis FO-01, cliquer "Continuer"
2. Vérifier : écran FO-02 avec titre "Deux terrains d'entraînement"
3. Vérifier : 2 cartes affichées — "Sciences" et "Psychotechniques" avec descriptions
4. Vérifier : mention "D'autres contenus arriveront au fil du temps."
5. Vérifier : boutons "Continuer" et "Passer" présents

**Résultat attendu** : écran FO-02 affiche exactement 2 piliers avec leurs noms et descriptions, boutons "Continuer" et "Passer" visibles

- [x] OK

### 3. Navigation FO-02 → FO-03 (S2 + S3)

**Critères Gherkin** : GIVEN l'étape 2 de l'onboarding complétée WHEN Juju arrive sur l'écran FO-03 THEN une flashcard maths est affichée avec un message positif

**Actions** :

1. Depuis FO-02, cliquer "Continuer"
2. Vérifier : écran FO-03 avec indicateur "Onboarding 3/3"
3. Vérifier : titre "Première flashcard, juste pour goûter"
4. Vérifier : flashcard affichée avec "Quelle est la dérivée de x² ?"
5. Vérifier : indication "Tape pour retourner" visible

**Résultat attendu** : écran FO-03 affiche l'indicateur "3/3", le titre attendu, et une flashcard avec la question "Quelle est la dérivée de x² ?" et l'instruction de retournement

- [x] OK

### 4. Retournement flashcard et progression (S3)

**Critères Gherkin** : GIVEN la flashcard affichée sur FO-03 WHEN Juju retourne la carte THEN la réponse s'affiche avec un feedback neutre, puis après continuation l'avatar marque une micro-progression

**Actions** :

1. Taper/cliquer sur la flashcard
2. Vérifier : face réponse affichée avec "Réponse" + "2x"
3. Vérifier : correction affichée "La dérivée de xⁿ est nxⁿ⁻¹. Ici n = 2, donc 2x¹ = 2x."
4. Vérifier : aucun verdict "bonne réponse" / "mauvaise réponse"
5. Cliquer "Continuer"
6. Vérifier : phase progression avec texte "Ton avatar a fait un premier pas"
7. Vérifier : mention "Stade 1+" visible

**Résultat attendu** : feedback neutre (pas de verdict), puis micro-progression avatar affichant "Ton avatar a fait un premier pas" et "Stade 1+"

- [x] OK

### 5. Arrivée sur accueil FO-04 (S3 + S5)

**Critères Gherkin** : GIVEN l'onboarding terminé (flashcard + progression) WHEN Juju clique "C'est parti" THEN l'écran FO-04 affiche l'avatar, une suggestion d'activité et un bouton Go sans scroll

**Actions** :

1. Depuis la phase progression, cliquer "C'est parti"
2. Vérifier : écran FO-04 affiché
3. Vérifier : avatar visible
4. Vérifier : suggestion d'activité en 1 ligne
5. Vérifier : bouton "Go" présent
6. Vérifier : bouton "Changer d'activité" présent
7. Vérifier : compteurs sessions = 0, exercices = 0
8. Vérifier : tout le contenu visible sans scroll (au-dessus de la ligne de flottaison sur un écran 375×667)

**Résultat attendu** : écran FO-04 complet avec avatar, suggestion, bouton "Go", bouton "Changer d'activité", compteurs à 0, le tout sans scroll sur un viewport mobile standard

- [x] OK

### 6. Saut depuis FO-01 (S4)

**Critères Gherkin** : GIVEN l'onboarding en cours à l'étape 1 (FO-01) WHEN Juju tape "Passer" THEN l'onboarding est marqué comme sauté et Juju arrive sur l'écran d'accueil FO-04

**Actions** :

1. Supprimer `device-id` du localStorage et recharger avec invite
2. Depuis FO-01, cliquer "Passer"
3. Vérifier : arrivée directe sur FO-04
4. Vérifier : aucun message de reproche ou culpabilisant
5. Vérifier : avatar au stade 1 (pas de progression)

**Résultat attendu** : écran FO-04 immédiat, avatar stade 1, aucun message négatif

- [x] OK

### 7. Saut depuis FO-02 (S4)

**Critères Gherkin** : GIVEN l'onboarding en cours à l'étape 2 (FO-02) WHEN Juju tape "Passer" THEN l'onboarding est marqué comme sauté et Juju arrive sur FO-04

**Actions** :

1. Supprimer `device-id`, recharger avec invite, avancer jusqu'à FO-02
2. Cliquer "Passer"
3. Vérifier : arrivée directe sur FO-04
4. Vérifier : aucun message de reproche

**Résultat attendu** : saut à l'étape 2 mène directement à FO-04 sans conséquence ni message négatif

- [x] OK

### 8. Interruption et réouverture (S4)

**Critères Gherkin** : GIVEN l'onboarding en cours WHEN Juju ferme l'application THEN la prochaine ouverture mène directement à l'écran d'accueil FO-04 sans message sur l'onboarding abandonné

**Actions** :

1. Supprimer `device-id`, recharger avec invite, avancer jusqu'à FO-02
2. Fermer l'onglet (ou recharger la page sans paramètre invite)
3. Rouvrir `http://localhost:5173/`
4. Vérifier : arrivée sur FO-04 (pas de reprise de l'onboarding)
5. Vérifier : aucun rappel ni message sur l'onboarding interrompu
6. Vérifier : avatar au stade 1

**Résultat attendu** : interruption = accueil direct FO-04, avatar stade 1, aucun rappel d'onboarding

- [x] OK

### 9. Réouverture post-onboarding (S4 + S5)

**Critères Gherkin** : GIVEN l'onboarding terminé WHEN Juju rouvre l'app THEN l'écran FO-04 est affiché directement sans ré-afficher l'onboarding

**Actions** :

1. Compléter l'onboarding entièrement (FO-01 → FO-02 → FO-03 → FO-04)
2. Fermer l'onglet
3. Rouvrir `http://localhost:5173/`
4. Vérifier : FO-04 affiché directement
5. Vérifier : aucun écran d'onboarding ne réapparaît

**Résultat attendu** : réouverture = FO-04 immédiat, l'onboarding ne se rejoue pas

- [x] OK

## Vérification API directe

```bash
# Vérifier l'état onboarding d'un device
curl -s http://localhost:3000/trpc/onboarding.obtenirEtat \
  -H "X-Device-Id: <DEVICE_ID>" | jq .
# Attendu : { "result": { "data": { "etape": "termine" | "bienvenue" | ... } } }

# Vérifier la flashcard échantillon
curl -s http://localhost:3000/trpc/contenu.obtenirFlashcardEchantillon | jq .
# Attendu : { "result": { "data": { "question": "Quelle est la dérivée de x² ?", "reponse": "2x", ... } } }
```

- [x] OK — `onboarding.obtenirEtat` retourne l'état correct
- [x] OK — `contenu.obtenirFlashcardEchantillon` retourne la flashcard maths

## Vérification post-deploy

> Vérifications à effectuer après déploiement en production.

### Étape 1 — Vérifier l'API

```bash
curl -s https://api.juju-aviatrice.uk/health | jq .
# Attendu : status "ok"

curl -s https://api.juju-aviatrice.uk/trpc/contenu.obtenirFlashcardEchantillon | jq .
# Attendu : réponse JSON avec question/réponse flashcard
```

- [x] OK — API production accessible et healthcheck OK
- [x] OK — Flashcard échantillon retournée correctement

### Étape 2 — Préparer un jeton d'invitation utilisable

Se connecter au VPS :

```bash
ssh juju-vps
```

Vérifier les jetons existants :

```bash
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api sqlite3 ./data/juju-aviatrice.sqlite \
  'SELECT token, utilisations, max_utilisations FROM invite_tokens;'
```

**Lecture du résultat** — le format est `token|utilisations|max_utilisations` :

| Situation | Exemple affiché | Action |
|---|---|---|
| Jeton avec places restantes | `juju-prod-2026\|1\|5` (1 sur 5 utilisé) | Noter le nom du jeton, l'utiliser à l'étape 4 |
| Jeton épuisé | `juju-prod-2026\|5\|5` (5 sur 5 utilisé) | Remettre le compteur à zéro (voir ci-dessous) |
| Aucun jeton | Résultat vide | Créer un jeton (voir ci-dessous) |

**Si le jeton est épuisé** — remettre le compteur à zéro (remplacer `<JETON>` par le nom du jeton affiché par le SELECT) :

```bash
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api sqlite3 ./data/juju-aviatrice.sqlite \
  'UPDATE invite_tokens SET utilisations = 0 WHERE token = "<JETON>";'
```

**Si aucun jeton n'existe** — en créer un :

```bash
docker compose -f /opt/juju-aviatrice/docker-compose.prod.yml \
  exec api pnpm seed
# Crée "juju-aviatrice-2026" avec max 3 utilisations
```

Quitter la session SSH :

```bash
exit
```

- [x] OK — Jeton d'invitation disponible avec au moins 1 utilisation restante

### Étape 3 — S'assurer que le device de test est vierge

Si le navigateur a déjà un `device-id` enregistré en production, l'app affichera FO-04 directement au lieu de l'onboarding. Deux options :

- **Option A** : supprimer `device-id` du localStorage (DevTools → Application → Local Storage → `https://app.juju-aviatrice.uk` → supprimer la clé `device-id`)
- **Option B** : ouvrir une fenêtre de navigation privée

### Étape 4 — Tester le parcours frontend

Ouvrir `https://app.juju-aviatrice.uk/?invite=<JETON>` (remplacer `<JETON>` par le jeton vérifié à l'étape 2).

- [ ] OK — Écran FO-01 "Salut Juju" s'affiche
- [ ] OK — Parcours complet FO-01 → FO-02 → FO-03 → FO-04 fonctionne
- [ ] OK — Bouton "Passer" mène à FO-04 sans erreur
- [ ] OK — Réouverture post-onboarding affiche FO-04 directement

## Résultat

- [ ] Tous les scénarios locaux validés
- [ ] Vérifications API directes validées
- [ ] Vérifications post-deploy validées
- [ ] Aucun message culpabilisant détecté
- [ ] Zones tactiles ≥ 44×44px vérifiées visuellement
- **Testeur** : _____________
- **Date** : _____________
