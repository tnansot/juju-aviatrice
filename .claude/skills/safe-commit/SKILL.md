---
name: safe-commit
description: 'Commit avec audit de sensibilité PUIS push systématique. Inspecte le diff staged+unstaged à la recherche de données personnelles (PII de Juju et de sa famille), de secrets techniques (tokens, clés API, clés privées, credentials CF/GitHub/Giscus) et d''autres données sensibles (médicales, scolaires, financières, aviation, infra). Bloque ou avertit avant de lancer git commit. Si le commit passe, pousse automatiquement sur origin (politique standing autorisée par le user pour ce repo). Use when the user asks to commit changes ("commit", "fais un commit", "commit ça", "prépare un commit", "push").'
---

# safe-commit — Commit avec audit de données sensibles

## Pourquoi ce skill existe

Le repo `juju-aviatrice` est **public** sur GitHub. Tout commit est visible immédiatement et **reste dans l'historique git pour toujours** — un `git revert` ne supprime pas, et réécrire l'historique (BFG, `git filter-repo`) après coup est lourd et ne rattrape pas ce qui a déjà été cloné/indexé.

Il y a donc un enjeu réel à ne pas committer :

- **Des données personnelles de Juju**, qui est mineure
- **Des secrets techniques** (tokens, clés API, credentials) exploitables
- **D'autres données sensibles** propres au projet (médical aéronautique, scolaire, concours, famille)

Ce skill remplace le workflow commit par défaut dès que l'utilisateur demande de committer. **Ne jamais le court-circuiter**, même pour un diff trivial — c'est la discipline qui protège, pas le zèle ponctuel.

### Politique de push automatique

Le user a explicitement demandé (autorisation standing pour ce repo) que **chaque commit déclenche automatiquement un `git push`** vers `origin`. Le push n'est donc PAS une action à confirmer séparément — dès que le commit passe l'audit et est exécuté, le push suit immédiatement dans la foulée.

Conséquence : **l'audit est la dernière ligne de défense**. Une fois que le rapport d'audit est validé et que le commit est lancé, le contenu est sur internet dans la seconde qui suit. Il n'y a pas de fenêtre "commité mais pas encore public" à exploiter pour un rattrapage. Cela rend l'étape d'audit d'autant plus critique — ne jamais la court-circuiter sous prétexte que "on pourra corriger avant de pusher".

Cette politique ne s'applique qu'à ce repo (`juju-aviatrice`). Les `--force`, `--force-with-lease` sur `main` et autres pushes destructifs restent interdits par défaut sans demande explicite — voir la liste des interdits en fin d'Étape 5.

## Workflow

### Étape 1 — Contexte

Exécuter en parallèle, avec l'outil Bash :

- `git status` (jamais `-uall`)
- `git diff` (non-staged)
- `git diff --cached` (staged)
- `git log --oneline -5` (pour aligner le style du message)

Si aucun changement n'est à committer, stopper et le dire. Ne pas créer de commit vide.

### Étape 2 — Audit de sensibilité

L'audit porte sur **les lignes ajoutées dans le diff** (pas les lignes supprimées, qui partent). Parcourir chaque hunk et appliquer les six catégories ci-dessous. Pour chaque finding, noter `fichier:ligne — catégorie — motif détecté`.

#### Catégorie A — Fichiers bloqués par nom

Bloquer systématiquement si l'un de ces chemins apparaît dans le diff :

