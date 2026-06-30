# Protocole de test manuel — F6 Découverte psychotechniques

> **Feature** : [F6 — Découverte psychotechniques](f6-feature-decouverte-psy.md)
> **Date** : 2026-06-30
> **Testeur** : _____________

## Prérequis

Procédures communes dans le [Runbook — Test manuel](../../06-run/runbook-test-manuel.md) :

- Démarrer l'environnement local → [§1](../../06-run/runbook-test-manuel.md#1-démarrer-lenvironnement-de-test-local).
- Créer le jeton → [§2](../../06-run/runbook-test-manuel.md#2-créer-un-jeton-dinvitation-local).
- Remise à zéro → [§3](../../06-run/runbook-test-manuel.md#3-remettre-létat-à-zéro-local).
- Récupérer le `device-id` → [§4](../../06-run/runbook-test-manuel.md#4-récupérer-le-device-id).
- Conventions curl tRPC → [§5](../../06-run/runbook-test-manuel.md#5-conventions-dappel-api-trpc-curl).

**Spécifique F6** :

- Pour rejouer le **premier accès psy** (afficher FO-10), réinitialiser l'onboarding (`pnpm reset:onboarding` — supprime aussi `premier_acces_psy_fait`), puis recharger.
- Atteindre l'écran de choix d'activité FO-09 : compléter ou passer l'onboarding, puis depuis l'accueil taper **Changer d'activité**.

## Scénarios

### 1. Premier accès psy → écran de bienvenue FO-10 (S1)

**Critères Gherkin** : GIVEN le pilier Psy n'a jamais été visité (premier_acces_psy = false) WHEN Juju choisit Psychotechniques dans FO-09 THEN FO-10 affiche les 2 types (Logique + Calcul mental) avec Logique recommandée en 1er.

**Actions** :

1. Réinitialiser l'onboarding ([§3](../../06-run/runbook-test-manuel.md#3-remettre-létat-à-zéro-local)) puis recharger avec le jeton.
2. Compléter (ou passer) l'onboarding pour atteindre l'accueil FO-04.
3. Cliquer **Changer d'activité** (FO-09).
4. Cliquer le pilier **Psychotechniques**.
5. Vérifier : le titre « Bienvenue dans la zone Psy » s'affiche.
6. Vérifier : la carte **Logique** porte le badge « Recommandé en 1er » et apparaît avant **Calcul mental**.

**Résultat attendu** : écran FO-10 avec icône, titre « Bienvenue dans la zone Psy », deux cartes (Logique avec badge « Recommandé en 1er », Calcul mental sans badge), note de bas de page sur le libre choix.

- [ ] OK

### 2. Non-réaffichage de FO-10 aux accès suivants (S1)

**Critères Gherkin** : GIVEN le pilier Psy déjà visité (premier_acces_psy = true) WHEN Juju choisit Psychotechniques THEN FO-10 n'apparaît pas — navigation directe vers le choix de type.

**Actions** :

1. Après le scénario 1, choisir un type (ex. Logique) pour marquer le premier accès, puis revenir à l'accueil.
2. Cliquer **Changer d'activité** → **Psychotechniques**.
3. Vérifier : l'écran « Bienvenue dans la zone Psy » **n'apparaît pas**.

**Résultat attendu** : la liste des chapitres psy (Logique, Calcul mental) s'affiche directement, sans l'écran de bienvenue.

- [ ] OK

### 3. Fiche méthode psy FO-11 (S2)

**Critères Gherkin** : GIVEN Juju a choisi le type Logique WHEN la fiche méthode s'affiche (FO-11) THEN 3 sections sont visibles : « C'est quoi ? », « Ce que ça évalue » (3-5 puces), « Comment l'aborder » (3-5 conseils).

**Actions** :

1. Depuis FO-10 (ou la liste de types), choisir **Logique**.
2. Vérifier : l'eyebrow « Fiche méthode — Psychotechniques » et le titre « Logique » s'affichent.
3. Vérifier : les 3 sections « C'est quoi ? », « Ce que ça évalue », « Comment l'aborder » sont présentes.
4. Vérifier : aucun chronomètre n'est affiché sur cet écran.

**Résultat attendu** : fiche méthode lisible avec 3 sections, contenu propre à la logique, boutons « S'entraîner » et « Plus tard ». Pas de chrono.

- [ ] OK

### 4. Exercices psy sans chronomètre + correction (S3)

**Critères Gherkin** : GIVEN le lancement d'exercices psy depuis la fiche WHEN les exercices s'affichent THEN aucun chronomètre n'est visible ; un exercice validé affiche une « Explication ».

**Actions** :

1. Sur la fiche méthode, cliquer **S'entraîner**.
2. Vérifier : un QCM s'affiche **sans chronomètre** (pas de minuteur en haut).
3. Sélectionner une réponse puis cliquer **Valider**.
4. Vérifier : un bloc « Explication » apparaît, puis un bouton **Suivant**.
5. Enchaîner tous les exercices.

**Résultat attendu** : QCM psy sans chrono, correction expliquée (libellée « Explication ») après chaque validation, transition fluide vers l'exercice suivant. Aucun vocabulaire négatif (faux/raté/mauvais).

- [ ] OK

### 5. Récap séquence psy FO-13 + relance autre type (S5)

**Critères Gherkin** : GIVEN la séquence psy terminée WHEN le récap s'affiche (FO-13) THEN une checklist factuelle montre les étapes franchies ; « Essayer l'autre type psy » mène vers la fiche de l'autre type ; « Retour à l'accueil » revient à FO-04.

**Actions** :

1. Terminer tous les exercices du scénario 4.
2. Vérifier : le titre « Premier passage Logique terminé » s'affiche.
3. Vérifier : la checklist montre « Fiche méthode lue » et « N exercices sans chrono » (N = nombre réellement fait), **sans note /N ni pourcentage**.
4. Vérifier : un message sobre « Ton compagnon a exploré un nouveau monde ».
5. Cliquer **Essayer le calcul mental**.
6. Vérifier : la fiche méthode du **Calcul mental** s'affiche (FO-11).
7. Revenir au récap (refaire une séquence) puis cliquer **Retour à l'accueil**.

**Résultat attendu** : récap factuel sans scoring stigmatisant ; le bouton de l'autre type relance le parcours sur Calcul mental ; le retour mène à l'accueil FO-04.

- [ ] OK

### 6. Contenu psy généré — fiches + ≥ 5 QCM par type (S4)

**Critères Gherkin** : GIVEN le contenu psy WHEN je vérifie les 2 types THEN chacun a 1 fiche méthode et ≥ 5 exercices QCM, logique couvrant ≥ 2 typologies.

**Actions** :

1. Parcourir le type **Logique** : vérifier qu'au moins 5 QCM s'enchaînent.
2. Parcourir le type **Calcul mental** : vérifier qu'au moins 5 QCM s'enchaînent.
3. Vérifier (côté contenu) la présence des fiches : `apps/api/src/content/chapitres/psy-logique/fiche-methode.md` et `psy-calcul-mental/fiche-methode.md`.

**Résultat attendu** : 2 fiches méthode présentes ; logique = 5 QCM (typologies série/analogie/syllogisme/déductif), calcul mental = 6 QCM (opérations, pourcentages, fractions, conversions).

- [ ] OK

## Vérification API directe

Exporter `DEVICE_ID` ([§4](../../06-run/runbook-test-manuel.md#4-récupérer-le-device-id)) ; conventions tRPC en [§5](../../06-run/runbook-test-manuel.md#5-conventions-dappel-api-trpc-curl).

```bash
# Fiche méthode logique (query) — attendu : typePsy "logique", 3 sections
curl -s -G http://localhost:3000/trpc/contenu.obtenirFicheMethode \
  --data-urlencode 'input={"json":{"chapitreId":"psy-logique"}}' \
  -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json | {typePsy, cestQuoi, ceQueCaEvalue, commentAborder}'
```

- [ ] OK — `typePsy` = "logique", `ceQueCaEvalue` et `commentAborder` comptent 3 à 5 entrées

```bash
# Chapitre sciences sans fiche → erreur NON_TROUVE
curl -s -G http://localhost:3000/trpc/contenu.obtenirFicheMethode \
  --data-urlencode 'input={"json":{"chapitreId":"maths-geometrie"}}' \
  -H "X-Device-Id: $DEVICE_ID" | jq '.error.json.message'
```

- [ ] OK — message "NON_TROUVE"

```bash
# Marquer le premier accès psy (mutation) — attendu : premierAccesPsyFait true + messageAccueil
curl -s -X POST http://localhost:3000/trpc/onboarding.marquerPremierAccesPsy \
  -H "Content-Type: application/json" -H "X-Device-Id: $DEVICE_ID" \
  -d '{"json":{}}' | jq '.result.data.json'
```

- [ ] OK — `premierAccesPsyFait` = true, `messageAccueil` non vide

## Vérification post-deploy

> Vérifications à effectuer après déploiement en production. Procédures communes (healthcheck, accès VPS/base, jeton prod, device vierge) : voir [Runbook §6](../../06-run/runbook-test-manuel.md#6-vérification-post-déploiement-production).

**API production** (healthcheck → [Runbook §6.1](../../06-run/runbook-test-manuel.md#61-healthcheck-de-lapi)) :

```bash
# Fiche méthode psy en prod (DEVICE_ID prod requis — cf. Runbook §6.4)
curl -s -G https://api.juju-aviatrice.uk/trpc/contenu.obtenirFicheMethode \
  --data-urlencode 'input={"json":{"chapitreId":"psy-calcul-mental"}}' \
  -H "X-Device-Id: $DEVICE_ID" | jq '.result.data.json.typePsy'
```

- [ ] OK — retourne "calcul_mental"

**Frontend production** : ouvrir https://app.juju-aviatrice.uk sur un device vierge ([Runbook §6.4](../../06-run/runbook-test-manuel.md#64-repartir-dun-device--onboarding-vierge-en-prod))

- [ ] OK — premier accès psy : FO-10 « Bienvenue dans la zone Psy » s'affiche avec Logique recommandée
- [ ] OK — fiche méthode FO-11 lisible, exercices psy sans chrono, récap FO-13 sans note /N
- [ ] OK — « Essayer l'autre type psy » relance le parcours sur l'autre type

## Résultat

- [ ] Tous les scénarios locaux validés
- [ ] Vérifications API directes validées
- [ ] Vérifications post-deploy validées
- **Testeur** : _____________
- **Date** : _____________
