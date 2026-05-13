# Exigences : Avatar et progression

## Thème

**Avatar et progression** — Avatar progressif, mécanismes de déblocage, suivi non-anxiogène et célébration positive.

### Source

- **Journeys associés** : [J1 — Première utilisation](../../../02-discovery/journeys/journey-premiere-utilisation.md), [J2 — Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md), [J3 — Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md)

## Exigences

### REQ-AVATAR-001 [Must] : Avatar avec 3-4 états progressifs visibles

Un avatar visuel est associé à l'utilisatrice et affiché en permanence sur l'écran d'accueil. Il possède au moins 3 à 4 états visuellement distincts qui marquent une évolution au fil des progrès. Le passage d'un état au suivant est perceptible et gratifiant.

**Vérification** : après X sessions (seuil à définir en Plan), l'avatar passe visiblement d'un état à un état supérieur avec un changement visuel clair.

### REQ-AVATAR-002 [Must] : Progression basée sur l'effort, pas le score

La progression de l'avatar est déclenchée par l'effort investi (sessions effectuées, exercices traversés, piliers explorés), jamais par le score ou la performance aux exercices. Le passage compte, pas la réponse. Cela signifie qu'une session avec 0 bonne réponse fait progresser l'avatar autant qu'une session parfaite.

**Vérification** : faire 5 exercices avec 0 bonne réponse → l'avatar progresse exactement comme si toutes les réponses étaient justes.

### REQ-AVATAR-003 [Must] : Mécanisme de déblocage de contenu

Au moins un mécanisme de déblocage est actif : des contenus (chapitres, types d'exercices, zones du catalogue) se débloquent au fil des sessions effectuées. Le seuil de déblocage est atteignable en quelques sessions (pas un objectif lointain qui décourage). Les contenus initialement verrouillés sont visibles mais clairement marqués comme « à venir ».

**Vérification** : après N sessions (N raisonnable, ex : 3-5), un chapitre initialement verrouillé devient accessible.

### REQ-AVATAR-004 [Must] : Suivi non-anxiogène (compteur + avancement)

L'avancement de l'utilisatrice est visible via un suivi simplifié : compteur de sessions effectuées et indicateur d'avancement par chapitre (en cours, terminé). Aucun graphique de courbes, aucune note globale, aucun leaderboard, aucun indicateur de « retard ».

**Vérification** : l'écran montre combien de sessions ont été faites et quels chapitres sont en cours/terminés, sans courbe de performance ni classement.

### REQ-AVATAR-005 [Should] : Célébration positive sobre des déblocages

Les moments de progression (changement d'état de l'avatar, déblocage d'un chapitre) sont accompagnés d'une célébration positive sobre : animation légère et/ou message aligné sur la charte de ton. La célébration est brève, ne bloque pas l'usage, et ne déclenche pas de modale agressive ni de fanfare disproportionnée.

**Vérification** : déblocage d'un chapitre → une animation sobre ou un message positif apparaît pendant 2-3 secondes, puis l'usage reprend normalement.

### REQ-AVATAR-006 [Must] : Absence jamais mentionnée négativement

Les périodes d'absence (jours sans session) ne sont jamais mentionnées par l'application. Le retour de l'utilisatrice est accueilli normalement, avec la suggestion contextuelle habituelle, sans rappel culpabilisant (pas de « tu nous as manqué », « ça fait 5 jours que tu n'es pas venue », « ta série est brisée »). Les streaks, si présents, encouragent la régularité sans punir les ruptures.

**Vérification** : ne pas ouvrir l'app pendant 7 jours, rouvrir → aucun message relatif à l'absence. L'écran d'accueil est identique à une ouverture normale.

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J1 (progression avatar en onboarding) | [Première utilisation](../../../02-discovery/journeys/journey-premiere-utilisation.md) |
| journey J2 (déblocage, bilan) | [Soir semaine smartphone](../../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 (premier badge psy) | [Découverte psychotechniques](../../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| product brief — avatar simple, 1 mécanisme de déblocage | [Product Brief](../../../02-discovery/product-brief.md) |
| vision produit — pilier 4 (engagement par le jeu) | [Vision produit](../../../01-strategy/vision-produit.md) |
| OKRs — KR-4.1.1 (avatar), KR-4.1.2 (déblocage) | [OKRs](../../../01-strategy/okrs.md) |
