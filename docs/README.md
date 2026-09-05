# Cognitorium — Documentation & Gouvernance

Structure de pilotage du projet (chef d'orchestre). **Entrée recommandée :
`etat-des-lieux/README.md` puis `audits/internal/001-audit-global.md`.**

```
docs/
  constitution/            — vision, mission, principes, architecture, roadmap,
                             budget, risques, concurrents, registre de décisions
     00-vision.md · 01-mission.md · 02-principles.md · 03-architecture.md
     04-roadmap.md · 05-buy-build-wrap.md · 06-budget.md · 07-risks.md
     08-competitors.md · 09-decision-log.md (ADR)

  etat-des-lieux/          — documentation exhaustive dépôt par dépôt
     README.md · 01-cognitorium · 02-proto-cognitorium · 03-hcsm
     04-reaserch-engine · 05-etat-de-lart · 06-watchtower
     07-animation-chronos · 08-language-decoder · 09-synthese

  audits/
    internal/001-audit-global.md   — Mission 001 : inventaire + matrice §30
    external/002-bookofshapes.md   — motifs SVG génératifs (assets)
    external/003-stack-donnees-memoire.md — base mémoire/graphe/vecteurs (ADR-007)
    external/004-stack-cad-fabrication.md — CAD + slicer (Phases 5-6)
    external/005-stack-llm-agents.md      — LLM + multi-agents (ADR-008)
    security/001-security.md       — secrets, GDPR (raw/), isolation
    costs/001-costs.md             — baseline + 3 scénarios

  architecture/
    current.md            — état actuel (as-is)
    target.md             — architecture cible (to-be)
    data-model.md         — modèle de données unifié (Core) — proposition v0.1
    convergence.md        — plan de câblage des dépôts

  agents/
    README.md (index) · orchestrator · research · data · coding · ia · 3d ·
    gis · cad · simulation · manufacturing · learning · project · verification

  assets/
    README.md             — convention assets (ADR-010) + modèle SOURCES.md

  glossary.md             — vocabulaire unifié des 8 dépôts
```

## Règles

1. Toute décision structurante → `constitution/09-decision-log.md`.
2. Toute nouvelle fonctionnalité → audit interne (`etat-des-lieux/`) puis
   externe (`audits/external/`) avant le code.
3. Ne jamais présenter une hypothèse comme un fait.
