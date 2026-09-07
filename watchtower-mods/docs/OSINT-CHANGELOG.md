# OSINT Workbench — Changelog

## 0.1.0 — 2026-09-07

### Added

- `src/osint/osintRegistry.js`
- `src/osint/osintEvidence.js`
- `src/osint/osintCase.js`
- `src/osint/osintWorkbench.js`
- `src/osint/index.js`
- `src/osint/README.md`
- `docs/OSINT-WORKBENCH.md`
- `docs/OSINT-ROADMAP.md`
- `osint-demo.html`

### Design decisions

- local-first investigation state;
- explicit FACT / INFERENCE / HYPOTHESIS / UNKNOWN states;
- source provenance kept with observations;
- worker outputs are observations, not conclusions;
- high-risk and personal-data operations are not silently automated;
- real network adapters are deferred until their legal/technical constraints can be encoded per source.
