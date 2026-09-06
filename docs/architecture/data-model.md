# Modèle de données unifié — Core (proposition v0.1)

**Statut :** `PROPOSED` · livrable préparatoire de la Phase 1 · 2026-09-05

Objectif : **une seule grammaire** pour Human / Knowledge / World / Memory, en
réconciliant les 3 schémas existants :

| Source existante | Apport |
| --- | --- |
| `proto-cognitorium/src/types.ts` | nœuds, preuves, compétences, capacités, métiers |
| `HCSM/ontology/hcsm-v0.1.yaml` + `specs/data-schema.md` | construits, observations, estimations, refus, provenance |
| `ETAT-DE-LART` TEMPLATE_CHAMPS (42 colonnes) | publications, Trust Factor, qualité |

---

## 1. Les 8 entités fondatrices (brief §21)

```
User ──owns──▶ Project ──contains──▶ Task ──produces──▶ Object
  │                │                    │
  ├──has──▶ Skill  ├──located──▶ Place  └──records──▶ Event
  │                │
  └──knows─▶ Knowledge ◀──cites── Source
```

## 2. Chaque entité porte le « socle épistémique » (hérité HCSM + proto)

Tout nœud, quelle que soit sa couche, doit pouvoir porter :

```yaml
id: string              # stable, versionné
type: User|Project|Knowledge|Skill|Object|Place|Task|Event
name: string
provenance:             # qui, comment, quand
  source: cv|declaration|project|diploma|ai_inference|validation_humaine|measure|...
  sourceDocument: string|null
  sourcePage: int|null
  verifiedAt: datetime|null
  verifiedBy: string|null
confidence: 0..100
inference_type: fact|inferred|hypothesis        # fait / inféré / hypothèse
epistemic_level: 1..5                            # échelle épistémique (proto)
uncertainty:                                     # HCSM : jamais un score nu
  value: float|null
  window: string|null          # fenêtre temporelle T0 ± Δ
  alternatives: [string]       # explications alternatives
context: { ... }               # contexte (HCSM context model)
temporal:
  created_at, updated_at, valid_from, valid_to
```

Règle d'or (HCSM, reprise telle quelle) :
> une **observation** n'est pas un **construit** ; une **estimation** exige
> incertitude + fenêtre + preuves ; un **diagnostic** est interdit.

## 3. Entités spécifiques (squelette)

- **Skill** : `base_mastery`, `last_practiced`, `half_life`, `vitality` (decay),
  `transferability`, `prerequisites[]` (→ graphe AGE).
- **Knowledge** : `domain`, `decay_rate`, `source_id`, `trust_factor` (42 champs).
- **Object** : `geometry` (glTF/STEP), `materials`, `constraints`, `cad_source`.
- **Place** : `geom` (PostGIS), `scale` (objet→planète), `layers` (bâtiment,
  infra, réseau).
- **Project** : `goal`, `scenarios[]`, `budget`, `schedule` (4D), `results[]`.
- **Task / Event** : actions, acteurs, temporalité (timeline).

## 4. Relations typées (futur graphe AGE / Cypher)

```cypher
(:User)-[:HAS_SKILL]->(:Skill)
(:Skill)-[:REQUIRES]->(:Skill)            -- prérequis
(:Skill)-[:SUPPORTS]->(:Capacity)
(:Capacity)-[:MATCHES]->(:Job)            -- ROME
(:Project)-[:LOCATED_AT]->(:Place)
(:Project)-[:PRODUCES]->(:Object)
(:Knowledge)-[:CITES]->(:Source)
(:Observation)-[:EVIDENCE_FOR]->(:ConstructEstimate)   -- HCSM
```

## 5. Format d'échange

- **Canonique** : JSON Schema unique (dérivé de `reaserch-engine/schemas/` à
  compléter + HCSM `specs/data-schema.md`).
- **Ontologie** : `hcsm-v0.1.yaml` reste l'autorité de vocabulaire ; le schéma
  SQL est une **projection** de l'ontologie (pas un remplacement).
- **Validation** : passer tout objet « cognitif » par `HCSM/validator/` avant
  persistance ; passer tout asset/profil par l'échelle épistémique.

## 6. Prochaines étapes

1. Rédiger le JSON Schema v0.1 (livrable Phase 1).
2. Écrire la migration SQL (depuis `raw/01_cognitorium_schema_ddl.sql` +
   `app/database.py`).
3. Adapter `proto/src/types.ts` pour en faire une projection de ce schéma.
