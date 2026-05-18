# Navigation — juju-aviatrice M0

## Arbre de navigation

```mermaid
graph TD
    FO14[FO-14 Accès Refusé] --> DEAD((fin))

    ENTRY((Première ouverture)) --> FO01
    FO01[FO-01 Onboarding Bienvenue] --> FO02[FO-02 Onboarding Piliers]
    FO01 -->|Passer| FO04
    FO02 --> FO03[FO-03 Onboarding Flashcard]
    FO02 -->|Passer| FO04
    FO03 --> FO04

    OPEN((Ouverture récurrente)) --> FO04[FO-04 Accueil]
    FO04 -->|Go| FO05[FO-05 Flashcard]
    FO04 -->|Go| FO06[FO-06 QCM]
    FO04 -->|Changer| FO09[FO-09 Choix Activité]

    FO05 -->|Suivant| FO05
    FO05 -->|Suivant| FO06
    FO05 -->|Dernier| FO07[FO-07 Bilan]
    FO06 -->|Suivant| FO05
    FO06 -->|Suivant| FO06
    FO06 -->|Dernier| FO07
    FO06 -->|Dernier psy| FO13[FO-13 Récap Psy]

    FO07 -->|Encore| FO04
    FO07 -->|Bonne nuit| FO04
    FO07 -.->|Si déblocage| FO08[FO-08 Déblocage]
    FO08 --> FO04

    FO09 -->|Sciences chapitre| FO05
    FO09 -->|Psy 1er accès| FO10[FO-10 Psy Bienvenue]
    FO09 -->|Psy récurrent| FO05

    FO10 --> FO11[FO-11 Fiche Méthode]
    FO10 -->|Retour| FO04
    FO11 -->|S'entraîner| FO06
    FO11 -->|Plus tard| FO04

    FO12[FO-12 Proposition Chrono] -->|Lancer| FO06
    FO12 -->|Plus tard| FO13
    FO13 -->|Autre type psy| FO10
    FO13 -->|Retour accueil| FO04
```

## Inventaire des écrans

| ID | Nom | Type | Journey | Spec |
|---|---|---|---|---|
| FO-01 | Onboarding Bienvenue | Onboarding | J1 étape 1 | [spec](spec-ecran-onboarding-bienvenue.md) |
| FO-02 | Onboarding Piliers | Onboarding | J1 étape 2 | [spec](spec-ecran-onboarding-piliers.md) |
| FO-03 | Onboarding Flashcard | Onboarding | J1 étapes 3-5 | [spec](spec-ecran-onboarding-flashcard.md) |
| FO-04 | Accueil | Hub | J2 étape 1 | [spec](spec-ecran-accueil.md) |
| FO-05 | Flashcard | Exercice | J2 étape 3 | [spec](spec-ecran-flashcard.md) |
| FO-06 | QCM | Exercice | J2 étape 3 / J3 étapes 4+7 | [spec](spec-ecran-qcm.md) |
| FO-07 | Bilan Mini-session | Bilan | J2 étape 4 | [spec](spec-ecran-bilan.md) |
| FO-08 | Déblocage | Célébration | J2 étape 6 | [spec](spec-ecran-deblocage.md) |
| FO-09 | Choix Activité | Navigation | J2 alt 1 | [spec](spec-ecran-choix-activite.md) |
| FO-10 | Psy Bienvenue | Onboarding psy | J3 étape 1 | [spec](spec-ecran-psy-bienvenue.md) |
| FO-11 | Fiche Méthode | Contenu | J3 étape 2 | [spec](spec-ecran-fiche-methode.md) |
| FO-12 | Proposition Chrono | Interstitiel | J3 étape 6 | [spec](spec-ecran-proposition-chrono.md) |
| FO-13 | Récap Séquence Psy | Bilan | J3 étape 8 | [spec](spec-ecran-recap-psy.md) |
| FO-14 | Accès Refusé | Sécurité | — | [spec](spec-ecran-acces-refuse.md) |

## Couverture des journeys

| Journey | Écrans couverts | Couverture |
|---|---|---|
| J1 — Première utilisation | FO-01, FO-02, FO-03 → FO-04 | 100% |
| J2 — Soir semaine smartphone | FO-04, FO-05, FO-06, FO-07, FO-08, FO-09 | 100% |
| J3 — Découverte psychotechniques | FO-10, FO-11, FO-06, FO-12, FO-13 | 100% |
| Sécurité | FO-14 | 100% |

## Périmètre M0

- **Back-office** : aucun écran BO — le contenu est géré en code (hardcodé ou fichiers de données).
- **Emails transactionnels** : aucun — pas de notifications, pas de relance.
- **Responsive** : smartphone uniquement (mobile-first, pas de layout desktop spécifique).

## Traçabilité

| Dépendance | Référence |
|---|---|
| journey J1 | [Première utilisation](../../02-discovery/journeys/journey-premiere-utilisation.md) |
| journey J2 | [Soir semaine smartphone](../../02-discovery/journeys/journey-soir-semaine-smartphone.md) |
| journey J3 | [Découverte psychotechniques](../../02-discovery/journeys/journey-decouverte-psychotechniques.md) |
| wireframes HTML | [Index wireframes](html-wireframes/index.html) |