- `.env`, `.env.local`, `.env.production`, `.env.*` — **sauf** `.env.example`, `.env.sample`, `.env.template`
- `credentials.json`, `secrets.json`, `serviceAccountKey.json`, `gcp-key.json`, `firebase-adminsdk*.json`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.keystore`, `*.jks`
- `id_rsa`, `id_ed25519`, `id_ecdsa`, `id_dsa` (clés privées). Les `.pub` correspondants sont OK.
- `.aws/credentials`, `.ssh/<fichier>` (sauf `known_hosts`, `authorized_keys` s'ils sont explicitement voulus)
- Tout fichier dans un dossier nommé `secrets/`, `private/`, `confidential/`, `.secrets/`

#### Catégorie B — Secrets techniques dans le contenu

Grep sur les lignes ajoutées. Les patterns ci-dessous sont indicatifs — si un match est trouvé, c'est **bloquant sauf preuve du contraire** (placeholder, test fixture, valeur d'exemple évidente).

| Type | Pattern |
|---|---|
| GitHub PAT classic | `ghp_[A-Za-z0-9]{36}` |
| GitHub fine-grained PAT | `github_pat_[A-Za-z0-9_]{80,}` |
| GitHub OAuth / app / server tokens | `gh[osur]_[A-Za-z0-9]{36,}` |
| GitHub webhook secret (contexte) | `webhook_secret\s*=\s*["'][^"']+["']` |
| OpenAI API key | `sk-[A-Za-z0-9]{20,}` |
| Anthropic API key | `sk-ant-[A-Za-z0-9_-]{20,}` |
| Google API key | `AIza[A-Za-z0-9_-]{35}` |
| AWS access key ID | `AKIA[A-Z0-9]{16}` |
| AWS secret (contexte) | 40 car. base64 à proximité de `aws_secret_access_key` |
| Slack token | `xox[baprs]-[A-Za-z0-9-]{10,}` |
| Stripe | `sk_live_[A-Za-z0-9]{24,}` |
| Cloudflare API token | `[A-Za-z0-9_-]{40,}` à proximité de `CF_API_TOKEN`, `CLOUDFLARE_API_TOKEN`, `cloudflare_api_token` |
| Cloudflare Global API Key | 37 car. hex à proximité de `CF_API_KEY`, `X-Auth-Key` |
| JWT | `eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+` |
| Clé privée PEM | `-----BEGIN (RSA\|OPENSSH\|DSA\|EC\|PGP\|ENCRYPTED\| )?PRIVATE KEY-----` |
| URL avec credentials | `https?://[^\s:@/]+:[^\s@/]+@` |
| Connection string DB | `(mysql\|postgres\|postgresql\|mongodb\|redis)://[^:]+:[^@]+@` |
| Basic auth header | `Authorization:\s*Basic\s+[A-Za-z0-9+/=]+` |
| Bearer token | `Authorization:\s*Bearer\s+[A-Za-z0-9._-]{20,}` |

Pour les assignements génériques type `password = "..."`, `api_key = "..."`, `secret = "..."`, `token = "..."` : warning, sauf si la valeur est manifestement un placeholder (`<YOUR_KEY>`, `changeme`, `xxx`, `...`, `REPLACE_ME`, `TODO`).

**Cas Giscus** : les valeurs `data-repo-id` et `data-category-id` exposées par le générateur giscus.app sont **publiques par design** (elles sont visibles dans le HTML rendu du site) — ce n'est pas un secret, juste un identifiant. Ne pas bloquer. En revanche, `data-repo="<OWNER>/juju-aviatrice"` révèle le nom du propriétaire GitHub : OK car le repo est public, le login l'est aussi.

#### Catégorie C — Données personnelles (PII)

Contextuel. Le repo est familial mais public → règles :

**Autorisé (ne pas bloquer)** :
- Le prénom "Juju" (pseudo, déjà public dans le repo)
- Le nom "Nansot Thomas" tel qu'il apparaît dans `git config user.name` (inévitable dans les métadonnées git — impossible à cacher sans changer d'identité git)
- Les emails génériques / d'exemple : `exemple@exemple.com`, `noreply@...`, `user@example.com`

**Warning (signaler, demander confirmation)** :
- Autres prénoms ou surnoms familiaux
- Noms de famille non déjà publics
- Emails perso qui n'apparaissent pas déjà dans git log

**Bloquant** :
- Adresse postale : `\d+\s+(rue|avenue|boulevard|place|chemin|impasse|allée|route|square|cours)\s+` (case-insensitive)
- Téléphone FR : `(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}`
- Numéro de sécurité sociale FR : `[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}`
- Date de naissance précise `JJ/MM/AAAA` ou `JJ-MM-AAAA` avec année ≤ année courante − 5
- N° passeport / CNI dans un contexte évoquant "passeport", "CNI", "carte d'identité", "pièce d'identité"
- Nom d'un établissement scolaire précis que fréquente Juju (lycée X, collège Y) — les références génériques à "son lycée" sont OK
- Bulletins, notes précises, appréciations nominatives

#### Catégorie D — Données sensibles spécifiques au projet

