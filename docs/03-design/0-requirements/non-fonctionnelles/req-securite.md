# Exigences non-fonctionnelles : Sécurité

## Thème

**Sécurité** — Identification, protection des données, conformité RGPD, posture non-surveillante.

### Source

- **Personas** : [Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) (mineure), [Papa](../../../02-discovery/personas/persona-papa-porteur.md) (posture non-surveillante)
- **Vision produit** : règle d'or, pas de surveillance comportementale

## Exigences

### ENF-SEC-001 [Must] : Identification par device ID

L'application n'utilise pas de système de comptes utilisateurs (pas de login, pas de mot de passe, pas d'email). À la première ouverture via l'URL partagée par Papa, un identifiant unique lié au device est généré et stocké localement (localStorage, cookie sécurisé, ou mécanisme équivalent selon la stack). Les accès ultérieurs depuis ce device sont reconnus automatiquement sans aucune action de l'utilisatrice.

**Vérification** : ouvrir l'URL sur le smartphone de Juju pour la première fois → un device ID est créé silencieusement. Fermer et rouvrir → l'app reconnaît le device et affiche l'état de progression sans demander de login.

### ENF-SEC-002 [Must] : Accès initial par URL

L'accès à l'application se fait via une URL (partagée par Papa). La première connexion depuis un device non reconnu crée l'association device → utilisatrice. Un device non identifié (pas encore associé) n'accède pas au contenu d'entraînement — il est redirigé vers un écran d'identification ou d'erreur sobre.

**Vérification** : ouvrir l'URL depuis un navigateur inconnu (incognito, nouveau device) → le device est identifié comme nouveau. Un accès sans URL valide ne donne pas accès au contenu.

### ENF-SEC-003 [Should] : Protection des données d'usage

Les données d'historique (sessions, progression avatar, exercices faits) ne sont pas accessibles publiquement. Si les données sont stockées côté serveur, elles ne sont accessibles qu'avec le device ID associé. Si les données sont locales (localStorage), aucune API publique n'expose l'historique.

**Vérification** : tenter d'accéder aux données d'usage sans le device ID de Juju → accès refusé ou données non trouvées.

### ENF-SEC-004 [Must] : RGPD — données d'une mineure

L'application ne transmet aucune donnée personnelle de l'utilisatrice à des tiers. Pas de trackers (Google Analytics, Hotjar, etc.), pas d'analytics tierces, pas de cookies tiers. Les données collectées sont strictement fonctionnelles (historique d'exercices, progression) et ne quittent pas le périmètre du projet. Le consentement parental est implicite (Papa est le porteur du projet et construit l'outil).

**Vérification** : inspecter le trafic réseau de l'application → aucune requête vers des domaines tiers de tracking ou analytics.

### ENF-SEC-005 [Must] : Pas de surveillance comportementale

Aucun dashboard de comportement détaillé de l'utilisatrice n'est accessible au porteur du projet ni à quiconque. Les métriques de régularité (jours/semaine avec session) sont collectées uniquement pour le moteur de suggestion et ne sont exposées qu'en entretien qualitatif semi-structuré (skill `juju-entretien-m0`), jamais en temps réel.

**Vérification** : aucune page, API ou écran ne permet de consulter le détail temporel des sessions de Juju (heures de connexion, durée par session, scores par exercice).

## Traçabilité

| Dépendance | Référence |
|---|---|
| persona Papa (posture non-surveillante) | [Persona Papa](../../../02-discovery/personas/persona-papa-porteur.md) |
| persona Juju (mineure, pas de flicage) | [Persona Juju](../../../02-discovery/personas/persona-juju-utilisatrice.md) |
| vision produit — règle d'or | [Vision produit](../../../01-strategy/vision-produit.md) |
