# 03 — HCSM (Human Cognitive State Model)

**Rôle :** la **couche scientifique** de Cognitorium — cadre pour représenter
l'état cognitif humain à un instant T0 comme objet latent, multimodal,
contextualisé, temporel et « évidentiel ».
**Maturité :** documentation `PROPOSED` (v0.1.1) + un validateur Python
fonctionnel. Pas d'implémentation du « Cognition Hub ».
**Dépôt :** `Sathancabrol/HCSM`.

## Thèse (une phrase)

> L'objet n'est pas un score, c'est un **état latent estimé** : pour une
> personne, à un instant T0, sur des construits, à partir de preuves
> hétérogènes, dans un contexte, avec provenance et incertitude explicites.

```
CognitiveState(t) = Inference(Ontology, Measurements, Context, History, Evidence)
```

Trois graphes, un moteur : **Knowledge** (ce que la science sait) · **Evidence**
(ce qui a été observé) · **Inference** (ce qu'on peut conclure/refuser).

Règle d'or (ontologie) :
```
Observation ⊄ Construct
ConstructEstimate requires Uncertainty ∧ TemporalWindow ∧ evidence
Diagnosis ∉ HCSM
NeurologicalState ∉ HCSM
```

## Les trois objets (séparation fondatrice)

| Objet | Rôle | Couche |
| --- | --- | --- |
| HCSM | modèle scientifique | MODEL |
| Cognition Hub | système computationnel qui l'instancie | IMPLEMENTATION |
| Cognitorium | architecture globale (connaissances/compétences/expériences/trajectoires) | ECOSYSTEM |

## Structure

```
HCSM/
├── README.md (209) · CHANGELOG · CITATION.cff · CONTRIBUTING · LICENSE
├── docs/ (00 → 14)          # 15 documents, du positionnement aux limites
├── model/                   # latent-state · mathematical · temporal-state · uncertainty
├── ontology/
│   ├── hcsm-v0.1.yaml (468) # ontologie machine (classes, propriétés, contraintes, alignements)
│   ├── entities.md · relations.md · namespaces.md · README.md
├── scientific/              # constructs · hypotheses (H1-H6) · literature · measures · models
├── research/                # competing-models · novelty-matrix · open-questions · scientific-audit
├── papers/                  # bibliography + working paper
├── figures/                 # figures en markdown (state-t0, architecture, graphes, trajectoire)
├── specs/                   # api-concept · data-schema · implementation-roadmap
└── validator/               # ← implémentation réelle (contrat)
    ├── validate.py · requirements.txt · README.md
    ├── hcsm_validate/ (ontology.py 176 · schema.py 721 · admissibility.py 393 · cli.py 232)
    ├── cases/ (valid/ 5 · invalid/ 17)
    └── tests/test_validator.py (299)
```

## Documents (docs/00 → 14)

Position scientifique (01 : ce que HCSM ne revendique pas, la contribution =
séparation Knowledge→Measurement→Inference→Function) · état de l'art (02) ·
gap de recherche (03) · modèle conceptuel (04) · ontologie (05) · évidence (06) ·
inférence (07) · temps (08) · incertitude & provenance (09) · contexte (10) ·
fonctionnement (11) · validation (12) · protocole de recherche (13) · limites (14).

Hypothèses H1-H6 : H1 l'état ≠ profil de scores ; H2 la séparation K/E/I réduit
la réification ; H3 le contexte améliore la validité écologique ; H4 le graphe
avec alternatives > score unique ; H5 plus-value HCSM sur RDoC/ICF/Cognitive
Atlas au niveau personne-temps ; H6 la qualité de l'inférence est bornée par
celle de l'évidence (refuser plutôt qu'inventer).

## Le validateur Python (réutilisable tel quel)

`validator/` **n'estime rien** : il vérifie la forme (V1) et l'admissibilité de
l'inférence (V5) d'objets JSON contre l'ontologie YAML et `specs/data-schema.md`.

Rejette : score nu (`V1-NAKED-SCORE`), observation portant une estimation,
`ConstructEstimate` sans incertitude/fenêtre/preuves/provenance/contexte,
`Refusal` avec valeur, projection fonctionnelle non-hypothèse, cible
diagnostique, feature digitale présentée comme construit, PII, fenêtre T0 mal
formée. Refus (V5) : `NO_CONSTRUCT`, `NO_EVIDENCE`, `WINDOW_UNDEFINED`,
`CONTEXT_MISSING`, `UNRESOLVED_ALTERNATIVES`, `MISALIGNED_MEASURE`,
`PROVENANCE_BROKEN`.

Usage : `python validate.py cases/valid/…json` · `--all` · `--admit` · `pytest`.

## Réutilisable pour la vision

- **Ontologie YAML** → vocabulaire cible du Core (Phase 1) et du graphe mémoire.
- **`specs/data-schema.md` + `api-concept.md`** → contrat à instancier par le
  proto (aujourd'hui découplé).
- **Validateur** → garde-fou qualité/éthique de toute sortie « cognitive »
  (l'équivalent serveur de l'`epistemics.ts` client).
- **Catalogue de mesures** + **bibliographie** → alimentent le Knowledge Graph.

## Gaps

- Aucune implémentation computationnelle (Cognition Hub = phase ultérieure).
- Non câblé au proto ni au validateur d'ETAT-DE-LART (3 bases de connaissances
  séparées, cf. `09-synthese.md`).
- v0.1 volontairement sans données personnelles, sans usage clinique.
