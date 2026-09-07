# WATCHTOWER — OSINT Workbench

## 1. Intention

WATCHTOWER already provides a strong **physical-world layer**: globe, maps, aircraft, satellites, cameras, events and tracking. The OSINT Workbench adds the **information-world layer** without replacing the existing cockpit.

The target is not an automatic investigator. It is a visual investigation workbench where an agent discovers, structures and cross-checks public information while the human remains the final validator.

## 2. Core loop

```text
HUMAN
  ↓
WATCHTOWER UI
  ↓
INVESTIGATION AGENT
  ├─ discovery workers
  ├─ extraction workers
  ├─ cross-source matching
  └─ validation queue
  ↓
EVIDENCE GRAPH
  ↓
MENTAL-PALACE / CASE VIEW
  ↓
HUMAN VALIDATION
```

## 3. Evidence states

| State | Meaning | Automatic promotion |
|---|---|---|
| FACT | Directly supported by a source | No source loss; provenance required |
| INFERENCE | Derived from multiple observations | Never automatic |
| HYPOTHESIS | Investigator proposal | Never automatic |
| UNKNOWN | Searched but unresolved | Can remain unresolved |

Every observation keeps source, timestamp, method, confidence and validation state.

## 4. Entity model

Initial vocabulary:

- BUILDING
- ADDRESS
- PARCEL
- PERSON
- ORGANIZATION
- COMPANY
- DOMAIN
- EMAIL
- USERNAME
- DOCUMENT
- IMAGE
- VEHICLE
- AIRCRAFT
- SHIP
- EVENT
- LOCATION
- SOURCE

## 5. Source registry

`src/osint/osintRegistry.js` is deliberately descriptive. It records cost, automation, personal-data sensitivity and risk so an agent can choose an adapter deliberately.

Initial French/free candidates:

- Géoplateforme / BAN
- Cadastre / Géoplateforme
- DVF+
- SIRENE
- BODACC
- INPI / RNE
- OpenStreetMap / Overpass
- Internet Archive / Wayback
- ExifTool / Exiv2
- Maigret / Sherlock / WhatsMyName as candidate-discovery workers

The registry is **not** a legal authorization system. Terms, licenses, quotas and applicable law must be checked at adapter/runtime level.

## 6. Example: building investigation

1. Human selects a building on the globe.
2. WATCHTOWER creates `BUILDING:<id>`.
3. Address is resolved with an approved geocoder.
4. Parcel geometry is queried.
5. Public real-estate/business observations are retrieved where permitted.
6. Historical web sources can be attached.
7. Cross-source matches are created as `INFERENCE`, not `FACT`.
8. The case graph shows every relation and its provenance.
9. Human validates, rejects or leaves the inference unresolved.

The UI must never silently transform a likely match into an identity.

## 7. Agent contract

A worker should receive:

```json
{
  "entity": {"id": "building_123", "type": "BUILDING"},
  "task": "resolve_address",
  "scope": {"country": "FR"},
  "constraints": {"public_only": true, "human_gate": true}
}
```

and return observations:

```json
{
  "worker": "ban",
  "status": "ok",
  "observations": [],
  "sources": [],
  "observedAt": "2026-09-07T00:00:00Z",
  "errors": []
}
```

Workers return **observations, not conclusions**.

## 8. Safety and legality gates

The product default is:

- public source ≠ unrestricted reuse;
- no credential bypass;
- no access-control circumvention;
- no automatic identity claim from weak correlation;
- respect rate limits and database rights;
- preserve source attribution and provenance;
- treat personal-data processing as a real processing activity;
- active reconnaissance only where the operator is authorized;
- sensitive/high-risk workers require a human gate.

## 9. Current implementation status — V0.1

Implemented in this branch:

- source registry;
- serializable investigation/case model;
- evidence state model;
- initial OSINT workbench UI;
- demo investigation with FACT / INFERENCE / UNKNOWN;
- JSON export;
- architecture documentation.

The V0.1 intentionally uses a **demo/local adapter layer** rather than silently making external requests. Real connectors are the next phase.

## 10. Integration rule

The module is isolated under `src/osint/` so it can be connected to `main.js` without coupling the evidence model to Cesium rendering. The next integration step is to pass selected Cesium/map entities into `createInvestigation()` and render evidence back onto the map and mental-palace layer.
