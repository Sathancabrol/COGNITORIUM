# `src/osint/`

This directory is intentionally independent from Cesium and the existing live-data layers.

```text
osint/
├── index.js             public module entrypoint
├── osintRegistry.js     source/tool registry
├── osintEvidence.js     FACT/INFERENCE/HYPOTHESIS/UNKNOWN model
├── osintCase.js         serializable investigation state
├── osintWorkbench.js    UI + local demonstration
└── README.md            module contract
```

## Design rule

Keep these layers separate:

```text
source adapters → observations → evidence graph → UI
```

A source adapter must never write a final conclusion directly into the UI.
