# WATCHTOWER OSINT — Roadmap

## Phase 0 — Foundation / V0.1

- [x] Evidence vocabulary: FACT / INFERENCE / HYPOTHESIS / UNKNOWN
- [x] Entity and relation model
- [x] Source registry
- [x] Local investigation state
- [x] JSON export
- [x] Isolated workbench UI
- [x] Legal/safety design rules

## Phase 1 — Map ↔ investigation bridge

- [ ] Convert Cesium selection into a canonical WATCHTOWER entity
- [ ] Add `BUILDING`, `ADDRESS`, `PARCEL`, `LOCATION` selection adapters
- [ ] Open OSINT panel from the existing map selection / fiche-lieu flow
- [ ] Show evidence markers beside selected objects
- [ ] Preserve the existing globe/cockpit behavior

## Phase 2 — French public-data adapters

Priority order:

1. BAN / Géoplateforme — address resolution
2. Cadastre / Géoplateforme — parcel geometry
3. SIRENE — business entities
4. BODACC — commercial/legal announcements
5. DVF+ — property transactions with explicit reuse constraints
6. INPI / RNE — registry documents and structured company data
7. OSM / Overpass — mapped context
8. Wayback — historical public web

Every adapter must implement the worker contract and expose its own license, quota, provenance and risk metadata.

## Phase 3 — Evidence graph

- [ ] Graph view of entities and sources
- [ ] Click relation → show provenance
- [ ] Source timeline
- [ ] Confidence visualization
- [ ] Human validate / reject / leave unresolved
- [ ] Contradiction detection
- [ ] Duplicate-entity candidate queue

## Phase 4 — Local workers

Optional workers launched locally:

- [ ] ExifTool / Exiv2
- [ ] OCR pipeline
- [ ] Maigret
- [ ] Sherlock / WhatsMyName
- [ ] SpiderFoot
- [ ] Amass, restricted to authorized scopes

The UI must distinguish **candidate discovery** from **identity proof**.

## Phase 5 — Agent orchestration

- [ ] Worker registry
- [ ] Planner → worker execution → observation normalization
- [ ] Budget / rate-limit governor
- [ ] Retry and cache policy
- [ ] Human approval gates
- [ ] MCP bridge
- [ ] Ollama/local model support
- [ ] External LLM adapter as optional accelerator

## Phase 6 — Mental palace / Cognitorium layer

- [ ] Investigation room
- [ ] Entity fiches as physical objects
- [ ] Source fiches attached to claims
- [ ] Evidence strings / relation threads
- [ ] Timeline wall
- [ ] Corkboard / annotations
- [ ] Case snapshots
- [ ] Replay of investigation reasoning

## Phase 7 — Reproducibility and governance

- [ ] Immutable observation IDs
- [ ] Source snapshot metadata
- [ ] Export/import JSON schema
- [ ] Investigation audit log
- [ ] Adapter test fixtures
- [ ] Automated license/terms metadata checks
- [ ] Privacy-preserving export profiles

## Non-goals

WATCHTOWER is not intended to:

- bypass authentication or access controls;
- identify a person from weak evidence automatically;
- turn public-data aggregation into unrestricted personal-data indexing;
- run unauthorized active reconnaissance;
- hide provenance behind an AI-generated conclusion.
