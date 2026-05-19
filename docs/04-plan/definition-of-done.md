# Definition of Done — juju-aviatrice

> Contrat qualité applicable à chaque story (US et TS) avant de la considérer comme terminée. Calibrée pour un projet personnel solo, prototype M0.
> **2026-05-19** — Thomas (Papa) avec Claude

## Code

- [ ] Code compilé sans erreur (`tsc --noEmit`)
- [ ] Biome check passé (lint + format)
- [ ] Pas de TODO, code mort ou `console.log` restants

## Tests

- [ ] Tests unitaires écrits pour la logique métier
- [ ] Tests d'intégration SQLite pour les repositories
- [ ] Pas de régression sur les tests existants (Vitest)
- [ ] Couverture ≥ 60% sur le code métier (ENF-AUT-003)

## Revue

- [ ] Diff git relu par Papa avant commit
- [ ] Formulations vérifiées vs charte de ton (0 mot interdit)

## Déploiement

- [ ] CI passe (Biome + tsc + Vitest)
- [ ] Preview déployée, testable sur smartphone réel (ENF-AUT-005)
- [ ] Pas de migration bloquante non documentée

## Frontend

- [ ] Smartphone-first vérifié sur device réel de Juju (ENF-INT-001)
- [ ] Zones tactiles ≥ 44×44px (ENF-ACC-002)
- [ ] Contraste WCAG AA (ENF-ACC-001)
- [ ] Lisibilité fatigue : font-size ≥ 16px, line-height ≥ 1.4, font-weight ≥ 400 (ENF-ACC-003)
- [ ] Mode muet fonctionnel (ENF-ACC-004)

## Performance

- [ ] Chargement initial < 3s 4G (ENF-PERF-001)
- [ ] Transitions exercices < 300ms (ENF-PERF-002)

## Sécurité

- [ ] Pas de tracker/cookie tiers (ENF-SEC-004)
- [ ] Pas de dashboard comportemental (ENF-SEC-005)

## Règle d'or

- [ ] Aucun message négatif ou culpabilisant
- [ ] Scoring non-stigmatisant (pas de note /N)

---

## Traçabilité

| Dépendance | Référence |
|------------|-----------|
| exigences non-fonctionnelles | [ENF](../03-design/0-requirements/non-fonctionnelles/) |
| exigences fonctionnelles (charte de ton) | [req-session](../03-design/0-requirements/fonctionnelles/req-session.md) |
| vision produit — règle d'or | [Vision produit](../01-strategy/vision-produit.md) |
| ADR-010 stratégie de test | [adr-010](../03-design/2-architecture/adr/adr-010-strategie-test.md) |
| ADR-014 conventions code | [adr-014](../03-design/2-architecture/adr/adr-014-conventions-code.md) |
