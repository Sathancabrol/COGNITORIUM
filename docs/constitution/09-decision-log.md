# 09 — Registre de décisions (ADR)

**Statut :** `CONSTITUTION` · v1 · Septembre 2026

Chaque décision d'architecture ou de technologie significative est consignée
ici, pour qu'on sache **pourquoi** un choix a été fait (et non pas seulement
quoi). Format : ADR (Architecture Decision Record).

---

## ADR-001 — Séparation des trois objets (HCSM / Cognition Hub / Cognitorium)

- **Date :** 2026-08-25
- **Statut :** Accepté
- **Contexte :** le document source « Cognition Hub » mélangeait modèle,
  système et écosystème.
- **Décision :** HCSM = modèle scientifique (ontologie, évidence, inférence) ;
  Cognition Hub = système computationnel qui l'instancie ; Cognitorium =
  architecture globale (connaissances, compétences, expériences, trajectoires).
- **Conséquences :** chaque dépôt a un rôle clair ; le proto et le modèle
  restent (pour l'instant) découplés.

## ADR-002 — Core applicatif = proto-cognitorium (React 19 + TS + Vite + Express)

- **Date :** 2026-08-26
- **Statut :** Accepté
- **Contexte :** besoin d'un prototype d'« audit du capital cognitif ».
- **Décision :** React 19 + TypeScript + Vite 6, serveur Express, IA Gemini
  (`@google/genai`) côté serveur, persistance `localStorage`.
- **Conséquences :** graphe 5 niveaux, échelle épistémique, moteur ROME,
  courbe d'oubli, profils réels — tous issus de ce socle.

## ADR-003 — Interface « monde » = fork de gods-eye-view (CesiumJS, vanilla JS)

- **Date :** 2026-09-01
- **Statut :** Accepté
- **Contexte :** besoin d'une visualisation géospatiale 3D multi-échelles.
- **Décision :** fork de `bilawalsidhu/gods-eye-view` (commit `65bc522`) en
  « Watchtower », priorité **gratuit sans clé** (Esri/CARTO, Photon/Nominatim,
  voix Web Speech, EONET), CesiumJS en vanilla JS + Vite.
- **Conséquences :** les mods vivent dans `COGNITORIUM/watchtower-mods/` ; le
  dépôt cible `watchtower` est encore vide (voir audit §16).

## ADR-004 — Moteur de recherche autonome = Python maison (reaserch-engine)

- **Date :** 2026-08-27
- **Statut :** Accepté (à réévaluer)
- **Contexte :** besoin d'un pipeline recherche → dossier sourcé avec
  provenance et incertitude explicites.
- **Décision :** orchestrateur Python maison (machine à états, agents, graphe
  d'évidence, checkpointing JSON), plutôt qu'un framework d'agents.
- **Conséquences :** contrôle total de la traçabilité ; à réévaluer quand le
  multi-agent (Phase 7) montera en charge.

## ADR-005 — Persistance locale pour les PoC (localStorage)

- **Date :** 2026-08-26
- **Statut :** Accepté (temporaire)
- **Contexte :** vitesse de prototypage.
- **Décision :** `localStorage` pour proto-cognitorium et learning-engine.
- **Conséquences :** dette assumée ; migration serveur (SQLite/PostgreSQL)
  prévue. Le schéma SQL existe déjà dans `raw/01_cognitorium_schema_ddl.sql`.

## ADR-006 — Gouvernance par constitution + registre de décisions

- **Date :** 2026-09-04
- **Statut :** Proposé (ce document)
- **Contexte :** passer d'une succession de prototypes à une entreprise
  logicielle pilotée par agents.
- **Décision :** `docs/constitution/` + registre ADR + audits versionnés.
- **Conséquences :** toute décision structurante doit être tracée ici.

## ADR-007 — Base mémoire / graphe / vecteurs / spatial

- **Date :** 2026-09-05 · **Statut :** Accepté
- **Décision :** **PostgreSQL 16+ + pgvector (+ pgvectorscale) + Apache AGE +
  PostGIS**, une seule instance. L'ontologie HCSM reste la source de vocabulaire
  (validée par `validator/`), projetée dans le graphe de propriétés AGE ; pas de
  triplestore en v1.
- **Justification :** 1 base, 1 backup, 1 connexion, licences permissives,
  souveraineté ; AGE suffit (traversées 1-2 sauts : prérequis, profil↔métier).
  Déclencheurs de réévaluation : >10⁶ vecteurs, traversées profondeur ≥3
  récurrentes, inférence RDF/OWL.
- **Référence :** `docs/audits/external/003-stack-donnees-memoire.md`.

## ADR-008 — Abstraction LLM & orchestration multi-agents

- **Date :** 2026-09-05 · **Statut :** Accepté
- **Décision :** (1) interface `LLMProvider` unique (`complete/stream/embed`) —
  défaut Gemini, optionnels OpenAI/Anthropic, **cible locale** (Ollama) pour la
  souveraineté ; embeddings open source. (2) Orchestration : **orchestrateur
  maison** (reaserch-engine) comme noyau, outils exposés via **MCP** ; LangGraph
  seulement si workflows durables multi-étapes avec human-in-the-loop le
  justifient (réévalué en Phase 7).
- **Référence :** `docs/audits/external/005-stack-llm-agents.md`.

## ADR-009 — Unification des bases de connaissances

- **Date :** 2026-09-05 · **Statut :** Accepté
- **Décision :** **HCSM = vocabulaire canonique** (ontologie + validateur) ;
  **ETAT-DE-LART = contenu sourcé** (42 champs, Trust Factor) ; **proto = vue /
  consommation**. Migration vers un schéma unique (JSON Schema + projection
  SQL), sans réécrire les dépôts (adaptateurs).
- **Référence :** `docs/architecture/data-model.md` · `docs/architecture/convergence.md`.

## ADR-010 — Book of Shapes comme source d'assets (motifs/backgrounds)

- **Date :** 2026-09-05
- **Statut :** Accepté **sous réserve** (licence à confirmer)
- **Contexte :** besoin d'assets visuels (fonds, textures, visuels de graphes,
  posters) pour l'UI et la communication de Cognitorium, sans budget.
- **Décision :** utiliser https://bookofshapes.com/ (galerie de motifs SVG
  génératifs gratuits, paramétrables, export SVG + mode poster) comme source de
  référence des motifs/backgrounds — en téléchargement manuel (pas d'API).
- **Conditions :** (1) obtenir confirmation écrite du créateur (Nikolaj
  Sokolowski, nikolaj@creasurf.net) sur les droits de réutilisation/commerciale ;
  (2) archiver chaque asset avec provenance (URL, seed, paramètres, date,
  licence) dans `assets/patterns/SOURCES.md` ; (3) attribution au créateur.
- **Conséquences :** pas de dépendance à une API ; risque de verrouillage nul ;
  à réévaluer si un besoin de génération programmatique/animée émerge
  (réimplémentation possible — motifs documentés algorithmiquement).
- **Référence :** `docs/audits/external/002-bookofshapes.md`.
