# Exigences non-fonctionnelles : Accessibilité

## Thème

**Accessibilité** — Conformité WCAG, lisibilité en fatigue, tailles tactiles, indépendance audio, mode sombre.

### Source

- **Personas** : [Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) (fatigue en semaine, usage smartphone au lit/canapé)
- **Persona Papa** : RGAA/WCAG AA sur l'app (persona Papa, exigences d'accessibilité)

## Exigences

### ENF-ACC-001 [Must] : Conformité WCAG AA

L'application respecte les critères WCAG 2.1 niveau AA. En particulier : ratio de contraste ≥ 4.5:1 pour le texte courant, ≥ 3:1 pour les éléments graphiques et les textes de grande taille.

**Vérification** : audit avec axe-core ou Pa11y → zéro violation de niveau A ou AA.

### ENF-ACC-002 [Must] : Tailles tactiles smartphone ≥ 44×44px

Toutes les zones tactiles (boutons, liens, options de QCM) mesurent au moins 44×44 pixels CSS. Les boutons principaux (Go, valider, retourner flashcard) sont atteignables d'une main au pouce sur smartphone tenu en position lit.

**Vérification** : inspecter les boutons principaux → dimensions ≥ 44×44px, positionnés dans la zone de confort du pouce.

### ENF-ACC-003 [Must] : Lisibilité en condition de fatigue

La taille de texte de base est ≥ 16px. La police est lisible et épaisse (pas de police fine ni condensée). L'espacement interlignes est confortable (≥ 1.4). Ces paramètres sont calibrés pour une lecture en fin de journée, fatiguée, sur smartphone.

**Vérification** : inspecter la feuille de styles → font-size ≥ 16px, line-height ≥ 1.4, font-weight ≥ 400.

### ENF-ACC-004 [Must] : Pas de dépendance audio

Toute information transmise par un signal audio est doublée visuellement. L'application est intégralement utilisable en mode muet (Juju peut être au lit, sans casque, son coupé). Aucun tic-tac sonore sur le chronomètre.

**Vérification** : utiliser l'application intégralement en mode muet → aucune information perdue.

### ENF-ACC-005 [Should] : Mode sombre

Un mode sombre (ou automatique selon les préférences système) est disponible pour les sessions tardives. Les couleurs du mode sombre respectent les mêmes ratios de contraste WCAG AA.

**Vérification** : activer le mode sombre système → l'app passe en mode sombre, ratios de contraste respectés.

## Traçabilité

| Dépendance | Référence |
|---|---|
| persona Juju (fatigue, usage au lit) | [Persona Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) |
| persona Papa (RGAA/WCAG AA) | [Persona Papa](../../../02-discovery/personas/persona-papa-porteur.md) |
| journeys J1-J3 (considérations d'accessibilité) | [Journeys](../../../02-discovery/journeys/) |
