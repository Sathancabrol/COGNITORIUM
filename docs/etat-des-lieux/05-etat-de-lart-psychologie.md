# 05 — ETAT-DE-LART-PSYCHOLOGIE (base de connaissances critique)

**Rôle :** la **couche « connaissances »** — état de l'art critique de la
psychologie 2020-2026 (méthode PRISMA 2020) + transposition 4E/énactivisme pour
Cognitorium, avec base de données 42 champs, Trust Factor, visualisations D3 et
une **application web FastAPI**.
**Maturité :** v2.0 corrigée + app « Cognitorium v4 ».
**Dépôt :** `Sathancabrol/ETAT-DE-LART-PSYCHOLOGIE`.

## Ce que le dépôt contient (au-delà du README)

1. **Document principal** : `docs/ETAT_ART_CRITIQUE_PSYCHOLOGIE_2020_2026_CORRIGE.md`
   (594 l.) — 5 parties, 12 domaines, PRISMA, gaps → questions testables.
2. **Base de données** : `data/nodes_etat_art_psychologie.csv` (42 colonnes,
   14 entrées, validation PASSED, Trust moyen 73,2).
3. **Méthode** : PRISMA_FLOW, SEARCH_STRATEGIES, TEMPLATE_CHAMPS.csv (42
   colonnes), GUIDE_REMPLISSAGE_IA (23 k chars, workflow 7 étapes, formule Trust).
4. **Analyses Cognitorium** : ANALYSE_CONCEPTS_COGNITORIUM_4E (10 concepts 4E :
   incarnée, située, énactivisme, étendue, affordance, ACT-IN, charge cognitive,
   agence, émotion, couplage — avec opérationnalisation concept→mécanisme→
   comportement→fonctionnalité→métrique→hypothèse testable), TAXONOMIE_PSYCHOLOGIE
   (5 piliers), ARCHITECTURE_BASE_DE_DONNEES, METACOGNITION_EDUCATION, SYNTHESE_CIBLEE.
5. **Visualisations** : `output/visual/` (index.html cartes filtrables,
   d3_interactive.html graphe force-directed à liens typés, taxonomy_graph.html),
   diagrammes Mermaid, PNG.
6. **Scripts** : `validate_entry.py` (28 champs obligatoires, regex DOI,
   triangulation ≥3, tags ≥3, trust 0-100, dates ISO, doublons),
   `add_entry.py` (DOI → ligne via Crossref).
7. **Application web** : `app/main.py` (905 l.) — **FastAPI « Cognitorium v4 »**,
   SQLite (`references_table`), Jinja2, API REST `/api/nodes` (filtres search/
   domain/type_pub/niveau) + `/api/nodes/{id}`, modèle `MetacognitiveTrace`
   (traces de session : phase, objectif, critères, requête IA, réponse,
   évaluation, confiance, plan d'action), `app/database.py` (137),
   `app/templates/index.html` (716).

## Trust Factor

```
Trust = M(0-30 méthodo) + R(0-20 réplication) + O(0-20 open science)
      + C(0-15 cohérence) + T(0-15 transparence) − P(0-50 pénalités)   → 0-100
```

## Réutilisable pour la vision

- **`app/` FastAPI + SQLite** → le premier (et seul) **backend persistant**
  de l'écosystème ; motif à généraliser pour le Core (Phase 1).
- **TEMPLATE_CHAMPS.csv + validate_entry.py** → pipeline qualité des données.
- **Base 42 champs + Trust Factor** → alimente le Knowledge Graph (alignable
  HCSM).
- **ANALYSE_CONCEPTS_COGNITORIUM_4E** → fondements pour le Cognitive Engine du
  CLE et le profil cognitif (dimension « incarnée/située »).

## Gaps

- 14 entrées seulement (vs annonce 120-250 publications) — base encore creuse.
- Deux autres bases de connaissances coexistent (proto `psychologyAtlas`,
  ontologie HCSM) — **doublon structurel** (cf. `09-synthese.md`).
- App web non reliée au proto (pas d'API partagée, pas d'auth).
- Dépôt volumineux : PNG/DOCX/PDF + 2 appli web statiques en double
  (`output/visual/` vs `app/templates/`).
