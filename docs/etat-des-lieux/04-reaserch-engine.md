# 04 — reaserch-engine (orchestrateur de recherche autonome)

**Rôle :** la **couche « preuve & vérification »** — transformer une question
en langage naturel en un dossier de recherche rigoureux, sourcé et traçable.
**Maturité :** v0.1 (Python, testé, sans dépendance réseau par défaut).
**Dépôt :** `Sathancabrol/reaserch-engine` (nom « reaserch », sic).

## Principes de conception (README)

- **Local-first** : inspecter les sources locales avant d'étendre à l'externe.
- **Méthodologie hybride** : portes de qualité fixes + stratégie adaptative.
- **Evidence over fluency** : le LLM est un composant de raisonnement ; le
  moteur possède l'état, la provenance, la vérification et l'arrêt.
- **Auditabilité** : conclusions traçables (claim → evidence → source).
- **Incertitude explicite** : les preuves insuffisantes restent visibles.
- **Itération autonome** : recherche → preuves → claims → contradictions →
  synthèse → vérification → suffisance → action suivante.

## Pipeline

```
User input → Question analysis → Research planning → Adaptive strategy →
Research agents/tools → Evidence + claims → Contradiction analysis → Synthesis
→ Verification → Sufficiency / stopping → Final research dossier
```

## Structure

```
reaserch-engine/
├── README.md (61)
├── docs/ (16)               # architecture, protocole (939 l.), lifecycle, glossary…
├── engine/ (24 modules)     # cœur sans dépendance
│   ├── orchestrator.py (98)   # agents injectés comme callables (pas de couplage vendeur)
│   ├── state_machine.py (38)  # 9 états + transitions légales (CREATED→…→COMPLETED)
│   ├── research_model.py (92) # entités (Source/Evidence/Claim/Contradiction/Conclusion)
│   ├── evidence_graph.py (136)# graphe Source→Evidence→Claim (+ conflits)
│   ├── agents.py (127) · planner.py · research_strategy.py · question_analyzer.py
│   ├── retrieval.py (107)     # interface Retriever (protocole) + InMemory + Crossref + LocalFirst
│   ├── providers.py (27)      # ProviderRegistry (abstraction fournisseurs)
│   ├── source_quality.py · quality.py · claims.py · evidence_extractor.py
│   ├── graph_assessment.py · sufficiency.py · dossier.py · persistence.py
│   ├── run_builder.py · default_pipeline.py · actions.py
├── schemas/ (9 JSON Schema)  # claim/evidence/source VIDE (0 l.) — à compléter
└── tests/ (12 fichiers)     # pytest du pipeline
```

## Points techniques notables

- **Machine à états stricte** : `ResearchState` = CREATED · PLANNING ·
  RESEARCHING · SYNTHESIZING · VERIFYING · SUFFICIENT · BLOCKED · COMPLETED ·
  FAILED, avec transitions légales explicites.
- **Fournisseurs abstraits** (déjà conforme à la règle P4) : `Retriever`
  (protocole), `InMemoryRetriever` (tests), `CrossrefRetriever` (DOI),
  `LocalFirstRetriever`, `ProviderRegistry`.
- **Checkpointing** : `JsonRunStore` sauvegarde atomiquement chaque étape
  (runs interrompus inspectables et reprenables, sans base de données).
- **Graphe d'évidence** : `Source --provides--> Evidence --supports|contradicts-->
  Claim --conflicts_in--> Contradiction --qualifies--> Conclusion`.
- **Critère d'arrêt explicite** : chaque run enregistre pourquoi la recherche
  s'est arrêtée (suffisance ou blocage → revue humaine).

## Réutilisable pour la vision

- **Backend de vérification** des preuves du profil (proto) : sourcer et
  auditer les affirmations (aligné sur HCSM « evidence »).
- **Base du multi-agent Phase 7** : orchestrateur + agents injectables.
- **Pattern « provider-agnostic »** : modèle à répliquer pour LLM/GIS/3D.

## Gaps / limites

- 3 schémas JSON vides (`claim`, `evidence`, `source`) — la spec JSON est
  incomplète.
- Les agents concrets (web search, LLM) sont des stubs ; pas de modèle branché
  par défaut.
- Pas de persistance partagée avec les autres dépôts (JSON local uniquement).
- Nom du dépôt avec faute (« reaserch ») — renommage à envisager.
