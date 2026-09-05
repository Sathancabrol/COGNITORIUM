# 09 — Synthèse transversale

**Objet :** relier les 8 dépôts entre eux et à la vision (Master Brief) :
doublons, manques, convergence, matrice Build/Buy/Wrap, actions.

---

## 1. Position de chaque dépôt dans les couches de la vision

| Couche (Master Brief §4) | Dépôt(s) | État |
| --- | --- | --- |
| HUMAN | proto-cognitorium (profils, compétences, capacités) + intelTwin (« carte T0 ») | proto |
| KNOWLEDGE | ETAT-DE-LART (base 42 champs) + proto (psychologyAtlas, psyRef) + HCSM (ontologie) | 3 bases séparées |
| WORLD | watchtower-mods (Cesium : lieux, chantier, territoire, 4D) | proto avancé |
| WORLD GRAPH | fragments (intelTwin, ficheLieu, chantier) — pas de graphe central | fragments |
| SKILL GRAPH | proto (implicite) + CLE (concepts) — pas de schéma unifié | partiel |
| CLE | COGNITORIUM/learning | PoC |
| DESIGN / SIMULATION | néant | à construire |
| CAD / FABRICATION | néant (roadmap IFC dans SOURCES-FR) | à construire |
| AGENTS | reaserch-engine (orchestrateur + 1 agent recherche) | v0.1 |
| MÉMOIRE | localStorage (proto, learning) + JSON (reaserch) + SQLite (ETAT-DE-LART) | éclatée |

## 2. Doublons (à trancher)

1. **Trois bases de connaissances** (même domaine « cognition ») :
   - `proto-cognitorium/src/data/psychologyAtlas.ts` + `psyRefLibrary.ts` + `psyRefSources.ts`
   - `ETAT-DE-LART/data/nodes_etat_art_psychologie.csv` (+ FastAPI/SQLite)
   - `HCSM/ontology/hcsm-v0.1.yaml` + `scientific/`
   → Recommandation : HCSM = vocabulaire canonique ; ETAT-DE-LART = contenu
   sourcé ; proto = vue/consommation. ADR-009 ouverte.

2. **Deux représentations de l'état cognitif** :
   - HCSM (scientifique, incertitude/provenance)
   - intelTwin « carte d'identité cognitive T0 » (heuristique, local)
   - proto `capacity_cognitive` (qualitatif)
   → Recommandation : faire passer intelTwin et proto par le contrat HCSM
   (validateur).

3. **Code Watchtower en 2 endroits** : `COGNITORIUM/watchtower-mods/` (delta) vs
   dépôt `watchtower` (vide). → Publier le fork (APPLIQUER.md) en Phase 3.

## 3. Manques critiques (vs vision)

| Manque | Impact | Bloque |
| --- | --- | --- |
| Modèle de données unifié (Core : User/Project/Object/Place/Task/Event) | élevé | Phase 1 |
| Mémoire partagée (base unique + vecteurs + graphe) | élevé | tout |
| Abstraction LLM (Gemini est en dur dans le proto) | élevé | P4 |
| Câblage HCSM ↔ proto ↔ CLE ↔ reaserch ↔ Watchtower | élevé | convergence |
| CI/CD, tests (sauf reaserch/HCSM), Docker | moyen | fiabilité |
| Auth / multi-utilisateurs | moyen | plateforme |
| Monitoring des coûts IA | moyen | budget |

## 4. Ce qui est directement réutilisable (BUY/WRAP interne)

- **Échelle épistémique** (proto `epistemics.ts`) + **validateur HCSM** = le
  même principe côté client / côté contrat.
- **Moteur ROME** (proto) = orientation (Phase 2).
- **Courbe d'oubli** (proto `decay.ts`) = dimension temporelle du Skill Graph.
- **Orchestrateur + ProviderRegistry** (reaserch-engine) = squelette multi-agent
  (Phase 7) et preuve/vérification.
- **FastAPI + SQLite** (ETAT-DE-LART) = premier backend persistant ; motif à
  étendre (PostgreSQL/PostGIS/pgvector).
- **Watchtower** = Gods Eye View (Phase 3) clé en main, sans clé.
- **CLE** = apprentissage (Phase 2), à industrialiser (schéma JSON).
- **Pattern « révélation progressive »** (animation-chronos) = onboarding/narration.

## 5. Matrice Build / Buy / Wrap (synthèse)

| Fonction | Existe chez nous | Existe ailleurs | Décision v1 | Priorité |
| --- | --- | --- | --- | --- |
| Skill Graph | proto (implicite) | Lightcast, Degreed, Neo4j | BUILD (formaliser, aligné HCSM) | P0 |
| CLE | PoC learning/ | h5p, xAPI, ITS | BUILD (schéma JSON) | P0 |
| World Graph | fragments intelTwin/chantier | Palantir, PostGIS, Neo4j | WRAP PostGIS + graphe | P0 |
| Memory | éclatée | pgvector, Qdrant, Neo4j | WRAP PostgreSQL+pgvector | P0 |
| GIS | Cesium (sans clé) | Mapbox, MapLibre, PostGIS | KEEP Cesium + IGN | P1 |
| 3D | Cesium + three.js | Three, Babylon | KEEP | P1 |
| Multi-agent | reaserch-engine | LangGraph, CrewAI, AutoGen | BUILD léger (orchestrateur existant) | P1 |
| CAD | non | OpenCascade.js, Replicad, JSCAD, FreeCAD | WRAP Replicad/OpenCascade.js | P1 |
| Simulation | non | Omniverse, Isaac, EnergyPlus | WRAP ciblé | P2 |
| Manufacturing | non | OrcaSlicer, PrusaSlicer, Klipper | WRAP slicer open source | P2 |

## 6. Actions recommandées (ordre)

1. **Sécuriser/confirmer** : aucun secret en clair dans les instantanés actuels
   (vérifié 2026-09-04) — maintenir `.gitignore` strict ; surveiller l'historique
   Git du proto (le fichier `identifiants_*.json` a existé → **rotation** des
   identifiants par prudence).
2. **Mission 002 — audit externe** : trancher base mémoire (ADR-007),
   abstraction LLM (ADR-008), moteur CAD (Replicad vs OpenCascade.js),
   framework multi-agent.
3. **Phase 1 — Core** : définir le schéma unifié (en s'appuyant sur
   `proto/src/types.ts` + `HCSM/specs/data-schema.md` + `ETAT-DE-LART`
   TEMPLATE_CHAMPS) et choisir la base.
4. **Réduire la dispersion** : archiver Language-decoder ; rattacher
   animation-chronos à un usage précis ou archiver ; publier le fork Watchtower.
5. **Câbler** : reaserch-engine ← preuves du proto ; validateur HCSM ← toute
   sortie « cognitive » ; CLE ← graphe global.

---

*Ce dossier complète `docs/audits/internal/001-audit-global.md` (matrice §30 du
brief) et la gouvernance `docs/constitution/`. Aucun code modifié.*
