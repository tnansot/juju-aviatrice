# Feature : Skill entretien jalon M0 (J5)

## Description

Skill Claude Code `/juju-entretien-m0` que Juju lance sur le poste de Papa, dans VSCode avec le plugin Claude Code intégré, après quelques semaines d'usage du prototype M0. Recueil qualitatif structuré sur 7 thèmes (peur psy, messages, progression, envie, avatar, sessions courtes, ouverture libre). Le skill consigne les verbatims dans `cadrage-brouillon/entretien-jalon-M0.md`. Papa dépouille ensuite. Les tensions actées sont hors skill (discussion parent/enfant séparée).

## Critère de complétion

1. Juju lance `/juju-entretien-m0` dans VSCode (plugin Claude Code) sur le poste de Papa → accueil en 2-3 phrases cadrant l'entretien
2. Les 7 thèmes sont couverts en mode semi-structuré (adaptatif, pas formulaire)
3. Les verbatims sont consignés dans `cadrage-brouillon/entretien-jalon-M0.md`
4. Clôture avec récap 3-5 lignes que Juju peut confirmer ou corriger
5. Interruption → état partiel sauvegardé, reprise ou tout recommencer au choix

## Priorité

- [x] Must have

## Exigences couvertes

Ce skill ne correspond pas à des exigences fonctionnelles de l'application mais au KR qualitatif du jalon M0 :

- KR-2.1.4 : Baisse de la peur psy
- KR-3.1.1 : Ressenti messages positifs/neutres/négatifs
- KR-3.1.3 : Suivi de progression — visible/anxiogène/motivant
- KR-4.1.3 : Envie de revenir et plaisir

## Dépendances

- Prototype M0 déployé et utilisé ~3-4 semaines par Juju
- VSCode avec le plugin Claude Code installé sur le poste de Papa, repo cloné avec accès au skill

## Écrans et API concernés

Pas d'écran applicatif — le skill fonctionne dans VSCode via le plugin Claude Code sur le poste de Papa.

---

## Stories

### S1 : Script conversationnel du skill

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Rédiger le script d'animation semi-structuré couvrant les 7 thèmes, avec questions d'amorçage et relances adaptatives.
**Justification** : Le skill doit être conversationnel (pas un formulaire), aligné sur la charte de ton, et couvrir les KRs ciblés.

**Critères d'acceptation :**

```gherkin
GIVEN le script du skill rédigé
WHEN on vérifie la couverture
THEN les 7 thèmes sont couverts avec 1-3 questions par thème et des relances adaptatives
```

```gherkin
GIVEN une question du script
WHEN on vérifie la formulation
THEN aucune question n'est culpabilisante, scolaire, ou utilise un ton parental
```

```gherkin
GIVEN le script
WHEN on vérifie la structure
THEN il commence par une question d'ouverture ouverte et se termine par un récap confirmable
```

**Implémentation :**

- [ ] Rédaction du script d'animation : accueil, 7 thèmes, relances, clôture
- [ ] Validation charte de ton (formulations neutres, pas de jugement)
- [ ] Questions adaptatives (creuser selon les réponses, ne pas insister si réponse courte)
- [ ] Gabarit du fichier de sortie (`entretien-jalon-M0.md`)
- **Statut** : À faire

---

### S2 : Implémentation du skill Claude Code

**Type** : TS — **Estimation** : M (3 pts)

**Objectif** : Créer le skill `.claude/skills/juju-entretien-m0/` exécutable via `/juju-entretien-m0`.
**Justification** : Le skill doit être fonctionnel dans Claude Code, consigner progressivement, et gérer les interruptions.

**Critères d'acceptation :**

```gherkin
GIVEN Juju lance /juju-entretien-m0
WHEN l'accueil s'affiche
THEN un message de 2-3 phrases explique le cadre, la confidentialité, et la liberté d'arrêter
```

```gherkin
GIVEN l'entretien en cours
WHEN Juju répond à chaque thème
THEN le skill consigne progressivement dans cadrage-brouillon/entretien-jalon-M0.md
```

```gherkin
GIVEN Juju interrompt l'entretien
WHEN elle relance le skill plus tard
THEN elle peut reprendre où elle en était ou tout recommencer
```

**Implémentation :**

- [ ] Créer `.claude/skills/juju-entretien-m0/SKILL.md` avec le script d'animation
- [ ] Consignation progressive dans `cadrage-brouillon/entretien-jalon-M0.md`
- [ ] Gestion de l'interruption : marqueur « interrompu à tel thème » + reprise
- [ ] Clôture : récap 3-5 lignes, confirmation Juju, remerciement sobre
- [ ] Tests : exécution complète, interruption/reprise, fichier de sortie correct
- **Statut** : À faire

---

### S3 : Préparation du poste de Papa pour l'entretien

**Type** : TS — **Estimation** : S (2 pts)

**Objectif** : Configurer VSCode avec le plugin Claude Code sur le poste de Papa pour que Juju puisse lancer le skill en autonomie.
**Justification** : J5 est inopérant sans le plugin Claude Code configuré avec accès au skill sur le poste de Papa.

**Critères d'acceptation :**

```gherkin
GIVEN le poste de Papa avec VSCode et le plugin Claude Code
WHEN Papa ouvre le projet dans VSCode
THEN le skill /juju-entretien-m0 est disponible et fonctionnel
```

```gherkin
GIVEN le plugin Claude Code configuré sur le poste de Papa
WHEN Juju lance /juju-entretien-m0 dans VSCode
THEN le skill démarre sans intervention de Papa
```

**Implémentation :**

- [ ] Installation du plugin Claude Code dans VSCode sur le poste de Papa
- [ ] Vérification que le repo est cloné et à jour avec le skill disponible
- [ ] Test de lancement du skill par Juju (autonomie sans aide de Papa)
- **Statut** : À faire

---

## Résumé

| # | Story | Type | Estimation | Statut |
|---|-------|------|------------|--------|
| S1 | Script conversationnel du skill | TS | M (3 pts) | À faire |
| S2 | Implémentation du skill Claude Code | TS | M (3 pts) | À faire |
| S3 | Préparation du poste de Papa pour l'entretien | TS | S (2 pts) | À faire |

**Total** : 3 stories — 8 points

---

**Statut** : À faire

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| journey J5 | [Entretien jalon M0](../../02-discovery/journeys/journey-entretien-jalon-m0.md) |
| persona Juju (feedback autonome) | [Persona Juju](../../02-discovery/personas/persona-juju-utilisatrice.md) |
| persona Papa (posture non-surveillante) | [Persona Papa](../../02-discovery/personas/persona-papa-porteur.md) |
| OKRs KR-2.1.4, KR-3.1.1, KR-3.1.3, KR-4.1.3 | [OKRs](../../01-strategy/okrs.md) |
| initiative I-3.1.5 (recalibrée M0) | [Initiatives](../../01-strategy/initiatives.md) |
| entretien initial (cadrage-brouillon) | [besoins-juju.md](../../cadrage-brouillon/besoins-juju.md) |
