# Agents Cognitorium — répertoire

**Statut :** `REFERENCE` · Phase 7 · coordonnés par l'agent chef d'orchestre
(`orchestrator.md`).

Chaque fiche définit : rôle, entrées/sorties, frontière (ce qu'il ne fait pas),
outils. Les agents sont **injectables** (fournisseurs abstraits) et exposent
leurs outils via **MCP** (voir `audits/external/005-stack-llm-agents.md`).

| Agent | Fiche | Couche / pilier |
| --- | --- | --- |
| Chef d'orchestre | `orchestrator.md` | coordination |
| Research | `research-agent.md` | preuves / veille |
| Data | `data-agent.md` | pipelines, données |
| Coding (front+back) | `coding-agent.md` | application |
| IA | `ia-agent.md` | LLM, mémoire, évaluation |
| 3D | `3d-agent.md` | objets, scènes |
| GIS | `gis-agent.md` | territoire, géo |
| CAD | `cad-agent.md` | conception paramétrique |
| Simulation | `simulation-agent.md` | scénarios, physique |
| Manufacturing | `manufacturing-agent.md` | slicer, fabrication |
| Learning | `learning-agent.md` | CLE |
| Project | `project-agent.md` | suivi, planning, budget |
| Verification | `verification-agent.md` | qualité, sécurité, épistémique |

## Règles communes

1. Ne jamais présenter une hypothèse comme un fait.
2. Toute sortie « cognitive » passe le validateur HCSM / l'échelle épistémique.
3. Chaque action porte provenance + incertitude + coût.
4. Rapporter à l'orchestrateur ; ne pas modifier l'architecture sans décision
   consignée (ADR).
