# Exigences : Mode immersion ordi (M1)

## Thème

**Mode immersion ordi** — Session longue sur ordinateur, exercices de recherche, vue d'ensemble et continuité multi-appareil. Hors périmètre M0, formalisé pour cadrer la stack et l'architecture.

### Source

- **Journeys associés** : [J4 — Week-end immersion](../../../02-discovery/journeys/journey-week-end-immersion.md)

## Exigences

### REQ-IMMERSION-001 [Won't — M0] : Sessions longues sur grand écran

L'application supporte des sessions longues (30 min à plusieurs heures) sur ordinateur, avec un format visuel adapté au grand écran (exploitation de la largeur, typographie confortable, ergonomie clavier). Le parcours ordi propose une mise en jambes courte avant les exercices longs.

**Vérification** : N/A en M0. En M1 : l'app en mode desktop propose un format exploitant le grand écran et une entrée par mise en jambes courte.

### REQ-IMMERSION-002 [Won't — M0] : Exercices de recherche longs

Des exercices de recherche longs (10-30 min, raisonnement écrit, plusieurs sous-questions) sont disponibles pour les sessions ordi. Ils permettent de creuser un sujet en profondeur. La correction est structurée et détaillée (raisonnement complet, étapes intermédiaires).

**Vérification** : N/A en M0. En M1 : au moins un exercice de recherche long par chapitre est disponible, avec correction structurée.

### REQ-IMMERSION-003 [Won't — M0] : Continuité multi-appareil

L'historique de progression (sessions, avatar, déblocages, exercices en cours) est synchronisé entre smartphone et ordinateur. L'utilisatrice peut commencer en semaine sur smartphone et continuer le week-end sur ordi sans perdre sa progression ni sa position.

**Vérification** : N/A en M0. En M1 : faire 3 sessions sur smartphone → ouvrir sur ordi → l'avatar, l'historique et les suggestions reflètent les sessions smartphone.

### REQ-IMMERSION-004 [Won't — M0] : Auto-évaluation libre

Sur les exercices de recherche longs, l'utilisatrice peut s'auto-évaluer librement (« j'ai compris l'essentiel », « j'ai bloqué », « à refaire plus tard »). Le système ne lui impose pas de notation.

**Vérification** : N/A en M0.

### REQ-IMMERSION-005 [Won't — M0] : Sauvegarde automatique des saisies

Les saisies de l'utilisatrice sur les exercices de recherche longs sont sauvegardées automatiquement pour éviter toute perte en cas de fermeture accidentelle d'onglet ou de déconnexion. L'exercice peut être mis en pause et repris plus tard.

**Vérification** : N/A en M0. En M1 : fermer l'onglet en plein exercice de recherche, rouvrir → les saisies sont intactes.

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J4 | [Week-end immersion](../../../02-discovery/journeys/journey-week-end-immersion.md) |
| product brief — Vague 1 (M1) | [Product Brief](../../../02-discovery/product-brief.md) |
| vision produit — pilier 3 (UX bienveillante, 2 modes) | [Vision produit](../../../01-strategy/vision-produit.md) |
| initiative I-T.1 (stack, continuité multi-appareil) | [Initiatives](../../../01-strategy/initiatives.md) |
| initiative I-3.1.4 (UX session longue ordi) | [Initiatives](../../../01-strategy/initiatives.md) |
