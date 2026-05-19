# Feature : Mode chronométré

## Description

QCM sous chronomètre, proposé après une séquence sans chrono (J3 étape 6) ou sélectionnable dans le choix d'activité. Le chrono est paramétrable, visuellement discret (pas de tic-tac, pas de clignotement), avec une durée par défaut indulgente. Le récap est factuel (N justes sur M, en X min Y) sans note /N. Le mode chrono est optionnel — le refus est sans conséquence.

## Critère de complétion

1. Proposition chrono (FO-12) affichée après une séquence psy sans chrono, déclinable
2. Durée ajustable par pas de 30s, défaut indulgent (2 min 30 pour 5 questions)
3. Chrono visible mais sobre pendant le QCM — pas de tic-tac, pas de clignotement
4. Récap factuel : justes/total + temps, sans note ni pourcentage
5. Mode chrono activable aussi sur les QCM sciences

## Priorité

- [x] Must have

## Exigences couvertes

- [REQ-SESSION-004] : Mode sans chronomètre d'abord (le chrono arrive après)
- [REQ-SESSION-005] : Mode chronométré paramétrable et discret
- [REQ-SESSION-007] : Scoring non-stigmatisant (récap factuel)

## Dépendances

- [Feature Session d'entraînement](f4-feature-session-entrainement.md) : composant QCMScreen (FO-06) étendu avec mode chrono
- [Feature Découverte psychotechniques](f6-feature-decouverte-psy.md) : transition depuis la séquence sans chrono

## Écrans et API concernés

### Écrans

- **Proposition Chrono (FO-12)**
  - Spec : [spec-ecran-proposition-chrono.md](../../03-design/3-wireframes/spec-ecran-proposition-chrono.md)
  - Wireframe HTML : [fo-12-proposition-chrono.html](../../03-design/3-wireframes/html-wireframes/fo-12-proposition-chrono.html)

- **QCM (FO-06)** — mode chrono activé
  - Spec : [spec-ecran-qcm.md](../../03-design/3-wireframes/spec-ecran-qcm.md)

### API

- **entrainement.demarrerMiniSession** : [entrainement.md](../../03-design/4-api/entrainement.md) — avec modeChrono = true et dureeChrono

---

## Stories

### S1 : Proposition QCM chrono (FO-12)

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** qu'on me propose un essai chronométré après mes exercices sans chrono,
**afin de** découvrir le format concours quand je me sens prête, sans obligation.

**Critères d'acceptation :**

```gherkin
GIVEN une séquence d'exercices psy sans chrono terminée
WHEN l'écran FO-12 s'affiche
THEN la durée par défaut est 2 min 30 pour 5 questions, ajustable par pas de ±30s
```

```gherkin
GIVEN l'écran FO-12 affiché
WHEN Juju tape "Plus tard"
THEN elle arrive sur le récap FO-13 sans message de reproche ni relance
```

```gherkin
GIVEN l'écran FO-12 affiché
WHEN Juju ajuste la durée et tape "Lancer le chrono"
THEN une mini-session QCM chrono démarre avec la durée choisie
```

**Implémentation :**

- [ ] Frontend : composant PropositionChronoScreen (FO-12) — slider durée ±30s, bornes 30s-10min
- [ ] Frontend : navigation vers QCM chrono ou récap selon le choix
- [ ] Tests : durée par défaut, ajustement, choix lancer/plus tard
- **Statut** : À faire

---

### S2 : Affichage chrono discret dans le QCM

**Type** : US — **Estimation** : M (3 pts)

**En tant que** Juju,
**je veux** voir un chronomètre sobre pendant mon QCM chronométré,
**afin de** m'habituer au format concours sans stress visuel supplémentaire.

**Critères d'acceptation :**

```gherkin
GIVEN un QCM lancé en mode chrono
WHEN le chrono tourne
THEN le temps restant est affiché en format M:SS, sobre, sans animation pulsante ni couleur alarmante
```

```gherkin
GIVEN le chrono en cours
WHEN le temps est écoulé
THEN le QCM se termine sans alerte sonore — transition directe vers le récap
```

```gherkin
GIVEN un QCM chrono terminé (temps écoulé ou tous les exercices faits)
WHEN le récap s'affiche
THEN le résultat est factuel : "N justes sur M, en X min Y" — pas de note /N ni pourcentage
```

**Implémentation :**

- [ ] Frontend : extension QCMScreen (FO-06) avec mode chrono (affichage timer M:SS)
- [ ] Frontend : timer sobre — pas de tic-tac, pas de rouge, pas de clignotement dernier tiers
- [ ] Frontend : fin de temps → terminer la session proprement, transition vers récap
- [ ] Backend : demarrerMiniSession avec modeChrono=true et dureeChrono
- [ ] Tests : affichage chrono, fin de temps, récap factuel, pas d'alerte
- **Statut** : À faire

---

### S3 : Activation chrono depuis le choix d'activité

**Type** : US — **Estimation** : S (2 pts)

**En tant que** Juju,
**je veux** pouvoir lancer un QCM chronométré directement depuis le choix d'activité,
**afin de** m'entraîner en conditions chrono quand je le décide, sur sciences ou psy.

**Critères d'acceptation :**

```gherkin
GIVEN l'écran FO-09 (choix d'activité)
WHEN Juju sélectionne un chapitre au format QCM
THEN une option "Avec chrono" est proposée avec le réglage de durée
```

```gherkin
GIVEN le choix "Avec chrono" sélectionné
WHEN Juju lance la session
THEN la mini-session démarre en mode chronométré avec la durée choisie
```

**Implémentation :**

- [ ] Frontend : option chrono dans le flux de sélection FO-09 (toggle + durée)
- [ ] Frontend : passage du modeChrono et dureeChrono à demarrerMiniSession
- [ ] Tests : activation chrono, durée transmise, session lancée en mode chrono
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Proposition QCM chrono (FO-12) | US | S (2 pts) | À faire |
| S2 | Affichage chrono discret dans le QCM | US | M (3 pts) | À faire |
| S3 | Activation chrono depuis le choix d'activité | US | S (2 pts) | À faire |

**Total** : 3 stories — 7 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J3 (étape 6-7) | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| bc-entrainement | [bc-entrainement](../../03-design/1-domain/bc-entrainement.md) |
| modèle MiniSession (mode_chrono, duree_chrono) | [model-mini-session](../../03-design/1-domain/models/model-mini-session.md) |
| exigences session | [req-session](../../03-design/0-requirements/fonctionnelles/req-session.md) |
| wireframes FO-12, FO-06 | [navigation](../../03-design/3-wireframes/navigation.md) |
| API entrainement | [entrainement.md](../../03-design/4-api/entrainement.md) |
