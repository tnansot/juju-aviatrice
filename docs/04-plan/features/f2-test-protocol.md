# Protocole de test manuel — F2 Accès sécurisé par device

> **Feature** : [F2 — Accès sécurisé par device](f2-feature-auth-device.md)
> **Date** : 2026-05-20

## Prérequis

- Démarrer l'environnement local → [Runbook — Test manuel §1](../../06-run/runbook-test-manuel.md#1-démarrer-lenvironnement-de-test-local).
- Créer le jeton `juju-aviatrice-2026` (max 3 utilisations) → [§2](../../06-run/runbook-test-manuel.md#2-créer-un-jeton-dinvitation-local).

**Spécifique F2** : ces scénarios testent l'accès par device en amont de l'onboarding. Partir d'un navigateur propre (navigation privée ou localStorage vidé, cf. [§3](../../06-run/runbook-test-manuel.md#3-remettre-létat-à-zéro-local)) pour le scénario 1.

## Scénarios

### 1. Device inconnu sans jeton → écran FO-14

- **Prérequis** : navigateur propre (navigation privée ou localStorage vidé)
- **Action** : ouvrir `http://localhost:5173`
- **Attendu** : écran "Accès non disponible" avec icône cadenas, message sobre, hint sur le lien d'invitation
- **Vérifier** : aucune donnée de contenu ni de progression exposée
- [x] **OK**

### 2. Device inconnu + jeton valide → accès autorisé

- **Action** : ouvrir `http://localhost:5173?invite=juju-aviatrice-2026`
- **Attendu** : page "Juju l'aviatrice" s'affiche, le `?invite=...` est retiré de l'URL
- **Vérifier** : `localStorage` contient la clé `device-id` avec un UUID v4
- [x] **OK**

### 3. Device connu (visite ultérieure) → reconnu automatiquement

- **Action** : fermer et rouvrir `http://localhost:5173` (même navigateur)
- **Attendu** : reconnu sans jeton, page "Juju l'aviatrice" directement
- [x] **OK**

### 4. Header X-Device-Id sur chaque requête

- **Action** : ouvrir DevTools > Network, observer les requêtes tRPC
- **Attendu** : chaque requête porte le header `X-Device-Id` avec l'UUID stocké
- [x] **OK**

### 5. Jeton épuisé → accès refusé

- **Action** : utiliser le jeton 3 fois (3 navigateurs / profils différents), tenter un 4e
- **Attendu** : écran FO-14 "Accès non disponible" pour le 4e device
- [x] **OK**

### 6. Vérification API directe

> Conventions tRPC (encodage superjson, query vs mutation) : voir [Runbook §5](../../06-run/runbook-test-manuel.md#5-conventions-dappel-api-trpc-curl).

```bash
# Device inconnu (input wrappé superjson)
curl -s "http://localhost:3000/trpc/identite.verifierDevice?input=%7B%22json%22%3A%7B%22deviceId%22%3A%2200000000-0000-0000-0000-000000000000%22%7D%7D"
# Attendu : {"result":{"data":{"json":{"valide":false}}}}

# Enregistrement avec jeton
curl -s -X POST http://localhost:3000/trpc/identite.enregistrerDevice \
  -H "Content-Type: application/json" \
  -d '{"json":{"deviceId":"11111111-1111-1111-1111-111111111111","jetonInvitation":"juju-aviatrice-2026"}}'
# Attendu : {"result":{"data":{"json":{"enregistre":true,"premierAcces":true}}}}
```

- [x] **OK**

## Résultat

- [x] Tous les scénarios passent
- **Testeur** : Papa
- **Date du test** : 20 mai 2026
