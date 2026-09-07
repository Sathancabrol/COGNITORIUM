# WATCHTOWER OSINT — Roadmap

> **Référence architecturale principale :** [`OSINT-MASTER-SPEC.md`](./OSINT-MASTER-SPEC.md)
>
> Ce roadmap est l'ordre d'implémentation. Le Master Spec rassemble l'ensemble des concepts, modèles, garde-fous, idées issues du 3D Urban Scanner et sources.

## Phase 0 — Foundation / V0.1

- [x] Evidence vocabulary: FACT / INFERENCE / HYPOTHESIS / UNKNOWN
- [x] Entity and relation model
- [x] Source registry
- [x] Local investigation state
- [x] JSON export
- [x] Isolated workbench UI
- [x] Legal/safety design rules

## Phase 1 — Evidence & Case Core / V0.2 — PRIORITÉ

- [ ] Canonical versioned case schema (`.wtcase.json`)
- [ ] Stable entity model and external identifiers
- [ ] Observation / claim / hypothesis separation
- [ ] Source provenance chain
- [ ] Temporal validity (`observedAt`, `publishedAt`, `retrievedAt`, `validFrom`, `validTo`)
- [ ] Validation workflow / human gates
- [ ] Evidence-strength components
- [ ] Source independence groups
- [ ] Contradiction objects
- [ ] Knowledge-gap states
- [ ] Immutable audit trail
- [ ] Snapshot / reproducibility metadata
- [ ] Privacy-preserving export profiles

## Phase 2 — Map ↔ Knowledge Graph

- [ ] Convert Cesium selection into a canonical WATCHTOWER entity
- [ ] Add `BUILDING`, `ADDRESS`, `PARCEL`, `LOCATION` selection adapters
- [ ] Open OSINT panel from existing map selection / fiche-lieu flow
- [ ] Show evidence markers beside selected objects
- [ ] Preserve existing globe/cockpit behavior
- [ ] Canonical knowledge graph
- [ ] Evidence graph
- [ ] Temporal graph
- [ ] Path / neighborhood queries
- [ ] Candidate entity resolution queue

## Phase 3 — World Reconstruction Engine

Inspired by the 3D Urban Scanner study, but implemented as a Watchtower capability layer rather than a separate product.

- [ ] Zone scan
- [ ] Building Explorer
- [ ] 2D/3D/X-Ray/floor/isometric views
- [ ] Manual world-object creation
- [ ] Measurement engine
- [ ] Line-of-sight / visibility engine
- [ ] Environmental layers
- [ ] Solar / shadow analysis
- [ ] Flow / path simulation
- [ ] Historical world snapshots
- [ ] Link every spatial object to an entity/evidence graph node

## Phase 4 — French public-data adapters

Priority order:

1. BAN / Géoplateforme — address resolution
2. Cadastre / Géoplateforme — parcel geometry
3. SIRENE — business entities
4. BODACC — commercial/legal announcements
5. DVF+ — property transactions with explicit reuse constraints
6. INPI / RNE — registry documents and structured company data
7. OSM / Overpass — mapped context
8. Wayback — historical public web

Every adapter must implement the worker contract and expose its own license, quota, provenance, privacy and risk metadata.

## Phase 5 — Evidence graph / Investigation Engine

- [ ] Graph view of entities and sources
- [ ] Click relation → show provenance
- [ ] Source timeline
- [ ] Confidence visualization with explainable components
- [ ] Human validate / reject / leave unresolved
- [ ] Contradiction detection
- [ ] Duplicate-entity candidate queue
- [ ] Question engine
- [ ] Investigation planner
- [ ] Knowledge-gap engine
- [ ] Next-best-action suggestions
- [ ] Comparison engine
- [ ] Anomaly engine
- [ ] Report builder

## Phase 6 — Local workers

Optional workers launched locally:

- [ ] ExifTool / Exiv2
- [ ] OCR pipeline
- [ ] Maigret
- [ ] Sherlock / WhatsMyName
- [ ] SpiderFoot
- [ ] Amass, restricted to authorized scopes

The UI must distinguish **candidate discovery** from **identity proof**.

## Phase 7 — Agent orchestration

- [ ] Worker registry
- [ ] Planner → worker execution → observation normalization
- [ ] Budget / rate-limit governor
- [ ] Retry and cache policy
- [ ] Human approval gates
- [ ] MCP bridge
- [ ] Ollama/local model support
- [ ] External LLM adapter as optional accelerator
- [ ] Explainable agent action log

## Phase 8 — Mental palace / Cognitorium layer

- [ ] Investigation room
- [ ] Entity fiches as physical objects
- [ ] Source fiches attached to claims
- [ ] Evidence strings / relation threads
- [ ] Timeline wall
- [ ] Corkboard / annotations
- [ ] Case snapshots
- [ ] Replay of investigation reasoning
- [ ] Multiple cognitive views of the same canonical graph

## Phase 9 — Reproducibility / production / governance

- [ ] Immutable observation IDs
- [ ] Source snapshot metadata
- [ ] Export/import JSON schema
- [ ] Investigation audit log
- [ ] Adapter test fixtures
- [ ] Source health monitoring
- [ ] Automated license/terms metadata checks
- [ ] Privacy-preserving export profiles
- [ ] Offline/local-only mode
- [ ] Case merge / collaboration
- [ ] Permissions / retention policies

## Non-goals

WATCHTOWER is not intended to:

- bypass authentication or access controls;
- identify a person from weak evidence automatically;
- turn public-data aggregation into unrestricted personal-data indexing;
- run unauthorized active reconnaissance;
- hide provenance behind an AI-generated conclusion;
- treat simulations as observations;
- convert anomalies into accusations.
