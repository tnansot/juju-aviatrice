# Exigences non-fonctionnelles : Maintenabilité et disponibilité

## Thème

**Maintenabilité, disponibilité et testabilité** — Uptime, déploiement, tests, testabilité pendant le build, anticipation responsive.

### Source

- **Persona Papa** : [Persona Papa](../../../02-discovery/personas/persona-papa-porteur.md) (builder, CI/CD minimal, pragmatique)
- **Initiative I-T.1** : stack & setup repo

## Exigences

### ENF-AUT-001 [Must] : Disponibilité ≥ 99%

L'application vise un uptime ≥ 99% (soit < 7h d'indisponibilité par mois). Les indisponibilités planifiées pour maintenance sont tolérées si elles ont lieu en dehors des heures d'usage de Juju (typiquement : entre 23h et 7h). Pas de SLA formel — c'est un projet personnel.

**Vérification** : sur un mois d'usage, l'application est accessible à chaque ouverture par Juju. Si une indisponibilité survient en journée, elle est résolue en < 1h.

### ENF-AUT-002 [Must] : Déploiement simple < 15 minutes

Papa peut déployer une mise à jour (code ou contenu) en moins de 15 minutes via un pipeline CI/CD minimal. Le processus est reproductible et documenté. Pas de déploiement manuel complexe.

**Vérification** : pousser un commit sur la branche principale → la mise à jour est en production en < 15 minutes, sans intervention manuelle au-delà du push.

### ENF-AUT-003 [Should] : Tests automatisés ≥ 60%

Le code métier (logique de session, moteur de suggestion, progression avatar, chronomètre) est couvert par des tests unitaires à hauteur de ≥ 60%. Les tests sont exécutés automatiquement dans le pipeline CI.

**Vérification** : rapport de couverture de tests → ≥ 60% sur le code dans les dossiers métier.

### ENF-AUT-004 [Should] : Responsive-ready pour M1

L'architecture CSS et la structure HTML de M0 doivent anticiper le passage en mode ordinateur (M1) sans refonte structurelle. Le layout smartphone-first utilise des techniques responsives (flexbox, grid, unités relatives) qui permettront d'ajouter des breakpoints desktop en M1.

**Vérification** : ouvrir l'app M0 sur un écran desktop → le contenu est lisible (même si pas optimisé), et l'ajout d'un breakpoint desktop ne nécessite pas de refonte du HTML.

### ENF-AUT-005 [Must] : Environnement de preview testable

Papa peut déployer une version preview (staging) de l'application, testable sur smartphone réel, avant toute mise en production. Cet environnement de preview est distinct de la production et permet de vérifier les changements (code et contenu) avec Juju avant livraison.

**Vérification** : pousser un commit sur une branche de preview → l'app est accessible sur smartphone via une URL de staging en < 15 minutes.

### ENF-AUT-006 [Must] : Hot reload en développement

Les modifications de code et de contenu sont visibles immédiatement en développement local (hot reload ou live reload). Papa peut itérer rapidement sur les écrans, les exercices et les messages sans redémarrer l'application.

**Vérification** : modifier un fichier source (composant, exercice, texte) → le changement est visible dans le navigateur en < 3 secondes sans rechargement manuel de la page.

### ENF-AUT-007 [Should] : Jeu de données de test

Un jeu de données de test (exercices factices, chapitres de démonstration, avatar à différents états de progression) est disponible pour tester toutes les fonctionnalités sans attendre la production du contenu pédagogique final. Ce jeu permet de valider l'onboarding, les sessions, les déblocages et le moteur de suggestion.

**Vérification** : lancer l'app avec le jeu de données de test → toutes les fonctionnalités sont testables (onboarding, sessions, avatar, déblocages, suggestion).

### ENF-AUT-008 [Must] : Test sur device réel pendant le build

Papa peut tester l'application sur un smartphone (celui de Juju ou un device équivalent) à tout moment pendant la phase de build, via l'environnement de preview (ENF-AUT-005) ou le serveur de développement local accessible sur le réseau local.

**Vérification** : depuis un smartphone connecté au même réseau local que le poste de développement → l'app de développement est accessible et testable.

## Traçabilité

| Dépendance | Référence |
|---|---|
| persona Papa (builder, CI/CD, pragmatique) | [Persona Papa](../../../02-discovery/personas/persona-papa-porteur.md) |
| initiative I-T.1 (stack & setup) | [Initiatives](../../../01-strategy/initiatives.md) |
| journey J4 (anticipation ordi M1) | [Week-end immersion](../../../02-discovery/journeys/journey-week-end-immersion.md) |
