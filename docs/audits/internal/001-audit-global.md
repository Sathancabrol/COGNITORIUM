# Mission 001 — Audit Global Cognitorium

**Type :** audit interne (inventaire + matrice)
**Date :** 2026-09-04 · **Version :** v1 (évolutif)
**Périmètre :** les 8 dépôts `Sathancabrol/*` accessibles + contenu du repo
`COGNITORIUM`. Aucune modification de code ni d'architecture.

---

## 1. Inventaire des repositories

| Repo | Description | Rôle dans la vision | État |
| --- | --- | --- | --- |
| `COGNITORIUM` | vitrine / agrégateur + `learning/` + `watchtower-mods/` | documentation + apprentissage + géo | PoC |
| `proto-cognitorium` | app React 19 + Vite + Express + Gemini | **Core applicatif** (profil, graphe, preuves, ROME) | le plus avancé |
| `HCSM` | modèle scientifique de l'état cognitif | **couche modèle** (ontologie, inférence, incertitude) | documents `PROPOSED` |
| `reaserch-engine` | orchestrateur de recherche Python | **couche preuve & vérification** | v0.1 testé |
| `ETAT-DE-LART-PSYCHOLOGIE` | état de l'art critique 2020-2026 | base de connaissances | v2.0 |
| `watchtower` | dépôt cible du fork gods-eye-view | géo/3D | **vide** |
| `Language-decoder` | « décodeur de langage multimodal » | (à définir) | quasi vide |
| `animation-chronos` | animation de découverte (React) | pattern UX de révélation | séparé |

## 2. Architecture actuelle (as-is)

```text
                         COGNITORIUM (écosystème)
                                   │
        ┌──────────────┬───────────┼───────────────┬──────────────┐
        │              │           │               │              │
   proto-cognitorium  HCSM    reaserch-engine  ETAT-DE-LART   watchtower-mods
   (app, React+Gemini) (modèle)  (preuves)      (connaissances) (Cesium 3D)
        │                                                        │
   graphe 5 niveaux                                          globe + chantier
   échelle épistémique                                       + intelTwin
   decay + ROME matching                                      (tous sans clé)
```

**Constat clé :** les briques existent mais ne sont **pas câblées entre elles**.
HCSM n'est pas branché au proto ; le Learning Engine n'est pas relié au graphe
global ; reaserch-engine n'alimente aucune preuve du profil.

## 3. Fonctionnalités existantes

- **proto-cognitorium** : graphe 5 niveaux (Expérience → Tâche → Compétence →
  Cognition → Matching), échelle épistémique 5 niveaux, moteur ROME explicable
  (1 911 fiches, 17 920 compétences, FORMACODE), courbe d'oubli (Ebbinghaus),
  profils réels (4), extraction CV par IA avec validation humaine, modes
  graphe/arbre/tableau/timeline, atlas de psychologie, catalogues
  d'expériences/évaluations/outils, boucle métacognitive (Zimmerman).
