# juju-aviatrice

Projet personnel et familial pour aider **Juju** (lycéenne en 1ère générale, spécialités scientifiques, en cours de formation PPL) à préparer les épreuves de sélection des **formations pilote de ligne** européennes (ENAC EPL, Cadets Air France, et autres programmes cadets).

Le projet produit **deux artefacts complémentaires** :

| Artefact | Rôle | Public | Source |
|---|---|---|---|
| **Wiki** | Base documentaire de référence sur les formations, épreuves et prérequis | Juju (et son père) | [wiki/](wiki/) → publié sur [juju-aviatrice.pages.dev](https://juju-aviatrice.pages.dev) |
| **App d'entraînement** | Outil interactif de révision (maths, physique, tests psychotechniques) | Juju | [src/](src/) — **à construire** |

## Structure du repository

```
juju-aviatrice/
├── wiki/                 # Sources du wiki (Markdown rendu par MkDocs Material)
├── cadrage-brouillon/    # Notes brutes de discovery (entretien Juju) → matière première PBM
├── docs/                 # Artefacts produit générés par PBM (vides pour l'instant)
│   ├── strategy/         #   vision, OKRs, initiatives, glossaire
│   ├── discovery/        #   product brief, personas, journeys
│   ├── design/           #   exigences, domaine, wireframes, API, architecture
│   ├── plan/             #   features, stories, definition of done
│   ├── run/              #   observabilité, runbooks, incidents, SLA
│   └── proposals/        #   propositions commerciales (non utilisé ici)
├── src/                  # Code de l'app d'entraînement (à créer en phase Implementation)
├── _bmad/                # Module PBM installé (gitignored)
├── overrides/            # Override de template MkDocs (intégration Giscus)
├── mkdocs.yml            # Config du wiki
├── requirements.txt      # Deps Python pour le build du wiki
├── DEPLOIEMENT.md        # Doc d'opérations Cloudflare Pages / Access / Giscus
└── CLAUDE.md             # Instructions et contexte pour les assistants IA
```

## État d'avancement

- ✅ **Wiki en ligne** : 12 fiches formations + 3 fiches épreuves + 2 fiches prérequis publiées sur Cloudflare Pages, accès restreint via Cloudflare Access, commentaires Giscus actifs.
- ✅ **Cadrage initial avec Juju** : interview besoins, prochaines étapes et questions ouvertes consignées dans [cadrage-brouillon/](cadrage-brouillon/).
- ✅ **Méthodologie produit** : module **PBM** (Product Builder Method) installé, prêt à être lancé.
- ⏳ **Prochaine étape — phase Strategy** : lancer `/pbm-strategy` puis `/pbm-discovery` pour formaliser vision, OKRs, product brief et personas en s'appuyant sur le cadrage existant.
- ⏳ **Phase Build** : choix de stack technique (web / mobile / les deux) à co-décider avec Juju, puis implémentation dans `src/` à partir des features définies en phase Plan.

## Méthodologie : PBM (Product Builder Method)

Le projet suit le framework **PBM** en 6 phases séquentielles :

```
Strategy → Discovery → Design → Plan → Implementation → Run
```

Chaque phase produit des livrables structurés dans le sous-répertoire `docs/<phase>/` correspondant. Pour démarrer ou continuer : `/bmad-help` puis `/pbm-strategy` (ou la phase courante).

Détails du module : [_bmad/pbm/README.md](_bmad/pbm/README.md).

## Démarrage local (wiki)

```bash
.venv/bin/mkdocs serve   # preview live sur http://127.0.0.1:8000
```

Pour publier : `git push origin main` → Cloudflare Pages rebuild automatiquement (~1 min). Détails opérationnels dans [DEPLOIEMENT.md](DEPLOIEMENT.md).

## Liens utiles

- **Wiki publié** : <https://juju-aviatrice.pages.dev> (accès restreint Cloudflare Access)
- **Discussions GitHub** (commentaires Giscus) : onglet Discussions du repo
- **Index du wiki** : [wiki/README.md](wiki/README.md)
- **Comparatif des formations** : [wiki/formations/comparatif.md](wiki/formations/comparatif.md)
- **Doc déploiement** : [DEPLOIEMENT.md](DEPLOIEMENT.md)
- **Instructions IA** : [CLAUDE.md](CLAUDE.md)
