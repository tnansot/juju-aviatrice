# Spécification d'écran : Accès Refusé

## Identifiant

**FO-14** — `/acces-refuse` — [Voir le wireframe HTML](html-wireframes/fo-14-acces-refuse.html)

**Persona** : Visiteur non autorisé (hors personas)
**Parcours** : Aucun — écran de sécurité

## Description fonctionnelle

Écran affiché à toute personne accédant à l'URL de l'application sans token d'invitation valide. L'app étant privée et mono-utilisateur, cet écran est le seul point de contact pour un visiteur non autorisé. Il explique que l'accès nécessite un lien d'invitation, sans révéler la nature exacte de l'application ni exposer de fonctionnalité.

## Règles d'affichage métier

- **Aucune navigation sortante** : cet écran est un cul-de-sac volontaire. Pas de lien vers l'accueil, pas de bouton de connexion, pas de formulaire d'inscription.
- **Pas de détails techniques** : le message ne mentionne ni token, ni device ID, ni mécanisme d'authentification. Il reste en langage courant.
- **Affichage inconditionnel** : cet écran est la route par défaut si le device ID n'est pas reconnu ou si le token d'invitation est absent/invalide.

## Cas d'erreur et états métier

- **Token expiré** : même écran affiché, sans distinction visible entre token absent, expiré ou invalide.
- **Device ID effacé** : si Juju efface ses données de navigation (localStorage), elle voit cet écran. Elle devra réutiliser le lien d'invitation pour regénérer un device ID.

## Traçabilité

| Dépendance | Référence |
|---|---|
| exigence implicite sécurité | Modèle d'identité : accès par token d'invitation |
| model DeviceID | [DeviceID](../1-domain/models/model-device-id.md) |
| bc-identite | [BC Identité](../1-domain/bc-identite.md) |
