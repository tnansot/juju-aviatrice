# Direction artistique — juju-aviatrice

> Phase Design — identité visuelle du produit.
> **2026-05-18** — Thomas (Papa) avec Claude, choix validé avec Juju.

## Direction retenue

**Nom / concept** : Horizon Doré — chaleur du lever de soleil, optimisme aérien

**Mots-clés visuels** : chaleureux, lumineux, organique, accueillant, aérien

**Émotion cible** : motivation et élan — l'app donne envie d'avancer, chaque session est un pas visible vers le rêve pilote, sans jamais presser

## Palette de couleurs

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primaire | Bleu profond | `#2563EB` | Pilier Sciences, liens, éléments structurels |
| Primaire clair | Bleu ciel | `#3B82F6` | Hover, variantes claires |
| Primaire doux | Bleu pastel | `#DBEAFE` | Fond de badge Sciences |
| Secondaire | Violet crépuscule | `#7C3AED` | Pilier Psychotechniques |
| Secondaire doux | Lavande | `#EDE9FE` | Fond de badge Psy |
| Accent | Orange sunset | `#F97316` | CTA principal (Go), avatar, progression, stades |
| Accent clair | Pêche | `#FDBA74` | Dégradés, icônes secondaires |
| Accent doux | Crème pêche | `#FFF7ED` | Fonds d'accentuation |
| Warm 50 | Crème soleil | `#FFFBEB` | Fond de page principal |
| Warm 100 | Jaune doux | `#FEF3C7` | Fond de barre de progression |
| Neutre 100 | Sable clair | `#F5F5F4` | Fonds alternatifs |
| Neutre 200 | Sable | `#E7E5E4` | Bordures de cartes |
| Neutre 400 | Pierre | `#A8A29E` | Labels, texte tertiaire |
| Neutre 600 | Terre | `#57534E` | Texte secondaire, body |
| Neutre 800 | Brun sombre | `#292524` | Texte de titre courant |
| Neutre 900 | Brun nuit | `#1C1917` | Titres forts, texte maximum |
| Succès | Émeraude | `#22C55E` | Bonne réponse, validation, badges acquis |
| Erreur | Rouge doux | `#EF4444` | Réservé aux erreurs système (jamais scoring) |

**Logique sémantique** : bleu = sciences, violet = psychotechniques, orange = action/progression/avatar. Les neutres sont chauds (base stone, pas slate) pour soutenir l'ambiance lever de soleil. Le vert succès valide sans juger — pas de rouge en scoring (règle d'or).

## Typographie

| Rôle | Font | Poids | Usage |
|---|---|---|---|
| Display (titres) | Outfit | 700-800 | h1, h2, boutons, stades avatar, compteurs |
| Body (texte) | Plus Jakarta Sans | 400-600 | Paragraphes, labels, corrections, fiches méthode |

### Justification

- **Outfit** : géométrique et ronde, lettrage aérien, personnalité chaleureuse en bold. Distinctive sans être excentrique. Le resserrement en `letter-spacing: -0.03em` donne un rendu moderne et dynamique.
- **Plus Jakarta Sans** : humaniste, excellente lisibilité à 16px sur smartphone en condition de fatigue. Italique disponible pour les citations et corrections.

### Échelle typographique

| Niveau | Taille | Line-height | Poids | Usage |
|---|---|---|---|---|
| h1 | 2.25rem (36px) | 1.05 | 800 | « Salut Juju », titres de page |
| h2 | 1.5rem (24px) | 1.15 | 700 | Sections, noms de chapitre |
| h3 | 1.15rem (18.4px) | 1.3 | 600 | Sous-titres, stade avatar |
| body | 1rem (16px) | 1.65 | 400-500 | Texte courant, corrections, fiches |
| small | 0.8rem (12.8px) | 1.4 | 500-600 | Labels, sous-titres de carte, compteurs |
| micro | 0.7rem (11.2px) | 1.3 | 700 | Section titles, badges, uppercase labels |

## Layout et composition

- **Grille** : colonne unique centrée (smartphone-first), max-width 480px
- **Densité** : aérée — beaucoup d'espace autour de l'avatar et de la suggestion
- **Symétrie** : centré (accueil, onboarding) ; aligné gauche (exercices, fiches)
- **Base d'espacement** : 4px → 4, 8, 12, 16, 20, 24, 28, 32, 48
- **Rayons de bordure** : très arrondis (warm feel) — sm: 10px, md: 14px, lg: 20px, xl: 28px, pill: 100px
- **Ombres** : douces et chaudes (base rgba warm, pas slate)

## Animations et motion

- **Philosophie** : subtil et encourageant — les animations accompagnent le feedback positif (avatar, déblocage, progression), jamais les erreurs
- **Durées** : rapide 150ms (hover, tap), normal 250ms (transitions), lent 400ms (apparition avatar, célébration)
- **Courbes** : ease-out pour les entrées (sensation de légèreté), ease-in-out pour les transitions de page
- **Éléments animés** : progression avatar (scale + glow), barre de progression (fill), déblocage (apparition card), retournement flashcard (flip), bouton Go (translateY au hover)
- **Éléments NON animés** : texte courant, chronomètre (sobre, pas de tic-tac visuel), corrections, scores

## Références d'inspiration

- **Flighty** : esthétique aviation premium, qualité des détails, palette ciel. On en retient le soin apporté aux micro-interactions et la palette aérienne.
- **Forest** : progression organique, gamification douce, sentiment d'accomplissement par la croissance. On en retient le feedback visuel de progression (planter → grandir).
- **Habitica** : avatar progressif, mécanique RPG appliquée à la productivité. On en retient la mécanique d'évolution sans compétition.

## Anti-patterns visuels

- **Scolaire / austère** : pas de look cahier d'exercices, LMS, Moodle. L'app doit donner envie, pas rappeler les devoirs.
- **Infantile / surchargé** : pas de mascotte cartoon, confettis excessifs, palette bonbon. Juju a 16-17 ans.
- **Froid / corporate** : pas de bleu LinkedIn, gris acier, dashboard analytics. C'est personnel et familial.
- **Anxiogène** : jamais de rouge en scoring, pas de clignotement chrono, pas de graphiques de performance descendants.
- **Notification agressive** : pas de badge rouge compteur, pas de modale bloquante, pas de relance culpabilisante.

## Traçabilité

| Dépendance | Référence |
|---|---|
| Persona Juju | [Persona Juju](../../02-discovery/personas/persona-juju-utilisatrice.md) |
| Persona Papa | [Persona Papa](../../02-discovery/personas/persona-papa-porteur.md) |
| Vision produit — Pilier 3 et 4 | [Vision produit](../../01-strategy/vision-produit.md) |
| Wireframes (structure fonctionnelle) | [Wireframes](../3-wireframes/) |
| Vitrine DA (HTML) | [direction-artistique.html](direction-artistique.html) |