**Médical aéronautique**
- Statut réel d'aptitude EASA Classe 1 de Juju (réussite / échec / réserve / aptitude conditionnelle)
- Conditions médicales personnelles (visuelles, auditives, cardio, psychiques…)
- Contenu du dossier aéromédical, comptes-rendus d'examen
- Médicaments, traitements
→ Bloquant. Les généralités sur le contenu de l'épreuve médicale sont OK (elles sont déjà dans [docs/prerequis/medical-classe-1.md](../../../docs/prerequis/medical-classe-1.md)), seuls les résultats personnels sont sensibles.

**Aviation / PPL**
- Numéro de licence PPL de Juju
- Numéro élève DGAC / numéro FCL
- Logbook détaillé (dates + lieux + aéronefs) → warning, car peut révéler habitudes et localisation
- Immatriculations d'aéronefs régulièrement utilisés → warning

**Scolaire**
- Numéro INE
- Notes précises, résultats du bac, classement
- Appréciations des enseignants
- Nom de l'établissement
→ Bloquant

**Candidatures concours**
- Identifiants candidat ENAC, Air France, DLR, PSY Air France
- Identifiants de session / numéros de dossier
- Résultats individuels aux concours
→ Bloquant

**Familial**
- Noms complets, âges précis, emails, téléphones des autres membres de la famille
- Lieu de résidence (ville OK si générique et ne permet pas l'identification ; adresse précise = bloquant)
→ Warning à bloquant selon la précision

#### Catégorie E — Données financières

Bloquant dans tous les cas :

- IBAN : `[A-Z]{2}\d{2}(?:[\s]?\d{4}){4,6}`
- Numéro de carte bancaire (16 chiffres contigus passant le check de Luhn)
- Couple code banque + guichet + compte
- Montants précis liés à un compte personnel identifiable (solde, virement, etc.)

Les montants génériques des formations (prix ENAC, coût ATPL privé) dans la doc sont évidemment OK.

#### Catégorie F — Identifiants infrastructure

Warning par défaut, bloquant si un contexte d'exploitation est évident :

- Cloudflare Account ID, Zone ID en clair → warning (pas un secret, mais facilite le ciblage en cas de fuite de token ailleurs)
- URLs d'admin internes non publiques (dashboards, pi-hole, NAS, routeur) → bloquant
- IPs privées du réseau domestique (`192.168.*`, `10.*`, `172.16-31.*`) dans un contexte applicatif → warning
- Tunnel tokens Cloudflare, ngrok tokens → bloquant

### Étape 3 — Rapport à l'utilisateur

Toujours présenter le résultat de l'audit AVANT d'exécuter `git commit`, sous cette forme :

```
## Audit de sensibilité

Fichiers scannés : <N>

[si propre]
✅ Aucun finding. Prêt à committer.

[sinon, dans cet ordre]
🚫 Bloquants :
- <fichier>:<ligne> — <catégorie> — <motif>

⚠️  Warnings (à confirmer) :
- <fichier>:<ligne> — <catégorie> — <motif>
```

Puis, selon le résultat :

- **Bloquants présents** → NE PAS committer. Pour chaque bloquant, expliquer comment corriger (retirer la ligne, déplacer la valeur dans un fichier gitignoré type `.env.local`, utiliser une variable d'environnement, etc.). Proposer la correction quand elle est évidente, mais ne pas la faire sans accord. Attendre une nouvelle demande de commit.
- **Warnings seulement** → Lister et demander explicitement : **"Je commit quand même ? (y/n)"**. Ne committer que sur un `y` clair.
- **Propre** → Afficher le message de commit proposé et demander confirmation avant d'exécuter `git commit`.

### Étape 4 — Message de commit

Inspecter `git log --oneline -5` pour caler le style.

Format par défaut :

```
<résumé concis à l'impératif, ≤72 car>

<1-2 phrases optionnelles sur le pourquoi, pas le quoi>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

Langue : FR par défaut (le repo est en FR).

### Étape 5 — Exécution

Une fois l'utilisateur OK :

1. **Stage** — `git add <fichiers spécifiques>`. **Jamais** `git add .` ni `git add -A`. Risque d'embarquer un fichier non tracké non détecté par l'audit.
2. **Commit** — `git commit` via HEREDOC pour préserver le formatting :

```
git commit -m "$(cat <<'EOF'
<message>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

3. **Push** — enchaîner immédiatement avec `git push` (voir "Politique de push automatique" ci-dessus). Utiliser la forme simple `git push` sur la branche courante. Si la branche locale n'a pas d'upstream configuré, utiliser `git push -u origin <branche>` pour l'attacher.
4. **Vérification** — `git status` final pour confirmer que le working tree est clean et que la branche est à jour avec `origin/<branche>`.

Pour minimiser les allers-retours de shell, les étapes 1+2+3 peuvent être chaînées en une seule commande Bash :

```
git add <fichiers> && git commit -m "..." && git push
```

Ainsi, si le commit échoue (ex: hook pre-commit), le push n'est pas tenté.

**Interdits absolus (sauf demande explicite et argumentée de l'utilisateur)** :

- `--no-verify` (bypass des hooks pre-commit)
- `--amend` sur un commit déjà pushé
- `--force`, `--force-with-lease` sur `main`
- `--no-gpg-sign`
- Toute réécriture d'historique après push
- Push sur une branche autre que celle sur laquelle on est (pas de `git push origin foo:bar`)

Si un hook pre-commit échoue, NE PAS amender : corriger le problème, re-stage les fichiers, et créer un **nouveau** commit (le précédent n'a de toute façon pas eu lieu). Le push ne sera tenté qu'une fois le nouveau commit créé.

## Cas particuliers

### "push" comme verbe principal
Si l'utilisateur dit simplement "push", c'est traité comme un synonyme de "commit" : lancer le workflow complet (audit → rapport → confirmation → commit → push auto). Aucune confirmation séparée du push, puisque le push est de toute façon systématique après chaque commit.

### Échec du push
Si `git push` échoue après un commit réussi, NE PAS retenter aveuglément. Diagnostiquer la cause :

- **`rejected: non-fast-forward`** → le remote a des commits que le local n'a pas. Signaler à l'utilisateur, proposer `git pull --rebase` mais ne PAS l'exécuter sans accord (peut créer des conflits à résoudre). Le commit local reste en place, rien n'est perdu.
- **`Could not resolve host` / réseau** → signaler, suggérer de réessayer plus tard avec `git push`. Le commit reste en place.
- **`remote rejected` par un hook de protection** (ex: email non masqué, secret détecté par push protection GitHub, branche protégée) → signaler l'erreur exacte et la raison. Ne pas tenter de contournement (`--no-verify` côté push n'existe pas, `--force` est interdit).
- **Pas d'upstream** → relancer avec `git push -u origin <branche-courante>`.

Dans tous les cas : le commit local reste intact. L'utilisateur peut reprendre le push plus tard une fois le blocage levé.

### "amende le commit précédent"
Si le commit précédent n'a **pas** encore été pushé : audit sur les modifications courantes, puis `git commit --amend`. Si le commit a été pushé : refuser par défaut, expliquer que c'est destructif (les autres clones vont diverger) et demander confirmation explicite.

### "commit --no-verify" / "commit sans vérifier"
Refuser et demander pourquoi. Si la raison est légitime (ex: un hook cassé indépendant du contenu), alors l'audit de sensibilité doit quand même être fait — il est indépendant des hooks git — et seul le `--no-verify` est transmis à la commande git après accord explicite.

### Diff énorme
Si le diff dépasse ~2000 lignes, ne pas renoncer à l'audit. Procéder fichier par fichier. Signaler à l'utilisateur que l'audit prend un moment.

### Fichier binaire / image
Ne pas auditer le contenu binaire mais auditer le **nom** du fichier et le **chemin** (catégorie A). Signaler les photos : une image dans le repo public peut contenir des données EXIF (géolocalisation, modèle d'appareil) — warning, proposer de stripper les EXIF avant commit.

## Limites conscientes

Ce skill fait un audit raisonnable à base de patterns et de jugement contextuel. Il ne remplace pas un scanner dédié (gitleaks, trufflehog, detect-secrets). Pour un niveau de garantie supérieur, ajouter un hook pre-commit `gitleaks` — ce skill peut le suggérer à l'utilisateur la première fois qu'un secret est détecté.

L'audit ne voit **que ce qui est dans le diff courant**. Un secret déjà présent dans l'historique doit être traité séparément (rotation + `git filter-repo` + force push en coordination).
