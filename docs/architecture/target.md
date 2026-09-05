# Architecture cible (to-be)

**Statut :** `PROPOSED` · synthèse de `constitution/03-architecture.md` +
décisions d'audit · 2026-09-05

---

## Principes

- **Une source de vérité** : PostgreSQL + pgvector + Apache AGE + PostGIS
  (ADR-007).
- **Fournisseurs abstraits** : `LLMProvider`, `VectorStore`, `GraphStore`,
  `GISProvider`, `CADProvider`, `SlicerProvider` (règle P4, ADR-008).
- **Core** : entités fondatrices `User · Project · Knowledge · Skill · Object ·
  Place · Task · Event` (voir `data-model.md`).
- **Agents** : orchestrateur maison + MCP (Phase 7).

## Diagramme cible

```
                    COGNITORIUM PLATFORM
  ┌──────────────────────────────────────────────────────┐
  │  UI / Experience (proto · watchtower · learning)     │
  └───────────────┬──────────────────────────────────────┘
                  │ API (Core)
  ┌───────────────▼──────────────────────────────────────┐
  │  CORE (User·Project·Knowledge·Skill·Object·Place·    │
  │        Task·Event)  — provenance·incertitude·contexte│
  └──┬──────────┬──────────┬──────────┬──────────┬───────┘
     │          │          │          │          │
  LLMProvider  Vector   Graph(AGE)  GIS(PostGIS) CAD/Slicer
  (Gemini/     (pgvector)          (Cesium/MapLibre) (Replicad/
   OpenAI/                                                    OrcaSlicer)
   local)
     │
  AGENTS (orchestrateur maison + MCP)
  Research·Data·CAD·Simulation·GIS·Learning·Project·Manufacturing·Verification
```

## Décisions techniques actées

| Domaine | Choix | ADR |
| --- | --- | --- |
| Base mémoire/graphe/vecteurs/spatial | PostgreSQL + pgvector + AGE + PostGIS | 007 |
| LLM | `LLMProvider` (Gemini défaut, local cible) | 008 |
| Multi-agents | orchestrateur maison + MCP ; LangGraph si besoin | 008 |
| CAD | Replicad + OpenCascade.js ; JSCAD pour CSG jetable | Phase 5 |
| Slicer | OrcaSlicer (AGPL) en étape locale | Phase 6 |
| GIS/3D | Cesium (globe, déjà intégré) + MapLibre (2D) + PostGIS | Phase 3 |
| Connaissances | HCSM = vocabulaire canonique ; ETAT-DE-LART = contenu sourcé | 009 |

## Chemin de migration (incrémental)

1. **Phase 1** : Core + schéma SQL unifié (PostgreSQL) ; adapter les types.ts.
2. **Phase 2** : brancher Skill Graph + CLE au Core (persistance serveur).
3. **Phase 3** : publier Watchtower + brancher World Graph (PostGIS).
4. **Phase 4-6** : Design Engine, CAD (Replicad), Fabrication (OrcaSlicer local).
5. **Phase 7** : agents orchestrés (MCP), mémoire vectorielle (pgvector).

*Voir `docs/architecture/data-model.md` et `convergence.md`.*
