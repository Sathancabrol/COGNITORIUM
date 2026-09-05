# 003 — Stack données & mémoire (tranche ADR-007)

**Type :** audit externe (technologie)
**Date :** 2026-09-05 · **Statut :** `DECISION` (ADR-007 fermée)
**Objet :** une seule source de vérité pour Human / Knowledge / World / Memory.

---

## Besoin

Une base unique capable de tenir à la fois :
- le **graphe** (Skill Graph, World Graph, relations de la vision) ;
- les **vecteurs** (mémoire/RAG : documents, conversations, ressources) ;
- le **spatial** (World : lieux, géométries, PostGIS) ;
- le **relationnel** (profils, preuves, évaluations — les 42 champs).

Contraintes : local-first / souveraineté, budget scénario 1 (0-500 €), faible
charge d'exploitation, remplaçabilité (règle P4).

## Options évaluées

| Solution | Type | Licence | Verdict |
| --- | --- | --- | --- |
| **PostgreSQL + pgvector (+ pgvectorscale)** | relationnel + vecteurs | PostgreSQL / MIT | ✅ défaut souverain ; SQL + filtrage + hybride |
| **Apache AGE** | graphe de propriétés dans PostgreSQL (Cypher) | Apache-2.0 | ✅ graphe 1-2 sauts suffisant pour notre usage |
| **PostGIS** | spatial dans PostgreSQL | GPL-2.0 (PostgreSQL) | ✅ World Graph |
| Neo4j (Community) | graphe natif | GPLv3 / commercial | ❌ système dédié ; utile seulement si traversées >2-3 sauts à grande échelle |
| Qdrant / Chroma / Milvus / Weaviate | vecteurs dédiés | OSS / managed | ⏸️ à adopter seulement si pgvector sature (≳ 1-10 M vecteurs) |
| RDF / SPARQL (triplestore) | graphe sémantique + inférence | divers | ⏸️ si raisonnement ontologique nécessaire (HCSM) — sinon surcoût |

## Analyse (appuyée sur sources)

- Pour un corpus modeste et un stack existant, **pgvector est le défaut**
  raisonnable : une base, un backup, filtrage SQL + recherche hybride
  (bigiron.cc ; vucense.com). Qdrant domine à grande échelle (>1 M vecteurs,
  filtrage natif) ; Chroma pour prototyper vite.
- **Apache AGE** replie le graphe dans PostgreSQL : 1 seule connexion, 1 backup,
  1 licence permissive, HA PostgreSQL existant (Patroni). Il est **plus rapide
  que Neo4j sur les patterns RAG 1-2 sauts** (CRUD, lookup) ; Neo4j ne gagne
  que sur les traversées profondes 3+ sauts ou l'analyse de graphe massive
  (puppygraph.com ; baem1n.dev ; reddit r/apacheage).
- Notre charge graphe = prérequis de compétences, profil↔métier (ROME),
  liens place↔objet : typiquement **1-2 sauts** → AGE convient.

## Décision (ADR-007)

> **PostgreSQL 16+ + pgvector (+ pgvectorscale) + Apache AGE + PostGIS**,
> une seule instance. L'ontologie HCSM (`hcsm-v0.1.yaml`) reste la **source de
> vocabulaire** (validée par `validator/`) et se projette dans le graphe de
> propriétés ; pas de triplestore en v1.

- Déclencheurs de réévaluation : >10⁶ vecteurs et/ou traversées récurrentes
  profondeur ≥3 → évaluer Neo4j ; besoins d'inférence RDF/OWL → triplestore.
- Migrations : SQL versionné ; le schéma `raw/01_cognitorium_schema_ddl.sql`
  (proto) et `ETAT-DE-LART/app/database.py` (SQLite) servent de point de départ.

## Sources

- https://www.bigiron.cc/guides/rag-on-a-homelab-self-hosted-chromadb-vs-qdrant-vs-pgvector
- https://vucense.com/dev-corner/vector-databases-comparison-2026/
- https://fastcrw.com/blog/best-vector-databases
- https://www.puppygraph.com/learn/apache-age-vs-neo4j
- https://baem1n.dev/en/posts/graphrag-with-postgresql/