- **learning/** : CLE PoC — 2 scénarios (turboréacteur, argent), graphe de
  concepts, feedback, transfert.
- **watchtower-mods/** : globe 3D Cesium gratuit (Esri/CARTO/IGN), recherche de
  lieux sans clé (Photon/Nominatim/BAN), voix FR/EN (Web Speech), feux EONET,
  fiche lieu / digital twin, hub chantier (prospection BOAMP, phasage 4D, GPS,
  sous-sol OSM), intelTwin (jumeau territorial + « carte d'identité cognitive
  T0 »), import KML/GeoJSON, météo Open-Meteo.
- **reaserch-engine** : pipeline question → dossier sourcé, graphe d'évidence,
  machine à états, checkpointing, retrieval Crossref.
- **HCSM** : ontologie YAML, modèles mathématiques (état T0, temporal,
  incertitude), catalogue de mesures, hypothèses H1-H6.
- **ETAT-DE-LART** : base CSV 42 champs + Trust Factor + scripts de validation
  et d'ajout par DOI (Crossref).

## 4. Fonctionnalités partielles

- Skill Graph : implicite dans le proto, sans schéma de données unifié.
- World Graph : fragments (intelTwin, chantier, ficheLieu), sans modèle central.
- Mémoire : `localStorage` (proto, learning) et `JsonRunStore` (reaserch-engine),
  sans persistance partagée.
- Multi-agent : 1 seul agent (recherche), pas de coordination.
- Simulation : néant (seule la « simulation » de chantier, budgétaire/temporelle).
- CAD / Fabrication : néant (roadmap IFC→3D Tiles esquissée).

## 5. TODO connus

- Proto : brancher le schéma SQL (`raw/01_cognitorium_schema_ddl.sql`), intégrer
  le questionnaire des 10 biais, lazy-loading du référentiel ROME (5,4 Mo),
  persistance serveur.
- HCSM : implémentation (Cognition Hub) hors périmètre v0.1.
- CLE : passer d'un scénario statique à un schéma JSON versionné, persister le
  Skill Graph, brancher au graphe Cognitorium global (cf. `learning/ARCHITECTURE.md`).
- Watchtower : reconstruire le dépôt `watchtower` (procédure dans `APPLIQUER.md`),
  couches trafic/pluie, conversion IFC.

## 6. Bugs / limites connus

- Le référentiel ROME est en dur (5,4 Mo dans le bundle).
- Matching ROME = indice de proximité (pas une garantie) — correctement affiché.
- Le dépôt cible `watchtower` est vide : le code réel vit dans
  `COGNITORIUM/watchtower-mods/` (risque de désynchronisation).
- `Language-decoder` et `animation-chronos` : pas de lien explicite avec la vision.

## 7. Dette technique

- Persistance `localStorage` (proto) — non partagée, non versionnée.
- Trois bases de connaissances non unifiées (§16).
- Données volumineuses dans Git : images (~18 Mo) et `romeData.ts` (5,4 Mo).
- Pas de CI/CD, pas de Docker, pas de tests sur proto/learning/watchtower-mods
  (tests présents uniquement dans reaserch-engine).
- `raw/` du proto contient des secrets en clair (§10).

## 8. Dépendances principales

- **proto-cognitorium** : React 19, Vite 6, TypeScript, Express 4,
  `@google/genai` ^2.4, three ^0.185, Tailwind 4, lucide-react, motion,
  canvas-confetti, bun.lock présent.
- **watchtower-mods** : CesiumJS, Vite, vanilla JS.
- **reaserch-engine** : Python (stdlib + requests pour Crossref).
- **HCSM / ETAT-DE-LART** : documentation + scripts Python légers.

## 9. APIs / services externes utilisés

- **IA** : Gemini (`@google/genai`) — extraction CV, distiller, schéma serveur.
- **Géo (Watchtower, sans clé)** : Esri World Imagery, CARTO/OSM, Photon +
  Nominatim, BAN (api-adresse.data.gouv.fr), geo.gouv.fr, Open-Meteo, NASA
  EONET, BOAMP (marchés publics), Overpass/OSM, IGN apicarto (cadastre).
- **Optionnelles (clé utilisateur)** : Google Maps, Cesium ion, OpenAI,
  AISStream, FIRMS, TomTom, OpenSky, Launch Library 2.
- **reaserch-engine** : Crossref (retrieval), recherche web (agents).

## 10. Secrets / configuration à sécuriser

- ✅ **Vérifié (2026-09-04)** : le fichier `raw/identifiants_cognitorium*.json`
  signalé dans `CONSOLIDATION.md` a **été purgé** du dépôt — aucun secret en
  clair dans l'instantané actuel (grep `identifiant|password|api_key|secret|
  token` sur tout le repo : uniquement des mentions dans le code/doc). Par
  prudence, **rotation des identifiants** qui auraient pu transiter par Git
  recommandée (l'historique Git du proto en garde trace).
- Clé Gemini : côté serveur (OK), à passer par variables d'environnement
  vérifiées + `.env.example` déjà présent (contient `GEMINI_API_KEY=`).
- **Watchtower** : clés navigateur en `localStorage` ; `ALLOW_FRAMING=1`
  réservé aux previews intégrées (documenté).

## 11. Données existantes

- Profils humains réels (Näthan, Amélie, Gianni, Pierre) dans proto.
- Référentiel ROME (fiches + compétences + FORMACODE) généré par script.
- Catalogues : expériences cognitives, évaluations, outils, ressources savoirs.
- Base 42 champs (14 entrées) dans ETAT-DE-LART ; ontologie YAML dans HCSM.
- `raw/` : documents sources (CV, PDF, DOCX, XLSX) non traités.

## 12. Modèles IA utilisés

- Gemini (proto-cognitorium) — seul modèle réellement branché.
- Aucun modèle local / open source évalué à ce jour.
- Coût : à la requête, plafonnable (aucun plafond documenté dans le proto).

## 13. Coûts actuels

- Hébergement : 0 € (GitHub public, exécution locale).
- Watchtower : 0 € en mode gratuit.
- Seule dépense variable : API Gemini (proto). Montant réel **à mesurer**.

## 14. Technologies externes utilisées (récap)

React · Vite · TypeScript · Express · Three.js · CesiumJS · Tailwind ·
Gemini · Python · OpenStreetMap & écosystème OSM · IGN / data.gouv.fr · NASA
EONET · Open-Meteo · Crossref · Web Speech API.

## 15. Technologies externes potentiellement utiles (à évaluer)

PostGIS · pgvector · Neo4j / Apache AGE · MapLibre · FreeCAD / OpenCascade.js /
Replicad / JSCAD · OrcaSlicer / PrusaSlicer (headless) · Rapier / moteurs
physiques · LangGraph / CrewAI / AutoGen · modèles open source (Llama, Qwen,
Gemma) pour l'inférence locale · IGN Géoplateforme (ortho 20 cm, LiDAR HD,
BD TOPO 3D) · sentinelle Copernicus.

## 16. Doublons

1. **Trois bases de connaissances** : `psychologyAtlas`/`psyRefLibrary` (proto)
   vs `nodes_etat_art_psychologie.csv` (ETAT-DE-LART) vs ontologie `hcsm-v0.1.yaml`
   (HCSM) — même domaine (cognition), formats incompatibles.
2. **Deux représentations de l'état cognitif** : HCSM (scientifique) vs
   « carte d'identité cognitive T0 » d'intelTwin (heuristique) vs « capacités
   cognitives » du proto.
3. **Watchtower** : code dans `COGNITORIUM/watchtower-mods/` vs dépôt cible
   `watchtower` vide.
4. **Language-decoder / animation-chronos** : objets sans ancrage clair dans
   la vision (à rattacher ou archiver).

## 17. Fonctionnalités manquantes (vs vision)

Core unifié (User/Project/Object/Place/Task/Event) · base mémoire partagée ·
Skill Graph formalisé · World Graph · CAD · simulation · fabrication ·
orchestration multi-agents · authentification · CI/CD · observabilité ·
monitoring des coûts.

## 18. Risques

Voir `constitution/07-risks.md`. Spécifiques à l'audit : secrets exposés,
dispersion multi-dépôts, bases de connaissances non unifiées, dépendance
Gemini non abstraite.

## 19. Roadmap recommandée

Voir `constitution/04-roadmap.md`. Prochaine étape : **Phase 1 (Core)** après
validation de la matrice ci-dessous.

## 20. Architecture cible

Voir `constitution/03-architecture.md`. Cible : une source de vérité unique
(PostgreSQL + pgvector + PostGIS, graphe à décider) + fournisseurs abstraits
(LLM, 3D, GIS, simulation) + Core `User/Project/Knowledge/Skill/Object/Place/
Task/Event` + agents orchestrés.

---

## 21. Matrice Build / Buy / Wrap (Section 30 du brief)

Légende coût : 0 = déjà là / gratuit · « à mesurer » = à confirmer par recherche.

| Fonction | Existe chez nous | Existe ailleurs | Meilleure solution (reco v1) | Coût | Priorité |
| --- | --- | --- | --- | --- | --- |
| Skill Graph | Oui (proto, implicite) | Degreed, Lightcast, LinkedIn, Neo4j | Garder proto + **formaliser le modèle** (aligné HCSM) | 0 | P0 |
| CLE | Oui (PoC `learning/`) | Duolingo, Khan, ITS, xAPI/h5p | Continuer CLE + **schéma JSON versionné** | 0 | P0 |
| World Graph | Partiel (intelTwin, chantier) | Palantir, ArcGIS, PostGIS/Neo4j spatial | **PostGIS + graphe** (à décider, ADR-007) | à mesurer | P0 |
| Memory | Partiel (localStorage, JsonRunStore) | pgvector, Qdrant, Chroma, Neo4j | **PostgreSQL + pgvector** (à décider) | à mesurer | P0 |
| GIS | Oui (Cesium, sans clé) | Mapbox, MapLibre, PostGIS, IGN | Garder **Cesium + PostGIS + IGN** | 0 | P1 |
| 3D | Oui (Cesium globe, three.js graphe) | Three, Babylon, Unity/Unreal | Garder Cesium (monde) + three.js (objets) | 0 | P1 |
| Multi-agent | Partiel (reaserch-engine) | LangGraph, CrewAI, AutoGen, Agents SDK | **Orchestrateur léger maison** + framework à évaluer | à mesurer | P1 |
| CAD | Non | FreeCAD, OpenCascade.js, Replicad, JSCAD, Onshape | **WRAP Replicad / OpenCascade.js** (novice d'abord) | 0 (open source) | P1 |
| Simulation | Non | Omniverse, Isaac, Gazebo, EnergyPlus | **Sims ciblées** (coût, ombrage, flux) + moteur physique | à mesurer | P2 |
| Manufacturing | Non (import KML/GeoJSON, roadmap IFC) | OrcaSlicer, PrusaSlicer, Klipper, Bambu | **Intégrer un slicer open source** (WRAP) | 0 (open source) | P2 |

> Toutes les lignes « à mesurer / à décider » relèvent d'un **audit externe
> dédié** (Mission 002) avant toute décision d'architecture, conformément à la
> règle de recherche (`05-buy-build-wrap.md`).

---

## Conclusion de l'audit

- **Ce qui est solide** : proto-cognitorium (core applicatif), watchtower-mods
  (visualisation monde gratuite), HCSM (fondation scientifique), reaserch-engine
  (preuve/vérification).
- **Ce qui manque pour converger** : un **modèle de données unifié**, une
  **mémoire partagée**, l'**abstraction des fournisseurs** (LLM, 3D, GIS), et
  le **câblage** entre les dépôts.
- **Actions prioritaires immédiates** : (1) rotation des identifiants historiques
  du proto (aucun secret en clair actuellement — vérifié) ; (2) trancher
  ADR-007 (base mémoire) et ADR-008 (abstraction LLM) par recherche dédiée ;
  (3) définir le schéma du Core (Phase 1).

Aucune architecture n'a été modifiée. Prochaine étape proposée : **Mission 002
— audit externe des briques P0/P1** (base mémoire, graphe, CAD, agents).
